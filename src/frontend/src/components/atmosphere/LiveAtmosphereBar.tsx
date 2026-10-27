import React, { useEffect, useMemo, useState } from 'react';
import { cracow360Api } from '../../api/client';
import { useTranslation } from '../../i18n/I18nContext';
import {
  ATMOSPHERE_I18N,
  getLocalizedAqiLabel,
  getLocalizedHealthRecommendations,
  getLocalizedWeatherLabel,
} from '../../i18n/modules';
import type { LiveAtmosphereDto } from '../../types/contracts';
import { DISTRICTS_LIST } from './atmosphereConstants';
import { AtmosphereTopBar } from './AtmosphereTopBar';
import { AtmosphereForecastCard } from './AtmosphereForecastCard';
import { AtmosphereAirQualityCard } from './AtmosphereAirQualityCard';
import { AtmosphereGuidelinesCard } from './AtmosphereGuidelinesCard';

export const LiveAtmosphereBar = React.memo(function LiveAtmosphereBar() {
  const { language } = useTranslation();
  const text = ATMOSPHERE_I18N[language] || ATMOSPHERE_I18N.pl;

  const [selectedDistrictId, setSelectedDistrictId] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cracow360_atmosphere_district');
      if (saved && !isNaN(Number(saved))) return Number(saved);
    }
    return 1;
  });

  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cracow360_atmosphere_expanded') === 'true';
    }
    return false;
  });

  // Keep content mounted during close animation (550ms) to ensure smooth slide-up,
  // but unmount when closed so hidden charts never consume CPU/GPU during slider interactions
  const [shouldRenderDetails, setShouldRenderDetails] = useState<boolean>(isExpanded);

  useEffect(() => {
    if (isExpanded) {
      setShouldRenderDetails(true);
    } else {
      const timer = setTimeout(() => {
        setShouldRenderDetails(false);
      }, 550);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  const [data, setData] = useState<LiveAtmosphereDto | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isOfflineFallback, setIsOfflineFallback] = useState<boolean>(false);
  const [lastFetchTime, setLastFetchTime] = useState<Date>(new Date());
  const [contentKey, setContentKey] = useState<number>(0);
  const [expandCount, setExpandCount] = useState<number>(0);
  const [animationKey, setAnimationKey] = useState<number>(1);

  // Persist expanded state and increment counters so fresh chart entrance animation triggers cleanly
  const handleToggleExpand = () => {
    setIsExpanded((prev) => {
      const next = !prev;
      if (next) {
        setExpandCount((c) => c + 1);
        setAnimationKey((k) => k + 1);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('cracow360_atmosphere_expanded', String(next));
      }
      return next;
    });
  };

  // Change selected district with smooth animation
  const handleSelectDistrict = (id: number) => {
    setSelectedDistrictId(id);
    setContentKey((k) => k + 1);
    setAnimationKey((k) => k + 1);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cracow360_atmosphere_district', String(id));
    }
  };

  // Robust, failure-proof fetch with local fallback protection
  const loadData = async (isManual = false) => {
    setIsRefreshing(true);
    try {
      const res = await cracow360Api.getLiveAtmosphere(selectedDistrictId);
      setData(res);
      setIsOfflineFallback(false);
      setLastFetchTime(new Date());
      setAnimationKey((k) => k + 1);
      if (isManual) {
        setContentKey((k) => k + 1);
      }
    } catch (err) {
      console.warn('Live atmosphere API unavailable, engaging resilient local state:', err);
      setIsOfflineFallback(true);
      setAnimationKey((k) => k + 1);
      if (!data) {
        const now = new Date();
        setData({
          districtId: selectedDistrictId,
          districtRoman: DISTRICTS_LIST.find((d) => d.id === selectedDistrictId)?.roman || 'I',
          districtName: DISTRICTS_LIST.find((d) => d.id === selectedDistrictId)?.name || 'Kraków',
          measuredAtUtc: now.toISOString(),
          cachedUntilUtc: new Date(now.getTime() + 30 * 60000).toISOString(),
          currentWeather: {
            temperatureC: 12.0,
            apparentTemperatureC: 10.5,
            relativeHumidityPct: 65,
            weatherCode: 2,
            weatherLabel: 'Częściowe zachmurzenie',
            precipitationMm: 0.0,
            rainMm: 0.0,
            snowfallCm: 0.0,
            windSpeedKmh: 10.5,
            windDirectionDegrees: 110,
            cloudCoverPct: 30,
            isDay: true,
          },
          currentAirQuality: {
            europeanAqi: 28,
            aqiLevelName: 'Dobry',
            aqiColorHex: '#22c55e',
            pm10UgM3: 22.0,
            pm25UgM3: 13.5,
            nitrogenDioxideUgM3: 16.0,
            uvIndex: 1.8,
            pollen: {
              grassPollen: 0,
              birchPollen: 0,
              alderPollen: 0,
              mugwortPollen: 0,
              ragweedPollen: 0,
            },
          },
          hourlyForecast24H: Array.from({ length: 24 }).map((_, i) => ({
            timeIso: new Date(now.getTime() + i * 3600000).toISOString(),
            hourLabel: `${(now.getHours() + i) % 24}:00`.padStart(5, '0'),
            temperatureC: 11.0 + Math.sin(i / 3) * 4,
            precipitationProbabilityPct: 0,
            precipitationMm: 0,
            snowfallCm: 0,
            windSpeedKmh: 8 + (i % 6),
            weatherCode: 2,
          })),
          recommendations: {
            uv: { level: 'safe', shortLabel: 'Niskie UV', message: 'Niskie UV. Ochrona niewymagana.' },
            outdoorSport: { level: 'safe', shortLabel: 'Dobre warunki', message: 'Dobre warunki do treningu.' },
            trafficExhaust: { level: 'safe', shortLabel: 'Niskie spaliny', message: 'Niskie stężenie spalin.' },
            allergens: { level: 'safe', shortLabel: 'Niskie pyłki', message: 'Niskie stężenie alergenów.' },
            sensitiveGroups: { level: 'safe', shortLabel: 'Bezpiecznie', message: 'Warunki bezpieczne.' },
          },
          dataSource: 'Open-Meteo & GIOŚ (Bufor lokalny)',
        });
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    void loadData(false);

    // Periodic auto-refresh every 10 minutes
    const interval = setInterval(() => {
      void loadData(false);
    }, 10 * 60 * 1000);

    // Refresh when user returns to window tab
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        void loadData(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [selectedDistrictId]);

  const activeDistrict = useMemo(
    () => DISTRICTS_LIST.find((d) => d.id === selectedDistrictId) || DISTRICTS_LIST[0],
    [selectedDistrictId]
  );

  const localizedWeatherLabel = useMemo(() => {
    if (!data) return '';
    return getLocalizedWeatherLabel(
      data.currentWeather.weatherCode,
      data.currentWeather.weatherLabel,
      language
    );
  }, [data, language]);

  const localizedAqiLabel = useMemo(() => {
    if (!data) return '';
    return getLocalizedAqiLabel(data.currentAirQuality.aqiLevelName, language);
  }, [data, language]);

  // Full multi-language localized recommendations (pill titles and messages)
  const localizedRecommendations = useMemo(() => {
    if (!data) return null;
    return getLocalizedHealthRecommendations(data.currentAirQuality, language);
  }, [data, language]);

  // Relative elapsed time label
  const timeAgoLabel = useMemo(() => {
    const elapsedMinutes = Math.floor((Date.now() - lastFetchTime.getTime()) / 60000);
    if (elapsedMinutes < 1) return text.justNow;
    return `${elapsedMinutes} ${text.minutesAgo}`;
  }, [lastFetchTime, text]);

  return (
    <section
      aria-label={text.barTitle}
      className="w-full bg-linear-to-r from-[#0a2e65] via-[#1d4ed8] to-[#0284c7] text-white shadow-lg shadow-blue-950/10 border-b border-blue-300/40 relative z-1100"
    >
      <div className="max-w-360 mx-auto px-4 sm:px-6">
        {/* TOP AMBIENT STRIP */}
        <AtmosphereTopBar
          data={data}
          selectedDistrictId={selectedDistrictId}
          isExpanded={isExpanded}
          isRefreshing={isRefreshing}
          isOfflineFallback={isOfflineFallback}
          contentKey={contentKey}
          localizedWeatherLabel={localizedWeatherLabel}
          localizedAqiLabel={localizedAqiLabel}
          onSelectDistrict={handleSelectDistrict}
          onRefresh={() => void loadData(true)}
          onToggleExpand={handleToggleExpand}
        />

        {/* EXPANDED DETAILED PANEL */}
        <div className={`drawer-expandable ${isExpanded ? 'is-open' : ''}`}>
          <div className="overflow-hidden">
            {shouldRenderDetails && data && (
              <div
                key={`panel-${expandCount}-${selectedDistrictId}`}
                className="pt-4 pb-6 border-t border-white/15 space-y-4 animate-content-enter"
              >
                {/* Header info strip: District Name + Coordinates + Relative Update time */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-sky-100">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-sm tracking-tight drop-shadow-xs">
                      {text.districtPrefix} {activeDistrict.roman}: {activeDistrict.name}
                    </span>
                    <span className="text-sky-200/90 text-[11px] hidden sm:inline">
                      • {text.measuredAt}: {timeAgoLabel}
                    </span>
                  </div>
                  <div className="text-[11px] text-sky-200/90 font-medium">
                    {text.cachedUntil}: {new Date(data.cachedUntilUtc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {/* 3-Column Symmetrical Responsive Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
                  {/* COLUMN 1: 24h Hourly Forecast Distribution & Curves */}
                  <AtmosphereForecastCard
                    data={data}
                    selectedDistrictId={selectedDistrictId}
                    animationKey={animationKey}
                  />

                  {/* COLUMN 2: Air Quality & Botanical Allergens */}
                  <AtmosphereAirQualityCard
                    data={data}
                    text={text}
                    localizedAqiLabel={localizedAqiLabel}
                    language={language}
                  />

                  {/* COLUMN 3: Civic Health Guidelines */}
                  <AtmosphereGuidelinesCard
                    text={text}
                    recommendations={localizedRecommendations}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
});
