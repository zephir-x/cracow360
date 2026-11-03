import type { Language } from '../types';
import type { AppTabId } from '../../components/layout/MainNavbar';
import { ALL_DATA_SOURCES } from '../../data/methodologyDataSources';

const DATASETS_COUNT = ALL_DATA_SOURCES.length;

export type ShowcaseCardColorTheme = 'blue' | 'emerald' | 'violet' | 'amber' | 'slate';

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

export interface ShowcaseVisualStoryCard {
  id: string;
  tabId: AppTabId;
  colorTheme: ShowcaseCardColorTheme;
  imageSrc: string;
  badge: string;
  title: string;
  description: string;
}

export interface ShowcaseModePortalCard {
  tabId: AppTabId;
  colorTheme: ShowcaseCardColorTheme;
  code: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  metricsLabel: string;
  ctaLabel: string;
  accentGradient: string;
}

export interface ShowcaseTeamMemberProfile {
  id: 'kacper' | 'filip';
  name: string;
  university: string;
  roleBadge: string;
  avatarSrc: string;
  expandHint: string;
  idleSummaryTitle: string;
  idleSummarySubtitle: string;
  idleHighlights: {
    value: string;
    label: string;
  }[];
  krakowStoryTitle: string;
  krakowStoryBody: string;
  contributionTitle: string;
  contributionBody: string;
  tags: string[];
  linkedInUrl: string;
  linkedInLabel: string;
  portfolioUrl?: string;
  portfolioLabel?: string;
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
    autopilotIdleLabel: string;
    autopilotActiveLabel: string;
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
    cards: ShowcaseVisualStoryCard[];
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
    title: string;
    subtitle: string;
    hoverPrompt: string;
    members: ShowcaseTeamMemberProfile[];
  };
}

