import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Baby,
  Clock,
  GraduationCap,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Trees,
} from 'lucide-react';
import { cracow360Api } from '../api/client';
import type { DistrictSummaryDto, PointOfInterestDto, PoiSubCategory } from '../types/contracts';

export interface ParentModePageProps {
  districts: DistrictSummaryDto[];
  onBackToResidentMode: () => void;
}

const POI_FILTER_TABS: { id: string; label: string; subCategory?: PoiSubCategory }[] = [
  { id: 'all', label: 'Wszystkie placówki' },
  { id: 'nursery_pub', label: 'Żłobki samorządowe', subCategory: 'NURSERY_PUBLIC' },
  { id: 'nursery_priv', label: 'Żłobki prywatne / dotowane', subCategory: 'NURSERY_PRIVATE' },
  { id: 'parent_club', label: 'Kluby Rodziców', subCategory: 'PARENT_CLUB' },
  { id: 'kindergarten', label: 'Przedszkola', subCategory: 'KINDERGARTEN' },
  { id: 'school', label: 'Szkoły podstawowe', subCategory: 'PRIMARY_SCHOOL' },
];

/// <summary>
/// Parent & Family mode presenting walking accessibility isochrones,
/// district childcare rankings, and a live POI facility explorer.
/// </summary>
export function ParentModePage({ districts, onBackToResidentMode }: ParentModePageProps) {
  const [pois, setPois] = useState<PointOfInterestDto[]>([]);
  const [loadingPois, setLoadingPois] = useState<boolean>(true);
  const [activeFilterId, setActiveFilterId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Top districts in the Education & Childcare category
  const topEducationDistricts = useMemo(() => {
    return [...districts]
      .sort((a, b) => b.scores.educationScore - a.scores.educationScore)
      .slice(0, 6);
  }, [districts]);

  // Load real educational and childcare points of interest from backend API
  useEffect(() => {
    let cancelled = false;
    setLoadingPois(true);

    cracow360Api
      .getPois({ category: 'EDU_CARE' })
      .then((data) => {
        if (!cancelled) {
          setPois(data);
          setLoadingPois(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoadingPois(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Filter POIs based on selected subcategory and search term
  const filteredPois = useMemo(() => {
    const selectedTab = POI_FILTER_TABS.find((t) => t.id === activeFilterId);
    return pois.filter((poi) => {
      const matchesSubCategory = selectedTab?.subCategory
        ? poi.subCategory === selectedTab.subCategory
        : true;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        poi.name.toLowerCase().includes(q) ||
        poi.address.toLowerCase().includes(q);
      return matchesSubCategory && matchesSearch;
    });
  }, [pois, activeFilterId, searchQuery]);

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
              Wróć do Mapy i Porównywarki 18 Dzielnic
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

      {/* Live Interactive POI Facility Explorer */}
      <section className="rounded-3xl bg-white border border-blue-100 p-6 sm:p-8 shadow-xl shadow-blue-900/5 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Eksplorator Placówek Opiekuńczo-Edukacyjnych
              </h2>
              <p className="text-xs text-slate-500">
                Pobrane na żywo z bazy SQLite API ({pois.length} geokodowanych punktów POI)
              </p>
            </div>
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Szukaj po nazwie lub ulicy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-medium pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Subcategory Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {POI_FILTER_TABS.map((tab) => {
            const isActive = activeFilterId === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilterId(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* POI List / Cards */}
        {loadingPois ? (
          <div className="p-8 text-center text-xs text-slate-400 animate-pulse">
            Wczytywanie bazy punktów POI z serwera...
          </div>
        ) : filteredPois.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Nie znaleziono placówek spełniających wybrane kryteria wyszukiwania.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-96 overflow-y-auto pr-1">
            {filteredPois.slice(0, 30).map((poi) => (
              <div
                key={poi.id}
                className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-blue-50/40 hover:border-blue-200 transition-colors flex flex-col justify-between gap-2"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 truncate">
                      {poi.subCategory.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                      Dzielnica {poi.districtId}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-2">
                    {poi.name}
                  </h4>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span className="truncate">{poi.address || 'Kraków'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
