import { useState } from 'react';
import {
  ArrowDownRight,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Compass,
  GitCompareArrows,
  HelpCircle,
  MapPin,
  Trophy,
  Users,
} from 'lucide-react';
import { DistrictComparisonView } from '../components/resident-mode/DistrictComparisonView';
import { DistrictRankingList } from '../components/resident-mode/DistrictRankingList';
import { KrakowChoroplethMap } from '../components/resident-mode/KrakowChoroplethMap';
import { WeightsConfiguratorPanel } from '../components/resident-mode/WeightsConfiguratorPanel';
import type {
  DistrictsGeoJsonCollection,
  DistrictSummaryDto,
  QualityWeights,
} from '../types/contracts';

export interface ResidentModePageProps {
  rankedDistricts: DistrictSummaryDto[];
  geoJsonData: DistrictsGeoJsonCollection | null;
  weights: QualityWeights;
  activePresetId: string | null;
  selectedPrimaryId: number | null;
  selectedSecondaryId: number | null;
  activeTargetSlot: 1 | 2;
  onSetActiveTargetSlot: (slot: 1 | 2) => void;
  onChangeWeights: (newWeights: QualityWeights, presetId?: string | null) => void;
  onResetWeights: () => void;
  onSelectDistrict: (districtId: number) => void;
  onSelectPrimary: (id: number) => void;
  onSelectSecondary: (id: number) => void;
  onClearSelection: () => void;
}

