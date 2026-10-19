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
  icon: React.ReactNode;
}

const SLIDER_CONFIGS: SliderConfig[] = [
  {
    key: 'mobility',
    label: 'Mobilność i Transport KMK',
    subtitle: 'Przystanki tramwajowe/autobusowe, izochrony 500m, ścieżki rowerowe i P&R',
    accentColor: 'accent-sky-400',
    icon: <Bus className="w-4 h-4 text-sky-400" />,
  },
  {
    key: 'education',
    label: 'Edukacja i Opieka (0–14 lat)',
    subtitle: 'Dostępność żłobków samorządowych/prywatnych, przedszkoli i szkół podstawowych',
    accentColor: 'accent-indigo-400',
    icon: <GraduationCap className="w-4 h-4 text-indigo-400" />,
  },
  {
    key: 'greenery',
    label: 'Zieleń Miejska i Sport',
    subtitle: 'Parki miejskie, parki kieszonkowe, m² zieleni na mieszkańca, boiska i baseny',
    accentColor: 'accent-emerald-400',
    icon: <Trees className="w-4 h-4 text-emerald-400" />,
  },
  {
    key: 'culture',
    label: 'Kultura, Biblioteki i Seniorzy (CAS)',
    subtitle: 'Filie Biblioteki Kraków, domy kultury, Centra Aktywności Seniora i wydarzenia',
    accentColor: 'accent-amber-400',
    icon: <HeartHandshake className="w-4 h-4 text-amber-400" />,
  },
  {
    key: 'environment',
    label: 'Środowisko, Powietrze i Spokój',
    subtitle: 'Jakość powietrza (GIOŚ), niska gęstość zaludnienia i komfort akustyczny',
    accentColor: 'accent-teal-400',
    icon: <Wind className="w-4 h-4 text-teal-400" />,
  },
];

function getPresetIcon(presetId: string) {
  switch (presetId) {
    case 'student':
      return <GraduationCap className="w-4 h-4 text-sky-400 shrink-0" />;
    case 'single_pro':
      return <Briefcase className="w-4 h-4 text-indigo-400 shrink-0" />;
    case 'family_2_1':
      return <Users className="w-4 h-4 text-emerald-400 shrink-0" />;
    case 'active_senior':
      return <HeartHandshake className="w-4 h-4 text-amber-400 shrink-0" />;
    default:
      return <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />;
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
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Konfigurator Wag Jakości Życia</h3>
            <p className="text-[11px] text-slate-400">
              Dostosuj priorytety (0–10 pkt) – mapa i ranking przeliczają się w 0 ms
            </p>
          </div>
        </div>

        <button
          onClick={onResetWeights}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
          title="Przywróć równe wagi (5/10) dla wszystkich kategorii"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset (5/10)
        </button>
      </div>

      {/* 4 Quick Persona Presets */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            Szybkie Profile Mieszkańca (Presety):
          </span>
          {activePresetId && (
            <span className="text-[11px] text-sky-400 font-medium">Aktywny profil</span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {RESIDENT_PRESETS.map((preset) => {
            const isActive = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`text-left p-2.5 rounded-xl border transition cursor-pointer flex items-start gap-2.5 ${
                  isActive
                    ? 'bg-sky-500/15 border-sky-400/60 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800/90 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div className="mt-0.5">{getPresetIcon(preset.id)}</div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">{preset.label}</div>
                  <div className="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-2">
                    {preset.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5 Interactive Category Weight Sliders (0-10) */}
      <div className="space-y-4 pt-1">
        {SLIDER_CONFIGS.map((slider) => {
          const currentValue = weights[slider.key];
          return (
            <div
              key={slider.key}
              className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {slider.icon}
                  <span className="text-xs font-semibold text-slate-200">{slider.label}</span>
                </div>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-slate-800 text-sky-300 border border-slate-700 min-w-[52px] text-center">
                  {currentValue} / 10
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-snug">{slider.subtitle}</p>

              <div className="flex items-center gap-3 pt-1">
                <span className="text-[10px] text-slate-500 font-medium w-4">0</span>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={currentValue}
                  onChange={(e) => handleSliderChange(slider.key, Number(e.target.value))}
                  className={`w-full h-2 bg-slate-800 rounded-lg cursor-pointer ${slider.accentColor}`}
                />
                <span className="text-[10px] text-slate-500 font-medium w-4 text-right">10</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
