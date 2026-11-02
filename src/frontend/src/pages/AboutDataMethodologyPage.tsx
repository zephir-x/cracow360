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
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-4">
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

              {/* Category Pills */}
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
                  {categoryTabs.slice(5, 10).map((tab) => (
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
            </div>

            {/* Right Column: 49 Zbiorów Danych Pill -> Promoted Button -> Search */}
            <div className="flex flex-col sm:items-end justify-between gap-2.5 shrink-0 self-stretch sm:self-auto">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 self-start sm:self-end">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                {formatWithPlural(ALL_DATA_SOURCES.length, t.methodology.datasetsPlural)}
              </span>

              {/* Promoted Krakow Open Data Button in purple gradient */}
              <button
                onClick={() =>
                  handleCategoryChange(
                    activeCategory === 'krakow_open_data' ? 'all' : 'krakow_open_data'
                  )
                }
                title="otwartedane.um.krakow.pl"
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 shadow-xs self-start sm:self-end ${
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

        {/* Datasets Table with Pagination */}
        <div
          key={`${activeCategory}-${currentPage}-${searchQuery}`}
          className="overflow-x-auto animate-fade-in"
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

        {/* Pagination Controls – Identical Layout & Styling to Parent / Investor Mode */}
        <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 text-xs text-slate-500">
          <div>
            {t.methodology.showingPrefix} {filteredSources.length > 0 ? startIndex + 1 : 0}–{endIndex}{' '}
            {t.methodology.ofPrefix} {filteredSources.length}{' '}
            {plural(filteredSources.length, t.methodology.registryPlural)}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, Math.min(p, totalPages) - 1))}
                disabled={validCurrentPage === 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>{t.methodology.prevPage}</span>
              </button>

              <div className="flex items-center gap-1">
                {getPageNumbers(validCurrentPage, totalPages).map((p, idx) =>
                  typeof p === 'number' ? (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(p)}
                      className={`w-7 h-7 rounded-lg text-xs font-semibold transition cursor-pointer ${
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
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={validCurrentPage >= totalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium cursor-pointer"
              >
                <span>{t.methodology.nextPage}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
