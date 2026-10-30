import { useState } from 'react';
import {
  Compass,
  Scale,
  Sparkles,
  Users,
  BarChart3,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Accessibility,
} from 'lucide-react';
import { KrakowChoroplethMap } from '../components/resident-mode/KrakowChoroplethMap';
import { WeightsConfiguratorPanel } from '../components/resident-mode/WeightsConfiguratorPanel';
import { DistrictRankingList } from '../components/resident-mode/DistrictRankingList';
import { DistrictComparisonView } from '../components/resident-mode/DistrictComparisonView';
import { CivicAccessibilityNavigator } from '../components/resident-mode/accessibility/CivicAccessibilityNavigator';
import { useTranslation } from '../i18n/I18nContext';
import { getShortDistrictName } from '../utils/districtLocalization';
import type {
  DistrictSummaryDto,
  DistrictsGeoJsonCollection,
  QualityWeights,
} from '../types/contracts';

interface ResidentModePageProps {
  geoJsonData: DistrictsGeoJsonCollection | null;
  rankedDistricts: DistrictSummaryDto[];
  weights: QualityWeights;
  activePresetId: string | null;
  selectedPrimaryId: number | null;
  selectedSecondaryId: number | null;
  activeTargetSlot: 1 | 2;
  onSetActiveTargetSlot: (slot: 1 | 2) => void;
  onChangeWeights: (newWeights: QualityWeights, presetId?: string | null) => void;
  onResetWeights: () => void;
  onSelectDistrict: (id: number) => void;
  onSelectPrimary: (id: number) => void;
  onSelectSecondary: (id: number) => void;
  onClearSelection: () => void;
}

