import {
  Briefcase,
  Bus,
  GraduationCap,
  HeartHandshake,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Trees,
  Users,
  Wind,
} from 'lucide-react';
import type { QualityWeights, ResidentPreset } from '../../../types/contracts';
import { RESIDENT_PRESETS } from '../../../utils/qualityIndexCalculator';
import * as React from "react";

export interface WeightsConfiguratorPanelProps {
  weights: QualityWeights;
  activePresetId: string | null;
  onChangeWeights: (newWeights: QualityWeights, presetId?: string | null) => void;
  onResetWeights: () => void;
}

interface SliderConfig {
  key: keyof QualityWeights;
  label: string;
  subtitle: string;
  accentColor: string;
  iconBg: string;
  icon: React.ReactNode;
}

const SLIDER_CONFIGS: SliderConfig[] = [
  {
    key: 'mobility',
    label: 'Mobilność i Transport KMK',
    subtitle: 'Przystanki tramwajowe/autobusowe, izochrony 500m, ścieżki rowerowe i P&R',
    accentColor: 'accent-blue-600',
    iconBg: 'bg-blue-50 text-blue-600 border-blue-200',
    icon: <Bus className="w-4 h-4" />,
  },
  {
    key: 'education',
    label: 'Edukacja i Opieka (0–14 lat)',
    subtitle: 'Dostępność żłobków samorządowych/prywatnych, przedszkoli i szkół podstawowych',
    accentColor: 'accent-indigo-600',
    iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    icon: <GraduationCap className="w-4 h-4" />,
  },
  {
    key: 'greenery',
    label: 'Zieleń Miejska i Sport',
    subtitle: 'Parki miejskie, parki kieszonkowe, m² zieleni na mieszkańca, boiska i baseny',
    accentColor: 'accent-emerald-600',
    iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    icon: <Trees className="w-4 h-4" />,
  },
  {
    key: 'culture',
    label: 'Kultura, Biblioteki i Seniorzy (CAS)',
    subtitle: 'Filie Biblioteki Kraków, domy kultury, Centra Aktywności Seniora i wydarzenia',
    accentColor: 'accent-sky-600',
    iconBg: 'bg-sky-50 text-sky-600 border-sky-200',
    icon: <HeartHandshake className="w-4 h-4" />,
  },
  {
    key: 'environment',
    label: 'Środowisko, Powietrze i Spokój',
    subtitle: 'Jakość powietrza (GIOŚ), niska gęstość zaludnienia i komfort akustyczny',
    accentColor: 'accent-teal-600',
    iconBg: 'bg-teal-50 text-teal-600 border-teal-200',
    icon: <Wind className="w-4 h-4" />,
  },
];

function getPresetIcon(presetId: string) {
  switch (presetId) {
    case 'student':
      return <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />;
    case 'single_pro':
      return <Briefcase className="w-4 h-4 text-sky-600 shrink-0" />;
    case 'family_2_1':
      return <Users className="w-4 h-4 text-indigo-600 shrink-0" />;
    case 'active_senior':
      return <HeartHandshake className="w-4 h-4 text-emerald-600 shrink-0" />;
    default:
      return <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />;
  }
}

export function WeightsConfiguratorPanel({
  weights,
  activePresetId,
  onChangeWeights,
  onResetWeights,
}: WeightsConfiguratorPanelProps) {
  const handleSliderChange = (key: keyof QualityWeights, value: number) => {
    onChangeWeights(
      {
        ...weights,
        [key]: value,
      },
      null
    );
  };

  const handleSelectPreset = (preset: ResidentPreset) => {
    onChangeWeights({ ...preset.weights }, preset.id);
  };

  return (
    <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-blue-100 p-5 shadow-xl shadow-blue-900/5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-linear-to-br from-blue-600 to-sky-500 flex items-center justify-center text-white shadow-sm shadow-blue-600/20">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Konfigurator Wag</h3>
            <p className="text-[11px] text-slate-500">
              Ustaw priorytety (0–10 pkt) – przeliczanie na żywo
            </p>
          </div>
        </div>

        <button
          onClick={onResetWeights}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200/80 transition cursor-pointer"
          title="Przywróć równe wagi (5/10) dla wszystkich kategorii"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* 4 Quick Persona Presets */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Szybkie Profile Mieszkańca:
          </span>
          {activePresetId && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Aktywny profil
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {RESIDENT_PRESETS.map((preset) => {
            const isActive = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`text-left p-2.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                  isActive
                    ? 'bg-linear-to-br from-blue-600 to-sky-600 border-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-50/80 border-slate-200/80 text-slate-700 hover:bg-blue-50/60 hover:border-blue-300'
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl shrink-0 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white border border-slate-200'
                  }`}
                >
                  {isActive ? <Sparkles className="w-3.5 h-3.5 text-white" /> : getPresetIcon(preset.id)}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">{preset.label}</div>
                  <div
                    className={`text-[10px] leading-tight mt-0.5 line-clamp-2 ${
                      isActive ? 'text-blue-100' : 'text-slate-500'
                    }`}
                  >
                    {preset.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5 Interactive Category Weight Sliders (0-10) */}
      <div className="space-y-3 pt-1">
        {SLIDER_CONFIGS.map((slider) => {
          const currentValue = weights[slider.key];
          return (
            <div
              key={slider.key}
              className="p-3 rounded-2xl bg-slate-50/70 border border-slate-200/70 hover:border-blue-200 transition space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`p-1.5 rounded-xl border ${slider.iconBg} shrink-0`}>
                    {slider.icon}
                  </span>
                  <span className="text-xs font-bold text-slate-800 truncate">{slider.label}</span>
                </div>
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 min-w-13 text-center shrink-0">
                  {currentValue} / 10
                </span>
              </div>

              <p className="text-[11px] text-slate-500 leading-snug">{slider.subtitle}</p>

              <div className="flex items-center gap-3 pt-1">
                <span className="text-[10px] text-slate-400 font-semibold w-4">0</span>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={currentValue}
                  onChange={(e) => handleSliderChange(slider.key, Number(e.target.value))}
                  className={`w-full h-2 bg-blue-100 rounded-lg cursor-pointer ${slider.accentColor}`}
                />
                <span className="text-[10px] text-slate-400 font-semibold w-4 text-right">10</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
