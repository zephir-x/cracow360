import { Database, ExternalLink, FileSpreadsheet, Layers, MapPin, Server } from 'lucide-react';
import type { SystemHelloDto } from '../../types/contracts';
import type { AppTabId } from './MainNavbar';

export interface MainFooterProps {
  hello: SystemHelloDto | null;
  onSelectTab: (tab: AppTabId) => void;
}

export function MainFooter({ hello, onSelectTab }: MainFooterProps) {
  return (
    <footer className="mt-14 border-t border-blue-100 bg-white/90 backdrop-blur-md">
      <div className="max-w-360 mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Top System & Data Provenance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-linear-to-br from-blue-50/70 to-white border border-blue-100 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-100/80 text-blue-700">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Silnik Backend (.NET 9)
              </div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">
                {hello ? `${hello.environment} • Minimal API` : 'Clean Architecture API'}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {hello
                  ? `Synchronizacja UTC: ${new Date(hello.serverTimeUtc).toLocaleTimeString()}`
                  : 'Port lokalny: http://localhost:5000'}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-linear-to-br from-blue-50/70 to-white border border-blue-100 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-sky-100/80 text-sky-700">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Baza Danych &amp; Cache
              </div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">
                {hello?.databaseProvider ?? 'SQLite + IMemoryCache'}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Dzielnice: {hello?.seededDistrictsCount ?? 18} • Punkty POI: {hello?.seededPoisCount ?? 3}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-linear-to-br from-blue-50/70 to-white border border-blue-100 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-100/80 text-indigo-700">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Otwarte Dane Krakowa
              </div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">
                BDK UMK • MSIP • ZTP • GIOŚ
              </div>
              <button
                onClick={() => onSelectTab('methodology')}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 mt-0.5 cursor-pointer"
              >
                Zobacz pełny rejestr źródeł
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-linear-to-br from-blue-50/70 to-white border border-blue-100 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-100/80 text-emerald-700">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Konkurs Smart City 2026
              </div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">
                „Open Data App” – Gmina Miejska Kraków
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Strategia Rozwoju: „Tu chcę żyć. Kraków 2030”
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800">Kraków360</span>
            <span>— System Analizy Jakości Życia, Dostępności Usług i Predykcji Rozwoju Miejskiego</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onSelectTab('resident')}
              className="hover:text-blue-600 transition cursor-pointer"
            >
              Dla Mieszkańca
            </button>
            <button
              onClick={() => onSelectTab('parent')}
              className="hover:text-blue-600 transition cursor-pointer"
            >
              Dla Rodzica
            </button>
            <button
              onClick={() => onSelectTab('investor')}
              className="hover:text-blue-600 transition cursor-pointer"
            >
              Dla Urzędnika i Inwestora
            </button>
            <button
              onClick={() => onSelectTab('methodology')}
              className="hover:text-blue-600 transition cursor-pointer"
            >
              Metodologia i Źródła
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
