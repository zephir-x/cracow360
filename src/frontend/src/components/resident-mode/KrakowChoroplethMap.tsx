import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import type { Layer, PathOptions, LeafletMouseEvent, LatLngBoundsExpression } from 'leaflet';
import type L from 'leaflet';
import type { Feature, Geometry } from 'geojson';
import { GitCompareArrows, Info, MapPin, Moon, Sun, X } from 'lucide-react';
import type {
  DistrictGeoJsonProperties,
  DistrictsGeoJsonCollection,
  DistrictSummaryDto,
} from '../../types/contracts';

export interface KrakowChoroplethMapProps {
  geoJsonData: DistrictsGeoJsonCollection | null;
  districts: DistrictSummaryDto[];
  selectedPrimaryId: number | null;
  selectedSecondaryId: number | null;
  activeTargetSlot?: 1 | 2;
  onSetActiveTargetSlot?: (slot: 1 | 2) => void;
  onSelectDistrict: (districtId: number) => void;
  onClearSelection: () => void;
}

/**
 * Returns the choropleth fill color (from warm amber/coral through sky blue to emerald)
 * based on the district's weighted Quality of Life Index (0-100 scale).
 */
export function getChoroplethColor(score: number): string {
  if (score >= 80) return '#059669'; // Emerald 600 - Bardzo wysoka
  if (score >= 74) return '#10b981'; // Emerald 500 - Wysoka
  if (score >= 68) return '#0284c7'; // Sky 600 (Kraków Blue) - Dobra
  if (score >= 62) return '#f59e0b'; // Amber 500 - Umiarkowana
  return '#f97316'; // Orange 500 - Wymaga inwestycji
}

/**
 * Returns a darker, harmonious border tone matching the district's active color palette
 * (deep emerald, deep krakow blue, warm dark amber, burnt orange) instead of plain black.
 */
export function getChoroplethHoverBorder(score: number): string {
  if (score >= 80) return '#064e3b'; // Emerald 900
  if (score >= 74) return '#065f46'; // Emerald 800
  if (score >= 68) return '#0369a1'; // Sky 700 / Ocean Blue
  if (score >= 62) return '#b45309'; // Amber 700
  return '#c2410c'; // Orange 700
}

function getShortDistrictName(fullName: string): string {
  return fullName.replace(/^Dzielnica\s+[IVXLCDM]+\s+/i, '').trim();
}

const KRAKOW_CENTER: [number, number] = [50.055, 20.005];

/**
 * Bounding box locked slightly beyond the administrative borders of Krakow
 * (Krakow spans Lat 49.9677..50.1261, Lng 19.7922..20.2173).
 */
const KRAKOW_MAX_BOUNDS: LatLngBoundsExpression = [
  [49.93, 19.72], // South-West corner
  [50.16, 20.28], // North-East corner
];

