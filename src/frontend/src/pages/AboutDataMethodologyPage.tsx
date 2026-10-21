import { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Database,
  ExternalLink,
  FileSpreadsheet,
  Scale,
  Search,
} from 'lucide-react';

export interface AboutDataMethodologyPageProps {
  onBackToResidentMode: () => void;
}

interface DataSourceItem {
  id: string;
  category: 'demographics' | 'education' | 'transport' | 'greenery' | 'culture' | 'gis_env' | 'safety' | 'housing';
  categoryLabel: string;
  officialDatasetName: string;
  metrics: string;
  portalUrl: string;
  status: string;
}

const ALL_DATA_SOURCES: DataSourceItem[] = [
  // Rynek Mieszkaniowy i Koszty Życia (NOWY)
  {
    id: 'house-1',
    category: 'housing',
    categoryLabel: 'Mieszkania & Ceny',
    officialDatasetName: 'Ceny mieszkań i koszty najmu w dzielnicach Krakowa (2025–2026)',
    metrics: 'Średnia cena m² zakupu, rynek wtórny i pierwotny, mediana, koszt najmu m², relacja m² do pensji netto',
    portalUrl: 'https://otodom.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'house-2',
    category: 'housing',
    categoryLabel: 'Mieszkania & Ceny',
    officialDatasetName: 'Baza Cen Nieruchomości BaRN / Rejestr Cen Nieruchomości UMK',
    metrics: 'Kwartalna dynamika transakcyjna cen lokali mieszkalnych w Krakowie',
    portalUrl: 'https://nbp.pl',
    status: 'Rejestr NBP / RCN',
  },

  // Bezpieczeństwo i Spokój Publiczny (NOWY)
  {
    id: 'safe-1',
    category: 'safety',
    categoryLabel: 'Bezpieczeństwo & Ruch',
    officialDatasetName: 'Bezpieczeństwo i zdarzenia drogowe w dzielnicach Krakowa (2024–2025)',
    metrics: 'Roczna liczba kolizji drogowych, wypadki z udziałem pieszych, wypadki z rannymi w podziale na 18 dzielnic',
    portalUrl: 'https://obserwatoriumbrd.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'safe-2',
    category: 'safety',
    categoryLabel: 'Bezpieczeństwo & Ruch',
    officialDatasetName: 'Ewidencja interwencji Straży Miejskiej Miasta Krakowa',
    metrics: 'Łączna liczba interwencji porządkowych, zgłoszenia zakłócania ciszy nocnej i porządku publicznego',
    portalUrl: 'https://strazmiejska.krakow.pl',
    status: 'Zintegrowane w ETL',
  },

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
    officialDatasetName: 'Pomiary jakości powietrza i hałas w dzielnicach Krakowa (2024–2025)',
    metrics: 'Średnioroczne stężenia pyłów PM10 i PM2.5, roczna liczba dni smogowych, mapa hałasu drogowego >65 dB',
    portalUrl: 'https://powietrze.gios.gov.pl',
    status: 'Zintegrowane w ETL',
  },

  // Mobilność i Transport
  {
    id: 'trans-1',
    category: 'transport',
    categoryLabel: 'Mobilność & KMK',
    officialDatasetName: 'Komunikacja Miejska w Krakowie (KMK) – Przystanki',
    metrics: '1 378 przystanków komunikacji miejskiej (tramwaje i autobusy), gęstość sieci KMK na km²',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'trans-2',
    category: 'transport',
    categoryLabel: 'Mobilność & KMK',
    officialDatasetName: 'Komunikacja Miejska w Krakowie (KMK) – Parkingi P+R',
    metrics: 'Węzły przesiadkowe Park & Ride, liczba miejsc postojowych, stacje ładowania EV, POI PARK_AND_RIDE',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'trans-3',
    category: 'transport',
    categoryLabel: 'Mobilność & KMK',
    officialDatasetName: 'Infrastruktura rowerowa i sieć tras DDR w dzielnicach Krakowa',
    metrics: 'Długość wydzielonych dróg dla rowerów (DDR), pasów rowerowych i ciągów pieszo-rowerowych (381 km)',
    portalUrl: 'https://ztp.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'trans-4',
    category: 'transport',
    categoryLabel: 'Mobilność & KMK',
    officialDatasetName: 'Mobilność Aktywna (Rowery) – Stojaki ZTP',
    metrics: 'Infrastruktura rowerowa ZTP, pojemność stojaków rowerowych w dzielnicach',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },

  // Zieleń i Sport
  {
    id: 'green-1',
    category: 'greenery',
    categoryLabel: 'Zieleń & Sport',
    officialDatasetName: 'Lasy komunalne i rezerwaty przyrody w Krakowie (ZZM)',
    metrics: '20 kompleksów leśnych (860 ha, m.in. Las Wolski, Zakrzówek, Las Borkowski), leśny bufor per capita',
    portalUrl: 'https://zzm.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'green-2',
    category: 'greenery',
    categoryLabel: 'Zieleń & Sport',
    officialDatasetName: 'Parki miejskie w Krakowie (ZZM)',
    metrics: 'Parki miejskie (878 ha), powierzchnia zieleni parkowej na mieszkańca (m²/os.), POI CITY_PARK',
    portalUrl: 'https://zzm.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'green-3',
    category: 'greenery',
    categoryLabel: 'Zieleń & Sport',
    officialDatasetName: 'Parki kieszonkowe w Krakowie (ZZM)',
    metrics: 'Parki kieszonkowe (Ogrody Krakowian), lokalna dostępność do zieleni wypoczynkowej, POI POCKET_PARK',
    portalUrl: 'https://zzm.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'green-4',
    category: 'greenery',
    categoryLabel: 'Zieleń & Sport',
    officialDatasetName: 'Infrastruktura sportowa szkół samorządowych',
    metrics: 'Przyszkolne boiska wielofunkcyjne, piłkarskie, koszykarskie i bieżnie lekkoatletyczne',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'green-5',
    category: 'greenery',
    categoryLabel: 'Zieleń & Sport',
    officialDatasetName: 'Infrastruktura sportowa szkół niesamorządowych',
    metrics: 'Infrastruktura sportowa i boiska przy placówkach niepublicznych',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'green-6',
    category: 'greenery',
    categoryLabel: 'Zieleń & Sport',
    officialDatasetName: 'Infrastruktura sportowa szkół – Hale i Baseny (SIO)',
    metrics: 'Hale sportowe, sale gimnastyczne, przyszkolne pływalnie sportowo-rekreacyjne i siłownie',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },

  // Kultura i Społeczność
  {
    id: 'cult-1',
    category: 'culture',
    categoryLabel: 'Kultura & Seniorzy',
    officialDatasetName: 'Centra Aktywności Seniora w Krakowie (CAS)',
    metrics: '53 aktywne Centra Seniora we wszystkich 18 dzielnicach, adresy, operatorzy NGO, POI SENIOR_CENTER',
    portalUrl: 'https://dlaseniora.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'cult-2',
    category: 'culture',
    categoryLabel: 'Kultura & Seniorzy',
    officialDatasetName: 'Działalność miejskich centrów i ośrodków kultury',
    metrics: 'Miejskie domy i centra kultury, roczna liczba wydarzeń artystycznych, dotacje podmiotowe per capita',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'cult-3',
    category: 'culture',
    categoryLabel: 'Kultura & Seniorzy',
    officialDatasetName: 'Lista bibliotek miejskich (filii) Biblioteki Kraków',
    metrics: '56 filii Biblioteki Kraków w dzielnicach, dostępność do księgozbiorów i czytelnictwa, POI LIBRARY',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },

  // Demografia
  {
    id: 'demo-1',
    category: 'demographics',
    categoryLabel: 'Demografia',
    officialDatasetName: 'Mieszkańcy Krakowa zameldowani na pobyt stały (2025)',
    metrics: 'Struktura demograficzna dzielnic, kohorty wieku (0–3, 4–6, 7–14, 15–64, 65+), gęstość zaludnienia',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'demo-2',
    category: 'demographics',
    categoryLabel: 'Demografia',
    officialDatasetName: 'Mieszkańcy Krakowa zameldowani na pobyt stały (2024)',
    metrics: 'Roczna dynamika zmian zaludnienia oraz szeregi czasowe do prognoz',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'demo-3',
    category: 'demographics',
    categoryLabel: 'Demografia',
    officialDatasetName: 'Mieszkańcy Krakowa zameldowani na pobyt stały (2023)',
    metrics: '3-letnia baza meldunków stałych do wskaźnika trendu demograficznego oraz modelu ekonometrycznego 2028',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'demo-4',
    category: 'demographics',
    categoryLabel: 'Demografia',
    officialDatasetName: 'Mieszkańcy Krakowa zameldowani na pobyt czasowy (2025)',
    metrics: 'Liczba mieszkańców na pobycie czasowym, rzeczywista baza zaludnienia dzielnic',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'demo-5',
    category: 'demographics',
    categoryLabel: 'Demografia',
    officialDatasetName: 'Mieszkańcy Krakowa zameldowani na pobyt czasowy (2024)',
    metrics: 'Roczna dynamika napływu mieszkańców czasowych do modelu popytu',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'demo-6',
    category: 'demographics',
    categoryLabel: 'Demografia',
    officialDatasetName: 'Mieszkańcy Krakowa zameldowani na pobyt czasowy (2023)',
    metrics: '3-letnia baza meldunków czasowych do łącznego wskaźnika dynamiki zaludnienia',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'demo-7',
    category: 'demographics',
    categoryLabel: 'Demografia',
    officialDatasetName: 'Cudzoziemcy w Krakowie zameldowani na pobyt stały (2025)',
    metrics: 'Liczba i odsetek obcokrajowców zameldowanych na pobyt stały w 18 dzielnicach',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'demo-8',
    category: 'demographics',
    categoryLabel: 'Demografia',
    officialDatasetName: 'Cudzoziemcy w Krakowie zameldowani na pobyt czasowy (2025)',
    metrics: 'Liczba i odsetek obcokrajowców na pobycie czasowym, łączny wskaźnik umiędzynarodowienia dzielnic',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },

  // Edukacja i Opieka
  {
    id: 'edu-1',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Żłobki samorządowe w Krakowie',
    metrics: 'Liczba żłobków publicznych, ustawowa pula miejsc opieki, wskaźnik obłożenia miejsc 0–3, POI NURSERY_PUBLIC',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'edu-2',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Żłobki prowadzone na zlecenie GMK',
    metrics: 'Żłobki niesamorządowe na zlecenie GMK, dotowane miejsca opieki maluchów, POI NURSERY_CONTRACTED',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'edu-3',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Żłobki prywatne w Krakowie',
    metrics: 'Żłobki prywatne, komercyjna pula miejsc opiekuńczych dla dzieci, POI NURSERY_PRIVATE',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'edu-4',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Kluby dziecięce w Krakowie',
    metrics: 'Kluby dziecięce, alternatywna pula opieki instytucjonalnej 0–3 lata, POI KIDS_CLUB',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'edu-5',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Kluby Rodziców z dziećmi do lat 3 w Krakowie',
    metrics: 'Miejskie Kluby Rodziców z dziećmi do lat 3, punkty integracji i wsparcia rodzinnego, POI PARENT_CLUB',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'edu-6',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Przedszkola w Krakowie – samorządowe (SIO)',
    metrics: 'Wykaz przedszkoli samorządowych, liczba oddziałów, liczba wychowanków, POI KINDERGARTEN',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'edu-7',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Przedszkola w Krakowie – niesamorządowe (SIO)',
    metrics: 'Wykaz przedszkoli niepublicznych, uzupełniająca baza wychowania przedszkolnego',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'edu-8',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Szkoły podstawowe w Krakowie – samorządowe (SIO)',
    metrics: 'Samorządowe szkoły podstawowe, liczba klas I–VIII, średnia liczba uczniów w klasie, POI PRIMARY_SCHOOL',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
  {
    id: 'edu-9',
    category: 'education',
    categoryLabel: 'Edukacja i Opieka',
    officialDatasetName: 'Szkoły podstawowe w Krakowie – niesamorządowe (SIO)',
    metrics: 'Niepubliczne szkoły podstawowe, uzupełniająca baza edukacji wczesnoszkolnej',
    portalUrl: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w ETL',
  },
];

