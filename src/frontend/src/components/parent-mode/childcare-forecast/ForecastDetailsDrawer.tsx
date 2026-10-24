import { Info, Sparkles, X } from 'lucide-react';
import type React from 'react';
import type { Language } from '../../../i18n/types';
import type { DistrictDetailsDto } from '../../../types/contracts';
import type { ChildAgeCohort } from '../FamilyAgeCohortSelector';
import {
  formatKindergartensCount,
  formatKindergartensLabel,
  formatNurseriesCount,
  formatSchoolsCount,
  formatSchoolsLabel,
  formatPlacesUnit,
  formatToddlerInfraBreakdown,
  getDrawerLabels,
  getParentPracticalInsight,
} from '../../../i18n/childcareForecastI18n';

export interface ForecastDetailsDrawerProps {
  isOpen: boolean;
  activeDistrictData: DistrictDetailsDto | null;
  activeCohort: ChildAgeCohort;
  onClose: () => void;
  language: Language;
  localizeDistrictName: (name: string | null | undefined, lang: Language) => string;
  recommendationRef: React.RefObject<HTMLDivElement | null>;
}

export function ForecastDetailsDrawer({
  isOpen,
  activeDistrictData,
  activeCohort,
  onClose,
  language,
  localizeDistrictName,
  recommendationRef,
}: ForecastDetailsDrawerProps) {
  const labels = getDrawerLabels(language);

  return (
    <div className={`drawer-expandable ${isOpen ? 'is-open' : ''}`}>
      <div className="overflow-hidden" ref={recommendationRef}>
        {activeDistrictData && (
          <div className="p-6 sm:p-7 rounded-3xl bg-linear-to-b from-indigo-50/40 via-white to-white border border-indigo-200/90 shadow-xl shadow-indigo-950/8 text-slate-900 space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  {labels.recommendationBadge}
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {localizeDistrictName(activeDistrictData.districtName, language)} ({activeDistrictData.districtRoman})
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                aria-label={labels.close}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Practical Parent Guidance */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-sm text-indigo-950 leading-relaxed flex items-start gap-3">
              <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5 text-indigo-900">
                  {labels.guidelinesTitle}
                </span>
                <p className="text-slate-700 text-xs sm:text-sm">
                  {getParentPracticalInsight(activeDistrictData, activeCohort, language)}
                </p>
              </div>
            </div>

            {/* 4 Quantitative Metric Cards tailored to Active Age Group */}
            {(() => {
              if (activeCohort === 'infant') {
                const nurseriesPublic = activeDistrictData.educationAndCare.nurseriesPublicCount;
                const nurseriesPrivateAndContracted =
                  activeDistrictData.educationAndCare.nurseriesContractedCount +
                  activeDistrictData.educationAndCare.nurseriesPrivateCount;
                const clubs = activeDistrictData.educationAndCare.kidsClubsCount;
                const carePlaces = activeDistrictData.educationAndCare.totalCarePlaces0To3;
                const projectedInfants2028 = activeDistrictData.forecastsAndB2B.forecastedAge0To3_2028;
                const currentInfants = activeDistrictData.demographics.age0To3;
                const balance = carePlaces - projectedInfants2028;

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    {/* 1. Infant Population: Current vs. 2028 Forecast */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                      <div className="text-slate-500 font-medium">{labels.toddlersTitle}</div>
                      <div className="text-xl font-black text-indigo-700">
                        {projectedInfants2028.toLocaleString()} <span className="text-xs font-semibold text-slate-500">{labels.childrenUnit2028}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {labels.currently} <span className="font-bold text-slate-700">{currentInfants.toLocaleString()}</span> {labels.children}
                      </div>
                    </div>

                    {/* 2. Locations and Balance: Current Base vs. 2028 Balance */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                      <div className="text-slate-500 font-medium">{labels.nurseryBalanceTitle}</div>
                      <div className={`text-xl font-black ${balance < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {balance >= 0 ? `+${balance.toLocaleString()}` : balance.toLocaleString()}{' '}
                        <span className="text-xs font-semibold text-slate-500">
                          {formatPlacesUnit(balance, language)} ({balance < 0 ? labels.deficitUnit2028 : labels.balanceUnit2028})
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {labels.currentBase} <span className="font-bold text-slate-700">{carePlaces.toLocaleString()}</span> {formatPlacesUnit(carePlaces, language)}
                      </div>
                    </div>

                    {/* 3. Network of Daycare Centers and Clubs */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                      <div className="text-slate-500 font-medium">{labels.nurseryInfraTitle}</div>
                      <div className="text-xl font-black text-slate-900">
                        {nurseriesPublic + nurseriesPrivateAndContracted + clubs} <span className="text-xs font-semibold text-slate-500">{labels.facilities}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {formatToddlerInfraBreakdown(nurseriesPublic, nurseriesPrivateAndContracted, clubs, language)}
                      </div>
                    </div>

                    {/* 4. Recruitment and Onboarding Conditions */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                      <div className="text-slate-500 font-medium">{labels.standardTitle}</div>
                      <div className="text-xl font-black text-amber-700">
                        {carePlaces > 0 ? `${Math.round(carePlaces / Math.max(1, nurseriesPublic + nurseriesPrivateAndContracted + clubs))} ${labels.placesPerFacility}` : '—'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {balance >= 0 ? labels.highAdaptation : labels.earlyEnrollment}
                      </div>
                    </div>
                  </div>
                );
              }

              if (activeCohort === 'preschool') {
                const kindergartenPlaces = activeDistrictData.educationAndCare.kindergartenPlacesTotal;
                const kindergartenCount = activeDistrictData.educationAndCare.kindergartensCount;
                const projectedPreschoolers2028 = activeDistrictData.forecastsAndB2B.forecastedAge4To6_2028;
                const currentPreschoolers = activeDistrictData.demographics.age4To6;
                const avgPerKindergarten = kindergartenCount > 0 ? Math.round(kindergartenPlaces / kindergartenCount) : 0;
                const kindergartenBalance = kindergartenPlaces - projectedPreschoolers2028;
                const ratio = (kindergartenPlaces / Math.max(1, projectedPreschoolers2028)).toFixed(2);

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    {/* 1. Preschooler Population */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                      <div className="text-slate-500 font-medium">{labels.preschoolersTitle}</div>
                      <div className="text-xl font-black text-indigo-700">
                        {projectedPreschoolers2028.toLocaleString()} <span className="text-xs font-semibold text-slate-500">{labels.childrenUnit2028}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {labels.currently} <span className="font-bold text-slate-700">{currentPreschoolers.toLocaleString()}</span> {labels.children}
                      </div>
                    </div>

                    {/* 2. Locations and Balance: Current Base vs. 2028 Balance */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                      <div className="text-slate-500 font-medium">{labels.kgBalanceTitle}</div>
                      <div className={`text-xl font-black ${kindergartenBalance < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {kindergartenBalance >= 0 ? `+${kindergartenBalance.toLocaleString()}` : kindergartenBalance.toLocaleString()}{' '}
                        <span className="text-xs font-semibold text-slate-500">
                          {formatPlacesUnit(kindergartenBalance, language)} ({kindergartenBalance < 0 ? labels.deficitUnit2028 : labels.reserveUnit2028})
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {labels.currentBase} <span className="font-bold text-slate-700">{kindergartenPlaces.toLocaleString()}</span> {formatPlacesUnit(kindergartenPlaces, language)}
                      </div>
                    </div>

                    {/* 3. Chain of Kindergartens */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                      <div className="text-slate-500 font-medium">{labels.kgInfraTitle}</div>
                      <div className="text-xl font-black text-slate-900">
                        {formatKindergartensLabel(kindergartenCount, language)}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {labels.avgPerKg(avgPerKindergarten)}
                      </div>
                    </div>

                    {/* 4. Preschool Education Accessibility Index */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                      <div className="text-slate-500 font-medium">{labels.kgStandardTitle}</div>
                      <div className="text-xl font-black text-emerald-700">
                        {ratio}x <span className="text-xs font-semibold text-slate-500">{labels.placesPerChild}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {kindergartenBalance >= 0 ? labels.universalAccess : labels.standardEnrollment}
                      </div>
                    </div>
                  </div>
                );
              }

              if (activeCohort === 'school') {
                const schools = activeDistrictData.educationAndCare.primarySchoolsCount;
                const schoolCapacity = schools * 350;
                const students = activeDistrictData.educationAndCare.primarySchoolStudentsTotal;
                const registeredChildren7To14 = activeDistrictData.demographics.age7To14;
                const schoolBalance = schoolCapacity - students;
                const avgClass = activeDistrictData.educationAndCare.avgStudentsPerClass;

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    {/* 1. Primary School Student Population */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                      <div className="text-slate-500 font-medium">{labels.studentsTitle}</div>
                      <div className="text-xl font-black text-indigo-700">
                        {students.toLocaleString()} <span className="text-xs font-semibold text-slate-500">{labels.students}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {labels.registeredWord} <span className="font-bold text-slate-700">{registeredChildren7To14.toLocaleString()}</span> {labels.children}
                      </div>
                    </div>

                    {/* 2. Spaces and Balance: Capacity vs. Balance 2028 */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                      <div className="text-slate-500 font-medium">{labels.schoolBalanceTitle}</div>
                      <div className={`text-xl font-black ${schoolBalance < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {schoolBalance >= 0 ? `+${schoolBalance.toLocaleString()}` : schoolBalance.toLocaleString()}{' '}
                        <span className="text-xs font-semibold text-slate-500">
                          {formatPlacesUnit(schoolBalance, language)} ({schoolBalance < 0 ? labels.deficitUnit2028 : labels.reserveUnit2028})
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {labels.estimatedCapacity} <span className="font-bold text-slate-700">{schoolCapacity.toLocaleString()}</span> {formatPlacesUnit(schoolCapacity, language)}
                      </div>
                    </div>

                    {/* 3. Network of Primary Schools */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                      <div className="text-slate-500 font-medium">{labels.schoolInfraTitle}</div>
                      <div className="text-xl font-black text-slate-900">
                        {formatSchoolsLabel(schools, language)}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {labels.avgPerSchool(schools > 0 ? Math.round(students / schools) : 0)}
                      </div>
                    </div>

                    {/* 4. Learning Conditions and Class Size */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                      <div className="text-slate-500 font-medium">{labels.comfortTitle}</div>
                      <div className="text-xl font-black text-amber-700">
                        {avgClass} <span className="text-xs font-semibold text-slate-500">{labels.studentsPerClass}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {avgClass <= 18 ? labels.cosyClasses : avgClass <= 20.5 ? labels.normalClasses : labels.denseClasses}
                      </div>
                    </div>
                  </div>
                );
              }

              // activeCohort === 'all'
              const nurseriesPublic = activeDistrictData.educationAndCare.nurseriesPublicCount;
              const nurseriesTotal =
                nurseriesPublic +
                activeDistrictData.educationAndCare.nurseriesContractedCount +
                activeDistrictData.educationAndCare.nurseriesPrivateCount +
                activeDistrictData.educationAndCare.kidsClubsCount;
              const totalEduFacilities =
                nurseriesTotal +
                activeDistrictData.educationAndCare.kindergartensCount +
                activeDistrictData.educationAndCare.primarySchoolsCount;
              const totalCapacity =
                activeDistrictData.educationAndCare.totalCarePlaces0To3 +
                activeDistrictData.educationAndCare.kindergartenPlacesTotal +
                activeDistrictData.educationAndCare.primarySchoolsCount * 350;
              const projectedInfants2028 = activeDistrictData.forecastsAndB2B.forecastedAge0To3_2028;
              const projectedPreschoolers2028 = activeDistrictData.forecastsAndB2B.forecastedAge4To6_2028;
              const students = activeDistrictData.educationAndCare.primarySchoolStudentsTotal;
              const totalChildrenSum = projectedInfants2028 + projectedPreschoolers2028 + students;
              const totalBalance = totalCapacity - totalChildrenSum;
              const avgClass = activeDistrictData.educationAndCare.avgStudentsPerClass;

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  {/* 1. Total Child Population: Age Groups & 2028 Forecast */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                    <div className="text-slate-500 font-medium">{labels.childrenAllTitle}</div>
                    <div className="text-xl font-black text-indigo-700">
                      {totalChildrenSum.toLocaleString()} <span className="text-xs font-semibold text-slate-500">{labels.childrenUnit2028}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      0–3: {projectedInfants2028.toLocaleString()} | 4–6: {projectedPreschoolers2028.toLocaleString()} | SP: {students.toLocaleString()}
                    </div>
                  </div>

                  {/* 2. Integrated Base Capacity & Balance 2028 */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                    <div className="text-slate-500 font-medium">{labels.allBalanceTitle}</div>
                    <div className={`text-xl font-black ${totalBalance < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {totalBalance >= 0 ? `+${totalBalance.toLocaleString()}` : totalBalance.toLocaleString()}{' '}
                      <span className="text-xs font-semibold text-slate-500">
                        {formatPlacesUnit(totalBalance, language)} ({totalBalance < 0 ? labels.deficitUnit2028 : labels.balanceUnit2028})
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {labels.totalBase} <span className="font-bold text-slate-700">{totalCapacity.toLocaleString()}</span> {formatPlacesUnit(totalCapacity, language)}
                    </div>
                  </div>

                  {/* 3. Comprehensive Facilities for Children in the District */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                    <div className="text-slate-500 font-medium">{labels.allInfraTitle}</div>
                    <div className="text-xl font-black text-slate-900">
                      {totalEduFacilities} <span className="text-xs font-semibold text-slate-500">{labels.facilitiesTotal}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {formatNurseriesCount(nurseriesTotal, language)}, {formatKindergartensCount(activeDistrictData.educationAndCare.kindergartensCount, language)}, {formatSchoolsCount(activeDistrictData.educationAndCare.primarySchoolsCount, language)}
                    </div>
                  </div>

                  {/* 4. School Conditions and District Standard */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                    <div className="text-slate-500 font-medium">{labels.allStandardTitle}</div>
                    <div className="text-xl font-black text-amber-700">
                      {avgClass} <span className="text-xs font-semibold text-slate-500">{labels.studentsPerClass}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {labels.familyFriendlyProfile}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
