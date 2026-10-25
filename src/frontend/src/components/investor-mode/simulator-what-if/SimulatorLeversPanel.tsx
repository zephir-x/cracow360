import {
  Baby,
  Coins,
  Minus,
  Plus,
  Sliders,
  Trees,
  Users,
} from 'lucide-react';
import type { InvestorSimulatorLabels } from '../../../i18n/investorSimulatorI18n';
import type { SimulatorInputs } from './types';

export interface SimulatorLeversPanelProps {
  inputs: SimulatorInputs;
  onChangeInputs: (newInputs: SimulatorInputs) => void;
  labels: InvestorSimulatorLabels;
  estimatedCapexPln: number;
  nurseryCapexPln: number;
  casCapexPln: number;
  parksCapexPln: number;
}

export function SimulatorLeversPanel({
  inputs,
  onChangeInputs,
  labels,
  estimatedCapexPln,
  nurseryCapexPln,
  casCapexPln,
  parksCapexPln,
}: SimulatorLeversPanelProps) {
  const setNursery = (val: number) => {
    const clamped = Math.max(0, Math.min(300, val));
    onChangeInputs({ ...inputs, additionalNurseryPlaces: clamped });
  };

  const setCas = (val: number) => {
    const clamped = Math.max(0, Math.min(3, val));
    onChangeInputs({ ...inputs, additionalCasCount: clamped });
  };

  const setParks = (val: number) => {
    const clamped = Math.max(0, Math.min(4, val));
    onChangeInputs({ ...inputs, additionalPocketParks: clamped });
  };

  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-6">
      {/* Header */}
      <div className="space-y-1 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
          <Sliders className="w-4 h-4 text-blue-600" />
          <span>{labels.leversHeaderTitle}</span>
        </div>
        <p className="text-xs text-slate-500">
          {labels.leversHeaderSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Lever 1: Nursery places (0-300 slider + steppers) */}
        <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200/80 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <Baby className="w-4 h-4 text-indigo-600" />
                {labels.nurseryLeverTitle}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-black text-xs shadow-xs">
                +{inputs.additionalNurseryPlaces} {labels.nurseryLeverUnit(inputs.additionalNurseryPlaces)}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              {labels.nurseryLeverSubtitle}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <input
              type="range"
              min="0"
              max="300"
              step="10"
              value={inputs.additionalNurseryPlaces}
              onChange={(e) => setNursery(Number(e.target.value))}
              className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              aria-label={labels.nurseryLeverTitle}
            />

            <div className="flex items-center justify-between gap-1 text-[11px]">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setNursery(inputs.additionalNurseryPlaces - 20)}
                  disabled={inputs.additionalNurseryPlaces === 0}
                  className="px-2 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-700 font-bold hover:bg-indigo-100 disabled:opacity-40 transition cursor-pointer"
                >
                  -20
                </button>
                <button
                  type="button"
                  onClick={() => setNursery(inputs.additionalNurseryPlaces - 10)}
                  disabled={inputs.additionalNurseryPlaces === 0}
                  className="px-2 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-700 font-bold hover:bg-indigo-100 disabled:opacity-40 transition cursor-pointer"
                >
                  -10
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setNursery(inputs.additionalNurseryPlaces + 10)}
                  disabled={inputs.additionalNurseryPlaces >= 300}
                  className="px-2 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-700 font-bold hover:bg-indigo-100 disabled:opacity-40 transition cursor-pointer"
                >
                  +10
                </button>
                <button
                  type="button"
                  onClick={() => setNursery(inputs.additionalNurseryPlaces + 20)}
                  disabled={inputs.additionalNurseryPlaces >= 300}
                  className="px-2 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-700 font-bold hover:bg-indigo-100 disabled:opacity-40 transition cursor-pointer"
                >
                  +20
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lever 2: Senior Activity Centers (0-3 steppers) */}
        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-600" />
                {labels.casLeverTitle}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-600 text-white font-black text-xs shadow-xs">
                +{inputs.additionalCasCount} {labels.casLeverUnit(inputs.additionalCasCount)}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              {labels.casLeverSubtitle}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => setCas(inputs.additionalCasCount - 1)}
              disabled={inputs.additionalCasCount === 0}
              className="w-9 h-9 rounded-xl bg-white border border-amber-300 text-amber-800 flex items-center justify-center hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed transition font-bold cursor-pointer shadow-2xs"
              aria-label="Decrease CAS"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center text-lg font-black text-slate-900">
              +{inputs.additionalCasCount}
            </span>
            <button
              type="button"
              onClick={() => setCas(inputs.additionalCasCount + 1)}
              disabled={inputs.additionalCasCount >= 3}
              className="w-9 h-9 rounded-xl bg-white border border-amber-300 text-amber-800 flex items-center justify-center hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed transition font-bold cursor-pointer shadow-2xs"
              aria-label="Increase CAS"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Lever 3: Pocket Parks (0-4 steppers) */}
        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <Trees className="w-4 h-4 text-emerald-600" />
                {labels.parksLeverTitle}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-black text-xs shadow-xs">
                +{inputs.additionalPocketParks} {labels.parksLeverUnit(inputs.additionalPocketParks)}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              {labels.parksLeverSubtitle}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => setParks(inputs.additionalPocketParks - 1)}
              disabled={inputs.additionalPocketParks === 0}
              className="w-9 h-9 rounded-xl bg-white border border-emerald-300 text-emerald-800 flex items-center justify-center hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed transition font-bold cursor-pointer shadow-2xs"
              aria-label="Decrease Parks"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center text-lg font-black text-slate-900">
              +{inputs.additionalPocketParks}
            </span>
            <button
              type="button"
              onClick={() => setParks(inputs.additionalPocketParks + 1)}
              disabled={inputs.additionalPocketParks >= 4}
              className="w-9 h-9 rounded-xl bg-white border border-emerald-300 text-emerald-800 flex items-center justify-center hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed transition font-bold cursor-pointer shadow-2xs"
              aria-label="Increase Parks"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Live Financial CAPEX Estimate Banner */}
      <div className="p-4 rounded-2xl bg-linear-to-r from-blue-50 via-indigo-50/60 to-blue-50 border border-blue-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-blue-950">
              {labels.capexTotalTitle}:{' '}
              <strong className="text-sm font-black text-blue-700">
                {estimatedCapexPln.toLocaleString()} {labels.capexCurrency}
              </strong>
            </div>
            <div className="text-[11px] text-slate-500">
              {labels.capexTotalSubtitle}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-slate-600 font-medium">
          <span>
            {labels.capexNurseryPart} <strong className="text-slate-900">{nurseryCapexPln.toLocaleString()} {labels.capexCurrency}</strong>
          </span>
          <span className="text-slate-300">•</span>
          <span>
            {labels.capexCasPart} <strong className="text-slate-900">{casCapexPln.toLocaleString()} {labels.capexCurrency}</strong>
          </span>
          <span className="text-slate-300">•</span>
          <span>
            {labels.capexParksPart} <strong className="text-slate-900">{parksCapexPln.toLocaleString()} {labels.capexCurrency}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
