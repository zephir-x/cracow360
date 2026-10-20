import { Baby, BookOpen, Building2, Compass, MapPin } from 'lucide-react';
import * as React from "react";

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
  return (
    <header className="sticky top-0 z-1200 bg-white/85 backdrop-blur-xl border-b border-blue-100/90 shadow-xs">
      <div className="max-w-360 mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Kraków360 Brand Crest */}
        <button
          onClick={() => onSelectTab('resident')}
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="h-10 w-10 rounded-2xl bg-linear-to-br from-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
            <MapPin className="w-5 h-5" />
          </div>
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

        {/* Center/Right: Mode Navigation Tabs */}
        <nav className="flex flex-wrap items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-white/80'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
