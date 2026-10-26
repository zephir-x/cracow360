import {
  Baby,
  GraduationCap,
  Scale,
  School,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import type React from 'react';
import type { Language } from '../../../i18n/types';
import {
  getEducationalRecommendation,
  type InvestorForecastLabels,
} from '../../../i18n/investorForecastI18n';
import type { InvestorDistrictForecastData } from './types';

export interface InvestorForecastDrawerProps {
  isOpen: boolean;
  data: InvestorDistrictForecastData | null;
  labels: InvestorForecastLabels;
  localizedName: string;
  language: Language;
  onClose: () => void;
  drawerRef: React.RefObject<HTMLDivElement | null>;
}

export function InvestorForecastDrawer({
  isOpen,
  data,
  labels,
  localizedName,
  language,
  onClose,
  drawerRef,
}: InvestorForecastDrawerProps) {
  const getBadgeStyle = (b2b?: 'HIGH' | 'MEDIUM' | 'LOW') => {
    switch (b2b) {
      case 'HIGH':
        return 'bg-linear-to-r from-violet-600 to-indigo-600 text-white font-black shadow-xs shadow-violet-500/25 border-transparent';
      case 'MEDIUM':
        return 'bg-sky-50 text-sky-800 border-sky-200 font-bold';
      case 'LOW':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200/80 font-medium';
    }
  };

  return (
    <div className={`drawer-expandable ${isOpen ? 'is-open' : ''}`}>
      {/* Dynamic overflow allows complete, unclipped 360-degree box shadow diffusion when expanded */}
      <div ref={drawerRef} className={isOpen ? 'overflow-visible' : 'overflow-hidden'}>
        {data && (
          <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl shadow-blue-950/10 p-6 sm:p-8 space-y-6 text-slate-900 transition-all">
            {/* Top Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-900">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  {labels.drawerBadge}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {localizedName}
                </h3>
                <p className="text-xs text-slate-500">
                  {labels.drawerTitle}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <span
                  className={`text-xs px-3 py-1.5 rounded-xl border shrink-0 text-center leading-tight ${getBadgeStyle(
                    data.nurseryPotentialB2B
                  )}`}
                >
                  {labels.b2bBadge[data.nurseryPotentialB2B]}
                </span>
                <button
                  onClick={onClose}
                  className="p-2 rounded-2xl bg-slate-100 border border-slate-200/80 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition cursor-pointer shrink-0"
                  aria-label={labels.closeBtn}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 1. Core Educational & Childcare Strategic Recommendation */}
            <div className="rounded-2xl bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-5 sm:p-6 shadow-md border border-blue-400/40 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-200 tracking-wide uppercase">
                <GraduationCap className="w-4 h-4 text-sky-300" />
                {labels.educationalRecommendationTitle}
              </div>
              <p className="text-sm sm:text-base font-semibold leading-relaxed text-blue-50">
                &ldquo;{getEducationalRecommendation(data, language)}&rdquo;
              </p>
            </div>

            {/* 2. 4-Card Educational Spectrum across all tiers (0-3, 4-6, 7-14, 0-14) */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-600" />
                  {labels.demographics2028Title}
                </h4>
                <span className="text-xs text-slate-500 font-semibold">
                  {labels.vitalityLabel}{' '}
                  <strong className="text-blue-700 font-black">
                    {data.demographicVitalityScore.toFixed(1)} / 100
                  </strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {/* 1. Toddlers 2028 (0-3) */}
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-indigo-300 transition-all flex flex-col justify-between shadow-2xs">
                  <div>
                    <div className="font-bold text-slate-900 mb-0.5 flex items-center gap-1.5">
                      <Baby className="w-4 h-4 text-indigo-600 inline shrink-0" />
                      <span>{labels.toddlersLabel} {data.age0To3_2028}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {labels.toddlerCohortSubtitle} ({data.toddlerDelta >= 0 ? `+${data.toddlerDelta}` : data.toddlerDelta})
                    </div>
                  </div>
                  <div className="pt-2.5 mt-2.5 border-t border-slate-200/70 space-y-0.5">
                    <div className="text-[11px] text-slate-600 font-medium">
                      {labels.placesLabel} <strong className="text-slate-900">{data.carePlaces0to3} {labels.placesUnit}</strong>
                    </div>
                    <div className={`text-[11px] font-black ${data.nurseryBalance2028 < 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {labels.balance2028Label} {data.nurseryBalance2028 >= 0 ? `+${data.nurseryBalance2028}` : data.nurseryBalance2028} {labels.placesUnit}
                    </div>
                  </div>
                </div>

                {/* 2. Preschoolers 2028 (4-6) */}
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-teal-300 transition-all flex flex-col justify-between shadow-2xs">
                  <div>
                    <div className="font-bold text-slate-900 mb-0.5 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-teal-600 inline shrink-0" />
                      <span>{labels.preschoolersLabel} {data.age4To6_2028}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {labels.preschoolCohortSubtitle} ({data.preschoolDelta >= 0 ? `+${data.preschoolDelta}` : data.preschoolDelta})
                    </div>
                  </div>
                  <div className="pt-2.5 mt-2.5 border-t border-slate-200/70 space-y-0.5">
                    <div className="text-[11px] text-slate-600 font-medium">
                      {labels.placesLabel} <strong className="text-slate-900">{data.kindergartenPlacesTotal} {labels.placesUnit}</strong>
                    </div>
                    <div className={`text-[11px] font-black ${data.kindergartenBalance2028 < 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {labels.balance2028Label} {data.kindergartenBalance2028 >= 0 ? `+${data.kindergartenBalance2028}` : data.kindergartenBalance2028} {labels.placesUnit}
                    </div>
                  </div>
                </div>

                {/* 3. Primary Schools 2028 (7-14) */}
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-sky-300 transition-all flex flex-col justify-between shadow-2xs">
                  <div>
                    <div className="font-bold text-slate-900 mb-0.5 flex items-center gap-1.5">
                      <School className="w-4 h-4 text-sky-600 inline shrink-0" />
                      <span>{labels.studentsLabel} {data.age7To14_2028}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {labels.schoolCohortSubtitle} ({data.studentDelta >= 0 ? `+${data.studentDelta}` : data.studentDelta})
                    </div>
                  </div>
                  <div className="pt-2.5 mt-2.5 border-t border-slate-200/70 space-y-0.5">
                    <div className="text-[11px] text-slate-600 font-medium">
                      {labels.placesLabel} <strong className="text-slate-900">{data.primarySchoolStudentsTotal} {labels.placesUnit}</strong>
                    </div>
                    <div className={`text-[11px] font-black ${data.schoolPlacesBalance2028 < 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {labels.balance2028Label} {data.schoolPlacesBalance2028 >= 0 ? `+${data.schoolPlacesBalance2028}` : data.schoolPlacesBalance2028} {labels.placesUnit}
                    </div>
                  </div>
                </div>

                {/* 4. Slot 4: Comprehensive District Edu-Care Summary (0-14) */}
                <div className="p-4 rounded-2xl bg-linear-to-br from-indigo-50/70 via-white to-slate-50/90 border border-indigo-200/90 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="font-bold text-slate-900 mb-0.5 flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-indigo-600 inline shrink-0" />
                      <span>{labels.totalSummaryTitle}: {data.totalChildren2028}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {labels.totalSummarySubtitle} ({data.totalDelta0To14 >= 0 ? `+${data.totalDelta0To14}` : data.totalDelta0To14})
                    </div>
                  </div>
                  <div className="pt-2.5 mt-2.5 border-t border-indigo-100 space-y-0.5">
                    <div className="text-[11px] text-slate-600 font-medium">
                      {labels.totalPlacesLabel} <strong className="text-slate-900">{data.totalCapacity0To14} {labels.placesUnit}</strong>
                    </div>
                    <div className={`text-[11px] font-black ${data.totalBalance2028 < 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {labels.totalBalanceLabel} {data.totalBalance2028 >= 0 ? `+${data.totalBalance2028}` : data.totalBalance2028} {labels.placesUnit} ({labels.coverageLabel} {data.totalCoveragePct2028}%)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
