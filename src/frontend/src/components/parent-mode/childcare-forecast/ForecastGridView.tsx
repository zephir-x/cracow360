import { ArrowRight, X } from 'lucide-react';
import type { Language } from '../../../i18n/types';
import type { DistrictDetailsDto, DistrictSummaryDto } from '../../../types/contracts';
import type { ChildAgeCohort } from '../FamilyAgeCohortSelector';
import { getDistrictCohortData } from './forecastCalculations';
import { formatPlacesUnit } from '../../../i18n/modules';
import type { ForecastFilter } from './types';

export interface ForecastGridViewProps {
  districts: DistrictSummaryDto[];
  detailsMap: Map<number, DistrictDetailsDto>;
  activeCohort: ChildAgeCohort;
  activeFilter: ForecastFilter;
  currentPage: number;
  selectedDistrictId: number | null;
  onSelectDistrict: (districtId: number, shouldScroll?: boolean) => void;
  language: Language;
  localizeDistrictName: (name: string | null | undefined, lang: Language) => string;
  whiteSpotBadge?: string;
  balancedBadge?: string;
  surplusBadge?: string;
  placesUnit?: string;
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
  whiteSpotBadge: _whiteSpotBadge,
  balancedBadge: _balancedBadge,
  surplusBadge: _surplusBadge,
  placesUnit: _placesUnit,
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
            className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-3 shadow-xs ${
              isSelected
                ? 'border-blue-600 ring-2 ring-blue-500/30 bg-blue-50/50 shadow-md'
                : status.isWhiteSpot
                ? 'bg-slate-50/70 border-rose-200/80 hover:border-rose-300'
                : status.isSurplus
                ? 'bg-slate-50/70 border-emerald-200/80 hover:border-emerald-300'
                : 'bg-slate-50/70 border-slate-200/80 hover:border-blue-200'
            }`}
          >
            {/* Top Bar: District Tag & Name + Status Badge */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {language === 'en' ? 'District' : language === 'ua' ? 'Район' : 'Dzielnica'} {district.districtRoman}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    status.isWhiteSpot
                      ? 'bg-rose-100 text-rose-800'
                      : status.isSurplus
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {cardData.statusBadge}
                </span>
              </div>

              <h3 className="text-sm font-black text-slate-900 mt-1 leading-snug">
                {localizeDistrictName(district.districtName, language)}
              </h3>
            </div>

            {/* 2-Column Comparison Box: Places paired with Balance */}
            <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              {/* Left: Current Places */}
              <div className="space-y-0.5">
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide truncate">
                  {cardData.placesShortLabel}
                </div>
                <div className="text-sm font-black text-slate-900">
                  {cardData.placesCount}{' '}
                  <span className="text-[10px] font-medium text-slate-500">
                    {formatPlacesUnit(cardData.placesRaw, language)}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {cardData.facilitiesSubtitle}
                </div>
              </div>

              {/* Right: Places Balance */}
              <div className="space-y-0.5 pl-2 border-l border-slate-100">
                <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wide truncate">
                  {language === 'en' ? 'Places Balance' : language === 'ua' ? 'Баланс Місць' : 'Bilans Miejsc'}
                </div>
                <div
                  className={`text-sm font-black ${
                    cardData.isNegativeBalance ? 'text-rose-600' : 'text-emerald-700'
                  }`}
                >
                  {cardData.balanceFormatted}{' '}
                  <span className="text-[10px] font-medium text-slate-500">
                    {formatPlacesUnit(cardData.balanceRaw, language)}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {cardData.balanceSubtitle}
                </div>
              </div>
            </div>

            {/* Middle: Progress / Standard Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium text-[11px]">
                  {cardData.coverageLabel}
                </span>
                <span className="font-extrabold text-slate-900 text-xs">
                  {cardData.coverageValue}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    status.isWhiteSpot
                      ? 'bg-rose-500'
                      : status.isSurplus
                      ? 'bg-emerald-500'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${cardData.progressPercent}%` }}
                />
              </div>
            </div>

            {/* Card Footer: Current Children + Modern Animated Action Button */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-200/60 gap-2">
              <span className="text-[11px] font-semibold text-slate-700 bg-slate-100/90 border border-slate-200/80 px-2.5 py-1 rounded-lg shrink-0">
                {language === 'en' ? 'Children:' : language === 'ua' ? 'Діти:' : 'Dzieci:'}{' '}
                <span className="text-blue-700 font-black">
                  {cardData.forecastChildren}
                </span>{' '}
                {cardData.forecastChildrenUnit}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectDistrict(district.districtId, true);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 shadow-2xs shrink-0 cursor-pointer active:scale-95 group ${
                  isSelected
                    ? 'bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 hover:border-rose-600 shadow-xs'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200/80 hover:border-blue-600 shadow-xs'
                }`}
                title={isSelected ? closeCard : recommendationActionBtn}
              >
                <span>{isSelected ? closeCard : recommendationActionBtn}</span>
                {isSelected ? (
                  <X className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-90" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
