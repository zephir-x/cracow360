import { useMemo, useState } from 'react';
import { useTranslation } from '../i18n/I18nContext';
import { getLocalizedDatasetMetrics } from '../i18n/datasetsI18n';
import { ALL_DATA_SOURCES } from '../data/methodologyDataSources';
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
  Scale,
  Search,
} from 'lucide-react';

export interface AboutDataMethodologyPageProps {
  onBackToResidentMode: () => void;
}

const ITEMS_PER_PAGE = 10;

/// <summary>
/// Methodology & Open Data Sources documentation page presenting the two-stage
/// normalization formulation and the complete 1:1 city data registry with filtering.
/// </summary>
export function AboutDataMethodologyPage({
  onBackToResidentMode,
}: AboutDataMethodologyPageProps) {
  const { t, language, formatWithPlural } = useTranslation();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

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
    ];
  }, [t]);

  const filteredSources = ALL_DATA_SOURCES.filter((item) => {
    const matchesCategory =
      activeCategory === 'all' || item.category === activeCategory;
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
    if (status === 'Warstwa GIS') return t.methodology.statuses.gisLayer;
    if (status.includes('NBP') || status.includes('RCN')) return t.methodology.statuses.registryNbp;
    return status;
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#0a2e65] via-[#1d4ed8] to-[#0284c7] text-white p-8 sm:p-10 shadow-xl border border-blue-400/30">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-semibold text-sky-100">
            <BookOpen className="w-4 h-4 text-sky-300" />
            {t.methodology.badge}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            {t.methodology.titleLead}
            <br />
            <span className="text-sky-200">{t.methodology.titleAccent}</span>
          </h1>
          <p className="text-sm sm:text-base text-blue-100/95 leading-relaxed">
            {t.methodology.description}
          </p>
          <div className="pt-2">
            <button
              onClick={onBackToResidentMode}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-white text-blue-900 hover:bg-sky-50 shadow-lg transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-blue-600" />
              {t.methodology.backButton}
            </button>
          </div>
        </div>
      </section>

      {/* Two-Stage Mathematical Model Explanation */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-100 shadow-lg shadow-blue-900/5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                {t.methodology.step1Tag}
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
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

        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-100 shadow-lg shadow-blue-900/5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600">
                {t.methodology.step2Tag}
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                {t.methodology.step2Title}
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t.methodology.step2Desc}
          </p>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-blue-100 font-mono text-[11px] text-blue-900 text-center leading-relaxed">
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
        <div className="px-6 py-5 bg-linear-to-r from-blue-50/80 to-white border-b border-blue-100 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-600 text-white">
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
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              {formatWithPlural(ALL_DATA_SOURCES.length, t.methodology.datasetsPlural)}
            </span>
          </div>

          {/* Search bar and Category Pills */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pt-1">
            <div className="flex flex-col gap-2">
              {/* Row 1: 5 Category Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {categoryTabs.slice(0, 5).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => handleCategoryChange(tab.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
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

              {/* Row 2: 4 Category Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {categoryTabs.slice(5, 9).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => handleCategoryChange(tab.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
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

            <div className="relative min-w-60 shrink-0">
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

        {/* Datasets Table with Pagination */}
        <div
          key={`${activeCategory}-${currentPage}-${searchQuery}`}
          className="overflow-x-auto animate-fade-in"
        >
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
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

                  return (
                    <tr key={source.id} className="hover:bg-blue-50/40 transition">
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
                          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
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

        {/* Pagination Bar */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {t.methodology.showingPrefix} {startIndex + 1}–{endIndex} {t.methodology.ofPrefix} {filteredSources.length}{' '}
            {formatWithPlural(filteredSources.length, t.methodology.registryPlural)}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={validCurrentPage === 1}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> {t.methodology.prevPage}
            </button>
            <span className="text-xs font-bold text-slate-700 px-2">
              {validCurrentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={validCurrentPage >= totalPages}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
            >
              {t.methodology.nextPage} <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
