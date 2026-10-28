import type { Language } from '../types';
import type { OvertourismAlternativeDto } from '../../types/contracts';

// Pluralization & Grammar Helpers (PL, UA, EN)
export function formatStopsCountLabel(count: number, language: Language): string {
  if (language === 'en') {
    return count === 1 ? 'stop on route' : 'stops on route';
  }
  if (language === 'ua') {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return 'локація на маршруті';
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'локації на маршруті';
    return 'локацій на маршруті';
  }
  // Polish
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (count === 1) return 'punkt na trasie';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'punkty na trasie';
  return 'punktów na trasie';
}

export function formatRouteSubtitle(hours: number, count: number, language: Language): string {
  if (language === 'en') {
    return `Route for ${hours}h: ${count} ${count === 1 ? 'stop' : 'stops'}.`;
  }
  if (language === 'ua') {
    const mod10 = count % 10;
    const mod100 = count % 100;
    const stopWord =
      mod10 === 1 && mod100 !== 11
        ? 'локація для огляду'
        : mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)
        ? 'локації для огляду'
        : 'локацій для огляду';
    return `Маршрут на ${hours}г: ${count} ${stopWord}.`;
  }
  // Polish
  const mod10 = count % 10;
  const mod100 = count % 100;
  const stopWord =
    count === 1
      ? 'punkt zwiedzania'
      : mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)
      ? 'punkty zwiedzania'
      : 'punktów zwiedzania';
  return `Trasa na ${hours}h: ${count} ${stopWord}.`;
}

export function formatAttractionsCountLabel(count: number, language: Language): string {
  if (language === 'en') {
    return count === 1 ? 'attraction' : 'attractions';
  }
  if (language === 'ua') {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return 'локація';
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'локації';
    return 'локацій';
  }
  // Polish
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (count === 1) return 'atrakcja';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'atrakcje';
  return 'atrakcji';
}

