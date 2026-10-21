import React from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  Bus,
  GraduationCap,
  Trees,
  Landmark,
  ShieldCheck,
  ShieldAlert,
  Coins,
  Briefcase,
  Users,
  Baby,
  Smile,
  Laptop,
  Bike,
  Sparkles,
} from 'lucide-react';
import type { QualityWeights, ResidentPreset } from '../../../types/contracts';
import { RESIDENT_PRESETS } from '../../../utils/qualityIndexCalculator';

export interface WeightsConfiguratorPanelProps {
  weights: QualityWeights;
  activePresetId: string | null;
  onChangeWeights: (newWeights: QualityWeights, presetId: string | null) => void;
  onResetWeights: () => void;
}

const SLIDER_CONFIGS: {
  key: keyof QualityWeights;
  label: string;
  description: string;
  iconBg: string;
  accentColor: string;
  icon: React.ReactNode;
}[] = [
  {
    key: 'mobility',
    label: 'Mobilność i Komunikacja',
    description: 'KMK, izochrony, drogi rowerowe DDR',
    iconBg: 'bg-blue-50 border-blue-200 text-blue-600',
    accentColor: 'accent-blue-600',
    icon: <Bus className="w-3.5 h-3.5" />,
  },
  {
    key: 'education',
    label: 'Edukacja i Opieka',
    description: 'Żłobki, przedszkola, małe klasy szkolne',
    iconBg: 'bg-emerald-50 border-emerald-200 text-emerald-600',
    accentColor: 'accent-emerald-600',
    icon: <GraduationCap className="w-3.5 h-3.5" />,
  },
  {
    key: 'greenery',
    label: 'Zieleń i Rekreacja',
    description: 'Parki, lasy miejskie, sport i baseny',
    iconBg: 'bg-lime-50 border-lime-200 text-lime-600',
    accentColor: 'accent-lime-600',
    icon: <Trees className="w-3.5 h-3.5" />,
  },
  {
    key: 'culture',
    label: 'Kultura i Społeczność',
    description: 'Biblioteki, domy kultury, centra CAS',
    iconBg: 'bg-amber-50 border-amber-200 text-amber-600',
    accentColor: 'accent-amber-600',
    icon: <Landmark className="w-3.5 h-3.5" />,
  },
  {
    key: 'environment',
    label: 'Środowisko i Spokój',
    description: 'Pomiary PM10 GIOŚ, akustyka i hałas',
    iconBg: 'bg-teal-50 border-teal-200 text-teal-600',
    accentColor: 'accent-teal-600',
    icon: <ShieldCheck className="w-3.5 h-3.5" />,
  },
  {
    key: 'safety',
    label: 'Bezpieczeństwo i Porządek',
    description: 'Bezpieczny ruch, ochrona pieszych',
    iconBg: 'bg-indigo-50 border-indigo-200 text-indigo-600',
    accentColor: 'accent-indigo-600',
    icon: <ShieldAlert className="w-3.5 h-3.5" />,
  },
  {
    key: 'housingAffordability',
    label: 'Dostępność Mieszkaniowa',
    description: 'Ceny zakupu i najmu m², siła nabywcza',
    iconBg: 'bg-rose-50 border-rose-200 text-rose-600',
    accentColor: 'accent-rose-600',
    icon: <Coins className="w-3.5 h-3.5" />,
  },
];

function getPresetIcon(presetId: string) {
  switch (presetId) {
    case 'rodzina_z_dziecmi':
      return <Baby className="w-3.5 h-3.5 text-blue-600" />;
    case 'student_mlody':
      return <Users className="w-3.5 h-3.5 text-blue-600" />;
    case 'senior':
      return <Smile className="w-3.5 h-3.5 text-blue-600" />;
    case 'zdalny_freelancer':
      return <Laptop className="w-3.5 h-3.5 text-blue-600" />;
    case 'cyklista_eko':
      return <Bike className="w-3.5 h-3.5 text-blue-600" />;
    case 'inwestor_biznes':
      return <Briefcase className="w-3.5 h-3.5 text-blue-600" />;
    default:
      return <Sparkles className="w-3.5 h-3.5 text-blue-600" />;
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

  const handleApplyPreset = (preset: ResidentPreset) => {
    onChangeWeights(preset.weights, preset.id);
  };

  return (
    <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-blue-100 p-5 shadow-xl shadow-blue-900/5 flex flex-col h-162.5">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Konfigurator Wag</h3>
            <p className="text-[11px] text-slate-500">7 Filarów Jakości Życia (0-10)</p>
          </div>
        </div>
        <button
          onClick={onResetWeights}
          title="Przywróć równe wagi (wszystko po 5)"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition border border-transparent hover:border-blue-200 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Scrollable Content Container matching DistrictRankingList */}
      <div className="mt-3.5 flex-1 overflow-y-auto pr-1.5 space-y-4">
        {/* Preset Buttons Grid */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
            Gotowe Profile Mieszkańców:
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {RESIDENT_PRESETS.map((preset) => {
              const isActive = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset)}
                  className={`flex items-center p-2 rounded-xl border transition cursor-pointer min-h-13 ${
                    isActive
                      ? 'bg-blue-50/90 border-blue-500 text-blue-900 shadow-xs ring-1 ring-blue-500/30'
                      : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-blue-50/40 hover:border-blue-300'
                  }`}
                  title={preset.description}
                >
                  <div className="w-6 h-6 rounded-md bg-white border border-slate-200/80 flex items-center justify-center shrink-0">
                    {getPresetIcon(preset.id)}
                  </div>
                  <span className="flex-1 text-[11px] font-bold leading-tight text-center whitespace-normal line-clamp-2 px-1">
                    {preset.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 7 Quality Dimension Sliders */}
        <div className="space-y-3 pt-1">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
            Dostosuj 7 Wymiarów Jakości Życia:
          </label>
          {SLIDER_CONFIGS.map((slider) => {
            const currentValue = weights[slider.key];
            return (
              <div
                key={slider.key}
                className="p-2.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-blue-200 transition space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${slider.iconBg}`}
                    >
                      {slider.icon}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-900 truncate block leading-tight">
                        {slider.label}
                      </span>
                      <span className="text-[10px] text-slate-600 truncate block">
                        {slider.description}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-blue-700 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-lg shrink-0">
                    {currentValue}
                  </span>
                </div>

                {/* Slider Input */}
                <div className="pt-0.5">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={currentValue}
                    onChange={(e) => handleSliderChange(slider.key, Number(e.target.value))}
                    className={`w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer ${slider.accentColor}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
