import {
  Baby,
  Bus,
  HeartHandshake,
  MapPin,
  RotateCcw,
  Sparkles,
  Trees,
} from 'lucide-react';
import { useTranslation } from '../../../i18n/I18nContext';
import type { InvestorSimulatorLabels } from '../../../i18n/modules';
import type { DistrictSummaryDto } from '../../../types/contracts';
import { localizeDistrictName } from '../../../utils/districtLocalization';
import type { SimulatorPresetId } from './types';

export interface DistrictSimulatorToolbarProps {
  districts: DistrictSummaryDto[];
  selectedDistrictId: number;
  onSelectDistrict: (districtId: number) => void;
  activePreset: SimulatorPresetId;
  onApplyPreset: (preset: SimulatorPresetId) => void;
  onReset: () => void;
  totalAddedItemsCount: number;
  labels: InvestorSimulatorLabels;
}

export function DistrictSimulatorToolbar({
  districts,
  selectedDistrictId,
  onSelectDistrict,
  activePreset,
  onApplyPreset,
  onReset,
  totalAddedItemsCount,
  labels,
}: DistrictSimulatorToolbarProps) {
  const { language } = useTranslation();

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 border border-slate-200/90 space-y-4 shadow-2xs">
      {/* Row 1: District Selector (Left) & Active Changes Status + Reset (Right) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3.5 border-b border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
          <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700 shrink-0">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{labels.selectDistrictLabel}</span>
          </div>

          <select
            value={selectedDistrictId}
            onChange={(e) => onSelectDistrict(Number(e.target.value))}
            aria-label={labels.selectDistrictLabel}
            className="w-full sm:w-auto sm:min-w-65 px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs sm:text-sm font-bold shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition cursor-pointer"
          >
            {districts.map((d) => (
              <option key={d.districtId} value={d.districtId}>
                {localizeDistrictName(d.districtName, language)}
              </option>
            ))}
          </select>
        </div>

        {/* Status Badge & Reset Button */}
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <span
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold border shrink-0 transition ${
              totalAddedItemsCount > 0
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs shadow-blue-500/20'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>{labels.activeChangesBadge(totalAddedItemsCount)}</span>
          </span>

          <button
            type="button"
            onClick={onReset}
            disabled={totalAddedItemsCount === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span>{labels.resetBtn}</span>
          </button>
        </div>
      </div>

      {/* Row 2: Symmetrical Quick Test Packages Grid */}
      <div className="space-y-2">
        <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
          {labels.presetsLabel}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* 1. Family & Kids Package */}
          <button
            type="button"
            onClick={() => onApplyPreset('family_package')}
            className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
              activePreset === 'family_package'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs shadow-indigo-500/25'
                : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50'
            }`}
          >
            <Baby className="w-4 h-4 shrink-0" />
            <span className="truncate">{labels.presetFamily}</span>
          </button>

          {/* 2. Better Transit Package */}
          <button
            type="button"
            onClick={() => onApplyPreset('mobility_package')}
            className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
              activePreset === 'mobility_package'
                ? 'bg-sky-600 text-white border-sky-600 shadow-xs shadow-sky-500/25'
                : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300 hover:bg-sky-50/50'
            }`}
          >
            <Bus className="w-4 h-4 shrink-0" />
            <span className="truncate">{labels.presetMobility}</span>
          </button>

          {/* 3. Green District Package */}
          <button
            type="button"
            onClick={() => onApplyPreset('green_package')}
            className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
              activePreset === 'green_package'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs shadow-emerald-500/25'
                : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
            }`}
          >
            <Trees className="w-4 h-4 shrink-0" />
            <span className="truncate">{labels.presetGreen}</span>
          </button>

          {/* 4. Senior & Culture Package */}
          <button
            type="button"
            onClick={() => onApplyPreset('senior_culture_package')}
            className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
              activePreset === 'senior_culture_package'
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs shadow-amber-500/25'
                : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300 hover:bg-amber-50/50'
            }`}
          >
            <HeartHandshake className="w-4 h-4 shrink-0" />
            <span className="truncate">{labels.presetSenior}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
