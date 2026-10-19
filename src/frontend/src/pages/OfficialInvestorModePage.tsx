import {
  ArrowLeft,
  Building2,
  Calculator,
  LineChart,
  Sliders,
  TrendingUp,
} from 'lucide-react';
import type { DistrictSummaryDto } from '../types/contracts';

export interface OfficialInvestorModePageProps {
  districts: DistrictSummaryDto[];
  onBackToResidentMode: () => void;
}

export function OfficialInvestorModePage({
  districts,
  onBackToResidentMode,
}: OfficialInvestorModePageProps) {
  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#0a2540] via-[#1d4ed8] to-[#0284c7] text-white p-8 sm:p-10 shadow-xl border border-blue-400/30">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-semibold text-sky-100">
            <Building2 className="w-4 h-4 text-sky-300" />
            Moduł 3: Tryb Urzędnika i Inwestora (B2G / B2B)
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Predykcje Demograficzne 2028
            <br />
            <span className="text-sky-200">i Symulator Inwestycyjny „Co-Jeśli”.</span>
          </h1>
          <p className="text-sm sm:text-base text-blue-100/95 leading-relaxed">
            Narzędzie wspomagania decyzji dla Urzędu Miasta Krakowa oraz prywatnych inwestorów edukacyjnych: modele ekonometryczne prognozujące przyrost dzieci (0–3, 4–6 lat) i seniorów (65+) do 2028 roku oraz symulator sprawdzający wpływ budowy nowego żłobka lub parku na wskaźniki dzielnicy.
          </p>
          <div className="pt-2">
            <button
              onClick={onBackToResidentMode}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-white text-blue-900 hover:bg-sky-50 shadow-lg transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-blue-600" />
              Wróć do Modułu 1 (Mapa i Porównywarka 18 Dzielnic)
            </button>
          </div>
        </div>
      </section>

      {/* Module 3 Capabilities */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-lg shadow-blue-900/5 space-y-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <LineChart className="w-5 h-5" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">
            Modele Ekonometryczne (2027–2030)
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Prognoza liczby dzieci w wieku żłobkowym (0–3) i przedszkolnym (4–6) wyliczana w Pythonie (`statsmodels` / `scikit-learn`) na podstawie trendów meldunkowych i oddawanych mieszkań.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-lg shadow-blue-900/5 space-y-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <Sliders className="w-5 h-5" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">
            Symulator „Co-Jeśli” (What-If)
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Możliwość wirtualnego dodania np. nowego żłobka samorządowego na 120 miejsc w Dzielnicy IV Prądnik Biały i sprawdzenia na żywo, o ile spadnie deficyt miejsc w 2028 roku.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-lg shadow-blue-900/5 space-y-3">
          <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
            <Calculator className="w-5 h-5" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">
            Mapa Deficytów Inwestycyjnych B2B/B2G
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Automatyczna klasyfikacja dzielnic (`HIGH`, `MEDIUM`, `LOW`) wskazująca, gdzie miasto lub prywatny operator powinien w pierwszej kolejności otworzyć żłobek, CAS lub park kieszonkowy.
          </p>
        </div>
      </section>

      {/* Overview of Districts Requiring Municipal Investment */}
      <section className="rounded-3xl bg-white border border-blue-100 p-6 sm:p-8 shadow-xl shadow-blue-900/5 space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Przegląd Potencjału Demograficznego 18 Dzielnic Krakowa
            </h2>
            <p className="text-xs text-slate-500">
              Zestawienie populacji i ocen bazowych zasilających modele predykcyjne Modułu 3
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {districts.slice(0, 9).map((d) => (
            <div
              key={d.districtId}
              className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900">{d.districtName}</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                  {d.areaKm2} km²
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Populacja: <strong>{d.totalPopulation.toLocaleString('pl-PL')}</strong></span>
                <span>Edukacja: <strong>{d.scores.educationScore} pkt</strong></span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