const PL_HOME_SHOWCASE: HomeShowcaseTranslations = {
  navHomeLabel: 'Start',
  hero: {
    competitionBadge: 'KONKURS MIASTA KRAKOWA • OPEN DATA APP',
    welcomeWord: 'Witaj w ekosystemie',
    brandTitleLead: 'Kraków',
    brandTitleAccent: '360',
    subtitleHeadlineLine1: 'Zintegrowana Platforma',
    subtitleHeadlineLine2: 'typu Smart City',
    subtitleBody: `Przekształcamy ${DATASETS_COUNT} oficjalnych miejskich zbiorów danych w czytelne narzędzia codziennego wsparcia mieszkańców, rodziców, urzędników i turystów.`,
    mottoBadge: 'ORDO AB CHAO • ZESPÓŁ PERCEPCJA360',
    maskHintSub:
      'Poruszaj kursorem po panoramie Wawelu, aby prześwietlić siatkę GIS i architekturę danych pod obrazem miasta',
    xrayHudTitle: 'WARSTWA TELEMETRII GIS • WAWEL 50.054°N, 19.935°E',
    xrayPoints: {
      gis: '18 DZIELNIC • WEKTORY GRANIC I TOPOLOGIA',
      qol: '8 FILARÓW JAKOŚCI ŻYCIA • NORMALIZACJA 0–100 PKT',
      iso: 'IZOCHRONY 15-MINUTOWE • AUDYT DOSTĘPNOŚCI 5★',
      forecast: 'MODELE PREDYKCYJNE 2028 • SYMULATOR CO-JEŚLI',
    },
    ctaStartScroll: 'Rozpocznij przelot',
    ctaJumpToMap: 'Przejdź od razu do Mapy Dzielnic',
    scrollDownPrompt: 'Przewijaj w dół - kontrolujesz lot kamery',
    introUnlockLabel: 'Inicjalizacja sceny Kraków360...',
  },
  scrubSection: {
    hudZoneBadge: 'Strefa przelotu',
    autopilotIdleLabel: 'Autopilot',
    autopilotActiveLabel: 'Autopilot aktywny',
    hudProgressLabel: 'POSTĘP TRASY',
    hudFrameLabel: 'KLATKA LOTU',
    skipToFinaleLabel: 'Pomiń przelot do sekcji finałowej',
    chapters: [
      {
        id: 'genesis',
        chapterNumber: '01 / 08',
        scrollRange: [0.033, 0.117],
        align: 'left',
        badge: 'GENEZA PROJEKTU • BADANIE 243 MIESZKAŃCÓW',
        title: 'Porządek z informacyjnego chaosu',
        highlightStat: '77,4%',
        highlightLabel:
          'ankietowanych mieszkańców Krakowa wskazało potrzebę obiektywnej porównywarki dzielnic',
        description:
          'W naszym badaniu ankietowym (n = 243) aż 81,1% mieszkańców zgłaszało deficyt klarownych informacji, a 36,6% wskazało na rozproszenie źródeł. Kraków360 łączy je w jeden przejrzysty interfejs.',
        bullets: [
          `${DATASETS_COUNT} zweryfikowanych zbiorów danych (UMK, GUS, GIOŚ, MPK, ZTP, MSWiA)`,
          'Dwuwarstwowy algorytm normalizacji Min-Max odporny na wartości skrajne',
          'Maksyma zespołu Percepcja360: Ordo ab chao (Porządek z chaosu)',
        ],
        targetTab: 'methodology',
        ctaLabel: `Zobacz Metodologię i ${DATASETS_COUNT} Źródeł`,
      },
      {
        id: 'resident',
        chapterNumber: '02 / 08',
        scrollRange: [0.133, 0.203],
        align: 'right',
        badge: 'TRYB MIESZKAŃCA • 8 FILARÓW MIEJSKICH',
        title: 'Spersonalizowany Indeks Jakości Życia',
        highlightStat: '18 dzielnic',
        highlightLabel:
          'przeliczanych w czasie rzeczywistym według Twoich indywidualnych priorytetów',
        description:
          'Każdy mieszkaniec szuka czegoś innego. Dostosuj wagi 8 filarów (Mobilność, Edukacja, Zieleń, Kultura, Środowisko, Bezpieczeństwo, Mieszkalnictwo, Demografia) lub wybierz gotowy profil.',
        bullets: [
          'Interaktywna mapa choropletyczna z wektorami wszystkich 18 dzielnic',
          'Bezpośredni pojedynek dzielnic 1-na-1 z wykresem radarowym i werdyktem eksperckim',
          'Ranking dzielnic aktualizowany natychmiast po każdym ruchu suwaka wag',
        ],
        targetTab: 'resident',
        ctaLabel: 'Otwórz Tryb Mieszkańca',
      },
      {
        id: 'accessibility',
        chapterNumber: '03 / 08',
        scrollRange: [0.217, 0.287],
        align: 'left',
        badge: 'KRAKÓW BEZ BARIER • WŁĄCZENIE SPOŁECZNE',
        title: 'Audyt Dostępności',
        highlightStat: '5 wymiarów',
        highlightLabel:
          'dostępności architektonicznej, sensorycznej i komunikacyjnej dla osób ze szczególnymi potrzebami',
        description:
          'Miasto przyjazne to miasto dostępne dla każdego - seniorów, osób z niepełnosprawnościami ruchowymi, rodziców z wózkami oraz osób neuroróżnorodnych.',
        bullets: [
          'Ocena architektury budynków oraz przystanków niskopodłogowych MPK',
          'Mapa „Cichych Miejsc” i stref wyciszenia sensorycznego w instytucjach i handlu',
          'Wskaźnik zagęszczenia ramp i obniżonych krawężników',
        ],
        targetTab: 'resident',
        ctaLabel: 'Sprawdź Kraków bez Barier',
      },
      {
        id: 'parent',
        chapterNumber: '04 / 08',
        scrollRange: [0.300, 0.420],
        align: 'right',
        badge: 'TRYB RODZICA • MIASTO 15-MINUTOWE',
        title: 'Kompas Edukacyjno-Opiekuńczy',
        highlightStat: '300m - 1km',
        highlightLabel:
          'izochrony spacerowe wokół każdego żłobka, przedszkola i szkoły podstawowej',
        description:
          'Rodzice deklarowali potrzebę mapy łączącej placówki edukacyjne z terenami zielonymi i placami zabaw w zasięgu krótkiego spaceru.',
        bullets: [
          'Interaktywne pierścienie pieszego dojścia (5 do 15 minut spaceru z wózkiem)',
          'Obłożenia żłobków i klubów dziecięcych (wiek 0–3 i 4–6 lat)',
          'Analiza liczby dzieci przypadających na 1 miejsce opiekuńcze w każdej dzielnicy',
        ],
        targetTab: 'parent',
        ctaLabel: 'Otwórz Tryb Rodzica',
      },
      {
        id: 'investor',
        chapterNumber: '05 / 08',
        scrollRange: [0.450, 0.533],
        align: 'left',
        badge: 'URZĘDNIK I INWESTOR • HORYZONT 2028',
        title: 'Predykcje Rozwoju i Symulator',
        highlightStat: '2026–2028',
        highlightLabel:
          'modele ekonometryczne (CAGR, ETS, regresja) oraz symulacja zwrotu społecznego z inwestycji',
        description:
          'Wspieramy podejmowanie decyzji opartych na dowodach (Evidence-Based Policy). Sprawdź, jak budowa nowego parku, żłobka lub przystanku zmieni pozycję dzielnicy w rankingu.',
        bullets: [
          'Symulator przeliczający wpływ nowych inwestycji na Indeks Jakości Życia',
          'Prognozy demograficzne oraz dynamika nowej zabudowy',
          'Automatyczna identyfikacja deficytów infrastrukturalnych w 18 dzielnicach',
        ],
        targetTab: 'investor',
        ctaLabel: 'Uruchom Symulator i Prognozy',
      },
      {
        id: 'tourist',
        chapterNumber: '06 / 08',
        scrollRange: [0.550, 0.647],
        align: 'right',
        badge: 'ODKRYWAJ KRAKÓW • SMART TOURISM',
        title: 'Zrównoważona Turystyka',
        highlightStat: '50+ perełek',
        highlightLabel:
          'atrakcji, zielonych enklaw i punktów widokowych ocenionych pod kątem spokoju i dostępności',
        description:
          'Odciążamy zatłoczone Stare Miasto, promując autentyczne dziedzictwo wszystkich 18 dzielnic, kopce widokowe, rezerwaty przyrody i kameralne trasy spacerowe.',
        bullets: [
          'Inteligentne rekomendacje „Zamiast tłumów - wybierz spokój”',
          'Gotowe tematyczne trasy spacerowe i rowerowe z profilami dostępności',
          'Paszporty Turystyczne wszystkich 18 dzielnic z ukrytymi perełkami architektury',
        ],
        targetTab: 'tourist',
        ctaLabel: 'Odkrywaj Kraków bez Tłumów',
      },
      {
        id: 'atmosphere',
        chapterNumber: '07 / 08',
        scrollRange: [0.650, 0.743],
        align: 'left',
        badge: 'TELEMETRIA ŚRODOWISKOWA • PASEK POGODOWY NA ŻYWO',
        title: 'Puls Atmosferyczny w Każdym Zakątku Krakowa',
        highlightStat: 'PM10 / CAQI',
        highlightLabel:
          'zintegrowany pasek warunków atmosferycznych i jakości powietrza dostępny w każdym module analitycznym',
        description:
          'Aż 73,6% ankietowanych mieszkańców uznało jakość powietrza za kluczową dla codziennych decyzji. W każdym module poza stroną startową masz stały podgląd parametrów środowiskowych.',
        bullets: [
          'Pomiary stężeń pyłów PM10 i PM2.5 oraz europejskiego indeksu CAQI na żywo ze stacji GIOŚ',
          'Bieżące odczyty temperatury, odczuwalnego chłodu, prędkości wiatru, wilgotności i ciśnienia',
          'Możliwość sprawdzenia warunków środowiskowych dla każdego zakątka i dzielnicy Krakowa',
        ],
      },
      {
        id: 'wawelek',
        chapterNumber: '08 / 08',
        scrollRange: [0.767, 0.858],
        align: 'right',
        badge: 'ASYSTENT AI „WAWELEK” • TWÓJ MIEJSKI DORADCA',
        title: 'Sztuczna Inteligencja w Służbie Mieszkańców',
        highlightStat: 'Wawelek AI',
        highlightLabel:
          'niebieski smok wawelski zasilany modelem DeepSeek, bazą 18 dzielnic i telemetrią na żywo',
        description:
          'Wystarczy przejść do dowolnej zakładki analitycznej, a w prawym dolnym rogu ekranu zawsze czeka na Ciebie Wawelek - gotowy odpowiedzieć na każde pytanie o miasto i otwarte dane.',
        bullets: [
          'Świadomość kontekstu: Wawelek wie, który moduł i którą dzielnicę aktualnie analizujesz',
          'Błyskawiczne rekomendacje dzielnic, placówek dla dzieci, inwestycji i spokojnych tras',
          'Ciągłość rozmowy zachowywana podczas swobodnego przełączania się między zakładkami',
        ],
      },
    ],
  },
  promoSpot: {
    sectionBadge: 'SPOT PROMOCYJNY • KRAKÓW360 W AKCJI',
    titleLead: 'Zobacz wizję',
    titleAccent: 'Smart City Kraków360',
    description:
      'Najedź kursorem na ekran i kliknij w wideo, aby przełączyć dźwięk, lub przewiń nagranie w dowolne miejsce na dolnym pasku postępu.',
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
      'Pięć ludzkich perspektyw i codziennych sytuacji, w których otwarte dane miejskie zamieniają niepewność w spokój ducha.',
    cards: [
      {
        id: 'story-resident',
        tabId: 'resident',
        colorTheme: 'blue',
        imageSrc: '/showcase/resident.jpg',
        badge: 'NOWY DOM POD WAWELEM',
        title: 'Pierwsze mieszkanie bez wróżenia z fusów',
        description:
          'Kiedy rozpakowujesz kartony w nowym mieście, zamiast dziesiątek sprzecznych opinii wybierasz okolicę dopasowaną do Twojego rytmu dnia.',
      },
      {
        id: 'story-parent',
        tabId: 'parent',
        colorTheme: 'emerald',
        imageSrc: '/showcase/parent.jpg',
        badge: 'RODZINNY PORANEK',
        title: 'Spokojny spacer z dzieckiem zamiast stania w korkach',
        description:
          'Gdy żłobek, szkoła i bezpieczny park są tuż za rogiem, cała rodzina odzyskuje każdego dnia bezcenną godzinę dla siebie.',
      },
      {
        id: 'story-investor',
        tabId: 'investor',
        colorTheme: 'violet',
        imageSrc: '/showcase/investor.jpg',
        badge: 'GŁOS SĄSIEDZTWA',
        title: 'Zmiany w okolicy tam, gdzie naprawdę ich brakuje',
        description:
          'Nowy skwer, ścieżka czy przystanek zmieniają codzienność tysięcy sąsiadów, gdy powstają z realnych potrzeb dzielnicy.',
      },
      {
        id: 'story-tourist',
        tabId: 'tourist',
        colorTheme: 'amber',
        imageSrc: '/showcase/tourist.jpg',
        badge: 'WEEKENDOWY ODDECH',
        title: 'Niedzielny spacer z dala od zgiełku Rynku',
        description:
          'Kraków to znacznie więcej niż utarte szlaki - to dziesiątki cichych kopców, lasów i alejek czekających na odkrycie.',
      },
      {
        id: 'story-methodology',
        tabId: 'methodology',
        colorTheme: 'slate',
        imageSrc: '/showcase/methodology.jpg',
        badge: 'KULTURA TRANSPARENTNOŚCI',
        title: 'Jedna wspólna prawda zamiast informacyjnego szumu',
        description:
          'Gdy rozproszone urzędowe rejestry zaczynają mówić zrozumiałym językiem, każda decyzja staje się prosta i pewna.',
      },
    ],
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
        colorTheme: 'blue',
        code: 'MODUŁ 01',
        badge: 'DLA MIESZKAŃCÓW I PRZEPROWADZAJĄCYCH SIĘ',
        title: 'Tryb Mieszkańca',
        subtitle: 'Indeks Jakości Życia • Mapa 18 Dzielnic • Audyt Dostępności 5★',
        description:
          'Dostosuj wagi 8 filarów miejskich, porównaj dzielnice 1-na-1 na wykresie radarowym i sprawdź dostępność architektoniczną.',
        metricsLabel: '18 Dzielnic • 8 Filarów • Ranking 0–100 pkt',
        ctaLabel: 'Uruchom Tryb Mieszkańca',
        accentGradient: 'from-blue-600 via-indigo-600 to-sky-500',
      },
      {
        tabId: 'parent',
        colorTheme: 'emerald',
        code: 'MODUŁ 02',
        badge: 'DLA RODZICÓW I OPIEKUNÓW',
        title: 'Tryb Rodzica',
        subtitle: 'Izochrony 300m - 1km • Żłobki, Przedszkola i Szkoły',
        description:
          'Sprawdź zasięg pieszego spaceru do placówek opiekuńczych, parków i placów zabaw oraz poznaj prognozy demograficzne dla dzieci w wieku 0–14 lat.',
        metricsLabel: 'Izochrony 5 - 15 min • Baza Placówek Oświatowych',
        ctaLabel: 'Uruchom Tryb Rodzica',
        accentGradient: 'from-emerald-600 via-teal-600 to-cyan-500',
      },
      {
        tabId: 'investor',
        colorTheme: 'violet',
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
        colorTheme: 'amber',
        code: 'MODUŁ 04',
        badge: 'DLA TURYSTÓW I ODKRYWCÓW KRAKOWA',
        title: 'Odkrywaj Kraków (Smart Tourism)',
        subtitle: 'Alternatywy dla Tłumów • Trasy Tematyczne • Paszporty Turystyczne',
        description:
          'Odkryj mniej znane perły Krakowa, porównaj poziom zatłoczenia atrakcji, przejrzyj Paszporty Turystyczne dzielnic i wybierz gotowy szlak spacerowy.',
        metricsLabel: '50+ Atrakcji • Trasy • Spokojne Dzielnice',
        ctaLabel: 'Otwórz Odkrywaj Kraków',
        accentGradient: 'from-amber-500 via-orange-500 to-rose-500',
      },
      {
        tabId: 'methodology',
        colorTheme: 'slate',
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
    badge: 'ZESPÓŁ PERCEPCJA360 • KONKURS MIASTA KRAKOWA „OPEN DATA APP”',
    title: 'Twórcy ekosystemu Kraków360',
    subtitle:
      'Połączenie inżynierii systemowej z zaawansowaną analityką gospodarczą, ekonometrią oraz badaniami społecznymi.',
    hoverPrompt: 'Najedź kursorem na kafelek autora, aby rozwinąć jego historię w prawo',
    members: [
      {
        id: 'kacper',
        name: 'Kacper Gumulak',
        university: 'Politechnika Krakowska\nInformatyka',
        roleBadge: 'Architekt Systemu & Fullstack',
        avatarSrc: '/showcase/kacper.jpg',
        expandHint: 'Najedź, aby rozwinąć pełną historię',
        idleSummaryTitle: 'Architektura Systemu, Backend, Frontend & AI',
        idleSummarySubtitle:
          'Projekt i wdrożenie platformy Kraków360 – od wydajnego backendu po dynamiczny interfejs.',
        idleHighlights: [
          { value: 'Backend .NET 9', label: 'Clean Architecture, EF Core, Dapper & SQLite' },
          { value: 'Frontend React 19', label: 'TypeScript, Tailwind CSS & płynny UI' },
          { value: 'VPS & Wawelek AI', label: 'Wdrożenie na Mikrus, Docker & DeepSeek' },
        ],
        krakowStoryTitle: 'Sylwetka i pasja do Krakowa',
        krakowStoryBody:
          'Studiuje informatykę na Politechnice Krakowskiej i od lat z pasją odkrywa niepowtarzalny klimat miasta pod Wawelem. Własne doświadczenia z codziennym życiem w Krakowie i poszukiwaniem idealnej dzielnicy zainspirowały go do przekucia surowych miejskich danych w nowoczesną platformę ułatwiającą życie mieszkańcom.',
        contributionTitle: 'Wkład inżynieryjny w projekt Kraków360',
        contributionBody:
          'Opracował kompletną architekturę techniczną platformy: od wydajnego backendu w C# / .NET 9 (Clean Architecture, EF Core, Dapper), przez interaktywny frontend w React 19 i TypeScript, po integrację asystenta Wawelek AI oraz konteneryzację Docker i wdrożenie na serwerze VPS (Mikrus).',
        tags: ['.NET 9 & C#', 'React 19 & TypeScript', 'Docker & VPS Mikrus', 'Wawelek AI & DeepSeek'],
        linkedInUrl: 'https://www.linkedin.com/in/kacper-gumulak-dev/',
        linkedInLabel: 'Profil LinkedIn',
        portfolioUrl: 'https://kacpergumulak.pl',
        portfolioLabel: 'Portfolio',
      },
      {
        id: 'filip',
        name: 'Filip Gorczyca',
        university: 'Uniwersytet Ekonomiczny w Krakowie\nAnalityka Gospodarcza',
        roleBadge: 'Analityk Gospodarczy & Media',
        avatarSrc: '/showcase/filip.jpg',
        expandHint: 'Najedź, aby rozwinąć pełną historię',
        idleSummaryTitle: 'Analityka Danych, Potok Python & Kreacja',
        idleSummarySubtitle:
          'Badania mieszkańców, potok danych Python i oprawa wizualna projektu Kraków360.',
        idleHighlights: [
          { value: 'Ankieta 243 osób', label: 'Autorskie badanie realnych potrzeb mieszkańców' },
          { value: 'Python GIS ETL', label: 'Potok analityczny, czyszczenie i wagi wskaźników' },
          { value: 'Grafika & Wideo', label: 'Smok Wawelek, oprawa graficzna i spot wideo' },
        ],
        krakowStoryTitle: 'Sylwetka i pasja do Krakowa',
        krakowStoryBody:
          'Studiuje analitykę gospodarczą na Uniwersytecie Ekonomicznym w Krakowie i na co dzień aktywnie angażuje się w życie miasta. Zafascynowany dynamiką rozwoju krakowskich dzielnic, postanowił zbadać realne wyzwania krakowian i oprzeć fundament platformy na dowodach empirycznych.',
        contributionTitle: 'Wkład analityczny i kreatywny w projekt Kraków360',
        contributionBody:
          'Przeprowadził 243-osobową ankietę badawczą wśród mieszkańców Krakowa, zbudował potok analityczny danych w Pythonie (ETL, czyszczenie, wagi i modele) oraz współtworzył oprawę graficzną i medialną – w tym postać smoka Wawelka, spot wideo i raport finałowy.',
        tags: ['Analityka Gospodarcza', 'Ankieta 243 Mieszkańców', 'Python GIS & ETL', 'Grafika, Wideo & Wawelek'],
        linkedInUrl: 'https://www.linkedin.com/in/filip-gorczyca/',
        linkedInLabel: 'Profil LinkedIn',
      },
    ],
  },
};

