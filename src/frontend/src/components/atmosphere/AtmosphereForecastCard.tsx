import { useId, useMemo } from 'react';
import { Sun } from 'lucide-react';
import {
  Area,
  Bar,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ATMOSPHERE_I18N } from '../../i18n/atmosphereI18n';
import { useTranslation } from '../../i18n/I18nContext';
import type { LiveAtmosphereDto } from '../../types/contracts';

interface AtmosphereForecastCardProps {
  data: LiveAtmosphereDto;
  expandCount: number;
  selectedDistrictId: number;
}

export function AtmosphereForecastCard({
  data,
  expandCount,
  selectedDistrictId,
}: AtmosphereForecastCardProps) {
  const { language } = useTranslation();
  const text = ATMOSPHERE_I18N[language] || ATMOSPHERE_I18N.pl;
  const chartGradientId = useId();

  // Chart data formatting
  const chartData = useMemo(() => {
    if (!data.hourlyForecast24H) return [];
    return data.hourlyForecast24H.map((pt) => ({
      hour: pt.hourLabel,
      temp: Math.round(pt.temperatureC * 10) / 10,
      rainProb: pt.precipitationProbabilityPct,
      rainMm: pt.precipitationMm,
      wind: Math.round(pt.windSpeedKmh),
    }));
  }, [data]);

  // 24-hour summary stats
  const minTemp24h = useMemo(() => {
    if (!data.hourlyForecast24H?.length) return 0;
    return Math.round(Math.min(...data.hourlyForecast24H.map((p) => p.temperatureC)));
  }, [data]);

  const maxTemp24h = useMemo(() => {
    if (!data.hourlyForecast24H?.length) return 0;
    return Math.round(Math.max(...data.hourlyForecast24H.map((p) => p.temperatureC)));
  }, [data]);

  const totalRain24h = useMemo(() => {
    if (!data.hourlyForecast24H?.length) return 0;
    return data.hourlyForecast24H.reduce((sum, p) => sum + (p.precipitationMm || 0), 0);
  }, [data]);

  const maxWind24h = useMemo(() => {
    if (!data.hourlyForecast24H?.length) return 0;
    return Math.round(Math.max(...data.hourlyForecast24H.map((p) => p.windSpeedKmh)));
  }, [data]);

  const isDryDay = useMemo(() => {
    if (!data.hourlyForecast24H?.length) return true;
    return data.hourlyForecast24H.every((p) => p.precipitationProbabilityPct === 0);
  }, [data]);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 shadow-md flex flex-col justify-between h-full gap-3 sm:gap-3.5">
      <div className="flex flex-col justify-between flex-1 gap-2">
        <div className="space-y-1.5 mb-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-sky-200 flex items-start gap-1.5 whitespace-pre-line leading-tight">
              <Sun className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <span>{text.forecast24hTitle}</span>
            </h2>
            <span className="text-[11px] text-sky-200/90 font-bold bg-white/10 px-2 py-0.5 rounded-md border border-white/10 shrink-0">
              24h
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-sky-100">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-white rounded-full inline-block" />
                {text.forecastTempLabel}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 border-t-2 border-dashed border-sky-300 inline-block" />
                {text.forecastRainLabel}
              </span>
            </div>
            {isDryDay && (
              <span className="text-[10px] text-sky-200/90 font-medium bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
                {text.dryDayNotice}
              </span>
            )}
          </div>
        </div>

        {/* Recharts 24h Curve (Harmonious height, animated on every expansion via expandCount key) */}
        <div className="w-full h-52 sm:h-56 pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              key={`chart-${expandCount}-${selectedDistrictId}`}
              data={chartData}
              margin={{ top: 10, right: 10, left: -15, bottom: 6 }}
            >
              <defs>
                <linearGradient id={chartGradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="hour"
                tick={{ fill: '#e0f2fe', fontSize: 10 }}
                interval={3}
                axisLine={{ stroke: '#93c5fd', strokeOpacity: 0.3 }}
                tickLine={false}
              />
              {/* Temperature Y-Axis: Fixed whole degrees without decimals */}
              <YAxis
                yAxisId="temp"
                domain={[(min: number) => Math.floor(min) - 1, (max: number) => Math.ceil(max) + 1]}
                allowDecimals={false}
                tick={{ fill: '#bae6fd', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val: unknown) => `${Math.round(Number(val))}°`}
              />
              {/* Rain Probability Y-Axis: Fixed discrete 0-100% scale */}
              <YAxis
                yAxisId="rain"
                orientation="right"
                domain={[0, 100]}
                allowDecimals={false}
                ticks={[0, 25, 50, 75, 100]}
                tick={{ fill: '#93c5fd', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: unknown) => `${Math.round(Number(v))}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#38bdf8',
                  borderRadius: '0.75rem',
                  color: '#ffffff',
                  fontSize: '11px',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
                }}
                formatter={(val: unknown, name: string | undefined) => {
                  if (name === 'temp') return [`${val}°C`, text.tempCurrent];
                  if (name === 'rainProb') return [`${val}%`, text.rainProbability];
                  return [String(val), name ?? ''];
                }}
                labelFormatter={(label) => `${text.measuredAt}: ${label}`}
              />
              {/* Bar is decorative background fill; tooltipType="none" prevents duplicate rainProb in the hover tooltip */}
              <Bar
                yAxisId="rain"
                dataKey="rainProb"
                tooltipType="none"
                fill="#bae6fd"
                opacity={0.3}
                radius={[3, 3, 0, 0]}
                barSize={8}
                isAnimationActive={true}
                animationDuration={900}
                animationEasing="ease-out"
              />
              <Area
                yAxisId="temp"
                type="monotone"
                dataKey="temp"
                stroke="#ffffff"
                strokeWidth={2.5}
                fillOpacity={1}
                fill={`url(#${chartGradientId})`}
                isAnimationActive={true}
                animationDuration={900}
                animationEasing="ease-out"
              />
              {/* Secondary dashed line with cyan beads for rain probability so it is always visible even at 0% */}
              <Line
                yAxisId="rain"
                type="monotone"
                dataKey="rainProb"
                stroke="#38bdf8"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 2.5, fill: '#38bdf8', stroke: '#0284c7', strokeWidth: 1 }}
                activeDot={{ r: 5, fill: '#38bdf8', stroke: '#ffffff', strokeWidth: 2 }}
                isAnimationActive={true}
                animationDuration={900}
                animationEasing="ease-out"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 24h Summary statistics strip */}
      <div className="grid grid-cols-4 gap-1.5 pt-3 border-t border-white/15 text-center">
        <div className="bg-white/10 rounded-xl py-1.5 px-1">
          <span className="text-[10px] text-sky-200 block truncate">{text.minTemp24h}</span>
          <strong className="text-xs text-white">{minTemp24h}°C</strong>
        </div>
        <div className="bg-white/10 rounded-xl py-1.5 px-1">
          <span className="text-[10px] text-sky-200 block truncate">{text.maxTemp24h}</span>
          <strong className="text-xs text-white">{maxTemp24h}°C</strong>
        </div>
        <div className="bg-white/10 rounded-xl py-1.5 px-1">
          <span className="text-[10px] text-sky-200 block truncate">{text.totalRain24h}</span>
          <strong className="text-xs text-white">{totalRain24h.toFixed(1)} mm</strong>
        </div>
        <div className="bg-white/10 rounded-xl py-1.5 px-1">
          <span className="text-[10px] text-sky-200 block truncate">{text.maxWind24h}</span>
          <strong className="text-xs text-white">{maxWind24h} km/h</strong>
        </div>
      </div>
    </div>
  );
}