export const TOURISM_I18N = {
  pl: {
    badge: 'Kraków360 Odkrywanie & Turystyka',
    officialDataBadge: 'Oficjalne Dane UMK & MOT 2024',
    titleLead: 'Odkrywaj Kraków mądrze:',
    titleAccent: 'inteligentny planer tras i zrównoważona turystyka.',
    subtitle:
      'Spersonalizowane trasy zwiedzania, wskaźniki natężenia ruchu turystycznego, bezpośredni dojazd z Dworca Głównego do 18 dzielnic oraz unikalny moduł alternatyw dla zatłoczonych miejsc.',
    howItWorksButton: 'Jak to działa? (Metodologia działania)',

    // Header & Hero Navigation
    header: {
      navPlanner: 'Generator Wycieczki',
      navOvertourism: 'Zejdź z utartego szlaku',
      navPassports: 'Paszporty Turystyczne',
    },

    // Inbound Markets Section (UMK/MOT)
    markets: {
      title: 'Struktura Turystyki Zagranicznej',
      subtitle: 'Główne rynki przyjazdowe turystów zagranicznych w Krakowie',
      totalForeign: 'Łącznie rynki zagraniczne: 3.15 mln gości',
      leaderBadge: 'Lider',
      countries: {
        'Wielka Brytania': 'Wielka Brytania',
        'Niemcy': 'Niemcy',
        'W\u0142ochy': 'Włochy',
        'Stany Zjednoczone': 'Stany Zjednoczone',
        'Francja': 'Francja',
        'Hiszpania': 'Hiszpania',
      } as Record<string, string>,
    },

    // Capabilities Grid (Inside expandable drawer)
    capabilities: {
      card1Title: 'Inteligentny Planer Tras & Haversine',
      card1Desc:
        'Algorytm syntezy tras wylicza realne czasy przejścia z formuły ortodromy Haversine\'a na koordynatach WGS84 (prędkość 4.5 km/h, współczynnik krętości ulic 1.25) i dynamicznie dopasowuje punkty do Twojego budżetu czasowego (2h, 4h, 6h, 8h+) oraz profilu tematycznego.',
      card2Title: 'Zrównoważona Turystyka & Overtourism',
      card2Desc:
        'Aż 82% ruchu turystycznego kumuluje się w obrębie Starego Miasta i Kazimierza. Moduł analizuje natężenie ruchu i rekomenduje spokojniejsze, autentyczne odpowiedniki, pomagając chronić historyczne serce Krakowa przed przeciążeniem.',
      card3Title: 'Paszporty 18 Dzielnic & KMK',
      card3Desc:
        'Oficjalne dane przewozowe ZTP i komunikacji miejskiej: bezpośrednie linie tramwajowe i autobusowe z Dworca Głównego, realne średnie czasy dojazdu w minutach oraz audytowane atrakcje w każdej z 18 jednostek samorządowych Krakowa.',
    },

    // Telemetry strip (MOT Report)
    telemetry: {
      annualVisitors: '14.72 mln',
      annualVisitorsLabel: 'Roczna liczba odwiedzających',
      annualVisitorsSub: 'Raport UMK & MOT 2024',
      stayDuration: '2.8 dnia',
      stayDurationLabel: 'Średnia długość pobytu',
      stayDurationSub: 'Średni czas wizyty w mieście',
      economicImpact: '11.8 mld zł',
      economicImpactLabel: 'Szacunkowe wydatki gości',
      economicImpactSub: 'Wpływ na gospodarkę i usługi Krakowa',
      curatedSites: '110 obiektów',
      curatedSitesLabel: 'Audytowanych atrakcji miejskich',
      curatedSitesSub: 'We wszystkich 18 dzielnicach Krakowa',
    },

    // Navigation sections
    sections: {
      plannerTitle: 'Generator Wycieczki',
      plannerSubtitle: 'Wybierz ile masz czasu, profil wycieczki oraz dzielnicę – wygenerujemy optymalny harmonogram z czasami przejścia.',
      overtourismTitle: 'Zejdź z utartego szlaku',
      overtourismSubtitle: 'Zamiast stać w kolejkach w zatłoczonych miejscach, poznaj ich fascynujące, spokojniejsze odpowiedniki.',
      passportsTitle: 'Paszporty Turystyczne',
      passportsSubtitle: 'Sprawdź jak szybko dojedziesz z Dworca Głównego KMK i co warto zobaczyć w każdej z 18 dzielnic.',
    },

    // Section 1: Trip Planner
    planner: {
      timeBudgetLabel: '1. Ile masz czasu?',
      timeSubHint: '(Wybierz budżet czasowy spaceru)',
      timeBudgets: {
        h2Label: '2 godziny',
        h2Sub: 'Ekspres',
        h4Label: '4 godziny',
        h4Sub: 'Pół dnia',
        h6Label: '6 godzin',
        h6Sub: 'Głębokie poznanie',
        h8Label: 'Cały dzień',
        h8Sub: '8h+ szlak',
      },
      profileLabel: '2. Jaki profil wycieczki preferujesz?',
      themeSubHint: '(Dopasuj charakter zwiedzanych obiektów)',
      themes: {
        all: 'Dowolny profil',
        highlights: 'Klasyka & UNESCO',
        green: 'Zielony Relaks',
        art: 'Sztuka & Bohema',
        secrets: 'Sekrety & Kopce',
        revolution: 'Nowa Huta & Socrealizm',
      },
      districtLabel: '3. W której dzielnicy?',
      districtSubHint: '(Wybierz punkt startowy lub zwiedzaj całe miasto)',
      allDistricts: 'Wszystkie dzielnice',
      allDistrictsDesc: 'Trasa otwarta w skali całego Krakowa',
      districtPriorityPrefix: 'Priorytet dla obiektów z',
      districtPrioritySuffix: 'oraz sąsiednich jednostek',
      calculatedDuration: 'Szacowany czas wycieczki:',
      hoursSuffix: 'godz.',
      timelineTitle: 'Harmonogram krok po kroku',
      stepLabel: 'Etap',
      visitDuration: 'Czas zwiedzania:',
      minutesLabel: 'min',
      generatedTitle: 'Proponowany Harmonogram Wycieczki:',
      summaryVisiting: 'Zwiedzanie:',
      summaryWalking: 'Przejścia:',
      summaryTotal: 'Łącznie:',
      totalDuration: 'Łączny czas:',
      totalDistance: 'Dystans pieszy:',
      minutesShort: 'min',
      kmShort: 'km',
      stepNumber: 'KROK',
      directTransitHint: 'Dojazd z Dworca Gł.:',
      transitWalking: 'Spacer pieszy',
      transitByKMK: 'Przejazd komunikacją miejską KMK:',
      walkToNext: 'Przejście do kolejnego punktu:',
      noResults: 'Brak gotowej trasy dla wybranej kombinacji filtrów. Wybierz inną dzielnicę lub czas.',
      noItineraryFound: 'Brak gotowej trasy dla wybranej kombinacji filtrów. Wybierz inną dzielnicę lub profil.',
    },

    // Section 2: Overtourism Compass
    overtourism: {
      reliefBannerTitle: 'Pomóż chronić historyczne serce Krakowa przed przeciążeniem',
      reliefBannerDesc:
        'Aż 82% ruchu turystycznego kumuluje się w obrębie Starego Miasta i Kazimierza. Odkrywając zróżnicowane dzielnice, zyskujesz spokojniejszy wypoczynek i wspierasz lokalnych przedsiębiorców w całym Krakowie.',
      crowdedLabel: 'Zatłoczony punkt',
      peacefulLabel: 'Alternatywa',
      whySwitchLabel: 'Dlaczego warto wybrać alternatywę?',
      crowdLevelLabel: 'Wskaźnik natężenia ruchu turystycznego',
      cityReliefBadge: 'Odciążenie Śródmieścia Krakowa',
      scenarioPrefix: 'Alternatywa turystyczna',
      sustainableChoice: 'Zrównoważony wybór',
      crowdedFriction: 'Częste kolejki biletowe, ścisk na dziedzińcach i wysoki hałas',
      peacefulPerk: 'Swoboda, panoramiczne przestrzenie i autentyczny lokalny klimat',
      chooseAlternative: 'Wybierz spokojniejszy odpowiednik',
      perks: {
        alt_wawel_vs_krakus: ['Darmowy wstęp bez biletów', 'Panorama 360° Krakowa i Tatr', 'Magiczny zachód słońca'],
        alt_rynek_vs_plac_centralny: ['Monumentalny socrealizm', 'Cisza i przestrzeń bez tłoku', 'Zielona Aleja Róż'],
        alt_kazimierz_vs_bednarski: ['Kładka Bernatka w 10 min', 'Romantyczny dawny kamieniołom', 'Cisza z dala od hałasu barów'],
        alt_planty_vs_lasek_wolski: ['400 ha prawdziwego lasu', 'Jurajskie wąwozy & śpiew ptaków', 'Widok z Kopca Piłsudskiego'],
        alt_schindler_vs_matejko: ['Brak stania w kolejce po bilety', 'Zabytkowy modrzewiowy dworek', 'Cichy park nad rzeką Dłubnią'],
      } as Record<string, string[]>,
    },

    // Section 3: District Passports
    passports: {
      selectDistrict: 'Wybierz dzielnicę Krakowa:',
      transitDirectHeader: 'Dojazd z Dworca Głównego (KMK / ZTP Kraków)',
      avgTransitTime: 'Średni czas dojazdu KMK',
      transitNetwork: 'Dostępność KMK',
      tramsAndBuses: 'Tramwaje & Autobusy',
      distanceFromStation: 'Dystans od Dworca',
      districtHighlights: 'Wyróżnione obiekty w dzielnicy:',
      visitTime: 'Czas:',
      travelFromStationTitle: 'Komunikacja Miejska z Dworca Głównego (KMK / ZTP):',
      travelTime: 'Średni czas dojazdu:',
      directLines: 'Bezpośrednie linie:',
      distanceKm: 'Odległość w linii prostej:',
      attractionsCount: 'Wyróżnione atrakcje w dzielnicy:',
      topAttractionsTitle: 'Najważniejsze obiekty do odkrycia:',
      noAttractionsYet: 'Dzielnica o charakterze rezydencjalno-przyrodniczym. Doskonała baza na spokojne spacery.',
      unescoSiteBadge: 'Obiekt UNESCO',
      visitTimeLabel: 'Średni czas:',
    },

    // Crowd indicators
    crowd: {
      PEAK: { label: 'Skrajne tłumy', color: 'text-rose-700 bg-rose-50 border-rose-200' },
      VERY_HIGH: { label: 'Bardzo tłoczno', color: 'text-amber-700 bg-amber-50 border-amber-200' },
      HIGH: { label: 'Wysokie natężenie', color: 'text-orange-700 bg-orange-50 border-orange-200' },
      MODERATE: { label: 'Umiarkowany ruch', color: 'text-blue-700 bg-blue-50 border-blue-200' },
      LOW: { label: 'Spokojnie', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
      PEACEFUL: { label: 'Oaza spokoju / Gem', color: 'text-teal-700 bg-teal-50 border-teal-200' },
    },

    // Categories
    categories: {
      HISTORIC_HERITAGE: 'Zabytki i Historia',
      CULTURE_ART: 'Sztuka i Kultura',
      GREEN_NATURE: 'Natura i Parki',
      ACTIVE_SPORT: 'Rekreacja i Sport',
      VIEWPOINT: 'Punkty Widokowe i Panoramy',
      MODERN_EXPERIENCE: 'Architektura i Doświadczenia',
    },
  },

  en: {
    badge: 'Krakow360 Discovery & Tourism',
    officialDataBadge: 'Official City Hall & MOT 2024 Data',
    titleLead: 'Discover Krakow smartly:',
    titleAccent: 'intelligent trip planner & sustainable tourism.',
    subtitle:
      'Personalized itineraries, objective crowd indexes, direct transit telemetry from Main Station to all 18 districts, and overtourism relief alternatives.',
    howItWorksButton: 'How it works? (Operational Methodology)',

    header: {
      navPlanner: 'Trip Planner',
      navOvertourism: 'Off the Beaten Path',
      navPassports: 'District Passports',
    },

    markets: {
      title: 'Foreign Tourism Structure',
      subtitle: 'Top international inbound tourism markets in Krakow',
      totalForeign: 'Total foreign markets: 3.15M visitors',
      leaderBadge: 'Leader',
      countries: {
        'Wielka Brytania': 'United Kingdom',
        'Niemcy': 'Germany',
        'W\u0142ochy': 'Italy',
        'Stany Zjednoczone': 'United States',
        'Francja': 'France',
        'Hiszpania': 'Spain',
      } as Record<string, string>,
    },

    capabilities: {
      card1Title: 'Smart Route Planner & Haversine',
      card1Desc:
        'Route synthesis algorithm computes real walking durations using Haversine formula on WGS84 coordinates (4.5 km/h walking speed, 1.25 street detour coefficient) and dynamically fits sites to your time budget (2h, 4h, 6h, 8h+) and theme.',
      card2Title: 'Sustainable Tourism & Overtourism',
      card2Desc:
        'Up to 82% of tourist footfall concentrates in the Old Town and Kazimierz. The module evaluates crowd pressure and recommends calmer, authentic counterparts, safeguarding historic Krakow from congestion.',
      card3Title: '18 District Passports & Transit',
      card3Desc:
        'Public transport telemetry from Krakow Transit (ZTP): direct tram and bus connections from Main Railway Station, travel durations in minutes, and curated highlights across all 18 districts.',
    },

    telemetry: {
      annualVisitors: '14.72 M',
      annualVisitorsLabel: 'Annual visitors',
      annualVisitorsSub: 'Official UMK & MOT report',
      stayDuration: '2.8 days',
      stayDurationLabel: 'Average length of stay',
      stayDurationSub: 'Average tourist visit duration',
      economicImpact: '11.8B PLN',
      economicImpactLabel: 'Estimated tourist spend',
      economicImpactSub: 'Contribution to municipal economy & services',
      curatedSites: '110 sites',
      curatedSitesLabel: 'Audited exploration sites',
      curatedSitesSub: 'Across all 18 administrative districts',
    },

    sections: {
      plannerTitle: 'Trip Planner',
      plannerSubtitle: 'Select your time budget, thematic interest, and district – we will synthesize an optimized itinerary with walking durations.',
      overtourismTitle: 'Off the Beaten Path',
      overtourismSubtitle: 'Skip overcrowded lines and discover serene, authentic counterparts across Krakow.',
      passportsTitle: 'District Passports',
      passportsSubtitle: 'Check direct transit connections from Main Station and explore highlighted cultural and green gems.',
    },

    planner: {
      timeBudgetLabel: '1. How much time do you have?',
      timeSubHint: '(Select walking time budget)',
      timeBudgets: {
        h2Label: '2 hours',
        h2Sub: 'Express',
        h4Label: '4 hours',
        h4Sub: 'Half day',
        h6Label: '6 hours',
        h6Sub: 'Deep exploration',
        h8Label: 'Full day',
        h8Sub: '8h+ trail',
      },
      profileLabel: '2. Which experience do you prefer?',
      themeSubHint: '(Match attraction atmosphere)',
      themes: {
        all: 'All Themes',
        highlights: 'Classics & UNESCO',
        green: 'Green Relaxation',
        art: 'Art & Bohemian',
        secrets: 'Secrets & Mounds',
        revolution: 'Nowa Huta & Architecture',
      },
      districtLabel: '3. In which district?',
      districtSubHint: '(Select starting hub or explore the entire city)',
      allDistricts: 'All districts',
      allDistrictsDesc: 'City-wide open exploration',
      districtPriorityPrefix: 'Priority for attractions in',
      districtPrioritySuffix: 'and neighboring districts',
      calculatedDuration: 'Estimated trip duration:',
      hoursSuffix: 'hrs',
      timelineTitle: 'Step-by-step itinerary',
      stepLabel: 'Stop',
      visitDuration: 'Visit time:',
      minutesLabel: 'min',
      generatedTitle: 'Proposed Itinerary Schedule:',
      summaryVisiting: 'Sightseeing:',
      summaryWalking: 'Walking:',
      summaryTotal: 'Total:',
      totalDuration: 'Total duration:',
      totalDistance: 'Walking distance:',
      minutesShort: 'min',
      kmShort: 'km',
      stepNumber: 'STEP',
      directTransitHint: 'From Main Station:',
      transitWalking: 'Walking',
      transitByKMK: 'KMK public transit ride:',
      walkToNext: 'Walking to next stop:',
      noResults: 'No pre-calculated route found for this exact combination. Please adjust filters.',
      noItineraryFound: 'No itinerary found for this combination. Please adjust filters.',
    },

    overtourism: {
      reliefBannerTitle: 'Help protect Krakow historic core from overtourism',
      reliefBannerDesc:
        'Up to 82% of all tourist traffic concentrates in the Old Town and Kazimierz. By discovering diverse districts, you enjoy serene leisure while supporting local businesses across the city.',
      crowdedLabel: 'Crowded site',
      peacefulLabel: 'Alternative',
      whySwitchLabel: 'Why choose the alternative?',
      crowdLevelLabel: 'Tourist crowd level indicator',
      cityReliefBadge: 'Old Town Congestion Relief',
      scenarioPrefix: 'Tourism alternative',
      sustainableChoice: 'Sustainable choice',
      crowdedFriction: 'Frequent ticket queues, packed courtyards, and high noise',
      peacefulPerk: 'Open spaces, panoramic views, and authentic local atmosphere',
      chooseAlternative: 'Choose the peaceful counterpart',
      perks: {
        alt_wawel_vs_krakus: ['Free entry, no tickets', '360° Krakow & Tatra panorama', 'Magical sunset'],
        alt_rynek_vs_plac_centralny: ['Monumental architecture', 'Peace and space without crowds', 'Green Avenue of Roses'],
        alt_kazimierz_vs_bednarski: ['Bernatka footbridge in 10 min', 'Romantic former quarry', 'Calm away from noisy bars'],
        alt_planty_vs_lasek_wolski: ['400 hectares of natural forest', 'Jurassic ravines & birdsong', 'View from Pilsudski Mound'],
        alt_schindler_vs_matejko: ['Skip museum ticket lines', 'Historic wooden manor house', 'Quiet riverside park on Dlubnia'],
      } as Record<string, string[]>,
    },

    passports: {
      selectDistrict: 'Select Krakow district:',
      transitDirectHeader: 'Public Transit from Main Station (KMK / ZTP Krakow)',
      avgTransitTime: 'Average KMK transit duration',
      transitNetwork: 'KMK Transit Network',
      tramsAndBuses: 'Trams & Buses',
      distanceFromStation: 'Distance from Station',
      districtHighlights: 'Highlighted sites in district:',
      visitTime: 'Time:',
      travelFromStationTitle: 'Public Transit from Main Station (KMK / ZTP):',
      travelTime: 'Average travel time:',
      directLines: 'Direct transit lines:',
      distanceKm: 'Distance from station:',
      attractionsCount: 'Highlighted attractions in district:',
      topAttractionsTitle: 'Key sites to discover:',
      noAttractionsYet: 'Residential and natural district. Ideal starting point for quiet walks.',
      unescoSiteBadge: 'UNESCO Site',
      visitTimeLabel: 'Estimated visit:',
    },

    crowd: {
      PEAK: { label: 'Peak Crowds', color: 'text-rose-700 bg-rose-50 border-rose-200' },
      VERY_HIGH: { label: 'Very High', color: 'text-amber-700 bg-amber-50 border-amber-200' },
      HIGH: { label: 'High Traffic', color: 'text-orange-700 bg-orange-50 border-orange-200' },
      MODERATE: { label: 'Moderate Footfall', color: 'text-blue-700 bg-blue-50 border-blue-200' },
      LOW: { label: 'Peaceful', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
      PEACEFUL: { label: 'Hidden Gem Oasis', color: 'text-teal-700 bg-teal-50 border-teal-200' },
    },

    categories: {
      HISTORIC_HERITAGE: 'Heritage & History',
      CULTURE_ART: 'Art & Culture',
      GREEN_NATURE: 'Nature & Parks',
      ACTIVE_SPORT: 'Recreation & Sports',
      VIEWPOINT: 'Scenic Viewpoints & Panoramas',
      MODERN_EXPERIENCE: 'Modern & Architecture',
    },
  },

  ua: {
    badge: 'Krakow360 Відкриття & Туризм',
    officialDataBadge: 'Офіційні Дані UMK & MOT 2024',
    titleLead: 'Відкривайте Краків розумно:',
    titleAccent: 'інтелектуальний планувальник маршрутів та сталий туризм.',
    subtitle:
      'Персоналізовані маршрути, об’єктивні індекси завантаженості, пряме сполучення з Головного Вокзалу до 18 районів та унікальні альтернативи популярним місцям.',
    howItWorksButton: 'Як це працює? (Методологія роботи)',

    header: {
      navPlanner: 'Планувальник Екскурсій',
      navOvertourism: 'Зійди з туристичної стежки',
      navPassports: 'Туристичні Паспорти',
    },

    markets: {
      title: 'Структура Міжнародного Туризму',
      subtitle: 'Головні міжнародні ринки в’їзного туризму у Кракові',
      totalForeign: 'Загалом міжнародні ринки: 3.15 млн гостей',
      leaderBadge: 'Лідер',
      countries: {
        'Wielka Brytania': 'Велика Британія',
        'Niemcy': 'Німеччина',
        'W\u0142ochy': 'Італія',
        'Stany Zjednoczone': 'США',
        'Francja': 'Франція',
        'Hiszpania': 'Іспанія',
      } as Record<string, string>,
    },

    capabilities: {
      card1Title: 'Інтелектуальний Планувальник & Haversine',
      card1Desc:
        'Алгоритм синтезу маршрутів розраховує реальний час переходів за формулою гаверсинуса на координатах WGS84 (швидкість 4.5 км/год, коефіцієнт звивистості 1.25) та динамічно адаптує локації під ваш час (2г, 4г, 6г, 8г+) і профіль.',
      card2Title: 'Сталий Туризм та Овертуризм',
      card2Desc:
        'До 82% туристичного потоку зосереджено в районі Старого Міста та Казімєжа. Модуль аналізує щільність натовпу та рекомендує спокійніші, автентичні локації, захищаючи історичне серце міста від перевантаження.',
      card3Title: 'Паспорти 18 Районів та KMK',
      card3Desc:
        'Офіційні дані міського перевізника ZTP: прямі трамвайні та автобусні маршрути з Головного Вокзалу, середній час доїзду у хвилинах та перевірені локації у кожному з 18 районів Кракова.',
    },

    telemetry: {
      annualVisitors: '14.72 млн',
      annualVisitorsLabel: 'Річна кількість відвідувачів',
      annualVisitorsSub: 'Офіційний звіт UMK & MOT',
      stayDuration: '2.8 дня',
      stayDurationLabel: 'Середня тривалість перебування',
      stayDurationSub: 'Середній час візиту туриста',
      economicImpact: '11.8 млрд zł',
      economicImpactLabel: 'Орієнтовні витрати гостей',
      economicImpactSub: 'Внесок в економіку та послуги Кракова',
      curatedSites: '110 об’єктів',
      curatedSitesLabel: 'Аудитованих міських локацій',
      curatedSitesSub: 'У всіх 18 районах Кракова',
    },

    sections: {
      plannerTitle: 'Планувальник Екскурсій',
      plannerSubtitle: 'Оберіть скільки у вас часу, тематичний профіль та район – ми сформуємо оптимальний маршрут із часом переходів.',
      overtourismTitle: 'Зійди з туристичної стежки',
      overtourismSubtitle: 'Замість очікування в чергах, відкрийте автентичні та спокійні локації Кракова.',
      passportsTitle: 'Туристичні Паспорти',
      passportsSubtitle: 'Дізнайтесь час доїзду з Головного Вокзалу KMK та найкращі пам’ятки у кожному районі.',
    },

    planner: {
      timeBudgetLabel: '1. Скільки у вас часу?',
      timeSubHint: '(Оберіть часовий бюджет прогулянки)',
      timeBudgets: {
        h2Label: '2 години',
        h2Sub: 'Експрес',
        h4Label: '4 години',
        h4Sub: 'Півдня',
        h6Label: '6 годин',
        h6Sub: 'Глибоке пізнання',
        h8Label: 'Цілий день',
        h8Sub: '8г+ маршрут',
      },
      profileLabel: '2. Який профіль екскурсії ви обираєте?',
      themeSubHint: '(Оберіть характер локацій)',
      themes: {
        all: 'Будь-який профіль',
        highlights: 'Класика та ЮНЕСКО',
        green: 'Зелений Релакс',
        art: 'Мистецтво та Богема',
        secrets: 'Таємниці та Кургани',
        revolution: 'Нова Гута та Соцреалізм',
      },
      districtLabel: '3. У якому районі?',
      districtSubHint: '(Оберіть точку старту або досліджуйте все місто)',
      allDistricts: 'Всі райони',
      allDistrictsDesc: 'Відкритий маршрут по всьому Кракову',
      districtPriorityPrefix: 'Пріоритет для об’єктів району',
      districtPrioritySuffix: 'та сусідніх одиниць',
      calculatedDuration: 'Орієнтовна тривалість:',
      hoursSuffix: 'год.',
      timelineTitle: 'Покроковий розклад',
      stepLabel: 'Етап',
      visitDuration: 'Час відвідування:',
      minutesLabel: 'хв',
      generatedTitle: 'Пропонований Розклад Екскурсії:',
      summaryVisiting: 'Огляд:',
      summaryWalking: 'Переходи:',
      summaryTotal: 'Разом:',
      totalDuration: 'Загальний час:',
      totalDistance: 'Піша відстань:',
      minutesShort: 'хв',
      kmShort: 'км',
      stepNumber: 'КРОК',
      directTransitHint: 'З Головного Вокзалу:',
      transitWalking: 'Пішки',
      transitByKMK: 'Поїздка громадським транспортом KMK:',
      walkToNext: 'Перехід до наступної точки:',
      noResults: 'Не знайдено готового маршруту для обраної комбінації. Змініть параметри.',
      noItineraryFound: 'Не знайдено маршруту для обраної комбінації. Змініть параметри.',
    },

    overtourism: {
      reliefBannerTitle: 'Допоможіть захистити історичне серце Кракова від перевантаження',
      reliefBannerDesc:
        'До 82% усього туристичного потоку зосереджено в районі Старого Міста та Казімєжа. Відкриваючи інші райони, ви отримуєте спокійний відпочинок та підтримуєте місцеві громади.',
      crowdedLabel: 'Перевантажена локація',
      peacefulLabel: 'Альтернатива',
      whySwitchLabel: 'Чому варто обрати альтернативу?',
      crowdLevelLabel: 'Показник туристичного потоку',
      cityReliefBadge: 'Розвантаження Центру Кракова',
      scenarioPrefix: 'Туристична альтернатива',
      sustainableChoice: 'Сталий вибір',
      crowdedFriction: 'Черги за квитками, тіснява на подвір’ях та шум',
      peacefulPerk: 'Простір, панорамні краєвиди та автентична атмосфера',
      chooseAlternative: 'Оберіть спокійніший відповідник',
      perks: {
        alt_wawel_vs_krakus: ['Безкоштовний вхід без квитків', 'Панорама 360° на Краків і Татри', 'Чарівний захід сонця'],
        alt_rynek_vs_plac_centralny: ['Монументальний соцреалізм', 'Тиша і простір без натовпу', 'Зелена Алея Троянд'],
        alt_kazimierz_vs_bednarski: ['Міст Бернатка за 10 хв', 'Романтичний колишній кар’єр', 'Затишок подалі від галасливих барів'],
        alt_planty_vs_lasek_wolski: ['400 га справжнього лісу', 'Юрські яри та спів птахів', 'Краєвид із Кургану Пілсудського'],
        alt_schindler_vs_matejko: ['Без черг за квитками', 'Історична дерев’яна садиба', 'Тихий парк біля річки Длубня'],
      } as Record<string, string[]>,
    },

    passports: {
      selectDistrict: 'Оберіть район Кракова:',
      transitDirectHeader: 'Доїзд із Головного Вокзалу (KMK / ZTP Краків)',
      avgTransitTime: 'Середній час доїзду KMK',
      transitNetwork: 'Доступність KMK',
      tramsAndBuses: 'Трамваї та Автобуси',
      distanceFromStation: 'Відстань від Вокзалу',
      districtHighlights: 'Визначні локації в районі:',
      visitTime: 'Час:',
      travelFromStationTitle: 'Громадський транспорт із Головного Вокзалу (KMK / ZTP):',
      travelTime: 'Середній час у дорозі:',
      directLines: 'Прямі маршрути:',
      distanceKm: 'Відстань від вокзалу:',
      attractionsCount: 'Визначні локації в районі:',
      topAttractionsTitle: 'Ключові місця для відкриття:',
      noAttractionsYet: 'Житловий та природний район. Ідеальне місце для спокійних прогулянок.',
      unescoSiteBadge: 'Об’єкт ЮНЕСКО',
      visitTimeLabel: 'Орієнтовний час:',
    },

    crowd: {
      PEAK: { label: 'Піковий натовп', color: 'text-rose-700 bg-rose-50 border-rose-200' },
      VERY_HIGH: { label: 'Дуже людно', color: 'text-amber-700 bg-amber-50 border-amber-200' },
      HIGH: { label: 'Високий потік', color: 'text-orange-700 bg-orange-50 border-orange-200' },
      MODERATE: { label: 'Помірний рух', color: 'text-blue-700 bg-blue-50 border-blue-200' },
      LOW: { label: 'Спокійно', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
      PEACEFUL: { label: 'Оаза спокою / Gem', color: 'text-teal-700 bg-teal-50 border-teal-200' },
    },

    categories: {
      HISTORIC_HERITAGE: 'Історія та спадщина',
      CULTURE_ART: 'Мистецтво та культура',
      GREEN_NATURE: 'Природа та парки',
      ACTIVE_SPORT: 'Спорт та активний відпочинок',
      VIEWPOINT: 'Оглядові майданчики та панорами',
      MODERN_EXPERIENCE: 'Сучасність та архітектура',
    },
  },
};

export type TourismI18nContent = typeof TOURISM_I18N.pl;

export const getTourismI18n = (language: Language): TourismI18nContent => {
  return TOURISM_I18N[language] ?? TOURISM_I18N.pl;
};

export const getLocalizedAlternative = (alt: OvertourismAlternativeDto, language: Language) => {
  switch (language) {
    case 'en':
      return { reason: alt.reasonEn || alt.reasonPl };
    case 'ua':
      return { reason: alt.reasonUa || alt.reasonPl };
    default:
      return { reason: alt.reasonPl };
  }
};
