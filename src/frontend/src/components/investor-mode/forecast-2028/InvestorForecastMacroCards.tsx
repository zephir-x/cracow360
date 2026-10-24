import { Baby, GraduationCap, School, TrendingUp } from 'lucide-react';
import type { InvestorForecastLabels } from '../../../i18n/investorForecastI18n';
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Projected Toddlers 2028 (0-3) */}
      <div className="p-5 rounded-3xl border border-slate-200/90 bg-white/95 hover:border-indigo-300 hover:shadow-md transition-all shadow-xs flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100/90 text-indigo-700 flex items-center justify-center shrink-0 shadow-xs">
          <Baby className="w-6 h-6" />
        </div>
        <div className="min-w-0">
          <div className="text-2xl font-black text-slate-900 leading-tight">
            {macro.projectedToddlers2028.toLocaleString()}
          </div>
          <div className="text-xs font-bold text-slate-800 mt-0.5 leading-snug">
            {labels.macroToddlersTitle}
          </div>
          <div className="text-[11px] text-slate-500 font-medium leading-snug">
            {labels.macroToddlersSub(macro.toddlerGrowthPct)}
          </div>
        </div>
      </div>

      {/* 2. Projected Preschoolers 2028 (4-6) - Modern Teal instead of yellow/amber */}
      <div className="p-5 rounded-3xl border border-slate-200/90 bg-white/95 hover:border-teal-300 hover:shadow-md transition-all shadow-xs flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100/90 text-teal-700 flex items-center justify-center shrink-0 shadow-xs">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div className="min-w-0">
          <div className="text-2xl font-black text-slate-900 leading-tight">
            {macro.projectedPreschoolers2028.toLocaleString()}
          </div>
          <div className="text-xs font-bold text-slate-800 mt-0.5 leading-snug">
            {labels.macroPreschoolTitle}
          </div>
          <div className="text-[11px] text-slate-500 font-medium leading-snug">
            {labels.macroPreschoolSub(macro.preschoolGrowthPct)}
          </div>
        </div>
      </div>

      {/* 3. Primary Students Demand (7-14) */}
      <div className="p-5 rounded-3xl border border-slate-200/90 bg-white/95 hover:border-sky-300 hover:shadow-md transition-all shadow-xs flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100/90 text-sky-700 flex items-center justify-center shrink-0 shadow-xs">
          <School className="w-6 h-6" />
        </div>
        <div className="min-w-0">
          <div className="text-2xl font-black text-slate-900 leading-tight">
            {macro.currentPrimaryStudents.toLocaleString()}
          </div>
          <div className="text-xs font-bold text-slate-800 mt-0.5 leading-snug">
            {labels.macroStudentsTitle}
          </div>
          <div className="text-[11px] text-slate-500 font-medium leading-snug">
            {labels.macroStudentsSub(macro.primarySharePct)}
          </div>
        </div>
      </div>

      {/* 4. High B2B Investment Priority */}
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
  );
}
