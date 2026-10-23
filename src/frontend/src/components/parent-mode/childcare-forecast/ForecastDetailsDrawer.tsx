import { Info, Sparkles, X } from 'lucide-react';
import type React from 'react';
import type { Language } from '../../../i18n/types';
import type { DistrictDetailsDto } from '../../../types/contracts';
import type { ChildAgeCohort } from '../FamilyAgeCohortSelector';
import { getDrawerLabels, getParentPracticalInsight } from './forecastCalculations';

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
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-xs font-bold transition cursor-pointer shadow-2xs"
                title={labels.close}
              >
                <X className="w-3.5 h-3.5" />
                <span>{labels.close}</span>
              </button>
            </div>

            {/* Practical Parental Guidance Highlight */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-1.5">
              <div className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-indigo-600" />
                {labels.guidelinesTitle}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {getParentPracticalInsight(activeDistrictData, activeCohort, language)}
              </p>
            </div>

            {/* Standardized 4 Metrics Grid tailored to selected child cohort */}
            {(() => {
              if (activeCohort === 'infant') {
                const nurseriesPublic = activeDistrictData.educationAndCare.nurseriesPublicCount;
                const nurseriesPrivateAndContracted =
                  activeDistrictData.educationAndCare.nurseriesContractedCount +
                  activeDistrictData.educationAndCare.nurseriesPrivateCount;
                const clubs = activeDistrictData.educationAndCare.kidsClubsCount;
                const carePlaces = activeDistrictData.educationAndCare.totalCarePlaces0To3;
                const p03 = activeDistrictData.forecastsAndB2B.forecastedAge0To3_2028;
                const cur03 = activeDistrictData.demographics.age0To3;
                const bal = activeDistrictData.forecastsAndB2B.forecastedCarePlacesBalance_2028;

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    {/* 1. Infant Population: Current vs. 2028 Forecast */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                      <div className="text-slate-500 font-medium">{labels.toddlersTitle}</div>
                      <div className="text-xl font-black text-indigo-700">
                        {p03.toLocaleString()} <span className="text-xs font-semibold text-slate-500">{labels.childrenUnit2028}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {labels.currently} <span className="font-bold text-slate-700">{cur03.toLocaleString()}</span> {labels.children}
                      </div>
                    </div>

                    {/* 2. Locations and Balance: Current Base vs. 2028 Balance */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                      <div className="text-slate-500 font-medium">{labels.nurseryBalanceTitle}</div>
                      <div className={`text-xl font-black ${bal < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {bal >= 0 ? `+${bal.toLocaleString()}` : bal.toLocaleString()} <span className="text-xs font-semibold text-slate-500">{labels.balanceUnit2028}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {labels.currentBase} <span className="font-bold text-slate-700">{carePlaces.toLocaleString()}</span> {labels.places}
                      </div>
                    </div>

                    {/* 3. Network of Daycare Centers and Clubs */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                      <div className="text-slate-500 font-medium">{labels.nurseryInfraTitle}</div>
                      <div className="text-xl font-black text-slate-900">
                        {nurseriesPublic + nurseriesPrivateAndContracted + clubs} <span className="text-xs font-semibold text-slate-500">{labels.facilities}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {nurseriesPublic} {labels.municipalWord}, {nurseriesPrivateAndContracted} {labels.privateWord}, {clubs} {labels.clubsWord}
                      </div>
                    </div>

                    {/* 4. Recruitment and Onboarding Conditions */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                      <div className="text-slate-500 font-medium">{labels.standardTitle}</div>
                      <div className="text-xl font-black text-amber-700">
                        {carePlaces > 0 ? `${Math.round(carePlaces / Math.max(1, nurseriesPublic + nurseriesPrivateAndContracted + clubs))} ${labels.placesPerFacility}` : '—'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {bal >= 0 ? labels.highAdaptation : labels.earlyEnrollment}
                      </div>
                    </div>
                  </div>
                );
              }

              if (activeCohort === 'preschool') {
                const kgPlaces = activeDistrictData.educationAndCare.kindergartenPlacesTotal;
                const kgCount = activeDistrictData.educationAndCare.kindergartensCount;
                const p46 = activeDistrictData.forecastsAndB2B.forecastedAge4To6_2028;
                const cur46 = activeDistrictData.demographics.age4To6;
                const avgPerKg = kgCount > 0 ? Math.round(kgPlaces / kgCount) : 0;
                const kgBalance = kgPlaces - p46;
                const ratio = (kgPlaces / Math.max(1, p46)).toFixed(2);

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    {/* 1. Preschooler Population */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                      <div className="text-slate-500 font-medium">{labels.preschoolersTitle}</div>
                      <div className="text-xl font-black text-indigo-700">
                        {p46.toLocaleString()} <span className="text-xs font-semibold text-slate-500">{labels.childrenUnit2028}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {labels.currently} <span className="font-bold text-slate-700">{cur46.toLocaleString()}</span> {labels.children}
                      </div>
                    </div>

                    {/* 2. Locations and Balance: Current Base vs. 2028 Balance */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                      <div className="text-slate-500 font-medium">{labels.kgBalanceTitle}</div>
                      <div className={`text-xl font-black ${kgBalance < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {kgBalance >= 0 ? `+${kgBalance.toLocaleString()}` : kgBalance.toLocaleString()} <span className="text-xs font-semibold text-slate-500">{labels.balanceUnit2028}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {labels.currentBase} <span className="font-bold text-slate-700">{kgPlaces.toLocaleString()}</span> {labels.places}
                      </div>
                    </div>

                    {/* 3. Chain of Kindergartens */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                      <div className="text-slate-500 font-medium">{labels.kgInfraTitle}</div>
                      <div className="text-xl font-black text-slate-900">
                        {kgCount} <span className="text-xs font-semibold text-slate-500">{labels.kindergartens}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {labels.avgPerKg(avgPerKg)}
                      </div>
                    </div>

                    {/* 4. Preschool Education Accessibility Index */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                      <div className="text-slate-500 font-medium">{labels.kgStandardTitle}</div>
                      <div className="text-xl font-black text-emerald-700">
                        {ratio}x <span className="text-xs font-semibold text-slate-500">{labels.placesPerChild}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {kgBalance >= 0 ? labels.universalAccess : labels.standardEnrollment}
                      </div>
                    </div>
                  </div>
                );
              }

              if (activeCohort === 'school') {
                const schools = activeDistrictData.educationAndCare.primarySchoolsCount;
                const schoolCap = schools * 350;
                const students = activeDistrictData.educationAndCare.primarySchoolStudentsTotal;
                const cur714 = activeDistrictData.demographics.age7To14;
                const schoolBal = schoolCap - students;
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
                        {labels.registeredWord} <span className="font-bold text-slate-700">{cur714.toLocaleString()}</span> {labels.children}
                      </div>
                    </div>

                    {/* 2. Spaces and Balance: Capacity vs. Balance 2028 */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                      <div className="text-slate-500 font-medium">{labels.schoolBalanceTitle}</div>
                      <div className={`text-xl font-black ${schoolBal < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {schoolBal >= 0 ? `+${schoolBal.toLocaleString()}` : schoolBal.toLocaleString()} <span className="text-xs font-semibold text-slate-500">{labels.reserveUnit2028}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {labels.estimatedCapacity} <span className="font-bold text-slate-700">{schoolCap.toLocaleString()}</span> {labels.places}
                      </div>
                    </div>

                    {/* 3. Network of Primary Schools */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                      <div className="text-slate-500 font-medium">{labels.schoolInfraTitle}</div>
                      <div className="text-xl font-black text-slate-900">
                        {schools} <span className="text-xs font-semibold text-slate-500">{labels.primarySchools}</span>
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
              const p03 = activeDistrictData.forecastsAndB2B.forecastedAge0To3_2028;
              const p46 = activeDistrictData.forecastsAndB2B.forecastedAge4To6_2028;
              const students = activeDistrictData.educationAndCare.primarySchoolStudentsTotal;
              const totalChildrenSum = p03 + p46 + students;
              const totalBal = totalCapacity - totalChildrenSum;
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
                      0–3: {p03.toLocaleString()} | 4–6: {p46.toLocaleString()} | SP: {students.toLocaleString()}
                    </div>
                  </div>

                  {/* 2. Integrated Base Capacity & Balance 2028 */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                    <div className="text-slate-500 font-medium">{labels.allBalanceTitle}</div>
                    <div className={`text-xl font-black ${totalBal < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {totalBal >= 0 ? `+${totalBal.toLocaleString()}` : totalBal.toLocaleString()} <span className="text-xs font-semibold text-slate-500">{labels.balanceUnit2028}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {labels.totalBase} <span className="font-bold text-slate-700">{totalCapacity.toLocaleString()}</span> {labels.places}
                    </div>
                  </div>

                  {/* 3. Comprehensive Facilities for Children in the District */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                    <div className="text-slate-500 font-medium">{labels.allInfraTitle}</div>
                    <div className="text-xl font-black text-slate-900">
                      {totalEduFacilities} <span className="text-xs font-semibold text-slate-500">{labels.facilitiesTotal}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {nurseriesTotal} {labels.nurseriesWord}, {activeDistrictData.educationAndCare.kindergartensCount} {labels.kindergartensWord}, {activeDistrictData.educationAndCare.primarySchoolsCount} {labels.schoolsWord}
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
