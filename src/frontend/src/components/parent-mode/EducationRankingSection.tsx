import { GraduationCap } from 'lucide-react';
import { useTranslation } from '../../i18n/I18nContext';
import type { DistrictSummaryDto } from '../../types/contracts';

export interface EducationRankingSectionProps {
  districts: DistrictSummaryDto[];
}

export function EducationRankingSection({ districts }: EducationRankingSectionProps) {
  const { t, localizeDistrictName } = useTranslation();

  const topEducationDistricts = [...districts]
    .sort((a, b) => b.scores.educationScore - a.scores.educationScore)
    .slice(0, 6);

  return (
    <section className="rounded-3xl bg-white border border-blue-100 p-6 sm:p-8 shadow-xl shadow-blue-900/5 space-y-4">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-slate-900">
            {t.parent.rankingTitle}
          </h2>
          <p className="text-xs text-slate-500">
            {t.parent.rankingSubtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {topEducationDistricts.map((d, idx) => (
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
                {t.parent.education} <strong className="font-black text-slate-900">{d.scores.educationScore.toFixed(1)} {t.common.points}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
