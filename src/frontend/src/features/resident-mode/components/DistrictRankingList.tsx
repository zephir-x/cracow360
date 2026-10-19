import { Trophy, Users } from 'lucide-react';
import type { DistrictSummaryDto } from '../../../types/contracts';
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
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-xl flex flex-col h-[640px]">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3.5 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Ranking 18 Dzielnic na Żywo</h3>
            <p className="text-[11px] text-slate-400">
              Kliknij dzielnicę na liście, aby wybrać ją do porównania (#1 lub #2)
            </p>
          </div>
        </div>
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          {districts.length} dzielnic
        </span>
      </div>

      {/* Scrollable Live Ranking List */}
      <div className="mt-3.5 flex-1 overflow-y-auto pr-1 space-y-2">
        {districts.map((district, index) => {
          const rank = index + 1;
          const isPrimary = district.districtId === selectedPrimaryId;
          const isSecondary = district.districtId === selectedSecondaryId;
          const barColor = getChoroplethColor(district.weightedQualityOfLifeIndex);

          return (
            <button
              key={district.districtId}
              onClick={() => onSelectDistrict(district.districtId)}
              className={`w-full text-left p-3 rounded-xl border transition cursor-pointer block ${
                isPrimary
                  ? 'bg-sky-500/15 border-sky-400/70 shadow-md'
                  : isSecondary
                  ? 'bg-fuchsia-500/15 border-fuchsia-400/70 shadow-md'
                  : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-md text-xs font-extrabold flex items-center justify-center shrink-0 ${
                      rank === 1
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : rank === 2
                        ? 'bg-slate-300/20 text-slate-200 border border-slate-400/40'
                        : rank === 3
                        ? 'bg-amber-700/25 text-amber-400 border border-amber-600/40'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    #{rank}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white truncate">
                        {district.districtName}
                      </span>
                      {isPrimary && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-500/30 text-sky-200 border border-sky-400/40 shrink-0">
                          #1
                        </span>
                      )}
                      {isSecondary && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-fuchsia-500/30 text-fuchsia-200 border border-fuchsia-400/40 shrink-0">
                          #2
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                      <span className="inline-flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-500" />
                        {district.totalPopulation.toLocaleString('pl-PL')} mieszk.
                      </span>
                      <span>•</span>
                      <span>{district.areaKm2} km²</span>
                    </div>
                  </div>
                </div>

                {/* Score Badge */}
                <div
                  className="text-xs font-extrabold px-2.5 py-1 rounded-lg shrink-0"
                  style={{
                    backgroundColor: `${barColor}20`,
                    color: barColor,
                    border: `1px solid ${barColor}45`,
                  }}
                >
                  {district.weightedQualityOfLifeIndex.toFixed(1)} pkt
                </div>
              </div>

              {/* Progress Bar + Mini Category Pill Summary */}
              <div className="mt-2.5 space-y-1.5">
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, Math.max(10, district.weightedQualityOfLifeIndex))}%`,
                      backgroundColor: barColor,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Mob: {district.scores.mobilityScore}</span>
                  <span>Edu: {district.scores.educationScore}</span>
                  <span>Ziel: {district.scores.greeneryScore}</span>
                  <span>Kult: {district.scores.cultureAndSeniorScore}</span>
                  <span>Środ: {district.scores.environmentScore}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
