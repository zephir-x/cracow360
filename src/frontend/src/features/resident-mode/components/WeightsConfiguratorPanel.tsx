import React from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  Bus,
  GraduationCap,
  Trees,
  Landmark,
  ShieldCheck,
  Briefcase,
  Users,
  Baby,
  Smile,
  Sparkles,
} from 'lucide-react';
import type { QualityWeights, ResidentPreset } from '../../../types/contracts';

export interface WeightsConfiguratorPanelProps {
  weights: QualityWeights;
  activePresetId: string | null;
  onChangeWeights: (newWeights: QualityWeights, presetId: string | null) => void;
  onResetWeights: () => void;
}

const RESIDENT_PRESETS: ResidentPreset[] = [
  {
    id: 'rodzina_z_dziecmi',
    label: 'Rodzina z Dziećmi',
    description: 'Priorytet: żłobki, szkoły podstawowe, tereny zielone i bezpieczeństwo',
    weights: {
      education: 10,
      greenery: 9,
      environment: 8,
      mobility: 5,
      culture: 4,
    },
  },
  {
    id: 'student_mlody_profesjonalista',
    label: 'Student / Młody',
    description: 'Priorytet: szybka komunikacja miejska (KMK), kultura, rozrywka i kluby',
    weights: {
      mobility: 10,
      culture: 9,
      environment: 4,
      greenery: 6,
      education: 2,
    },
  },
  {
    id: 'senior',
    label: 'Aktywny Senior',
    description: 'Priorytet: Centra Seniora (CAS), parki, biblioteki, spokój i czyste powietrze',
    weights: {
      culture: 10,
      environment: 9,
      greenery: 8,
      mobility: 6,
      education: 1,
    },
  },
  {
    id: 'przedsiebiorca_b2b',
    label: 'Inwestor / Biznes B2B',
    description: 'Priorytet: nasycenie infrastruktury opiekuńczej, węzły przesiadkowe',
    weights: {
      education: 8,
      mobility: 9,
      greenery: 4,
      culture: 4,
      environment: 5,
    },
  },
];

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
    description: 'KMK, izochrony 15 min, drogi rowerowe',
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
    description: 'Parki miejskie i kieszonkowe, obiekty sportowe',
    iconBg: 'bg-lime-50 border-lime-200 text-lime-600',
    accentColor: 'accent-lime-600',
    icon: <Trees className="w-3.5 h-3.5" />,
  },
  {
    key: 'culture',
    label: 'Kultura i Społeczność',
    description: 'Biblioteki, centra kultury, wydarzenia, kluby',
    iconBg: 'bg-amber-50 border-amber-200 text-amber-600',
    accentColor: 'accent-amber-600',
    icon: <Landmark className="w-3.5 h-3.5" />,
  },
  {
    key: 'environment',
    label: 'Środowisko i Spokój',
    description: 'Czyste powietrze, brak hałasu tranzytowego',
    iconBg: 'bg-teal-50 border-teal-200 text-teal-600',
    accentColor: 'accent-teal-600',
    icon: <ShieldCheck className="w-3.5 h-3.5" />,
  },
];

function getPresetIcon(presetId: string) {
  switch (presetId) {
    case 'rodzina_z_dziecmi':
      return <Baby className="w-3.5 h-3.5 text-blue-600" />;
    case 'student_mlody_profesjonalista':
      return <Users className="w-3.5 h-3.5 text-blue-600" />;
    case 'senior':
      return <Smile className="w-3.5 h-3.5 text-blue-600" />;
    case 'przedsiebiorca_b2b':
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

  const handleSelectPreset = (preset: ResidentPreset) => {
    onChangeWeights({ ...preset.weights }, preset.id);
  };

  return (
    <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-blue-100 p-5 shadow-xl shadow-blue-900/5 flex flex-col h-162.5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3.5 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-2xl bg-linear-to-br from-blue-600 to-sky-500 flex items-center justify-center text-white shadow-sm shadow-blue-600/20 shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-extrabold text-slate-900 whitespace-nowrap">Konfigurator Wag</h3>
            <p className="text-[11px] text-slate-500 whitespace-nowrap">
              Ustaw priorytety (0–10 pkt)
            </p>
          </div>
        </div>

        <button
          onClick={onResetWeights}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200/80 transition cursor-pointer shrink-0"
          title="Przywróć równe wagi (5/10) dla wszystkich kategorii"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Scrollable Content Container matching DistrictRankingList */}
      <div className="mt-3.5 flex-1 overflow-y-auto pr-1.5 space-y-4">
        {/* 4 Quick Persona Presets */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              Szybkie Profile Mieszkańca:
            </span>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border text-center shrink-0 ${
                activePresetId
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}
            >
              {activePresetId ? 'Aktywny profil' : 'Nieaktywny profil'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {RESIDENT_PRESETS.map((preset) => {
              const isActive = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-2.5 text-left ${
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
                  <span className="flex-1 text-xs font-bold leading-tight text-center">
                    {preset.label}
                  </span>
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
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border shrink-0 ${slider.iconBg}`}
                    >
                      {slider.icon}
                    </div>
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {slider.label}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-xs font-extrabold text-blue-700 tabular-nums shrink-0">
                    {currentValue} / 10
                  </span>
                </div>

                <div className="space-y-1">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={currentValue}
                    onChange={(e) =>
                      handleSliderChange(slider.key, Number(e.target.value))
                    }
                    className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer ${slider.accentColor}`}
                  />
                  <p className="text-[11px] text-slate-400 font-medium px-0.5 text-center truncate">
                    {slider.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
