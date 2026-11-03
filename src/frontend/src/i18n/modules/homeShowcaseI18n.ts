import type { Language } from '../types';
import type { AppTabId } from '../../components/layout/MainNavbar';
import { ALL_DATA_SOURCES } from '../../data/methodologyDataSources';

const DATASETS_COUNT = ALL_DATA_SOURCES.length;

export interface ShowcaseStoryChapter {
  id: string;
  chapterNumber: string;
  scrollRange: [number, number];
  align: 'left' | 'right';
  badge: string;
  title: string;
  highlightStat: string;
  highlightLabel: string;
  description: string;
  bullets: string[];
  targetTab?: AppTabId;
  ctaLabel?: string;
}

export interface ShowcaseModePortalCard {
  tabId: AppTabId;
  code: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  metricsLabel: string;
  ctaLabel: string;
  accentGradient: string;
}

export interface HomeShowcaseTranslations {
  navHomeLabel: string;
  hero: {
    competitionBadge: string;
    welcomeWord: string;
    brandTitleLead: string;
    brandTitleAccent: string;
    subtitleHeadlineLine1: string;
    subtitleHeadlineLine2: string;
    subtitleBody: string;
    mottoBadge: string;
    maskHintBadge: string;
    maskHintSub: string;
    xrayHudTitle: string;
    xrayPoints: {
      gis: string;
      qol: string;
      iso: string;
      forecast: string;
    };
    ctaStartScroll: string;
    ctaJumpToMap: string;
    scrollDownPrompt: string;
    introUnlockLabel: string;
  };
  scrubSection: {
    hudZoneBadge: string;
    hudProgressLabel: string;
    hudFrameLabel: string;
    skipToFinaleLabel: string;
    chapters: ShowcaseStoryChapter[];
  };
  promoSpot: {
    sectionBadge: string;
    titleLead: string;
    titleAccent: string;
    description: string;
    cursorUnmuteLabel: string;
    cursorMuteLabel: string;
    audioActiveBadge: string;
    audioMutedBadge: string;
    restartVideoLabel: string;
  };
  visualStory: {
    sectionBadge: string;
    titleLead: string;
    titleAccent: string;
    description: string;
    card1Badge: string;
    card1Title: string;
    card1Desc: string;
    card1Stat: string;
    card2Badge: string;
    card2Title: string;
    card2Desc: string;
    card2Stat: string;
  };
  portals: {
    sectionBadge: string;
    titleLead: string;
    titleAccent: string;
    description: string;
    cards: ShowcaseModePortalCard[];
  };
  teamBanner: {
    badge: string;
    author1Name: string;
    author1Univ: string;
    author2Name: string;
    author2Univ: string;
    subtitle: string;
    surveyPill: string;
    datasetsPill: string;
    districtsPill: string;
  };
}