export function ResidentModePage({
  geoJsonData,
  rankedDistricts,
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
  const { t, language, plural } = useTranslation();
  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(false);

  const topDistrict = rankedDistricts[0] ?? null;
  const totalCityPopulation = rankedDistricts.reduce((acc, d) => acc + d.totalPopulation, 0);

  const districtPluralForms: [string, string, string] =
    language === 'ua'
      ? ['Адміністративний Район', 'Адміністративні Райони', 'Адміністративних Районів']
      : language === 'en'
      ? ['Administrative District', 'Administrative Districts', 'Administrative Districts']
      : ['Dzielnica Administracyjna', 'Dzielnice Administracyjne', 'Dzielnic Administracyjnych'];

  const pillarPluralForms: [string, string, string] =
    language === 'ua'
      ? ['Стовп', 'Стовпи', 'Стовпів']
      : language === 'en'
      ? ['Pillar', 'Pillars', 'Pillars']
      : ['Filar', 'Filary', 'Filarów'];

  const scrollToWorkspace = () => {
    document.getElementById('resident-workspace')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToComparison = () => {
    document.getElementById('comparison-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAccessibility = () => {
    document.getElementById('accessibility-section')?.scrollIntoView({ behavior: 'smooth' });
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
            <path
              d="M200 120 C 340 180, 420 320, 560 300 C 640 290, 700 360, 790 340"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeDasharray="8 8"
            />
            <rect x="520" y="140" width="36" height="36" rx="8" stroke="white" strokeWidth="1.5" strokeDasharray="4 4" />
            <rect x="680" y="240" width="48" height="48" rx="10" stroke="#bae6fd" strokeWidth="1.5" />
            <circle cx="480" cy="270" r="6" fill="#38bdf8" />
            <circle cx="590" cy="180" r="8" fill="#bae6fd" />
            <circle cx="660" cy="310" r="5" fill="white" />
            <circle cx="730" cy="160" r="7" fill="#7dd3fc" />
          </svg>
        </div>

        {/* Foreground Content Container */}
        <div className="relative z-10 p-6 sm:p-8 lg:p-10 space-y-6">
          {/* Header Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/25 text-xs font-bold text-sky-100 tracking-wide shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-sky-300 animate-spin-slow" />
            <span>{t.hero.badge}</span>
          </div>

          {/* Main Title & Lead */}
          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.12]">
              {t.hero.titleLead}
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-sky-200 via-sky-100 to-white">
                {t.hero.titleAccent}
              </span>
            </h1>
            <p className="text-sm sm:text-base text-sky-100/90 leading-relaxed max-w-2xl font-normal">
              {t.hero.description}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={scrollToWorkspace}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-white text-blue-900 shadow-xl shadow-blue-950/20 hover:bg-sky-50 active:scale-98 transition transform cursor-pointer"
            >
              <Compass className="w-4 h-4 text-blue-600" />
              <span>{t.hero.ctaExplore}</span>
            </button>

            <button
              onClick={scrollToComparison}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 active:scale-98 text-white border border-white/20 backdrop-blur-md transition transform cursor-pointer"
            >
              <Scale className="w-4 h-4 text-sky-200" />
              <span>{t.hero.ctaCompare}</span>
            </button>

            <button
              onClick={scrollToAccessibility}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 active:scale-98 text-white border border-white/20 backdrop-blur-md transition transform cursor-pointer"
            >
              <Accessibility className="w-4 h-4 text-sky-200" />
              <span>{t.hero.ctaAccessibility}</span>
            </button>
          </div>

          {/* Real-Data Live Telemetry Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
            <div className="p-4 rounded-2xl bg-white/95 text-slate-900 backdrop-blur-md border border-white shadow-lg flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-blue-900 leading-none">
                  {rankedDistricts.length > 0 ? rankedDistricts.length : '18'}
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1">
                  {plural(rankedDistricts.length || 18, districtPluralForms)}
                </div>
                <div className="text-[11px] text-slate-500">{t.stats.districtsSub}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/95 text-slate-900 backdrop-blur-md border border-white shadow-lg flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-lg font-black text-slate-900 truncate leading-tight">
                  {topDistrict ? getShortDistrictName(topDistrict.districtName) : t.stats.loading}
                </div>
                <div className="text-xs font-bold text-blue-700 mt-0.5">
                  {t.stats.leaderLabel} ({topDistrict ? `${topDistrict.weightedQualityOfLifeIndex.toFixed(1)} ${t.stats.leaderPoints}` : '—'})
                </div>
                <div className="text-[11px] text-slate-500">{t.stats.leaderSub}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/95 text-slate-900 backdrop-blur-md border border-white shadow-lg flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-sky-700 leading-none">
                  {totalCityPopulation > 0
                    ? `${Math.round(totalCityPopulation / 1000)} ${t.stats.thousands}`
                    : '0'}
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1">{t.stats.populationLabel}</div>
                <div className="text-[11px] text-slate-500">{t.stats.populationSub}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/95 text-slate-900 backdrop-blur-md border border-white shadow-lg flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-indigo-700 leading-none">
                  8 {plural(8, pillarPluralForms)}
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1">{t.stats.datasetsCount}</div>
                <div className="text-[11px] text-slate-500">{t.stats.pillarsSub}</div>
              </div>
            </div>
          </div>

          {/* Centered "How does it work?" button placed symmetrically at the bottom */}
          <div className="flex justify-center pt-2">
            <button
              onClick={() => setShowHowItWorks((prev) => !prev)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-sky-300" />
              <span>{t.hero.howItWorksBtn}</span>
              {showHowItWorks ? (
                <ChevronUp className="w-3.5 h-3.5 text-sky-200" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-sky-200" />
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Expandable "How does it work?" Drawer placed below the Hero Card with smooth open & close animation */}
      <div className={`drawer-expandable ${showHowItWorks ? 'is-open' : ''}`}>
        <div className="overflow-hidden">
          <section
            aria-label="Jak działa indeks"
            className="rounded-3xl bg-white border border-blue-200 p-6 shadow-lg shadow-blue-900/5 space-y-4 text-slate-900"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-black text-sm text-slate-900">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>{t.hero.howItWorksTitle}</span>
              </div>
              <button
                onClick={() => setShowHowItWorks(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {t.hero.howItWorksClose}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 leading-relaxed">
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                <div className="font-extrabold text-blue-900 mb-1">
                  {t.hero.step1Title}
                </div>
                {t.hero.step1Desc}
              </div>
              <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100">
                <div className="font-extrabold text-sky-900 mb-1">
                  {t.hero.step2Title}
                </div>
                {t.hero.step2Desc}
              </div>
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                <div className="font-extrabold text-indigo-900 mb-1">
                  {t.hero.step3Title}
                </div>
                {t.hero.step3Desc}
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

      {/* Civic Accessibility & Barrier-Free Navigator */}
      <div id="accessibility-section" className="scroll-mt-20">
        <CivicAccessibilityNavigator onSelectDistrictOnMap={onSelectDistrict} />
      </div>
    </div>
  );
}