export function KrakowChoroplethMap({
  geoJsonData,
  districts,
  selectedPrimaryId,
  selectedSecondaryId,
  activeTargetSlot = 1,
  onSetActiveTargetSlot,
  onSelectDistrict,
  onClearSelection,
}: KrakowChoroplethMapProps) {
  const [hoveredDistrictId, setHoveredDistrictId] = useState<number | null>(null);
  const [darkMapMode, setDarkMapMode] = useState<boolean>(false);
  const geoJsonRef = useRef<L.GeoJSON | null>(null);

  // Fast lookup map: districtId -> { summary, rank (1..18) }
  const districtLookup = useMemo(() => {
    const sorted = [...districts].sort(
      (a, b) => b.weightedQualityOfLifeIndex - a.weightedQualityOfLifeIndex
    );
    const map = new Map<number, { data: DistrictSummaryDto; rank: number }>();
    sorted.forEach((d, index) => {
      map.set(d.districtId, { data: d, rank: index + 1 });
    });
    return map;
  }, [districts]);

  // Keep ref for dynamic tooltip lookups without re-creating layer
  const districtLookupRef = useRef(districtLookup);
  useEffect(() => {
    districtLookupRef.current = districtLookup;
  }, [districtLookup]);

  // Keep ref for district selection callback to prevent stale closure in Leaflet event listeners
  const onSelectDistrictRef = useRef(onSelectDistrict);
  useEffect(() => {
    onSelectDistrictRef.current = onSelectDistrict;
  }, [onSelectDistrict]);

  const primaryDistrict = selectedPrimaryId ? districtLookup.get(selectedPrimaryId)?.data : null;
  const secondaryDistrict = selectedSecondaryId ? districtLookup.get(selectedSecondaryId)?.data : null;

  // Dynamic style function for each GeoJSON district polygon
  const getFeatureStyle = (feature?: Feature<Geometry, DistrictGeoJsonProperties>): PathOptions => {
    const districtId = feature?.properties?.districtId;
    const entry = districtId ? districtLookup.get(districtId) : undefined;
    const score = entry?.data.weightedQualityOfLifeIndex ?? 65;

    const isPrimary = districtId === selectedPrimaryId;
    const isSecondary = districtId === selectedSecondaryId;
    const isHovered = districtId === hoveredDistrictId;

    if (isPrimary) {
      return {
        fillColor: getChoroplethColor(score),
        fillOpacity: 0.82,
        color: '#1d4ed8', // Royal Blue 700 border for District #1
        weight: isHovered ? 4.5 : 4,
        dashArray: '',
      };
    }

    if (isSecondary) {
      return {
        fillColor: getChoroplethColor(score),
        fillOpacity: 0.82,
        color: '#4338ca', // Indigo 700 border for District #2
        weight: isHovered ? 4.5 : 4,
        dashArray: '',
      };
    }

    if (isHovered) {
      return {
        fillColor: getChoroplethColor(score),
        fillOpacity: 0.82,
        color: getChoroplethHoverBorder(score), // Darker harmonious tint of the district's tier
        weight: 3.5,
        dashArray: '',
      };
    }

    return {
      fillColor: getChoroplethColor(score),
      fillOpacity: 0.56,
      color: '#ffffff', // Crisp white district borders
      weight: 2,
      dashArray: '',
    };
  };

  // Perform lightweight style update on existing SVG paths without destroying/recreating DOM nodes
  useEffect(() => {
    if (geoJsonRef.current) {
      geoJsonRef.current.setStyle((feature) =>
        getFeatureStyle(feature as Feature<Geometry, DistrictGeoJsonProperties> | undefined)
      );
    }
  });

  // Attach mouseover, mouseout, click, and dynamic tooltip to each district polygon
  const onEachFeature = (
    feature: Feature<Geometry, DistrictGeoJsonProperties>,
    layer: Layer
  ) => {
    const districtId = feature.properties.districtId;

    // Use dynamic string evaluation so tooltips always reflect current weights without re-binding
    layer.bindTooltip(
      () => {
        const entry = districtLookupRef.current.get(districtId);
        const scoreText = entry
          ? `${entry.data.weightedQualityOfLifeIndex.toFixed(1)} / 100 pkt (#${entry.rank})`
          : 'Brak danych';

        return `<div style="font-family: system-ui, sans-serif; padding: 3px 6px;">
          <div style="font-weight: 800; font-size: 13px; color: #0f172a;">${feature.properties.districtName}</div>
          <div style="font-size: 12px; color: #1d4ed8; font-weight: 700;">Indeks Jakości Życia: ${scoreText}</div>
          <div style="font-size: 11px; color: #475569;">Kliknij, aby wybrać do porównania</div>
        </div>`;
      },
      { sticky: true, direction: 'top', opacity: 0.98 }
    );

    layer.on({
      mouseover: (e: LeafletMouseEvent) => {
        setHoveredDistrictId(districtId);
        e.target.bringToFront();
      },
      mouseout: () => {
        setHoveredDistrictId((prev) => (prev === districtId ? null : prev));
      },
      click: () => {
        onSelectDistrictRef.current(districtId);
      },
    });
  };

  return (
    <div
      className={`relative w-full h-162.5 rounded-3xl overflow-hidden border border-blue-100 bg-white shadow-xl shadow-blue-900/5 ${
        darkMapMode ? 'krakow-dark-tiles' : 'krakow-light-tiles'
      }`}
    >
      {/* Top Floating Pill Bar: Icon + Interactive District Slot Buttons (#1 & #2) */}
      <div className="absolute top-4 left-14 max-w-[calc(100%-4.5rem)] z-1000 pointer-events-none flex items-center overflow-hidden">
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto bg-white/95 backdrop-blur-md border border-blue-100 rounded-2xl px-2 sm:px-2.5 py-1.5 shadow-lg shadow-blue-950/10 max-w-full overflow-hidden">
          <div
            className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0"
            title="Porównywarka dwóch dzielnic"
          >
            <GitCompareArrows className="w-4 h-4" />
          </div>

          {/* Slot #1 Interactive Button */}
          <button
            type="button"
            onClick={() => onSetActiveTargetSlot?.(1)}
            className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl text-xs font-semibold border shrink min-w-0 max-w-37.5 sm:max-w-50 transition-all duration-200 cursor-pointer ${
              activeTargetSlot === 1
                ? 'bg-blue-100/95 border-blue-500 text-blue-950 ring-2 ring-blue-600 ring-offset-1 shadow-sm font-bold'
                : primaryDistrict
                ? 'bg-blue-50/70 border-blue-200 text-blue-900 hover:bg-blue-100/70 hover:border-blue-300'
                : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
            }`}
            title={
              activeTargetSlot === 1
                ? 'Slot #1 jest aktywny: kliknięcie dzielnicy ustawi tę pozycję'
                : 'Kliknij, aby przełączyć modyfikację na Dzielnicę #1'
            }
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                activeTargetSlot === 1
                  ? 'bg-blue-600 ring-2 ring-blue-300 animate-pulse'
                  : primaryDistrict
                  ? 'bg-blue-600'
                  : 'bg-slate-300'
              }`}
            />
            {primaryDistrict ? (
              <span className="truncate">
                #1: <strong>{getShortDistrictName(primaryDistrict.districtName)}</strong> ({primaryDistrict.weightedQualityOfLifeIndex.toFixed(1)} pkt)
              </span>
            ) : (
              <span className="truncate">Wybierz 1. dzielnicę</span>
            )}
          </button>

          {/* Slot #2 Interactive Button */}
          <button
            type="button"
            onClick={() => onSetActiveTargetSlot?.(2)}
            className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl text-xs font-semibold border shrink min-w-0 max-w-37.5 sm:max-w-50 transition-all duration-200 cursor-pointer ${
              activeTargetSlot === 2
                ? 'bg-indigo-100/95 border-indigo-500 text-indigo-950 ring-2 ring-indigo-600 ring-offset-1 shadow-sm font-bold'
                : secondaryDistrict
                ? 'bg-indigo-50/70 border-indigo-200 text-indigo-900 hover:bg-indigo-100/70 hover:border-indigo-300'
                : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
            }`}
            title={
              activeTargetSlot === 2
                ? 'Slot #2 jest aktywny: kliknięcie dzielnicy ustawi tę pozycję'
                : 'Kliknij, aby przełączyć modyfikację na Dzielnicę #2'
            }
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                activeTargetSlot === 2
                  ? 'bg-indigo-600 ring-2 ring-indigo-300 animate-pulse'
                  : secondaryDistrict
                  ? 'bg-indigo-600'
                  : 'bg-slate-300'
              }`}
            />
            {secondaryDistrict ? (
              <span className="truncate">
                #2: <strong>{getShortDistrictName(secondaryDistrict.districtName)}</strong> ({secondaryDistrict.weightedQualityOfLifeIndex.toFixed(1)} pkt)
              </span>
            ) : (
              <span className="truncate">Wybierz 2. dzielnicę</span>
            )}
          </button>

          {(primaryDistrict || secondaryDistrict) && (
            <button
              onClick={onClearSelection}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer shrink-0 ml-0.5"
              title="Wyczyść zaznaczenie obu dzielnic"
            >
              <X className="w-3.5 h-3.5" />
              Wyczyść
            </button>
          )}
        </div>
      </div>

      {/* Bottom-Left: Map Theme Switcher (Light Kraków Civic vs Dark Night Mode) */}
      <div className="absolute bottom-4 left-4 z-1000 pointer-events-auto">
        <button
          onClick={() => setDarkMapMode((prev) => !prev)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold bg-white/95 backdrop-blur-md border border-blue-100 text-slate-700 hover:text-blue-700 hover:border-blue-300 shadow-lg shadow-blue-950/10 transition cursor-pointer"
          title="Przełącz podkład mapy (Jasny Krakowski / Ciemny)"
        >
          {darkMapMode ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              Podkład: Ciemny
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-blue-600" />
              Podkład: Jasny
            </>
          )}
        </button>
      </div>

      {/* Bottom-Right Legend: Choropleth Color Scale */}
      <div className="absolute bottom-4 right-4 z-1000 pointer-events-auto bg-white/95 backdrop-blur-md border border-blue-100 rounded-2xl p-3.5 shadow-lg shadow-blue-950/10">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800 mb-2">
          <Info className="w-3.5 h-3.5 text-blue-600" />
          Indeks Jakości Życia (0–100 pkt)
        </div>
        <div className="space-y-1.5 text-[11px] text-slate-600 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#059669] inline-block shadow-2xs" />
            <span>80 – 100 pkt (Bardzo wysoki)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#10b981] inline-block shadow-2xs" />
            <span>74 – 79.9 pkt (Wysoki)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#0284c7] inline-block shadow-2xs" />
            <span>68 – 73.9 pkt (Dobry)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#f59e0b] inline-block shadow-2xs" />
            <span>62 – 67.9 pkt (Umiarkowany)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#f97316] inline-block shadow-2xs" />
            <span>&lt; 62 pkt (Wymaga inwestycji)</span>
          </div>
        </div>
      </div>

      {/* Leaflet Map Canvas locked strictly to the Krakow metropolitan area */}
      <MapContainer
        center={KRAKOW_CENTER}
        zoom={11}
        minZoom={11}
        maxZoom={16}
        maxBounds={KRAKOW_MAX_BOUNDS}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {geoJsonData && (
          <GeoJSON
            key={darkMapMode ? 'krakow-dark' : 'krakow-light'}
            ref={geoJsonRef}
            data={geoJsonData}
            style={(feature) =>
              getFeatureStyle(feature as Feature<Geometry, DistrictGeoJsonProperties> | undefined)
            }
            onEachFeature={(feature, layer) =>
              onEachFeature(feature as Feature<Geometry, DistrictGeoJsonProperties>, layer)
            }
          />
        )}
      </MapContainer>

      {!geoJsonData && (
        <div className="absolute inset-0 z-500 flex items-center justify-center bg-white/80 backdrop-blur-xs">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
            <MapPin className="w-4 h-4 text-blue-600 animate-bounce" />
            Ładowanie granic wektorowych 18 dzielnic Krakowa...
          </div>
        </div>
      )}
    </div>
  );
}
