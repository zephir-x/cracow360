import { ArrowRight, X } from 'lucide-react';
import type { Language } from '../../../i18n/types';
import type { DistrictDetailsDto, DistrictSummaryDto } from '../../../types/contracts';
import type { ChildAgeCohort } from '../FamilyAgeCohortSelector';
import { getDistrictCohortData } from './forecastCalculations';
import type { ForecastFilter } from './types';

export interface ForecastTableViewProps {
  districts: DistrictSummaryDto[];
  detailsMap: Map<number, DistrictDetailsDto>;
  activeCohort: ChildAgeCohort;
  activeFilter: ForecastFilter;
  currentPage: number;
  selectedDistrictId: number | null;
  onSelectDistrict: (districtId: number) => void;
  language: Language;
  localizeDistrictName: (name: string | null | undefined, lang: Language) => string;
  placesUnit: string;
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
  placesUnit,
  closeCard,
  recommendationActionBtn,
}: ForecastTableViewProps) {
  const isEn = language === 'en';
  const isUa = language === 'ua';

  const colHeaders = {
    district: isEn ? 'District' : isUa ? 'Район' : 'Dzielnica',
    base: isEn ? 'Current Base' : isUa ? 'Поточна База' : 'Aktualna Baza',
    balance: isEn ? 'Places Balance (2028)' : isUa ? 'Баланс Місць (2028)' : 'Bilans Miejsc (2028)',
    coverage: isEn ? 'Coverage / Standard' : isUa ? 'Покриття / Стандарт' : 'Pokrycie / Standard',
    forecast: isEn ? 'Projected Children (2028)' : isUa ? 'Прогноз Дітей (2028)' : 'Prognoza Dzieci (2028)',
    details: isEn ? 'Details' : isUa ? 'Деталі' : 'Szczegóły',
  };

  return (
    <div
      key={`table_${activeCohort}_${activeFilter}_${currentPage}`}
      className="overflow-x-auto border border-slate-200/80 rounded-2xl animate-fade-in"
    >
      <table className="w-full text-left text-xs text-slate-600 border-collapse table-fixed">
        <colgroup>
          <col className="w-[28%]" />
          <col className="w-[18%]" />
          <col className="w-[20%]" />
          <col className="w-[20%]" />
          <col className="w-[14%]" />
        </colgroup>
        <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200/80">
          <tr>
            <th className="py-3 px-4">{colHeaders.district}</th>
            <th className="py-3 px-4">{colHeaders.base}</th>
            <th className="py-3 px-4 text-blue-600">{colHeaders.balance}</th>
            <th className="py-3 px-4">{colHeaders.coverage}</th>
            <th className="py-3 px-4">{colHeaders.forecast}</th>
            <th className="py-3 px-4 text-right">{colHeaders.details}</th>
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
                onClick={() => onSelectDistrict(district.districtId)}
                className={`transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/70 font-semibold'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="w-[28%] py-3 px-4">
                  <div className="font-extrabold text-slate-900 leading-snug">
                    {localizeDistrictName(district.districtName, language)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {isUa ? 'Район' : isEn ? 'District' : 'Dzielnica'} {district.districtRoman}
                  </div>
                </td>

                <td className="w-[18%] py-3 px-4">
                  <span className="font-bold text-slate-900">
                    {cardData.placesCount} {placesUnit}
                  </span>
                  <div className="text-[10px] text-slate-400">
                    {cardData.facilitiesSubtitle}
                  </div>
                </td>

                <td className="w-[20%] py-3 px-4">
                  <span
                    className={`font-black ${
                      cardData.isNegativeBalance ? 'text-rose-600' : 'text-emerald-700'
                    }`}
                  >
                    {cardData.balanceFormatted} {placesUnit}
                  </span>
                  <div className="text-[10px] text-slate-400">
                    {cardData.balanceSubtitle}
                  </div>
                </td>

                <td className="w-[20%] py-3 px-4">
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
                            Math.max(8, cardData.progressPercent)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </td>

                <td className="w-[14%] py-3 px-4 whitespace-nowrap">
                  <span className="font-bold text-slate-700">
                    {cardData.forecastChildren}
                  </span>{' '}
                  <span className="text-[10px] text-slate-400">
                    {cardData.forecastChildrenUnit}
                  </span>
                </td>

                <td className="w-[14%] py-3 px-4 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDistrict(district.districtId);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs cursor-pointer ${
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