export function ResidentModePage({
  rankedDistricts,
  geoJsonData,
  weights,
  activePresetId,
  selectedPrimaryId,
  selectedSecondaryId,
  activeTargetSlot,
  onSetActiveTargetSlot,
  onChangeWeights,
  onResetWeights,
  onSelectDistrict,
  onSelectPrimary,
  onSelectSecondary,
  onClearSelection,
}: ResidentModePageProps) {
  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(false);

  const topDistrict = rankedDistricts[0] ?? null;
  const totalCityPopulation = rankedDistricts.reduce((acc, d) => acc + d.totalPopulation, 0);

  const scrollToWorkspace = () => {
    document.getElementById('resident-workspace')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToComparison = () => {
    document.getElementById('comparison-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner – Kraków Blue & White palette and animated graphics */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#0a2e65] via-[#1d4ed8] to-[#0284c7] text-white shadow-2xl shadow-blue-950/15 border border-blue-400/30">
        {/* Animated Background Vector Shapes & Glowing Orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-20 w-96 h-96 rounded-full bg-sky-300/20 blur-3xl animate-pulse-glow" />
          <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-blue-300/15 blur-2xl animate-float-slow" />
          <div className="absolute -bottom-28 left-1/3 w-96 h-96 rounded-full bg-indigo-400/20 blur-3xl" />

          {/* Decorative Architectural & Topographic SVG Illustration on the Right */}
          <svg
            className="absolute right-0 bottom-0 h-full w-full lg:w-3/5 opacity-25 pointer-events-none"
            viewBox="0 0 800 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="620" cy="210" r="190" stroke="white" strokeWidth="1.5" strokeDasharray="6 6" />
            <circle cx="620" cy="210" r="135" stroke="#bae6fd" strokeWidth="2" />
            <circle cx="620" cy="210" r="80" fill="white" fillOpacity="0.08" stroke="white" strokeWidth="1.5" />
            {/* Stylized Vistula River & District Grid Nodes */}
            <path
              d="M330 60 C 430 140, 480 260, 620 210 C 700 180, 740 240, 790 200"
              stroke="#7dd3fc"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="465" cy="185" r="7" fill="#ffffff" />
            <circle cx="555" cy="222" r="6" fill="#38bdf8" />
            <circle cx="620" cy="210" r="9" fill="#ffffff" stroke="#0284c7" strokeWidth="3" />
            <circle cx="695" cy="198" r="6" fill="#bae6fd" />
          </svg>
        </div>

        {/* Hero Foreground Content */}
        <div className="relative z-10 px-6 sm:px-10 pt-8 sm:pt-10 pb-8 space-y-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-semibold text-sky-100">
              <Compass className="w-4 h-4 text-sky-300" />
              Tryb Mieszkańca • 8 Filarów Jakości Życia w 18 Dzielnicach
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight leading-[1.12] text-white">
              Razem odkrywamy
              <br />
              <span className="text-sky-200">najlepsze miejsce do życia w Krakowie.</span>
            </h1>

            <p className="text-sm sm:text-base text-blue-100/95 leading-relaxed max-w-xl">
              Dostosuj wagi 8 kluczowych wymiarów miejskich (w tym witalność demograficzną, bezpieczeństwo i rynek mieszkań) do własnych priorytetów. Sprawdzaj interaktywny kartogram 18 dzielnic w czasie rzeczywistym i analizuj twarde wskaźniki z oficjalnych rejestrów Otwartych Danych.
            </p>

            {/* Interactive CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={scrollToWorkspace}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-white text-blue-900 hover:bg-sky-50 shadow-lg shadow-blue-950/20 transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-blue-600" />
                Eksploruj Mapę i Ranking
                <ArrowDownRight className="w-4 h-4 text-blue-600" />
              </button>

              <button
                onClick={scrollToComparison}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-blue-500/30 hover:bg-blue-500/45 text-white border border-white/30 backdrop-blur-md transition cursor-pointer"
              >
                <GitCompareArrows className="w-4 h-4 text-sky-200" />
                Porównaj 2 Dzielnice
              </button>
            </div>
          </div>

          {/* Bottom Floating Glassmorphic Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
            <div className="p-4 rounded-2xl bg-white/95 text-slate-900 backdrop-blur-md border border-white shadow-lg flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-blue-700 leading-none">18</div>
                <div className="text-xs font-bold text-slate-800 mt-1">Dzielnic Administracyjnych</div>
                <div className="text-[11px] text-slate-500">Pełny kartogram wektorowy</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/95 text-slate-900 backdrop-blur-md border border-white shadow-lg flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-lg font-black text-slate-900 truncate leading-tight">
                  {topDistrict ? topDistrict.districtName.replace('Dzielnica ', '') : 'Ładowanie...'}
                </div>
                <div className="text-xs font-bold text-blue-700 mt-0.5">
                  Lider dla Twoich wag ({topDistrict ? `${topDistrict.weightedQualityOfLifeIndex.toFixed(1)} pkt` : '—'})
                </div>
                <div className="text-[11px] text-slate-500">Dynamiczny ranking w czasie 0 ms</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/95 text-slate-900 backdrop-blur-md border border-white shadow-lg flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-sky-700 leading-none">
                  {totalCityPopulation > 0 ? `${Math.round(totalCityPopulation / 1000)} tys.` : '736 tys.'}
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1">Mieszkańców w bazie BDK</div>
                <div className="text-[11px] text-slate-500">Meldunki stałe, czasowe i cudzoziemcy</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/95 text-slate-900 backdrop-blur-md border border-white shadow-lg flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-indigo-700 leading-none">8 Filarów</div>
                <div className="text-xs font-bold text-slate-800 mt-1">30+ Zbiorów Danych</div>
                <div className="text-[11px] text-slate-500">Ceny, bezpieczeństwo, witalność, KMK i smog</div>
              </div>
            </div>
          </div>

          {/* Centered "Jak to działa?" button placed symmetrically at the bottom */}
          <div className="flex justify-center pt-2">
            <button
              onClick={() => setShowHowItWorks((prev) => !prev)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-md shadow-sm transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-sky-200" />
              Jak to działa? (Metodologia obliczeń)
              {showHowItWorks ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Expandable "Jak to działa?" Drawer with smooth open & close animation */}
      <div className={`drawer-expandable ${showHowItWorks ? 'is-open' : ''}`}>
        <div className="overflow-hidden">
          <section className="rounded-3xl bg-white border border-blue-200 p-6 shadow-lg shadow-blue-900/5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                Jak wyliczamy spersonalizowany Indeks Jakości Życia (0–100 pkt)?
              </h3>
              <button
                onClick={() => setShowHowItWorks(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Zamknij instrukcję
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 leading-relaxed">
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                <div className="font-extrabold text-blue-900 mb-1">
                  1. Normalizacja Min-Max (0–100 pkt)
                </div>
                Twarde dane miejskie (witalność demograficzna, ceny mieszkań, zdarzenia drogowe, KMK, parki i lasy, żłobki, biblioteki, CAS, smog i hałas) są przeliczane na obiektywną skalę 0–100 pkt w 8 kategoriach jakości życia.
              </div>
              <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100">
                <div className="font-extrabold text-sky-900 mb-1">
                  2. Twoje Wagi i Presety (0–10 pkt)
                </div>
                Ustawiasz wagi suwakami po lewej stronie lub wybierasz gotowy profil (Rodzina z Dziećmi, Student / Młody, Aktywny Senior, Inwestor / Biznes). Aplikacja mnoży 8 ocen każdej dzielnicy przez Twoje wagi w czasie 0 ms.
              </div>
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                <div className="font-extrabold text-indigo-900 mb-1">
                  3. Porównanie (Wykres Radarowy 8 Osi)
                </div>
                Kliknij dowolne 2 dzielnice na mapie lub liście rankingowej, aby nałożyć ich profile na 8-osiowy wykres radarowy i porównać twarde wskaźniki w tabeli poniżej.
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Main 3-Column Interactive Workspace: Left Configurator + Center Map + Right Ranking */}
      <section
        id="resident-workspace"
        className="grid grid-cols-1 xl:grid-cols-[325px_1fr_345px] gap-5 items-start scroll-mt-20"
      >
        {/* Left Panel: 6 Presets + 8 Category Sliders */}
        <div className="w-full">
          <WeightsConfiguratorPanel
            weights={weights}
            activePresetId={activePresetId}
            onChangeWeights={onChangeWeights}
            onResetWeights={onResetWeights}
          />
        </div>

        {/* Center Panel: Interactive 18-District GeoJSON Choropleth Map */}
        <div className="w-full min-w-0">
          <KrakowChoroplethMap
            geoJsonData={geoJsonData}
            districts={rankedDistricts}
            selectedPrimaryId={selectedPrimaryId}
            selectedSecondaryId={selectedSecondaryId}
            activeTargetSlot={activeTargetSlot}
            onSetActiveTargetSlot={onSetActiveTargetSlot}
            onSelectDistrict={onSelectDistrict}
            onClearSelection={onClearSelection}
          />
        </div>

        {/* Right Panel: Live-Sorted 18-District Ranking (#1 to #18) */}
        <div className="w-full">
          <DistrictRankingList
            districts={rankedDistricts}
            selectedPrimaryId={selectedPrimaryId}
            selectedSecondaryId={selectedSecondaryId}
            onSelectDistrict={onSelectDistrict}
          />
        </div>
      </section>

      {/* Side-by-Side District Comparison View: always accessible and displays empty/unfilled prompt on clear */}
      <div id="comparison-section" className="scroll-mt-20">
        <DistrictComparisonView
          districts={rankedDistricts}
          selectedPrimaryId={selectedPrimaryId}
          selectedSecondaryId={selectedSecondaryId}
          weights={weights}
          onSelectPrimary={onSelectPrimary}
          onSelectSecondary={onSelectSecondary}
          onClearSelection={onClearSelection}
        />
      </div>
    </div>
  );
}
