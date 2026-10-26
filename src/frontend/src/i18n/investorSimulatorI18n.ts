import type { SimulatorImpactMetrics } from '../components/investor-mode/simulator-what-if/types';
import type { Language } from './types';

export interface LeverItemLabels {
  title: string;
  subtitle: string;
  unitEffect: string;
  currentBaselinePrefix: string;
}

export interface InvestorSimulatorLabels {
  // Section Header
  sectionBadge: string;
  sectionTitle: string;
  sectionSubtitle: string;

  // Toolbar
  selectDistrictLabel: string;
  presetsLabel: string;
  presetFamily: string;
  presetGreen: string;
  presetMobility: string;
  presetSenior: string;
  resetBtn: string;
  activeChangesBadge: (count: number) => string;

  // Levers Panel Header & Categories
  leversPanelTitle: string;
  leversPanelSubtitle: string;
  categoryFilterAll: string;
  categories: {
    education: { title: string; subtitle: string };
    greenery: { title: string; subtitle: string };
    mobility: { title: string; subtitle: string };
    culture: { title: string; subtitle: string };
  };

  // 14 Infrastructure Levers
  levers: {
    nurseries: LeverItemLabels;
    kindergartens: LeverItemLabels;
    primarySchools: LeverItemLabels;
    parentClubs: LeverItemLabels;
    pocketParks: LeverItemLabels;
    cityParks: LeverItemLabels;
    schoolSports: LeverItemLabels;
    busStops: LeverItemLabels;
    tramStops: LeverItemLabels;
    bikeLanesKm: LeverItemLabels;
    parkAndRide: LeverItemLabels;
    casCenters: LeverItemLabels;
    libraries: LeverItemLabels;
    culturalCenters: LeverItemLabels;
  };

  // Dynamic Impact Display
  impactSectionBadge: string;
  impactSectionTitle: string;
  impactSectionSubtitle: string;
  noChangesHint: string;

  // Part A: Overall Index & 8 Pillars
  overallIndexCardTitle: string;
  overallIndexCardSub: string;
  rankingCardTitle: string;
  rankingCardSub: string;
  rankImprovedBadge: (delta: number) => string;
  rankUnchangedBadge: string;
  pointsUnit: string;
  beforeLabel: string;
  afterLabel: string;

  pillarsSectionTitle: string;
  pillarsSectionSubtitle: string;
  pillarNames: {
    education: string;
    greenery: string;
    mobility: string;
    culture: string;
    environment: string;
    demographic: string;
    safety: string;
    housing: string;
  };

  // Part B: Childcare & School Balances (Current State)
  balancesSectionTitle: string;
  balancesSectionSubtitle: string;
  balanceCards: {
    nurseryTitle: string;
    nurserySub: string;
    kindergartenTitle: string;
    kindergartenSub: string;
    schoolTitle: string;
    schoolSub: string;
    totalEduTitle: string;
    totalEduSub: string;
  };
  placesLabel: string;
  balance2028Label: string;
  coverageLabel: string;
  avgClassSizeLabel: string;
  parentClubsCountLabel: string;
  childrenPerPlaceLabel: string;
  placesUnit: string;
  pupilsUnit: string;

  // Part C: Concrete Field Metrics (Greenery, Transit, Seniors & Culture)
  fieldMetricsTitle: string;
  fieldMetricsSubtitle: string;
  greeneryCardTitle: string;
  greeneryPerCapitaLabel: string;
  totalParksLabel: string;
  sportsObjectsLabel: string;

  mobilityCardTitle: string;
  kmkStopsTotalLabel: string;
  isochrone500mLabel: string;
  bikeLanesLabel: string;
  prAndRacksLabel: string;

  seniorCultureCardTitle: string;
  casCentersCountLabel: string;
  seniorsPerCasLabel: string;
  librariesAndCultureLabel: string;

  // Part D: Dynamic Summary & Recommendation Banner
  recommendationBannerTitle: string;
}

