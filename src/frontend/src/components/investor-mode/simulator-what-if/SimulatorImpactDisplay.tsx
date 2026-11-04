import {
  ArrowRight,
  Award,
  Baby,
  BarChart3,
  Bus,
  GraduationCap,
  HeartHandshake,
  School,
  Sparkles,
  Trees,
  TrendingUp,
} from 'lucide-react';
import { useTranslation } from '../../../i18n/I18nContext';
import {
  getDynamicSimulatorRecommendation,
  type InvestorSimulatorLabels,
} from '../../../i18n/modules';
import { localizeDistrictName } from '../../../utils/districtLocalization';
import type { SimulatorImpactMetrics } from './types';

export interface SimulatorImpactDisplayProps {
  impact: SimulatorImpactMetrics;
  labels: InvestorSimulatorLabels;
}

export function SimulatorImpactDisplay({
  impact,
  labels,
}: SimulatorImpactDisplayProps) {
  const { language } = useTranslation();
  const localizedDistrict = localizeDistrictName(impact.districtName, language);
  const { scores } = impact;

  const formatSigned = (val: number) => (val >= 0 ? `+${val}` : `${val}`);

  const renderBeforeAfterRow = (
    label: string,
    beforeText: string,
    afterText: string,
    isChanged: boolean,
    isPositiveGood = true,
    numericDelta = 0
  ) => {
    const highlightClass = !isChanged
      ? 'text-slate-900'
      : isPositiveGood
        ? numericDelta >= 0
          ? 'text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-lg'
          : 'text-rose-700'
        : numericDelta <= 0
          ? 'text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-lg'
          : 'text-rose-700';

    return (
      <div className="flex items-center justify-between gap-2 text-xs py-1 border-b border-slate-100 last:border-b-0">
        <span className="text-slate-600 font-medium">{label}</span>
        <div className="flex items-center gap-1.5 font-bold shrink-0 tabular-nums transition-all duration-200">
          {isChanged ? (
            <>
              <span className="text-slate-400 line-through font-normal text-[11px]">
                {beforeText}
              </span>
              <ArrowRight className="w-3 h-3 text-blue-500 shrink-0" />
              <span className={`font-black transition-colors duration-200 ${highlightClass}`}>
                {afterText}
              </span>
            </>
          ) : (
            <span className="text-slate-900 font-extrabold">{afterText}</span>
          )}
        </div>
      </div>
    );
  };

  const pillarList = [
    {
      key: 'education',
      name: labels.pillarNames.education,
      before: scores.before.educationScore,
      after: scores.after.educationScore,
      delta: scores.deltas.educationScore,
      barColor: 'bg-indigo-600',
    },
    {
      key: 'greenery',
      name: labels.pillarNames.greenery,
      before: scores.before.greeneryScore,
      after: scores.after.greeneryScore,
      delta: scores.deltas.greeneryScore,
      barColor: 'bg-emerald-600',
    },
    {
      key: 'mobility',
      name: labels.pillarNames.mobility,
      before: scores.before.mobilityScore,
      after: scores.after.mobilityScore,
      delta: scores.deltas.mobilityScore,
      barColor: 'bg-sky-600',
    },
    {
      key: 'culture',
      name: labels.pillarNames.culture,
      before: scores.before.cultureAndSeniorScore,
      after: scores.after.cultureAndSeniorScore,
      delta: scores.deltas.cultureAndSeniorScore,
      barColor: 'bg-amber-600',
    },
    {
      key: 'demographic',
      name: labels.pillarNames.demographic,
      before: scores.before.demographicVitalityScore,
      after: scores.after.demographicVitalityScore,
      delta: scores.deltas.demographicVitalityScore,
      barColor: 'bg-violet-600',
    },
    {
      key: 'environment',
      name: labels.pillarNames.environment,
      before: scores.before.environmentScore,
      after: scores.after.environmentScore,
      delta: scores.deltas.environmentScore,
      barColor: 'bg-teal-600',
    },
    {
      key: 'safety',
      name: labels.pillarNames.safety,
      before: scores.before.safetyScore,
      after: scores.after.safetyScore,
      delta: scores.deltas.safetyScore,
      barColor: 'bg-blue-600',
    },
    {
      key: 'housing',
      name: labels.pillarNames.housing,
      before: scores.before.housingAffordabilityScore,
      after: scores.after.housingAffordabilityScore,
      delta: scores.deltas.housingAffordabilityScore,
      barColor: 'bg-slate-500',
    },
  ];

  const recommendationText = getDynamicSimulatorRecommendation(impact, language);

  return (
    <div
      key={`sim_impact_${impact.districtId}`}
      className="space-y-6 pt-2 animate-fade-in"
    >
      {/* Section Header for Dynamic Impact - Unified Kraków Blue gradient */}
      <div className="p-4 sm:p-6 rounded-3xl bg-linear-to-br from-[#0a2e65] via-[#1d4ed8] to-[#0284c7] text-white shadow-xl shadow-blue-950/15 border border-blue-400/30 space-y-4 sm:space-y-5">
        <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-3 border-b border-white/15 pb-4 text-center md:text-left">
          <div className="space-y-1 flex flex-col items-center md:items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-xs font-bold text-sky-100">
              <BarChart3 className="w-3.5 h-3.5 text-sky-300" />
              <span>{labels.impactSectionBadge}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black tracking-tight text-white">
              {labels.impactSectionTitle} ({localizedDistrict})
            </h3>
            <p className="text-xs text-blue-100/95 max-w-3xl">
              {labels.impactSectionSubtitle}
            </p>
          </div>

          {impact.totalAddedItemsCount === 0 && (
            <div className="px-3.5 py-2 rounded-2xl bg-white/15 border border-white/25 text-xs text-sky-100 font-medium max-w-xs">
              {labels.noChangesHint}
            </div>
          )}
        </div>

        {/* Top 2 Hero Impact Cards: Overall Quality of Life Index + 18-District Ranking */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Overall Quality of Life Index (0-100 pts) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex flex-col sm:flex-row items-center sm:justify-between text-center sm:text-left gap-3 sm:gap-4">
            <div className="space-y-1 flex flex-col items-center sm:items-start">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-100 uppercase tracking-wider">
                <TrendingUp className="w-4 h-4 text-sky-300" />
                <span>{labels.overallIndexCardTitle}</span>
              </div>
              <p className="text-[11px] text-blue-100/90">{labels.overallIndexCardSub}</p>
            </div>

            <div className="flex flex-col items-center sm:items-end text-center sm:text-right shrink-0 tabular-nums">
              <div className="flex items-center justify-center sm:justify-end gap-2">
                {scores.deltas.weightedQualityOfLifeIndex > 0 && (
                  <>
                    <span className="text-sm font-bold text-blue-200/80 line-through">
                      {scores.before.weightedQualityOfLifeIndex.toFixed(1)}
                    </span>
                    <ArrowRight className="w-4 h-4 text-sky-300" />
                  </>
                )}
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {scores.after.weightedQualityOfLifeIndex.toFixed(1)}
                </span>
              </div>
              {scores.deltas.weightedQualityOfLifeIndex > 0 && (
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-300/50 text-emerald-100 text-xs font-black">
                  +{scores.deltas.weightedQualityOfLifeIndex.toFixed(1)}
                </span>
              )}
            </div>
          </div>

          {/* Card 2: Position in 18-District Ranking */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex flex-col sm:flex-row items-center sm:justify-between text-center sm:text-left gap-3 sm:gap-4">
            <div className="space-y-1 flex flex-col items-center sm:items-start">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-100 uppercase tracking-wider">
                <Award className="w-4 h-4 text-amber-300" />
                <span>{labels.rankingCardTitle}</span>
              </div>
              <p className="text-[11px] text-blue-100/90">{labels.rankingCardSub}</p>
            </div>

            <div className="flex flex-col items-center sm:items-end text-center sm:text-right shrink-0 tabular-nums">
              <div className="flex items-center justify-center sm:justify-end gap-2">
                {scores.rankDelta > 0 && (
                  <>
                    <span className="text-sm font-bold text-blue-200/80 line-through">
                      #{scores.rankBefore}
                    </span>
                    <ArrowRight className="w-4 h-4 text-amber-300" />
                  </>
                )}
                <span className="text-2xl sm:text-3xl font-black text-white">
                  #{scores.rankAfter}{' '}
                  <span className="text-xs font-bold text-sky-200">/ 18</span>
                </span>
              </div>
              <span
                className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-black border transition-colors duration-200 ${
                  scores.rankDelta > 0
                    ? 'bg-amber-400/25 border-amber-300/50 text-amber-100'
                    : 'bg-white/15 border-white/20 text-blue-100/90'
                }`}
              >
                {scores.rankDelta > 0
                  ? labels.rankImprovedBadge(scores.rankDelta)
                  : labels.rankUnchangedBadge}
              </span>
            </div>
          </div>
        </div>

        {/* 8 Pillars Breakdown */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/95 text-slate-900 space-y-3.5 shadow-md">
          <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-1 border-b border-slate-100 pb-2.5 text-center sm:text-left">
            <h4 className="text-xs sm:text-sm font-black text-slate-900">
              {labels.pillarsSectionTitle}
            </h4>
            <span className="text-[11px] text-slate-500">{labels.pillarsSectionSubtitle}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            {pillarList.map((pillar) => {
              const hasDelta = pillar.delta > 0;
              return (
                <div key={pillar.key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{pillar.name}</span>
                    <div className="flex items-center gap-1.5 tabular-nums">
                      {hasDelta && (
                        <>
                          <span className="text-slate-400 line-through text-[11px]">
                            {pillar.before.toFixed(1)}
                          </span>
                          <ArrowRight className="w-3 h-3 text-blue-500" />
                        </>
                      )}
                      <span className="font-black text-slate-900">
                        {pillar.after.toFixed(1)}
                      </span>
                      {hasDelta && (
                        <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black">
                          +{pillar.delta.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ease-out ${pillar.barColor}`}
                      style={{ width: `${Math.min(100, Math.max(4, pillar.after))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Childcare & School Places Balance (Current Real-Time State) */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="space-y-0.5 border-b border-slate-100 pb-3">
          <h4 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>{labels.balancesSectionTitle}</span>
          </h4>
          <p className="text-xs text-slate-500">{labels.balancesSectionSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* 1. Nurseries (0-3) */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0">
                <Baby className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-slate-900">
                  {labels.balanceCards.nurseryTitle}
                </div>
                <div className="text-[10px] text-slate-500">
                  {labels.balanceCards.nurserySub}
                </div>
              </div>
            </div>

            <div className="pt-1 space-y-1">
              {renderBeforeAfterRow(
                labels.placesLabel,
                `${impact.nurseryPlacesBefore}`,
                `${impact.nurseryPlacesAfter}`,
                impact.nurseryPlacesAfter !== impact.nurseryPlacesBefore,
                true,
                impact.nurseryPlacesAfter - impact.nurseryPlacesBefore
              )}
              {renderBeforeAfterRow(
                labels.balance2028Label,
                formatSigned(impact.nurseryBalanceBefore),
                formatSigned(impact.nurseryBalanceAfter),
                impact.nurseryBalanceAfter !== impact.nurseryBalanceBefore,
                true,
                impact.nurseryBalanceAfter - impact.nurseryBalanceBefore
              )}
              {renderBeforeAfterRow(
                labels.coverageLabel,
                `${impact.nurseryCoverageBeforePct}%`,
                `${impact.nurseryCoverageAfterPct}%`,
                impact.nurseryCoverageAfterPct !== impact.nurseryCoverageBeforePct,
                true,
                impact.nurseryCoverageAfterPct - impact.nurseryCoverageBeforePct
              )}
              {renderBeforeAfterRow(
                labels.childrenPerPlaceLabel,
                `${impact.childrenPerPlaceBefore.toFixed(2)}`,
                `${impact.childrenPerPlaceAfter.toFixed(2)}`,
                impact.childrenPerPlaceAfter !== impact.childrenPerPlaceBefore,
                false,
                impact.childrenPerPlaceAfter - impact.childrenPerPlaceBefore
              )}
              {renderBeforeAfterRow(
                labels.parentClubsCountLabel,
                `${impact.parentClubsBefore}`,
                `${impact.parentClubsAfter}`,
                impact.parentClubsAfter !== impact.parentClubsBefore,
                true,
                impact.parentClubsAfter - impact.parentClubsBefore
              )}
            </div>
          </div>

          {/* 2. Kindergartens (4-6) */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-slate-900">
                  {labels.balanceCards.kindergartenTitle}
                </div>
                <div className="text-[10px] text-slate-500">
                  {labels.balanceCards.kindergartenSub}
                </div>
              </div>
            </div>

            <div className="pt-1 space-y-1">
              {renderBeforeAfterRow(
                labels.placesLabel,
                `${impact.kindergartenPlacesBefore}`,
                `${impact.kindergartenPlacesAfter}`,
                impact.kindergartenPlacesAfter !== impact.kindergartenPlacesBefore,
                true,
                impact.kindergartenPlacesAfter - impact.kindergartenPlacesBefore
              )}
              {renderBeforeAfterRow(
                labels.balance2028Label,
                formatSigned(impact.kindergartenBalanceBefore),
                formatSigned(impact.kindergartenBalanceAfter),
                impact.kindergartenBalanceAfter !== impact.kindergartenBalanceBefore,
                true,
                impact.kindergartenBalanceAfter - impact.kindergartenBalanceBefore
              )}
              {renderBeforeAfterRow(
                labels.coverageLabel,
                `${impact.kindergartenCoverageBeforePct}%`,
                `${impact.kindergartenCoverageAfterPct}%`,
                impact.kindergartenCoverageAfterPct !== impact.kindergartenCoverageBeforePct,
                true,
                impact.kindergartenCoverageAfterPct - impact.kindergartenCoverageBeforePct
              )}
            </div>
          </div>

          {/* 3. Primary Schools (7-14) */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center shrink-0">
                <School className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-slate-900">
                  {labels.balanceCards.schoolTitle}
                </div>
                <div className="text-[10px] text-slate-500">
                  {labels.balanceCards.schoolSub}
                </div>
              </div>
            </div>

            <div className="pt-1 space-y-1">
              {renderBeforeAfterRow(
                labels.placesLabel,
                `${impact.schoolPlacesBefore}`,
                `${impact.schoolPlacesAfter}`,
                impact.schoolPlacesAfter !== impact.schoolPlacesBefore,
                true,
                impact.schoolPlacesAfter - impact.schoolPlacesBefore
              )}
              {renderBeforeAfterRow(
                labels.balance2028Label,
                formatSigned(impact.schoolBalanceBefore),
                formatSigned(impact.schoolBalanceAfter),
                impact.schoolBalanceAfter !== impact.schoolBalanceBefore,
                true,
                impact.schoolBalanceAfter - impact.schoolBalanceBefore
              )}
              {renderBeforeAfterRow(
                labels.avgClassSizeLabel,
                `${impact.avgClassSizeBefore.toFixed(1)} ${labels.pupilsUnit}`,
                `${impact.avgClassSizeAfter.toFixed(1)} ${labels.pupilsUnit}`,
                impact.avgClassSizeAfter !== impact.avgClassSizeBefore,
                false,
                impact.avgClassSizeAfter - impact.avgClassSizeBefore
              )}
            </div>
          </div>

          {/* 4. Combined 0-14 Places Balance */}
          <div className="p-4 rounded-2xl bg-linear-to-br from-blue-50/70 via-indigo-50/40 to-white border border-blue-200/90 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-slate-900">
                  {labels.balanceCards.totalEduTitle}
                </div>
                <div className="text-[10px] text-slate-500">
                  {labels.balanceCards.totalEduSub}
                </div>
              </div>
            </div>

            <div className="pt-1 space-y-1">
              {renderBeforeAfterRow(
                labels.placesLabel,
                `${impact.totalEduPlacesBefore}`,
                `${impact.totalEduPlacesAfter}`,
                impact.totalEduPlacesAfter !== impact.totalEduPlacesBefore,
                true,
                impact.totalEduPlacesAfter - impact.totalEduPlacesBefore
              )}
              {renderBeforeAfterRow(
                labels.balance2028Label,
                formatSigned(impact.totalEduBalanceBefore),
                formatSigned(impact.totalEduBalanceAfter),
                impact.totalEduBalanceAfter !== impact.totalEduBalanceBefore,
                true,
                impact.totalEduBalanceAfter - impact.totalEduBalanceBefore
              )}
              {renderBeforeAfterRow(
                labels.coverageLabel,
                `${impact.totalEduCoverageBeforePct}%`,
                `${impact.totalEduCoverageAfterPct}%`,
                impact.totalEduCoverageAfterPct !== impact.totalEduCoverageBeforePct,
                true,
                impact.totalEduCoverageAfterPct - impact.totalEduCoverageBeforePct
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Greenery, Mobility & Senior/Culture Concrete District Metrics */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="space-y-0.5 border-b border-slate-100 pb-3">
          <h4 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
            <Trees className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{labels.fieldMetricsTitle}</span>
          </h4>
          <p className="text-xs text-slate-500">{labels.fieldMetricsSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* 1. Greenery & Sport */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center gap-2 font-extrabold text-xs text-slate-900">
              <Trees className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{labels.greeneryCardTitle}</span>
            </div>
            <div className="space-y-1">
              {renderBeforeAfterRow(
                labels.greeneryPerCapitaLabel,
                `${impact.greenM2PerCapitaBefore.toFixed(1)} m²/os.`,
                `${impact.greenM2PerCapitaAfter.toFixed(1)} m²/os.`,
                impact.greenM2PerCapitaAfter !== impact.greenM2PerCapitaBefore,
                true,
                impact.greenM2PerCapitaAfter - impact.greenM2PerCapitaBefore
              )}
              {renderBeforeAfterRow(
                labels.totalParksLabel,
                `${impact.parksCountBefore} (${impact.greenAreaHaBefore.toFixed(2)} ha)`,
                `${impact.parksCountAfter} (${impact.greenAreaHaAfter.toFixed(2)} ha)`,
                impact.parksCountAfter !== impact.parksCountBefore ||
                  impact.greenAreaHaAfter !== impact.greenAreaHaBefore,
                true,
                impact.parksCountAfter - impact.parksCountBefore
              )}
              {renderBeforeAfterRow(
                labels.sportsObjectsLabel,
                `${impact.sportsFacilitiesBefore}`,
                `${impact.sportsFacilitiesAfter}`,
                impact.sportsFacilitiesAfter !== impact.sportsFacilitiesBefore,
                true,
                impact.sportsFacilitiesAfter - impact.sportsFacilitiesBefore
              )}
            </div>
          </div>

          {/* 2. Mobility & Cycling */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center gap-2 font-extrabold text-xs text-slate-900">
              <Bus className="w-4 h-4 text-sky-600 shrink-0" />
              <span>{labels.mobilityCardTitle}</span>
            </div>
            <div className="space-y-1">
              {renderBeforeAfterRow(
                labels.kmkStopsTotalLabel,
                `${impact.kmkStopsBefore}`,
                `${impact.kmkStopsAfter}`,
                impact.kmkStopsAfter !== impact.kmkStopsBefore,
                true,
                impact.kmkStopsAfter - impact.kmkStopsBefore
              )}
              {renderBeforeAfterRow(
                labels.isochrone500mLabel,
                `${impact.isochroneBeforePct.toFixed(1)}%`,
                `${impact.isochroneAfterPct.toFixed(1)}%`,
                impact.isochroneAfterPct !== impact.isochroneBeforePct,
                true,
                impact.isochroneAfterPct - impact.isochroneBeforePct
              )}
              {renderBeforeAfterRow(
                labels.bikeLanesLabel,
                `${impact.bikeLanesKmBefore.toFixed(1)} km`,
                `${impact.bikeLanesKmAfter.toFixed(1)} km`,
                impact.bikeLanesKmAfter !== impact.bikeLanesKmBefore,
                true,
                impact.bikeLanesKmAfter - impact.bikeLanesKmBefore
              )}
              {renderBeforeAfterRow(
                labels.prAndRacksLabel,
                `${impact.parkAndRideBefore} P+R / ${impact.bikeRacksBefore}`,
                `${impact.parkAndRideAfter} P+R / ${impact.bikeRacksAfter}`,
                impact.parkAndRideAfter !== impact.parkAndRideBefore ||
                  impact.bikeRacksAfter !== impact.bikeRacksBefore,
                true,
                impact.parkAndRideAfter - impact.parkAndRideBefore
              )}
            </div>
          </div>

          {/* 3. Seniors (65+) & Culture */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center gap-2 font-extrabold text-xs text-slate-900">
              <HeartHandshake className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{labels.seniorCultureCardTitle}</span>
            </div>
            <div className="space-y-1">
              {renderBeforeAfterRow(
                labels.casCentersCountLabel,
                `${impact.casCountBefore}`,
                `${impact.casCountAfter}`,
                impact.casCountAfter !== impact.casCountBefore,
                true,
                impact.casCountAfter - impact.casCountBefore
              )}
              {renderBeforeAfterRow(
                labels.seniorsPerCasLabel,
                `${impact.seniorsPerCasBefore} os.`,
                `${impact.seniorsPerCasAfter} os.`,
                impact.seniorsPerCasAfter !== impact.seniorsPerCasBefore,
                false,
                impact.seniorsPerCasAfter - impact.seniorsPerCasBefore
              )}
              {renderBeforeAfterRow(
                labels.librariesAndCultureLabel,
                `${impact.librariesBefore + impact.culturalCentersBefore}`,
                `${impact.librariesAfter + impact.culturalCentersAfter}`,
                impact.librariesAfter + impact.culturalCentersAfter !==
                  impact.librariesBefore + impact.culturalCentersBefore,
                true,
                impact.librariesAfter +
                  impact.culturalCentersAfter -
                  (impact.librariesBefore + impact.culturalCentersBefore)
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Summary & Practical Recommendation Banner */}
      <div className="rounded-3xl bg-linear-to-r from-[#0a2e65] via-[#1d4ed8] to-[#0284c7] text-white p-4 sm:p-6 shadow-md border border-blue-400/40 space-y-2 text-center sm:text-left">
        <div className="flex items-center gap-2 text-xs font-extrabold text-sky-200 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-sky-300 shrink-0" />
          <span>
            {labels.recommendationBannerTitle} — {localizedDistrict}
          </span>
        </div>
        <p className="text-xs sm:text-sm font-medium leading-relaxed text-blue-50">
          {recommendationText}
        </p>
      </div>
    </div>
  );
}
