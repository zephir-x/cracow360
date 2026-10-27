import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Droplets,
  MapPin,
  RefreshCw,
  Wind,
} from 'lucide-react';
import { DISTRICTS_LIST } from './atmosphereConstants';
import { WeatherIcon } from './WeatherIcon';
import { ATMOSPHERE_I18N } from '../../i18n/modules';
import { useTranslation } from '../../i18n/I18nContext';
import type { LiveAtmosphereDto } from '../../types/contracts';

interface AtmosphereTopBarProps {
  data: LiveAtmosphereDto | null;
  selectedDistrictId: number;
  onSelectDistrict: (id: number) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  isOfflineFallback: boolean;
  localizedWeatherLabel: string;
  localizedAqiLabel: string;
  contentKey: number;
}

export function AtmosphereTopBar({
  data,
  selectedDistrictId,
  onSelectDistrict,
  isExpanded,
  onToggleExpand,
  isRefreshing,
  onRefresh,
  isOfflineFallback,
  localizedWeatherLabel,
  localizedAqiLabel,
  contentKey,
}: AtmosphereTopBarProps) {
  const { language } = useTranslation();
  const text = ATMOSPHERE_I18N[language] || ATMOSPHERE_I18N.pl;

  return (
    <div className="py-2 flex items-center justify-between gap-x-3 text-xs overflow-x-auto no-scrollbar">
      {/* Left Block: Live badge + Current weather + Air quality pill */}
      <div
        key={`ticker-${contentKey}-${selectedDistrictId}`}
        className="flex items-center gap-2.5 sm:gap-3 shrink-0 animate-content-enter whitespace-nowrap"
      >
        {/* Live Indicator Pulse */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[11px] font-bold text-sky-100 tracking-wider uppercase shadow-xs shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          {text.barBadge}
        </div>

        {/* Offline notification badge if API is down */}
        {isOfflineFallback && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-400/20 border border-amber-300/30 text-[10px] font-medium text-amber-200 shrink-0">
            <AlertTriangle className="w-3 h-3 text-amber-300" />
            {text.offlineBadge}
          </span>
        )}

        {/* Current Weather (Icon + Temp + Apparent Temp) */}
        {data ? (
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <WeatherIcon code={data.currentWeather.weatherCode} isDay={data.currentWeather.isDay} />
            <span className="font-extrabold text-sm tracking-tight text-white drop-shadow-xs">
              {Math.round(data.currentWeather.temperatureC)}°C
            </span>
            <span className="hidden sm:inline text-sky-100/90 text-[11px]">
              ({text.tempApparent}: {Math.round(data.currentWeather.apparentTemperatureC)}°C)
            </span>
            <span className="text-sky-200 font-semibold hidden md:inline">
              • {localizedWeatherLabel}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sky-100 text-xs shrink-0">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-300" />
            <span>Ładowanie warunków...</span>
          </div>
        )}

        {/* Divider */}
        <div className="hidden sm:block w-px h-4 bg-white/20 shrink-0" />

        {/* Air Quality Pill with Colored Dot */}
        {data && (
          <div className="flex items-center gap-2 shrink-0">
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/15 backdrop-blur-md border border-white/25 text-white shadow-xs"
            >
              <span
                className="w-2 h-2 rounded-full shrink-0 shadow-xs"
                style={{ backgroundColor: data.currentAirQuality.aqiColorHex }}
              />
              <span>
                {text.airQuality}: <strong>{localizedAqiLabel}</strong> (AQI {data.currentAirQuality.europeanAqi})
              </span>
            </div>
          </div>
        )}

        {/* Precipitation & Wind snippet */}
        {data && (
          <div className="hidden 2xl:flex items-center gap-3 text-sky-100 text-[11px] shrink-0">
            <div className="flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-sky-300" />
              <span>
                {text.rainProbability}: {data.hourlyForecast24H[0]?.precipitationProbabilityPct ?? 0}%
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-sky-300" />
              <span>{Math.round(data.currentWeather.windSpeedKmh)} km/h</span>
            </div>
          </div>
        )}
      </div>

      {/* Right Block: District Selector + Refresh Button + Expand / Collapse Accordion Toggle */}
      <div className="flex items-center gap-1.5 sm:gap-2 ml-auto shrink-0 whitespace-nowrap">
        {/* District Quick Dropdown */}
        <div className="relative inline-flex items-center shrink-0">
          <MapPin className="w-3.5 h-3.5 text-sky-300 mr-1.5 shrink-0" />
          <select
            aria-label="Wybierz dzielnicę"
            value={selectedDistrictId}
            onChange={(e) => onSelectDistrict(Number(e.target.value))}
            className="bg-white/15 backdrop-blur-md text-white font-semibold text-xs rounded-xl px-2.5 py-1.5 border border-white/25 hover:border-white/40 focus:outline-hidden focus:ring-1 focus:ring-sky-200 cursor-pointer transition-colors shadow-xs"
          >
            {DISTRICTS_LIST.map((d) => (
              <option key={d.id} value={d.id} className="bg-slate-900 text-white font-medium">
                {d.roman}. {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Refresh Button with fixed width to eliminate layout shifts */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title={text.refreshButton}
          className="inline-flex items-center justify-center gap-1.5 w-22 sm:w-24 px-2 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/25 text-xs font-semibold cursor-pointer transition-all duration-200 disabled:opacity-50 shadow-xs shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-sky-200 shrink-0 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="truncate">{isRefreshing ? text.refreshing : text.refreshButton}</span>
        </button>

        {/* Expand / Collapse Toggle Button */}
        <button
          onClick={onToggleExpand}
          className="inline-flex items-center justify-center gap-1.5 w-24 sm:w-26 px-2 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white border border-white/30 text-xs font-bold cursor-pointer transition-all duration-200 shadow-xs hover:shadow-md shrink-0"
        >
          <span className="truncate">{isExpanded ? text.collapsePrompt : text.expandPrompt}</span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-sky-200 shrink-0" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-sky-200 shrink-0" />
          )}
        </button>
      </div>
    </div>
  );
}
