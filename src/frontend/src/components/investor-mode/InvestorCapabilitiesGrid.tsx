import { Calculator, LineChart, Sliders } from 'lucide-react';

export function InvestorCapabilitiesGrid() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-lg shadow-blue-900/5 space-y-3">
        <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
          <LineChart className="w-5 h-5" />
        </div>
        <h3 className="text-base font-extrabold text-slate-900">
          Modele Ekonometryczne (2027–2030)
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Prognoza liczby dzieci w wieku żłobkowym (0–3) i przedszkolnym (4–6) wyliczana na podstawie trendów meldunkowych i oddawanych mieszkań.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-lg shadow-blue-900/5 space-y-3">
        <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
          <Sliders className="w-5 h-5" />
        </div>
        <h3 className="text-base font-extrabold text-slate-900">
          Symulator „Co-Jeśli"
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
          Automatyczna klasyfikacja dzielnic wskazująca, gdzie miasto lub prywatny operator powinien w pierwszej kolejności otworzyć żłobek, CAS lub park kieszonkowy.
        </p>
      </div>
    </section>
  );
}
