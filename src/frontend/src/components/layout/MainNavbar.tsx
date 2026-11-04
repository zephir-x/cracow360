import {
  Baby,
  BookOpen,
  Building2,
  ChevronRight,
  Clapperboard,
  Compass,
  Landmark,
  Menu,
  X,
} from 'lucide-react';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from '../../i18n/I18nContext';
import { getHomeShowcaseI18n } from '../../i18n/modules';
import { LanguageSwitcher } from './LanguageSwitcher';

export type AppTabId = 'home' | 'resident' | 'parent' | 'investor' | 'tourist' | 'methodology';

export interface MainNavbarProps {
  activeTab: AppTabId;
  onSelectTab: (tab: AppTabId) => void;
}

interface NavItem {
  id: AppTabId;
  label: string;
  icon: React.ReactNode;
}

export function MainNavbar({ activeTab, onSelectTab }: MainNavbarProps) {
  const { language, t } = useTranslation();
  const homeCopy = getHomeShowcaseI18n(language);
  const navRef = useRef<HTMLElement | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Mobile drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Track whether smooth animation is enabled on desktop (disabled on initial F5 and on language change to prevent drifting)
  const [isTransitionEnabled, setIsTransitionEnabled] = useState<boolean>(false);
  const prevLangRef = useRef<string>(language);

  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
    opacity: number;
  }>({ left: 0, top: 0, width: 0, height: 0, opacity: 0 });

  const navItems = useMemo<NavItem[]>(() => [
    {
      id: 'home',
      label: homeCopy.navHomeLabel,
      icon: <Clapperboard className="w-4 h-4" />,
    },
    {
      id: 'resident',
      label: t.nav.residentMode,
      icon: <Compass className="w-4 h-4" />,
    },
    {
      id: 'parent',
      label: t.nav.parentMode,
      icon: <Baby className="w-4 h-4" />,
    },
    {
      id: 'investor',
      label: t.nav.investorMode,
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      id: 'tourist',
      label: t.nav.touristMode ?? 'Odkrywaj Kraków',
      icon: <Landmark className="w-4 h-4" />,
    },
    {
      id: 'methodology',
      label: t.nav.methodology,
      icon: <BookOpen className="w-4 h-4" />,
    },
  ], [t, homeCopy.navHomeLabel]);

  // Close mobile drawer when tab or language changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeTab, language]);

  // Lock body scroll and listen to Escape key when mobile menu is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    if (isMobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useLayoutEffect(() => {
    const isLangChanged = prevLangRef.current !== language;
    if (isLangChanged) {
      prevLangRef.current = language;
      // Immediately disable transitions while label sizes resize
      setIsTransitionEnabled(false);
    }

    const updateIndicator = () => {
      const activeEl = tabRefs.current[activeTab];
      const navEl = navRef.current;
      if (activeEl && navEl) {
        const navRect = navEl.getBoundingClientRect();
        const tabRect = activeEl.getBoundingClientRect();
        setIndicatorStyle({
          left: tabRect.left - navRect.left,
          top: tabRect.top - navRect.top,
          width: tabRect.width,
          height: tabRect.height,
          opacity: 1,
        });

        // Re-enable smooth transition for subsequent user tab clicks
        requestAnimationFrame(() => {
          setIsTransitionEnabled(true);
        });
      }
    };

    updateIndicator();
    const handleResize = () => updateIndicator();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab, language, t]);

  const handleMobileSelectTab = (tab: AppTabId) => {
    onSelectTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-1200 bg-white/90 backdrop-blur-xl border-b border-blue-100/90 shadow-xs">
        <div className="max-w-360 mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          {/* Left: Kraków360 Brand Logo & Title with Civic Slogan (clicks back to Home Showcase) */}
          <button
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer py-1 shrink-0"
          >
            <img
              src="/logo.png"
              alt="Logo Kraków360"
              className="h-8.5 w-8.5 sm:h-9.5 sm:w-9.5 object-contain drop-shadow-xs group-hover:scale-105 transition-transform shrink-0"
            />
            <div className="flex flex-col items-start leading-none select-none">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                Kraków<span className="text-blue-600">360</span>
              </span>
              <span className="font-handwriting text-[11px] sm:text-xs font-bold text-blue-600 tracking-wide mt-0.5 leading-none group-hover:text-blue-700 transition-colors">
                Tu chcę żyć
              </span>
            </div>
          </button>

          {/* DESKTOP VIEW (>= 1280px / xl): Full Mode Navigation Tabs with smooth sliding pill & Language Switcher */}
          <div className="hidden xl:flex items-center gap-3">
            <nav ref={navRef} className="relative flex items-center gap-1 py-1">
              {/* Sliding Blue Pill Indicator */}
              <div
                className={`absolute top-0 left-0 rounded-xl bg-blue-600 shadow-md shadow-blue-600/25 pointer-events-none z-0 ${
                  isTransitionEnabled ? 'transition-all duration-300 ease-out' : 'transition-none'
                }`}
                style={
                  indicatorStyle.width > 0
                    ? {
                        transform: `translate3d(${indicatorStyle.left}px, ${indicatorStyle.top}px, 0)`,
                        width: `${indicatorStyle.width}px`,
                        height: `${indicatorStyle.height}px`,
                        opacity: indicatorStyle.opacity,
                      }
                    : { opacity: 0 }
                }
              />

              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    ref={(el) => {
                      tabRefs.current[item.id] = el;
                    }}
                    onClick={() => onSelectTab(item.id)}
                    className={`relative z-10 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors duration-200 cursor-pointer ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-600 hover:text-blue-600'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Multilingual Switcher (PL / EN / UA) */}
            <LanguageSwitcher />
          </div>

          {/* MOBILE & TABLET VIEW (< 1280px / xl): Touch Hamburger Button (Language Switcher is inside mobile drawer) */}
          <div className="flex xl:hidden items-center">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Zamknij menu' : 'Otwórz menu'}
              className="p-2 rounded-xl bg-blue-50/90 hover:bg-blue-100 text-blue-700 border border-blue-200/80 transition-colors cursor-pointer active:scale-95"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE SLIDE-OVER DRAWER OVERLAY */}
      {isMobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu nawigacji"
          className="fixed inset-0 z-1300 xl:hidden flex flex-col bg-slate-950/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="bg-white/95 backdrop-blur-2xl border-b border-blue-100 shadow-2xl p-4 sm:p-6 flex flex-col gap-4 max-h-[88vh] overflow-y-auto rounded-b-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <img src="/logo.png" alt="Logo Kraków360" className="h-8 w-8 object-contain" />
                <div className="flex flex-col text-left leading-none">
                  <span className="font-extrabold text-slate-900 text-base">
                    Kraków<span className="text-blue-600">360</span>
                  </span>
                  <span className="font-handwriting text-xs font-bold text-blue-600 mt-0.5">
                    Tu chcę żyć
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                aria-label="Zamknij menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tab Links (Large, Touch-Friendly Tap Targets) */}
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMobileSelectTab(item.id)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 cursor-pointer text-left ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'bg-slate-50/80 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`p-2 rounded-xl shrink-0 ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-white text-blue-600 shadow-xs'
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-white/80' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </nav>

            {/* Bottom Drawer Footer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium text-slate-500">
                Kraków360 • Open Data Civic Platform
              </span>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