const PL_SIMULATOR: InvestorSimulatorLabels = {
  sectionBadge: 'Interaktywny Symulator „Co-Jeśli” • Przeliczanie na Żywo',
  sectionTitle: 'Symulator Rozbudowy Infrastruktury Dzielnicy',
  sectionSubtitle:
    'Wybierz dzielnicę i dodaj za pomocą liczników nowe żłobki, przedszkola, szkoły, parki kieszonkowe, przystanki KMK lub kluby seniora CAS. Moduł przelicza wskaźniki w czasie rzeczywistym na stan aktualny — zobacz, jak natychmiast zmieni się Indeks Jakości Życia, pozycja w rankingu 18 dzielnic oraz bieżący bilans miejsc.',

  selectDistrictLabel: 'Symulowana dzielnica:',
  presetsLabel: 'Szybkie pakiety testowe:',
  presetFamily: 'Pakiet Rodzina i Dzieci',
  presetGreen: 'Pakiet Zielona Dzielnica',
  presetMobility: 'Pakiet Lepszy Transport',
  presetSenior: 'Pakiet Senior i Kultura',
  resetBtn: 'Wyzeruj liczniki',
  activeChangesBadge: (count) =>
    count === 0
      ? 'Brak zmian (stan obecny)'
      : `Dodano łącznie: +${count}`,

  leversPanelTitle: '1. Wybierz nowe inwestycje i obiekty do dodania w dzielnicy',
  leversPanelSubtitle:
    'Użyj przycisków „-” oraz „+” lub wybierz gotowy pakiet powyżej, aby przetestować rozbudowę dzielnicy',
  categoryFilterAll: 'Wszystkie kategorie (14)',
  categories: {
    education: {
      title: 'Edukacja i Opieka Rodzinna (0–14 lat)',
      subtitle: 'Żłobki, przedszkola, szkoły podstawowe i Kluby Rodzica',
    },
    greenery: {
      title: 'Zieleń Miejska, Parki i Sport',
      subtitle: 'Parki kieszonkowe, Ogrody Krakowian, parki miejskie i boiska',
    },
    mobility: {
      title: 'Komunikacja Miejska (KMK) i Rower',
      subtitle: 'Przystanki autobusowe, tramwajowe, ścieżki DDR i Park & Ride',
    },
    culture: {
      title: 'Wsparcie Seniorów (65+) i Kultura',
      subtitle: 'Centra Aktywności Seniora (CAS), biblioteki i domy kultury',
    },
  },

  levers: {
    nurseries: {
      title: 'Nowe żłobki / kluby dziecięce (0–3 lata)',
      subtitle: 'Zwiększa bazę miejsc opieki dla najmłodszych dzieci',
      unitEffect: '+100 miejsc / placówka',
      currentBaselinePrefix: 'Obecnie miejsc 0–3:',
    },
    kindergartens: {
      title: 'Nowe przedszkola (4–6 lat)',
      subtitle: 'Rozbudowa sieci przedszkoli samorządowych i publicznych',
      unitEffect: '+125 miejsc / przedszkole',
      currentBaselinePrefix: 'Obecnie miejsc 4–6:',
    },
    primarySchools: {
      title: 'Nowe szkoły podstawowe (7–14 lat)',
      subtitle: 'Nowe obwody szkolne i mniejsza liczba uczniów w klasach',
      unitEffect: '+400 miejsc / szkoła',
      currentBaselinePrefix: 'Obecnie miejsc 7–14:',
    },
    parentClubs: {
      title: 'Kluby Rodzica (wsparcie rodzin z dziećmi do lat 3)',
      subtitle: 'Lokalne punkty spotkań, warsztatów i integracji rodziców',
      unitEffect: '+1 Klub Rodzica',
      currentBaselinePrefix: 'Obecnie klubów:',
    },
    pocketParks: {
      title: 'Parki kieszonkowe / Ogrody Krakowian',
      subtitle: 'Kameralne zieleńce sąsiedzkie blisko zabudowy mieszkalnej',
      unitEffect: '+0,25 ha zieleni / park',
      currentBaselinePrefix: 'Obecnie parków kiesz.:',
    },
    cityParks: {
      title: 'Parki miejskie i duże skwery rekreacyjne',
      subtitle: 'Większe tereny zielone poprawiające mikroklimat i rekreację',
      unitEffect: '+2,0 ha zieleni / park',
      currentBaselinePrefix: 'Obecnie parków miejskich:',
    },
    schoolSports: {
      title: 'Boiska i pływalnie przyszkolne',
      subtitle: 'Nowoczesna baza sportowa dla uczniów i mieszkańców dzielnicy',
      unitEffect: '+1 obiekt sportowy',
      currentBaselinePrefix: 'Obecnie obiektów:',
    },
    busStops: {
      title: 'Przystanki autobusowe KMK',
      subtitle: 'Lepszy dostęp pieszy (500 m) do linii autobusowych',
      unitEffect: '+1 przystanek autobusowy',
      currentBaselinePrefix: 'Obecnie przystanków aut.:',
    },
    tramStops: {
      title: 'Przystanki tramwajowe KMK',
      subtitle: 'Rozbudowa szybkiej komunikacji szynowej w dzielnicy',
      unitEffect: '+1 przystanek tramwajowy',
      currentBaselinePrefix: 'Obecnie przystanków tram.:',
    },
    bikeLanesKm: {
      title: 'Drogi dla rowerów (DDR)',
      subtitle: 'Nowe kilometry bezpiecznych ścieżek i pasów rowerowych',
      unitEffect: '+1 km ścieżki DDR',
      currentBaselinePrefix: 'Obecnie sieci DDR:',
    },
    parkAndRide: {
      title: 'Strefy Park & Ride i stojaki rowerowe',
      subtitle: 'Węzły przesiadkowe P+R wraz z nowymi stojakami ZTP',
      unitEffect: '+1 P+R i +15 stojaków',
      currentBaselinePrefix: 'Obecnie parkingów P+R:',
    },
    casCenters: {
      title: 'Centra Aktywności Seniora (CAS 65+)',
      subtitle: 'Kluby integracji, zajęć ruchowych i wsparcia dla seniorów',
      unitEffect: '+1 centrum CAS',
      currentBaselinePrefix: 'Obecnie placówek CAS:',
    },
    libraries: {
      title: 'Filie Biblioteki Kraków',
      subtitle: 'Lokalne wypożyczalnie książek, mediów i miejsca spotkań',
      unitEffect: '+1 filia biblioteczna',
      currentBaselinePrefix: 'Obecnie filii:',
    },
    culturalCenters: {
      title: 'Domy i ośrodki kultury',
      subtitle: 'Miejskie instytucje kultury, warsztatów i wydarzeń lokalnych',
      unitEffect: '+1 ośrodek kultury',
      currentBaselinePrefix: 'Obecnie ośrodków:',
    },
  },

  impactSectionBadge: 'Dynamiczny Podgląd Efektów w Czasie Rzeczywistym (Przed ➔ Po)',
  impactSectionTitle: '2. Co dokładnie zmieni się w dzielnicy po wprowadzeniu zmian?',
  impactSectionSubtitle:
    'Wszystkie wskaźniki poniżej przeliczają się na żywo dla aktualnego stanu demograficznego i infrastrukturalnego dzielnicy.',
  noChangesHint:
    'Zwiększ dowolny licznik powyżej lub kliknij jeden z szybkich pakietów testowych, aby zobaczyć, jak nowe inwestycje zmienią wyniki dzielnicy.',

  overallIndexCardTitle: 'Łączny Indeks Jakości Życia',
  overallIndexCardSub: 'Średni wynik z 8 filarów jakości życia (skala 0–100 pkt)',
  rankingCardTitle: 'Pozycja w Rankingu 18 Dzielnic',
  rankingCardSub: 'Miejsce wybranej dzielnicy na tle całego Krakowa',
  rankImprovedBadge: (delta) => `Awans o +${delta} poz. w górę!`,
  rankUnchangedBadge: 'Pozycja bez zmian',
  pointsUnit: 'pkt',
  beforeLabel: 'Przed:',
  afterLabel: 'Po zmianach:',

  pillarsSectionTitle: 'Zmiana wyników w filarach Jakości Życia (0–100 pkt)',
  pillarsSectionSubtitle: 'Dokładny wpływ dodanych obiektów na poszczególne kategorie oceny dzielnicy',
  pillarNames: {
    education: 'Edukacja i Opieka (0–14)',
    greenery: 'Zieleń i Rekreacja',
    mobility: 'Komunikacja i Mobilność',
    culture: 'Kultura i Seniorzy (CAS)',
    environment: 'Środowisko i Powietrze',
    demographic: 'Potencjał Demograficzny',
    safety: 'Bezpieczeństwo',
    housing: 'Dostępność Cenowa Mieszkań',
  },

  balancesSectionTitle: 'Wpływ na aktualny bilans miejsc w placówkach dla dzieci (0–14 lat)',
  balancesSectionSubtitle:
    'Sprawdź, jak dodane żłobki, przedszkola, szkoły podstawowe i Kluby Rodzica poprawiają bieżącą dostępność miejsc w dzielnicy',
  balanceCards: {
    nurseryTitle: 'Żłobki i Kluby (0–3 lata)',
    nurserySub: 'Miejsca opieki dla maluchów i Kluby Rodzica',
    kindergartenTitle: 'Przedszkola (4–6 lat)',
    kindergartenSub: 'Dostępność miejsc przedszkolnych w dzielnicy',
    schoolTitle: 'Szkoły Podstawowe (7–14 lat)',
    schoolSub: 'Pojemność szkół i średnia wielkość klas',
    totalEduTitle: 'Łączny Bilans Miejsc (0–14 lat)',
    totalEduSub: 'Suma miejsc w żłobkach, przedszkolach i szkołach',
  },
  placesLabel: 'Liczba miejsc:',
  balance2028Label: 'Bilans miejsc (obecnie):',
  coverageLabel: 'Pokrycie potrzeb:',
  avgClassSizeLabel: 'Średnio w klasie:',
  parentClubsCountLabel: 'Kluby Rodzica:',
  childrenPerPlaceLabel: 'Dzieci na 1 miejsce:',
  placesUnit: 'miejsc',
  pupilsUnit: 'uczniów',

  fieldMetricsTitle: 'Zmiana pozostałych wskaźników w dzielnicy (Zieleń, Transport, Seniorzy)',
  fieldMetricsSubtitle:
    'Bezpośrednie przełożenie nowych parków, przystanków KMK, ścieżek DDR oraz klubów CAS na aktualne dane dzielnicy',
  greeneryCardTitle: 'Zieleń Miejska i Sport',
  greeneryPerCapitaLabel: 'Zieleń na mieszkańca:',
  totalParksLabel: 'Parki miejskie i kieszonkowe:',
  sportsObjectsLabel: 'Boiska i pływalnie szkolne:',

  mobilityCardTitle: 'Komunikacja KMK i Rower',
  kmkStopsTotalLabel: 'Przystanki KMK (aut. + tram.):',
  isochrone500mLabel: 'Zasięg dojścia 500 m (5–7 min):',
  bikeLanesLabel: 'Długość ścieżek rowerowych DDR:',
  prAndRacksLabel: 'Parkingi P+R / stojaki ZTP:',

  seniorCultureCardTitle: 'Seniorzy (65+) i Kultura',
  casCentersCountLabel: 'Centra Aktywności Seniora (CAS):',
  seniorsPerCasLabel: 'Seniorów na 1 placówkę CAS:',
  librariesAndCultureLabel: 'Biblioteki i domy kultury:',

  recommendationBannerTitle: 'Podsumowanie i wskazówki dla wybranej dzielnicy',
};

