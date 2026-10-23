import { useEffect, useMemo, useState } from 'react';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import {
  ArrowLeftRight,
  Award,
  CheckCircle2,
  GitCompareArrows,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';
import { cracow360Api } from '../../api/client';
import type {
  DistrictDetailsDto,
  DistrictSummaryDto,
  QualityWeights,
} from '../../types/contracts';
import { calculateClientSideQualityIndex } from '../../utils/qualityIndexCalculator';
import { useTranslation } from '../../i18n/I18nContext';
import { localizeDistrictName } from '../../utils/districtLocalization';
import {
  buildComparisonMetricRows,
  getResidentStrengths,
  type MetricRowDef,
} from './comparison/comparisonMetrics';

export interface DistrictComparisonViewProps {
  districts: DistrictSummaryDto[];
  selectedPrimaryId: number | null;
  selectedSecondaryId: number | null;
  weights: QualityWeights;
  onSelectPrimary: (id: number) => void;
  onSelectSecondary: (id: number) => void;
  onClearSelection: () => void;
}

// Module-level permanent memory cache for all 18 districts (zero network delay on dropdown select)
const DISTRICT_DETAILS_CACHE = new Map<number, DistrictDetailsDto>();

export function DistrictComparisonView({
  districts,
  selectedPrimaryId,
  selectedSecondaryId,
  weights,
  onSelectPrimary,
  onSelectSecondary,
  onClearSelection,
}: DistrictComparisonViewProps) {
  const { t, language, formatWithPlural, plural } = useTranslation();
  const [cacheVersion, setCacheVersion] = useState<number>(0);

  // Background prefetch: loads all 18 district details once into module-level memory cache
  useEffect(() => {
    let cancelled = false;
    const prefetchAll = async () => {
      const missing = districts.filter((d) => !DISTRICT_DETAILS_CACHE.has(d.districtId));
      if (missing.length === 0) return;
      try {
        const results = await Promise.all(
          missing.map((d) => cracow360Api.getDistrictDetails(d.districtId))
        );
        if (!cancelled) {
          results.forEach((d) => DISTRICT_DETAILS_CACHE.set(d.districtId, d));
          setCacheVersion((v) => v + 1);
        }
      } catch {
        // Silently continue if background prefetching fails
      }
    };
    if (districts.length > 0) {
      void prefetchAll();
    }
    return () => {
      cancelled = true;
    };
  }, [districts]);

  // Synchronous cache retrieval for Slot 1 and Slot 2
  const firstDetails = useMemo(() => {
    return selectedPrimaryId ? DISTRICT_DETAILS_CACHE.get(selectedPrimaryId) ?? null : null;
  }, [selectedPrimaryId, cacheVersion]);

  const secondDetails = useMemo(() => {
    return selectedSecondaryId ? DISTRICT_DETAILS_CACHE.get(selectedSecondaryId) ?? null : null;
  }, [selectedSecondaryId, cacheVersion]);

  // Fallback network loading if a district was selected before prefetch finished
  useEffect(() => {
    if (selectedPrimaryId && !DISTRICT_DETAILS_CACHE.has(selectedPrimaryId)) {
      void cracow360Api.getDistrictDetails(selectedPrimaryId).then((d) => {
        DISTRICT_DETAILS_CACHE.set(selectedPrimaryId, d);
        setCacheVersion((v) => v + 1);
      });
    }
    if (selectedSecondaryId && !DISTRICT_DETAILS_CACHE.has(selectedSecondaryId)) {
      void cracow360Api.getDistrictDetails(selectedSecondaryId).then((d) => {
        DISTRICT_DETAILS_CACHE.set(selectedSecondaryId, d);
        setCacheVersion((v) => v + 1);
      });
    }
  }, [selectedPrimaryId, selectedSecondaryId]);

  // Dynamic client-side weighted score recalculation in 0ms (60 FPS slider updates)
  const firstWeightedScore = useMemo(() => {
    if (!firstDetails) return 0;
    return calculateClientSideQualityIndex(firstDetails.scores, weights);
  }, [firstDetails, weights]);

  const secondWeightedScore = useMemo(() => {
    if (!secondDetails) return 0;
    return calculateClientSideQualityIndex(secondDetails.scores, weights);
  }, [secondDetails, weights]);

  const localizedFirstDistrictName = useMemo(() => {
    return firstDetails ? localizeDistrictName(firstDetails.districtName, language) : '';
  }, [firstDetails, language]);

  const localizedSecondDistrictName = useMemo(() => {
    return secondDetails ? localizeDistrictName(secondDetails.districtName, language) : '';
  }, [secondDetails, language]);

  // Radar chart multi-dimensional overlay across 8 quality dimensions
  const radarData = useMemo(() => {
    if (!firstDetails || !secondDetails) return [];
    const name1 = localizedFirstDistrictName;
    const name2 = localizedSecondDistrictName;

    return [
      {
        pillar: t.comparison.radarAxes.mobility,
        [name1]: Number(firstDetails.scores.mobilityScore.toFixed(1)),
        [name2]: Number(secondDetails.scores.mobilityScore.toFixed(1)),
        fullMark: 100,
      },
      {
        pillar: t.comparison.radarAxes.education,
        [name1]: Number(firstDetails.scores.educationScore.toFixed(1)),
        [name2]: Number(secondDetails.scores.educationScore.toFixed(1)),
        fullMark: 100,
      },
      {
        pillar: t.comparison.radarAxes.greenery,
        [name1]: Number(firstDetails.scores.greeneryScore.toFixed(1)),
        [name2]: Number(secondDetails.scores.greeneryScore.toFixed(1)),
        fullMark: 100,
      },
      {
        pillar: t.comparison.radarAxes.culture,
        [name1]: Number(firstDetails.scores.cultureAndSeniorScore.toFixed(1)),
        [name2]: Number(secondDetails.scores.cultureAndSeniorScore.toFixed(1)),
        fullMark: 100,
      },
      {
        pillar: t.comparison.radarAxes.environment,
        [name1]: Number(firstDetails.scores.environmentScore.toFixed(1)),
        [name2]: Number(secondDetails.scores.environmentScore.toFixed(1)),
        fullMark: 100,
      },
      {
        pillar: t.comparison.radarAxes.safety,
        [name1]: Number(firstDetails.scores.safetyScore.toFixed(1)),
        [name2]: Number(secondDetails.scores.safetyScore.toFixed(1)),
        fullMark: 100,
      },
      {
        pillar: t.comparison.radarAxes.housing,
        [name1]: Number(firstDetails.scores.housingAffordabilityScore.toFixed(1)),
        [name2]: Number(secondDetails.scores.housingAffordabilityScore.toFixed(1)),
        fullMark: 100,
      },
      {
        pillar: t.comparison.radarAxes.demographics,
        [name1]: Number(firstDetails.scores.demographicVitalityScore.toFixed(1)),
        [name2]: Number(secondDetails.scores.demographicVitalityScore.toFixed(1)),
        fullMark: 100,
      },
    ];
  }, [firstDetails, secondDetails, localizedFirstDistrictName, localizedSecondDistrictName, t.comparison.radarAxes]);

  // Hard infrastructure, housing, safety & demographic metrics table rows with linguistically accurate plurals
  const metricRows: MetricRowDef[] = useMemo(() => {
    if (!firstDetails || !secondDetails) return [];
    return buildComparisonMetricRows(firstDetails, secondDetails, language, t.common.points);
  }, [firstDetails, secondDetails, language, t.common.points]);

  // Cached snapshot of active comparison to keep DOM intact during drawer collapse animation
  const [cachedComparison, setCachedComparison] = useState<{
    first: DistrictDetailsDto;
    second: DistrictDetailsDto;
    firstScore: number;
    secondScore: number;
    firstLocalizedName: string;
    secondLocalizedName: string;
    radar: typeof radarData;
    metrics: typeof metricRows;
  } | null>(null);

  useEffect(() => {
    if (firstDetails && secondDetails) {
      setCachedComparison({
        first: firstDetails,
        second: secondDetails,
        firstScore: firstWeightedScore,
        secondScore: secondWeightedScore,
        firstLocalizedName: localizedFirstDistrictName,
        secondLocalizedName: localizedSecondDistrictName,
        radar: radarData,
        metrics: metricRows,
      });
    }
  }, [firstDetails, secondDetails, firstWeightedScore, secondWeightedScore, localizedFirstDistrictName, localizedSecondDistrictName, radarData, metricRows]);

  const activeComparison = (firstDetails && secondDetails)
    ? {
        first: firstDetails,
        second: secondDetails,
        firstScore: firstWeightedScore,
        secondScore: secondWeightedScore,
        firstLocalizedName: localizedFirstDistrictName,
        secondLocalizedName: localizedSecondDistrictName,
        radar: radarData,
        metrics: metricRows,
      }
    : cachedComparison;

  const hasAnySelection = Boolean(selectedPrimaryId || selectedSecondaryId);
  const hasBothSelections = Boolean(selectedPrimaryId && selectedSecondaryId && firstDetails && secondDetails);
  const isComparisonOpen = Boolean(hasBothSelections);
  const numLocale = language === 'ua' ? 'uk-UA' : language === 'en' ? 'en-US' : 'pl-PL';

  return (
    <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-blue-100 p-6 sm:p-8 shadow-xl shadow-blue-900/5 space-y-6">
      {/* Header bar with dropdowns and clear button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
            <GitCompareArrows className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">
              {t.comparison.title}
            </h2>
            <p className="text-xs text-slate-500">
              {t.comparison.subtitle}
            </p>
          </div>
        </div>

        {hasAnySelection && (
          <button
            onClick={onClearSelection}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            {t.comparison.clearButton}
          </button>
        )}
      </div>

      {/* Selectors for District #1 and District #2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* District #1 Dropdown */}
        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-2">
          <label className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-md bg-blue-600 text-white text-[11px] font-extrabold flex items-center justify-center">
              1
            </span>
            {t.comparison.primaryDropdownLabel}
          </label>
          <select
            value={selectedPrimaryId ?? ''}
            onChange={(e) => onSelectPrimary(Number(e.target.value))}
            className="w-full text-xs font-semibold p-2.5 rounded-xl bg-white border border-blue-300 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="">{t.comparison.selectPrimaryPlaceholder}</option>
            {districts.map((d) => (
              <option key={d.districtId} value={d.districtId} disabled={d.districtId === selectedSecondaryId}>
                {localizeDistrictName(d.districtName, language)} ({d.weightedQualityOfLifeIndex.toFixed(1)} {t.common.points})
              </option>
            ))}
          </select>
        </div>

        {/* District #2 Dropdown */}
        <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 space-y-2">
          <label className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-md bg-indigo-600 text-white text-[11px] font-extrabold flex items-center justify-center">
              2
            </span>
            {t.comparison.secondaryDropdownLabel}
          </label>
          <select
            value={selectedSecondaryId ?? ''}
            onChange={(e) => onSelectSecondary(Number(e.target.value))}
            className="w-full text-xs font-semibold p-2.5 rounded-xl bg-white border border-indigo-300 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="">{t.comparison.selectSecondaryPlaceholder}</option>
            {districts.map((d) => (
              <option key={d.districtId} value={d.districtId} disabled={d.districtId === selectedPrimaryId}>
                {localizeDistrictName(d.districtName, language)} ({d.weightedQualityOfLifeIndex.toFixed(1)} {t.common.points})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* When 0 districts are selected: show the clean Empty State Prompt */}
      {!hasAnySelection ? (
        <div className="animate-fade-in p-8 sm:p-12 text-center rounded-2xl bg-slate-50/70 border border-dashed border-slate-300 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mx-auto shadow-xs">
            <GitCompareArrows className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-sm font-extrabold text-slate-800">
              {t.comparison.emptyPromptTitle}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t.comparison.emptyPromptDesc}
            </p>
          </div>
        </div>
      ) : (
        /* When at least 1 district is selected: render persistent Cards Grid so transition from 1 to 2 districts never jumps or glitches */
        <div className="space-y-4 animate-fade-in">
          {/* Helper hint when only 1 district is chosen */}
          {!hasBothSelections && (
            <div className="p-3.5 text-center rounded-2xl bg-blue-50/70 border border-blue-200 animate-fade-in">
              <div className="text-xs font-bold text-blue-900">
                {language === 'en'
                  ? `District selected (${localizedFirstDistrictName || localizedSecondDistrictName}). Choose a second district above or click on the map to expand comparison.`
                  : language === 'ua'
                  ? `Обрано 1-й район (${localizedFirstDistrictName || localizedSecondDistrictName}). Оберіть другий район угорі або на карті для повного зіставлення.`
                  : `Wybrano 1. dzielnicę (${localizedFirstDistrictName || localizedSecondDistrictName}). Wybierz drugą dzielnicę powyżej lub kliknij na mapie, aby rozsunąć pełne zestawienie.`}
              </div>
            </div>
          )}

          {/* Persistent Two-District Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Slot #1 Card */}
            {firstDetails ? (
              <div
                className={`p-5 rounded-2xl border transition-all duration-300 ${
                  hasBothSelections && firstWeightedScore >= secondWeightedScore
                    ? 'bg-blue-50/70 border-blue-400 shadow-md shadow-blue-600/10'
                    : 'bg-blue-50/40 border-blue-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">{t.comparison.slot1CardTitle}</span>
                    <h3 className="text-base font-black text-slate-900">{localizedFirstDistrictName}</h3>
                  </div>
                  {hasBothSelections && firstWeightedScore >= secondWeightedScore && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600 text-white text-[11px] font-bold shadow-xs animate-fade-in">
                      <Award className="w-3.5 h-3.5" />
                      {t.comparison.higherScoreBadge}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-blue-600">{firstWeightedScore.toFixed(1)}</span>
                  <span className="text-xs font-semibold text-slate-500">{t.comparison.scoreScale}</span>
                </div>

                {/* Resident strengths box (visible when comparing two districts) or standard metrics */}
                {hasBothSelections && secondDetails ? (
                  <div className="mt-3.5 p-3 rounded-xl bg-blue-100/40 border border-blue-200/70 animate-fade-in">
                    <div className="text-[11px] font-bold text-blue-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{t.comparison.strengthsTitle}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-700 leading-relaxed">
                      {getResidentStrengths(firstDetails, secondDetails, t, language)}
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 p-3 rounded-xl bg-blue-100/40 border border-blue-200/70 text-xs text-slate-700 leading-relaxed">
                    {t.comparison.densityLabel} <strong className="text-blue-950">{Math.round(firstDetails.demographics.totalPopulation / (firstDetails.areaKm2 || 1))} {t.comparison.densityUnit}</strong> • {t.comparison.populationLabel} <strong className="text-blue-950">{firstDetails.demographics.totalPopulation.toLocaleString(numLocale)}</strong>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 rounded-2xl border border-dashed border-blue-200 bg-white/60 flex flex-col items-center justify-center text-center space-y-2 min-h-44 transition-all">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-500">{t.comparison.slot1CardTitle}</span>
                <p className="text-xs text-slate-500 max-w-xs">{t.comparison.emptyPromptDesc}</p>
              </div>
            )}

            {/* Slot #2 Card */}
            {secondDetails ? (
              <div
                className={`p-5 rounded-2xl border transition-all duration-300 ${
                  hasBothSelections && secondWeightedScore >= firstWeightedScore
                    ? 'bg-indigo-50/70 border-indigo-400 shadow-md shadow-indigo-600/10'
                    : 'bg-indigo-50/40 border-indigo-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">{t.comparison.slot2CardTitle}</span>
                    <h3 className="text-base font-black text-slate-900">{localizedSecondDistrictName}</h3>
                  </div>
                  {hasBothSelections && selectedSecondaryId && secondWeightedScore >= firstWeightedScore && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-600 text-white text-[11px] font-bold shadow-xs animate-fade-in">
                      <Award className="w-3.5 h-3.5" />
                      {t.comparison.higherScoreBadge}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-indigo-600">{secondWeightedScore.toFixed(1)}</span>
                  <span className="text-xs font-semibold text-slate-500">{t.comparison.scoreScale}</span>
                </div>

                {/* Resident strengths box (visible when comparing two districts) or standard metrics */}
                {hasBothSelections && firstDetails ? (
                  <div className="mt-3.5 p-3 rounded-xl bg-indigo-100/40 border border-indigo-200/70 animate-fade-in">
                    <div className="text-[11px] font-bold text-indigo-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>{t.comparison.strengthsTitle}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-700 leading-relaxed">
                      {getResidentStrengths(secondDetails, firstDetails, t, language)}
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 p-3 rounded-xl bg-indigo-100/40 border border-indigo-200/70 text-xs text-slate-700 leading-relaxed">
                    {t.comparison.densityLabel} <strong className="text-indigo-950">{Math.round(secondDetails.demographics.totalPopulation / (secondDetails.areaKm2 || 1))} {t.comparison.densityUnit}</strong> • {t.comparison.populationLabel} <strong className="text-indigo-950">{secondDetails.demographics.totalPopulation.toLocaleString(numLocale)}</strong>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 rounded-2xl border border-dashed border-indigo-200 bg-white/60 flex flex-col items-center justify-center text-center space-y-2 min-h-44 transition-all">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-500">{t.comparison.slot2CardTitle}</span>
                <p className="text-xs text-slate-500 max-w-xs">{t.comparison.emptyPromptDesc}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Expandable Drawer: Radar Chart 8 Osi & Detailed Hard Data Table */}
      <div className={`drawer-expandable ${isComparisonOpen ? 'is-open' : ''}`}>
        <div className="overflow-hidden space-y-6 pt-1">
          {activeComparison && (
            <div className="space-y-6 pt-4 border-t border-slate-100">
              {/* Comparative Radar Chart */}
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-50/70 border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      {t.comparison.radarTitle}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {t.comparison.radarSubtitle}
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-500">{t.comparison.scaleNote}</span>
                </div>

                <div className="w-full h-80 sm:h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={activeComparison.radar}>
                      <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                      <PolarAngleAxis
                        dataKey="pillar"
                        tick={{ fill: '#334155', fontSize: 11, fontWeight: 700 }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={{ fill: '#94a3b8', fontSize: 10 }}
                      />
                      <Radar
                        name={activeComparison.firstLocalizedName}
                        dataKey={activeComparison.firstLocalizedName}
                        stroke="#2563eb"
                        fill="#3b82f6"
                        fillOpacity={0.35}
                        strokeWidth={2}
                      />
                      <Radar
                        name={activeComparison.secondLocalizedName}
                        dataKey={activeComparison.secondLocalizedName}
                        stroke="#7c3aed"
                        fill="#8b5cf6"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          borderRadius: '12px',
                          border: '1px solid #cbd5e1',
                          fontSize: '11px',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Comprehensive Hard Data Metrics Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <ArrowLeftRight className="w-4 h-4 text-blue-600" />
                    {t.comparison.tableTitle}
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    {t.comparison.tableSubtitle}
                  </span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4 w-1/4">{t.comparison.categoryAndMetric}</th>
                        <th className="py-3 px-4 text-center w-1/4 text-blue-700 font-extrabold">
                          {activeComparison.firstLocalizedName}
                        </th>
                        <th className="py-3 px-4 text-center w-1/4 text-indigo-700 font-extrabold">
                          {activeComparison.secondLocalizedName}
                        </th>
                        <th className="py-3 px-6 text-center w-36 whitespace-nowrap">{t.comparison.difference}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {activeComparison.metrics.map((row, idx) => {
                        const firstVal = row.firstValue;
                        const secondVal = row.secondValue;
                        const diff = firstVal - secondVal;

                        const firstIsBetter = row.higherIsBetter ? diff > 0 : diff < 0;
                        const secondIsBetter = row.higherIsBetter ? diff < 0 : diff > 0;

                        const localizedCategory = t.comparison.categories[row.categoryKey] || row.defaultCategory;
                        const localizedLabel = t.comparison.metrics[row.metricKey] || row.defaultLabel;

                        const activePluralForms = row.pluralMap ? row.pluralMap[language] : undefined;

                        // Precise grammatical plural inflection formatting
                        const formattedFirst = row.format
                          ? row.format(firstVal, language)
                          : activePluralForms
                          ? formatWithPlural(firstVal, activePluralForms)
                          : `${firstVal} ${row.unit}`;

                        const formattedSecond = row.format
                          ? row.format(secondVal, language)
                          : activePluralForms
                          ? formatWithPlural(secondVal, activePluralForms)
                          : `${secondVal} ${row.unit}`;

                        const absDiff = Math.abs(diff);
                        const isInteger = Math.abs(diff - Math.round(diff)) < 0.0001;
                        const diffNum = isInteger ? Math.round(diff) : diff.toFixed(1);
                        const formattedDiffNum = diff > 0 ? `+${diffNum}` : `${diffNum}`;
                        const formattedDiffUnit = activePluralForms
                          ? plural(absDiff, activePluralForms)
                          : row.unit;

                        return (
                          <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                            <td className="py-2.5 px-4">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                {localizedCategory}
                              </span>
                              <span className="font-medium text-slate-800">{localizedLabel}</span>
                            </td>
                            <td
                              className={`py-2.5 px-4 text-center font-bold ${
                                firstIsBetter ? 'text-emerald-600 bg-emerald-50/40' : 'text-slate-700'
                              }`}
                            >
                              <span className="inline-flex items-center gap-1 justify-center">
                                {formattedFirst}
                                {firstIsBetter && <CheckCircle2 className="w-3 h-3 text-emerald-500 inline" />}
                              </span>
                            </td>
                            <td
                              className={`py-2.5 px-4 text-center font-bold ${
                                secondIsBetter ? 'text-emerald-600 bg-emerald-50/40' : 'text-slate-700'
                              }`}
                            >
                              <span className="inline-flex items-center gap-1 justify-center">
                                {formattedSecond}
                                {secondIsBetter && <CheckCircle2 className="w-3 h-3 text-emerald-500 inline" />}
                              </span>
                            </td>
                            <td className="py-2.5 px-6 text-center font-extrabold text-[11px] text-slate-600 whitespace-nowrap">
                              {diff === 0 ? (
                                <span className="text-slate-400">{t.comparison.equal}</span>
                              ) : (
                                <span className={diff > 0 ? 'text-blue-600' : 'text-indigo-600'}>
                                  {formattedDiffNum} {formattedDiffUnit}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
