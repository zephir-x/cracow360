import { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Calculator,
  CheckCircle2,
  Database,
  ExternalLink,
  FileSpreadsheet,
  Layers,
  Scale,
  Search,
} from 'lucide-react';

export interface AboutDataMethodologyPageProps {
  onBackToResidentMode: () => void;
}

interface DataSourceItem {
  id: string;
  category: 'demographics' | 'education' | 'transport' | 'greenery' | 'culture' | 'gis_env';
  categoryLabel: string;
  officialDatasetName: string;
  metrics: string;
  portalUrl: string;
  status: string;
}

const ALL_DATA_SOURCES: DataSourceItem[] = [
  // GIS & Środowisko
  {
    id: 'gis-1',
    category: 'gis_env',
    categoryLabel: 'Granice & Środowisko',
    officialDatasetName: 'Granice 18 Dzielnic Krakowa (MSIP / PRG GUGiK)',
    metrics: 'Wektorowe granice Polygon/MultiPolygon 18 dzielnic, powierzchnia administracyjna w km²',
    portalUrl: 'https://msip.krakow.pl',
    status: 'Warstwa GIS',
  },
  {
    id: 'gis-2',
    category: 'gis_env',
    categoryLabel: 'Granice & Środowisko',
    officialDatasetName: 'Portal Jakości Powietrza – Pomiary Stacji w Krakowie',
    metrics: 'Pomiary stężeń pyłów PM10, PM2.5, NO2 oraz indeks jakości powietrza',
    portalUrl: 'https://powietrze.gios.gov.pl',
    status: 'REST API Online',
  },

  // Demografia
  {
    id: 'demo-1',
    category: 'demographics',
    categoryLabel: 'Demografia',
    officialDatasetName: 'Mieszkańcy Krakowa zameldowani na pobyt stały (2025)',
    metrics: 'Struktura demograficzna dzielnic, kohorty wieku (0–3, 4–6, 7–14, 15–64, 65+), gęstość zaludnienia',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/mieszkancy-zameldowani-na-pobyt-staly',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'demo-2',
    category: 'demographics',
    categoryLabel: 'Demografia',
    officialDatasetName: 'Mieszkańcy Krakowa zameldowani na pobyt stały (2024)',
    metrics: 'Roczna dynamika zmian zaludnienia oraz szeregi czasowe do prognoz',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/mieszkancy-zameldowani-na-pobyt-staly',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'demo-3',
    category: 'demographics',
    categoryLabel: 'Demografia',
    officialDatasetName: 'Mieszkańcy Krakowa zameldowani na pobyt stały (2023)',
    metrics: '3-letnia baza meldunków stałych do wskaźnika trendu demograficznego oraz modelu ekonometrycznego 2028',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/mieszkancy-zameldowani-na-pobyt-staly',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'demo-4',
    category: 'demographics',
    categoryLabel: 'Demografia',
    officialDatasetName: 'Mieszkańcy Krakowa zameldowani na pobyt czasowy (2025)',
    metrics: 'Liczba mieszkańców na pobycie czasowym, rzeczywista baza zaludnienia dzielnic',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/mieszkancy-krakowa-zameldowani-na-pobyt-czasowy',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'demo-5',
    category: 'demographics',
    categoryLabel: 'Demografia',
    officialDatasetName: 'Mieszkańcy Krakowa zameldowani na pobyt czasowy (2024)',
    metrics: 'Roczna dynamika napływu mieszkańców czasowych do modelu popytu',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/mieszkancy-krakowa-zameldowani-na-pobyt-czasowy',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'demo-6',
    category: 'demographics',
    categoryLabel: 'Demografia',
    officialDatasetName: 'Mieszkańcy Krakowa zameldowani na pobyt czasowy (2023)',
    metrics: '3-letnia baza meldunków czasowych do łącznego wskaźnika dynamiki zaludnienia',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/mieszkancy-krakowa-zameldowani-na-pobyt-czasowy',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'demo-7',
    category: 'demographics',
    categoryLabel: 'Demografia',
    officialDatasetName: 'Cudzoziemcy w Krakowie zameldowani na pobyt stały',
    metrics: 'Liczba i odsetek obcokrajowców zameldowanych na pobyt stały w 18 dzielnicach',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/cudzoziemcy-w-krakowie-zameldowani-na-pobyt-staly',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'demo-8',
    category: 'demographics',
    categoryLabel: 'Demografia',
    officialDatasetName: 'Cudzoziemcy w Krakowie zameldowani na pobyt czasowy',
    metrics: 'Liczba i odsetek obcokrajowców na pobycie czasowym, łączny wskaźnik umiędzynarodowienia dzielnic',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/cudzoziemcy-w-krakowie',
    status: 'Zintegrowane w ETL',
  },

  // Edukacja i Opieka
  {
    id: 'edu-1',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Żłobki samorządowe w Krakowie',
    metrics: 'Liczba żłobków publicznych, ustawowa pula miejsc opieki, wskaźnik obłożenia miejsc 0–3, POI NURSERY_PUBLIC',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/zlobki-samorzadowe-w-krakowie',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'edu-2',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Żłobki prowadzone na zlecenie GMK',
    metrics: 'Żłobki niesamorządowe na zlecenie GMK, dotowane miejsca opieki maluchów, POI NURSERY_CONTRACTED',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/zlobki-niesamorzadowe-prowadzone-na-zlecenie-gminy-miejskiej-krakow',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'edu-3',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Żłobki prywatne w Krakowie',
    metrics: 'Żłobki prywatne, komercyjna pula miejsc opiekuńczych dla dzieci, POI NURSERY_PRIVATE',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/zlobki-prywatne-w-krakowie',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'edu-4',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Kluby dziecięce w Krakowie',
    metrics: 'Kluby dziecięce, alternatywna pula opieki instytucjonalnej 0–3 lata, POI KIDS_CLUB',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/kluby-dzieciece-w-krakowie',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'edu-5',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Kluby Rodziców z dziećmi do lat 3 w Krakowie',
    metrics: 'Miejskie Kluby Rodziców z dziećmi do lat 3, punkty integracji i wsparcia rodzinnego, POI PARENT_CLUB',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/kluby-rodzicow-z-dziecmi-do-lat-3-w-krakowie',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'edu-6',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Przedszkola w Krakowie – samorządowe (SIO)',
    metrics: 'Wykaz przedszkoli samorządowych, liczba oddziałów, liczba wychowanków, POI KINDERGARTEN',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/przedszkola-w-krakowie-liczba-dzieci',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'edu-7',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Przedszkola w Krakowie – niesamorządowe (SIO)',
    metrics: 'Wykaz przedszkoli niepublicznych, uzupełniająca baza wychowania przedszkolnego',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/przedszkola-w-krakowie-liczba-dzieci',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'edu-8',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Szkoły podstawowe w Krakowie – samorządowe (SIO)',
    metrics: 'Samorządowe szkoły podstawowe, liczba klas I–VIII, średnia liczba uczniów w klasie, POI PRIMARY_SCHOOL',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/szkoly-podstawowe-w-krakowie-liczba-dzieci',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'edu-9',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Szkoły podstawowe w Krakowie – niesamorządowe (SIO)',
    metrics: 'Niepubliczne szkoły podstawowe, uzupełniająca baza edukacji wczesnoszkolnej',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/szkoly-podstawowe-w-krakowie-liczba-dzieci',
    status: 'Zintegrowane w ETL',
  },

  // Mobilność i Transport
  {
    id: 'trans-1',
    category: 'transport',
    categoryLabel: 'Mobilność & KMK',
    officialDatasetName: 'Komunikacja Miejska w Krakowie (KMK) – Przystanki',
    metrics: 'Przystanki komunikacji miejskiej (tramwaje i autobusy), gęstość sieci KMK na km²',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/komunikacja-miejska-w-krakowie-kmk',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'trans-2',
    category: 'transport',
    categoryLabel: 'Mobilność & KMK',
    officialDatasetName: 'Komunikacja Miejska w Krakowie (KMK) – Parkingi P+R',
    metrics: 'Parkingi przesiadkowe Park & Ride, liczba miejsc postojowych, stacje ładowania EV, POI PARK_AND_RIDE',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/komunikacja-miejska-w-krakowie-kmk',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'trans-3',
    category: 'transport',
    categoryLabel: 'Mobilność & KMK',
    officialDatasetName: 'Komunikacja Miejska w Krakowie (KMK) – Izochrony',
    metrics: 'Strefy pieszego dojścia do transportu zbiorowego (300 m / 500 m), wskaźnik pokrycia izochroną KMK',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/komunikacja-miejska-w-krakowie-kmk',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'trans-4',
    category: 'transport',
    categoryLabel: 'Mobilność & KMK',
    officialDatasetName: 'Mobilność Aktywna (Rowery) – Stojaki ZTP',
    metrics: 'Infrastruktura rowerowa ZTP, pojemność stojaków rowerowych w dzielnicach',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/mobilnosc-aktywna-rowery-w-krakowie',
    status: 'Zintegrowane w ETL',
  },

  // Zieleń i Sport
  {
    id: 'green-1',
    category: 'greenery',
    categoryLabel: 'Zieleń & Sport',
    officialDatasetName: 'Parki miejskie w Krakowie (ZZM)',
    metrics: 'Parki miejskie, łączny areał zieleni w ha, powierzchnia zieleni na mieszkańca (m²/os.), POI CITY_PARK',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/parki-miejskie-w-krakowie',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'green-2',
    category: 'greenery',
    categoryLabel: 'Zieleń & Sport',
    officialDatasetName: 'Parki kieszonkowe w Krakowie (ZZM)',
    metrics: 'Parki kieszonkowe (Ogrody Krakowian), lokalna dostępność do zieleni wypoczynkowej, POI POCKET_PARK',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/parki-kieszonkowe-w-krakowie',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'green-3',
    category: 'greenery',
    categoryLabel: 'Zieleń & Sport',
    officialDatasetName: 'Infrastruktura sportowa szkół samorządowych',
    metrics: 'Przyszkolne boiska wielofunkcyjne, piłkarskie, koszykarskie i bieżnie lekkoatletyczne',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/infrastruktura-sportowa-szkol-i-oplacowek-samorzadowych-w-roku-szkolnym-2023-2024',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'green-4',
    category: 'greenery',
    categoryLabel: 'Zieleń & Sport',
    officialDatasetName: 'Infrastruktura sportowa szkół niesamorządowych',
    metrics: 'Infrastruktura sportowa i boiska przy placówkach niepublicznych',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/infrastruktura-sportowa-szkol-i-placowek-niesamorzadowych-w-roku-szkolnym-2023-2024',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'green-5',
    category: 'greenery',
    categoryLabel: 'Zieleń & Sport',
    officialDatasetName: 'Infrastruktura sportowa szkół – Hale i Baseny (SIO)',
    metrics: 'Hale sportowe, sale gimnastyczne, przyszkolne pływalnie sportowo-rekreacyjne i siłownie',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/infrastruktura-sportowa-szkol-i-oplacowek-samorzadowych-w-roku-szkolnym-2023-2024',
    status: 'Zintegrowane w ETL',
  },

  // Kultura i Społeczność
  {
    id: 'cult-1',
    category: 'culture',
    categoryLabel: 'Kultura & Biblioteki',
    officialDatasetName: 'Działalność miejskich centrów i ośrodków kultury',
    metrics: 'Miejskie domy i centra kultury, roczna liczba wydarzeń artystycznych, dotacje podmiotowe per capita',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/dzialalnosc-miejskich-osrodkow-kultury-w-krakowie',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'cult-2',
    category: 'culture',
    categoryLabel: 'Kultura & Biblioteki',
    officialDatasetName: 'Lista bibliotek miejskich (filii) Biblioteki Kraków',
    metrics: 'Filie Biblioteki Kraków w dzielnicach, dostępność do księgozbiorów i czytelnictwa, POI LIBRARY',
    portalUrl: 'https://otwartedane.um.krakow.pl/zbiory-danych/lista-bibliotek-miejskich-biblioteki-krakow',
    status: 'Zintegrowane w ETL',
  },
];

