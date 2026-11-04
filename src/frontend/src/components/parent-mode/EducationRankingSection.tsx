import { useMemo } from 'react';
import { GraduationCap } from 'lucide-react';
import { useTranslation } from '../../i18n/I18nContext';
import type { DistrictSummaryDto } from '../../types/contracts';
import type { ChildAgeCohort } from './FamilyAgeCohortSelector';

export interface EducationRankingSectionProps {
  districts: DistrictSummaryDto[];
  selectedCohort?: ChildAgeCohort;
}

interface RankedDistrictItem {
  district: DistrictSummaryDto;
  score: number;
}

/// <summary>
/// Top 6 districts ranking in education and childcare, dynamically calibrated
/// to the family's active child age cohort (0–3 infant, 4–6 preschool, 7–14 school).
/// Animates card changes with soft blur, scale, and opacity transition.
/// </summary>
export function EducationRankingSection({
  districts,
  selectedCohort = 'all',
}: EducationRankingSectionProps) {
  const { t, localizeDistrictName } = useTranslation();

  // Compute composite score reflecting age-specific parental priorities
  const topRankedDistricts = useMemo<RankedDistrictItem[]>(() => {
    return [...districts]
      .map((d) => {
        let score = d.scores.educationScore;
        if (selectedCohort === 'infant') {
          // Infant priorities: Education & Early Care (45%) + Clean Air (25%) + Greenery/Parks (15%) + Safety (15%)
          score =
            d.scores.educationScore * 0.45 +
            d.scores.environmentScore * 0.25 +
            d.scores.greeneryScore * 0.15 +
            d.scores.safetyScore * 0.15;
        } else if (selectedCohort === 'preschool') {
          // Preschooler priorities: Education & Kindergartens (45%) + Playgrounds/Greenery (25%) + Safety (15%) + Mobility (15%)
          score =
            d.scores.educationScore * 0.45 +
            d.scores.greeneryScore * 0.25 +
            d.scores.safetyScore * 0.15 +
            d.scores.mobilityScore * 0.15;
        } else if (selectedCohort === 'school') {
          // School pupils priorities: Schools & Small classes (50%) + Pedestrian Safety (20%) + Sports/Greenery (15%) + Transit (15%)
          score =
            d.scores.educationScore * 0.5 +
            d.scores.safetyScore * 0.2 +
            d.scores.greeneryScore * 0.15 +
            d.scores.mobilityScore * 0.15;
        }
        return {
          district: d,
          score: Number(score.toFixed(1)),
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [districts, selectedCohort]);

  // Dynamic subtitle explaining current ranking criteria
  const subtitle = useMemo(() => {
    const subs = t.parent.cohorts.rankingSubtitles;
    if (selectedCohort === 'infant') return subs.infant;
    if (selectedCohort === 'preschool') return subs.preschool;
    if (selectedCohort === 'school') return subs.school;
    return subs.all;
  }, [selectedCohort, t]);

  // Dynamic score label: "Edukacja:" when viewing all facilities (100% education score),
  // or "Dopasowanie:" when viewing a blended cohort score tailored to the child's age
  const scoreLabel = selectedCohort === 'all' ? t.parent.education : t.parent.matchScore;

  return (
    <section className="rounded-3xl bg-white border border-blue-100 p-4 sm:p-8 shadow-xl shadow-blue-900/5 space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-3 border-b border-slate-100 pb-4 text-center sm:text-left">
        <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-slate-900">
            {t.parent.rankingTitle}
          </h2>
          <p className="text-xs text-slate-500">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Grid keyed by selectedCohort to trigger the identical blur + scale + opacity animation */}
      <div
        key={selectedCohort}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 animate-fade-in"
      >
        {topRankedDistricts.map((item, idx) => {
          const d = item.district;
          return (
            <div
              key={d.districtId}
              className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2.5 transition hover:border-blue-300 hover:shadow-md hover:shadow-blue-900/5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-[11px] font-extrabold flex items-center justify-center shrink-0">
                    #{idx + 1}
                  </span>
                  <span className="text-xs font-extrabold text-slate-900 truncate">
                    {localizeDistrictName(d.districtName)}
                  </span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                  {d.areaKm2} km²
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600 pt-0.5">
                <span>
                  {t.parent.population} <strong>{d.totalPopulation.toLocaleString()}</strong>
                </span>
                <span className="font-semibold text-blue-700">
                  {scoreLabel}{' '}
                  <strong className="font-black text-slate-900">
                    {item.score.toFixed(1)} {t.common.points}
                  </strong>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
