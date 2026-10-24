import {
  Coins,
  Compass,
  Handshake,
  Landmark,
  ShieldCheck,
  Trees,
  Users,
} from 'lucide-react';
import type { InvestorSimulatorLabels } from '../../../i18n/investorSimulatorI18n';

export interface MunicipalGuidelinesMatrixProps {
  labels: InvestorSimulatorLabels;
}

export function MunicipalGuidelinesMatrix({ labels }: MunicipalGuidelinesMatrixProps) {
  return (
    <div className="space-y-6 pt-4 border-t border-slate-200">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-900">
          <Compass className="w-3.5 h-3.5 text-blue-600" />
          {labels.guidelinesBadge}
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {labels.guidelinesTitle}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-4xl leading-relaxed">
          {labels.guidelinesSubtitle}
        </p>
      </div>

      {/* 3 Strategic Directives Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
        {/* Card 1: Senior CAS Priorities */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center shadow-2xs">
              <Users className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm">
                {labels.casMatrixTitle}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {labels.casMatrixSubtitle}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 font-bold text-amber-900 text-[11px]">
              {labels.casPriorityDistricts}
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              {labels.casRecommendationText}
            </p>
          </div>
        </div>

        {/* Card 2: Greenery & Pocket Parks */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center shadow-2xs">
              <Trees className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm">
                {labels.greenMatrixTitle}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {labels.greenMatrixSubtitle}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 font-bold text-emerald-900 text-[11px]">
              {labels.greenPriorityDistricts}
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              {labels.greenRecommendationText}
            </p>
          </div>
        </div>

        {/* Card 3: Financing Models & PPP */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 flex items-center justify-center shadow-2xs">
              <Coins className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm">
                {labels.financeMatrixTitle}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {labels.financeMatrixSubtitle}
              </p>
            </div>

            <div className="space-y-2">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-[11px]">
                  <Handshake className="w-3.5 h-3.5 text-blue-600" />
                  <span>{labels.financeModels.pppTitle}</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                  {labels.financeModels.pppDesc}
                </p>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-[11px]">
                  <Landmark className="w-3.5 h-3.5 text-violet-600" />
                  <span>{labels.financeModels.maluchTitle}</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                  {labels.financeModels.maluchDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official Footnote Pill */}
      <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50/80 border border-slate-200 text-slate-500 text-[11px] font-medium text-center">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>{labels.finalExecutiveNotice}</span>
      </div>
    </div>
  );
}
