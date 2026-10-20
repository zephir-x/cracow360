import { Baby, BookOpen, Building2, Compass } from 'lucide-react';
import React, { useLayoutEffect, useRef, useState } from 'react';

export type AppTabId = 'resident' | 'parent' | 'investor' | 'methodology';

export interface MainNavbarProps {
  activeTab: AppTabId;
  onSelectTab: (tab: AppTabId) => void;
}

interface NavItem {
  id: AppTabId;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'resident',
    label: 'Dla Mieszkańca',
    icon: <Compass className="w-4 h-4" />,
  },
  {
    id: 'parent',
    label: 'Dla Rodzica',
    icon: <Baby className="w-4 h-4" />,
  },
  {
    id: 'investor',
    label: 'Dla Urzędnika i Inwestora',
    icon: <Building2 className="w-4 h-4" />,
  },
  {
    id: 'methodology',
    label: 'Metodologia i Źródła Danych',
    icon: <BookOpen className="w-4 h-4" />,
  },
];

export function MainNavbar({ activeTab, onSelectTab }: MainNavbarProps) {
  const navRef = useRef<HTMLElement | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
    opacity: number;
  }>({ left: 0, top: 0, width: 0, height: 0, opacity: 0 });

  useLayoutEffect(() => {
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
      }
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeTab]);

  return (
    <header className="sticky top-0 z-1200 bg-white/85 backdrop-blur-xl border-b border-blue-100/90 shadow-xs">
      <div className="max-w-360 mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Kraków360 Brand Crest with Official Logo */}
        <button
          onClick={() => onSelectTab('resident')}
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          <img
            src="/logo.png"
            alt="Logo Kraków360"
            className="h-10 w-10 object-contain drop-shadow-sm group-hover:scale-105 transition-transform shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                Kraków<span className="text-blue-600">360</span>
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80">
                Smart City
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Analiza Jakości Życia, Dostępności Usług i Rozwoju Dzielnic Krakowa
            </p>
          </div>
        </button>

        {/* Center/Right: Mode Navigation Tabs with smooth sliding pill */}
        <nav ref={navRef} className="relative flex flex-wrap items-center gap-1 py-1">
          {/* Sliding Blue Pill Indicator */}
          <div
            className="absolute top-0 left-0 rounded-xl bg-blue-600 shadow-md shadow-blue-600/25 transition-all duration-300 ease-out pointer-events-none z-0"
            style={{
              transform: `translate3d(${indicatorStyle.left}px, ${indicatorStyle.top}px, 0)`,
              width: `${indicatorStyle.width}px`,
              height: `${indicatorStyle.height}px`,
              opacity: indicatorStyle.opacity,
            }}
          />

          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                ref={(el) => {
                  tabRefs.current[item.id] = el;
                }}
                onClick={() => onSelectTab(item.id)}
                className={`relative z-10 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold leading-none transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                <span className="shrink-0 flex items-center justify-center">{item.icon}</span>
                <span className="leading-none pt-0.5">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
