import {
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  Building,
  Baby,
  Users,
  Trees,
} from 'lucide-react';
import type { Language } from '../../../i18n/types';
import type { InvestorSimulatorLabels } from '../../../i18n/investorSimulatorI18n';
import { localizeDistrictName } from '../../../utils/districtLocalization';
import type { BaselineDistrictMetrics, SimulatorInputs } from './types';
import { DEFAULT_SIMULATOR_INPUTS } from './simulatorCalculations';

export interface DistrictSimulatorToolbarProps {
  districts: BaselineDistrictMetrics[];
  selectedDistrictId: number;
  onSelectDistrict: (id: number) => void;
  inputs: SimulatorInputs;
  onUpdateInputs: (newInputs: SimulatorInputs) => void;
  activeBaseline: BaselineDistrictMetrics | null;
  labels: InvestorSimulatorLabels;
  language: Language;
}

export function DistrictSimulatorToolbar({
  districts,
  selectedDistrictId,
  onSelectDistrict,
  inputs,
  onUpdateInputs,
  activeBaseline,
  labels,
  language,
}: DistrictSimulatorToolbarProps) {
  const isDefault =
    inputs.additionalNurseryPlaces === DEFAULT_SIMULATOR_INPUTS.additionalNurseryPlaces &&
    inputs.additionalCasCount === DEFAULT_SIMULATOR_INPUTS.additionalCasCount &&
    inputs.additionalPocketParks === DEFAULT_SIMULATOR_INPUTS.additionalPocketParks;

  const handleApplyPreset = (preset: 'municipal' | 'b2b' | 'green') => {
    switch (preset) {
      case 'municipal':
        onUpdateInputs({
          additionalNurseryPlaces: 120,
          additionalCasCount: 1,
          additionalPocketParks: 1,
        });
        break;
      case 'b2b':
        onUpdateInputs({
          additionalNurseryPlaces: 180,
          additionalCasCount: 0,
          additionalPocketParks: 0,
        });
        break;
      case 'green':
        onUpdateInputs({
          additionalNurseryPlaces: 0,
          additionalCasCount: 2,
          additionalPocketParks: 2,
        });
        break;
    }
  };

  return (
    <div className="rounded-3xl bg-slate-50/80 border border-slate-200/90 p-5 sm:p-6 space-y-5">
      {/* Top Row: District Selector & Reset button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 max-w-xl space-y-1.5">
          <label
            htmlFor="simulator-district-select"
            className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5"
          >
            <Building className="w-4 h-4 text-blue-600" />
            {labels.selectDistrictLabel}
          </label>
          <div className="relative">
            <select
              id="simulator-district-select"
              value={selectedDistrictId}
              onChange={(e) => onSelectDistrict(Number(e.target.value))}
              className="w-full text-sm font-bold py-2.5 px-3.5 pr-8 rounded-2xl bg-white border border-slate-300 text-slate-900 shadow-2xs hover:border-blue-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
            >
              <option value="" disabled>
                {labels.selectDistrictPlaceholder}
              </option>
              {districts.map((d) => (
                <option key={d.districtId} value={d.districtId}>
                  {localizeDistrictName(d.districtName, language)} ({d.districtRoman})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reset button */}
        <div className="self-end md:self-center shrink-0">
          <button
            type="button"
            onClick={() => onUpdateInputs(DEFAULT_SIMULATOR_INPUTS)}
            disabled={isDefault}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>{labels.resetLeversBtn}</span>
          </button>
        </div>
      </div>

      {/* Quick Presets Ribbon */}
      <div className="pt-2 border-t border-slate-200/70 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold text-slate-500 mr-1 flex items-center gap-1">
          <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
          {labels.presetTitle}
        </span>
        <button
          type="button"
          onClick={() => handleApplyPreset('municipal')}
          className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200/80 font-bold transition cursor-pointer"
        >
          {labels.presets.municipalPackage}
        </button>
        <button
          type="button"
          onClick={() => handleApplyPreset('b2b')}
          className="px-3 py-1.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-800 border border-violet-200/80 font-bold transition cursor-pointer"
        >
          {labels.presets.b2bNurseries}
        </button>
        <button
          type="button"
          onClick={() => handleApplyPreset('green')}
          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 font-bold transition cursor-pointer"
        >
          {labels.presets.greenAndSenior}
        </button>
      </div>

      {/* Baseline snapshot telemetry bar */}
      {activeBaseline && (
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900">
              {localizeDistrictName(activeBaseline.districtName, language)} ({activeBaseline.districtRoman})
            </span>
            <span className="text-slate-400">•</span>
            <span>{activeBaseline.population.toLocaleString()} mieszk.</span>
            <span className="text-slate-400">•</span>
            <span>{activeBaseline.areaKm2} km²</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1">
              <Baby className="w-3.5 h-3.5 text-indigo-600" />
              <span>Bilans 0–3:</span>
              <strong className={activeBaseline.baselineBalance2028 < 0 ? 'text-rose-700' : 'text-emerald-700'}>
                {activeBaseline.baselineBalance2028 >= 0 ? `+${activeBaseline.baselineBalance2028}` : activeBaseline.baselineBalance2028}
              </strong>
            </div>

            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-amber-600" />
              <span>Seniorzy (65+):</span>
              <strong className="text-slate-900">{activeBaseline.seniorSharePct}% ({activeBaseline.currentCasCount} CAS)</strong>
            </div>

            <div className="flex items-center gap-1">
              <Trees className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zieleń:</span>
              <strong className="text-slate-900">{activeBaseline.greenAreaM2PerCapita} m²/os. ({activeBaseline.pocketParksCount} parków)</strong>
            </div>

            <div className="flex items-center gap-1 text-blue-700 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Witalność: {activeBaseline.demographicVitalityScore.toFixed(1)}/100</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