const EN_HOME_SHOWCASE: HomeShowcaseTranslations = {
  navHomeLabel: 'Home',
  hero: {
    competitionBadge: 'CITY OF KRAKOW COMPETITION • OPEN DATA APP',
    welcomeWord: 'Welcome to the ecosystem of',
    brandTitleLead: 'Kraków',
    brandTitleAccent: '360',
    subtitleHeadlineLine1: 'Integrated Platform',
    subtitleHeadlineLine2: 'of the Smart City Type',
    subtitleBody: `Transforming ${DATASETS_COUNT} official municipal open datasets into clear, everyday decision-support tools for residents, parents, city officials, and visitors.`,
    mottoBadge: 'ORDO AB CHAO • PERCEPCJA360 TEAM',
    maskHintSub:
      'Move your cursor across the Wawel panorama to reveal the underlying GIS grid and spatial data architecture',
    xrayHudTitle: 'GIS TELEMETRY LAYER • WAWEL 50.054°N, 19.935°E',
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
    autopilotIdleLabel: 'Autopilot',
    autopilotActiveLabel: 'Autopilot active',
    hudProgressLabel: 'FLIGHT PROGRESS',
    hudFrameLabel: 'FLIGHT FRAME',
    skipToFinaleLabel: 'Skip flight to finale section',
    chapters: [
      {
        id: 'genesis',
        chapterNumber: '01 / 08',
        scrollRange: [0.033, 0.117],
        align: 'left',
        badge: 'PROJECT ORIGIN • SURVEY OF 243 RESIDENTS',
        title: 'Bringing order to information chaos',
        highlightStat: '77.4%',
        highlightLabel:
            'of surveyed Kraków residents identified a need for an objective tool to compare city districts',
        description:
            'In our survey (n = 243), 81.1% of residents reported a lack of clear information, while 36.6% pointed to the fragmentation of data sources. Kraków360 consolidates these into a single, intuitive interface.',
        bullets: [
          `${DATASETS_COUNT} verified datasets (from UMK, GUS, GIOŚ, MPK, ZTP, and MSWiA)`,
          'A two-layer Min-Max normalization algorithm, robust against outliers',
          'The motto of the Percepcja360 team: Ordo ab chao (Order out of chaos)',
        ],
        targetTab: 'methodology',
        ctaLabel: `Explore Methodology & ${DATASETS_COUNT} Sources`,
      },
      {
        id: 'resident',
        chapterNumber: '02 / 08',
        scrollRange: [0.133, 0.203],
        align: 'right',
        badge: 'RESIDENT MODE • 8 URBAN PILLARS',
        title: 'Personalized Quality of Life Index',
        highlightStat: '18 districts',
        highlightLabel:
            'calculated in real-time based on your individual priorities',
        description:
            'Every resident looks for something different. Adjust the weightings of 8 pillars (Mobility, Education, Green Spaces, Culture, Environment, Safety, Housing, Demographics) or choose a pre-set profile.',
        bullets: [
          'Interactive choropleth map featuring vectors for all 18 districts',
          'Direct 1-on-1 district comparisons with a radar chart and expert verdict',
          'District rankings that update instantly whenever a weighting slider is adjusted',
        ],
        targetTab: 'resident',
        ctaLabel: 'Open Resident Mode',
      },
      {
        id: 'accessibility',
        chapterNumber: '03 / 08',
        scrollRange: [0.217, 0.287],
        align: 'left',
        badge: 'KRAKÓW WITHOUT BARRIERS • SOCIAL INCLUSION',
        title: 'Accessibility Audit',
        highlightStat: '5 dimensions',
        highlightLabel:
            'of architectural, sensory, and communication accessibility for individuals with specific needs',
        description:
            'A friendly city is one that is accessible to everyone—seniors, people with physical disabilities, parents with strollers, and neurodivergent individuals.',
        bullets: [
          'Assessment of building architecture and low-floor public transport (MPK) stops',
          'Map of "Quiet Places" and sensory-calming zones in public institutions and commercial spaces',
          'Density index of ramps and dropped curbs',
        ],
        targetTab: 'resident',
        ctaLabel: 'Explore Barrier-Free Krakow',
      },
      {
        id: 'parent',
        chapterNumber: '04 / 08',
        scrollRange: [0.300, 0.420],
        align: 'right',
        badge: 'PARENT MODE • 15-MINUTE CITY',
        title: 'Education & Care Compass',
        highlightStat: '300m – 1km',
        highlightLabel:
            'walking isochrones around every nursery, preschool, and primary school',
        description:
            'Parents expressed a need for a map that connects educational facilities with green spaces and playgrounds—all within a short walking distance.',
        bullets: [
          'Interactive pedestrian-access rings (a 5- to 15-minute walk with a stroller)',
          'Occupancy rates for nurseries and childcare centers (for ages 0–3 and 4–6)',
          'Analysis of the number of children per available childcare spot in each district',
        ],
        targetTab: 'parent',
        ctaLabel: 'Open Parent Mode',
      },
      {
        id: 'investor',
        chapterNumber: '05 / 08',
        scrollRange: [0.450, 0.533],
        align: 'left',
        badge: 'OFFICIAL & INVESTOR • HORIZON 2028',
        title: 'Development Predictions and Simulator',
        highlightStat: '2026–2028',
        highlightLabel:
            'econometric models (CAGR, ETS, regression) and social return on investment (SROI) simulation',
        description:
            'We support evidence-based decision-making. See how the construction of a new park, nursery, or transit stop would shift a district’s position in the rankings.',
        bullets: [
          'Simulator calculating the impact of new investments on the Quality of Life Index',
          'Demographic forecasts and trends in new urban development',
          'Automated identification of infrastructure deficits across 18 districts',
        ],
        targetTab: 'investor',
        ctaLabel: 'Launch Simulator & Forecasts',
      },
      {
        id: 'tourist',
        chapterNumber: '06 / 08',
        scrollRange: [0.550, 0.647],
        align: 'right',
        badge: 'DISCOVER KRAKÓW • SMART TOURISM',
        title: 'Sustainable Tourism',
        highlightStat: '50+ hidden gems',
        highlightLabel:
            'attractions, green spaces, and viewpoints evaluated for tranquility and accessibility',
        description:
            'We help relieve pressure on the crowded Old Town by promoting the authentic heritage of all 18 districts, including scenic mounds, nature reserves, and intimate walking routes.',
        bullets: [
          'Smart recommendations: "Choose tranquility over crowds"',
          'Ready-made themed walking and cycling routes with accessibility profiles',
          'Tourist Passports for all 18 districts, featuring hidden architectural gems',
        ],
        targetTab: 'tourist',
        ctaLabel: 'Discover Crowd-Free Krakow',
      },
      {
        id: 'atmosphere',
        chapterNumber: '07 / 08',
        scrollRange: [0.650, 0.743],
        align: 'left',
        badge: 'ENVIRONMENTAL TELEMETRY • LIVE WEATHER BAR',
        title: 'Atmospheric Pulse in Every Corner of Kraków',
        highlightStat: 'PM10 / CAQI',
        highlightLabel:
            'an integrated bar showing atmospheric conditions and air quality, available in every analytical module',
        description:
            'As many as 73.6% of surveyed residents consider air quality a key factor in their daily decisions. In every module—excluding the home page—you have a constant view of environmental parameters.',
        bullets: [
          'Live measurements of PM10 and PM2.5 particulate concentrations, as well as the European CAQI index, sourced from GIOŚ (Chief Inspectorate for Environmental Protection) stations',
          'Real-time readings of temperature, wind chill, wind speed, humidity, and pressure',
          'The ability to check environmental conditions for every corner and district of Kraków',
        ],
      },
      {
        id: 'wawelek',
        chapterNumber: '08 / 08',
        scrollRange: [0.767, 0.858],
        align: 'right',
        badge: 'AI ASSISTANT "WAWELEK" • YOUR CITY ADVISOR',
        title: 'Artificial Intelligence at the Service of Residents',
        highlightStat: 'Wawelek AI',
        highlightLabel:
            'a blue Wawel Dragon powered by the DeepSeek model, a database covering 18 districts, and live telemetry',
        description:
            'Simply navigate to any analytical tab, and you’ll find Wawelek waiting for you in the bottom-right corner of the screen—ready to answer any question about the city and its open data.',
        bullets: [
          'Context awareness: Wawelek knows which module and which district you are currently analyzing',
          'Instant recommendations for districts, facilities for children, urban investments, and quiet routes',
          'Conversational continuity maintained as you switch freely between different tabs',
        ],
      },
    ],
  },
  promoSpot: {
    sectionBadge: 'PROMOTIONAL SPOT • KRAKÓW360 IN ACTION',
    titleLead: 'Watch the vision of',
    titleAccent: 'Smart City Kraków360',
    description:
      'Hover over the canvas and click the video to toggle audio, or click anywhere along the bottom progress bar to seek.',
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
      'Five everyday human moments in which municipal open data turns uncertainty into peace of mind.',
    cards: [
      {
        id: 'story-resident',
        tabId: 'resident',
        colorTheme: 'blue',
        imageSrc: '/showcase/resident.jpg',
        badge: 'NEW HOME UNDER WAWEL',
        title: 'Your first home - no crystal ball required',
        description:
          'When unpacking moving boxes in a new city, replace conflicting opinions with a neighborhood matched to your daily rhythm.',
      },
      {
        id: 'story-parent',
        tabId: 'parent',
        colorTheme: 'emerald',
        imageSrc: '/showcase/parent.jpg',
        badge: 'FAMILY MORNINGS',
        title: 'A calm morning walk instead of sitting in traffic',
        description:
          'When a nursery, school, and green park are just around the corner, your whole family gains an extra hour together every day.',
      },
      {
        id: 'story-investor',
        tabId: 'investor',
        colorTheme: 'violet',
        imageSrc: '/showcase/investor.jpg',
        badge: 'NEIGHBORHOOD VOICE',
        title: 'Urban improvements right where they are needed most',
        description:
          'A new public square, a footpath, or a bus stop can transform the daily lives of thousands of neighbors—provided they are created in response to the actual needs of the local area.',
      },
      {
        id: 'story-tourist',
        tabId: 'tourist',
        colorTheme: 'amber',
        imageSrc: '/showcase/tourist.jpg',
        badge: 'WEEKEND BREATH',
        title: 'A Sunday stroll far from the Old Town crowds',
        description:
          'Kraków is much more than just the well-trodden paths—it is home to dozens of quiet mounds, forests, and alleyways waiting to be discovered.',
      },
      {
        id: 'story-methodology',
        tabId: 'methodology',
        colorTheme: 'slate',
        imageSrc: '/showcase/methodology.jpg',
        badge: 'CULTURE OF TRANSPARENCY',
        title: 'One shared truth instead of informational noise',
        description:
          'When disparate official registers begin to speak a common, intelligible language, every decision becomes straightforward and certain.',
      },
    ],
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
        colorTheme: 'blue',
        code: 'MODULE 01',
        badge: 'FOR RESIDENTS & NEWCOMERS',
        title: 'Resident Mode',
        subtitle: 'Quality of Life Index • 18-District Map • 5★ Accessibility Audit',
        description:
          'Adjust the weights of the 8 urban pillars, compare districts one-on-one on a radar chart, and check for architectural accessibility.',
        metricsLabel: '18 Districts • 8 Pillars • 0–100 Score',
        ctaLabel: 'Launch Resident Mode',
        accentGradient: 'from-blue-600 via-indigo-600 to-sky-500',
      },
      {
        tabId: 'parent',
        colorTheme: 'emerald',
        code: 'MODULE 02',
        badge: 'FOR PARENTS & CAREGIVERS',
        title: 'Parent Mode',
        subtitle: '300m–1km isochrones • Nurseries, kindergartens, and schools',
        description:
          'Check the walking distance to childcare facilities, parks, and playgrounds, and explore demographic projections for children aged 0–14.',
        metricsLabel: 'Isochrones 5–15 min • Database of Educational Facilities',
        ctaLabel: 'Launch Parent Mode',
        accentGradient: 'from-emerald-600 via-teal-600 to-cyan-500',
      },
      {
        tabId: 'investor',
        colorTheme: 'violet',
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
        colorTheme: 'amber',
        code: 'MODULE 04',
        badge: 'FOR VISITORS & URBAN EXPLORERS',
        title: 'Discover Krakow (Smart Tourism)',
        subtitle: 'Alternatives to Crowds • Themed Routes • Tourist Passports',
        description:
            'Discover Krakow’s lesser-known gems, compare crowd levels at various attractions, explore district-specific Tourist Passports, and choose a ready-made walking route.',
        metricsLabel: '50+ Attractions • Routes • Quiet Districts',
        ctaLabel: 'Open Discover Krakow',
        accentGradient: 'from-amber-500 via-orange-500 to-rose-500',
      },
      {
        tabId: 'methodology',
        colorTheme: 'slate',
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
    badge: 'PERCEPCJA360 TEAM • CITY OF KRAKOW "OPEN DATA APP" COMPETITION',
    title: 'Creators of the Kraków360 Ecosystem',
    subtitle:
      'A combination of systems engineering with advanced business analytics, econometrics, and social research.',
    hoverPrompt: 'Hover over an author card to expand their story to the right',
    members: [
      {
        id: 'kacper',
        name: 'Kacper Gumulak',
        university: 'Cracow University of Technology\nComputer Science',
        roleBadge: 'System Architect & Fullstack',
        avatarSrc: '/showcase/kacper.jpg',
        expandHint: 'Hover to expand full story',
        idleSummaryTitle: 'System Architecture, Backend, Frontend & AI',
        idleSummarySubtitle:
          'Engineering the Kraków360 platform—from high-performance backend to UI.',
        idleHighlights: [
          { value: 'Backend .NET 9', label: 'Clean Architecture, EF Core, Dapper & SQLite' },
          { value: 'Frontend React 19', label: 'TypeScript, Tailwind CSS & UI' },
          { value: 'VPS & Wawelek AI', label: 'Mikrus VPS deployment, Docker & DeepSeek' },
        ],
        krakowStoryTitle: 'Profile & Passion for Krakow',
        krakowStoryBody:
          'Studies Computer Science at Cracow University of Technology and passionately explores the vibrant atmosphere of the city under Wawel. Everyday life in Krakow and searching for the ideal neighborhood inspired him to turn raw open municipal data into a modern platform supporting residents.',
        contributionTitle: 'Engineering Contribution to Kraków360',
        contributionBody:
          'Engineered the complete system architecture: from the C# / .NET 9 backend (Clean Architecture, EF Core, Dapper), through the interactive React 19 & TypeScript frontend, to Wawelek AI integration and Docker deployment on a Mikrus VPS server.',
        tags: ['.NET 9 & C#', 'React 19 & TypeScript', 'Docker & Mikrus VPS', 'Wawelek AI & DeepSeek'],
        linkedInUrl: 'https://www.linkedin.com/in/kacper-gumulak-dev/',
        linkedInLabel: 'LinkedIn Profile',
        portfolioUrl: 'https://kacpergumulak.pl',
        portfolioLabel: 'Portfolio',
      },
      {
        id: 'filip',
        name: 'Filip Gorczyca',
        university: 'Krakow University of Economics (UEK)\nEconomic Analytics',
        roleBadge: 'Economic Analyst & Media',
        avatarSrc: '/showcase/filip.jpg',
        expandHint: 'Hover to expand full story',
        idleSummaryTitle: 'Data Analytics, Python Pipeline & Media',
        idleSummarySubtitle:
          'Resident research, Python data pipeline, and visual design of Kraków360.',
        idleHighlights: [
          { value: '243-Person Survey', label: 'Original research into Krakow residents\' needs' },
          { value: 'Python GIS ETL', label: 'Data processing pipeline, cleaning & indicators' },
          { value: 'Graphics & Video', label: 'Wawel Dragon, graphic design and video spot' },
        ],
        krakowStoryTitle: 'Profile & Passion for Krakow',
        krakowStoryBody:
          'Studies Economic Analytics at Krakow University of Economics and is actively engaged in the daily rhythm of the city. Fascinated by urban development dynamics, he set out to investigate real challenges of residents and ground the platform in empirical research.',
        contributionTitle: 'Analytical & Creative Contribution to Kraków360',
        contributionBody:
          'Conducted the 243-person resident survey, built the Python data pipeline (ETL, cleaning, indicator weights, and models), and co-created the visual and media assets—including the Wawelek dragon mascot, promo video, and final report.',
        tags: ['Economic Analytics', '243-Resident Survey', 'Python GIS & ETL', 'Graphics, Video & Wawelek'],
        linkedInUrl: 'https://www.linkedin.com/in/filip-gorczyca/',
        linkedInLabel: 'LinkedIn Profile',
      },
    ],
  },
};

