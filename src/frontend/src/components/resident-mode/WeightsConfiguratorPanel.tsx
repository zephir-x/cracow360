import React, { useEffect, useRef } from 'react';
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
  TrendingUp,
  Briefcase,
  Users,
  Baby,
  Smile,
  Laptop,
  Bike,
  Sparkles,
} from 'lucide-react';
import type { QualityWeights, ResidentPreset } from '../../types/contracts';
import { RESIDENT_PRESETS } from '../../utils/qualityIndexCalculator';
import { useTranslation } from '../../i18n/I18nContext';

export interface WeightsConfiguratorPanelProps {
  weights: QualityWeights;
  activePresetId: string | null;
  onChangeWeights: (newWeights: QualityWeights, presetId: string | null) => void;
  onResetWeights: () => void;
}

interface SliderDefinition {
  key: keyof QualityWeights;
  iconBg: string;
  accentColor: string;
  icon: React.ReactNode;
}

const SLIDER_DEFS: SliderDefinition[] = [
  {
    key: 'mobility',
    iconBg: 'bg-blue-50 border-blue-200 text-blue-600',
    accentColor: 'accent-blue-600',
    icon: <Bus className="w-3.5 h-3.5" />,
  },
  {
    key: 'education',
    iconBg: 'bg-emerald-50 border-emerald-200 text-emerald-600',
    accentColor: 'accent-emerald-600',
    icon: <GraduationCap className="w-3.5 h-3.5" />,
  },
  {
    key: 'greenery',
    iconBg: 'bg-lime-50 border-lime-200 text-lime-600',
    accentColor: 'accent-lime-600',
    icon: <Trees className="w-3.5 h-3.5" />,
  },
  {
    key: 'culture',
    iconBg: 'bg-amber-50 border-amber-200 text-amber-600',
    accentColor: 'accent-amber-600',
    icon: <Landmark className="w-3.5 h-3.5" />,
  },
  {
    key: 'environment',
    iconBg: 'bg-teal-50 border-teal-200 text-teal-600',
    accentColor: 'accent-teal-600',
    icon: <ShieldCheck className="w-3.5 h-3.5" />,
  },
  {
    key: 'safety',
    iconBg: 'bg-indigo-50 border-indigo-200 text-indigo-600',
    accentColor: 'accent-indigo-600',
    icon: <ShieldAlert className="w-3.5 h-3.5" />,
  },
  {
    key: 'housingAffordability',
    iconBg: 'bg-rose-50 border-rose-200 text-rose-600',
    accentColor: 'accent-rose-600',
    icon: <Coins className="w-3.5 h-3.5" />,
  },
  {
    key: 'demographicVitality',
    iconBg: 'bg-violet-50 border-violet-200 text-violet-600',
    accentColor: 'accent-violet-600',
    icon: <TrendingUp className="w-3.5 h-3.5" />,
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
  const { t } = useTranslation();
  const animationFrameRef = useRef<number | null>(null);
  const weightsRef = useRef<QualityWeights>(weights);
  weightsRef.current = weights;

  // Cancel any running animation on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Smoothly glide slider values and counter badges when applying presets or resetting
  const animateWeightsTransition = (
    targetWeights: QualityWeights,
    presetId: string | null,
    onComplete?: () => void
  ) => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const startWeights = { ...weightsRef.current };
    const startTime = performance.now();
    const duration = 450; // Smooth 450ms physical gliding matching Investor Simulator

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // easeOutCubic curve for realistic physical gliding
      const ease = 1 - Math.pow(1 - progress, 3);

      const interp = (start: number, target: number) =>
        Number((start + (target - start) * ease).toFixed(2));

      const interpolated: QualityWeights = {
        mobility: interp(startWeights.mobility, targetWeights.mobility),
        education: interp(startWeights.education, targetWeights.education),
        greenery: interp(startWeights.greenery, targetWeights.greenery),
        culture: interp(startWeights.culture, targetWeights.culture),
        environment: interp(startWeights.environment, targetWeights.environment),
        safety: interp(startWeights.safety, targetWeights.safety),
        housingAffordability: interp(startWeights.housingAffordability, targetWeights.housingAffordability),
        demographicVitality: interp(startWeights.demographicVitality, targetWeights.demographicVitality),
      };

      if (progress < 1) {
        onChangeWeights(interpolated, presetId);
        animationFrameRef.current = requestAnimationFrame(step);
      } else {
        if (onComplete) {
          onComplete();
        } else {
          onChangeWeights(targetWeights, presetId);
        }
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);
  };

  const handleSliderChange = (key: keyof QualityWeights, value: number) => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    onChangeWeights(
      {
        ...weights,
        [key]: value,
      },
      null
    );
  };

  const handleApplyPreset = (preset: ResidentPreset) => {
    animateWeightsTransition(preset.weights, preset.id);
  };

  const handleResetWithAnimation = () => {
    animateWeightsTransition(
      {
        mobility: 5,
        education: 5,
        greenery: 5,
        culture: 5,
        environment: 5,
        safety: 5,
        housingAffordability: 5,
        demographicVitality: 5,
      },
      null,
      () => onResetWeights()
    );
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
            <h3 className="text-sm font-extrabold text-slate-900">{t.configurator.title}</h3>
            <p className="text-[11px] text-slate-500">{t.configurator.subtitle}</p>
          </div>
        </div>
        <button
          onClick={handleResetWithAnimation}
          title={t.configurator.resetWeightsTitle}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition border border-transparent hover:border-blue-200 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{t.configurator.resetWeights}</span>
        </button>
      </div>

      {/* Scrollable Content Container matching DistrictRankingList */}
      <div className="mt-3.5 flex-1 overflow-y-auto pr-1.5 space-y-4">
        {/* Preset Buttons Grid */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
            {t.configurator.presetsLabel}
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {RESIDENT_PRESETS.map((preset) => {
              const isActive = activePresetId === preset.id;
              const presetKey = preset.id as keyof typeof t.configurator.presets;
              const presetLocalized = t.configurator.presets[presetKey];
              const label = presetLocalized ? presetLocalized.label : preset.label;
              const desc = presetLocalized ? presetLocalized.desc : preset.description;

              return (
                <button
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset)}
                  className={`flex items-center p-2 rounded-xl border transition cursor-pointer min-h-13 ${
                    isActive
                      ? 'bg-blue-50/90 border-blue-500 text-blue-900 shadow-xs ring-1 ring-blue-500/30'
                      : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-blue-50/40 hover:border-blue-300'
                  }`}
                  title={desc}
                >
                  <div className="w-6 h-6 rounded-md bg-white border border-slate-200/80 flex items-center justify-center shrink-0">
                    {getPresetIcon(preset.id)}
                  </div>
                  <span className="flex-1 text-[11px] font-bold leading-tight text-center whitespace-normal line-clamp-2 px-1">
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 8 Quality Dimension Sliders */}
        <div className="space-y-3 pt-1">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
            {t.configurator.slidersSectionTitle}
          </label>
          {SLIDER_DEFS.map((slider) => {
            const currentValue = weights[slider.key];
            const pillarLocalized = t.configurator.pillars[slider.key];
            const pillarName = pillarLocalized ? pillarLocalized.name : slider.key;
            const pillarDesc = pillarLocalized ? pillarLocalized.desc : '';

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
                        {pillarName}
                      </span>
                      <span className="text-[10px] text-slate-600 truncate block">
                        {pillarDesc}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-blue-700 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-lg shrink-0 transition-colors">
                    {Math.round(currentValue)}
                  </span>
                </div>

                {/* Slider Input with smooth gliding step="0.05" matching Investor Simulator */}
                <div className="pt-0.5">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step={0.05}
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
