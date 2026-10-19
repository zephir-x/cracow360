import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  CheckCircle2,
  Database,
  FileSpreadsheet,
  Layers,
  MapPin,
  RefreshCw,
  Server,
} from 'lucide-react';
import { cracow360Api } from './api/client';
import {
  DistrictComparisonView,
  DistrictRankingList,
  KrakowChoroplethMap,
  WeightsConfiguratorPanel,
} from './features/resident-mode';
import type {
  DistrictsGeoJsonCollection,
  DistrictSummaryDto,
  QualityWeights,
  SystemHelloDto,
} from './types/contracts';
import { calculateClientSideQualityIndex } from './utils/qualityIndexCalculator';

const DEFAULT_WEIGHTS: QualityWeights = {
  mobility: 5,
  education: 5,
  greenery: 5,
  culture: 5,
  environment: 5,
};

export function App() {
  const [hello, setHello] = useState<SystemHelloDto | null>(null);
  const [rawDistricts, setRawDistricts] = useState<DistrictSummaryDto[]>([]);
  const [geoJsonData, setGeoJsonData] = useState<DistrictsGeoJsonCollection | null>(null);

  const [weights, setWeights] = useState<QualityWeights>(DEFAULT_WEIGHTS);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  const [selectedPrimaryId, setSelectedPrimaryId] = useState<number | null>(5); // Default #1: Dzielnica V Krowodrza
  const [selectedSecondaryId, setSelectedSecondaryId] = useState<number | null>(4); // Default #2: Dzielnica IV Prądnik Biały

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const [helloData, districtsData, geoJson] = await Promise.all([
        cracow360Api.getSystemHello(),
        cracow360Api.getDistricts(),
        cracow360Api.getDistrictsGeoJson(),
      ]);
      setHello(helloData);
      setRawDistricts(districtsData);
      setGeoJsonData(geoJson);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Brak połączenia z backendem .NET 9 (upewnij się, że API działa na http://localhost:5000).'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchStatus();
  }, []);

  // Dynamically recompute weighted Quality of Life Index and sort all 18 districts in 0ms
  const rankedDistricts = useMemo(() => {
    return rawDistricts
      .map((d) => ({
        ...d,
        weightedQualityOfLifeIndex: calculateClientSideQualityIndex(d.scores, weights),
      }))
      .sort((a, b) => b.weightedQualityOfLifeIndex - a.weightedQualityOfLifeIndex);
  }, [rawDistricts, weights]);

  const handleWeightsChange = (newWeights: QualityWeights, presetId: string | null = null) => {
    setWeights(newWeights);
    setActivePresetId(presetId);
  };

  const handleResetWeights = () => {
    setWeights(DEFAULT_WEIGHTS);
    setActivePresetId(null);
  };

  // Toggle selection of District #1 (Primary) and District #2 (Secondary for comparison)
  const handleSelectDistrict = (districtId: number) => {
    if (selectedPrimaryId === districtId) {
      setSelectedPrimaryId(selectedSecondaryId);
      setSelectedSecondaryId(null);
      return;
    }
    if (selectedSecondaryId === districtId) {
      setSelectedSecondaryId(null);
      return;
    }
    if (selectedPrimaryId === null) {
      setSelectedPrimaryId(districtId);
    } else {
      setSelectedSecondaryId(districtId);
    }
  };

  const handleClearSelection = () => {
    setSelectedPrimaryId(null);
    setSelectedSecondaryId(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/75 backdrop-blur px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-[1100]">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              Kraków360{' '}
              <span className="text-xs font-medium px-2 py-0.5 ml-2 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Open Data App 2026
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              System Analizy Jakości Życia, Dostępności Usług i Predykcji Rozwoju Miejskiego
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hello?.databaseConnected ? (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
              Backend &amp; SQLite Online ({hello.seededDistrictsCount} dzielnic)
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              <Activity className="w-4 h-4" />
              {loading ? 'Łączenie z API...' : 'Oczekiwanie na Backend API'}
            </span>
          )}

          <button
            onClick={() => void fetchStatus()}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-sky-400' : ''}`} />
            Odśwież API
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-[1440px] w-full mx-auto p-6 space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs">
            <strong>Błąd połączenia:</strong> {error}
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-white">
              Moduł 1: Tryb Mieszkańca – Indeks Jakości Życia (Poziom Makro: Porównanie 18 Dzielnic)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Dostosuj wagi 5 kategorii suwakami lub wybierz profil mieszkańca. Kartogram 18 dzielnic oraz lista rankingowa aktualizują się w czasie rzeczywistym.
            </p>
          </div>
        </div>

        {/* Main Workspace Grid: Left Configurator (3 cols) + Center Choropleth Map (6 cols) + Right Live Ranking (3 cols) */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          {/* Left Panel: 4 Presets + 5 Category Sliders */}
          <div className="xl:col-span-3">
            <WeightsConfiguratorPanel
              weights={weights}
              activePresetId={activePresetId}
              onChangeWeights={handleWeightsChange}
              onResetWeights={handleResetWeights}
            />
          </div>

          {/* Center Panel: Interactive 18-District GeoJSON Choropleth Map */}
          <div className="xl:col-span-6">
            <KrakowChoroplethMap
              geoJsonData={geoJsonData}
              districts={rankedDistricts}
              selectedPrimaryId={selectedPrimaryId}
              selectedSecondaryId={selectedSecondaryId}
              onSelectDistrict={handleSelectDistrict}
              onClearSelection={handleClearSelection}
            />
          </div>

          {/* Right Panel: Live-Sorted 18-District Ranking (#1 to #18) */}
          <div className="xl:col-span-3">
            <DistrictRankingList
              districts={rankedDistricts}
              selectedPrimaryId={selectedPrimaryId}
              selectedSecondaryId={selectedSecondaryId}
              onSelectDistrict={handleSelectDistrict}
            />
          </div>
        </section>

        {/* Step 4: Side-by-Side District Comparison View + Recharts RadarChart + Hard Metrics Table */}
        <DistrictComparisonView
          districts={rankedDistricts}
          selectedPrimaryId={selectedPrimaryId}
          selectedSecondaryId={selectedSecondaryId}
          weights={weights}
          onSelectPrimary={(id) => setSelectedPrimaryId(id)}
          onSelectSecondary={(id) => setSelectedSecondaryId(id)}
          onClearSelection={handleClearSelection}
        />

        {/* Open Data Sources & System Telemetry Strip */}
        {hello && (
          <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
              <Server className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-slate-400">Środowisko API (.NET 9)</div>
                <div className="text-sm font-semibold text-white mt-0.5">{hello.environment}</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Czas UTC: {new Date(hello.serverTimeUtc).toLocaleTimeString()}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
              <Database className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-slate-400">Warstwa Danych</div>
                <div className="text-sm font-semibold text-white mt-0.5">{hello.databaseProvider}</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Zaseedowane dzielnice: {hello.seededDistrictsCount} | POI: {hello.seededPoisCount}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
              <FileSpreadsheet className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-slate-400">Źródła Danych Publicznych</div>
                <div className="text-sm font-semibold text-white mt-0.5">
                  BDK UMK / MSIP / OSM / GIOŚ
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Pełny rejestr w Assets/Instructions/04_OPEN_DATA_SOURCES_REGISTRY.md
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
              <Layers className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-slate-400">Status Modułu 1</div>
                <div className="text-sm font-semibold text-emerald-400 mt-0.5">
                  Kroki 1–4 Zakończone (100%)
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Mapa GeoJSON + Suwaki + Ranking + RadarChart
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
