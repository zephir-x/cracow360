import { ArrowLeft, Baby, Clock, GraduationCap, MapPin, ShieldCheck, Trees } from 'lucide-react';
import type { DistrictSummaryDto } from '../types/contracts';

export interface ParentModePageProps {
  districts: DistrictSummaryDto[];
  onBackToResidentMode: () => void;
}

export function ParentModePage({ districts, onBackToResidentMode }: ParentModePageProps) {
  const topEducationDistricts = [...districts]
    .sort((a, b) => b.scores.educationScore - a.scores.educationScore)
    .slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Hero Header */}
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
              Wróć do Modułu 1 (Mapa i Porównywarka 18 Dzielnic)
            </button>
          </div>
        </div>
      </section>

      {/* Planned Features Grid for Module 2 */}
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

      {/* Live Preview of Top 6 Districts in Education & Childcare Category */}
      <section className="rounded-3xl bg-white border border-blue-100 p-6 sm:p-8 shadow-xl shadow-blue-900/5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Aktualny Ranking Dzielnic w Kategorii: Edukacja i Opieka (0–14 lat)
              </h2>
              <p className="text-xs text-slate-500">
                Dane zagregowane na poziomie dzielnic (już aktywne w bazie SQLite)
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topEducationDistricts.map((d, idx) => (
            <div
              key={d.districtId}
              className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-7 h-7 rounded-xl bg-blue-600 text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                  #{idx + 1}
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-extrabold text-slate-900 truncate">
                    {d.districtName}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-blue-500" />
                    Populacja: {d.totalPopulation.toLocaleString('pl-PL')}
                  </div>
                </div>
              </div>
              <div className="text-xs font-extrabold px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                {d.scores.educationScore.toFixed(1)} pkt
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
