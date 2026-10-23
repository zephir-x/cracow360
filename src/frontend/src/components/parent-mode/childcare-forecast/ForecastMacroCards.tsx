import { AlertTriangle, Baby, CheckCircle2, Sparkles, TrendingDown, TrendingUp } from 'lucide-react';
import type { MacroIndicators, MacroPillDescriptions, MacroTitles } from './types';

export interface ForecastMacroCardsProps {
  currentMacro: MacroIndicators;
  macroTitles: MacroTitles;
  macroPillDescriptions: MacroPillDescriptions;
  placesUnit: string;
}

export function ForecastMacroCards({
  currentMacro,
  macroTitles,
  macroPillDescriptions,
  placesUnit,
}: ForecastMacroCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Space Balance */}
      <div
        className={`p-5 rounded-3xl border shadow-sm flex items-center gap-3.5 ${
          currentMacro.balance < 0
            ? 'bg-rose-50/70 border-rose-200 text-rose-950'
            : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
        }`}
      >
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            currentMacro.balance < 0
              ? 'bg-rose-100 text-rose-700'
              : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          {currentMacro.balance < 0 ? (
            <TrendingDown className="w-6 h-6" />
          ) : (
            <TrendingUp className="w-6 h-6" />
          )}
        </div>
        <div>
          <div
            className={`text-2xl font-black leading-tight ${
              currentMacro.balance < 0 ? 'text-rose-700' : 'text-emerald-700'
            }`}
          >
            {currentMacro.balance >= 0
              ? `+${currentMacro.balance.toLocaleString()}`
              : currentMacro.balance.toLocaleString()}
            <span className="text-xs font-semibold text-slate-500 ml-1">
              {placesUnit}
            </span>
          </div>
          <div className="text-xs font-bold text-slate-800 mt-0.5">
            {macroTitles.balance}
          </div>
          <div className="text-[11px] text-slate-500">
            {macroPillDescriptions.balanceSub}
          </div>
        </div>
      </div>

      {/* 2. Districts with a Deficit */}
      <div className="p-5 rounded-3xl border border-slate-200/90 bg-white shadow-sm flex items-center gap-3.5">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            currentMacro.criticalDistricts > 0
              ? 'bg-amber-100 text-amber-700'
              : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          {currentMacro.criticalDistricts > 0 ? (
            <AlertTriangle className="w-6 h-6" />
          ) : (
            <CheckCircle2 className="w-6 h-6" />
          )}
        </div>
        <div>
          <div
            className={`text-2xl font-black leading-tight ${
              currentMacro.criticalDistricts > 0 ? 'text-amber-700' : 'text-emerald-700'
            }`}
          >
            {currentMacro.criticalDistricts} / 18
          </div>
          <div className="text-xs font-bold text-slate-800 mt-0.5">
            {macroTitles.whiteSpots}
          </div>
          <div className="text-[11px] text-slate-500">
            {macroPillDescriptions.criticalSub}
          </div>
        </div>
      </div>

      {/* 3. Average Demand Coverage */}
      <div className="p-5 rounded-3xl border border-slate-200/90 bg-white shadow-sm flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shrink-0">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <div className="text-2xl font-black text-blue-700 leading-tight">
            {currentMacro.coveragePct}%
          </div>
          <div className="text-xs font-bold text-slate-800 mt-0.5">
            {macroTitles.coverage}
          </div>
          <div className="text-[11px] text-slate-500">
            {macroPillDescriptions.coverageSub}
          </div>
        </div>
      </div>

      {/* 4. Child Population (2028 Forecast) */}
      <div className="p-5 rounded-3xl border border-slate-200/90 bg-white shadow-sm flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600 shrink-0">
          <Baby className="w-6 h-6" />
        </div>
        <div>
          <div className="text-2xl font-black text-indigo-700 leading-tight">
            {currentMacro.projectedChildren.toLocaleString()}
          </div>
          <div className="text-xs font-bold text-slate-800 mt-0.5">
            {macroTitles.demand}
          </div>
          <div className="text-[11px] text-slate-500">
            {macroPillDescriptions.childrenSub}
          </div>
        </div>
      </div>
    </div>
  );
}