const EN_SIMULATOR: InvestorSimulatorLabels = {
  sectionBadge: 'Interactive "What-If" Simulator • Real-Time Recalculation',
  sectionTitle: 'District Infrastructure Expansion Simulator',
  sectionSubtitle:
    'Select a district and use the counters to add new nurseries, kindergartens, primary schools, pocket parks, KMK transit stops, or senior clubs (CAS). The simulator recalculates indicators in real time on the current state — see how the Quality of Life Index, 18-district ranking position, and current facility balances change.',

  selectDistrictLabel: 'Simulated district:',
  presetsLabel: 'Quick test packages:',
  presetFamily: 'Family & Kids Package',
  presetGreen: 'Green District Package',
  presetMobility: 'Better Transit Package',
  presetSenior: 'Senior & Culture Package',
  resetBtn: 'Reset counters',
  activeChangesBadge: (count) =>
    count === 0
      ? 'No changes (current baseline)'
      : `Total items added: +${count}`,

  leversPanelTitle: '1. Choose new facilities and infrastructure to add in the district',
  leversPanelSubtitle:
    'Use the "-" and "+" buttons or select a quick package above to test expanding the district',
  categoryFilterAll: 'All categories (14)',
  categories: {
    education: {
      title: 'Education & Family Care (0–14 yrs)',
      subtitle: 'Nurseries, kindergartens, primary schools, and Parent Clubs',
    },
    greenery: {
      title: 'Urban Greenery, Parks & Sports',
      subtitle: 'Pocket parks, Krakowian Gardens, city parks, and school sports',
    },
    mobility: {
      title: 'Public Transit (KMK) & Cycling',
      subtitle: 'Bus stops, tram stops, DDR bike lanes, and Park & Ride',
    },
    culture: {
      title: 'Senior Support (65+) & Culture',
      subtitle: 'Senior Activity Centers (CAS), libraries, and cultural centers',
    },
  },

  levers: {
    nurseries: {
      title: 'New nurseries / kids clubs (0–3 yrs)',
      subtitle: 'Expands childcare capacity for infants and toddlers',
      unitEffect: '+100 places / facility',
      currentBaselinePrefix: 'Current 0–3 places:',
    },
    kindergartens: {
      title: 'New kindergartens (4–6 yrs)',
      subtitle: 'Expands municipal and public preschool capacity',
      unitEffect: '+125 places / kindergarten',
      currentBaselinePrefix: 'Current 4–6 places:',
    },
    primarySchools: {
      title: 'New primary schools (7–14 yrs)',
      subtitle: 'Adds school capacity and lowers average class size',
      unitEffect: '+400 places / school',
      currentBaselinePrefix: 'Current 7–14 places:',
    },
    parentClubs: {
      title: 'Parent Clubs (support for families with kids 0–3)',
      subtitle: 'Local neighborhood hubs for workshops and parent integration',
      unitEffect: '+1 Parent Club',
      currentBaselinePrefix: 'Current clubs:',
    },
    pocketParks: {
      title: 'Pocket parks / Krakowian Gardens',
      subtitle: 'Neighborhood green spaces within a 5-minute walk',
      unitEffect: '+0.25 ha greenery / park',
      currentBaselinePrefix: 'Current pocket parks:',
    },
    cityParks: {
      title: 'City parks & large recreational squares',
      subtitle: 'Larger green areas improving microclimate and leisure',
      unitEffect: '+2.0 ha greenery / park',
      currentBaselinePrefix: 'Current city parks:',
    },
    schoolSports: {
      title: 'School sports fields & swimming pools',
      subtitle: 'Modern sports facilities for pupils and local residents',
      unitEffect: '+1 sports facility',
      currentBaselinePrefix: 'Current facilities:',
    },
    busStops: {
      title: 'KMK bus stops',
      subtitle: 'Improves 500 m walking access to bus feeder lines',
      unitEffect: '+1 bus stop',
      currentBaselinePrefix: 'Current bus stops:',
    },
    tramStops: {
      title: 'KMK tram stops',
      subtitle: 'Expands rapid rail transit access in the district',
      unitEffect: '+1 tram stop',
      currentBaselinePrefix: 'Current tram stops:',
    },
    bikeLanesKm: {
      title: 'Bicycle lanes & tracks (DDR)',
      subtitle: 'New kilometers of dedicated cycling infrastructure',
      unitEffect: '+1 km DDR bike lane',
      currentBaselinePrefix: 'Current DDR length:',
    },
    parkAndRide: {
      title: 'Park & Ride hubs & bike racks',
      subtitle: 'Interchange parking facilities with new ZTP bike racks',
      unitEffect: '+1 P+R & +15 racks',
      currentBaselinePrefix: 'Current P+R hubs:',
    },
    casCenters: {
      title: 'Senior Activity Centers (CAS 65+)',
      subtitle: 'Local integration, health, and activity clubs for seniors',
      unitEffect: '+1 CAS center',
      currentBaselinePrefix: 'Current CAS centers:',
    },
    libraries: {
      title: 'Krakow Public Library branches',
      subtitle: 'Neighborhood library branches and reading rooms',
      unitEffect: '+1 library branch',
      currentBaselinePrefix: 'Current branches:',
    },
    culturalCenters: {
      title: 'Community & cultural centers',
      subtitle: 'Municipal cultural institutions and local event venues',
      unitEffect: '+1 cultural center',
      currentBaselinePrefix: 'Current centers:',
    },
  },

  impactSectionBadge: 'Dynamic Real-Time Impact Preview (Before ➔ After)',
  impactSectionTitle: '2. What exactly will change in the district after adding these items?',
  impactSectionSubtitle:
    'All indicators below recalculate live based on the current demographic and infrastructure baseline of the district.',
  noChangesHint:
    'Increase any counter above or click one of the quick test packages to see how new investments improve the district scores.',

  overallIndexCardTitle: 'Overall Quality of Life Index',
  overallIndexCardSub: 'Composite score across all 8 pillars (0–100 pts scale)',
  rankingCardTitle: '18-District Ranking Position',
  rankingCardSub: 'District rank across all 18 districts of Krakow',
  rankImprovedBadge: (delta) => `Up by +${delta} pos.!`,
  rankUnchangedBadge: 'Rank unchanged',
  pointsUnit: 'pts',
  beforeLabel: 'Before:',
  afterLabel: 'After changes:',

  pillarsSectionTitle: 'Score changes across Quality of Life Pillars (0–100 pts)',
  pillarsSectionSubtitle: 'Exact impact of added facilities on each evaluation dimension',
  pillarNames: {
    education: 'Education & Childcare (0–14)',
    greenery: 'Greenery & Recreation',
    mobility: 'Mobility & Public Transit',
    culture: 'Culture & Seniors (CAS)',
    environment: 'Environment & Clean Air',
    demographic: 'Demographic Potential',
    safety: 'Public Safety',
    housing: 'Housing Affordability',
  },

  balancesSectionTitle: 'Impact on Current Childcare & School Places Balance (0–14 yrs)',
  balancesSectionSubtitle:
    'See how added nurseries, kindergartens, primary schools, and Parent Clubs improve current place availability in the district',
  balanceCards: {
    nurseryTitle: 'Nurseries & Clubs (0–3 yrs)',
    nurserySub: 'Toddler childcare places and Parent Clubs',
    kindergartenTitle: 'Kindergartens (4–6 yrs)',
    kindergartenSub: 'Preschool place availability in the district',
    schoolTitle: 'Primary Schools (7–14 yrs)',
    schoolSub: 'School capacity and average class size',
    totalEduTitle: 'Combined Places Balance (0–14 yrs)',
    totalEduSub: 'Total places across nurseries, kindergartens & schools',
  },
  placesLabel: 'Places capacity:',
  balance2028Label: 'Current balance:',
  coverageLabel: 'Demand coverage:',
  avgClassSizeLabel: 'Avg. class size:',
  parentClubsCountLabel: 'Parent Clubs:',
  childrenPerPlaceLabel: 'Children per 1 place:',
  placesUnit: 'places',
  pupilsUnit: 'pupils',

  fieldMetricsTitle: 'Changes in Other District Metrics (Greenery, Transit, Seniors)',
  fieldMetricsSubtitle:
    'Direct impact of new parks, KMK stops, DDR bike lanes, and CAS clubs on current district infrastructure indicators',
  greeneryCardTitle: 'Urban Greenery & Sports',
  greeneryPerCapitaLabel: 'Greenery per resident:',
  totalParksLabel: 'City & pocket parks:',
  sportsObjectsLabel: 'School sports & pools:',

  mobilityCardTitle: 'KMK Transit & Cycling',
  kmkStopsTotalLabel: 'KMK stops (bus + tram):',
  isochrone500mLabel: '500 m walking reach (5–7 min):',
  bikeLanesLabel: 'DDR bike lanes length:',
  prAndRacksLabel: 'P+R hubs / bike racks:',

  seniorCultureCardTitle: 'Seniors (65+) & Culture',
  casCentersCountLabel: 'Senior Activity Centers (CAS):',
  seniorsPerCasLabel: 'Seniors per 1 CAS center:',
  librariesAndCultureLabel: 'Libraries & cultural centers:',

  recommendationBannerTitle: 'Summary & Practical Tips for the Selected District',
};

