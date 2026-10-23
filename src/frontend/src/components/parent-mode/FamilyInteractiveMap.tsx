import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Compass, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Circle, MapContainer, Marker, TileLayer } from 'react-leaflet';
import { cracow360Api } from '../../api/client';
import { useTranslation } from '../../i18n/I18nContext';
import type { DistrictSummaryDto, PointOfInterestDto } from '../../types/contracts';
import type { ChildAgeCohort } from './FamilyAgeCohortSelector';
import {
  FamilyMapBasemapSwitcher,
  FamilyMapFilterBar,
  FamilyMapHintBanner,
  FamilyMapStaticLegend,
  MapClickHandler,
  MapViewportController,
} from './family-map/FamilyMapControls';
import { FamilyMapHud } from './family-map/FamilyMapHud';
import { getCachedClusterIcon, getCachedPoiIcon } from './family-map/familyMapIcons';
import {
  calculateDistanceMeters,
  deduplicateLocations,
  getPoiType,
  getRadiusLabels,
  type BufferStats,
  type DisplayPoi,
  type MapFilter,
} from './family-map/familyMapTypes';

export interface FamilyInteractiveMapProps {
  districts: DistrictSummaryDto[];
  selectedCohort?: ChildAgeCohort;
}

// Center point of Krakow (harmonized exactly with KrakowChoroplethMap)
const KRAKOW_CENTER: [number, number] = [50.055, 20.005];

// Bounding box locked strictly to Krakow administrative area
const KRAKOW_MAX_BOUNDS: L.LatLngBoundsExpression = [
  [49.93, 19.72],
  [50.16, 20.28],
];

