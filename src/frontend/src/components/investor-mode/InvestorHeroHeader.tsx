import { ArrowLeft, Building2 } from 'lucide-react';

export interface InvestorHeroHeaderProps {
  onBackToResidentMode: () => void;
}

export function InvestorHeroHeader({ onBackToResidentMode }: InvestorHeroHeaderProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#0a2540] via-[#1d4ed8] to-[#0284c7] text-white p-8 sm:p-10 shadow-xl border border-blue-400/30">
      <div className="max-w-2xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-semibold text-sky-100">
          <Building2 className="w-4 h-4 text-sky-300" />
          Tryb Urzędnika i Inwestora (B2G / B2B)
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
            Wróć do Mapy i Porównywarki 18 Dzielnic
          </button>
        </div>
      </div>
    </section>
  );
}
