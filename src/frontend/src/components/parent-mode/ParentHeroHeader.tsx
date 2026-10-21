import { ArrowLeft, Baby } from 'lucide-react';

export interface ParentHeroHeaderProps {
  onBackToResidentMode: () => void;
}

export function ParentHeroHeader({ onBackToResidentMode }: ParentHeroHeaderProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#0f3460] via-[#1e40af] to-[#0369a1] text-white p-8 sm:p-10 shadow-xl border border-blue-400/30">
      <div className="max-w-2xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-semibold text-sky-100">
          <Baby className="w-4 h-4 text-sky-300" />
          Tryb Rodzica i Mieszkańca Lokalnego (Poziom Mikro)
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
          Mapa Dostępności Mikrolokalnej
          <br />
          <span className="text-sky-200">i Izochrony Miasta 15-Minutowego.</span>
        </h1>
        <p className="text-sm sm:text-base text-blue-100/95 leading-relaxed">
          Ten moduł odpowiada na pytanie rodzica szukającego mieszkania pod konkretnym adresem: ile żłobków samorządowych, przedszkoli, szkół podstawowych i parków kieszonkowych znajduje się w zasięgu 5, 8 i 15 minut spaceru (300 m / 500 m / 1000 m).
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