const UA_HOME_SHOWCASE: HomeShowcaseTranslations = {
  navHomeLabel: 'Головна',
  hero: {
    competitionBadge: 'КОНКУРС МІСТА КРАКОВА • OPEN DATA APP',
    welcomeWord: 'Ласкаво просимо до екосистеми',
    brandTitleLead: 'Kraków',
    brandTitleAccent: '360',
    subtitleHeadlineLine1: 'Інтегрована платформа',
    subtitleHeadlineLine2: 'типу Smart City',
    subtitleBody: `Перетворюємо ${DATASETS_COUNT} офіційних міських наборів відкритих даних на зрозумілі щоденні інструменти для мешканців, батьків, посадовців та туристів.`,
    mottoBadge: 'ORDO AB CHAO • КОМАНДА PERCEPCJA360',
    maskHintSub:
      'Рухайте курсором по панорамі Вавеля, щоб побачити сітку ГІС та архітектуру даних під зображенням міста',
    xrayHudTitle: 'ШАР ТЕЛЕМЕТРІЇ ГІС • ВАВЕЛЬ 50.054°N, 19.935°E',
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
    autopilotIdleLabel: 'Автопілот',
    autopilotActiveLabel: 'Автопілот активний',
    hudProgressLabel: 'ПРОГРЕС МАРШРУТУ',
    hudFrameLabel: 'КАДР ПОЛЬОТУ',
    skipToFinaleLabel: 'Пропустити політ до фінальної секції',
    chapters: [
      {
        id: 'genesis',
        chapterNumber: '01 / 08',
        scrollRange: [0.033, 0.117],
        align: 'left',
        badge: 'ПОЧАТОК ПРОЄКТУ • ОПИТУВАННЯ 243 МЕШКАНЦІВ',
        title: 'Порядок з інформаційного хаосу',
        highlightStat: '77.4%',
        highlightLabel:
            'опитані мешканці Кракова вказали на потребу в об\'єктивному інструменті порівняння районів',
        description:
            'У нашому опитуванні (n = 243) аж 81.1% мешканців повідомили про брак чіткої інформації, а 36.6% вказали на розпорошення джерел. Kraków360 об\'єднує їх в один прозорий інтерфейс.',
        bullets: [
          `${DATASETS_COUNT} перевірених наборів даних (UMK, GUS, GIOŚ, MPK, ZTP, MSWiA)`,
          'Дворівневий алгоритм нормалізації Min-Max, стійкий до екстремальних значень',
          'Максима команди Percepcja360: Ordo ab chao (Порядок з Хаосу)',
        ],
        targetTab: 'methodology',
        ctaLabel: `Переглянути Методологію та ${DATASETS_COUNT} Джерел`,
      },
      {
        id: 'resident',
        chapterNumber: '02 / 08',
        scrollRange: [0.133, 0.203],
        align: 'right',
        badge: 'РЕЖИМ МЕШКАНЦЯ • 8 МІСЬКИХ СТОВПІВ',
        title: 'Персоналізований Індекс Якості Життя',
        highlightStat: '18 районів',
        highlightLabel:
          'перераховуються в реальному часі (0 мс) відповідно до ваших пріоритетів',
        description:
          'Кожен мешканець шукає щось своє. Відрегулюйте ваги 8 стовпів (Мобільність, Освіта, Зелені простори, Культура, Навколишнє середовище, Безпека, Житло, Демографічні показники) або виберіть попередньо створений профіль.',
        bullets: [
          'Інтерактивна хороплетична карта з векторами для всіх 18 районів',
          'Пряма дуель районів 1 на 1 з радарною діаграмою та експертним висновком',
          'Рейтинг районів оновлюється одразу після кожного руху повзунка ваг',
        ],
        targetTab: 'resident',
        ctaLabel: 'Відкрити Режим Мешканця',
      },
      {
        id: 'accessibility',
        chapterNumber: '03 / 08',
        scrollRange: [0.217, 0.287],
        align: 'left',
        badge: 'КРАКІВ БЕЗ БАР’ЄРІВ • СОЦІАЛЬНА ІНКЛЮЗІЯ',
        title: 'Аудит 5-зіркової доступності',
        highlightStat: '5 вимірів',
        highlightLabel:
          'архітектурної, сенсорної та транспортної доступності для людей з особливими потребами',
        description:
          'Дружнє місто — це місто, доступне для всіх: людей похилого віку, людей з обмеженими можливостями пересування, батьків з колясками та нейрорізноманітних людей.',
        bullets: [
          'Оцінка архітектури будівель та зупинок громадського транспорту з низькою підлогою',
          'Карта «Тихих місць» та зон сенсорного розвантаження в установах та торгових точках',
          'Індекс щільності пандуса та нижнього бордюру',
        ],
        targetTab: 'resident',
        ctaLabel: 'Перевірити Краків без Бар’єрів',
      },
      {
        id: 'parent',
        chapterNumber: '04 / 08',
        scrollRange: [0.300, 0.420],
        align: 'right',
        badge: 'РЕЖИМ БАТЬКІВ • 15-ХВИЛИННЕ МІСТО',
        title: 'Освітньо-опікунський компас',
        highlightStat: '500м / 1км',
        highlightLabel:
          'пішохідні ізохрони навколо кожного ясел, дитсадка та початкової школи',
        description:
          'Батьки висловили потребу в карті, що з’єднує навчальні заклади із зеленими зонами та дитячими майданчиками в межах короткої пішої доступності.',
        bullets: [
          'Інтерактивні кільця для пішохідного доступу (від 5 до 15 хвилин ходьби з коляскою)',
          'Заповнюваність дитячих садків та дитячих клубів (віком 0–3 та 4–6 років)',
          'Аналіз кількості дітей на одне місце в дитячому садку в кожному районі',
        ],
        targetTab: 'parent',
        ctaLabel: 'Відкрити Режим Батьків',
      },
      {
        id: 'investor',
        chapterNumber: '05 / 08',
        scrollRange: [0.450, 0.533],
        align: 'left',
        badge: 'ПОСАДОВЕЦЬ ТА ІНВЕСТОР • ГОРИЗОНТ 2028',
        title: 'Прогнози розвитку та Симулятор',
        highlightStat: '2026–2028',
        highlightLabel:
          'економетричні моделі (CAGR, ETS, регресія) та симуляція соціальної віддачі інвестицій',
        description:
          'Ми підтримуємо прийняття рішень на основі доказів (Політика, заснована на доказах). Подивіться, як будівництво нового парку, дитячого садка чи автобусної зупинки змінить рейтинг району.',
        bullets: [
          'Симулятор, що розраховує вплив нових інвестицій на індекс якості життя',
          'Демографічні прогнози та динаміка нової забудови',
          'Автоматичне визначення дефіциту інфраструктури у 18 районах',
        ],
        targetTab: 'investor',
        ctaLabel: 'Запустити Симулятор і Прогнози',
      },
      {
        id: 'tourist',
        chapterNumber: '06 / 08',
        scrollRange: [0.550, 0.647],
        align: 'right',
        badge: 'ВІДКРИВАЙ КРАКІВ • SMART TOURISM',
        title: 'Сталий туризм',
        highlightStat: '50+ перлин',
        highlightLabel:
          'локацій, зелених оаз та оглядових курганів, оцінених за рівнем спокою і доступності',
        description:
          'Ми розвантажуємо переповнене Старе місто, пропагуючи автентичну спадщину всіх 18 районів, оглядові кургани, природні заповідники та інтимні пішохідні маршрути.',
        bullets: [
          'Розумні рекомендації «Замість натовпу – оберіть тишу та спокій',
          'Готові тематичні пішохідні та велосипедні маршрути з профілями доступності',
          'Туристичні паспорти всіх 18 районів із прихованими архітектурними перлинами',
        ],
        targetTab: 'tourist',
        ctaLabel: 'Відкривай Краків без Натовпу',
      },
      {
        id: 'atmosphere',
        chapterNumber: '07 / 08',
        scrollRange: [0.650, 0.743],
        align: 'left',
        badge: 'ЕКОЛОГІЧНА ТЕЛЕМЕТРІЯ • ЖИВА СТРІЧКА ПОГОДИ',
        title: 'Атмосферний пульс у кожному куточку Кракова',
        highlightStat: 'PM10 / CAQI',
        highlightLabel:
          'інтегрована стрічка погоди та якості повітря, доступна в кожному аналітичному модулі',
        description:
          'Цілком 73,6% опитаних жителів вважають якість повітря вирішальною для щоденних рішень. У кожному модулі, окрім головної сторінки, ви маєте постійний доступ до параметрів навколишнього середовища.',
        bullets: [
          'Вимірювання концентрації пилу PM10 та PM2,5 у реальному часі та європейський індекс CAQI від станції Головної інспекції охорони навколишнього середовища',
          'Поточні показники температури, сприйнятого холоду, швидкості вітру, вологості та тиску',
          'Можливість перевірити стан навколишнього середовища для кожного куточка та району Кракова',
        ],
      },
      {
        id: 'wawelek',
        chapterNumber: '08 / 08',
        scrollRange: [0.767, 0.858],
        align: 'right',
        badge: 'АСИСТЕНТ AI «ВАВЕЛЕК» • ВАШ МІСЬКИЙ РАДНИК',
        title: 'Штучний інтелект на службі мешканців',
        highlightStat: 'Wawelek AI',
        highlightLabel:
          'синій вавельський дракончик на базі DeepSeek AI, даних 18 районів і живої телеметрії',
        description:
          'Просто перейдіть на будь-яку аналітичну вкладку, і Вавелек завжди чекає на вас у правому нижньому куті екрана — готовий відповісти на будь-яке запитання про місто та відкриті дані.',
        bullets: [
          'Усвідомлення контексту: Вавелек знає, який модуль і який район ви зараз аналізуєте',
          'Миттєві рекомендації щодо районів, дитячих закладів, інвестицій та тихих маршрутів',
          'Зберігання безперервності розмови під час вільного перемикання між вкладками',
        ],
      },
    ],
  },
  promoSpot: {
    sectionBadge: 'ПРОМО-РОЛИК • KRAKÓW360 У ДІЇ',
    titleLead: 'Побачте візію',
    titleAccent: 'Smart City Kraków360',
    description:
      'Наведіть курсор на екран і клацніть на відео, щоб увімкнути/вимкнути звук, або перемотайте запис до будь-якої точки на нижній панелі виконання.',
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
      'П’ять життєвих історій і щоденних ситуацій, у яких відкриті міські дані перетворюють невпевненість на спокій.',
    cards: [
      {
        id: 'story-resident',
        tabId: 'resident',
        colorTheme: 'blue',
        imageSrc: '/showcase/resident.jpg',
        badge: 'НОВИЙ ДІМ ПІД ВАВЕЛЕМ',
        title: 'Ваша перша квартира без читання на кавовій гущі',
        description:
          'Розпаковуючи коробки в новому місті, замість десятків суперечливих відгуків ви обираєте район під власний ритм життя.',
      },
      {
        id: 'story-parent',
        tabId: 'parent',
        colorTheme: 'emerald',
        imageSrc: '/showcase/parent.jpg',
        badge: 'РОДИННИЙ РАНОК',
        title: 'Спокійна прогулянка з дитиною замість заторів',
        description:
          'Коли ясла, школа й безпечний парк розташовані за рогом, уся родина щодня отримує безцінну годину для себе.',
      },
      {
        id: 'story-investor',
        tabId: 'investor',
        colorTheme: 'violet',
        imageSrc: '/showcase/investor.jpg',
        badge: 'ГОЛОС СУСІДСТВА',
        title: 'Зміни в районі саме там, де їх справді бракує',
        description:
          'Нова площа, стежка чи автобусна зупинка змінюють повсякденне життя тисяч сусідів, коли вони виникають із реальних потреб району.',
      },
      {
        id: 'story-tourist',
        tabId: 'tourist',
        colorTheme: 'amber',
        imageSrc: '/showcase/tourist.jpg',
        badge: 'ВІДПОЧИНОК НА ВИХІДНИХ',
        title: 'Недільна прогулянка подалі від гамору Ринку',
        description:
          'Краків — це набагато більше, ніж просто вторована стежка — тут є десятки тихих курганів, лісів та провулків, які чекають на своє відкриття.',
      },
      {
        id: 'story-methodology',
        tabId: 'methodology',
        colorTheme: 'slate',
        imageSrc: '/showcase/methodology.jpg',
        badge: 'КУЛЬТУРА ПРОЗОРОСТІ',
        title: 'Єдина спільна правда замість інформаційного шуму',
        description:
          'Коли розрізнені офіційні записи починають говорити зрозумілою мовою, кожне рішення стає простим і певним.',
      },
    ],
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
        colorTheme: 'blue',
        code: 'МОДУЛЬ 01',
        badge: 'ДЛЯ МЕШКАНЦІВ ТА НОВОСЕЛІВ',
        title: 'Режим Мешканця',
        subtitle: 'Індекс Якості Життя • Карта 18 Районів • Аудит Доступності 5★',
        description:
          'Відрегулюйте ваги 8 міських стовпів, порівняйте райони 1 на 1 на радарній діаграмі та перевірте архітектурну доступність.',
        metricsLabel: '18 Районів • 8 Стовпів • Рейтинг 0–100 балів',
        ctaLabel: 'Запустити Режим Мешканця',
        accentGradient: 'from-blue-600 via-indigo-600 to-sky-500',
      },
      {
        tabId: 'parent',
        colorTheme: 'emerald',
        code: 'МОДУЛЬ 02',
        badge: 'ДЛЯ БАТЬКІВ ТА ОПІКУНІВ',
        title: 'Режим Батьків',
        subtitle: 'Ізохрони 300 м - 1 км • Дитячі садки, дитячі садки та школи',
        description:
          'Перевірте відстань до дитячих садків, парків та ігрових майданчиків, яку можна дістатися пішки, а також дізнайтеся про демографічні прогнози для дітей віком від 0 до 14 років.',
        metricsLabel: 'Ізохрони 5 - 15 хв • База даних навчальних закладів',
        ctaLabel: 'Запустити Режим Батьків',
        accentGradient: 'from-emerald-600 via-teal-600 to-cyan-500',
      },
      {
        tabId: 'investor',
        colorTheme: 'violet',
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
        colorTheme: 'amber',
        code: 'МОДУЛЬ 04',
        badge: 'ДЛЯ ТУРИСТІВ ТА ДОСЛІДНИКІВ КРАКОВА',
        title: 'Відкривай Краків (Smart Tourism)',
        subtitle: 'Альтернативи натовпу • Тематичні маршрути • Туристичні паспорти',
        description:
          'Відкрийте для себе менш відомі перлини Кракова, порівняйте рівень відвідуваності визначних пам\'яток, перегляньте туристичні паспорти районів та оберіть готовий пішохідний маршрут.',
        metricsLabel: '50+ визначних пам\'яток • Маршрути • Тихі райони',
        ctaLabel: 'Відкрити Відкривай Краків',
        accentGradient: 'from-amber-500 via-orange-500 to-rose-500',
      },
      {
        tabId: 'methodology',
        colorTheme: 'slate',
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
    badge: 'КОМАНДА PERCEPCJA360 • КОНКУРС МІСТА КРАКОВА «OPEN DATA APP»',
    title: 'Творці екосистеми Kraków360',
    subtitle:
      'Поєднання системної інженерії з передовою економічною аналітикою, економетрикою та соціальними дослідженнями.',
    hoverPrompt: 'Наведіть курсор на картку автора, щоб розгорнути його історію праворуч',
    members: [
      {
        id: 'kacper',
        name: 'Kacper Gumulak',
        university: 'Краківська політехніка\nІнформатика',
        roleBadge: 'Архітектор Системи & Fullstack',
        avatarSrc: '/showcase/kacper.jpg',
        expandHint: 'Наведіть, щоб розгорнути повну історію',
        idleSummaryTitle: 'Архітектура Системи, Backend, Frontend та AI',
        idleSummarySubtitle:
          'Розробка платформи Kraków360 — від продуктивного бекенду до інтерфейсу.',
        idleHighlights: [
          { value: 'Бекенд .NET 9', label: 'Clean Architecture, EF Core, Dapper та SQLite' },
          { value: 'Фронтенд React 19', label: 'TypeScript, Tailwind CSS та плавний UI' },
          { value: 'VPS та Wawelek AI', label: 'Розгортання на Mikrus, Docker та DeepSeek' },
        ],
        krakowStoryTitle: 'Профіль та захоплення Краковом',
        krakowStoryBody:
          'Вивчає інформатику в Краківській політехніці й із захопленням досліджує атмосферу міста під Вавелем. Власний досвід життя в Кракові та пошуку ідеального району надихнув його перетворити відкриті міські дані на сучасну платформу, що полегшує життя мешканцям.',
        contributionTitle: 'Інженерний внесок у проєкт Kraków360',
        contributionBody:
          'Розробив повну технічну архітектуру платформи: від продуктивного бекенду на C# / .NET 9 (Clean Architecture, EF Core, Dapper), через інтерактивний фронтенд на React 19 та TypeScript, до інтеграції асистента Wawelek AI, контейнеризації Docker та розгортання на VPS-сервері (Mikrus).',
        tags: ['.NET 9 & C#', 'React 19 & TypeScript', 'Docker & VPS Mikrus', 'Wawelek AI & DeepSeek'],
        linkedInUrl: 'https://www.linkedin.com/in/kacper-gumulak-dev/',
        linkedInLabel: 'Профіль LinkedIn',
        portfolioUrl: 'https://kacpergumulak.pl',
        portfolioLabel: 'Портфоліо',
      },
      {
        id: 'filip',
        name: 'Filip Gorczyca',
        university: 'Економічний університет у Кракові\nЕкономічна Аналітика',
        roleBadge: 'Економічний Аналітик & Медіа',
        avatarSrc: '/showcase/filip.jpg',
        expandHint: 'Наведіть, щоб розгорнути повну історію',
        idleSummaryTitle: 'Аналітика Даних, Python-Конвеєр та Медіа',
        idleSummarySubtitle:
          'Дослідження мешканців, конвеєр даних Python та візуальне оформлення Kraków360.',
        idleHighlights: [
          { value: 'Опитування 243 осіб', label: 'Авторське дослідження реальних потреб мешканців' },
          { value: 'Python GIS ETL', label: 'Конвеєр обробки даних, очищення та вагові індекси' },
          { value: 'Графіка та Відео', label: 'Дракон Вавелек, графічний дизайн та відеоролик' },
        ],
        krakowStoryTitle: 'Профіль та захоплення Краковом',
        krakowStoryBody:
          'Вивчає економічну аналітику в Економічному університеті в Кракові та бере активну участь у житті міста. Захоплений динамікою розвитку краківських районів, вирішив дослідити реальні виклики містян і закласти в основу платформи емпіричні дані.',
        contributionTitle: 'Аналітичний і креативний внесок у проєкт Kraków360',
        contributionBody:
          'Провів анкетне опитування 243 мешканців Кракова, створив конвеєр обробки даних на Python (ETL, очищення, ваги та моделі), а також брав участь у створенні графіки та медіа — включно з образом дракончика Вавелека, промо-роликом і фінальним звітом.',
        tags: ['Економічна Аналітика', 'Опитування 243 Мешканців', 'Python GIS & ETL', 'Графіка, Відео & Вавелек'],
        linkedInUrl: 'https://www.linkedin.com/in/filip-gorczyca/',
        linkedInLabel: 'Профіль LinkedIn',
      },
    ],
  },
};

export function getHomeShowcaseI18n(language: Language): HomeShowcaseTranslations {
  if (language === 'en') return EN_HOME_SHOWCASE;
  if (language === 'ua') return UA_HOME_SHOWCASE;
  return PL_HOME_SHOWCASE;
}
