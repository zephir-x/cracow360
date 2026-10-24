import { ArrowRight, X } from 'lucide-react';
import type { Language } from '../../../i18n/types';
import type { DistrictDetailsDto, DistrictSummaryDto } from '../../../types/contracts';
import type { ChildAgeCohort } from '../FamilyAgeCohortSelector';
import { getDistrictCohortData } from './forecastCalculations';
import { formatPlacesUnit, getTableColumnHeaders } from '../../../i18n/childcareForecastI18n';
import type { ForecastFilter } from './types';

export interface ForecastTableViewProps {
  districts: DistrictSummaryDto[];
  detailsMap: Map<number, DistrictDetailsDto>;
  activeCohort: ChildAgeCohort;
  activeFilter: ForecastFilter;
  currentPage: number;
  selectedDistrictId: number | null;
  onSelectDistrict: (districtId: number, shouldScroll?: boolean) => void;
  language: Language;
  localizeDistrictName: (name: string | null | undefined, lang: Language) => string;
  placesUnit?: string;
  closeCard: string;
  recommendationActionBtn: string;
}

export function ForecastTableView({
  districts,
  detailsMap,
  activeCohort,
  activeFilter,
  currentPage,
  selectedDistrictId,
  onSelectDistrict,
  language,
  localizeDistrictName,
  placesUnit: _placesUnit,
  closeCard,
  recommendationActionBtn,
}: ForecastTableViewProps) {
  const colHeaders = getTableColumnHeaders(language);

  return (
    <div
      key={`table_${activeCohort}_${activeFilter}_${currentPage}`}
      className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs animate-fade-in"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs table-fixed">
          <thead className="bg-slate-50/90 text-slate-500 font-bold border-b border-slate-200">
            <tr>
              <th className="w-[24%] py-3 px-4">{colHeaders.district}</th>
              <th className="w-[16%] py-3 px-4">{colHeaders.base}</th>
              <th className="w-[18%] py-3 px-4">{colHeaders.balance}</th>
              <th className="w-[18%] py-3 px-4">{colHeaders.coverage}</th>
              <th className="w-[14%] py-3 px-4">{colHeaders.forecast}</th>
              <th className="w-[10%] py-3 px-4 text-right">{colHeaders.details}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {districts.map((district) => {
              const details = detailsMap.get(district.districtId);
              const isSelected = selectedDistrictId === district.districtId;
              const cardData = getDistrictCohortData(details, activeCohort, language);
              const status = cardData.status;

              return (
                <tr
                  key={district.districtId}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    isSelected ? 'bg-blue-50/60 font-medium' : ''
                  }`}
                >
                  <td className="w-[24%] py-3 px-4">
                    <div className="font-extrabold text-slate-900 leading-snug">
                      {localizeDistrictName(district.districtName, language)}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-slate-400">
                        {colHeaders.districtPrefix} {district.districtRoman}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
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
                  </td>

                  <td className="w-[16%] py-3 px-4">
                    <span className="font-bold text-slate-900">
                      {cardData.placesCount} {formatPlacesUnit(cardData.placesRaw, language)}
                    </span>
                    <div className="text-[10px] text-slate-400">
                      {cardData.facilitiesSubtitle}
                    </div>
                  </td>

                  <td className="w-[18%] py-3 px-4">
                    <span
                      className={`font-black ${
                        cardData.isNegativeBalance ? 'text-rose-600' : 'text-emerald-700'
                      }`}
                    >
                      {cardData.balanceFormatted} {formatPlacesUnit(cardData.balanceRaw, language)}
                    </span>
                    <div className="text-[10px] text-slate-400">
                      {cardData.balanceSubtitle}
                    </div>
                  </td>

                  <td className="w-[18%] py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">
                        {cardData.coverageValue}
                      </span>
                      <div className="w-16 h-1.5 rounded-full bg-slate-200 overflow-hidden hidden sm:block shrink-0">
                        <div
                          className={`h-full rounded-full ${
                            status.isWhiteSpot
                              ? 'bg-rose-500'
                              : status.isSurplus
                              ? 'bg-emerald-500'
                              : 'bg-amber-500'
                          }`}
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(10, cardData.progressPercent)
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {cardData.coverageLabel}
                    </div>
                  </td>

                  <td className="w-[14%] py-3 px-4">
                    <span className="font-bold text-slate-900">
                      {cardData.forecastChildren}
                    </span>
                    <div className="text-[10px] text-slate-400 truncate">
                      {cardData.forecastChildrenUnit}
                    </div>
                  </td>

                  <td className="w-[10%] py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDistrict(district.districtId, true);
                      }}
                      className={`inline-flex items-center justify-center p-2 rounded-xl text-xs font-bold transition-all duration-200 shadow-2xs shrink-0 cursor-pointer active:scale-95 group ${
                        isSelected
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 hover:border-rose-600 shadow-xs'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200/80 hover:border-blue-600 shadow-xs'
                      }`}
                      title={isSelected ? closeCard : recommendationActionBtn}
                    >
                      {isSelected ? (
                        <X className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-90" />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
