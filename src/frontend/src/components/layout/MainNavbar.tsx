import {
  Activity,
  Baby,
  BookOpen,
  Building2,
  CheckCircle2,
  Compass,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import type { SystemHelloDto } from '../../types/contracts';

export type AppTabId = 'resident' | 'parent' | 'investor' | 'methodology';

export interface MainNavbarProps {
  activeTab: AppTabId;
  onSelectTab: (tab: AppTabId) => void;
  hello: SystemHelloDto | null;
  loading: boolean;
  onRefreshApi: () => void;
}

interface NavItem {
  id: AppTabId;
  label: string;
  badge?: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'resident',
    label: 'Dla Mieszkańca',
    badge: 'Moduł 1',
    icon: <Compass className="w-4 h-4" />,
  },
  {
    id: 'parent',
    label: 'Dla Rodzica',
    badge: 'Moduł 2',
    icon: <Baby className="w-4 h-4" />,
  },
  {
    id: 'investor',
    label: 'Dla Urzędnika i Inwestora',
    badge: 'Moduł 3',
    icon: <Building2 className="w-4 h-4" />,
  },
  {
    id: 'methodology',
    label: 'Metodologia i Źródła Danych',
    icon: <BookOpen className="w-4 h-4" />,
  },
];

export function MainNavbar({
  activeTab,
  onSelectTab,
  hello,
  loading,
  onRefreshApi,
}: MainNavbarProps) {
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
              Otwarte Dane Miasta Krakowa • Jakość Życia i Predykcje Rozwoju
            </p>
          </div>
        </button>

        {/* Center: Mode Navigation Tabs (Inspired by inspiration.png top bar) */}
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
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-blue-500/50 text-blue-50 border border-blue-400/50'
                        : 'bg-blue-50 text-blue-600 border border-blue-200/60'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Live API Telemetry Badge & Refresh Action */}
        <div className="flex items-center gap-2.5">
          {hello?.databaseConnected ? (
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              API Online ({hello.seededDistrictsCount} dzielnic)
            </span>
          ) : (
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              <Activity className="w-3.5 h-3.5 text-amber-600" />
              {loading ? 'Łączenie z API...' : 'Tryb Offline'}
            </span>
          )}

          <button
            onClick={onRefreshApi}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs transition cursor-pointer"
            title="Odśwież połączenie z backendem .NET 9 i bazą SQLite"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            <span className="hidden sm:inline">Odśwież dane</span>
          </button>
        </div>
      </div>
    </header>
  );
}
