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

          {/* Decorative Quality of Life (QoL) Computational Radar Ring, Vistula River Meander & Smart City Telemetry */}
          <svg
            className="absolute right-4 sm:right-8 lg:right-12 bottom-8 sm:bottom-12 lg:bottom-16 h-[82%] sm:h-[85%] lg:h-[88%] w-full lg:w-7/12 opacity-35 pointer-events-none select-none"
            viewBox="0 0 720 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="residentRadarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#818cf8" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.08" />
              </linearGradient>
              <linearGradient id="vistulaRiverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#7dd3fc" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
              </linearGradient>
              <radialGradient id="residentCoreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
                <stop offset="60%" stopColor="#1d4ed8" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#0a2e65" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Ambient Topographic Wave Radials (Left Fading Horizon) */}
            <path d="M 60 190 C 140 150, 220 230, 320 190 S 460 140, 620 170" stroke="#bae6fd" strokeWidth="1" strokeDasharray="6 4" strokeOpacity="0.25" fill="none" />
            <path d="M 100 230 C 180 180, 280 260, 400 210 S 520 170, 650 200" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.18" fill="none" />

            {/* Vistula River (Wisła) Dynamic S-Curve Waterway Weaving Gracefully Through The Landscape */}
            <g id="resident-vistula-stream">
              <path
                d="M 120 340 C 200 325, 260 375, 360 335 C 450 295, 490 320, 580 275 C 630 250, 660 260, 710 245"
                stroke="url(#vistulaRiverGrad)"
                strokeWidth="4.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 120 348 C 200 333, 260 383, 360 343 C 450 303, 490 328, 580 283 C 630 258, 660 268, 710 253"
                stroke="#bae6fd"
                strokeWidth="1.2"
                strokeDasharray="8 4"
                strokeOpacity="0.5"
                fill="none"
              />

              {/* River Bridge Nodes */}
              <line x1="290" y1="346" x2="302" y2="368" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="440" y1="305" x2="448" y2="327" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="540" y1="282" x2="547" y2="304" stroke="#fde047" strokeWidth="2.2" strokeLinecap="round" />
            </g>

            {/* Central Master Computational Circle / Quality of Life Polar HUD */}
            <g id="resident-computational-circle">
              {/* Outer Micro-Dashed Scale Orbit Ring */}
              <circle cx="520" cy="200" r="192" stroke="#bae6fd" strokeWidth="1" strokeDasharray="3 6" strokeOpacity="0.4" fill="none" />

              {/* Master Outer Precision Ring */}
              <circle cx="520" cy="200" r="185" stroke="#ffffff" strokeWidth="1.6" strokeDasharray="8 6" strokeOpacity="0.7" fill="none" />

              {/* Outer Angular Calibration Marks & Cardinal Labels */}
              <g id="resident-circle-angular-ticks">
                {/* 0° North */}
                <line x1="520" y1="12" x2="520" y2="24" stroke="#ffffff" strokeWidth="1.8" />
                <text x="520" y="32" fill="#bae6fd" fontSize="9" fontWeight="800" textAnchor="middle">000° N</text>

                {/* 90° East */}
                <line x1="708" y1="200" x2="696" y2="200" stroke="#ffffff" strokeWidth="1.8" />
                <text x="688" y="203" fill="#bae6fd" fontSize="9" fontWeight="800" textAnchor="end">090° E</text>

                {/* 180° South */}
                <line x1="520" y1="388" x2="520" y2="376" stroke="#ffffff" strokeWidth="1.8" />
                <text x="520" y="372" fill="#bae6fd" fontSize="9" fontWeight="800" textAnchor="middle">180° S</text>

                {/* 270° West */}
                <line x1="332" y1="200" x2="344" y2="200" stroke="#ffffff" strokeWidth="1.8" />
                <text x="352" y="203" fill="#bae6fd" fontSize="9" fontWeight="800" textAnchor="start">270° W</text>

                {/* Intermediate 30° / 45° Vernier Ticks */}
                <line x1="612" y1="40" x2="606" y2="50" stroke="#bae6fd" strokeWidth="1.2" strokeOpacity="0.7" />
                <line x1="680" y1="107" x2="671" y2="112" stroke="#bae6fd" strokeWidth="1.2" strokeOpacity="0.7" />
                <line x1="680" y1="293" x2="671" y2="288" stroke="#bae6fd" strokeWidth="1.2" strokeOpacity="0.7" />
                <line x1="612" y1="360" x2="606" y2="350" stroke="#bae6fd" strokeWidth="1.2" strokeOpacity="0.7" />
                <line x1="428" y1="360" x2="434" y2="350" stroke="#bae6fd" strokeWidth="1.2" strokeOpacity="0.7" />
                <line x1="360" y1="293" x2="369" y2="288" stroke="#bae6fd" strokeWidth="1.2" strokeOpacity="0.7" />
                <line x1="360" y1="107" x2="369" y2="112" stroke="#bae6fd" strokeWidth="1.2" strokeOpacity="0.7" />
                <line x1="428" y1="40" x2="434" y2="50" stroke="#bae6fd" strokeWidth="1.2" strokeOpacity="0.7" />
              </g>

              {/* Secondary Concentric Metric Segment Arc Ring */}
              <circle cx="520" cy="200" r="145" stroke="#38bdf8" strokeWidth="2" strokeDasharray="45 15 25 15 60 20" strokeLinecap="round" fill="none" />
              <circle cx="520" cy="200" r="130" stroke="#bae6fd" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.4" fill="none" />

              {/* Core Computational Orb & Glowing Center Hub */}
              <circle cx="520" cy="200" r="85" fill="url(#residentCoreGlow)" stroke="#38bdf8" strokeWidth="1.4" strokeOpacity="0.6" />
              <circle cx="520" cy="200" r="50" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.3" strokeDasharray="4 3" fill="none" />

              {/* Crosshair Cardinal Coordinate Guides */}
              <line x1="520" y1="70" x2="520" y2="330" stroke="#bae6fd" strokeWidth="0.8" strokeDasharray="2 3" strokeOpacity="0.4" />
              <line x1="390" y1="200" x2="650" y2="200" stroke="#bae6fd" strokeWidth="0.8" strokeDasharray="2 3" strokeOpacity="0.4" />

              {/* 5-Axis Quality of Life Pentagonal Radar Web */}
              <g id="resident-qol-radar-spider">
                {/* Pentagon Level 3 (100% capacity) */}
                <polygon points="520,115 601,174 570,269 470,269 439,174" stroke="#bae6fd" strokeWidth="1.2" strokeDasharray="4 3" strokeOpacity="0.5" fill="none" />
                {/* Pentagon Level 2 (66% capacity) */}
                <polygon points="520,145 572,183 552,244 488,244 468,183" stroke="#bae6fd" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.4" fill="none" />
                {/* Pentagon Level 1 (33% capacity) */}
                <polygon points="520,170 549,191 538,224 502,224 491,191" stroke="#bae6fd" strokeWidth="0.8" strokeDasharray="2 2" strokeOpacity="0.3" fill="none" />

                {/* 5 Radial Pillar Axes from Pivot */}
                <line x1="520" y1="200" x2="520" y2="115" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.6" />
                <line x1="520" y1="200" x2="601" y2="174" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.6" />
                <line x1="520" y1="200" x2="570" y2="269" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.6" />
                <line x1="520" y1="200" x2="470" y2="269" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.6" />
                <line x1="520" y1="200" x2="439" y2="174" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.6" />

                {/* High-Score Municipal Quality Polygon Overlay */}
                <polygon
                  points="520,122 594,176 568,264 480,256 444,176"
                  stroke="#38bdf8"
                  strokeWidth="2.2"
                  fill="url(#residentRadarGrad)"
                />

                {/* 5 Distinct Quality Pillar Vertex Beacon Nodes with Specialized Color Coding */}
                {/* 1. Bezpieczeństwo (Top) */}
                <circle cx="520" cy="122" r="4.5" fill="#34d399" stroke="#ffffff" strokeWidth="1.4" />
                {/* 2. Edukacja (Top-Right) */}
                <circle cx="594" cy="176" r="4.5" fill="#fde047" stroke="#ffffff" strokeWidth="1.4" />
                {/* 3. Zieleń i Środowisko (Bottom-Right) */}
                <circle cx="568" cy="264" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="1.4" />
                {/* 4. Mobilność i Transport (Bottom-Left) */}
                <circle cx="480" cy="256" r="4.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.4" />
                {/* 5. Usługi Miejskie (Top-Left) */}
                <circle cx="444" cy="176" r="4.5" fill="#f472b6" stroke="#ffffff" strokeWidth="1.4" />

                {/* Central Pivot Target Node */}
                <circle cx="520" cy="200" r="3.5" fill="#ffffff" />
                <circle cx="520" cy="200" r="8" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />
              </g>

              {/* Orbiting Satellite Telemetry Chip 1 (Top-Left) */}
              <g transform="translate(355, 75)">
                <rect x="0" y="0" width="96" height="22" rx="6" fill="#0a2e65" fillOpacity="0.8" stroke="#38bdf8" strokeWidth="1" />
                <circle cx="12" cy="11" r="3.5" fill="#34d399" />
                <text x="22" y="15" fill="#bae6fd" fontSize="9" fontWeight="800">QoL: 88.4 / 100</text>
              </g>

              {/* Orbiting Satellite Telemetry Chip 2 (Bottom-Left) */}
              <g transform="translate(325, 290)">
                <rect x="0" y="0" width="90" height="22" rx="6" fill="#0a2e65" fillOpacity="0.8" stroke="#bae6fd" strokeWidth="1" />
                <circle cx="12" cy="11" r="3.5" fill="#fde047" />
                <text x="22" y="15" fill="#ffffff" fontSize="9" fontWeight="800">18 DIS • LIVE</text>
              </g>

              {/* Orbiting Satellite Telemetry Chip 3 (Top-Right) */}
              <g transform="translate(595, 65)">
                <rect x="0" y="0" width="98" height="22" rx="6" fill="#0a2e65" fillOpacity="0.8" stroke="#38bdf8" strokeWidth="1" />
                <circle cx="12" cy="11" r="3.5" fill="#38bdf8" />
                <text x="22" y="15" fill="#bae6fd" fontSize="9" fontWeight="800">50.06°N 19.94°E</text>
              </g>
            </g>

            {/* Krakowski Szybki Tramwaj (Modern Articulated Tram & Curved Transit Rail) */}
            <g id="resident-tram-transit" transform="translate(140, 245)">
              {/* Curved Tram Railway Track Lines */}
              <path d="M 0 65 C 80 50, 160 80, 240 68 S 340 50, 420 58" stroke="#bae6fd" strokeWidth="1.8" strokeDasharray="6 4" strokeOpacity="0.6" fill="none" />
              <path d="M 0 71 C 80 56, 160 86, 240 74 S 340 56, 420 64" stroke="#bae6fd" strokeWidth="1.8" strokeDasharray="6 4" strokeOpacity="0.6" fill="none" />

              {/* Modern Articulated Krakow Tram */}
              <g transform="translate(110, 26)">
                {/* Pantograph (Odbierak prądu) */}
                <path d="M 38 12 L 48 0 L 58 12" stroke="#bae6fd" strokeWidth="1.5" fill="none" />
                <line x1="42" y1="0" x2="54" y2="0" stroke="#fde047" strokeWidth="2" />

                {/* Front Car */}
                <rect x="0" y="12" width="45" height="28" rx="4" stroke="#ffffff" strokeWidth="1.5" fill="#0284c7" fillOpacity="0.5" />
                <rect x="6" y="16" width="10" height="12" rx="1.5" stroke="#bae6fd" strokeWidth="1" fill="#bae6fd" fillOpacity="0.3" />
                <rect x="20" y="16" width="10" height="12" rx="1.5" stroke="#bae6fd" strokeWidth="1" fill="#bae6fd" fillOpacity="0.3" />
                {/* Aerodynamic Windshield */}
                <path d="M 34 16 L 42 20 L 42 28 L 34 28 Z" fill="#bae6fd" fillOpacity="0.4" stroke="#ffffff" strokeWidth="1" />
                {/* Headlight */}
                <circle cx="43" cy="34" r="2" fill="#fde047" />

                {/* Bellows */}
                <rect x="45" y="15" width="6" height="22" stroke="#bae6fd" strokeWidth="1" fill="#0a2e65" />

                {/* Rear Car */}
                <rect x="51" y="12" width="40" height="28" rx="4" stroke="#ffffff" strokeWidth="1.5" fill="#0284c7" fillOpacity="0.5" />
                <rect x="56" y="16" width="10" height="12" rx="1.5" stroke="#bae6fd" strokeWidth="1" fill="#bae6fd" fillOpacity="0.3" />
                <rect x="70" y="16" width="10" height="12" rx="1.5" stroke="#bae6fd" strokeWidth="1" fill="#bae6fd" fillOpacity="0.3" />

                {/* Wheels */}
                <circle cx="14" cy="42" r="3.5" fill="#ffffff" />
                <circle cx="32" cy="42" r="3.5" fill="#ffffff" />
                <circle cx="64" cy="42" r="3.5" fill="#ffffff" />
                <circle cx="82" cy="42" r="3.5" fill="#ffffff" />
              </g>
            </g>

            {/* Ambient Krakow Sparkles */}
            <g id="resident-ambient-sparkles">
              <path d="M 280 120 Q 280 130, 290 130 Q 280 130, 280 140 Q 280 130, 270 130 Q 280 130, 280 120 Z" fill="#bae6fd" fillOpacity="0.8" />
              <path d="M 640 310 Q 640 320, 650 320 Q 640 320, 640 330 Q 640 320, 630 320 Q 640 320, 640 310 Z" fill="#fde047" fillOpacity="0.9" />
              <path d="M 470 50 Q 470 58, 478 58 Q 470 58, 470 66 Q 470 58, 462 58 Q 470 58, 470 50 Z" fill="#38bdf8" fillOpacity="0.8" />
            </g>
          </svg>
        </div>

        {/* Foreground Content Container */}
        <div className="relative z-10 p-6 sm:p-8 lg:p-10 space-y-6 flex flex-col items-center sm:items-start text-center sm:text-left">
          {/* Header Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/25 text-xs font-bold text-sky-100 tracking-wide shadow-sm">
            <Compass className="w-3.5 h-3.5 text-sky-300 animate-spin-slow" />
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
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-3 pt-1 w-full">
            <button
              onClick={scrollToWorkspace}
              className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-white text-blue-900 shadow-xl shadow-blue-950/20 hover:bg-sky-50 active:scale-98 transition transform cursor-pointer"
            >
              <Compass className="w-4 h-4 text-blue-600" />
              <span>{t.hero.ctaExplore}</span>
            </button>

            <button
              onClick={scrollToComparison}
              className="flex-1 sm:flex-none justify-center inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 active:scale-98 text-white border border-white/20 backdrop-blur-md transition transform cursor-pointer"
            >
              <Scale className="w-4 h-4 text-sky-200" />
              <span>{t.hero.ctaCompare}</span>
            </button>

            <button
              onClick={scrollToAccessibility}
              className="flex-1 sm:flex-none justify-center inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 active:scale-98 text-white border border-white/20 backdrop-blur-md transition transform cursor-pointer"
            >
              <Accessibility className="w-4 h-4 text-sky-200" />
              <span>{t.hero.ctaAccessibility}</span>
            </button>
          </div>

          {/* Real-Data Live Telemetry Cards: 1 column per level on mobile for generous readability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 pt-2">
            <div className="p-4 rounded-2xl bg-white/95 text-slate-900 backdrop-blur-md border border-white shadow-lg flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="min-w-0">
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
                <div className="text-xs font-bold text-blue-700 mt-0.5 truncate">
                  {t.stats.leaderLabel} ({topDistrict ? `${topDistrict.weightedQualityOfLifeIndex.toFixed(1)} ${t.stats.leaderPoints}` : '—'})
                </div>
                <div className="text-[11px] text-slate-500">{t.stats.leaderSub}</div>
              </div>
            </div>

            <div
              title={t.stats.populationTooltip}
              className="p-4 rounded-2xl bg-white/95 text-slate-900 backdrop-blur-md border border-white shadow-lg flex items-center gap-3.5"
            >
              <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="min-w-0">
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
              <div className="min-w-0">
                <div className="text-2xl font-black text-indigo-700 leading-none">
                  8 {plural(8, pillarPluralForms)}
                </div>
                <div className="text-xs font-bold text-slate-800 mt-1">{t.stats.datasetsCount}</div>
                <div className="text-[11px] text-slate-500">{t.stats.pillarsSub}</div>
              </div>
            </div>
          </div>

          {/* Centered "How does it work?" button placed symmetrically at the bottom */}
          <div className="w-full flex justify-center pt-3 pb-1">
            <button
              onClick={() => setShowHowItWorks((prev) => !prev)}
              className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-md transition shadow-xs cursor-pointer active:scale-95"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 leading-relaxed text-center md:text-left">
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
        <div className="w-full order-2 xl:order-1">
          <WeightsConfiguratorPanel
            weights={weights}
            activePresetId={activePresetId}
            onChangeWeights={onChangeWeights}
            onResetWeights={onResetWeights}
          />
        </div>

        {/* Center Panel: Interactive 18-District GeoJSON Choropleth Map */}
        <div className="w-full min-w-0 order-1 xl:order-2">
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
        <div className="w-full order-3 xl:order-3">
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
