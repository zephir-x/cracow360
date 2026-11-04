import { useMemo, useState } from 'react';
import { useTranslation } from '../i18n/I18nContext';
import { getLocalizedDatasetMetrics } from '../i18n/modules';
import { ALL_DATA_SOURCES } from '../data/methodologyDataSources';
import { getPageNumbers } from '../components/parent-mode/childcare-forecast/types';
import {
  ArrowLeft,
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Database,
  ExternalLink,
  FileSpreadsheet,
  Landmark,
  Scale,
  Search,
} from 'lucide-react';

export interface AboutDataMethodologyPageProps {
  onBackToResidentMode: () => void;
}

const ITEMS_PER_PAGE = 10;

const isKrakowOpenDataUrl = (url: string): boolean =>
  url.includes('otwartedane.um.krakow.pl/zbiory-danych');

/// <summary>
/// Methodology & Open Data Sources documentation page presenting the two-stage
/// normalization formulation and the complete 1:1 city data registry with filtering.
/// </summary>
export function AboutDataMethodologyPage({
  onBackToResidentMode,
}: AboutDataMethodologyPageProps) {
  const { t, language, plural, formatWithPlural } = useTranslation();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const krakowOpenDataCount = useMemo(
    () => ALL_DATA_SOURCES.filter((s) => isKrakowOpenDataUrl(s.portalUrl)).length,
    []
  );

  const categoryTabs = useMemo(() => {
    const counts = ALL_DATA_SOURCES.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { key: 'all', label: t.methodology.categories.all, count: ALL_DATA_SOURCES.length },
      { key: 'housing', label: t.methodology.categories.housing, count: counts['housing'] || 0 },
      { key: 'safety', label: t.methodology.categories.safety, count: counts['safety'] || 0 },
      { key: 'transport', label: t.methodology.categories.transport, count: counts['transport'] || 0 },
      { key: 'greenery', label: t.methodology.categories.greenery, count: counts['greenery'] || 0 },
      { key: 'education', label: t.methodology.categories.education, count: counts['education'] || 0 },
      { key: 'culture', label: t.methodology.categories.culture, count: counts['culture'] || 0 },
      { key: 'demographics', label: t.methodology.categories.demographics, count: counts['demographics'] || 0 },
      { key: 'gis_env', label: t.methodology.categories.gis_env, count: counts['gis_env'] || 0 },
      { key: 'tourism', label: t.methodology.categories.tourism, count: counts['tourism'] || 0 },
    ];
  }, [t]);

  const filteredSources = ALL_DATA_SOURCES.filter((item) => {
    const isPromoted = isKrakowOpenDataUrl(item.portalUrl);
    const matchesCategory =
      activeCategory === 'all'
        ? true
        : activeCategory === 'krakow_open_data'
        ? isPromoted
        : item.category === activeCategory;
    const query = searchQuery.trim().toLowerCase();
    const localizedMetrics = getLocalizedDatasetMetrics(item.id, item.metrics, language).toLowerCase();
    const matchesQuery =
      query === '' ||
      item.officialDatasetName.toLowerCase().includes(query) ||
      item.metrics.toLowerCase().includes(query) ||
      localizedMetrics.includes(query);
    return matchesCategory && matchesQuery;
  });

  const totalPages = Math.max(1, Math.ceil(filteredSources.length / ITEMS_PER_PAGE));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredSources.length);
  const paginatedSources = filteredSources.slice(startIndex, endIndex);

  const handleCategoryChange = (key: string) => {
    setActiveCategory(key);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const getStatusLabel = (status: string): string => {
    if (status === 'Zintegrowane w ETL') return t.methodology.statuses.integrated;
    if (status === 'Opracowanie własne') return t.methodology.statuses.own;
    if (status === 'Transmisja Live API') return t.methodology.statuses.live;
    return status;
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#0a2e65] via-[#1d4ed8] to-[#0284c7] text-white p-5 sm:p-10 shadow-2xl shadow-blue-950/15 border border-blue-400/30">
        {/* Animated Background Vector Shapes & Ambient Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-20 w-96 h-96 rounded-full bg-sky-300/20 blur-3xl animate-pulse-glow" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-400/20 blur-3xl" />
          <div className="absolute -bottom-28 left-1/3 w-80 h-80 rounded-full bg-amber-300/10 blur-3xl" />

          {/* Bespoke Methodology, Open Knowledge Book & Data Architecture Vector Art */}
          <svg
            className="absolute right-0 bottom-0 h-full w-full lg:w-7/12 opacity-35 pointer-events-none select-none"
            viewBox="0 0 700 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="methodologyBookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
              </linearGradient>
            </defs>

            {/* Ground Baseline & Perspective Grid */}
            <line x1="80" y1="340" x2="680" y2="340" stroke="#bae6fd" strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="120" y1="315" x2="660" y2="315" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="6 6" />
            <line x1="180" y1="285" x2="640" y2="285" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.15" strokeDasharray="4 4" />

            {/* Stack of Municipal Methodology & Norms Volumes (Left side) */}
            <g id="methodology-book-stack" transform="translate(130, 240)">
              {/* Bottom Volume - Thick Comprehensive Folio */}
              <rect x="0" y="62" width="125" height="34" rx="5" stroke="#bae6fd" strokeWidth="1.5" fill="#ffffff" fillOpacity="0.08" />
              <line x1="16" y1="62" x2="16" y2="96" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="22" y1="62" x2="22" y2="96" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.5" />
              <line x1="38" y1="79" x2="108" y2="79" stroke="#bae6fd" strokeWidth="1.5" strokeDasharray="10 4" />

              {/* Middle Volume - Mathematical Normalization Standards */}
              <rect x="10" y="32" width="112" height="30" rx="5" stroke="#93c5fd" strokeWidth="1.5" fill="#38bdf8" fillOpacity="0.12" />
              <line x1="24" y1="32" x2="24" y2="62" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.8" />
              <line x1="40" y1="47" x2="102" y2="47" stroke="#93c5fd" strokeWidth="1.2" strokeDasharray="6 3" />

              {/* Top Volume - Open Data Registry Tome with Silk Bookmark */}
              <rect x="18" y="6" width="98" height="26" rx="4" stroke="#bae6fd" strokeWidth="1.5" fill="#ffffff" fillOpacity="0.08" />
              <line x1="30" y1="6" x2="30" y2="32" stroke="#38bdf8" strokeWidth="1.2" />
              <line x1="44" y1="19" x2="94" y2="19" stroke="#bae6fd" strokeWidth="1.2" strokeDasharray="8 3" />
              <path d="M 98 32 C 104 46, 110 52, 116 64 L 122 58 L 126 68 C 120 54, 112 46, 104 32 Z" fill="#fbbf24" fillOpacity="0.85" />
            </g>

            {/* Large Open Knowledge Tome / Methodology Codex (Centerpiece) */}
            <g id="open-codex">
              {/* Book Hardcover Base Plate */}
              <path
                d="M 270 326 C 320 316, 375 334, 420 330 C 465 334, 520 316, 570 326 L 566 333 C 516 323, 465 341, 420 337 C 375 341, 324 323, 274 333 Z"
                stroke="#bae6fd"
                strokeWidth="1.5"
                fill="#ffffff"
                fillOpacity="0.1"
              />

              {/* Left Open Page Block (Stacked Depth) */}
              <path
                d="M 420 318 C 375 323, 318 304, 276 313 L 276 218 C 318 209, 375 228, 420 223 Z"
                stroke="#bae6fd"
                strokeWidth="1.5"
                fill="#ffffff"
                fillOpacity="0.04"
              />
              <path
                d="M 420 322 C 375 327, 318 308, 280 317 L 280 222 C 318 213, 375 232, 420 227 Z"
                stroke="#bae6fd"
                strokeWidth="1.2"
                strokeOpacity="0.6"
              />

              {/* Right Open Page Block (Stacked Depth) */}
              <path
                d="M 420 318 C 465 323, 522 304, 564 313 L 564 218 C 522 209, 465 228, 420 223 Z"
                stroke="#bae6fd"
                strokeWidth="1.5"
                fill="#ffffff"
                fillOpacity="0.04"
              />
              <path
                d="M 420 322 C 465 327, 522 308, 560 317 L 560 222 C 522 213, 465 232, 420 227 Z"
                stroke="#bae6fd"
                strokeWidth="1.2"
                strokeOpacity="0.6"
              />

              {/* Center Binding Crease & Gilded Ribbon */}
              <line x1="420" y1="223" x2="420" y2="330" stroke="#bae6fd" strokeWidth="1.8" strokeOpacity="0.8" />
              <path
                d="M 420 223 C 424 250, 412 280, 426 332 C 432 346, 422 354, 428 364 L 435 358 L 442 364 C 436 350, 440 342, 432 332 C 422 280, 428 250, 422 223 Z"
                stroke="#fbbf24"
                strokeWidth="1.2"
                fill="#f59e0b"
                fillOpacity="0.4"
              />

              {/* Left Page Contents: Stage 1 Normalization Mathematical Model */}
              <rect x="296" y="234" width="46" height="4" rx="2" fill="#38bdf8" fillOpacity="0.8" />
              <line x1="296" y1="245" x2="398" y2="245" stroke="#bae6fd" strokeWidth="1.2" strokeDasharray="14 3 8 3" />
              <line x1="296" y1="253" x2="390" y2="253" stroke="#bae6fd" strokeWidth="1.2" strokeDasharray="10 3 16 3" />

              {/* Min-Max Normalization Curves on Left Page */}
              <path d="M 300 298 Q 345 285, 395 270" stroke="#34d399" strokeWidth="1.8" fill="none" />
              <circle cx="395" cy="270" r="2.5" fill="#34d399" />
              <path d="M 300 274 Q 345 288, 395 304" stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="3 2" fill="none" />
              <circle cx="300" cy="274" r="2.5" fill="#fbbf24" />
              <line x1="298" y1="266" x2="298" y2="306" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.5" />
              <line x1="298" y1="306" x2="400" y2="306" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.5" />

              {/* Right Page Contents: 49 Datasets Registry Matrix & Indicator Bars */}
              <rect x="442" y="234" width="102" height="34" rx="3" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.6" fill="#ffffff" fillOpacity="0.04" />
              <line x1="442" y1="244" x2="544" y2="244" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.4" />
              <line x1="472" y1="234" x2="472" y2="268" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.3" />
              <line x1="508" y1="234" x2="508" y2="268" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.3" />
              <line x1="442" y1="252" x2="544" y2="252" stroke="#bae6fd" strokeWidth="0.8" strokeOpacity="0.25" strokeDasharray="4 2" />
              <line x1="442" y1="260" x2="544" y2="260" stroke="#bae6fd" strokeWidth="0.8" strokeOpacity="0.25" strokeDasharray="4 2" />

              {/* 5 Indicator Pillar Mini-Bars on Bottom Right Page */}
              <rect x="448" y="284" width="11" height="22" rx="2" fill="#38bdf8" fillOpacity="0.4" stroke="#38bdf8" strokeWidth="1" />
              <rect x="466" y="278" width="11" height="28" rx="2" fill="#818cf8" fillOpacity="0.4" stroke="#818cf8" strokeWidth="1" />
              <rect x="484" y="272" width="11" height="34" rx="2" fill="#34d399" fillOpacity="0.4" stroke="#34d399" strokeWidth="1" />
              <rect x="502" y="280" width="11" height="26" rx="2" fill="#fbbf24" fillOpacity="0.4" stroke="#fbbf24" strokeWidth="1" />
              <rect x="520" y="288" width="11" height="18" rx="2" fill="#f472b6" fillOpacity="0.4" stroke="#f472b6" strokeWidth="1" />
            </g>

            {/* Open Data Repository / Database Storage Tower (Right side) */}
            <g id="database-storage-tower" transform="translate(590, 195)">
              {/* Top Tier */}
              <ellipse cx="36" cy="24" rx="34" ry="12" stroke="#bae6fd" strokeWidth="1.5" fill="#ffffff" fillOpacity="0.1" />
              <path d="M 2 24 L 2 54 C 2 62, 70 62, 70 54 L 70 24" stroke="#bae6fd" strokeWidth="1.5" fill="#38bdf8" fillOpacity="0.08" />
              <ellipse cx="36" cy="54" rx="34" ry="12" stroke="#bae6fd" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.6" />
              <circle cx="16" cy="38" r="2.5" fill="#34d399" />
              <circle cx="26" cy="38" r="2" fill="#bae6fd" />

              {/* Middle Tier */}
              <path d="M 2 54 L 2 84 C 2 92, 70 92, 70 84 L 70 54" stroke="#bae6fd" strokeWidth="1.5" fill="#38bdf8" fillOpacity="0.08" />
              <ellipse cx="36" cy="84" rx="34" ry="12" stroke="#bae6fd" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.6" />
              <circle cx="16" cy="68" r="2.5" fill="#38bdf8" />
              <circle cx="26" cy="68" r="2" fill="#bae6fd" />

              {/* Bottom Tier */}
              <path d="M 2 84 L 2 114 C 2 122, 70 122, 70 114 L 70 84" stroke="#bae6fd" strokeWidth="1.5" fill="#38bdf8" fillOpacity="0.08" />
              <ellipse cx="36" cy="114" rx="34" ry="12" stroke="#bae6fd" strokeWidth="1.5" />
              <circle cx="16" cy="98" r="2.5" fill="#fbbf24" />
              <circle cx="26" cy="98" r="2" fill="#bae6fd" />
            </g>

            {/* Normal Distribution / Gaussian Envelope */}
            <path
              d="M 210 145 C 300 145, 355 42, 420 42 C 485 42, 540 145, 630 145"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeDasharray="6 4"
              fill="none"
            />
            {/* Median & Dispersion Lines */}
            <line x1="420" y1="30" x2="420" y2="145" stroke="#bae6fd" strokeWidth="1.2" strokeDasharray="3 3" strokeOpacity="0.7" />
            <circle cx="420" cy="42" r="4.5" stroke="#fde047" strokeWidth="1.5" fill="#fde047" fillOpacity="0.3" />
            <circle cx="365" cy="95" r="3.5" fill="#bae6fd" />
            <circle cx="475" cy="95" r="3.5" fill="#bae6fd" />

            {/* Mathematical Sigma Summation Symbol (Σ) */}
            <path
              d="M 272 78 L 302 78 L 286 94 L 302 110 L 272 110"
              stroke="#bae6fd"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Mathematical Integral / Function Symbol */}
            <path
              d="M 536 68 C 530 60, 523 62, 523 72 L 523 100 C 523 110, 516 112, 510 104"
              stroke="#bae6fd"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Data Flow / ETL Pipeline Interconnection Rays */}
            <path d="M 302 94 C 342 108, 380 95, 420 42" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="4 3" strokeOpacity="0.6" fill="none" />
            <path d="M 420 42 C 460 70, 492 82, 523 72" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="4 3" strokeOpacity="0.6" fill="none" />
            <path d="M 523 100 C 560 125, 590 152, 626 195" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="4 3" strokeOpacity="0.6" fill="none" />

            {/* Stylized Sparkle & Data Node Pins */}
            <path d="M 224 180 Q 224 192, 236 192 Q 224 192, 224 204 Q 224 192, 212 192 Q 224 192, 224 180 Z" fill="#bae6fd" fillOpacity="0.85" />
            <path d="M 574 102 Q 574 112, 584 112 Q 574 112, 574 122 Q 574 112, 564 112 Q 574 112, 574 102 Z" fill="#fde047" fillOpacity="0.9" />

            <circle cx="168" cy="188" r="3" fill="#ffffff" />
            <circle cx="168" cy="188" r="7" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.6" />
            <circle cx="558" cy="168" r="3.5" fill="#fde047" />
            <circle cx="558" cy="168" r="8" stroke="#fde047" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.6" />
          </svg>
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 max-w-3xl space-y-4 flex flex-col items-center sm:items-start text-center sm:text-left mx-auto sm:mx-0">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-semibold text-sky-100">
            <BookOpen className="w-4 h-4 text-sky-300" />
            {t.methodology.badge}
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            {t.methodology.titleLead}
            <br />
            <span className="text-sky-200">{t.methodology.titleAccent}</span>
          </h1>
          <p className="text-xs sm:text-base text-blue-100/95 leading-relaxed max-w-2xl">
            {t.methodology.description}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onBackToResidentMode}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-white text-blue-900 hover:bg-sky-50 shadow-lg transition cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-blue-600" />
              {t.methodology.backButton}
            </button>
          </div>
        </div>
      </section>

      {/* Two-Stage Mathematical Model Explanation */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="p-5 sm:p-8 rounded-3xl bg-white border border-blue-100 shadow-lg shadow-blue-900/5 space-y-3.5 sm:space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                {t.methodology.step1Tag}
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                {t.methodology.step1Title}
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t.methodology.step1Desc}
          </p>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>{t.methodology.stimulantsTitle}</strong> {t.methodology.stimulantsDesc}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>{t.methodology.destimulantsTitle}</strong> {t.methodology.destimulantsDesc}
              </span>
            </li>
          </ul>
        </div>

        <div className="p-5 sm:p-8 rounded-3xl bg-white border border-blue-100 shadow-lg shadow-blue-900/5 space-y-3.5 sm:space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600">
                {t.methodology.step2Tag}
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                {t.methodology.step2Title}
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t.methodology.step2Desc}
          </p>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-blue-100 font-mono text-[10px] sm:text-[11px] text-blue-900 text-center leading-relaxed overflow-x-auto no-scrollbar">
            <div>{t.methodology.formulaIndex}</div>
            <div className="mt-1 font-semibold text-blue-700">{t.methodology.formulaDenominator}</div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t.methodology.step2Note}
          </p>
        </div>
      </section>

      {/* Complete Open Data Sources Registry Table with Filters */}
      <section className="rounded-3xl bg-white border border-blue-100 overflow-hidden shadow-xl shadow-blue-900/5">
        <div className="px-4 sm:px-6 py-4 sm:py-5 bg-linear-to-r from-blue-50/80 to-white border-b border-blue-100 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2.5 sm:gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-600 text-white shrink-0">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    {t.methodology.registryTitle}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {t.methodology.registrySubtitle}
                  </p>
                </div>
              </div>

              {/* Category Pills with horizontal swipe on mobile and clean wrap on desktop */}
              <div className="flex sm:flex-wrap items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                {categoryTabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => handleCategoryChange(tab.key)}
                    className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                      activeCategory === tab.key
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        activeCategory === tab.key
                          ? 'bg-blue-700 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Datasets Pill -> Promoted Button -> Search */}
            <div className="flex flex-col sm:items-end justify-between gap-2.5 shrink-0 self-stretch sm:self-auto">
              <span className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 self-center sm:self-end">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                {formatWithPlural(ALL_DATA_SOURCES.length, t.methodology.datasetsPlural)}
              </span>

              {/* Promoted Krakow Open Data Button in purple gradient */}
              <button
                type="button"
                onClick={() =>
                  handleCategoryChange(
                    activeCategory === 'krakow_open_data' ? 'all' : 'krakow_open_data'
                  )
                }
                title="otwartedane.um.krakow.pl"
                className={`w-full sm:w-auto px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center sm:justify-start gap-2 shadow-xs self-center sm:self-end ${
                  activeCategory === 'krakow_open_data'
                    ? 'bg-linear-to-r from-purple-600 via-fuchsia-600 to-indigo-600 text-white shadow-md shadow-purple-500/25 border border-purple-500 ring-2 ring-purple-300'
                    : 'bg-linear-to-r from-purple-50 via-fuchsia-50 to-indigo-50 text-purple-900 border border-purple-200 hover:from-purple-100 hover:via-fuchsia-100 hover:to-indigo-100 hover:border-purple-300'
                }`}
              >
                <Landmark
                  className={`w-3.5 h-3.5 ${
                    activeCategory === 'krakow_open_data' ? 'text-purple-200' : 'text-purple-600'
                  }`}
                />
                <span>{t.methodology.krakowOpenDataFilter}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    activeCategory === 'krakow_open_data'
                      ? 'bg-white/25 text-white'
                      : 'bg-purple-200/70 text-purple-900'
                  }`}
                >
                  {krakowOpenDataCount}
                </span>
              </button>

              <div className="relative min-w-60 w-full sm:w-auto">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t.methodology.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop View: Full-featured Table (hidden on mobile, visible from md: up) */}
        <div
          key={`desktop-${activeCategory}-${currentPage}-${searchQuery}`}
          className="hidden md:block overflow-x-auto animate-fade-in"
        >
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/90 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">{t.methodology.tableIndex}</th>
                <th className="py-3 px-4 w-48">{t.methodology.tableCategory}</th>
                <th className="py-3 px-4">{t.methodology.tableName}</th>
                <th className="py-3 px-4">{t.methodology.tableMetrics}</th>
                <th className="py-3 px-4 w-48 text-center">{t.methodology.tableStatus}</th>
                <th className="py-3 px-4 w-28 text-center">{t.methodology.tableSource}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSources.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                    {t.methodology.emptySearchResults}
                  </td>
                </tr>
              ) : (
                paginatedSources.map((source, index) => {
                  const globalIndex = startIndex + index + 1;
                  const localizedCategory = t.methodology.categories[source.category] || source.categoryLabel;
                  const localizedStatus = getStatusLabel(source.status);
                  const localizedMetrics = getLocalizedDatasetMetrics(source.id, source.metrics, language);
                  const isPromoted = isKrakowOpenDataUrl(source.portalUrl);

                  return (
                    <tr key={source.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-400 text-center">
                        {globalIndex}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {localizedCategory}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {source.officialDatasetName}
                      </td>
                      <td className="py-3 px-4 text-slate-600 leading-relaxed">
                        {localizedMetrics}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {localizedStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <a
                          href={source.portalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1 text-xs font-semibold transition ${
                            isPromoted
                              ? 'px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 shadow-2xs font-bold'
                              : 'text-blue-600 hover:text-blue-800 hover:underline'
                          }`}
                        >
                          {t.methodology.openLink} <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View: High-Legibility Dataset Cards (visible on mobile, hidden from md: up) */}
        <div
          key={`mobile-${activeCategory}-${currentPage}-${searchQuery}`}
          className="md:hidden p-3.5 space-y-3 animate-fade-in"
        >
          {filteredSources.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              {t.methodology.emptySearchResults}
            </div>
          ) : (
            paginatedSources.map((source, index) => {
              const globalIndex = startIndex + index + 1;
              const localizedCategory = t.methodology.categories[source.category] || source.categoryLabel;
              const localizedStatus = getStatusLabel(source.status);
              const localizedMetrics = getLocalizedDatasetMetrics(source.id, source.metrics, language);
              const isPromoted = isKrakowOpenDataUrl(source.portalUrl);

              return (
                <div
                  key={source.id}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-black flex items-center justify-center shrink-0">
                        #{globalIndex}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {localizedCategory}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {localizedStatus}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                      {source.officialDatasetName}
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-snug mt-1">
                      {localizedMetrics}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                    <a
                      href={source.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 text-xs font-bold transition ${
                        isPromoted
                          ? 'px-3 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 shadow-2xs'
                          : 'text-blue-600 hover:text-blue-800'
                      }`}
                    >
                      <span>{t.methodology.openLink}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Controls – Compact & Responsive */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 text-xs text-slate-500 text-center sm:text-left">
          <div>
            {t.methodology.showingPrefix} {filteredSources.length > 0 ? startIndex + 1 : 0}–{endIndex}{' '}
            {t.methodology.ofPrefix} {filteredSources.length}{' '}
            {plural(filteredSources.length, t.methodology.registryPlural)}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, Math.min(p, totalPages) - 1))}
                disabled={validCurrentPage === 1}
                className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.methodology.prevPage}</span>
              </button>

              <div className="flex items-center gap-1">
                {getPageNumbers(validCurrentPage, totalPages).map((p, idx) =>
                  typeof p === 'number' ? (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentPage(p)}
                      className={`w-7 h-7 rounded-lg text-xs font-semibold transition cursor-pointer active:scale-95 ${
                        validCurrentPage === p
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {p}
                    </button>
                  ) : (
                    <span key={idx} className="px-1 text-slate-400">
                      {p}
                    </span>
                  )
                )}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={validCurrentPage >= totalPages}
                className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium cursor-pointer active:scale-95"
              >
                <span className="hidden sm:inline">{t.methodology.nextPage}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
