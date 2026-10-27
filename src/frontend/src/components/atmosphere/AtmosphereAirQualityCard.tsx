import React from 'react';
import { Droplets, Flower2 } from 'lucide-react';
import type { LiveAtmosphereDto } from '../../types/contracts';
import { getLocalizedUvTag, type AtmosphereText } from '../../i18n/modules';
import type { Language } from '../../i18n/types';

interface AtmosphereAirQualityCardProps {
  data: LiveAtmosphereDto;
  text: AtmosphereText;
  localizedAqiLabel: string;
  language: Language;
}

export const AtmosphereAirQualityCard: React.FC<AtmosphereAirQualityCardProps> = ({
  data,
  text,
  localizedAqiLabel,
  language,
}) => {
  // WHO Daily Guideline reference percentages (PM2.5: 15 ug/m3, PM10: 45 ug/m3, NO2: 25 ug/m3)
  const whoPm25Pct = Math.round((data.currentAirQuality.pm25UgM3 / 15) * 100);
  const whoPm10Pct = Math.round((data.currentAirQuality.pm10UgM3 / 45) * 100);
  const whoNo2Pct = Math.round((data.currentAirQuality.nitrogenDioxideUgM3 / 25) * 100);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 shadow-md flex flex-col justify-between h-full gap-3 sm:gap-3.5">
      {/* EAQI Header & Level Badge */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-black uppercase tracking-wider text-sky-200 flex items-center gap-1.5">
          <Droplets className="w-4 h-4 text-sky-300" />
          {text.airQuality}
        </h2>
        <span
          className="text-xs font-black px-2.5 py-0.5 rounded-full border border-white/20 shadow-xs"
          style={{
            backgroundColor: `${data.currentAirQuality.aqiColorHex}44`,
            color: '#ffffff',
          }}
        >
          EAQI {data.currentAirQuality.europeanAqi} • {localizedAqiLabel}
        </span>
      </div>

      {/* Visual European AQI Scale Bar with Active Pointer Needle */}
      <div className="p-2.5 sm:p-3 rounded-xl bg-white/10 border border-white/15 space-y-1.5">
        <div className="flex items-center justify-between text-[10px] text-sky-100">
          <span className="font-semibold">{text.eaqiScaleTitle}</span>
          <span className="font-bold text-white">
            {text.currentLevelMarker}: {data.currentAirQuality.europeanAqi} / 100
          </span>
        </div>
        {/* 5-segment European AQI color bar */}
        <div className="relative pt-1 pb-1">
          <div className="relative h-2 rounded-full overflow-hidden flex bg-slate-900/40">
            <div className="w-[20%] bg-emerald-400" title="0-20 Bardzo dobry" />
            <div className="w-[20%] bg-green-500" title="21-40 Dobry" />
            <div className="w-[20%] bg-amber-400" title="41-60 Umiarkowany" />
            <div className="w-[20%] bg-orange-500" title="61-80 Dostateczny" />
            <div className="w-[20%] bg-rose-500" title="81-100 Zły" />
          </div>
          {/* Live indicator needle */}
          <div
            className="absolute top-0 -mt-1 w-2.5 h-4 -ml-1.25 flex flex-col items-center pointer-events-none transition-all duration-700"
            style={{ left: `${Math.min(98, Math.max(2, data.currentAirQuality.europeanAqi))}%` }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-white shadow-md border border-slate-900 shrink-0" />
            <div className="w-0.5 h-1.5 bg-white shrink-0" />
          </div>
        </div>
        <div className="flex justify-between text-[9px] text-sky-200/80 px-0.5">
          <span>0</span>
          <span>20</span>
          <span>40</span>
          <span>60</span>
          <span>80</span>
          <span>100</span>
        </div>
      </div>

      {/* 4 Quantitative Matter Badges (PM2.5, PM10, NO2, UV) with WHO limit bars and localized UV tag */}
      <div className="grid grid-cols-2 gap-2 sm:gap-2.5 text-xs">
        {/* PM2.5 */}
        <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-sky-200 font-semibold">{text.pm25}</span>
            <span className="text-[9px] font-bold text-sky-300">
              {whoPm25Pct}% {text.whoNormLabel}
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <strong className="text-sm font-black text-white">
              {data.currentAirQuality.pm25UgM3.toFixed(1)}
            </strong>
            <span className="text-[10px] text-sky-200">{text.ugM3}</span>
          </div>
          <div className="w-full bg-black/25 rounded-full h-1 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                whoPm25Pct <= 100 ? 'bg-emerald-400' : whoPm25Pct <= 200 ? 'bg-amber-400' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, whoPm25Pct)}%` }}
            />
          </div>
        </div>

        {/* PM10 */}
        <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-sky-200 font-semibold">{text.pm10}</span>
            <span className="text-[9px] font-bold text-sky-300">
              {whoPm10Pct}% {text.whoNormLabel}
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <strong className="text-sm font-black text-white">
              {data.currentAirQuality.pm10UgM3.toFixed(1)}
            </strong>
            <span className="text-[10px] text-sky-200">{text.ugM3}</span>
          </div>
          <div className="w-full bg-black/25 rounded-full h-1 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                whoPm10Pct <= 100 ? 'bg-emerald-400' : whoPm10Pct <= 200 ? 'bg-amber-400' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, whoPm10Pct)}%` }}
            />
          </div>
        </div>

        {/* NO2 */}
        <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-sky-200 font-semibold">{text.no2}</span>
            <span className="text-[9px] font-bold text-sky-300">
              {whoNo2Pct}% {text.whoNormLabel}
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <strong className="text-sm font-black text-white">
              {data.currentAirQuality.nitrogenDioxideUgM3.toFixed(1)}
            </strong>
            <span className="text-[10px] text-sky-200">{text.ugM3}</span>
          </div>
          <div className="w-full bg-black/25 rounded-full h-1 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                whoNo2Pct <= 100 ? 'bg-emerald-400' : whoNo2Pct <= 200 ? 'bg-amber-400' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, whoNo2Pct)}%` }}
            />
          </div>
        </div>

        {/* UV Index with 100% localized tag */}
        <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-sky-200 font-semibold">{text.uvIndex}</span>
            <span className="text-[9px] font-bold text-amber-300">
              {getLocalizedUvTag(data.currentAirQuality.uvIndex, language)}
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <strong className="text-sm font-black text-amber-300">
              {data.currentAirQuality.uvIndex.toFixed(1)}
            </strong>
            <span className="text-[10px] text-sky-200">/ 11+</span>
          </div>
          <div className="w-full bg-black/25 rounded-full h-1 overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-400 transition-all duration-500"
              style={{ width: `${Math.min(100, (data.currentAirQuality.uvIndex / 11) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* All 5 Botanical Pollen Allergens with Status Pill */}
      <div className="p-2.5 sm:p-3 rounded-xl bg-white/10 border border-white/15 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-sky-100 flex items-center gap-1.5">
            <Flower2 className="w-3.5 h-3.5 text-emerald-300" />
            {text.pollenTitle}
          </span>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
            {(Object.values(data.currentAirQuality.pollen) as number[]).some((v) => v > 5)
              ? text.statusWarning
              : text.pollenLow}
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1 text-[10px]">
          <div className="p-1 rounded-lg bg-black/15 text-center">
            <span className="text-sky-200 block truncate">{text.grassPollen}</span>
            <strong className={data.currentAirQuality.pollen.grassPollen > 5 ? 'text-amber-300 font-bold' : 'text-sky-100'}>
              {data.currentAirQuality.pollen.grassPollen.toFixed(0)}
            </strong>
          </div>

          <div className="p-1 rounded-lg bg-black/15 text-center">
            <span className="text-sky-200 block truncate">{text.birchPollen}</span>
            <strong className={data.currentAirQuality.pollen.birchPollen > 5 ? 'text-amber-300 font-bold' : 'text-sky-100'}>
              {data.currentAirQuality.pollen.birchPollen.toFixed(0)}
            </strong>
          </div>

          <div className="p-1 rounded-lg bg-black/15 text-center">
            <span className="text-sky-200 block truncate">{text.alderPollen}</span>
            <strong className={data.currentAirQuality.pollen.alderPollen > 5 ? 'text-amber-300 font-bold' : 'text-sky-100'}>
              {data.currentAirQuality.pollen.alderPollen.toFixed(0)}
            </strong>
          </div>

          <div className="p-1 rounded-lg bg-black/15 text-center">
            <span className="text-sky-200 block truncate">{text.mugwortPollen}</span>
            <strong className={data.currentAirQuality.pollen.mugwortPollen > 5 ? 'text-amber-300 font-bold' : 'text-sky-100'}>
              {data.currentAirQuality.pollen.mugwortPollen.toFixed(0)}
            </strong>
          </div>

          <div className="p-1 rounded-lg bg-black/15 text-center">
            <span className="text-sky-200 block truncate">{text.ragweedPollen}</span>
            <strong className={data.currentAirQuality.pollen.ragweedPollen > 5 ? 'text-amber-300 font-bold' : 'text-sky-100'}>
              {data.currentAirQuality.pollen.ragweedPollen.toFixed(0)}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};
