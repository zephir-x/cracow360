import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
} from 'lucide-react';

const RAIN_CODES = new Set([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82]);
const SNOW_CODES = new Set([71, 73, 75, 77, 85, 86]);
const THUNDER_CODES = new Set([95, 96, 99]);
const FOG_CODES = new Set([45, 48]);
const CLEAR_CODES = new Set([0]);
const PARTLY_CLOUDY_CODES = new Set([1, 2]);

interface WeatherIconProps {
  code: number;
  isDay: boolean;
  className?: string;
}

export function WeatherIcon({ code, isDay, className = 'w-5 h-5 shrink-0' }: WeatherIconProps) {
  if (CLEAR_CODES.has(code)) {
    return isDay ? (
      <Sun className={`${className} text-amber-300`} />
    ) : (
      <Sun className={`${className} text-sky-200`} />
    );
  }
  if (PARTLY_CLOUDY_CODES.has(code)) {
    return isDay ? (
      <CloudSun className={`${className} text-amber-300`} />
    ) : (
      <Cloud className={`${className} text-sky-200`} />
    );
  }
  if (code === 3) {
    return <Cloud className={`${className} text-sky-200`} />;
  }
  if (FOG_CODES.has(code)) {
    return <CloudFog className={`${className} text-sky-200`} />;
  }
  if (RAIN_CODES.has(code)) {
    return <CloudRain className={`${className} text-sky-200`} />;
  }
  if (SNOW_CODES.has(code)) {
    return <CloudSnow className={`${className} text-white`} />;
  }
  if (THUNDER_CODES.has(code)) {
    return <CloudLightning className={`${className} text-amber-300`} />;
  }
  return <CloudSun className={`${className} text-amber-300`} />;
}