const PL_HOME_SHOWCASE: HomeShowcaseTranslations = {
  navHomeLabel: 'Start',
  hero: {
    competitionBadge: 'KONKURS MIASTA KRAKOWA • OPEN DATA APP',
    welcomeWord: 'Witaj w ekosystemie',
    brandTitleLead: 'Kraków',
    brandTitleAccent: '360',
    subtitleHeadlineLine1: 'Zintegrowana Platforma Analityczno-Mapowa',
    subtitleHeadlineLine2: 'typu Smart City',
    subtitleBody: `Przekształcamy ${DATASETS_COUNT} oficjalnych miejskich zbiorów danych w czytelne narzędzia codziennego wsparcia mieszkańców, rodziców, urzędników i turystów.`,
    mottoBadge: 'ORDO AD CHAOS • ZESPÓŁ PERCEPCJA360',
    maskHintBadge: 'SOCZEWKA ANALITYCZNA X-RAY AKTYWNA',
    maskHintSub:
      'Poruszaj kursorem po panoramie, aby prześwietlić siatkę GIS i architekturę danych pod obrazem miasta',
    xrayHudTitle: 'WARSTWA TELEMETRII GIS • KRAKÓW 360°',
    xrayPoints: {
      gis: '18 DZIELNIC • WEKTORY GRANIC I TOPOLOGIA',
      qol: '8 FILARÓW JAKOŚCI ŻYCIA • NORMALIZACJA 0–100 PKT',
      iso: 'IZOCHRONY 15-MINUTOWE • AUDYT DOSTĘPNOŚCI 5★',
      forecast: 'MODELE PREDYKCYJNE 2028 • SYMULATOR CO-JEŚLI',
    },
    ctaStartScroll: 'Rozpocznij przelot',
    ctaJumpToMap: 'Przejdź od razu do Mapy Dzielnic',
    scrollDownPrompt: 'Przewijaj w dół — kontrolujesz lot kamery',
    introUnlockLabel: 'Inicjalizacja sceny Kraków360...',
  },
  scrubSection: {
    hudZoneBadge: 'Strefa przelotu',
    hudProgressLabel: 'POSTĘP TRASY',
    hudFrameLabel: 'KLATKA LOTU',
    skipToFinaleLabel: 'Pomiń przelot do sekcji finałowej',
    chapters: [
      {
        id: 'genesis',
        chapterNumber: '01 / 06',
        scrollRange: [0.02, 0.16],
        align: 'left',
        badge: 'GENEZA PROJEKTU • BADANIE 243 MIESZKAŃCÓW',
        title: 'Porządek z informacyjnego chaosu',
        highlightStat: '81,1%',
        highlightLabel:
          'ankietowanych mieszkańców Krakowa wskazało potrzebę obiektywnej porównywarki dzielnic',
        description:
          'W naszym badaniu ankietowym (n = 243) aż 77,4% mieszkańców uznało urzędowe raporty za zbyt trudne w odbiorze, a 36,6% wskazało na rozproszenie źródeł. Kraków360 łączy je w jeden przejrzysty interfejs.',
        bullets: [
          `${DATASETS_COUNT} zweryfikowanych zbiorów danych (Urząd Miasta Krakowa, GUS, GIOŚ, MPK, ZTP, MSWiA)`,
          'Dwuwarstwowy algorytm normalizacji Min-Max odporny na wartości skrajne',
          'Maksyma zespołu Percepcja360: Ordo ad chaos (Porządek z chaosu)',
        ],
        targetTab: 'methodology',
        ctaLabel: `Zobacz Metodologię i ${DATASETS_COUNT} Źródeł`,
      },
      {
        id: 'resident',
        chapterNumber: '02 / 06',
        scrollRange: [0.18, 0.32],
        align: 'right',
        badge: 'TRYB MIESZKAŃCA • 8 FILARÓW MIEJSKICH',
        title: 'Spersonalizowany Indeks Jakości Życia',
        highlightStat: '18 dzielnic',
        highlightLabel:
          'przeliczanych w czasie rzeczywistym (0 ms) według Twoich indywidualnych priorytetów',
        description:
          'Każdy mieszkaniec szuka czegoś innego. Dostosuj wagi 8 filarów (Mobilność, Edukacja, Zieleń, Kultura, Środowisko, Bezpieczeństwo, Mieszkalnictwo, Demografia) lub wybierz gotowy profil.',
        bullets: [
          'Interaktywna mapa choropletyczna z wektorami wszystkich 18 dzielnic',
          'Bezpośredni pojedynek dzielnic 1-na-1 z wykresem radarowym i werdyktem eksperckim',
          'Pasek warunków atmosferycznych i jakości powietrza (PM10, PM2.5, CAQI) na żywo',
        ],
        targetTab: 'resident',
        ctaLabel: 'Otwórz Tryb Mieszkańca',
      },
      {
        id: 'accessibility',
        chapterNumber: '03 / 06',
        scrollRange: [0.34, 0.48],
        align: 'left',
        badge: 'KRAKÓW BEZ BARIER • WŁĄCZENIE SPOŁECZNE',
        title: 'Audyt Dostępności 5-Gwiazdkowej',
        highlightStat: '5 wymiarów',
        highlightLabel:
          'dostępności architektonicznej, sensorycznej i komunikacyjnej dla osób ze szczególnymi potrzebami',
        description:
          'Miasto przyjazne to miasto dostępne dla każdego – seniorów, osób z niepełnosprawnościami ruchowymi oraz osób neuroróżnorodnych.',
        bullets: [
          'Ocena architektury budynków, jakości chodników oraz przystanków niskopodłogowych MPK',
          'Mapa „Cichych Godzin” i stref wyciszenia sensorycznego w instytucjach i handlu',
          'Wskaźnik zagęszczenia ławek spoczynkowych i obniżonych krawężników',
        ],
        targetTab: 'resident',
        ctaLabel: 'Sprawdź Kraków bez Barier',
      },
      {
        id: 'parent',
        chapterNumber: '04 / 06',
        scrollRange: [0.50, 0.64],
        align: 'right',
        badge: 'TRYB RODZICA • MIASTO 15-MINUTOWE',
        title: 'Kompas Edukacyjno-Opiekuńczy',
        highlightStat: '500m / 1km',
        highlightLabel:
          'izochrony spacerowe wokół każdego żłobka, przedszkola i szkoły podstawowej',
        description:
          'Ponad 60% badanych rodziców zadeklarowało potrzebę mapy łączącej placówki edukacyjne z terenami zielonymi i placami zabaw w zasięgu krótkiego spaceru.',
        bullets: [
          'Interaktywne pierścienie pieszego dojścia (6 i 12 minut spaceru z wózkiem)',
          'Prognoza obłożenia żłobków i klubów dziecięcych (wiek 0–3 i 4–6 lat) do 2028 roku',
          'Analiza liczby dzieci przypadających na 1 miejsce opiekuńcze w każdej dzielnicy',
        ],
        targetTab: 'parent',
        ctaLabel: 'Otwórz Tryb Rodzica',
      },
      {
        id: 'investor',
        chapterNumber: '05 / 06',
        scrollRange: [0.66, 0.80],
        align: 'left',
        badge: 'URZĘDNIK I INWESTOR • HORYZONT 2028',
        title: 'Predykcje Rozwoju i Symulator „Co jeśli?”',
        highlightStat: '2026–2028',
        highlightLabel:
          'modele ekonometryczne (CAGR, ETS, regresja) oraz symulacja zwrotu społecznego z inwestycji',
        description:
          'Wspieramy podejmowanie decyzji opartych na dowodach (Evidence-Based Policy). Sprawdź, jak budowa nowego parku, żłobka lub przystanku zmieni pozycję dzielnicy w rankingu.',
        bullets: [
          'Symulator „Co jeśli?” przeliczający wpływ nowych inwestycji na Indeks Jakości Życia',
          'Prognozy demograficzne, trendy cen mieszkań oraz dynamika nowej zabudowy',
          'Automatyczna identyfikacja deficytów infrastrukturalnych w 18 dzielnicach',
        ],
        targetTab: 'investor',
        ctaLabel: 'Uruchom Symulator i Prognozy',
      },
      {
        id: 'tourist',
        chapterNumber: '06 / 06',
        scrollRange: [0.82, 0.96],
        align: 'right',
        badge: 'ODKRYWAJ KRAKÓW & ASYSTENT AI WAWELEK',
        title: 'Zrównoważona Turystyka i Sztuczna Inteligencja',
        highlightStat: 'Wawelek AI',
        highlightLabel:
          'niebieski smok wawelski połączony z DeepSeek AI, bazą 18 dzielnic i pogodą na żywo',
        description:
          'Odciążamy zatłoczone Stare Miasto, promując zielone enklawy, kopce widokowe i zabytki poza utartym szlakiem, a w pozostałych modułach wspiera Cię asystent Wawelek!',
        bullets: [
          'Indeks Spokoju Dzielnicy i rekomendacje „Zamiast tłumów – wybierz spokój”',
          'Gotowe tematyczne trasy spacerowe i rowerowe z profilami dostępności',
          'Kontekstowy czat z Wawelkiem AI pamiętający rozmowę między zakładkami',
        ],
        targetTab: 'tourist',
        ctaLabel: 'Odkrywaj Kraków bez Tłumów',
      },
    ],
  },
  promoSpot: {
    sectionBadge: 'SPOT PROMOCYJNY • KRAKÓW360 W AKCJI',
    titleLead: 'Zobacz wizję',
    titleAccent: 'Smart City Kraków360',
    description:
      'Najedź kursorem na ekran projekcyjny i kliknij w dowolnym miejscu wideo, aby przełączyć ścieżkę dźwiękową spotu.',
    cursorUnmuteLabel: 'Kliknij, aby włączyć dźwięk',
    cursorMuteLabel: 'Kliknij, aby wyciszyć',
    audioActiveBadge: 'DŹWIĘK AKTYWNY',
    audioMutedBadge: 'TRYB WYCISZONY (NAJEDŹ I KLIKNIJ)',
    restartVideoLabel: 'Odtwórz od początku',
  },
  visualStory: {
    sectionBadge: 'OD PRZEPROWADZKI DO ŚWIADOMEGO WYBORU',
    titleLead: 'Twój przewodnik po',
    titleAccent: 'każdym etapie życia w Krakowie',
    description:
      'Niezależnie od tego, czy dopiero rozpakowujesz kartony po przeprowadzce nad Wisłę, szukasz bezpiecznego przedszkola dla dziecka, czy planujesz inwestycję – Kraków360 i smok Wawelek prowadzą Cię za rękę.',
    card1Badge: 'NOWY DOM POD WAWELEM',
    card1Title: 'Gdzie zamieszkać w Krakowie? Decyzja oparta na faktach',
    card1Desc:
      'Zamiast godzinami przeszukiwać dziesiątki portali i biuletynów, porównujesz dwie dzielnice obok siebie w 3 sekundy: ceny mieszkań, bezpieczeństwo, hałas, powietrze i dostęp do tramwaju.',
    card1Stat: '81,1% mieszkańców oczekiwało tego narzędzia',
    card2Badge: 'MIASTO PRZYJAZNE RODZINIE',
    card2Title: 'Zieleń, edukacja i bezpieczeństwo w zasięgu 15 minut',
    card2Desc:
      'Wawelek pomaga rodzinom odnaleźć idealny balans między bliskością parków, dostępnością miejsc w żłobkach i czystym powietrzem dla najmłodszych.',
    card2Stat: '150+ analizowanych wskaźników miejskich',
  },
  portals: {
    sectionBadge: 'INTERAKTYWNE PORTALE MODUŁÓW • WYBIERZ SWOJĄ ROLĘ',
    titleLead: 'Wejdź do wybranego',
    titleAccent: 'modułu analitycznego',
    description:
      'Najedź na kartę i wybierz perspektywę dopasowaną do Twoich potrzeb!',
    cards: [
      {
        tabId: 'resident',
        code: 'MODUŁ 01',
        badge: 'DLA MIESZKAŃCÓW I PRZEPROWADZAJĄCYCH SIĘ',
        title: 'Tryb Mieszkańca & Kraków bez Barier',
        subtitle: 'Indeks Jakości Życia • Mapa 18 Dzielnic • Audyt Dostępności 5★',
        description:
          'Dostosuj wagi 8 filarów miejskich, porównaj dzielnice 1-na-1 na wykresie radarowym i sprawdź dostępność architektoniczną oraz Ciche Godziny.',
        metricsLabel: '18 Dzielnic • 8 Filarów • Ranking 0–100 pkt',
        ctaLabel: 'Uruchom Tryb Mieszkańca',
        accentGradient: 'from-blue-600 via-indigo-600 to-sky-500',
      },
      {
        tabId: 'parent',
        code: 'MODUŁ 02',
        badge: 'DLA RODZICÓW I OPIEKUNÓW',
        title: 'Tryb Rodzica (Miasto 15-Minutowe)',
        subtitle: 'Izochrony 500m/1000m • Żłobki, Przedszkola i Szkoły • Prognoza 2028',
        description:
          'Sprawdź zasięg pieszego spaceru do placówek opiekuńczych, parków i placów zabaw oraz poznaj prognozy demograficzne dla dzieci w wieku 0–6 lat.',
        metricsLabel: 'Izochrony 6 i 12 min • Baza Placówek Oświatowych',
        ctaLabel: 'Uruchom Tryb Rodzica',
        accentGradient: 'from-emerald-600 via-teal-600 to-cyan-500',
      },
      {
        tabId: 'investor',
        code: 'MODUŁ 03',
        badge: 'DLA URZĘDNIKÓW, RADNYCH I INWESTORÓW',
        title: 'Tryb Urzędnika i Inwestora',
        subtitle: 'Prognozy Ekonometryczne 2028 • Symulator Budżetowy „Co jeśli?”',
        description:
          'Symuluj budowę nowych parków, żłobków, ścieżek rowerowych i przystanków MPK, obserwując natychmiastowy skok dzielnicy w rankingu miejskim.',
        metricsLabel: 'Horyzont 2026–2028 • Symulator Inwestycji ROI',
        ctaLabel: 'Uruchom Tryb Inwestora',
        accentGradient: 'from-violet-600 via-purple-600 to-indigo-500',
      },
      {
        tabId: 'tourist',
        code: 'MODUŁ 04',
        badge: 'DLA TURYSTÓW I ODKRYWCÓW KRAKOWA',
        title: 'Odkrywaj Kraków (Smart Tourism)',
        subtitle: 'Indeks Spokoju • Alternatywy dla Tłumów • Trasy Tematyczne',
        description:
          'Odkryj mniej znane perły Krakowa, porównaj poziom zatłoczenia atrakcji, przejrzyj Paszporty Turystyczne dzielnic i wybierz gotowy szlak spacerowy.',
        metricsLabel: '40+ Atrakcji • 6 Tras • Indeks Spokoju Dzielnic',
        ctaLabel: 'Otwórz Odkrywaj Kraków',
        accentGradient: 'from-amber-500 via-orange-500 to-rose-500',
      },
      {
        tabId: 'methodology',
        code: 'MODUŁ 05',
        badge: 'TRANSPARENTNOŚĆ NAUKOWA I OPEN DATA',
        title: `Metodologia i ${DATASETS_COUNT} Zbiorów Danych`,
        subtitle: 'Wzory Matematyczne Min-Max • Pełny Rejestr Źródeł 1:1',
        description:
          'Poznaj dwustopniowy model normalizacji danych z przycinaniem wartości skrajnych (5.–95. percentyl) oraz przeszukaj kompletny katalog oficjalnych źródeł.',
        metricsLabel: `${DATASETS_COUNT} Zbiorów Danych • 10 Kategorii • Weryfikowalność 1:1`,
        ctaLabel: 'Przejdź do Metodologii',
        accentGradient: 'from-slate-800 via-blue-900 to-slate-900',
      },
    ],
  },
  teamBanner: {
    badge: 'ZESPÓŁ PERCEPCJA360 • KONKURS „OPEN DATA APP”',
    author1Name: 'Kacper Gumulak',
    author1Univ: 'Politechnika Krakowska',
    author2Name: 'Filip Gorczyca',
    author2Univ: 'Uniwersytet Ekonomiczny w Krakowie',
    subtitle:
      'Połączenie inżynierii systemowej z zaawansowaną analityką gospodarczą i modelowaniem ekonometrycznym.',
    surveyPill: '243 Ankietowanych Mieszkańców',
    datasetsPill: `${DATASETS_COUNT} Oficjalnych Zbiorów Danych`,
    districtsPill: '18 Dzielnic Krakowa',
  },
};

