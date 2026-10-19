import { useMemo, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import type { Layer, PathOptions, LeafletMouseEvent, LatLngBoundsExpression } from 'leaflet';
import type { Feature, Geometry } from 'geojson';
import { GitCompareArrows, Info, MapPin, Moon, Sun, X } from 'lucide-react';
import type {
  DistrictGeoJsonProperties,
  DistrictsGeoJsonCollection,
  DistrictSummaryDto,
} from '../../../types/contracts';

export interface KrakowChoroplethMapProps {
  geoJsonData: DistrictsGeoJsonCollection | null;
  districts: DistrictSummaryDto[];
  selectedPrimaryId: number | null;
  selectedSecondaryId: number | null;
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
  onSelectDistrict,
  onClearSelection,
}: KrakowChoroplethMapProps) {
  const [hoveredDistrictId, setHoveredDistrictId] = useState<number | null>(null);
  const [darkMapMode, setDarkMapMode] = useState<boolean>(false);

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

  const hoveredInfo = hoveredDistrictId ? districtLookup.get(hoveredDistrictId) : null;
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
        fillOpacity: 0.78,
        color: '#1d4ed8', // Royal Blue 700 border for District #1
        weight: 4,
        dashArray: '',
      };
    }

    if (isSecondary) {
      return {
        fillColor: getChoroplethColor(score),
        fillOpacity: 0.78,
        color: '#4338ca', // Indigo 700 border for District #2
        weight: 4,
        dashArray: '',
      };
    }

    if (isHovered) {
      return {
        fillColor: getChoroplethColor(score),
        fillOpacity: 0.75,
        color: '#0f172a',
        weight: 3,
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

  // Attach mouseover, mouseout, click, and tooltip to each district polygon
  const onEachFeature = (
    feature: Feature<Geometry, DistrictGeoJsonProperties>,
    layer: Layer
  ) => {
    const districtId = feature.properties.districtId;
    const entry = districtLookup.get(districtId);
    const scoreText = entry
      ? `${entry.data.weightedQualityOfLifeIndex.toFixed(1)} / 100 pkt (#${entry.rank})`
      : 'Brak danych';

    layer.bindTooltip(
      `<div style="font-family: system-ui, sans-serif; padding: 3px 6px;">
        <div style="font-weight: 800; font-size: 13px; color: #0f172a;">${feature.properties.districtName}</div>
        <div style="font-size: 12px; color: #1d4ed8; font-weight: 700;">Indeks Jakości Życia: ${scoreText}</div>
        <div style="font-size: 11px; color: #475569;">Kliknij, aby wybrać do porównania</div>
      </div>`,
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
        onSelectDistrict(districtId);
      },
    });
  };

  // Force GeoJSON layer re-bind when districts scores or selection changes
  const geoJsonKey = useMemo(() => {
    const scoresSignature = districts
      .map((d) => `${d.districtId}:${d.weightedQualityOfLifeIndex}`)
      .join('|');
    return `${scoresSignature}-${selectedPrimaryId ?? 0}-${selectedSecondaryId ?? 0}`;
  }, [districts, selectedPrimaryId, selectedSecondaryId]);

  return (
    <div
      className={`relative w-full h-[650px] rounded-3xl overflow-hidden border border-blue-100 bg-white shadow-xl shadow-blue-900/5 ${
        darkMapMode ? 'krakow-dark-tiles' : 'krakow-light-tiles'
      }`}
    >
      {/* Top Floating Pill Bar: Selected Districts (#1 & #2) + Map Style Toggle */}
      <div className="absolute top-4 left-14 right-4 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto bg-white/95 backdrop-blur-md border border-blue-100 rounded-2xl px-3.5 py-2 shadow-lg shadow-blue-950/10">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 mr-1">
            <GitCompareArrows className="w-4 h-4 text-blue-600" />
            Porównywarka:
          </span>

          {/* Slot #1 */}
          <div
            className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-xl text-xs font-semibold border ${
              primaryDistrict
                ? 'bg-blue-50 border-blue-300 text-blue-900'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            {primaryDistrict ? (
              <span>
                #1: <strong>{primaryDistrict.districtName}</strong> (
                {primaryDistrict.weightedQualityOfLifeIndex.toFixed(1)} pkt)
              </span>
            ) : (
              <span>Kliknij 1. dzielnicę</span>
            )}
          </div>

          {/* Slot #2 */}
          <div
            className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-xl text-xs font-semibold border ${
              secondaryDistrict
                ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
            {secondaryDistrict ? (
              <span>
                #2: <strong>{secondaryDistrict.districtName}</strong> (
                {secondaryDistrict.weightedQualityOfLifeIndex.toFixed(1)} pkt)
              </span>
            ) : (
              <span>Kliknij 2. dzielnicę</span>
            )}
          </div>

          {(primaryDistrict || secondaryDistrict) && (
            <button
              onClick={onClearSelection}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              title="Wyczyść zaznaczenie"
            >
              <X className="w-3.5 h-3.5" />
              Wyczyść
            </button>
          )}
        </div>

        {/* Map Theme Switcher (Light Kraków Civic vs Dark Night Mode) */}
        <button
          onClick={() => setDarkMapMode((prev) => !prev)}
          className="pointer-events-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold bg-white/95 backdrop-blur-md border border-blue-100 text-slate-700 hover:text-blue-700 hover:border-blue-300 shadow-lg shadow-blue-950/10 transition cursor-pointer"
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

      {/* Bottom-Left Hover HUD Card: Detailed live preview of hovered district */}
      {hoveredInfo && (
        <div className="absolute bottom-4 left-4 z-[1000] w-72 pointer-events-none bg-white/95 backdrop-blur-md border border-blue-200 rounded-2xl p-4 shadow-2xl shadow-blue-950/15">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Dzielnica {hoveredInfo.data.districtRoman} • #{hoveredInfo.rank}/18
            </span>
            <span className="text-xs font-medium text-slate-500">{hoveredInfo.data.areaKm2} km²</span>
          </div>
          <h4 className="text-sm font-extrabold text-slate-900 mt-2">
            {hoveredInfo.data.districtName}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Populacja:{' '}
            <strong className="text-slate-800">
              {hoveredInfo.data.totalPopulation.toLocaleString('pl-PL')}
            </strong>{' '}
            mieszk.
          </p>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Indeks Jakości Życia:</span>
            <span
              className="text-sm font-extrabold px-2.5 py-0.5 rounded-lg"
              style={{
                backgroundColor: `${getChoroplethColor(hoveredInfo.data.weightedQualityOfLifeIndex)}18`,
                color: getChoroplethColor(hoveredInfo.data.weightedQualityOfLifeIndex),
              }}
            >
              {hoveredInfo.data.weightedQualityOfLifeIndex.toFixed(1)} / 100
            </span>
          </div>

          <div className="mt-2.5 space-y-1 text-[11px] text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-500">Mobilność (KMK i Rower):</span>
              <span className="font-bold text-slate-800">
                {hoveredInfo.data.scores.mobilityScore} pkt
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Edukacja i Opieka:</span>
              <span className="font-bold text-slate-800">
                {hoveredInfo.data.scores.educationScore} pkt
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Zieleń i Rekreacja:</span>
              <span className="font-bold text-slate-800">
                {hoveredInfo.data.scores.greeneryScore} pkt
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Kultura i Społeczność:</span>
              <span className="font-bold text-slate-800">
                {hoveredInfo.data.scores.cultureAndSeniorScore} pkt
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Środowisko i Spokój:</span>
              <span className="font-bold text-slate-800">
                {hoveredInfo.data.scores.environmentScore} pkt
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom-Right Legend: Choropleth Color Scale */}
      <div className="absolute bottom-4 right-4 z-[1000] pointer-events-auto bg-white/95 backdrop-blur-md border border-blue-100 rounded-2xl p-3.5 shadow-lg shadow-blue-950/10">
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
            key={geoJsonKey}
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
        <div className="absolute inset-0 z-[500] flex items-center justify-center bg-white/80 backdrop-blur-xs">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
            <MapPin className="w-4 h-4 text-blue-600 animate-bounce" />
            Ładowanie granic wektorowych 18 dzielnic Krakowa...
          </div>
        </div>
      )}
    </div>
  );
}
