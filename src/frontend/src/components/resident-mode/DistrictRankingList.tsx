import { Maximize2, Trophy, Users } from 'lucide-react';
import type { DistrictSummaryDto } from '../../types/contracts';
import { getChoroplethColor } from './KrakowChoroplethMap';

export interface DistrictRankingListProps {
  districts: DistrictSummaryDto[];
  selectedPrimaryId: number | null;
  selectedSecondaryId: number | null;
  onSelectDistrict: (districtId: number) => void;
}

export function DistrictRankingList({
  districts,
  selectedPrimaryId,
  selectedSecondaryId,
  onSelectDistrict,
}: DistrictRankingListProps) {
  return (
    <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-blue-100 p-5 shadow-xl shadow-blue-900/5 flex flex-col h-162.5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3.5 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-2xl bg-linear-to-br from-blue-600 to-sky-500 flex items-center justify-center text-white shadow-sm shadow-blue-600/20 shrink-0">
            <Trophy className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-extrabold text-slate-900 whitespace-nowrap">Ranking 18 Dzielnic</h3>
            <p className="text-[11px] text-slate-500 whitespace-nowrap">
              Kliknij dzielnicę, aby porównać
            </p>
          </div>
        </div>
        <span className="text-[11px] font-bold px-2.5 sm:px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shrink-0 whitespace-nowrap">
          {districts.length} dzielnic
        </span>
      </div>

      {/* Scrollable Live Ranking List */}
      <div className="mt-3.5 flex-1 overflow-y-auto pr-1.5 space-y-2.5">
        {districts.map((district, index) => {
          const rank = index + 1;
          const isPrimary = district.districtId === selectedPrimaryId;
          const isSecondary = district.districtId === selectedSecondaryId;
          const barColor = getChoroplethColor(district.weightedQualityOfLifeIndex);

          return (
            <button
              key={district.districtId}
              onClick={() => onSelectDistrict(district.districtId)}
              className={`w-full text-left p-3 rounded-2xl border cursor-pointer block transition-all duration-200 ${
                isPrimary
                  ? 'bg-blue-50/90 border-blue-500 shadow-md shadow-blue-600/10'
                  : isSecondary
                  ? 'bg-indigo-50/90 border-indigo-500 shadow-md shadow-indigo-600/10'
                  : 'bg-slate-50/70 border-slate-200/80 hover:bg-blue-50/40 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-lg text-xs font-extrabold flex items-center justify-center shrink-0 ${
                      rank === 1
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : rank === 2
                        ? 'bg-slate-200 text-slate-700 border border-slate-300'
                        : rank === 3
                        ? 'bg-orange-100 text-orange-800 border border-orange-300'
                        : 'bg-white text-slate-500 border border-slate-200'
                    }`}
                  >
                    #{rank}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold text-slate-900 truncate">
                        {district.districtName}
                      </span>
                      {isPrimary && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-blue-600 text-white shrink-0">
                          #1
                        </span>
                      )}
                      {isSecondary && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-indigo-600 text-white shrink-0">
                          #2
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 mt-1 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{district.totalPopulation.toLocaleString('pl-PL')} mieszk.</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Maximize2 className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{district.areaKm2} km²</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score Badge */}
                <div
                  className="text-xs font-extrabold px-2.5 py-1 rounded-xl shrink-0 tabular-nums min-w-18 text-center"
                  style={{
                    backgroundColor: `${barColor}15`,
                    color: barColor,
                    border: `1px solid ${barColor}40`,
                  }}
                >
                  {district.weightedQualityOfLifeIndex.toFixed(1)} pkt
                </div>
              </div>

              {/* Progress Bar + Mini Category Pill Summary across 8 Pillars (symmetrical 4x2 grid, tabular numbers) */}
              <div className="mt-2.5 space-y-1.5">
                <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300 ease-out"
                    style={{
                      width: `${Math.min(100, Math.max(10, district.weightedQualityOfLifeIndex))}%`,
                      backgroundColor: barColor,
                    }}
                  />
                </div>

                {/* 8 Urban Pillars with strictly fixed symmetrical 4x2 grid and tabular numbers */}
                <div className="pt-0.5 space-y-1 text-[9.5px] text-slate-500 tabular-nums">
                  <div className="grid grid-cols-4 gap-1">
                    <span className="flex items-center justify-between px-1.5 py-0.5 bg-slate-100/70 rounded">
                      <span className="text-slate-400 font-medium">Mob:</span>
                      <strong className="font-bold text-slate-700">{Number(district.scores.mobilityScore).toFixed(1)}</strong>
                    </span>
                    <span className="flex items-center justify-between px-1.5 py-0.5 bg-slate-100/70 rounded">
                      <span className="text-slate-400 font-medium">Edu:</span>
                      <strong className="font-bold text-slate-700">{Number(district.scores.educationScore).toFixed(1)}</strong>
                    </span>
                    <span className="flex items-center justify-between px-1.5 py-0.5 bg-slate-100/70 rounded">
                      <span className="text-slate-400 font-medium">Ziel:</span>
                      <strong className="font-bold text-slate-700">{Number(district.scores.greeneryScore).toFixed(1)}</strong>
                    </span>
                    <span className="flex items-center justify-between px-1.5 py-0.5 bg-slate-100/70 rounded">
                      <span className="text-slate-400 font-medium">Kult:</span>
                      <strong className="font-bold text-slate-700">{Number(district.scores.cultureAndSeniorScore).toFixed(1)}</strong>
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    <span className="flex items-center justify-between px-1.5 py-0.5 bg-slate-100/70 rounded">
                      <span className="text-slate-400 font-medium">Środ:</span>
                      <strong className="font-bold text-slate-700">{Number(district.scores.environmentScore).toFixed(1)}</strong>
                    </span>
                    <span className="flex items-center justify-between px-1.5 py-0.5 bg-slate-100/70 rounded">
                      <span className="text-slate-400 font-medium">Bez:</span>
                      <strong className="font-bold text-slate-700">{Number(district.scores.safetyScore).toFixed(1)}</strong>
                    </span>
                    <span className="flex items-center justify-between px-1.5 py-0.5 bg-slate-100/70 rounded">
                      <span className="text-slate-400 font-medium">Cena:</span>
                      <strong className="font-bold text-slate-700">{Number(district.scores.housingAffordabilityScore).toFixed(1)}</strong>
                    </span>
                    <span className="flex items-center justify-between px-1.5 py-0.5 bg-slate-100/70 rounded">
                      <span className="text-slate-400 font-medium">Demo:</span>
                      <strong className="font-bold text-slate-700">{Number(district.scores.demographicVitalityScore ?? 50).toFixed(1)}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
