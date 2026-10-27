import React from 'react';
import { Activity, Sun, Car, Flower2, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';
import type { AtmosphereText, AtmosphereRecommendationsText } from '../../i18n/atmosphereI18n';

interface AtmosphereGuidelinesCardProps {
  text: AtmosphereText;
  recommendations: AtmosphereRecommendationsText | null;
}

const getAdviceBadge = (level: string) => {
  switch (level.toLowerCase()) {
    case 'safe':
    case 'good':
    case 'low':
      return {
        badgeClass: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
        icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-300 shrink-0" />,
      };
    case 'moderate':
      return {
        badgeClass: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
        icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-300 shrink-0" />,
      };
    case 'warning':
      return {
        badgeClass: 'bg-orange-500/20 text-orange-200 border-orange-400/40',
        icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-300 shrink-0" />,
      };
    case 'danger':
    default:
      return {
        badgeClass: 'bg-rose-500/20 text-rose-200 border-rose-400/40',
        icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-300 shrink-0" />,
      };
  }
};

export const AtmosphereGuidelinesCard: React.FC<AtmosphereGuidelinesCardProps> = ({
  text,
  recommendations,
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 shadow-md flex flex-col justify-between h-full gap-3 sm:gap-3.5">
      <div className="flex flex-col justify-between flex-1 gap-2">
        <div className="flex items-center justify-between mb-0.5">
          <h2 className="text-xs font-black uppercase tracking-wider text-sky-200 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-300" />
            {text.guidelinesTitle}
          </h2>
        </div>

        {recommendations && (
          <div className="flex flex-col justify-between flex-1 gap-2">
            {/* 1. UV */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-white/10 border border-white/15 text-xs space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-300" />
                  {text.guidelineUv}
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${getAdviceBadge(recommendations.uv.level).badgeClass}`}>
                  {getAdviceBadge(recommendations.uv.level).icon}
                  {recommendations.uv.shortLabel}
                </span>
              </div>
              <p className="text-[11px] text-sky-100 leading-snug">
                {recommendations.uv.message}
              </p>
            </div>

            {/* 2. Outdoor sports */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-white/10 border border-white/15 text-xs space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-300" />
                  {text.guidelineSport}
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${getAdviceBadge(recommendations.outdoorSport.level).badgeClass}`}>
                  {getAdviceBadge(recommendations.outdoorSport.level).icon}
                  {recommendations.outdoorSport.shortLabel}
                </span>
              </div>
              <p className="text-[11px] text-sky-100 leading-snug">
                {recommendations.outdoorSport.message}
              </p>
            </div>

            {/* 3. Traffic and exhaust fumes */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-white/10 border border-white/15 text-xs space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-sky-300" />
                  {text.guidelineTraffic}
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${getAdviceBadge(recommendations.trafficExhaust.level).badgeClass}`}>
                  {getAdviceBadge(recommendations.trafficExhaust.level).icon}
                  {recommendations.trafficExhaust.shortLabel}
                </span>
              </div>
              <p className="text-[11px] text-sky-100 leading-snug">
                {recommendations.trafficExhaust.message}
              </p>
            </div>

            {/* 4. Pollen allergens */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-white/10 border border-white/15 text-xs space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Flower2 className="w-3.5 h-3.5 text-emerald-300" />
                  {text.guidelineAllergens}
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${getAdviceBadge(recommendations.allergens.level).badgeClass}`}>
                  {getAdviceBadge(recommendations.allergens.level).icon}
                  {recommendations.allergens.shortLabel}
                </span>
              </div>
              <p className="text-[11px] text-sky-100 leading-snug">
                {recommendations.allergens.message}
              </p>
            </div>

            {/* 5. Vulnerable groups and children */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-white/10 border border-white/15 text-xs space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-300" />
                  {text.guidelineSensitive}
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${getAdviceBadge(recommendations.sensitiveGroups.level).badgeClass}`}>
                  {getAdviceBadge(recommendations.sensitiveGroups.level).icon}
                  {recommendations.sensitiveGroups.shortLabel}
                </span>
              </div>
              <p className="text-[11px] text-sky-100 leading-snug">
                {recommendations.sensitiveGroups.message}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Data Source disclosure */}
      <div className="pt-2 border-t border-white/15 text-[10px] text-sky-200/90 flex items-center justify-between">
        <span>{text.dataSource}</span>
      </div>
    </div>
  );
};