const EN_HOME_SHOWCASE: HomeShowcaseTranslations = {
  navHomeLabel: 'Home',
  hero: {
    competitionBadge: 'CITY OF KRAKOW COMPETITION • OPEN DATA APP',
    welcomeWord: 'Welcome to the ecosystem of',
    brandTitleLead: 'Kraków',
    brandTitleAccent: '360',
    subtitleHeadlineLine1: 'Integrated Analytics & Spatial Intelligence Platform',
    subtitleHeadlineLine2: 'of the Smart City Type',
    subtitleBody: `Transforming ${DATASETS_COUNT} official municipal open datasets into clear, everyday decision-support tools for residents, parents, city officials, and visitors.`,
    mottoBadge: 'ORDO AD CHAOS • PERCEPCJA360 TEAM',
    maskHintBadge: 'X-RAY ANALYTICAL LENS ACTIVE',
    maskHintSub:
      'Move your cursor across the panorama to reveal the underlying GIS grid and spatial data architecture',
    xrayHudTitle: 'GIS TELEMETRY LAYER • KRAKOW 360°',
    xrayPoints: {
      gis: '18 DISTRICTS • VECTOR BOUNDARIES & TOPOLOGY',
      qol: '8 QUALITY OF LIFE PILLARS • 0–100 NORMALIZATION',
      iso: '15-MINUTE ISOCHRONES • 5★ ACCESSIBILITY AUDIT',
      forecast: '2028 PREDICTIVE MODELS • WHAT-IF SIMULATOR',
    },
    ctaStartScroll: 'Start Flight',
    ctaJumpToMap: 'Jump Straight to District Map',
    scrollDownPrompt: 'Scroll down — you control the camera flight',
    introUnlockLabel: 'Initializing Kraków360 scene...',
  },
  scrubSection: {
    hudZoneBadge: 'Flight zone',
    hudProgressLabel: 'FLIGHT PROGRESS',
    hudFrameLabel: 'FLIGHT FRAME',
    skipToFinaleLabel: 'Skip flight to finale section',
    chapters: [
      {
        id: 'genesis',
        chapterNumber: '01 / 06',
        scrollRange: [0.02, 0.16],
        align: 'left',
        badge: 'PROJECT GENESIS • SURVEY OF 243 RESIDENTS',
        title: 'Order out of informational chaos',
        highlightStat: '81.1%',
        highlightLabel:
          'of surveyed Krakow residents demanded an objective district comparison tool',
        description:
          'In our survey of 243 residents, 77.4% found municipal reports too complex to interpret, and 36.6% pointed to scattered data sources. Kraków360 unifies them into one intuitive platform.',
        bullets: [
          `${DATASETS_COUNT} verified datasets (Krakow City Hall, GUS, GIOŚ, MPK, ZTP, Ministry of Interior)`,
          'Two-stage Min-Max normalization algorithm resilient to extreme outliers',
          'Percepcja360 Team motto: Ordo ad chaos (Order out of chaos)',
        ],
        targetTab: 'methodology',
        ctaLabel: `Explore Methodology & ${DATASETS_COUNT} Sources`,
      },
      {
        id: 'resident',
        chapterNumber: '02 / 06',
        scrollRange: [0.18, 0.32],
        align: 'right',
        badge: 'RESIDENT MODE • 8 URBAN PILLARS',
        title: 'Personalized Quality of Life Index',
        highlightStat: '18 districts',
        highlightLabel:
          'recalculated in real time (0 ms) according to your personal priorities',
        description:
          'Every resident values different urban traits. Adjust the weights of 8 pillars (Mobility, Education, Greenery, Culture, Environment, Safety, Housing, Demographics) or pick a persona preset.',
        bullets: [
          'Interactive choropleth map with vector boundaries of all 18 districts',
          'Head-to-head 1-on-1 district comparison with radar chart and expert verdict',
          'Live atmospheric conditions and air quality ribbon (PM10, PM2.5, CAQI)',
        ],
        targetTab: 'resident',
        ctaLabel: 'Open Resident Mode',
      },
      {
        id: 'accessibility',
        chapterNumber: '03 / 06',
        scrollRange: [0.34, 0.48],
        align: 'left',
        badge: 'BARRIER-FREE KRAKOW • SOCIAL INCLUSION',
        title: '5-Star Accessibility Audit',
        highlightStat: '5 dimensions',
        highlightLabel:
          'of architectural, sensory, and transit accessibility for citizens with special needs',
        description:
          'A truly smart city is accessible to everyone—seniors, people with mobility impairments, parents with strollers, and neurodivergent citizens.',
        bullets: [
          'Evaluation of public building accessibility, sidewalk quality, and low-floor MPK stops',
          'Map of sensory "Quiet Hours" across public institutions and retail venues',
          'Rest bench density and lowered curb indicators across all districts',
        ],
        targetTab: 'resident',
        ctaLabel: 'Explore Barrier-Free Krakow',
      },
      {
        id: 'parent',
        chapterNumber: '04 / 06',
        scrollRange: [0.50, 0.64],
        align: 'right',
        badge: 'PARENT MODE • 15-MINUTE CITY',
        title: 'Childcare & Education Compass',
        highlightStat: '500m / 1km',
        highlightLabel:
          'walking isochrones around every nursery, kindergarten, and primary school',
        description:
          'Over 60% of surveyed parents requested a map combining educational facilities with green spaces and playgrounds within a short walking radius.',
        bullets: [
          'Interactive walking radius rings (6-minute and 12-minute stroller walk)',
          'Nursery and kids club capacity forecasts (ages 0–3 and 4–6) through 2028',
          'Children-per-care-place ratio analysis across all 18 districts',
        ],
        targetTab: 'parent',
        ctaLabel: 'Open Parent Mode',
      },
      {
        id: 'investor',
        chapterNumber: '05 / 06',
        scrollRange: [0.66, 0.80],
        align: 'left',
        badge: 'OFFICIAL & INVESTOR • 2028 HORIZON',
        title: 'Development Forecasts & "What-If" Simulator',
        highlightStat: '2026–2028',
        highlightLabel:
          'econometric projections (CAGR, ETS, regression) and social ROI simulation',
        description:
          'Empowering evidence-based urban policy. Simulate how adding a new park, nursery, or transit stop shifts a district’s position in the citywide ranking.',
        bullets: [
          'Interactive "What-If" Simulator computing real-time Quality of Life Index gains',
          'Demographic projections, housing price dynamics, and new construction trends',
          'Automated identification of infrastructure deficits across all 18 districts',
        ],
        targetTab: 'investor',
        ctaLabel: 'Launch Simulator & Forecasts',
      },
      {
        id: 'tourist',
        chapterNumber: '06 / 06',
        scrollRange: [0.82, 0.96],
        align: 'right',
        badge: 'DISCOVER KRAKOW & WAWELEK AI ASSISTANT',
        title: 'Sustainable Tourism & Artificial Intelligence',
        highlightStat: 'Wawelek AI',
        highlightLabel:
          'the blue Wawel dragon powered by DeepSeek AI, 18-district data, and live weather',
        description:
          'Relieving Old Town overtourism by highlighting peaceful green enclaves, panoramic mounds, and hidden heritage—guided across modules by our AI mascot Wawelek!',
        bullets: [
          'District Calmness Index and "Skip the Crowds" smart alternatives',
          'Curated thematic walking and cycling itineraries with accessibility profiles',
          'Context-aware Wawelek AI chat that remembers your conversation across tabs',
        ],
        targetTab: 'tourist',
        ctaLabel: 'Discover Crowd-Free Krakow',
      },
    ],
  },
  promoSpot: {
    sectionBadge: 'PROMOTIONAL SPOT • KRAKÓW360 IN ACTION',
    titleLead: 'Watch the vision of',
    titleAccent: 'Smart City Kraków360',
    description:
      'Hover over the screening canvas and click anywhere on the video tile to toggle the promotional audio track.',
    cursorUnmuteLabel: 'Click to unmute audio',
    cursorMuteLabel: 'Click to mute audio',
    audioActiveBadge: 'AUDIO ACTIVE',
    audioMutedBadge: 'MUTED MODE (HOVER & CLICK)',
    restartVideoLabel: 'Replay from start',
  },
  visualStory: {
    sectionBadge: 'FROM MOVING BOXES TO INFORMED CHOICES',
    titleLead: 'Your companion at',
    titleAccent: 'every stage of life in Krakow',
    description:
      'Whether you are unpacking your first moving boxes by the Vistula River, searching for a safe kindergarten, or planning a municipal investment—Kraków360 and Wawelek guide the way.',
    card1Badge: 'A NEW HOME UNDER WAWEL',
    card1Title: 'Where to live in Krakow? Decisions backed by data',
    card1Desc:
      'Instead of spending hours browsing scattered portals, compare two districts side-by-side in 3 seconds: housing prices, safety, air quality, and tram access.',
    card1Stat: '81.1% of surveyed citizens requested this tool',
    card2Badge: 'FAMILY-FRIENDLY URBAN LIVING',
    card2Title: 'Greenery, education, and safety within a 15-minute walk',
    card2Desc:
      'Wawelek helps families find the ideal balance between park proximity, nursery availability, and clean air for children.',
    card2Stat: '150+ analyzed municipal indicators',
  },
  portals: {
    sectionBadge: 'INTERACTIVE MODULE PORTALS • CHOOSE YOUR PERSPECTIVE',
    titleLead: 'Enter your selected',
    titleAccent: 'analytical module',
    description:
      'Hover over a card and choose the perspective tailored to your needs!',
    cards: [
      {
        tabId: 'resident',
        code: 'MODULE 01',
        badge: 'FOR RESIDENTS & NEWCOMERS',
        title: 'Resident Mode & Barrier-Free Krakow',
        subtitle: 'Quality of Life Index • 18-District Map • 5★ Accessibility Audit',
        description:
          'Customize the weights of 8 urban pillars, compare districts 1-on-1 on a radar chart, and inspect architectural accessibility and Quiet Hours.',
        metricsLabel: '18 Districts • 8 Pillars • 0–100 Score',
        ctaLabel: 'Launch Resident Mode',
        accentGradient: 'from-blue-600 via-indigo-600 to-sky-500',
      },
      {
        tabId: 'parent',
        code: 'MODULE 02',
        badge: 'FOR PARENTS & CAREGIVERS',
        title: 'Parent Mode (15-Minute City)',
        subtitle: '500m/1000m Isochrones • Nurseries, Kindergartens & Schools • 2028 Forecast',
        description:
          'Check walking radius coverage to childcare facilities, parks, and playgrounds, and explore demographic forecasts for ages 0–6.',
        metricsLabel: '6 & 12 Min Isochrones • Educational Registry',
        ctaLabel: 'Launch Parent Mode',
        accentGradient: 'from-emerald-600 via-teal-600 to-cyan-500',
      },
      {
        tabId: 'investor',
        code: 'MODULE 03',
        badge: 'FOR OFFICIALS, PLANNERS & INVESTORS',
        title: 'Official & Investor Mode',
        subtitle: '2028 Econometric Forecasts • "What-If?" Budget Simulator',
        description:
          'Simulate building new parks, nurseries, bike lanes, and MPK transit stops while watching instant district ranking gains.',
        metricsLabel: '2026–2028 Horizon • Social ROI Simulator',
        ctaLabel: 'Launch Investor Mode',
        accentGradient: 'from-violet-600 via-purple-600 to-indigo-500',
      },
      {
        tabId: 'tourist',
        code: 'MODULE 04',
        badge: 'FOR VISITORS & URBAN EXPLORERS',
        title: 'Discover Krakow (Smart Tourism)',
        subtitle: 'Calmness Index • Overtourism Alternatives • Thematic Routes',
        description:
          'Uncover hidden gems of Krakow, compare attraction crowd levels, browse District Tourist Passports, and follow curated walking trails.',
        metricsLabel: '40+ Attractions • 6 Trails • Calmness Index',
        ctaLabel: 'Open Discover Krakow',
        accentGradient: 'from-amber-500 via-orange-500 to-rose-500',
      },
      {
        tabId: 'methodology',
        code: 'MODULE 05',
        badge: 'SCIENTIFIC TRANSPARENCY & OPEN DATA',
        title: `Methodology & ${DATASETS_COUNT} Open Datasets`,
        subtitle: 'Min-Max Mathematical Formulas • Complete 1:1 Source Registry',
        description:
          'Explore our two-stage data normalization model with outlier winsorization (5th–95th percentile) and search the complete catalog of official sources.',
        metricsLabel: `${DATASETS_COUNT} Datasets • 10 Categories • Full Verifiability`,
        ctaLabel: 'Explore Methodology',
        accentGradient: 'from-slate-800 via-blue-900 to-slate-900',
      },
    ],
  },
  teamBanner: {
    badge: 'PERCEPCJA360 TEAM • "OPEN DATA APP" COMPETITION',
    author1Name: 'Kacper Gumulak',
    author1Univ: 'Cracow University of Technology',
    author2Name: 'Filip Gorczyca',
    author2Univ: 'Krakow University of Economics',
    subtitle:
      'Combining systems engineering with advanced economic analytics and econometric modeling.',
    surveyPill: '243 Surveyed Residents',
    datasetsPill: `${DATASETS_COUNT} Official Open Datasets`,
    districtsPill: '18 Districts of Krakow',
  },
};

