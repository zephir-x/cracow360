import { Clock, GraduationCap, Trees } from 'lucide-react';

export function ParentCapabilitiesGrid() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-lg shadow-blue-900/5 space-y-3">
        <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
          <Clock className="w-5 h-5" />
        </div>
        <h3 className="text-base font-extrabold text-slate-900">
          Izochrony Dojścia Pieszego (300m / 500m / 1km)
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Kliknięcie dowolnego punktu lub wpisanie adresu w Krakowie wyrysuje bufor spacerowy i zliczy wszystkie placówki opiekuńcze, edukacyjne oraz przystanki KMK w zasięgu pieszego dojścia.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-lg shadow-blue-900/5 space-y-3">
        <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
          <GraduationCap className="w-5 h-5" />
        </div>
        <h3 className="text-base font-extrabold text-slate-900">
          Mapa Żłobków, Przedszkoli i Klubów Rodziców
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Wizualizacja punktów POI z rozróżnieniem na żłobki samorządowe, prywatne z dotacją Gminy Miejskiej Kraków, kluby dziecięce oraz szkoły podstawowe wraz z ich obłożeniem.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-lg shadow-blue-900/5 space-y-3">
        <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
          <Trees className="w-5 h-5" />
        </div>
        <h3 className="text-base font-extrabold text-slate-900">
          Zieleń Przydomowa i Parki Kieszonkowe
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Analiza odległości od najbliższego parku miejskiego, parku kieszonkowego ZZM, placu zabaw oraz przyszkolnych obiektów sportowych i basenów.
        </p>
      </div>
    </section>
  );
}
