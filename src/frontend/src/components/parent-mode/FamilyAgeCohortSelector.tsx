import {Baby, Check, CheckCircle2, GraduationCap, Layers, SlidersHorizontal, Smile} from 'lucide-react';
import { useTranslation } from '../../i18n/I18nContext';

export type ChildAgeCohort = 'all' | 'infant' | 'preschool' | 'school';

export interface FamilyAgeCohortSelectorProps {
  selectedCohort: ChildAgeCohort;
  onSelectCohort: (cohort: ChildAgeCohort) => void;
}

/// <summary>
/// Interactive child age cohort selector allowing parents to tailor the district ranking,
/// facility explorer, and walking isochrones to their family's exact life stage (0–3, 4–6, 7–14).
/// Completely sharp rendering without fractional transforms.
/// </summary>
export function FamilyAgeCohortSelector({
  selectedCohort,
  onSelectCohort,
}: FamilyAgeCohortSelectorProps) {
  const { t } = useTranslation();
  const cohortsDef = t.parent.cohorts;

  const handleCardClick = (cohort: ChildAgeCohort) => {
    // If the same cohort is clicked again, toggle back to 'all' for effortless exploration
    if (selectedCohort === cohort) {
      onSelectCohort('all');
    } else {
      onSelectCohort(cohort);
    }
  };

  return (
    <section className="rounded-3xl bg-white border border-blue-100 p-4 sm:p-8 shadow-xl shadow-blue-900/5 space-y-5 sm:space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 shrink-0">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {cohortsDef.sectionTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {cohortsDef.sectionSubtitle}
            </p>
          </div>
        </div>

        {/* Quick Reset / All Cohorts Button */}
        <button
          onClick={() => onSelectCohort('all')}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer self-center sm:self-auto shrink-0 ${
            selectedCohort === 'all'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 hover:border-blue-200'
          }`}
          title={cohortsDef.allLabel}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{cohortsDef.allLabel}</span>
        </button>
      </div>

      {/* 3 Cohort Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Cohort 1: Infant & Toddler (0–3) */}
        <div
          onClick={() => handleCardClick('infant')}
          className={`rounded-2xl p-5 sm:p-6 transition-all duration-150 cursor-pointer flex flex-col justify-between ${
            selectedCohort === 'infant'
              ? 'bg-linear-to-b from-blue-50/80 to-white border-2 border-blue-600 shadow-lg shadow-blue-900/10'
              : 'bg-slate-50/70 hover:bg-blue-50/30 border-2 border-slate-200/80 hover:border-blue-300/80 shadow-xs'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition ${
                  selectedCohort === 'infant'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                    : 'bg-white text-blue-600 border-blue-200'
                }`}
              >
                <Baby className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-800 border border-blue-200">
                  {cohortsDef.infant.ageRange}
                </span>
                {selectedCohort === 'infant' && (
                  <CheckCircle2 className="w-5 h-5 text-blue-600 fill-blue-100" />
                )}
              </div>
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900">
                {cohortsDef.infant.title}
              </h3>
              <p className="text-xs font-semibold text-blue-700 mt-0.5">
                {cohortsDef.infant.subtitle}
              </p>
            </div>

            <ul className="space-y-1.5 text-xs text-slate-600 pt-3 border-t border-slate-200/60">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{cohortsDef.infant.highlight1}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{cohortsDef.infant.highlight2}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{cohortsDef.infant.highlight3}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Cohort 2: Preschooler (4–6) */}
        <div
          onClick={() => handleCardClick('preschool')}
          className={`rounded-2xl p-5 sm:p-6 transition-all duration-150 cursor-pointer flex flex-col justify-between ${
            selectedCohort === 'preschool'
              ? 'bg-linear-to-b from-blue-50/80 to-white border-2 border-blue-600 shadow-lg shadow-blue-900/10'
              : 'bg-slate-50/70 hover:bg-blue-50/30 border-2 border-slate-200/80 hover:border-blue-300/80 shadow-xs'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition ${
                  selectedCohort === 'preschool'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                    : 'bg-white text-blue-600 border-blue-200'
                }`}
              >
                <Smile className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-800 border border-blue-200">
                  {cohortsDef.preschool.ageRange}
                </span>
                {selectedCohort === 'preschool' && (
                  <CheckCircle2 className="w-5 h-5 text-blue-600 fill-blue-100" />
                )}
              </div>
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900">
                {cohortsDef.preschool.title}
              </h3>
              <p className="text-xs font-semibold text-blue-700 mt-0.5">
                {cohortsDef.preschool.subtitle}
              </p>
            </div>

            <ul className="space-y-1.5 text-xs text-slate-600 pt-3 border-t border-slate-200/60">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{cohortsDef.preschool.highlight1}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{cohortsDef.preschool.highlight2}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{cohortsDef.preschool.highlight3}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Cohort 3: Elementary School Student (7–14) */}
        <div
          onClick={() => handleCardClick('school')}
          className={`rounded-2xl p-5 sm:p-6 transition-all duration-150 cursor-pointer flex flex-col justify-between ${
            selectedCohort === 'school'
              ? 'bg-linear-to-b from-blue-50/80 to-white border-2 border-blue-600 shadow-lg shadow-blue-900/10'
              : 'bg-slate-50/70 hover:bg-blue-50/30 border-2 border-slate-200/80 hover:border-blue-300/80 shadow-xs'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition ${
                  selectedCohort === 'school'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                    : 'bg-white text-blue-600 border-blue-200'
                }`}
              >
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-800 border border-blue-200">
                  {cohortsDef.school.ageRange}
                </span>
                {selectedCohort === 'school' && (
                  <CheckCircle2 className="w-5 h-5 text-blue-600 fill-blue-100" />
                )}
              </div>
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900">
                {cohortsDef.school.title}
              </h3>
              <p className="text-xs font-semibold text-blue-700 mt-0.5">
                {cohortsDef.school.subtitle}
              </p>
            </div>

            <ul className="space-y-1.5 text-xs text-slate-600 pt-3 border-t border-slate-200/60">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{cohortsDef.school.highlight1}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{cohortsDef.school.highlight2}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{cohortsDef.school.highlight3}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