const CATEGORY_TABS = [
  { key: 'all', label: 'Wszystkie Zbiory', count: ALL_DATA_SOURCES.length },
  { key: 'demographics', label: 'Demografia', count: 8 },
  { key: 'education', label: 'Edukacja i Opieka', count: 9 },
  { key: 'transport', label: 'Mobilność i KMK', count: 4 },
  { key: 'greenery', label: 'Zieleń i Sport', count: 5 },
  { key: 'culture', label: 'Kultura i Biblioteki', count: 2 },
  { key: 'gis_env', label: 'Granice i Powietrze', count: 2 },
];

export function AboutDataMethodologyPage({
  onBackToResidentMode,
}: AboutDataMethodologyPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredSources = ALL_DATA_SOURCES.filter((item) => {
    const matchesCategory =
      activeCategory === 'all' || item.category === activeCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      item.officialDatasetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.metrics.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#0a2e65] via-[#1d4ed8] to-[#0284c7] text-white p-8 sm:p-10 shadow-xl border border-blue-400/30">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-semibold text-sky-100">
            <BookOpen className="w-4 h-4 text-sky-300" />
            O Projekcie • Metodologia i Publiczne Rejestry Miejskie
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Metodologia Wyliczania Indeksu
            <br />
            <span className="text-sky-200">oraz Rejestr Źródeł Otwartych Danych.</span>
          </h1>
          <p className="text-sm sm:text-base text-blue-100/95 leading-relaxed">
            Transparentność danych i poprawność statystyczna to fundament platformy Kraków360. Poniżej przedstawiamy dokładny sposób wyliczania punktacji (0–100 pkt) oraz wykaz 30 oficjalnych rejestrów miejskich powiązanych bezpośrednio z plikami w potoku analitycznym.
          </p>
          <div className="pt-2">
            <button
              onClick={onBackToResidentMode}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-white text-blue-900 hover:bg-sky-50 shadow-lg transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-blue-600" />
              Wróć do Mapy i Porównywarki Dzielnic
            </button>
          </div>
        </div>
      </section>

      {/* Two-Stage Mathematical Model Explanation */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-100 shadow-lg shadow-blue-900/5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                Etap 1 • Standaryzacja Wskaźników
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                Normalizacja Min-Max Wskaźników Surowych do Skali 0–100 pkt
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Aby móc rzetelnie porównywać wskaźniki wyrażone w różnych jednostkach (np. liczbę przystanków KMK, m² parków na mieszkańca oraz liczbę dzieci przypadających na 1 miejsce w żłobku), każdy wskaźnik surowy przechodzi standaryzację <strong>Min-Max (0–100 pkt)</strong>:
          </p>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Stymulanty (im więcej, tym lepiej):</strong> Dzielnica z najwyższą wartością w Krakowie otrzymuje 100 pkt, a z najniższą 0 pkt (np. gęstość przystanków KMK, m² zieleni na mieszkańca, liczba bibliotek i domów kultury).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Destymulanty (im mniej, tym lepiej – odwrócona skala):</strong> Dzielnica z najniższą wartością otrzymuje 100 pkt (np. liczba dzieci czekających na 1 miejsce w żłobku, średnia liczba uczniów w klasie, zagęszczenie ruchu).
              </span>
            </li>
          </ul>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-100 shadow-lg shadow-blue-900/5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600">
                Etap 2 • Personalizacja dla Mieszkańca
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                Dynamiczna Średnia Ważona z 5 Suwaków Preferencji (0–10)
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Każdy mieszkaniec ma inne priorytety – student szuka szybkiego tramwaju KMK i wydarzeń kulturalnych, natomiast rodzina 2+1 szuka miejsc w żłobkach, bezpiecznych szkół i parków. Gdy przesuwasz suwaki (0–10), wyliczamy spersonalizowany indeks:
          </p>
          <div className="p-4 rounded-2xl bg-slate-50 border border-blue-100 font-mono text-xs text-blue-900 text-center">
            Indeks = (Mob·W₁ + Edu·W₂ + Ziel·W₃ + Kult·W₄ + Środ·W₅) / (W₁ + W₂ + W₃ + W₄ + W₅)
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Zmiana układu suwaków lub wybór profilu mieszkańca natychmiastowo przelicza łączną ocenę dla wszystkich 18 dzielnic Krakowa, aktualizując kolory na mapie oraz kolejność w rankingu.
          </p>
        </div>
      </section>

      {/* Complete Open Data Sources Registry Table with Filters */}
      <section className="rounded-3xl bg-white border border-blue-100 overflow-hidden shadow-xl shadow-blue-900/5">
        <div className="px-6 py-5 bg-linear-to-r from-blue-50/80 to-white border-b border-blue-100 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-600 text-white">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Rejestr Źródeł Otwartych Danych Miasta Krakowa
                </h2>
                <p className="text-xs text-slate-500">
                  Pełne powiązanie rejestrów miejskich z potokiem analitycznym Kraków360
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              <FileSpreadsheet className="w-3.5 h-3.5" />30 Zasobów
            </span>
          </div>

          {/* Search bar and Category Pills */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-1.5">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveCategory(tab.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    activeCategory === tab.key
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200/70'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      activeCategory === tab.key
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200/80 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative min-w-55">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Szukaj zbioru lub wskaźnika..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Clean, Frameless Full-Width Table with optimized column allocation */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500">
                <th className="py-3 px-4 font-bold w-36 whitespace-nowrap">Kategoria</th>
                <th className="py-3 px-4 font-bold min-w-85 xl:w-120">Oficjalny Zbiór Otwartych Danych</th>
                <th className="py-3 px-4 font-bold">Wyliczane wskaźniki w Kraków360</th>
                <th className="py-3 px-4 font-bold text-right w-36 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSources.map((src) => (
                <tr key={src.id} className="hover:bg-blue-50/30 transition">
                  <td className="py-3 px-4 font-bold text-slate-800 whitespace-nowrap">
                    {src.categoryLabel}
                  </td>
                  <td className="py-3 px-4">
                    <a
                      href={src.portalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between gap-3 font-semibold text-blue-600 hover:text-blue-800 hover:underline group w-full"
                    >
                      <span className="whitespace-nowrap">{src.officialDatasetName}</span>
                      <span className="p-1 rounded-md bg-blue-50 text-blue-500 group-hover:bg-blue-100 group-hover:text-blue-700 transition shrink-0 ml-auto">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </span>
                    </a>
                  </td>
                  <td className="py-3 px-4 text-slate-600 leading-relaxed">
                    {src.metrics}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                      <Layers className="w-3 h-3 shrink-0" />
                      {src.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredSources.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    Brak wyników dla podanej frazy wyszukiwania.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
