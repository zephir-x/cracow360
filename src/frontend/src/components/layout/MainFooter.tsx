import { useEffect, useState } from 'react';
import { cracow360Api } from '../../api/client';
import type { SystemHelloDto } from '../../types/contracts';
import type { AppTabId } from './MainNavbar';

export interface MainFooterProps {
  onSelectTab: (tab: AppTabId) => void;
}

/// <summary>
/// Civic footer displaying branding, navigation links, and verified city data status.
/// </summary>
export function MainFooter({ onSelectTab }: MainFooterProps) {
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
        // Graceful fallback when API is still booting
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleTabClick = (tab: AppTabId) => {
    onSelectTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-14 border-t border-blue-100 bg-white/90 backdrop-blur-md">
      <div className="max-w-360 mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          {/* Brand & live database connection status */}
          <div className="flex items-center gap-4">
            <img
              src="/logo.png"
              alt="Logo Kraków360"
              className="h-8 w-8 object-contain"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-800">Kraków<span className="text-blue-600">360</span></span>
                <span className="text-slate-300">•</span>
                <span>
                  Platforma Analizy Jakości Życia i Dostępności Usług Publicznych w Krakowie
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium text-emerald-700">
                  Zweryfikowane dane miejskie: {systemInfo?.seededDistrictsCount ?? 18} dzielnic • {systemInfo?.seededPoisCount ?? 913} obiektów użyteczności publicznej (POI)
                </span>
              </div>
            </div>
          </div>

          {/* Quick navigation links */}
          <div className="flex flex-wrap items-center gap-5 font-medium">
            <button
              onClick={() => handleTabClick('resident')}
              className="hover:text-blue-600 transition cursor-pointer"
            >
              Dla Mieszkańca
            </button>
            <button
              onClick={() => handleTabClick('parent')}
              className="hover:text-blue-600 transition cursor-pointer"
            >
              Dla Rodzica
            </button>
            <button
              onClick={() => handleTabClick('investor')}
              className="hover:text-blue-600 transition cursor-pointer"
            >
              Dla Urzędnika i Inwestora
            </button>
            <button
              onClick={() => handleTabClick('methodology')}
              className="hover:text-blue-600 transition cursor-pointer"
            >
              Metodologia i Źródła Danych
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
