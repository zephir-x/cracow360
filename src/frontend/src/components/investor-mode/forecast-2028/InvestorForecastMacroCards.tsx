import { Baby, GraduationCap, Info, School, TrendingUp } from 'lucide-react';
import type { InvestorForecastLabels } from '../../../i18n/modules';
import type { InvestorMacro2028 } from './types';

export interface InvestorForecastMacroCardsProps {
  macro: InvestorMacro2028;
  labels: InvestorForecastLabels;
}

export function InvestorForecastMacroCards({
  macro,
  labels,
}: InvestorForecastMacroCardsProps) {
  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Projected Toddlers 2028 (0-3) */}
        <div className="p-5 rounded-3xl border border-slate-200/90 bg-white/95 hover:border-indigo-300 hover:shadow-md transition-all shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100/90 text-indigo-700 flex items-center justify-center shrink-0 shadow-xs">
            <Baby className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-slate-900 leading-tight">
                {macro.projectedToddlers2028.toLocaleString()}
              </span>
              {macro.toddlerGrowthPct < 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/80 shrink-0">
                  {labels.demographicDeclineBadge}
                </span>
              )}
            </div>
            <div className="text-xs font-bold text-slate-800 mt-0.5 leading-snug">
              {labels.macroToddlersTitle}
            </div>
            <div className="text-[11px] text-slate-500 font-medium leading-snug">
              {labels.macroToddlersSub(macro.toddlerGrowthPct)}
            </div>
          </div>
        </div>

        {/* 2. Projected Preschoolers 2028 (4-6) */}
        <div className="p-5 rounded-3xl border border-slate-200/90 bg-white/95 hover:border-teal-300 hover:shadow-md transition-all shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100/90 text-teal-700 flex items-center justify-center shrink-0 shadow-xs">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-slate-900 leading-tight">
                {macro.projectedPreschoolers2028.toLocaleString()}
              </span>
              {macro.preschoolGrowthPct < 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200/80 shrink-0">
                  {labels.demographicDeclineBadge}
                </span>
              )}
            </div>
            <div className="text-xs font-bold text-slate-800 mt-0.5 leading-snug">
              {labels.macroPreschoolTitle}
            </div>
            <div className="text-[11px] text-slate-500 font-medium leading-snug">
              {labels.macroPreschoolSub(macro.preschoolGrowthPct)}
            </div>
          </div>
        </div>

        {/* 3. Projected Primary Students 2028 (7-14) */}
        <div className="p-5 rounded-3xl border border-slate-200/90 bg-white/95 hover:border-sky-300 hover:shadow-md transition-all shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100/90 text-sky-700 flex items-center justify-center shrink-0 shadow-xs">
            <School className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-slate-900 leading-tight">
                {macro.projectedPrimaryStudents2028.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200/80 shrink-0">
                {labels.demographicStableBadge}
              </span>
            </div>
            <div className="text-xs font-bold text-slate-800 mt-0.5 leading-snug">
              {labels.macroStudentsTitle}
            </div>
            <div className="text-[11px] text-slate-500 font-medium leading-snug">
              {labels.macroStudentsSub(macro.primaryStudentsGrowthPct)}
            </div>
          </div>
        </div>

        {/* 4. Urgent Expansion Need Districts */}
        <div className="p-5 rounded-3xl border border-slate-200/90 bg-white/95 hover:border-violet-300 hover:shadow-md transition-all shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-100/90 text-violet-700 flex items-center justify-center shrink-0 shadow-xs">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="text-2xl font-black text-slate-900 leading-tight">
              {macro.highPotentialDistrictsCount} / 18
            </div>
            <div className="text-xs font-bold text-slate-800 mt-0.5 leading-snug">
              {labels.macroB2BTitle}
            </div>
            <div className="text-[11px] text-slate-500 font-medium leading-snug">
              {labels.macroB2BSub}
            </div>
          </div>
        </div>
      </div>

      {/* Macro-demographic context banner explaining the post-2020 birth curve decline */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-start sm:items-center gap-3 text-xs shadow-2xs">
        <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
          <Info className="w-4 h-4" />
        </div>
        <div className="min-w-0 leading-relaxed text-slate-700">
          <strong className="text-blue-900 font-bold block sm:inline sm:mr-1.5">
            {labels.demographicNoticeTitle}
          </strong>
          <span>{labels.demographicNoticeDescription}</span>
        </div>
      </div>
    </div>
  );
}
