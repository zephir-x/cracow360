import React from 'react';
import {
  ArrowDown,
  Flame,
  Compass,
  Info,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '../../i18n/I18nContext';
import { getTourismI18n, getLocalizedAlternative } from '../../i18n/modules';
import type { OvertourismAlternativeDto } from '../../types/contracts';

export interface OvertourismCompassProps {
  alternatives: OvertourismAlternativeDto[];
}

export const OvertourismCompass: React.FC<OvertourismCompassProps> = ({ alternatives }) => {
  const { language } = useTranslation();
  const t = getTourismI18n(language);

  return (
    <section
      id="overtourism-section"
      className="scroll-mt-20 rounded-3xl bg-white border border-blue-100 p-4 sm:p-8 shadow-xl shadow-blue-900/5 space-y-5 sm:space-y-6"
    >
      {/* Section Header (Unified Official/Investor Style) */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-100 pb-4 sm:pb-5 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2.5 sm:gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              {t.sections.overtourismTitle}
            </h2>
            <p className="text-xs text-slate-500">
              {t.sections.overtourismSubtitle}
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 shadow-2xs self-center sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{t.overtourism.cityReliefBadge}</span>
        </div>
      </div>

      {/* Educational Relief Banner */}
      <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-linear-to-r from-purple-500/10 via-indigo-500/5 to-blue-500/10 border border-indigo-200/80 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 sm:gap-4">
        <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <Info className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="text-xs sm:text-sm font-extrabold text-indigo-950">
            {t.overtourism.reliefBannerTitle}
          </h4>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {t.overtourism.reliefBannerDesc}
          </p>
        </div>
      </div>

      {/* 5 Curated Full-Width Comparison Rows (1 per line across entire width) */}
      <div className="space-y-4 sm:space-y-6">
        {alternatives.map((alt, idx) => {
          const loc = getLocalizedAlternative(alt, language);
          const crowdedBadge = t.crowd[alt.crowdedCrowdLevel as keyof typeof t.crowd] ?? t.crowd.PEAK;
          const peacefulBadge = t.crowd[alt.peacefulCrowdLevel as keyof typeof t.crowd] ?? t.crowd.PEACEFUL;
          const perkTags = t.overtourism.perks[alt.id] ?? ['Autentyczny klimat', 'Brak tłumów'];

          return (
            <div
              key={alt.id}
              className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-50/60 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-300 hover:bg-white transition-all duration-300 flex flex-col justify-between gap-3.5 sm:gap-4"
            >
              {/* Card Header with Scenario Badge */}
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-slate-200/80 text-slate-700 text-[11px] font-black flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                    {t.overtourism.scenarioPrefix}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 sm:px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>{t.overtourism.sustainableChoice}</span>
                </span>
              </div>

              {/* Side-by-Side Comparison: Crowded Hotspot vs Peaceful Gem */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 relative items-stretch">
                {/* 1. Crowded Point */}
                <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-linear-to-br from-rose-50 via-rose-50/40 to-white border border-rose-200/90 flex flex-col justify-between gap-3 shadow-2xs">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-rose-700">
                        <Flame className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        {t.overtourism.crowdedLabel}
                      </span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border whitespace-nowrap shadow-2xs ${crowdedBadge.color}`}>
                        {crowdedBadge.label}
                      </span>
                    </div>
                    <div className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                      {alt.crowdedName}
                    </div>
                  </div>
                  <div className="text-[11px] text-rose-700/80 font-medium pt-1 border-t border-rose-200/50">
                    {t.overtourism.crowdedFriction}
                  </div>
                </div>

                {/* Mobile Bridge Pill */}
                <div className="sm:hidden flex items-center justify-center py-0.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold shadow-xs">
                    <span>{t.overtourism.chooseAlternative}</span>
                    <ArrowDown className="w-3 h-3 text-emerald-400" />
                  </div>
                </div>

                {/* 2. Peaceful Authentic Alternative */}
                <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-linear-to-br from-emerald-50 via-teal-50/30 to-white border border-emerald-300 flex flex-col justify-between gap-3 shadow-2xs">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-800">
                        <Compass className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        {t.overtourism.peacefulLabel}
                      </span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border whitespace-nowrap shadow-2xs ${peacefulBadge.color}`}>
                        {peacefulBadge.label}
                      </span>
                    </div>
                    <div className="text-sm sm:text-base font-black text-emerald-950 leading-snug">
                      {alt.peacefulName}
                    </div>
                  </div>
                  <div className="text-[11px] text-emerald-800/90 font-medium pt-1 border-t border-emerald-200/60">
                    {t.overtourism.peacefulPerk}
                  </div>
                </div>
              </div>

              {/* Rationale explanation card with perk tags */}
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 text-xs text-slate-700 leading-relaxed space-y-2.5 shadow-2xs">
                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t.overtourism.whySwitchLabel}</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
                  {loc.reason}
                </p>

                {/* Quick Perk Badges */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
                  {perkTags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/70 text-[10px] sm:text-[11px] font-bold flex items-center gap-1"
                    >
                      <span className="text-emerald-600">✓</span>
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
