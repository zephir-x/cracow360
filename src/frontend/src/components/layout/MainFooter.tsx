import { useEffect, useState } from 'react';
import { cracow360Api } from '../../api/client';
import type { SystemHelloDto } from '../../types/contracts';
import type { AppTabId } from './MainNavbar';
import { useTranslation } from '../../i18n/I18nContext';
import { getHomeShowcaseI18n } from '../../i18n/modules';

export interface MainFooterProps {
  onSelectTab: (tab: AppTabId) => void;
}

/// <summary>
/// Civic footer displaying branding, navigation links, and verified city data status.
/// Fully localized with dynamic plural forms for districts and points of interest.
/// </summary>
export function MainFooter({ onSelectTab }: MainFooterProps) {
  const { t, language, formatWithPlural } = useTranslation();
  const homeCopy = getHomeShowcaseI18n(language);

  // Live system diagnostic metadata fetched from backend Minimal API
  const [systemInfo, setSystemInfo] = useState<SystemHelloDto | null>(null);

  // Queries runtime system status on mount to verify database connectivity
  useEffect(() => {
    let cancelled = false;
    cracow360Api
      .getSystemHello()
      .then((data) => {
        if (!cancelled) setSystemInfo(data);
      })
      .catch(() => {
        if (!cancelled) setSystemInfo(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleTabClick = (tab: AppTabId) => {
    onSelectTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const districtsCount = systemInfo?.seededDistrictsCount ?? 0;
  const poisCount = systemInfo?.seededPoisCount ?? 0;
  const isDbConnected = Boolean(systemInfo && districtsCount > 0);

  const offlineDataLabel =
    language === 'en'
      ? 'Database connection unavailable:'
      : language === 'ua'
      ? 'Немає з’єднання з базою даних:'
      : 'Brak połączenia z bazą danych:';

  return (
    <footer className="mt-14 border-t border-blue-100 bg-white/90 backdrop-blur-md">
      <div className="max-w-360 mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* DESKTOP VIEW (>= 768px / md): Horizontal Clean Layout */}
        <div className="hidden md:flex items-center justify-between gap-4 text-xs text-slate-500">
          {/* Brand & live database connection status */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => handleTabClick('home')}
              className="cursor-pointer shrink-0 hover:scale-105 transition-transform"
              aria-label="Kraków360 Home"
            >
              <img
                src="/logo.png"
                alt="Logo Kraków360"
                className="h-8 w-8 object-contain"
              />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleTabClick('home')}
                  className="font-extrabold text-slate-800 hover:text-blue-600 transition cursor-pointer"
                >
                  Kraków<span className="text-blue-600">360</span>
                </button>
                <span className="text-slate-300">•</span>
                <span>
                  {t.footer.dataSourceInfo}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                <span
                  className={`inline-block w-2 h-2 rounded-full shrink-0 ${
                    isDbConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                  }`}
                />
                <span className={`font-medium ${isDbConnected ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {isDbConnected ? t.footer.verifiedData : offlineDataLabel}{' '}
                  {formatWithPlural(districtsCount, t.footer.districtsPlural)}{' • '}
                  {formatWithPlural(poisCount, t.footer.poisPlural)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick navigation links */}
          <div className="flex items-center gap-5 font-medium">
            <button
              onClick={() => handleTabClick('home')}
              className="hover:text-blue-600 transition cursor-pointer"
            >
              {homeCopy.navHomeLabel}
            </button>
            <button
              onClick={() => handleTabClick('resident')}
              className="hover:text-blue-600 transition cursor-pointer"
            >
              {t.nav.residentMode}
            </button>
            <button
              onClick={() => handleTabClick('parent')}
              className="hover:text-blue-600 transition cursor-pointer"
            >
              {t.nav.parentMode}
            </button>
            <button
              onClick={() => handleTabClick('investor')}
              className="hover:text-blue-600 transition cursor-pointer"
            >
              {t.nav.investorMode}
            </button>
            <button
              onClick={() => handleTabClick('tourist')}
              className="hover:text-blue-600 transition cursor-pointer"
            >
              {t.nav.touristMode ?? 'Odkrywaj Kraków'}
            </button>
            <button
              onClick={() => handleTabClick('methodology')}
              className="hover:text-blue-600 transition cursor-pointer"
            >
              {t.nav.methodology}
            </button>
          </div>
        </div>

        {/* MOBILE VIEW (< 768px / md): Balanced, Centered & Clean Card Grid */}
        <div className="flex md:hidden flex-col items-center gap-4 text-xs text-slate-600 text-center">
          {/* Row 1: Brand Logo & Civic Slogan */}
          <button
            type="button"
            onClick={() => handleTabClick('home')}
            className="flex items-center gap-2.5 cursor-pointer py-1"
          >
            <img src="/logo.png" alt="Logo Kraków360" className="h-7 w-7 object-contain" />
            <div className="flex items-baseline gap-1.5 leading-none">
              <span className="font-extrabold text-slate-900 text-base">
                Kraków<span className="text-blue-600">360</span>
              </span>
              <span className="font-handwriting text-xs font-bold text-blue-600">
                Tu chcę żyć
              </span>
            </div>
          </button>

          {/* Row 2: Database Connection Status Pill (no orphaned dots, self-contained badge) */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/80 text-[11px] font-medium text-emerald-800 shadow-2xs">
            <span
              className={`inline-block w-2 h-2 rounded-full shrink-0 ${
                isDbConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span>
              {isDbConnected ? t.footer.verifiedData : offlineDataLabel}{' '}
              {formatWithPlural(districtsCount, t.footer.districtsPlural)} •{' '}
              {formatWithPlural(poisCount, t.footer.poisPlural)}
            </span>
          </div>

          {/* Row 3: 2-Column Responsive Touch Links Grid */}
          <div className="grid grid-cols-2 gap-2 w-full max-w-xs pt-1">
            <button
              onClick={() => handleTabClick('home')}
              className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200/70 text-xs font-bold transition-colors cursor-pointer"
            >
              {homeCopy.navHomeLabel}
            </button>
            <button
              onClick={() => handleTabClick('resident')}
              className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200/70 text-xs font-bold transition-colors cursor-pointer"
            >
              {t.nav.residentMode}
            </button>
            <button
              onClick={() => handleTabClick('parent')}
              className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200/70 text-xs font-bold transition-colors cursor-pointer"
            >
              {t.nav.parentMode}
            </button>
            <button
              onClick={() => handleTabClick('investor')}
              className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200/70 text-xs font-bold transition-colors cursor-pointer"
            >
              {t.nav.investorMode}
            </button>
            <button
              onClick={() => handleTabClick('tourist')}
              className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200/70 text-xs font-bold transition-colors cursor-pointer"
            >
              {t.nav.touristMode ?? 'Odkrywaj Kraków'}
            </button>
            <button
              onClick={() => handleTabClick('methodology')}
              className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200/70 text-xs font-bold transition-colors cursor-pointer"
            >
              {t.nav.methodology}
            </button>
          </div>

          {/* Row 4: Subtle Civic Data Note */}
          <p className="text-[11px] text-slate-400 mt-1">
            {t.footer.dataSourceInfo} • Kraków360
          </p>
        </div>
      </div>
    </footer>
  );
}
