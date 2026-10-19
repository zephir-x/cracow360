import { useEffect, useState } from 'react';
import { Activity, CheckCircle2, Database, Layers, MapPin, RefreshCw, Server, Terminal } from 'lucide-react';
import { cracow360Api } from './api/client';
import type { DistrictSummaryDto, SystemHelloDto } from './types/contracts';

export function App() {
  const [hello, setHello] = useState<SystemHelloDto | null>(null);
  const [districts, setDistricts] = useState<DistrictSummaryDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const [helloData, districtsData] = await Promise.all([
        cracow360Api.getSystemHello(),
        cracow360Api.getDistricts(),
      ]);
      setHello(helloData);
      setDistricts(districtsData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Brak połączenia z backendem .NET 9 (upewnij się, że API działa na http://localhost:5000).'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchStatus();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              Kraków360 <span className="text-xs font-medium px-2 py-0.5 ml-2 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">Open Data App 2026</span>
            </h1>
            <p className="text-xs text-slate-400">
              System Analizy Jakości Życia, Dostępności Usług i Predykcji Rozwoju Miejskiego
            </p>
          </div>
        </div>

        <button
          onClick={() => void fetchStatus()}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-sky-400' : ''}`} />
          Odśwież połączenie API
        </button>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 space-y-6">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
                <Terminal className="w-4 h-4" />
                Etap 1: Środowisko Deweloperskie Gotowe
              </div>
              <h2 className="text-2xl font-bold text-white">
                {hello ? hello.message : 'Hello World – Kraków360 Frontend'}
              </h2>
              <p className="text-sm text-slate-400">
                Architektura Clean Architecture (.NET 9 Minimal API + EF Core SQLite) połączona z React + TypeScript + Vite + TailwindCSS.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {hello?.databaseConnected ? (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4" />
                  Backend & SQLite Online
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  <Activity className="w-4 h-4" />
                  {loading ? 'Łączenie z API...' : 'Oczekiwanie na Backend API'}
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs">
              <strong>Błąd połączenia:</strong> {error}
            </div>
          )}

          {hello && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3">
                <Server className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-400">Środowisko API (.NET 9)</div>
                  <div className="text-sm font-semibold text-white mt-0.5">{hello.environment}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Czas UTC: {new Date(hello.serverTimeUtc).toLocaleTimeString()}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3">
                <Database className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-400">Warstwa Danych</div>
                  <div className="text-sm font-semibold text-white mt-0.5">{hello.databaseProvider}</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Zaseedowane dzielnice: {hello.seededDistrictsCount} | POI: {hello.seededPoisCount}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3">
                <Layers className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-400">Następny Krok Implementacji</div>
                  <div className="text-sm font-semibold text-white mt-0.5">Moduł 1: Tryb Mieszkańca</div>
                  <div className="text-[11px] text-slate-500 mt-1">Indeks Jakości Życia (Poziom Makro)</div>
                </div>
              </div>
            </div>
          )}
        </section>

        {districts.length > 0 && (
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Dane testowe z kontraktu JSON (SQLite Seed Preview)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {districts.map((d) => (
                <div
                  key={d.districtId}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-500/15 text-sky-300">
                        Dzielnica {d.districtRoman}
                      </span>
                      <span className="text-xs text-slate-400">{d.areaKm2} km²</span>
                    </div>
                    <h4 className="text-base font-semibold text-white mt-2">{d.districtName}</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Populacja: <strong className="text-slate-200">{d.totalPopulation.toLocaleString('pl-PL')}</strong> mieszk.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Indeks Jakości Życia:</span>
                    <span className="text-sm font-bold text-emerald-400">
                      {d.weightedQualityOfLifeIndex} / 100 pkt
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
