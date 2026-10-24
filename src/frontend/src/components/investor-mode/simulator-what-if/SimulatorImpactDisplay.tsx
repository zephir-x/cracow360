import {
  Baby,
  Building2,
  CheckCircle2,
  Flame,
  Scale,
  Sparkles,
  TrendingUp,
  Trees,
  Users,
} from 'lucide-react';
import type { Language } from '../../../i18n/types';
import type { InvestorSimulatorLabels } from '../../../i18n/investorSimulatorI18n';
import { localizeDistrictName } from '../../../utils/districtLocalization';
import type {
  BaselineDistrictMetrics,
  SimulatedDistrictMetrics,
  SimulatedMarketStatus,
} from './types';

export interface SimulatorImpactDisplayProps {
  baseline: BaselineDistrictMetrics;
  simulated: SimulatedDistrictMetrics;
  labels: InvestorSimulatorLabels;
  language: Language;
}

export function SimulatorImpactDisplay({
  baseline,
  simulated,
  labels,
  language,
}: SimulatorImpactDisplayProps) {
  const localizedDistrictName = localizeDistrictName(baseline.districtName, language);

  const getStatusBadgeStyle = (status: SimulatedMarketStatus) => {
    switch (status) {
      case 'CRITICAL_DEFICIT':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'MODERATE_DEFICIT':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'BALANCED':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'SURPLUS':
        return 'bg-sky-50 text-sky-800 border-sky-200';
    }
  };

  const getStatusIcon = (status: SimulatedMarketStatus) => {
    switch (status) {
      case 'CRITICAL_DEFICIT':
        return <Flame className="w-4 h-4 text-rose-600" />;
      case 'MODERATE_DEFICIT':
        return <Scale className="w-4 h-4 text-amber-600" />;
      case 'BALANCED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'SURPLUS':
        return <TrendingUp className="w-4 h-4 text-sky-600" />;
    }
  };

  return (
    <div className="space-y-5">
      {/* 4 Comparative Outcome Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Card 1: 2028 Childcare Balance & Coverage */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Baby className="w-4 h-4 text-indigo-600" />
              <span>{labels.cardNurseryTitle}</span>
            </div>
            <div className="text-[11px] text-slate-500">
              {labels.cardNurseryDeficitRelief(
                simulated.balanceImprovement,
                simulated.coverageImprovementPct
              )}
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>{labels.beforeLabel}:</span>
              <strong className={baseline.baselineBalance2028 < 0 ? 'text-rose-700' : 'text-emerald-700'}>
                {baseline.baselineBalance2028 >= 0 ? `+${baseline.baselineBalance2028}` : baseline.baselineBalance2028} m. ({baseline.baselineCoveragePct2028}%)
              </strong>
            </div>

            <div className="flex items-center justify-between font-bold">
              <span className="text-slate-700">{labels.afterLabel}:</span>
              <strong className={`text-sm font-black ${simulated.newBalance2028 < 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                {simulated.newBalance2028 >= 0 ? `+${simulated.newBalance2028}` : simulated.newBalance2028} m. ({simulated.newCoveragePct2028}%)
              </strong>
            </div>

            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-black text-[11px] w-full justify-center">
              <span>+{simulated.balanceImprovement} miejsc (+{simulated.coverageImprovementPct}% pokrycia)</span>
            </div>
          </div>
        </div>

        {/* Card 2: Demographic Vitality Index */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>{labels.cardVitalityTitle}</span>
            </div>
            <div className="text-[11px] text-slate-500">
              {labels.cardVitalitySub}
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>{labels.beforeLabel}:</span>
              <strong className="text-slate-800 font-bold">
                {baseline.demographicVitalityScore.toFixed(1)} {labels.cardVitalityPoints}
              </strong>
            </div>

            <div className="flex items-center justify-between font-bold">
              <span className="text-slate-700">{labels.afterLabel}:</span>
              <strong className="text-sm font-black text-blue-700">
                {simulated.newVitalityScore.toFixed(1)} {labels.cardVitalityPoints}
              </strong>
            </div>

            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200/80 font-black text-[11px] w-full justify-center">
              <span>+{simulated.vitalityScoreDelta.toFixed(1)} {labels.cardVitalityPoints}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Social & Environmental Infrastructure */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Users className="w-4 h-4 text-amber-600" />
              <span>{labels.cardInfraTitle}</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Seniorzy & Parki w zasięgu spaceru
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500 flex items-center gap-1">
                <Users className="w-3 h-3 text-amber-600" /> {labels.cardInfraCasLabel}
              </span>
              <strong className="text-slate-900">
                {baseline.currentCasCount} ➔ {simulated.newCasCount} (+{simulated.casImprovement})
              </strong>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500 flex items-center gap-1">
                <Trees className="w-3 h-3 text-emerald-600" /> {labels.cardInfraParksLabel}
              </span>
              <strong className="text-slate-900">
                {baseline.pocketParksCount} ➔ {simulated.newPocketParksCount} (+{simulated.parksImprovement})
              </strong>
            </div>

            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-bold text-[11px] w-full justify-center">
              <span>{simulated.estimatedNewGreenM2PerCapita} {labels.cardInfraGreenPerCapita}</span>
            </div>
          </div>
        </div>

        {/* Card 4: District Investment Status */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Building2 className="w-4 h-4 text-violet-600" />
              <span>{labels.cardStatusTitle}</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Klasyfikacja gotowości inwestycyjnej
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div
              className={`p-2 rounded-xl border font-black text-xs flex items-center gap-1.5 justify-center ${getStatusBadgeStyle(
                simulated.newMarketStatus
              )}`}
            >
              {getStatusIcon(simulated.newMarketStatus)}
              <span>{labels.marketStatuses[simulated.newMarketStatus]}</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight text-center">
              {labels.marketStatusDesc[simulated.newMarketStatus]}
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Executive Decision Support Note (Luminous Civic Royal Blue Ribbon) */}
      <div className="rounded-2xl bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-5 sm:p-6 shadow-md border border-blue-400/40 space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-sky-200 tracking-wide uppercase">
          <Sparkles className="w-4 h-4 text-sky-300" />
          <span>Rekomendacja Decyzyjna dla Urzędu Miasta i Inwestora B2B ({localizedDistrictName})</span>
        </div>
        <p className="text-sm sm:text-base font-semibold leading-relaxed text-blue-50">
          &ldquo;{labels.generateDecisionNote(baseline, simulated, localizedDistrictName)}&rdquo;
        </p>
      </div>
    </div>
  );
}
