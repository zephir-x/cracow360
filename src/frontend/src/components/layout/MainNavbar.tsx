import { Baby, BookOpen, Building2, Clapperboard, Compass, Landmark } from 'lucide-react';
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
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

  // Track whether smooth animation is enabled (disabled on initial F5 and on language change to prevent drifting)
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

  return (
    <header className="sticky top-0 z-1200 bg-white/85 backdrop-blur-xl border-b border-blue-100/90 shadow-xs">
      <div className="max-w-360 mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Kraków360 Brand Logo & Title with Civic Slogan (clicks back to Home Showcase) */}
        <button
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2.5 text-left group cursor-pointer py-1"
        >
          <img
            src="/logo.png"
            alt="Logo Kraków360"
            className="h-9.5 w-9.5 object-contain drop-shadow-xs group-hover:scale-105 transition-transform shrink-0"
          />
          <div className="flex flex-col items-start leading-none select-none">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
              Kraków<span className="text-blue-600">360</span>
            </span>
            <span className="font-handwriting text-xs font-bold text-blue-600 tracking-wide mt-0.5 leading-none group-hover:text-blue-700 transition-colors">
              Tu chcę żyć
            </span>
          </div>
        </button>

        {/* Center/Right: Mode Navigation Tabs with smooth sliding pill & Language Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          <nav ref={navRef} className="relative flex flex-wrap items-center gap-1 py-1">
            {/* Sliding Blue Pill Indicator: Transition is disabled on initial F5 mount and on language change to snap directly into the active tab */}
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
      </div>
    </header>
  );
}