export function FamilyInteractiveMap({
  districts,
  selectedCohort = 'all',
}: FamilyInteractiveMapProps) {
  const { language, t } = useTranslation();

  // Full raw and offset deduplicated POI datasets
  const [pois, setPois] = useState<DisplayPoi[]>([]);

  // Selected center coordinates for walking buffer
  const [selectedCenter, setSelectedCenter] = useState<[number, number] | null>(null);
  const [selectedPoi, setSelectedPoi] = useState<DisplayPoi | null>(null);

  // Target buffer radius: 300m (5 min), 500m (10 min), 1km (15 min)
  const [bufferRadius, setBufferRadius] = useState<300 | 500 | 1000>(500);

  // Smoothly animated radius in meters (morphed via requestAnimationFrame to avoid Leaflet SVG wheel glitches)
  const [animatedRadius, setAnimatedRadius] = useState<number>(500);
  const animFrameRef = useRef<number | null>(null);

  // Active layer filter: 'all' | 'nurseries' | 'kindergartens' | 'schools' | 'parks'
  const [activeFilter, setActiveFilter] = useState<MapFilter>('all');

  // Tile layer style
  const [darkMapMode, setDarkMapMode] = useState<boolean>(false);

  // Viewport tracking for culling & adaptive grid clustering
  const [viewportBounds, setViewportBounds] = useState<L.LatLngBounds | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(12);

  // Automatically adapt map layer filter when child age cohort changes
  useEffect(() => {
    if (selectedCohort === 'infant') {
      setActiveFilter('nurseries');
    } else if (selectedCohort === 'preschool') {
      setActiveFilter('kindergartens');
    } else if (selectedCohort === 'school') {
      setActiveFilter('schools');
    } else {
      setActiveFilter('all');
    }
  }, [selectedCohort]);

  // Smooth spring-like animation of walking buffer circle radius on radius changes
  useEffect(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    const startRadius = animatedRadius;
    const targetRadius = bufferRadius;

    if (Math.abs(startRadius - targetRadius) < 1) {
      setAnimatedRadius(targetRadius);
      return;
    }

    const duration = 400; // ms
    const startTime = performance.now();

    const animateStep = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out: 1 - pow(1 - x, 3)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = startRadius + (targetRadius - startRadius) * easeProgress;
      setAnimatedRadius(currentVal);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animateStep);
      } else {
        setAnimatedRadius(targetRadius);
      }
    };

    animFrameRef.current = requestAnimationFrame(animateStep);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [bufferRadius]);

  // Fetch verified municipal points of interest
  useEffect(() => {
    let cancelled = false;

    cracow360Api
      .getPois()
      .then((data: PointOfInterestDto[]) => {
        if (!cancelled) {
          const relevant = data.filter((p) =>
            [
              'NURSERY_PUBLIC',
              'NURSERY_CONTRACTED',
              'NURSERY_PRIVATE',
              'KIDS_CLUB',
              'PARENT_CLUB',
              'KINDERGARTEN',
              'PRIMARY_SCHOOL',
              'CITY_PARK',
              'POCKET_PARK',
            ].includes(p.subCategory)
          );
          setPois(deduplicateLocations(relevant));
        }
      })
      .catch((err: unknown) => {
        console.error('Failed to load POI database:', err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // District lookup map (id -> name)
  const districtNameMap = useMemo(() => {
    const map = new Map<number, string>();
    districts.forEach((d) => map.set(d.districtId, d.districtName));
    return map;
  }, [districts]);

  // Layer category filtering
  const visiblePois = useMemo(() => {
    if (activeFilter === 'all') return pois;
    return pois.filter((poi) => {
      const type = getPoiType(poi);
      if (activeFilter === 'nurseries') return type === 'nursery';
      if (activeFilter === 'kindergartens') return type === 'kindergarten';
      if (activeFilter === 'schools') return type === 'school';
      if (activeFilter === 'parks') return type === 'park';
      return true;
    });
  }, [pois, activeFilter]);

  // Dynamic real-time calculation of all facilities falling within the selected walking radius
  const bufferStats = useMemo<BufferStats | null>(() => {
    if (!selectedCenter) return null;

    let nurseries = 0;
    let kindergartens = 0;
    let schools = 0;
    let parks = 0;
    const matchedPois: DisplayPoi[] = [];

    pois.forEach((poi) => {
      const dist = calculateDistanceMeters(
        selectedCenter[0],
        selectedCenter[1],
        poi.lat,
        poi.lng
      );
      if (dist <= bufferRadius) {
        matchedPois.push(poi);
        const type = getPoiType(poi);
        if (type === 'nursery') nurseries++;
        else if (type === 'kindergarten') kindergartens++;
        else if (type === 'school') schools++;
        else if (type === 'park') parks++;
      }
    });

    return {
      nurseries,
      kindergartens,
      schools,
      parks,
      total: matchedPois.length,
      matchedPois,
    };
  }, [pois, selectedCenter, bufferRadius]);

  // Viewport culled and clustered items
  const displayItems = useMemo(() => {
    const inViewport = visiblePois.filter((poi) => {
      if (selectedCenter && bufferStats?.matchedPois.some((p) => p.id === poi.id)) {
        return true;
      }
      if (!viewportBounds) return true;
      return viewportBounds.contains([poi.displayLat, poi.displayLng]);
    });

    // At street-level zoom (>= 15), show all individual markers without clustering
    if (currentZoom >= 15) {
      return inViewport.map((poi) => ({ type: 'single' as const, poi }));
    }

    // Grid cell size in degrees
    const cellSize =
      currentZoom <= 11
        ? 0.04
        : currentZoom === 12
        ? 0.02
        : currentZoom === 13
        ? 0.012
        : 0.007;

    const grid = new Map<string, DisplayPoi[]>();
    const singles: DisplayPoi[] = [];

    for (const poi of inViewport) {
      const isSelected =
        (selectedPoi && selectedPoi.id === poi.id) ||
        (selectedCenter &&
          calculateDistanceMeters(
            selectedCenter[0],
            selectedCenter[1],
            poi.lat,
            poi.lng
          ) <= bufferRadius);

      if (isSelected) {
        singles.push(poi);
      } else {
        const cellX = Math.floor(poi.displayLng / cellSize);
        const cellY = Math.floor(poi.displayLat / cellSize);
        const cellKey = `${cellX}:${cellY}`;
        const list = grid.get(cellKey);
        if (list) {
          list.push(poi);
        } else {
          grid.set(cellKey, [poi]);
        }
      }
    }

    type Item =
      | { type: 'single'; poi: DisplayPoi }
      | { type: 'cluster'; id: string; lat: number; lng: number; count: number };

    const items: Item[] = singles.map((poi) => ({ type: 'single', poi }));

    for (const [cellKey, list] of grid.entries()) {
      if (list.length === 1) {
        items.push({ type: 'single', poi: list[0] });
      } else {
        let sLat = 0;
        let sLng = 0;
        for (const item of list) {
          sLat += item.displayLat;
          sLng += item.displayLng;
        }
        items.push({
          type: 'cluster',
          id: cellKey,
          lat: sLat / list.length,
          lng: sLng / list.length,
          count: list.length,
        });
      }
    }

    return items;
  }, [visiblePois, viewportBounds, currentZoom, selectedCenter, bufferRadius, selectedPoi, bufferStats]);

  // Marker & Map callbacks
  const handleSelectPoi = useCallback((poi: DisplayPoi) => {
    setSelectedCenter([poi.lat, poi.lng]);
    setSelectedPoi(poi);
  }, []);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setSelectedCenter([lat, lng]);
    setSelectedPoi(null);
  }, []);

  const handleResetBuffer = useCallback(() => {
    setSelectedCenter(null);
    setSelectedPoi(null);
  }, []);

  const handleViewportChange = useCallback((bounds: L.LatLngBounds, zoom: number) => {
    setViewportBounds(bounds);
    setCurrentZoom(zoom);
  }, []);

  // Counts for layer filter buttons
  const counts = useMemo(() => {
    const nurseries = pois.filter((p) => getPoiType(p) === 'nursery').length;
    const kindergartens = pois.filter((p) => getPoiType(p) === 'kindergarten').length;
    const schools = pois.filter((p) => getPoiType(p) === 'school').length;
    const parks = pois.filter((p) => getPoiType(p) === 'park').length;

    return {
      all: pois.length,
      nurseries,
      kindergartens,
      schools,
      parks,
    };
  }, [pois]);

  const currentRadiusLabels = useMemo(
    () => getRadiusLabels(bufferRadius, language),
    [bufferRadius, language]
  );

  return (
    <section className="rounded-3xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Section Header */}
      <div className="p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200/80 flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              {t.parent.familyMap.title}
            </h2>
            <p className="text-xs text-slate-500">
              {t.parent.familyMap.subtitle}
            </p>
          </div>
        </div>

        {/* Active buffer indicator pill in section header */}
        {selectedCenter && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-900 animate-fade-in self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>
              {t.parent.familyMap.bufferRadius}: {currentRadiusLabels.dist} ({currentRadiusLabels.time})
            </span>
            <button
              onClick={handleResetBuffer}
              className="ml-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
              title={t.parent.familyMap.resetBuffer}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Map Container */}
      <div
        className={`relative w-full h-155 overflow-hidden family-interactive-map ${
          darkMapMode ? 'krakow-dark-tiles' : 'krakow-light-tiles'
        }`}
      >
        {/* Top-Left Floating Controls: Filter Pills shifted left-14 to never collide with Leaflet +/- zoom buttons */}
        <FamilyMapFilterBar
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          counts={counts}
        />

        {/* Floating Click Instruction Banner (displayed when no buffer is active) */}
        {!selectedCenter && <FamilyMapHintBanner />}

        {/* Top-Right Floating Isochrone HUD Overlay */}
        {selectedCenter && bufferStats && (
          <FamilyMapHud
            selectedPoi={selectedPoi}
            bufferRadius={bufferRadius}
            setBufferRadius={setBufferRadius}
            bufferStats={bufferStats}
            districtNameMap={districtNameMap}
            onClose={handleResetBuffer}
          />
        )}

        {/* Bottom-Left: Map Theme Switcher */}
        <FamilyMapBasemapSwitcher
          darkMapMode={darkMapMode}
          setDarkMapMode={setDarkMapMode}
        />

        {/* Bottom-Right: Permanently Displayed Static Legend */}
        <FamilyMapStaticLegend bufferRadius={bufferRadius} />

        {/* React Leaflet Map Engine locked strictly to Krakow boundaries (matching KrakowChoroplethMap) */}
        <MapContainer
          center={KRAKOW_CENTER}
          zoom={12}
          minZoom={11}
          maxZoom={17}
          maxBounds={KRAKOW_MAX_BOUNDS}
          maxBoundsViscosity={1.0}
          scrollWheelZoom={true}
          className="w-full h-full z-0"
        >
          {/* Viewport tracking and click event handlers */}
          <MapViewportController onViewportChange={handleViewportChange} />
          <MapClickHandler onMapClick={handleMapClick} />

          {/* Official OpenStreetMap Foundation 100% Free Key-Less Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Dynamic Walking Buffer Circle Overlay with smooth radius interpolation */}
          {selectedCenter && (
            <Circle
              center={selectedCenter}
              radius={animatedRadius}
              pathOptions={{
                color: '#2563eb',
                fillColor: '#3b82f6',
                fillOpacity: 0.16,
                weight: 2,
                dashArray: '6 6',
                className: 'cracow-buffer-circle-animated',
              }}
            />
          )}

          {/* Render Clicked Center Pin if clicked on arbitrary map area */}
          {selectedCenter && !selectedPoi && (
            <Marker
              position={selectedCenter}
              icon={getCachedPoiIcon('center', 'activeSelected')}
            />
          )}

          {/* Clustered and Individual Markers */}
          {displayItems.map((item) => {
            if (item.type === 'cluster') {
              return (
                <Marker
                  key={`cluster-${item.id}`}
                  position={[item.lat, item.lng]}
                  icon={getCachedClusterIcon(item.count)}
                />
              );
            }

            const poi = item.poi;
            const isSelected = selectedPoi && selectedPoi.id === poi.id;
            const isInsideBuffer =
              selectedCenter &&
              calculateDistanceMeters(
                selectedCenter[0],
                selectedCenter[1],
                poi.lat,
                poi.lng
              ) <= bufferRadius;

            const highlightState = isSelected
              ? 'activeSelected'
              : isInsideBuffer
              ? 'insideBuffer'
              : 'default';

            return (
              <Marker
                key={poi.id}
                position={[poi.displayLat, poi.displayLng]}
                icon={getCachedPoiIcon(getPoiType(poi), highlightState)}
                eventHandlers={{
                  click: () => handleSelectPoi(poi),
                }}
              />
            );
          })}
        </MapContainer>
      </div>
    </section>
  );
}