const CATEGORY_TABS = [
  { key: 'all', label: 'Wszystkie Zbiory', count: ALL_DATA_SOURCES.length },
  { key: 'housing', label: 'Mieszkania & Ceny', count: 2 },
  { key: 'safety', label: 'Bezpieczeństwo & Ruch', count: 2 },
  { key: 'transport', label: 'Mobilność i KMK', count: 4 },
  { key: 'greenery', label: 'Zieleń i Sport', count: 6 },
  { key: 'education', label: 'Edukacja i Opieka', count: 9 },
  { key: 'culture', label: 'Kultura i Seniorzy', count: 3 },
  { key: 'demographics', label: 'Demografia', count: 8 },
  { key: 'gis_env', label: 'Granice i Powietrze', count: 2 },
];

const ITEMS_PER_PAGE = 10;

export function AboutDataMethodologyPage({
  onBackToResidentMode,
}: AboutDataMethodologyPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const filteredSources = ALL_DATA_SOURCES.filter((item) => {
    const matchesCategory =
      activeCategory === 'all' || item.category === activeCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      item.officialDatasetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.metrics.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const totalPages = Math.max(1, Math.ceil(filteredSources.length / ITEMS_PER_PAGE));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredSources.length);
  const paginatedSources = filteredSources.slice(startIndex, endIndex);

  const handleCategoryChange = (key: string) => {
    setActiveCategory(key);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#0a2e65] via-[#1d4ed8] to-[#0284c7] text-white p-8 sm:p-10 shadow-xl border border-blue-400/30">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-semibold text-sky-100">
            <BookOpen className="w-4 h-4 text-sky-300" />
            O Projekcie • Metodologia 7 Filarów i Rejestry Miejskie
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Metodologia Wyliczania Indeksu
            <br />
            <span className="text-sky-200">oraz Rejestr Źródeł Otwartych Danych.</span>
          </h1>
          <p className="text-sm sm:text-base text-blue-100/95 leading-relaxed">
            Transparentność danych i poprawność statystyczna to fundament platformy Kraków360. Poniżej przedstawiamy dokładny sposób wyliczania punktacji (0–100 pkt) w 7 filarach oraz wykaz oficjalnych rejestrów miejskich powiązanych bezpośrednio z serwisami źródłowymi.
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
            Aby móc rzetelnie porównywać wskaźniki wyrażone w różnych jednostkach (ceny m² mieszkań, liczbę kolizji, liczbę przystanków KMK, m² lasów i parków na mieszkańca oraz liczbę dzieci przypadających na 1 miejsce w żłobku), każdy wskaźnik surowy przechodzi standaryzację <strong>Min-Max (0–100 pkt)</strong>:
          </p>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Stymulanty (im więcej, tym lepiej):</strong> Dzielnica z najwyższą wartością w Krakowie otrzymuje 100 pkt, a z najniższą 0 pkt (np. dostępność m² za pensję, drogi rowerowe DDR, m² zieleni i lasów, liczba bibliotek i CAS).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Destymulanty (im mniej, tym lepiej – odwrócona skala):</strong> Dzielnica z najniższą wartością otrzymuje 100 pkt (np. ceny zakupu i najmu m², kolizje drogowe, stężenia PM10, hałas komunikacyjny, obłożenie żłobków).
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
                Dynamiczna Średnia Ważona z 7 Suwaków Preferencji (0–10)
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Każdy mieszkaniec ma inne priorytety – student szuka przystępnych cen najmu i szybkiego tramwaju KMK, a rodzina 2+1 szuka bezpieczeństwa, żłobków i parków. Gdy przesuwasz suwaki (0–10), wyliczamy spersonalizowany indeks:
          </p>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-blue-100 font-mono text-[11px] text-blue-900 text-center leading-relaxed">
            <div>Indeks = (Mob·W₁ + Edu·W₂ + Ziel·W₃ + Kult·W₄ + Środ·W₅ + Bezp·W₆ + Cen·W₇)</div>
            <div className="mt-1 font-semibold text-blue-700">/ (W₁ + W₂ + W₃ + W₄ + W₅ + W₆ + W₇)</div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Zmiana układu suwaków lub wybór gotowego profilu mieszkańca natychmiastowo przelicza łączną ocenę dla wszystkich 18 dzielnic Krakowa, aktualizując kolory na mapie oraz kolejność w rankingu.
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
                  Rejestr Źródeł Otwartych Danych 1:1 Miasta Krakowa
                </h2>
                <p className="text-xs text-slate-500">
                  33 zbiory surowe zintegrowane w potoku analitycznym Kraków360 z odnośnikami do oficjalnych portali
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              <FileSpreadsheet className="w-3.5 h-3.5" />{ALL_DATA_SOURCES.length} Zbiorów Danych
            </span>
          </div>

          {/* Search bar and Category Pills (5 in row 1, 4 in row 2, centered on Y axis) */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pt-1">
            <div className="flex flex-col gap-2">
              {/* Row 1: 5 Category Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {CATEGORY_TABS.slice(0, 5).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => handleCategoryChange(tab.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                      activeCategory === tab.key
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        activeCategory === tab.key
                          ? 'bg-blue-700 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Row 2: 4 Category Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {CATEGORY_TABS.slice(5, 9).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => handleCategoryChange(tab.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                      activeCategory === tab.key
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        activeCategory === tab.key
                          ? 'bg-blue-700 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative min-w-60 shrink-0">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filtruj rejestry..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Data Sources Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Kategoria</th>
                <th className="py-3 px-4">Zbiór Danych</th>
                <th className="py-3 px-4">Parametry i Rola w Potoku</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Portal Źródłowy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedSources.map((source) => (
                <tr key={source.id} className="hover:bg-blue-50/20 transition">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.8 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      {source.categoryLabel}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {source.officialDatasetName}
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-md">
                    {source.metrics}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      {source.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <a
                      href={source.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      <span>{source.portalUrl.replace('https://', '')}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
              {filteredSources.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Nie znaleziono rejestrów pasujących do wyszukiwania.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls (Max 10 records per page) */}
        {filteredSources.length > 0 && (
          <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              Wyświetlanie <strong className="font-semibold text-slate-800">{filteredSources.length > 0 ? startIndex + 1 : 0}–{endIndex}</strong> z <strong className="font-semibold text-slate-800">{filteredSources.length}</strong> zbiorów danych
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={validCurrentPage === 1}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Poprzednia</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center ${
                      validCurrentPage === pageNum
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={validCurrentPage === totalPages}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex items-center gap-1"
                >
                  <span>Następna</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
