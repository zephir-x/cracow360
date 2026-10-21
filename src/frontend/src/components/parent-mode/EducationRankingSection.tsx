import { MapPin, ShieldCheck } from 'lucide-react';
import type { DistrictSummaryDto } from '../../types/contracts';

export interface EducationRankingSectionProps {
  districts: DistrictSummaryDto[];
}

export function EducationRankingSection({ districts }: EducationRankingSectionProps) {
  const topEducationDistricts = [...districts]
    .sort((a, b) => b.scores.educationScore - a.scores.educationScore)
    .slice(0, 6);

  return (
    <section className="rounded-3xl bg-white border border-blue-100 p-6 sm:p-8 shadow-xl shadow-blue-900/5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Aktualny Ranking Dzielnic w Kategorii: Edukacja i Opieka (0–14 lat)
            </h2>
            <p className="text-xs text-slate-500">
              Zagregowane dane oświatowe dla 18 dzielnic (rejestry SIO i UMK)
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {topEducationDistricts.map((d, idx) => (
          <div
            key={d.districtId}
            className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-7 h-7 rounded-xl bg-blue-600 text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                #{idx + 1}
              </span>
              <div className="min-w-0">
                <div className="text-xs font-extrabold text-slate-900 truncate">
                  {d.districtName}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-blue-500" />
                  Populacja: {d.totalPopulation.toLocaleString('pl-PL')}
                </div>
              </div>
            </div>
            <div className="text-xs font-extrabold px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
              {d.scores.educationScore.toFixed(1)} pkt
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
