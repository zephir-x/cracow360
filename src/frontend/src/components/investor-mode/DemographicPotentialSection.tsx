import { TrendingUp } from 'lucide-react';
import type { DistrictSummaryDto } from '../../types/contracts';

export interface DemographicPotentialSectionProps {
  districts: DistrictSummaryDto[];
}

export function DemographicPotentialSection({ districts }: DemographicPotentialSectionProps) {
  return (
    <section className="rounded-3xl bg-white border border-blue-100 p-6 sm:p-8 shadow-xl shadow-blue-900/5 space-y-4">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-slate-900">
            Przegląd Potencjału Demograficznego 18 Dzielnic Krakowa
          </h2>
          <p className="text-xs text-slate-500">
            Zestawienie populacji i ocen bazowych zasilających modele predykcyjne
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {districts.slice(0, 9).map((d) => (
          <div
            key={d.districtId}
            className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900">{d.districtName}</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                {d.areaKm2} km²
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>
                Populacja: <strong>{d.totalPopulation.toLocaleString('pl-PL')}</strong>
              </span>
              <span>
                Edukacja: <strong>{d.scores.educationScore} pkt</strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
