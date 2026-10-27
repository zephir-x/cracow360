import { ArrowRight, ChevronDown, ChevronUp, Scale } from 'lucide-react';
import type { InvestorForecastLabels } from '../../../i18n/modules';
import type { InvestorDistrictForecastData } from './types';

export interface InvestorDistrictCardProps {
  data: InvestorDistrictForecastData;
  labels: InvestorForecastLabels;
  isSelected: boolean;
  onToggleSelect: () => void;
  localizedName: string;
}

export function InvestorDistrictCard({
  data,
  labels,
  isSelected,
  onToggleSelect,
  localizedName,
}: InvestorDistrictCardProps) {
  const getBadgeStyle = (b2b: 'HIGH' | 'MEDIUM' | 'LOW') => {
    switch (b2b) {
      case 'HIGH':
        return 'bg-linear-to-r from-violet-600 to-indigo-600 text-white font-black shadow-xs shadow-violet-500/25 border-transparent';
      case 'MEDIUM':
        return 'bg-sky-50 text-sky-800 border-sky-200/80 font-bold';
      case 'LOW':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200/80 font-medium';
    }
  };

  return (
    <div
      className={`rounded-3xl border transition-all duration-300 p-5 flex flex-col justify-between shadow-xs ${
        isSelected
          ? 'bg-linear-to-b from-blue-50/40 via-white to-white border-blue-500 ring-2 ring-blue-500/20 shadow-xl -translate-y-0.5'
          : 'bg-white/95 border-slate-200/90 hover:border-blue-400 hover:shadow-lg hover:-translate-y-0.5'
      }`}
    >
      <div className="space-y-3">
        {/* Header: Clean District Name & Modern B2B Badge */}
        <div className="flex items-start justify-between gap-2.5">
          <h3 className="text-base font-extrabold text-slate-900 leading-snug tracking-tight truncate">
            {localizedName}
          </h3>
          <span
            className={`text-[11px] px-2.5 py-1 rounded-xl border shrink-0 text-center leading-tight transition-transform ${getBadgeStyle(
              data.nurseryPotentialB2B
            )}`}
          >
            {labels.b2bBadge[data.nurseryPotentialB2B]}
          </span>
        </div>

        {/* 3-Cohort Breakdown across 0-3, 4-6, and 7-14 with modernized neutral palette */}
        <div className="space-y-2 text-xs">
          {/* 1. Toddlers (0-3) */}
          <div className="p-2.5 rounded-2xl bg-slate-50/80 hover:bg-indigo-50/30 border border-slate-200/80 hover:border-indigo-200/90 transition-colors flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                <span>{labels.toddlersLabel}</span>
                <span className="text-[11px] font-normal text-slate-500">
                  ({data.carePlaces0to3} {labels.placesUnit})
                </span>
              </div>
              <div className="text-[11px] text-slate-600 flex items-center gap-1 font-medium mt-0.5 pl-3">
                <span>{data.age0To3_current}</span>
                <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="font-bold text-slate-900">{data.age0To3_2028}</span>
                <span
                  className={`text-[10px] px-1 rounded font-black ${
                    data.toddlerDelta >= 0
                      ? 'text-emerald-700 bg-emerald-100/80'
                      : 'text-rose-700 bg-rose-100/80'
                  }`}
                >
                  {data.toddlerDelta >= 0 ? `+${data.toddlerDelta}` : data.toddlerDelta}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {labels.balance2028Label}
              </div>
              <div
                className={`text-xs font-black ${
                  data.nurseryBalance2028 < 0 ? 'text-rose-700' : 'text-emerald-700'
                }`}
              >
                {data.nurseryBalance2028 >= 0
                  ? `+${data.nurseryBalance2028}`
                  : data.nurseryBalance2028}{' '}
                {labels.placesUnit}
              </div>
            </div>
          </div>

          {/* 2. Preschoolers (4-6) */}
          <div className="p-2.5 rounded-2xl bg-slate-50/80 hover:bg-teal-50/30 border border-slate-200/80 hover:border-teal-200/90 transition-colors flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                <span>{labels.preschoolersLabel}</span>
                <span className="text-[11px] font-normal text-slate-500">
                  ({data.kindergartenPlacesTotal} {labels.placesUnit})
                </span>
              </div>
              <div className="text-[11px] text-slate-600 flex items-center gap-1 font-medium mt-0.5 pl-3">
                <span>{data.age4To6_current}</span>
                <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="font-bold text-slate-900">{data.age4To6_2028}</span>
                <span
                  className={`text-[10px] px-1 rounded font-black ${
                    data.preschoolDelta >= 0
                      ? 'text-emerald-700 bg-emerald-100/80'
                      : 'text-rose-700 bg-rose-100/80'
                  }`}
                >
                  {data.preschoolDelta >= 0 ? `+${data.preschoolDelta}` : data.preschoolDelta}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {labels.balance2028Label}
              </div>
              <div
                className={`text-xs font-black ${
                  data.kindergartenBalance2028 < 0 ? 'text-rose-700' : 'text-emerald-700'
                }`}
              >
                {data.kindergartenBalance2028 >= 0
                  ? `+${data.kindergartenBalance2028}`
                  : data.kindergartenBalance2028}{' '}
                {labels.placesUnit}
              </div>
            </div>
          </div>

          {/* 3. Primary Schools (7-14) */}
          <div className="p-2.5 rounded-2xl bg-slate-50/80 hover:bg-sky-50/30 border border-slate-200/80 hover:border-sky-200/90 transition-colors flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                <span>{labels.studentsLabel}</span>
                <span className="text-[11px] font-normal text-slate-500">
                  ({data.primarySchoolStudentsTotal} {labels.placesUnit})
                </span>
              </div>
              <div className="text-[11px] text-slate-600 flex items-center gap-1 font-medium mt-0.5 pl-3">
                <span>{data.age7To14_current}</span>
                <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="font-bold text-slate-900">{data.age7To14_2028}</span>
                <span
                  className={`text-[10px] px-1 rounded font-black ${
                    data.studentDelta >= 0
                      ? 'text-emerald-700 bg-emerald-100/80'
                      : 'text-rose-700 bg-rose-100/80'
                  }`}
                >
                  {data.studentDelta >= 0 ? `+${data.studentDelta}` : data.studentDelta}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {labels.balance2028Label}
              </div>
              <div
                className={`text-xs font-black ${
                  data.schoolPlacesBalance2028 < 0 ? 'text-rose-700' : 'text-emerald-700'
                }`}
              >
                {data.schoolPlacesBalance2028 >= 0
                  ? `+${data.schoolPlacesBalance2028}`
                  : data.schoolPlacesBalance2028}{' '}
                {labels.placesUnit}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Slot 4: Modern Civic Blue Ribbon (Harmonized with site colors) */}
        <div className="flex items-center justify-between text-xs px-3 py-2 bg-linear-to-r from-blue-50 via-indigo-50/70 to-blue-50 rounded-2xl border border-blue-200/90 shadow-2xs">
          <div className="flex items-center gap-1.5 font-bold text-blue-950">
            <Scale className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>{labels.totalCardSummaryLabel}</span>
          </div>
          <div className="flex items-center gap-1.5 text-right">
            <span
              className={`font-black ${
                data.totalBalance2028 < 0 ? 'text-rose-700' : 'text-emerald-700'
              }`}
            >
              {data.totalBalance2028 >= 0 ? `+${data.totalBalance2028}` : data.totalBalance2028}{' '}
              {labels.placesUnit}
            </span>
            <span className="text-[10px] font-bold text-blue-900 bg-blue-100/90 px-1.5 py-0.5 rounded-lg border border-blue-200">
              {data.totalCoveragePct2028}%
            </span>
          </div>
        </div>
      </div>

      {/* Action button */}
      <div className="pt-3.5 mt-2 border-t border-slate-100">
        <button
          onClick={onToggleSelect}
          className={`w-full py-2.5 px-3.5 rounded-2xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
            isSelected
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:bg-blue-700'
              : 'bg-slate-100 text-slate-800 hover:bg-blue-600 hover:text-white hover:shadow-md'
          }`}
        >
          {isSelected ? labels.closeBtn : labels.detailsBtn}
          {isSelected ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