const UA_SIMULATOR: InvestorSimulatorLabels = {
  sectionBadge: 'Інтерактивний Симулятор «Що-Якщо» • Перерахунок у Реальному Часі',
  sectionTitle: 'Симулятор Розбудови Інфраструктури Району',
  sectionSubtitle:
    'Оберіть район і додайте за допомогою лічильників нові ясла, дитсадки, школи, кишенькові парки, зупинки KMK або клуби сеньйорів CAS. Модуль перераховує показники в реальному часі на поточний стан — подивіться, як зміниться Індекс Якості Життя, місце в рейтингу 18 районів та поточний баланс місць.',

  selectDistrictLabel: 'Симульований район:',
  presetsLabel: 'Швидкі тестові пакети:',
  presetFamily: 'Пакет Родина та Діти',
  presetGreen: 'Пакет Зелений Район',
  presetMobility: 'Пакет Кращий Транспорт',
  presetSenior: 'Пакет Сеньйор і Культура',
  resetBtn: 'Скинути лічильники',
  activeChangesBadge: (count) =>
    count === 0
      ? 'Без змін (поточний стан)'
      : `Додано загалом: +${count}`,

  leversPanelTitle: '1. Оберіть нові об’єкти для додавання в районі',
  leversPanelSubtitle:
    'Використовуйте кнопки «-» та «+» або оберіть готовий пакет вище, щоб протестувати розбудову району',
  categoryFilterAll: 'Усі категорії (14)',
  categories: {
    education: {
      title: 'Освіта та Сімейна Опіка (0–14 років)',
      subtitle: 'Ясла, дитсадки, початкові школи та Клуби Батьків',
    },
    greenery: {
      title: 'Міська Зелень, Парки та Спорт',
      subtitle: 'Кишенькові парки, Сади Краків’ян, міські парки та стадіони',
    },
    mobility: {
      title: 'Громадський Транспорт (KMK) та Велосипед',
      subtitle: 'Автобусні й трамвайні зупинки, велодоріжки DDR та Park & Ride',
    },
    culture: {
      title: 'Підтримка Сеньйорів (65+) та Культура',
      subtitle: 'Центри Активності Сеньйорів (CAS), бібліотеки та будинки культури',
    },
  },

  levers: {
    nurseries: {
      title: 'Нові ясла / дитячі клуби (0–3 роки)',
      subtitle: 'Збільшує кількість місць догляду для найменших дітей',
      unitEffect: '+100 місць / заклад',
      currentBaselinePrefix: 'Зараз місць 0–3:',
    },
    kindergartens: {
      title: 'Нові дитсадки (4–6 років)',
      subtitle: 'Розширення мережі муніципальних і громадських дитсадків',
      unitEffect: '+125 місць / дитсадок',
      currentBaselinePrefix: 'Зараз місць 4–6:',
    },
    primarySchools: {
      title: 'Нові початкові школи (7–14 років)',
      subtitle: 'Нові шкільні місця та зменшення середнього розміру класів',
      unitEffect: '+400 місць / школа',
      currentBaselinePrefix: 'Зараз місць 7–14:',
    },
    parentClubs: {
      title: 'Клуби Батьків (підтримка родин із дітьми до 3 р.)',
      subtitle: 'Локальні центри зустрічей, майстер-класів та інтеграції батьків',
      unitEffect: '+1 Клуб Батьків',
      currentBaselinePrefix: 'Зараз клубів:',
    },
    pocketParks: {
      title: 'Кишенькові парки / Сади Краків’ян',
      subtitle: 'Затишні сквери поруч із житловою забудовою',
      unitEffect: '+0,25 га зелені / парк',
      currentBaselinePrefix: 'Зараз киш. парків:',
    },
    cityParks: {
      title: 'Міські парки та великі рекреаційні сквери',
      subtitle: 'Більші зелені зони для покращення мікроклімату та відпочинку',
      unitEffect: '+2,0 га зелені / парк',
      currentBaselinePrefix: 'Зараз міських парків:',
    },
    schoolSports: {
      title: 'Шкільні спортивні поля та басейни',
      subtitle: 'Сучасна спортивна база для учнів і мешканців району',
      unitEffect: '+1 спортивний об’єкт',
      currentBaselinePrefix: 'Зараз об’єктів:',
    },
    busStops: {
      title: 'Автобусні зупинки KMK',
      subtitle: 'Краща піша доступність (500 м) до автобусних ліній',
      unitEffect: '+1 автобусна зупинка',
      currentBaselinePrefix: 'Зараз авт. зупинок:',
    },
    tramStops: {
      title: 'Трамвайні зупинки KMK',
      subtitle: 'Розвиток швидкого рейкового транспорту в районі',
      unitEffect: '+1 трамвайна зупинка',
      currentBaselinePrefix: 'Зараз трамв. зупинок:',
    },
    bikeLanesKm: {
      title: 'Велосипедні доріжки (DDR)',
      subtitle: 'Нові кілометри безпечних велодоріжок і велосмуг',
      unitEffect: '+1 км доріжки DDR',
      currentBaselinePrefix: 'Зараз мережі DDR:',
    },
    parkAndRide: {
      title: 'Паркінги Park & Ride та велостійки',
      subtitle: 'Пересадочні вузли P+R разом із новими велостійками ZTP',
      unitEffect: '+1 P+R та +15 стійок',
      currentBaselinePrefix: 'Зараз паркінгів P+R:',
    },
    casCenters: {
      title: 'Центри Активності Сеньйорів (CAS 65+)',
      subtitle: 'Клуби інтеграції, активності та підтримки людей 65+',
      unitEffect: '+1 центр CAS',
      currentBaselinePrefix: 'Зараз центрів CAS:',
    },
    libraries: {
      title: 'Філії Бібліотеки Кракова',
      subtitle: 'Локальні бібліотеки, медіатеки та простори для читання',
      unitEffect: '+1 філія бібліотеки',
      currentBaselinePrefix: 'Зараз філій:',
    },
    culturalCenters: {
      title: 'Будинки та центри культури',
      subtitle: 'Міські заклади культури, гуртків та локальних подій',
      unitEffect: '+1 центр культури',
      currentBaselinePrefix: 'Зараз центрів:',
    },
  },

  impactSectionBadge: 'Динамічний Перегляд Ефектів у Реальному Часі (До ➔ Після)',
  impactSectionTitle: '2. Що саме зміниться в районі після впровадження змін?',
  impactSectionSubtitle:
    'Усі показники нижче перераховуються наживо для поточного демографічного та інфраструктурного стану району.',
  noChangesHint:
    'Збільште будь-який лічильник вище або натисніть один зі швидких тестових пакетів, щоб побачити, як нові об’єкти покращать показники району.',

  overallIndexCardTitle: 'Загальний Індекс Якості Життя',
  overallIndexCardSub: 'Середній бал за 8 стовпами якості життя (шкала 0–100 балів)',
  rankingCardTitle: 'Позиція в Рейтингу 18 Районів',
  rankingCardSub: 'Місце вибраного району на тлі всіх 18 районів Кракова',
  rankImprovedBadge: (delta) => `Підйом на +${delta} поз. вгору!`,
  rankUnchangedBadge: 'Позиція без змін',
  pointsUnit: 'бал.',
  beforeLabel: 'До:',
  afterLabel: 'Після змін:',

  pillarsSectionTitle: 'Зміна оцінок у стовпах Якості Життя (0–100 балів)',
  pillarsSectionSubtitle: 'Точний вплив доданих об’єктів на окремі категорії оцінки району',
  pillarNames: {
    education: 'Освіта та Опіка (0–14)',
    greenery: 'Зелень і Рекреація',
    mobility: 'Транспорт і Мобільність',
    culture: 'Культура та Сеньйори (CAS)',
    environment: 'Довкілля та Повітря',
    demographic: 'Демографічний Потенціал',
    safety: 'Безпека',
    housing: 'Цінова Доступність Житла',
  },

  balancesSectionTitle: 'Вплив на поточний баланс місць у закладах для дітей (0–14 років)',
  balancesSectionSubtitle:
    'Перевірте, як додані ясла, дитсадки, початкові школи та Клуби Батьків покращують поточну доступність місць у районі',
  balanceCards: {
    nurseryTitle: 'Ясла та Клуби (0–3 роки)',
    nurserySub: 'Місця догляду для малюків та Клуби Батьків',
    kindergartenTitle: 'Дитсадки (4–6 років)',
    kindergartenSub: 'Доступність місць у дитсадках району',
    schoolTitle: 'Початкові Школи (7–14 років)',
    schoolSub: 'Місткість шкіл та середній розмір класів',
    totalEduTitle: 'Сукупний Баланс Місць (0–14 років)',
    totalEduSub: 'Сума місць у яслах, дитсадках та школах',
  },
  placesLabel: 'Кількість місць:',
  balance2028Label: 'Баланс місць (зараз):',
  coverageLabel: 'Покриття потреб:',
  avgClassSizeLabel: 'У середньому в класі:',
  parentClubsCountLabel: 'Клуби Батьків:',
  childrenPerPlaceLabel: 'Дітей на 1 місце:',
  placesUnit: 'місць',
  pupilsUnit: 'учнів',

  fieldMetricsTitle: 'Зміна інших показників у районі (Зелень, Транспорт, Сеньйори)',
  fieldMetricsSubtitle:
    'Прямий вплив нових парків, зупинок KMK, велодоріжок DDR та клубів CAS на поточні дані району',
  greeneryCardTitle: 'Міська Зелень та Спорт',
  greeneryPerCapitaLabel: 'Зелень на мешканця:',
  totalParksLabel: 'Міські та кишенькові парки:',
  sportsObjectsLabel: 'Шкільні поля та басейни:',

  mobilityCardTitle: 'Транспорт KMK та Велосипед',
  kmkStopsTotalLabel: 'Зупинки KMK (авт. + трамв.):',
  isochrone500mLabel: 'Піша доступність 500 м (5–7 хв):',
  bikeLanesLabel: 'Довжина велодоріжок DDR:',
  prAndRacksLabel: 'Паркінги P+R / велостійки:',

  seniorCultureCardTitle: 'Сеньйори (65+) та Культура',
  casCentersCountLabel: 'Центри Активності Сеньйорів (CAS):',
  seniorsPerCasLabel: 'Сеньйорів на 1 заклад CAS:',
  librariesAndCultureLabel: 'Бібліотеки та будинки культури:',

  recommendationBannerTitle: 'Підсумок та практичні поради для обраного району',
};