const UA_HOME_SHOWCASE: HomeShowcaseTranslations = {
  navHomeLabel: 'Головна',
  hero: {
    competitionBadge: 'КОНКУРС МІСТА КРАКОВА • OPEN DATA APP',
    welcomeWord: 'Ласкаво просимо до екосистеми',
    brandTitleLead: 'Kraków',
    brandTitleAccent: '360',
    subtitleHeadlineLine1: 'Інтегрована аналітично-картографічна платформа',
    subtitleHeadlineLine2: 'типу Smart City',
    subtitleBody: `Перетворюємо ${DATASETS_COUNT} офіційних міських наборів відкритих даних на зрозумілі щоденні інструменти для мешканців, батьків, посадовців та туристів.`,
    mottoBadge: 'ORDO AD CHAOS • КОМАНДА PERCEPCJA360',
    maskHintBadge: 'АНАЛІТИЧНА ЛІНЗА X-RAY АКТИВНА',
    maskHintSub:
      'Рухайте курсором по панорамі, щоб побачити сітку ГІС та архітектуру даних під зображенням міста',
    xrayHudTitle: 'ШАР ТЕЛЕМЕТРІЇ ГІС • КРАКІВ 360°',
    xrayPoints: {
      gis: '18 РАЙОНІВ • ВЕКТОРНІ МЕЖІ ТА ТОПОЛОГІЯ',
      qol: '8 СТОВПІВ ЯКОСТІ ЖИТТЯ • НОРМАЛІЗАЦІЯ 0–100 БАЛІВ',
      iso: '15-ХВИЛИННІ ІЗОХРОНИ • АУДИТ ДОСТУПНОСТІ 5★',
      forecast: 'ПРОГНОЗНІ МОДЕЛІ 2028 • СИМУЛЯТОР «ЩО ЯКЩО»',
    },
    ctaStartScroll: 'Почати політ',
    ctaJumpToMap: 'Перейти одразу до карти районів',
    scrollDownPrompt: 'Прокручуйте вниз — ви керуєте польотом камери',
    introUnlockLabel: 'Ініціалізація сцени Kraków360...',
  },
  scrubSection: {
    hudZoneBadge: 'Зона польоту',
    hudProgressLabel: 'ПРОГРЕС МАРШРУТУ',
    hudFrameLabel: 'КАДР ПОЛЬОТУ',
    skipToFinaleLabel: 'Пропустити політ до фінальної секції',
    chapters: [
      {
        id: 'genesis',
        chapterNumber: '01 / 06',
        scrollRange: [0.02, 0.16],
        align: 'left',
        badge: 'ГЕНЕЗА ПРОЄКТУ • ОПИТУВАННЯ 243 МЕШКАНЦІВ',
        title: 'Порядок з інформаційного хаосу',
        highlightStat: '81,1%',
        highlightLabel:
          'опитаних мешканців Кракова вказали на потребу в об’єктивному порівнянні районів',
        description:
          'У нашому опитуванні (n = 243) 77,4% мешканців визнали офіційні звіти занадто складними для сприйняття, а 36,6% відзначили розпорошеність джерел. Kraków360 об’єднує їх в один прозорий інтерфейс.',
        bullets: [
          `${DATASETS_COUNT} перевірених наборів даних (Мерія Кракова, GUS, GIOŚ, MPK, ZTP, МВС)`,
          'Двоетапний алгоритм нормалізації Min-Max, стійкий до екстремальних значень',
          'Девіз команди Percepcja360: Ordo ad chaos (Порядок із хаосу)',
        ],
        targetTab: 'methodology',
        ctaLabel: `Переглянути Методологію та ${DATASETS_COUNT} Джерел`,
      },
      {
        id: 'resident',
        chapterNumber: '02 / 06',
        scrollRange: [0.18, 0.32],
        align: 'right',
        badge: 'РЕЖИМ МЕШКАНЦЯ • 8 МІСЬКИХ СТОВПІВ',
        title: 'Персоналізований Індекс Якості Життя',
        highlightStat: '18 районів',
        highlightLabel:
          'перераховуються в реальному часі (0 мс) відповідно до ваших пріоритетів',
        description:
          'Кожен мешканець шукає щось своє. Налаштуйте ваги 8 стовпів (Мобільність, Освіта, Озеленення, Культура, Довкілля, Безпека, Житло, Демографія) або оберіть готовий профіль.',
        bullets: [
          'Інтерактивна хороплетна карта з векторними межами всіх 18 районів',
          'Пряме порівняння районів 1-на-1 з радарною діаграмою та експертним вердиктом',
          'Жива стрічка погодних умов та якості повітря (PM10, PM2.5, CAQI)',
        ],
        targetTab: 'resident',
        ctaLabel: 'Відкрити Режим Мешканця',
      },
      {
        id: 'accessibility',
        chapterNumber: '03 / 06',
        scrollRange: [0.34, 0.48],
        align: 'left',
        badge: 'КРАКІВ БЕЗ БАР’ЄРІВ • СОЦІАЛЬНА ІНКЛЮЗІЯ',
        title: 'Аудит 5-зіркової доступності',
        highlightStat: '5 вимірів',
        highlightLabel:
          'архітектурної, сенсорної та транспортної доступності для людей з особливими потребами',
        description:
          'Дружнє місто — це місто, доступне для кожного: людей старшого віку, осіб з інвалідністю та нейровідмінних мешканців.',
        bullets: [
          'Оцінка доступності будівель, якості тротуарів та низькопідлогових зупинок MPK',
          'Карта «Тихих Годин» та зон сенсорного комфорту в установах і магазинах',
          'Показник щільності лавок для відпочинку та понижених бордюрів',
        ],
        targetTab: 'resident',
        ctaLabel: 'Перевірити Краків без Бар’єрів',
      },
      {
        id: 'parent',
        chapterNumber: '04 / 06',
        scrollRange: [0.50, 0.64],
        align: 'right',
        badge: 'РЕЖИМ БАТЬКІВ • 15-ХВИЛИННЕ МІСТО',
        title: 'Освітньо-опікунський компас',
        highlightStat: '500м / 1км',
        highlightLabel:
          'пішохідні ізохрони навколо кожного ясел, дитсадка та початкової школи',
        description:
          'Понад 60% опитаних батьків заявили про потребу в карті, що поєднує освітні заклади з парками та дитячими майданчиками в межах короткої прогулянки.',
        bullets: [
          'Інтерактивні кільця пішої доступності (6 та 12 хвилин прогулянки з візочком)',
          'Прогноз завантаженості ясел та дитячих клубів (вік 0–3 та 4–6 років) до 2028 року',
          'Аналіз кількості дітей на 1 місце в закладах догляду в кожному районі',
        ],
        targetTab: 'parent',
        ctaLabel: 'Відкрити Режим Батьків',
      },
      {
        id: 'investor',
        chapterNumber: '05 / 06',
        scrollRange: [0.66, 0.80],
        align: 'left',
        badge: 'ПОСАДОВЕЦЬ ТА ІНВЕСТОР • ГОРИЗОНТ 2028',
        title: 'Прогнози розвитку та Симулятор «Що якщо?»',
        highlightStat: '2026–2028',
        highlightLabel:
          'економетричні моделі (CAGR, ETS, регресія) та симуляція соціальної віддачі інвестицій',
        description:
          'Підтримуємо ухвалення рішень на основі даних (Evidence-Based Policy). Перевірте, як будівництво нового парку, ясел чи зупинки змінить позицію району в рейтингу.',
        bullets: [
          'Симулятор «Що якщо?», який миттєво перераховує вплив інвестицій на Індекс Якості Життя',
          'Демографічні прогнози, тренди цін на житло та динаміка нової забудови',
          'Автоматичне виявлення інфраструктурних дефіцитів у 18 районах',
        ],
        targetTab: 'investor',
        ctaLabel: 'Запустити Симулятор і Прогнози',
      },
      {
        id: 'tourist',
        chapterNumber: '06 / 06',
        scrollRange: [0.82, 0.96],
        align: 'right',
        badge: 'ВІДКРИВАЙ КРАКІВ ТА АСИСТЕНТ AI ВАВЕЛЕК',
        title: 'Сталий туризм та Штучний Інтелект',
        highlightStat: 'Wawelek AI',
        highlightLabel:
          'синій вавельський дракончик, підключений до DeepSeek AI, бази 18 районів і живої погоди',
        description:
          'Розвантажуємо переповнений Старий Краків, популяризуючи зелені оази, оглядові кургани та пам’ятки поза шаблонами, а в інших модулях вам допомагає наш Вавелек!',
        bullets: [
          'Індекс Спокою Району та рекомендації «Замість натовпу — обери спокій»',
          'Готові тематичні пішохідні й велосипедні маршрути з профілями доступності',
          'Контекстний чат із Вавелеком AI, що пам’ятає розмову між вкладками',
        ],
        targetTab: 'tourist',
        ctaLabel: 'Відкривай Краків без Натовпу',
      },
    ],
  },
  promoSpot: {
    sectionBadge: 'ПРОМО-РОЛИК • KRAKÓW360 У ДІЇ',
    titleLead: 'Побачте візію',
    titleAccent: 'Smart City Kraków360',
    description:
      'Наведіть курсор на проекційний екран і натисніть у будь-якому місці відео, щоб увімкнути або вимкнути звукову доріжку ролика.',
    cursorUnmuteLabel: 'Натисніть, щоб увімкнути звук',
    cursorMuteLabel: 'Натисніть, щоб вимкнути звук',
    audioActiveBadge: 'ЗВУК АКТИВНИЙ',
    audioMutedBadge: 'БЕЗ ЗВУКУ (НАВЕДІТЬ І НАТИСНІТЬ)',
    restartVideoLabel: 'Відтворити спочатку',
  },
  visualStory: {
    sectionBadge: 'ВІД ПЕРЕЇЗДУ ДО СВІДОМОГО ВИБОРУ',
    titleLead: 'Ваш провідник на',
    titleAccent: 'кожному етапі життя у Кракові',
    description:
      'Незалежно від того, чи ви щойно розпаковуєте коробки після переїзду над Віслу, шукаєте безпечний садочок для дитини чи плануєте міську інвестицію — Kraków360 і дракончик Вавелек ведуть вас за руку.',
    card1Badge: 'НОВИЙ ДІМ ПІД ВАВЕЛЕМ',
    card1Title: 'Де оселитися у Кракові? Рішення на основі фактів',
    card1Desc:
      'Замість годин пошуків на десятках порталів порівняйте два райони поруч за 3 секунди: ціни на житло, безпеку, якість повітря та доступ до трамвая.',
    card1Stat: '81,1% мешканців очікували на цей інструмент',
    card2Badge: 'МІСТО, ДРУЖНЄ ДО РОДИНИ',
    card2Title: 'Озеленення, освіта та безпека в межах 15 хвилин',
    card2Desc:
      'Вавелек допомагає родинам знайти ідеальний баланс між близькістю парків, наявністю місць у яслах та чистим повітрям для найменших.',
    card2Stat: '150+ проаналізованих міських показників',
  },
  portals: {
    sectionBadge: 'ІНТЕРАКТИВНІ ПОРТАЛИ МОДУЛІВ • ОБЕРІТЬ СВОЮ РОЛЬ',
    titleLead: 'Перейдіть до обраного',
    titleAccent: 'аналітичного модуля',
    description:
      'Наведіть курсор на картку та оберіть перспективу відповідно до ваших потреб!',
    cards: [
      {
        tabId: 'resident',
        code: 'МОДУЛЬ 01',
        badge: 'ДЛЯ МЕШКАНЦІВ ТА НОВОСЕЛІВ',
        title: 'Режим Мешканця та Краків без Бар’єрів',
        subtitle: 'Індекс Якості Життя • Карта 18 Районів • Аудит Доступності 5★',
        description:
          'Налаштуйте ваги 8 міських стовпів, порівняйте райони 1-на-1 на радарній діаграмою та перевірте архітектурну доступність і Тихі Години.',
        metricsLabel: '18 Районів • 8 Стовпів • Рейтинг 0–100 балів',
        ctaLabel: 'Запустити Режим Мешканця',
        accentGradient: 'from-blue-600 via-indigo-600 to-sky-500',
      },
      {
        tabId: 'parent',
        code: 'МОДУЛЬ 02',
        badge: 'ДЛЯ БАТЬКІВ ТА ОПІКУНІВ',
        title: 'Режим Батьків (15-хвилинне місто)',
        subtitle: 'Ізохрони 500м/1000м • Ясла, Садки та Школи • Прогноз 2028',
        description:
          'Перевірте радіус пішої прогулянки до закладів догляду, парків і майданчиків та дізнайтеся демографічні прогнози для дітей 0–6 років.',
        metricsLabel: 'Ізохрони 6 і 12 хв • База Освітніх Закладів',
        ctaLabel: 'Запустити Режим Батьків',
        accentGradient: 'from-emerald-600 via-teal-600 to-cyan-500',
      },
      {
        tabId: 'investor',
        code: 'МОДУЛЬ 03',
        badge: 'ДЛЯ ПОСАДОВЦІВ, РАДНИКІВ ТА ІНВЕСТОРІВ',
        title: 'Режим Посадовця та Інвестора',
        subtitle: 'Економетричні Прогнози 2028 • Бюджетний Симулятор «Що якщо?»',
        description:
          'Моделюйте будівництво нових парків, ясел, велодоріжок і зупинок MPK, спостерігаючи за миттєвим зростанням району в міському рейтингу.',
        metricsLabel: 'Горизонт 2026–2028 • Симулятор Інвестицій ROI',
        ctaLabel: 'Запустити Режим Інвестора',
        accentGradient: 'from-violet-600 via-purple-600 to-indigo-500',
      },
      {
        tabId: 'tourist',
        code: 'МОДУЛЬ 04',
        badge: 'ДЛЯ ТУРИСТІВ ТА ДОСЛІДНИКІВ КРАКОВА',
        title: 'Відкривай Краків (Smart Tourism)',
        subtitle: 'Індекс Спокою • Альтернативи Натовпу • Тематичні Маршрути',
        description:
          'Відкрийте менш відомі перлини Кракова, порівняйте рівень завантаженості локацій, перегляньте Туристичні Паспорти районів та оберіть готовий маршрут.',
        metricsLabel: '40+ Локацій • 6 Маршрутів • Індекс Спокою',
        ctaLabel: 'Відкрити Відкривай Краків',
        accentGradient: 'from-amber-500 via-orange-500 to-rose-500',
      },
      {
        tabId: 'methodology',
        code: 'МОДУЛЬ 05',
        badge: 'НАУКОВА ПРОЗОРІСТЬ ТА ВІДКРИТІ ДАНІ',
        title: `Методологія та ${DATASETS_COUNT} Наборів Даних`,
        subtitle: 'Математичні Формули Min-Max • Повний Реєстр Джерел 1:1',
        description:
          'Ознайомтеся з двоетапною моделлю нормалізації даних із відсіканням викидів (5–95 перцентиль) та перегляньте повний каталог офіційних джерел.',
        metricsLabel: `${DATASETS_COUNT} Наборів Даних • 10 Категорій • Повна Верифікованість`,
        ctaLabel: 'Перейти до Методології',
        accentGradient: 'from-slate-800 via-blue-900 to-slate-900',
      },
    ],
  },
  teamBanner: {
    badge: 'КОМАНДА PERCEPCJA360 • КОНКУРС «OPEN DATA APP»',
    author1Name: 'Kacper Gumulak',
    author1Univ: 'Краківська політехніка',
    author2Name: 'Filip Gorczyca',
    author2Univ: 'Економічний університет у Кракові',
    subtitle:
      'Поєднання системної інженерії із сучасною економічною аналітикою та економетричним моделюванням.',
    surveyPill: '243 Опитаних Мешканців',
    datasetsPill: `${DATASETS_COUNT} Офіційних Наборів Даних`,
    districtsPill: '18 Районів Кракова',
  },
};

export function getHomeShowcaseI18n(language: Language): HomeShowcaseTranslations {
  if (language === 'en') return EN_HOME_SHOWCASE;
  if (language === 'ua') return UA_HOME_SHOWCASE;
  return PL_HOME_SHOWCASE;
}
