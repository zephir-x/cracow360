import { ArrowRight, X } from 'lucide-react';
import type { Language } from '../../../i18n/types';
import type { DistrictDetailsDto, DistrictSummaryDto } from '../../../types/contracts';
import type { ChildAgeCohort } from '../FamilyAgeCohortSelector';
import { getDistrictCohortData } from './forecastCalculations';
import type { ForecastFilter } from './types';

export interface ForecastGridViewProps {
  districts: DistrictSummaryDto[];
  detailsMap: Map<number, DistrictDetailsDto>;
  activeCohort: ChildAgeCohort;
  activeFilter: ForecastFilter;
  currentPage: number;
  selectedDistrictId: number | null;
  onSelectDistrict: (districtId: number) => void;
  language: Language;
  localizeDistrictName: (name: string | null | undefined, lang: Language) => string;
  whiteSpotBadge: string;
  balancedBadge: string;
  surplusBadge: string;
  placesUnit: string;
  closeCard: string;
  recommendationActionBtn: string;
}

export function ForecastGridView({
  districts,
  detailsMap,
  activeCohort,
  activeFilter,
  currentPage,
  selectedDistrictId,
  onSelectDistrict,
  language,
  localizeDistrictName,
  whiteSpotBadge,
  balancedBadge,
  surplusBadge,
  placesUnit,
  closeCard,
  recommendationActionBtn,
}: ForecastGridViewProps) {
  return (
    <div
      key={`grid_${activeCohort}_${activeFilter}_${currentPage}`}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 animate-fade-in"
    >
      {districts.map((district) => {
        const details = detailsMap.get(district.districtId);
        const isSelected = selectedDistrictId === district.districtId;
        const cardData = getDistrictCohortData(details, activeCohort, language);
        const status = cardData.status;

        return (
          <div
            key={district.districtId}
            onClick={() => onSelectDistrict(district.districtId)}
            className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 shadow-xs ${
              isSelected
                ? 'border-blue-600 ring-2 ring-blue-500/30 bg-blue-50/50 shadow-md'
                : status.isWhiteSpot
                ? 'bg-slate-50/70 border-rose-200/80 hover:bg-rose-50/40 hover:border-rose-300'
                : status.isSurplus
                ? 'bg-slate-50/70 border-emerald-200/80 hover:bg-emerald-50/40 hover:border-emerald-300'
                : 'bg-slate-50/70 border-slate-200/80 hover:bg-blue-50/40 hover:border-blue-200'
            }`}
          >
            {/* Top Bar: District Tag & Name + Status Badge */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {language === 'ua' ? 'Район' : language === 'en' ? 'District' : 'Dzielnica'} {district.districtRoman}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    status.isWhiteSpot
                      ? 'bg-rose-100 text-rose-800'
                      : status.isSurplus
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {status.isWhiteSpot
                    ? whiteSpotBadge
                    : status.isSurplus
                    ? surplusBadge
                    : balancedBadge}
                </span>
              </div>

              <h3 className="text-sm font-black text-slate-900 mt-1 leading-snug">
                {localizeDistrictName(district.districtName, language)}
              </h3>
            </div>

            {/* 2-Column Comparison Box: Places paired with Places */}
            <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              {/* Left: Current Places */}
              <div className="space-y-0.5">
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide truncate">
                  {cardData.placesShortLabel}
                </div>
                <div className="text-sm font-black text-slate-900">
                  {cardData.placesCount}{' '}
                  <span className="text-[10px] font-medium text-slate-500">
                    {placesUnit}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {cardData.facilitiesSubtitle}
                </div>
              </div>

              {/* Right: Places Balance (2028) */}
              <div className="space-y-0.5 pl-2 border-l border-slate-100">
                <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wide truncate">
                  {language === 'en' ? 'Places Balance' : language === 'ua' ? 'Баланс Місць' : 'Bilans Miejsc'}{' '}
                  <span className="text-blue-600 font-bold">(2028)</span>
                </div>
                <div
                  className={`text-sm font-black ${
                    cardData.isNegativeBalance ? 'text-rose-600' : 'text-emerald-700'
                  }`}
                >
                  {cardData.balanceFormatted}{' '}
                  <span className="text-[10px] font-medium text-slate-500">
                    {placesUnit}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {cardData.balanceSubtitle}
                </div>
              </div>
            </div>

            {/* Middle: Progress / Standard Bar with Amber-500 for Balanced */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium text-[11px]">
                  {cardData.coverageLabel}
                </span>
                <span className="font-extrabold text-slate-900 text-xs">
                  {cardData.coverageValue}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200/80 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    status.isWhiteSpot
                      ? 'bg-rose-500'
                      : status.isSurplus
                      ? 'bg-emerald-500'
                      : 'bg-amber-500'
                  }`}
                  style={{
                    width: `${Math.min(100, Math.max(8, cardData.progressPercent))}%`,
                  }}
                />
              </div>
            </div>

            {/* Card Footer: Prognoza 2028 Dzieci Context + Action Button */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-200/60 gap-2">
              <span className="text-[11px] font-semibold text-slate-700 bg-slate-100/90 border border-slate-200/80 px-2.5 py-1 rounded-lg shrink-0">
                {language === 'en' ? 'Forecast:' : language === 'ua' ? 'Прогноз:' : 'Prognoza:'}{' '}
                <span className="text-blue-700 font-black">
                  {cardData.forecastChildren}
                </span>{' '}
                {cardData.forecastChildrenUnit}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectDistrict(district.districtId);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200/80'
                }`}
              >
                <span>
                  {isSelected
                    ? closeCard
                    : recommendationActionBtn}
                </span>
                {isSelected ? (
                  <X className="w-3.5 h-3.5" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