export function getInvestorSimulatorLabels(language: Language): InvestorSimulatorLabels {
  if (language === 'en') return EN_SIMULATOR;
  if (language === 'ua') return UA_SIMULATOR;
  return PL_SIMULATOR;
}

export function getDynamicSimulatorRecommendation(
  impact: SimulatorImpactMetrics,
  language: Language = 'pl'
): string {
  const {
    totalAddedItemsCount,
    scores,
    nurseryBalanceBefore,
    nurseryBalanceAfter,
    kindergartenBalanceBefore,
    kindergartenBalanceAfter,
    schoolBalanceBefore,
    schoolBalanceAfter,
    avgClassSizeBefore,
    avgClassSizeAfter,
    parentClubsBefore,
    parentClubsAfter,
    greenM2PerCapitaBefore,
    greenM2PerCapitaAfter,
    parksCountBefore,
    parksCountAfter,
    sportsFacilitiesBefore,
    sportsFacilitiesAfter,
    kmkStopsBefore,
    kmkStopsAfter,
    isochroneBeforePct,
    isochroneAfterPct,
    bikeLanesKmBefore,
    bikeLanesKmAfter,
    parkAndRideBefore,
    parkAndRideAfter,
    casCountBefore,
    casCountAfter,
    seniorsPerCasBefore,
    seniorsPerCasAfter,
    librariesBefore,
    librariesAfter,
    culturalCentersBefore,
    culturalCentersAfter,
  } = impact;

  const formatSigned = (val: number) => (val >= 0 ? `+${val}` : `${val}`);

  if (language === 'en') {
    const needs: string[] = [];
    if (nurseryBalanceBefore < -50) {
      needs.push(`current shortage of nursery places (${nurseryBalanceBefore})`);
    }
    if (avgClassSizeBefore > 21) {
      needs.push(`crowded primary school classes (avg. ${avgClassSizeBefore.toFixed(1)} pupils)`);
    }
    if (greenM2PerCapitaBefore < 12) {
      needs.push(`low park greenery (${greenM2PerCapitaBefore.toFixed(1)} m²/resident)`);
    }
    if (isochroneBeforePct < 78) {
      needs.push(`transit walking gaps (${isochroneBeforePct.toFixed(1)}% within 500 m)`);
    }
    if (seniorsPerCasBefore > 3500) {
      needs.push(`high senior load per CAS club (${seniorsPerCasBefore} seniors/CAS)`);
    }

    const baseDiagnose =
      needs.length > 0
        ? `Main challenges in this district: ${needs.join(', ')}.`
        : `This district has a well-balanced infrastructure baseline across most categories.`;

    if (totalAddedItemsCount === 0) {
      return `${baseDiagnose} Use the counters above to test adding new facilities and see how the district's Quality of Life Index (${scores.before.weightedQualityOfLifeIndex.toFixed(1)} pts, rank #${scores.rankBefore}/18) improves in real time!`;
    }

    const changedEffects: string[] = [];
    if (nurseryBalanceAfter !== nurseryBalanceBefore) {
      changedEffects.push(
        `nursery balance improves from ${formatSigned(nurseryBalanceBefore)} to ${formatSigned(nurseryBalanceAfter)} places`
      );
    }
    if (kindergartenBalanceAfter !== kindergartenBalanceBefore) {
      changedEffects.push(
        `kindergarten balance improves from ${formatSigned(kindergartenBalanceBefore)} to ${formatSigned(kindergartenBalanceAfter)} places`
      );
    }
    if (schoolBalanceAfter !== schoolBalanceBefore) {
      changedEffects.push(
        `school places balance changes from ${formatSigned(schoolBalanceBefore)} to ${formatSigned(schoolBalanceAfter)} (avg. class size: ${avgClassSizeBefore.toFixed(1)} ➔ ${avgClassSizeAfter.toFixed(1)} pupils)`
      );
    }
    if (parentClubsAfter !== parentClubsBefore) {
      changedEffects.push(`Parent Clubs increase from ${parentClubsBefore} to ${parentClubsAfter}`);
    }
    if (parksCountAfter !== parksCountBefore) {
      changedEffects.push(
        `parks increase from ${parksCountBefore} to ${parksCountAfter} (${greenM2PerCapitaBefore.toFixed(1)} ➔ ${greenM2PerCapitaAfter.toFixed(1)} m²/resident)`
      );
    }
    if (sportsFacilitiesAfter !== sportsFacilitiesBefore) {
      changedEffects.push(
        `school sports facilities rise from ${sportsFacilitiesBefore} to ${sportsFacilitiesAfter}`
      );
    }
    if (kmkStopsAfter !== kmkStopsBefore || isochroneAfterPct !== isochroneBeforePct) {
      changedEffects.push(
        `500 m KMK transit access rises from ${isochroneBeforePct.toFixed(1)}% to ${isochroneAfterPct.toFixed(1)}% (${kmkStopsBefore} ➔ ${kmkStopsAfter} stops)`
      );
    }
    if (bikeLanesKmAfter !== bikeLanesKmBefore) {
      changedEffects.push(
        `DDR bike lanes expand from ${bikeLanesKmBefore.toFixed(1)} to ${bikeLanesKmAfter.toFixed(1)} km`
      );
    }
    if (parkAndRideAfter !== parkAndRideBefore) {
      changedEffects.push(`P+R hubs increase from ${parkAndRideBefore} to ${parkAndRideAfter}`);
    }
    if (casCountAfter !== casCountBefore) {
      changedEffects.push(
        `CAS senior clubs expand from ${casCountBefore} to ${casCountAfter} (${seniorsPerCasBefore} ➔ ${seniorsPerCasAfter} seniors/CAS)`
      );
    }
    if (
      librariesAfter + culturalCentersAfter !==
      librariesBefore + culturalCentersBefore
    ) {
      changedEffects.push(
        `libraries & cultural centers grow from ${librariesBefore + culturalCentersBefore} to ${librariesAfter + culturalCentersAfter}`
      );
    }

    const effectsSentence =
      changedEffects.length > 0 ? ` Key improvements: ${changedEffects.join('; ')}.` : '';

    return `${baseDiagnose} With your +${totalAddedItemsCount} added items, the overall Quality of Life Index rises from ${scores.before.weightedQualityOfLifeIndex.toFixed(1)} to ${scores.after.weightedQualityOfLifeIndex.toFixed(1)} pts (+${scores.deltas.weightedQualityOfLifeIndex.toFixed(1)} pts, rank #${scores.rankBefore} ➔ #${scores.rankAfter}/18).${effectsSentence}`;
  }

  if (language === 'ua') {
    const needs: string[] = [];
    if (nurseryBalanceBefore < -50) {
      needs.push(`поточний дефіцит місць у яслах (${nurseryBalanceBefore})`);
    }
    if (avgClassSizeBefore > 21) {
      needs.push(`великі класи у школах (сер. ${avgClassSizeBefore.toFixed(1)} учнів)`);
    }
    if (greenM2PerCapitaBefore < 12) {
      needs.push(`невелика площа парків (${greenM2PerCapitaBefore.toFixed(1)} м²/мешк.)`);
    }
    if (isochroneBeforePct < 78) {
      needs.push(`нижча піша доступність транспорту (${isochroneBeforePct.toFixed(1)}% у радіусі 500 м)`);
    }
    if (seniorsPerCasBefore > 3500) {
      needs.push(`високе навантаження на центри CAS (${seniorsPerCasBefore} сеньйорів/CAS)`);
    }

    const baseDiagnose =
      needs.length > 0
        ? `Головні потреби цього району: ${needs.join(', ')}.`
        : `Цей район має добре збалансовану інфраструктуру у більшості категорій.`;

    if (totalAddedItemsCount === 0) {
      return `${baseDiagnose} Додайте нові об’єкти за допомогою лічильників вище, щоб у реальному часі перевірити, як зросте Індекс Якості Життя (${scores.before.weightedQualityOfLifeIndex.toFixed(1)} бал., місце #${scores.rankBefore}/18)!`;
    }

    const changedEffects: string[] = [];
    if (nurseryBalanceAfter !== nurseryBalanceBefore) {
      changedEffects.push(
        `баланс ясел змінюється з ${formatSigned(nurseryBalanceBefore)} до ${formatSigned(nurseryBalanceAfter)} місць`
      );
    }
    if (kindergartenBalanceAfter !== kindergartenBalanceBefore) {
      changedEffects.push(
        `баланс дитсадків змінюється з ${formatSigned(kindergartenBalanceBefore)} до ${formatSigned(kindergartenBalanceAfter)} місць`
      );
    }
    if (schoolBalanceAfter !== schoolBalanceBefore) {
      changedEffects.push(
        `баланс шкіл змінюється з ${formatSigned(schoolBalanceBefore)} до ${formatSigned(schoolBalanceAfter)} (сер. клас: ${avgClassSizeBefore.toFixed(1)} ➔ ${avgClassSizeAfter.toFixed(1)} учнів)`
      );
    }
    if (parentClubsAfter !== parentClubsBefore) {
      changedEffects.push(`Клуби Батьків зростають з ${parentClubsBefore} до ${parentClubsAfter}`);
    }
    if (parksCountAfter !== parksCountBefore) {
      changedEffects.push(
        `кількість парків зростає з ${parksCountBefore} до ${parksCountAfter} (${greenM2PerCapitaBefore.toFixed(1)} ➔ ${greenM2PerCapitaAfter.toFixed(1)} м²/мешк.)`
      );
    }
    if (sportsFacilitiesAfter !== sportsFacilitiesBefore) {
      changedEffects.push(
        `шкільні спорт. об’єкти зростають з ${sportsFacilitiesBefore} до ${sportsFacilitiesAfter}`
      );
    }
    if (kmkStopsAfter !== kmkStopsBefore || isochroneAfterPct !== isochroneBeforePct) {
      changedEffects.push(
        `піша доступність KMK 500 м зростає з ${isochroneBeforePct.toFixed(1)}% до ${isochroneAfterPct.toFixed(1)}% (${kmkStopsBefore} ➔ ${kmkStopsAfter} зупинок)`
      );
    }
    if (bikeLanesKmAfter !== bikeLanesKmBefore) {
      changedEffects.push(
        `мережа велодоріжок DDR зростає з ${bikeLanesKmBefore.toFixed(1)} до ${bikeLanesKmAfter.toFixed(1)} км`
      );
    }
    if (parkAndRideAfter !== parkAndRideBefore) {
      changedEffects.push(`паркінги P+R зростають з ${parkAndRideBefore} до ${parkAndRideAfter}`);
    }
    if (casCountAfter !== casCountBefore) {
      changedEffects.push(
        `центри CAS зростають з ${casCountBefore} до ${casCountAfter} (${seniorsPerCasBefore} ➔ ${seniorsPerCasAfter} сеньйорів/CAS)`
      );
    }
    if (
      librariesAfter + culturalCentersAfter !==
      librariesBefore + culturalCentersBefore
    ) {
      changedEffects.push(
        `бібліотеки та доми культури зростають з ${librariesBefore + culturalCentersBefore} до ${librariesAfter + culturalCentersAfter}`
      );
    }

    const effectsSentence =
      changedEffects.length > 0 ? ` Ключові зміни: ${changedEffects.join('; ')}.` : '';

    return `${baseDiagnose} Завдяки обраним змінам (+${totalAddedItemsCount} об’єктів) загальний Індекс Якості Життя зростає з ${scores.before.weightedQualityOfLifeIndex.toFixed(1)} до ${scores.after.weightedQualityOfLifeIndex.toFixed(1)} бал. (+${scores.deltas.weightedQualityOfLifeIndex.toFixed(1)} бал., позиція в рейтингу #${scores.rankBefore} ➔ #${scores.rankAfter}/18).${effectsSentence}`;
  }

  // Polish (Default)
  const needs: string[] = [];
  if (nurseryBalanceBefore < -50) {
    needs.push(`bieżący niedobór miejsc w żłobkach (${nurseryBalanceBefore} miejsc)`);
  }
  if (avgClassSizeBefore > 21) {
    needs.push(`duże zagęszczenie klas w szkołach (śr. ${avgClassSizeBefore.toFixed(1)} uczniów)`);
  }
  if (greenM2PerCapitaBefore < 12) {
    needs.push(`mniejsza ilość zieleni parkowej (${greenM2PerCapitaBefore.toFixed(1)} m²/os.)`);
  }
  if (isochroneBeforePct < 78) {
    needs.push(`słabszy zasięg dojścia do przystanków KMK (${isochroneBeforePct.toFixed(1)}% w 500 m)`);
  }
  if (seniorsPerCasBefore > 3500) {
    needs.push(`duża liczba seniorów na jeden klub CAS (${seniorsPerCasBefore} os./CAS)`);
  }

  const baseDiagnose =
    needs.length > 0
      ? `Główne potrzeby w tej dzielnicy to: ${needs.join(', ')}.`
      : `Dzielnica ma dobrze rozwiniętą bazę w większości kategorii.`;

  if (totalAddedItemsCount === 0) {
    return `${baseDiagnose} Zwiększ wybrane liczniki powyżej, aby w czasie rzeczywistym sprawdzić, jak nowe placówki, parki czy przystanki podniosą Indeks Jakości Życia dzielnicy (obecnie ${scores.before.weightedQualityOfLifeIndex.toFixed(1)} pkt, miejsce #${scores.rankBefore}/18 w Krakowie)!`;
  }

  const changedEffects: string[] = [];
  if (nurseryBalanceAfter !== nurseryBalanceBefore) {
    changedEffects.push(
      `bilans miejsc w żłobkach poprawia się z ${formatSigned(nurseryBalanceBefore)} do ${formatSigned(nurseryBalanceAfter)}`
    );
  }
  if (kindergartenBalanceAfter !== kindergartenBalanceBefore) {
    changedEffects.push(
      `bilans w przedszkolach zmienia się z ${formatSigned(kindergartenBalanceBefore)} do ${formatSigned(kindergartenBalanceAfter)}`
    );
  }
  if (schoolBalanceAfter !== schoolBalanceBefore) {
    changedEffects.push(
      `bilans w szkołach podstawowych rośnie z ${formatSigned(schoolBalanceBefore)} do ${formatSigned(schoolBalanceAfter)} (śr. klasa: ${avgClassSizeBefore.toFixed(1)} ➔ ${avgClassSizeAfter.toFixed(1)} uczniów)`
    );
  }
  if (parentClubsAfter !== parentClubsBefore) {
    changedEffects.push(`liczba Klubów Rodzica rośnie z ${parentClubsBefore} do ${parentClubsAfter}`);
  }
  if (parksCountAfter !== parksCountBefore) {
    changedEffects.push(
      `liczba parków rośnie z ${parksCountBefore} do ${parksCountAfter} (zieleń: ${greenM2PerCapitaBefore.toFixed(1)} ➔ ${greenM2PerCapitaAfter.toFixed(1)} m²/os.)`
    );
  }
  if (sportsFacilitiesAfter !== sportsFacilitiesBefore) {
    changedEffects.push(
      `baza boisk i pływalni szkolnych rośnie z ${sportsFacilitiesBefore} do ${sportsFacilitiesAfter}`
    );
  }
  if (kmkStopsAfter !== kmkStopsBefore || isochroneAfterPct !== isochroneBeforePct) {
    changedEffects.push(
      `zasięg dojścia 500 m do KMK rośnie z ${isochroneBeforePct.toFixed(1)}% do ${isochroneAfterPct.toFixed(1)}% (przystanki: ${kmkStopsBefore} ➔ ${kmkStopsAfter})`
    );
  }
  if (bikeLanesKmAfter !== bikeLanesKmBefore) {
    changedEffects.push(
      `długość ścieżek rowerowych DDR rośnie z ${bikeLanesKmBefore.toFixed(1)} do ${bikeLanesKmAfter.toFixed(1)} km`
    );
  }
  if (parkAndRideAfter !== parkAndRideBefore) {
    changedEffects.push(`węzły P+R rosną z ${parkAndRideBefore} do ${parkAndRideAfter}`);
  }
  if (casCountAfter !== casCountBefore) {
    changedEffects.push(
      `liczba klubów CAS rośnie z ${casCountBefore} do ${casCountAfter} (${seniorsPerCasBefore} ➔ ${seniorsPerCasAfter} seniorów/CAS)`
    );
  }
  if (
    librariesAfter + culturalCentersAfter !==
    librariesBefore + culturalCentersBefore
  ) {
    changedEffects.push(
      `biblioteki i domy kultury rosną z ${librariesBefore + culturalCentersBefore} do ${librariesAfter + culturalCentersAfter}`
    );
  }

  const effectsSentence =
    changedEffects.length > 0 ? ` Efekty wybranych inwestycji: ${changedEffects.join('; ')}.` : '';

  return `${baseDiagnose} Po wprowadzeniu wybranych zmian (+${totalAddedItemsCount} nowych elementów) łączny Indeks Jakości Życia rośnie z ${scores.before.weightedQualityOfLifeIndex.toFixed(1)} do ${scores.after.weightedQualityOfLifeIndex.toFixed(1)} pkt (+${scores.deltas.weightedQualityOfLifeIndex.toFixed(1)} pkt, pozycja w rankingu: #${scores.rankBefore} ➔ #${scores.rankAfter}/18).${effectsSentence}`;
}
