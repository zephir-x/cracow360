import { useMemo, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import type { Layer, PathOptions, LeafletMouseEvent } from 'leaflet';
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
 * Returns the choropleth fill color (from rose/red through amber to emerald)
 * based on the district's weighted Quality of Life Index (0-100 scale).
 */
export function getChoroplethColor(score: number): string {
  if (score >= 80) return '#10b981'; // Emerald 500 - Bardzo wysoka
  if (score >= 74) return '#22c55e'; // Green 500 - Wysoka
  if (score >= 68) return '#84cc16'; // Lime 500 - Dobra
  if (score >= 62) return '#eab308'; // Yellow/Amber 500 - Umiarkowana
  return '#f97316'; // Orange/Red 500 - Poniżej średniej
}

const KRAKOW_CENTER: [number, number] = [50.0614, 19.968];

export function KrakowChoroplethMap({
  geoJsonData,
  districts,
  selectedPrimaryId,
  selectedSecondaryId,
  onSelectDistrict,
  onClearSelection,
}: KrakowChoroplethMapProps) {
  const [hoveredDistrictId, setHoveredDistrictId] = useState<number | null>(null);
  const [darkMapMode, setDarkMapMode] = useState<boolean>(true);

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
        fillOpacity: 0.82,
        color: '#38bdf8', // Sky 400 border for District #1
        weight: 4,
        dashArray: '',
      };
    }

    if (isSecondary) {
      return {
        fillColor: getChoroplethColor(score),
        fillOpacity: 0.82,
        color: '#e879f9', // Fuchsia 400 border for District #2
        weight: 4,
        dashArray: '',
      };
    }

    if (isHovered) {
      return {
        fillColor: getChoroplethColor(score),
        fillOpacity: 0.78,
        color: '#f8fafc', // White highlight on hover
        weight: 3,
        dashArray: '',
      };
    }

    return {
      fillColor: getChoroplethColor(score),
      fillOpacity: 0.62,
      color: '#0f172a', // Deep slate border
      weight: 1.5,
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
      `<div style="font-family: system-ui, sans-serif; padding: 2px 4px;">
        <div style="font-weight: 700; font-size: 13px; color: #0f172a;">${feature.properties.districtName}</div>
        <div style="font-size: 12px; color: #0284c7; font-weight: 600;">Indeks Jakości Życia: ${scoreText}</div>
        <div style="font-size: 11px; color: #64748b;">Kliknij, aby wybrać do porównania</div>
      </div>`,
      { sticky: true, direction: 'top', opacity: 0.96 }
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
      className={`relative w-full h-[640px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl ${
        darkMapMode ? 'krakow-dark-tiles' : ''
      }`}
    >
      {/* Top Overlay: Selected Districts (#1 & #2) for Comparison + Dark/Light Map Toggle */}
      <div className="absolute top-4 left-14 right-4 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl px-3.5 py-2 shadow-lg">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 mr-1">
            <GitCompareArrows className="w-4 h-4 text-sky-400" />
            Porównywarka:
          </span>

          {/* Slot #1 */}
          <div
            className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-medium border ${
              primaryDistrict
                ? 'bg-sky-500/15 border-sky-400/50 text-sky-200'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-sky-400" />
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
            className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-medium border ${
              secondaryDistrict
                ? 'bg-fuchsia-500/15 border-fuchsia-400/50 text-fuchsia-200'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-fuchsia-400" />
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
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Wyczyść zaznaczenie"
            >
              <X className="w-3.5 h-3.5" />
              Wyczyść
            </button>
          )}
        </div>

        {/* Map Theme Switcher (Dark Smart City vs Standard OSM Light) */}
        <button
          onClick={() => setDarkMapMode((prev) => !prev)}
          className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-950/90 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 shadow-lg transition cursor-pointer"
          title="Przełącz podkład mapy (Tryb Ciemny / Jasny OpenStreetMap)"
        >
          {darkMapMode ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              Podkład: Ciemny
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-sky-400" />
              Podkład: Jasny
            </>
          )}
        </button>
      </div>

      {/* Bottom-Left Hover HUD Card: Detailed live preview of hovered district */}
      {hoveredInfo && (
        <div className="absolute bottom-4 left-4 z-[1000] w-72 pointer-events-none bg-slate-950/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
              Dzielnica {hoveredInfo.data.districtRoman} • Ranking #{hoveredInfo.rank}/18
            </span>
            <span className="text-xs text-slate-400">{hoveredInfo.data.areaKm2} km²</span>
          </div>
          <h4 className="text-sm font-bold text-white mt-2">{hoveredInfo.data.districtName}</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Populacja:{' '}
            <strong className="text-slate-200">
              {hoveredInfo.data.totalPopulation.toLocaleString('pl-PL')}
            </strong>{' '}
            mieszk.
          </p>

          <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300">Indeks Jakości Życia:</span>
            <span
              className="text-sm font-extrabold px-2 py-0.5 rounded"
              style={{
                backgroundColor: `${getChoroplethColor(hoveredInfo.data.weightedQualityOfLifeIndex)}25`,
                color: getChoroplethColor(hoveredInfo.data.weightedQualityOfLifeIndex),
              }}
            >
              {hoveredInfo.data.weightedQualityOfLifeIndex.toFixed(1)} / 100
            </span>
          </div>

          <div className="mt-2.5 space-y-1 text-[11px] text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Mobilność (KMK i Rower):</span>
              <span className="font-semibold">{hoveredInfo.data.scores.mobilityScore} pkt</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Edukacja i Opieka:</span>
              <span className="font-semibold">{hoveredInfo.data.scores.educationScore} pkt</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Zieleń i Rekreacja:</span>
              <span className="font-semibold">{hoveredInfo.data.scores.greeneryScore} pkt</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Kultura i Społeczność:</span>
              <span className="font-semibold">
                {hoveredInfo.data.scores.cultureAndSeniorScore} pkt
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Środowisko i Spokój:</span>
              <span className="font-semibold">{hoveredInfo.data.scores.environmentScore} pkt</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom-Right Legend: Choropleth Color Scale */}
      <div className="absolute bottom-4 right-4 z-[1000] pointer-events-auto bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-lg">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 mb-2">
          <Info className="w-3.5 h-3.5 text-sky-400" />
          Indeks Jakości Życia (0–100 pkt)
        </div>
        <div className="space-y-1 text-[11px] text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#10b981] inline-block" />
            <span>80 – 100 pkt (Bardzo wysoki)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#22c55e] inline-block" />
            <span>74 – 79.9 pkt (Wysoki)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#84cc16] inline-block" />
            <span>68 – 73.9 pkt (Dobry)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#eab308] inline-block" />
            <span>62 – 67.9 pkt (Umiarkowany)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#f97316] inline-block" />
            <span>&lt; 62 pkt (Wymaga inwestycji)</span>
          </div>
        </div>
      </div>

      {/* Leaflet Map Canvas using official key-less OpenStreetMap tiles */}
      <MapContainer
        center={KRAKOW_CENTER}
        zoom={11}
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
        <div className="absolute inset-0 z-[500] flex items-center justify-center bg-slate-950/60 backdrop-blur-xs">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <MapPin className="w-4 h-4 text-sky-400 animate-bounce" />
            Ładowanie granic wektorowych 18 dzielnic Krakowa (GeoJSON)...
          </div>
        </div>
      )}
    </div>
  );
}
