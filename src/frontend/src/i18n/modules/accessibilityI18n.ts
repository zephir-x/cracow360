import type { Language } from '../types';
import type { PluralForms } from '../../utils/pluralization';

export const ACCESSIBILITY_I18N = {
  pl: {
    sectionBadge: 'Kraków bez Barier',
    sectionTitle: 'Asystent Dostępności i Przyjaznej Przestrzeni',
    sectionSubtitle:
      'Sprawdź, które dzielnice Krakowa oferują najlepszą infrastrukturę bez barier. Dane pochodzą w 100% z oficjalnych rejestrów ZDMK, UMK, ZTP i BDK.',
    officialDataBadge: 'Standard Przestrzeni bez Barier',

    // City stats overview
    cityStats: {
      blueEnvelopesTitle: 'Niebieskie Koperty',
      blueEnvelopesSub: 'miejsca postojowe dla osób z niepełnosprawnościami',
      stepFreeTitle: 'Perony bez stopni',
      stepFreeSub: 'wygodne wsiadanie z poziomu chodnika',
      publicOfficesTitle: 'Dostępne urzędy i placówki',
      publicOfficesSub: 'windy, toalety i obsługa bez barier',
      seniorClubsTitle: 'Centra Seniora (CAS)',
      seniorClubsSub: 'aktywność i spotkania w dzielnicach',
      locationsCountSuffix: 'lokalizacjach ZDMK',
      cityNetworkSuffix: 'średnia w sieci KMK Kraków',
      auditedSuffix: 'obiektów magistratu i jednostek',
      districtsSuffix: 'we wszystkich 18 dzielnicach',
    },

    profilesLabel: 'Wybierz profil potrzeb lub rodzaj ograniczeń:',
    keyCriteriaLabel: 'Kluczowe kryteria oceny',
    profiles: {
      mobility: {
        title: 'Wózek / Ruch',
        badge: 'Ruch & Wózek',
        desc: 'Osoby poruszające się na wózkach inwalidzkich i z ograniczeniami ruchowymi',
        keyFactor: 'Wygodne perony bez stopni, niebieskie koperty, windy i pochylnie',
      },
      visual: {
        title: 'Wzrok',
        badge: 'Wzrok & Orientacja',
        desc: 'Osoby niewidome, słabowidzące i wymagające wsparcia nawigacyjnego',
        keyFactor: 'Pasy i ścieżki dotykowe na peronach KMK, oznaczenia braille w urzędach',
      },
      hearing: {
        title: 'Słuch',
        badge: 'Słuch & Komunikacja',
        desc: 'Osoby głuche, słabosłyszące i korzystające z aparatów słuchowych',
        keyFactor: 'Pętle indukcyjne dla aparatów słuchowych i certyfikowani tłumacze migowi PJM',
      },
      senior: {
        title: 'Seniorzy',
        badge: 'Seniorzy',
        desc: 'Osoby starsze ceniące wygodną komunikację, bliskość zieleni i kluby seniora',
        keyFactor: 'Centra Aktywności Seniora (CAS), niska podłoga w KMK, bezpieczne alejki parkowe',
      },
      familyStroller: {
        title: 'Wózki dziecięce',
        badge: 'Wózki dziecięce',
        desc: 'Rodzice z małymi dziećmi w wózkach spacerowych i głębokich',
        keyFactor: 'Bezstopniowe wsiadanie do transportu, parki i podjazdy w budynkach',
      },
    },

    topRecommendationsTitle: 'Najbardziej przyjazne dzielnice w wybranym profilu',
    topRecommendationsSubtitle:
      'Rekomendacja oparta na algorytmie ważonym uwzględniającym gęstość udogodnień na mieszkańca oraz powierzchnię dzielnicy.',
    matchScoreLabel: 'Wskaźnik dopasowania',
    rankBadgePrefix: 'Miejsce',
    topCard: {
      prmPill: 'niebieskich kopert',
      stepFreePill: 'peronów bez stopni',
      tactilePill: 'ścieżek dotykowych',
      seniorPill: 'Centra Seniora',
      viewAudit: 'Zobacz audyt dzielnicy',
    },

    districtInspectorTitle: 'Szczegółowy audyt infrastruktury dzielnicy',
    districtInspectorSubtitle:
      'Wybierz dowolną dzielnicę, aby przeanalizować twarde dane o przystankach, miejscach postojowych i obiektach publicznych.',
    districtLabel: 'Wybierz dzielnicę:',
    selectedDistrictHeading: 'Analizowana jednostka:',
    areaLabel: 'Powierzchnia',
    residentsLabel: 'Mieszkańcy',
    seniorsLabel: 'Seniorzy (65+)',
    accessibilityIndexLabel: 'Indeks Dostępności',

    inspectorCards: {
      prmTitle: 'Niebieskie Koperty',
      prmLocations: 'ulic i lokalizacji',
      prmPer10k: 'na 10 tys. mieszkańców',
      prmPerKm2: 'miejsc na km²',

      transitTitle: 'Dostępność transportu publicznego',
      transitUnit: 'peronów bez stopni',
      transitPer10k: 'przystanków na 10 tys. mieszkańców',

      facilitiesTitle: 'Dostępne urzędy i placówki miejskie',
      seniorTitle: 'Wsparcie seniorów i tereny zielone',
      seniorPer10k: 'placówek na 10 tys. seniorów',
    },

    plurals: {
      prmSpots: ['miejsce', 'miejsca', 'miejsc'] as PluralForms,
      transitKasselStops: ['przystanek z krawędzią bez barier', 'przystanki z krawędzią bez barier', 'przystanków z krawędzią bez barier'] as PluralForms,
      transitTactileStops: ['przystanek ze ścieżkami dotykowymi', 'przystanki ze ścieżkami dotykowymi', 'przystanków ze ścieżkami dotykowymi'] as PluralForms,
      transitTotalStops: ['przystanek w całej dzielnicy', 'przystanki w całej dzielnicy', 'przystanków w całej dzielnicy'] as PluralForms,
      facilitiesAudited: ['sprawdzony obiekt', 'sprawdzone obiekty', 'sprawdzonych obiektów'] as PluralForms,
      facilitiesElevators: ['winda / podnośnik', 'windy / podnośniki', 'wind / podnośników'] as PluralForms,
      facilitiesToilets: ['toaleta przystosowana bez barier', 'toalety przystosowane bez barier', 'toalet przystosowanych bez barier'] as PluralForms,
      facilitiesHearingLoops: ['pętla indukcyjna', 'pętle indukcyjne', 'pętli indukcyjnych'] as PluralForms,
      facilitiesSignLanguage: ['tłum. języka migowego PJM', 'tłum. języka migowego PJM', 'tłum. języka migowego PJM'] as PluralForms,
      recreationCityParks: ['park miejski', 'parki miejskie', 'parków miejskich'] as PluralForms,
      recreationPocketParks: ['ogród kieszonkowy', 'ogrody kieszonkowe', 'ogrodów kieszonkowych'] as PluralForms,
    },

    keyStrengthsTitle: 'Kluczowe atuty infrastrukturalne:',
    facilitiesListTitle: 'Zaudytowane obiekty użyteczności publicznej w dzielnicy',
    noFacilitiesNotice:
      'W tej dzielnicy nie ma głównej siedziby jednostki UMK objętej audytem ministerialnym. Mieszkańcy korzystają z centralnych magistratów (np. Plac Wszystkich Świętych, Rynek Podgórski, ul. Wielicka, al. Powstania Warszawskiego) z pełnym zapleczem bez barier.',
    wheelchairGood: 'Dobra dostępność',
    wheelchairPartial: 'Dostępność częściowa',
    wheelchairWeak: 'Słaba dostępność',
    wheelchairNone: 'Brak dostępności',
    facilityDepartments: 'Wydziały / Referaty:',
    facilityAuditDesc: 'Zakres dostępności:',
    methodologyLink: 'Metodologia i źródła danych',

    amenities: {
      ramp: 'Rampa',
      elevator: 'Winda/Podnośnik',
      toilet: 'Toaleta PRM',
      loop: 'Pętla indukcyjna',
      pjm: 'Tłumacz PJM',
      braille: 'Braille/Dotyk',
    },
    footerDataNotice:
      'Dane audytowe pochodzą z Biuletynu Informacji Publicznej Miasta Krakowa (BIP UMK), Zarządu Dróg Miasta Krakowa (ZDMK), Zarządu Transportu Publicznego (ZTP) oraz raportu UMK dla Ministerstwa Funduszy i Polityki Regionalnej.',
  },

  en: {
    sectionBadge: 'Accessible Kraków',
    sectionTitle: 'Civic Accessibility & Barrier-Free Navigator',
    sectionSubtitle:
      'Discover which Krakow districts provide the best barrier-free infrastructure. Powered 100% by official municipal registries.',
    officialDataBadge: 'Barrier-Free Space Standard',

    // City stats overview
    cityStats: {
      blueEnvelopesTitle: 'Blue Parking Spaces',
      blueEnvelopesSub: 'reserved disability parking stalls',
      stepFreeTitle: 'Step-Free Platforms',
      stepFreeSub: 'level boarding directly from the sidewalk',
      publicOfficesTitle: 'Accessible Public Offices',
      publicOfficesSub: 'elevators, restrooms & barrier-free access',
      seniorClubsTitle: 'Senior Activity Centres (CAS)',
      seniorClubsSub: 'community spaces in every district',
      locationsCountSuffix: 'locations across ZDMK network',
      cityNetworkSuffix: 'city-wide KMK Krakow average',
      auditedSuffix: 'audited city hall offices & branches',
      districtsSuffix: 'across all 18 districts',
    },

    profilesLabel: 'Select an accessibility profile or specific mobility need:',
    keyCriteriaLabel: 'Key evaluation criteria',
    profiles: {
      mobility: {
        title: 'Wheelchair / Mobility',
        badge: 'Mobility & Wheelchair',
        desc: 'Wheelchair users and citizens with physical or motor impairments',
        keyFactor: 'Step-free transit platforms, blue parking spaces, elevators and ramps',
      },
      visual: {
        title: 'Visual',
        badge: 'Visual & Orientation',
        desc: 'Blind, visually impaired citizens and people needing tactile orientation',
        keyFactor: 'Tactile paving & guidance strips at KMK platforms, braille signage in offices',
      },
      hearing: {
        title: 'Hearing',
        badge: 'Hearing & Comms',
        desc: 'Deaf and hard-of-hearing residents using hearing aids or sign language',
        keyFactor: 'Hearing induction loops in service halls and certified PJM sign language interpreters',
      },
      senior: {
        title: 'Seniors',
        badge: 'Seniors',
        desc: 'Older adults who value comfortable transit, close parks, and community clubs',
        keyFactor: 'Senior Activity Clubs (CAS), low-floor KMK vehicles, safe flat park pathways',
      },
      familyStroller: {
        title: 'Baby Strollers',
        badge: 'Baby Strollers',
        desc: 'Parents navigating the city with infants and young children in prams',
        keyFactor: 'Step-free public transit boarding, accessible parks and ramps',
      },
    },

    topRecommendationsTitle: 'Top Recommended Districts for Selected Profile',
    topRecommendationsSubtitle:
      'Recommendation based on a weighted multi-factor algorithm calibrated per capita and spatial density.',
    matchScoreLabel: 'Match Score',
    rankBadgePrefix: 'Rank',
    topCard: {
      prmPill: 'blue spaces',
      stepFreePill: 'step-free platforms',
      tactilePill: 'tactile paths',
      seniorPill: 'Senior Clubs',
      viewAudit: 'View district audit',
    },

    districtInspectorTitle: 'Detailed District Infrastructure Audit',
    districtInspectorSubtitle:
      'Select any district to inspect granular municipal data on transit stops, parking stalls, and public buildings.',
    districtLabel: 'Select district:',
    selectedDistrictHeading: 'Selected administrative unit:',
    areaLabel: 'Area',
    residentsLabel: 'Residents',
    seniorsLabel: 'Seniors (65+)',
    accessibilityIndexLabel: 'Accessibility Index',

    inspectorCards: {
      prmTitle: 'Blue Parking Spaces',
      prmLocations: 'street locations',
      prmPer10k: 'per 10k residents',
      prmPerKm2: 'spaces per km²',

      transitTitle: 'Public Transit Accessibility',
      transitUnit: 'step-free platforms',
      transitPer10k: 'stops per 10k residents',

      facilitiesTitle: 'Accessible City Offices & Public Facilities',
      seniorTitle: 'Senior Care & Accessible Greenery',
      seniorPer10k: 'clubs per 10k seniors',
    },

    plurals: {
      prmSpots: ['space', 'spaces', 'spaces'] as PluralForms,
      transitKasselStops: ['stop with barrier-free boarding curb', 'stops with barrier-free boarding curbs', 'stops with barrier-free boarding curbs'] as PluralForms,
      transitTactileStops: ['stop with tactile guidance paths', 'stops with tactile guidance paths', 'stops with tactile guidance paths'] as PluralForms,
      transitTotalStops: ['transit stop in district', 'transit stops in district', 'transit stops in district'] as PluralForms,
      facilitiesAudited: ['audited facility', 'audited facilities', 'audited facilities'] as PluralForms,
      facilitiesElevators: ['elevator / wheelchair lift', 'elevators / wheelchair lifts', 'elevators / wheelchair lifts'] as PluralForms,
      facilitiesToilets: ['accessible barrier-free restroom', 'accessible barrier-free restrooms', 'accessible barrier-free restrooms'] as PluralForms,
      facilitiesHearingLoops: ['hearing induction loop', 'hearing induction loops', 'hearing induction loops'] as PluralForms,
      facilitiesSignLanguage: ['PJM sign language translator', 'PJM sign language translators', 'PJM sign language translators'] as PluralForms,
      recreationCityParks: ['city park', 'city parks', 'city parks'] as PluralForms,
      recreationPocketParks: ['pocket park', 'pocket parks', 'pocket parks'] as PluralForms,
    },

    keyStrengthsTitle: 'Key Infrastructure Strengths:',
    facilitiesListTitle: 'Audited Public Facilities in Selected District',
    noFacilitiesNotice:
      'There is no primary city hall headquarter in this district included in the ministerial audit. Residents are served by central administrative hubs (e.g. Plac Wszystkich Świętych, Rynek Podgórski, ul. Wielicka) with full barrier-free support.',
    wheelchairGood: 'Good Accessibility',
    wheelchairPartial: 'Partial Accessibility',
    wheelchairWeak: 'Weak Accessibility',
    wheelchairNone: 'No Accessibility',
    facilityDepartments: 'Departments / Offices:',
    facilityAuditDesc: 'Audit Scope:',
    methodologyLink: 'Methodology & Data Sources',

    amenities: {
      ramp: 'Ramp',
      elevator: 'Elevator/Lift',
      toilet: 'PRM Restroom',
      loop: 'Hearing Loop',
      pjm: 'Sign Language',
      braille: 'Braille/Tactile',
    },
    footerDataNotice:
      'Audit data is sourced from Krakow Public Information Bulletin (BIP UMK), Municipal Roads Authority (ZDMK), Public Transport Authority (ZTP), and UMK Accessibility Report for the Ministry of Development Funds and Regional Policy.',
  },

  ua: {
    sectionBadge: 'Краків без бар\'єрів',
    sectionTitle: 'Асистент доступності та безбар\'єрного простору',
    sectionSubtitle:
      'Дізнайтесь, які райони Кракова забезпечують найкращу безбар\'єрну інфраструктуру. 100% реальні дані з офіційних реєстрів ZDMK, UMK, ZTP та BDK.',
    officialDataBadge: 'Стандарт безбар\'єрного простору',

    // City stats overview
    cityStats: {
      blueEnvelopesTitle: 'Сині конверти',
      blueEnvelopesSub: 'паркування для людей з інвалідністю',
      stepFreeTitle: 'Платформи без сходинок',
      stepFreeSub: 'посадка в транспорт на рівні тротуару',
      publicOfficesTitle: 'Доступні міські установи',
      publicOfficesSub: 'ліфти, вбиральні та безбар\'єрність',
      seniorClubsTitle: 'Центри сеньйорів (CAS)',
      seniorClubsSub: 'дозвілля та підтримка в районах',
      locationsCountSuffix: 'локацій у мережі ZDMK',
      cityNetworkSuffix: 'середнє по мережі KMK Краків',
      auditedSuffix: 'перевірених установ мерії та служб',
      districtsSuffix: 'у всіх 18 районах',
    },

    profilesLabel: 'Оберіть профіль потреб або тип обмежень:',
    keyCriteriaLabel: 'Ключові критерії оцінки',
    profiles: {
      mobility: {
        title: 'Візок / Рух',
        badge: 'Рух & Візок',
        desc: 'Люди, які пересуваються на кріслах колісних та мають порушення опорно-рухового апарату',
        keyFactor: 'Зручні платформи без сходинок, сині конверти, ліфти та пандуси',
      },
      visual: {
        title: 'Зір',
        badge: 'Зір & Орієнтація',
        desc: 'Невидячі та слабозорі люди, які потребують тактильної навігації',
        keyFactor: 'Тактильні смуги на зупинках KMK, шрифти Брайля в установах',
      },
      hearing: {
        title: 'Слух',
        badge: 'Слух & Комунікація',
        desc: 'Люди з порушеннями слуху, які користуються слуховими апаратами чи жестовою мовою',
        keyFactor: 'Індукційні петлі в залах обслуговування та перекладачі PJM',
      },
      senior: {
        title: 'Люди похилого віку',
        badge: 'Сеньйори',
        desc: 'Літні люди, які цінують низьку підлогу транспорту, зелені зони та клуби дозвілля',
        keyFactor: 'Центри активності сеньйорів (CAS), низькопідлоговий транспорт, безпечні алеї',
      },
      familyStroller: {
        title: 'Дитячі візки',
        badge: 'Дитячі візки',
        desc: 'Батьки з немовлятами та маленькими дітьми у візках',
        keyFactor: 'Безбар\'єрна посадка в трамваї, парки та похилі з\'їзди в будівлях',
      },
    },

    topRecommendationsTitle: 'Найбільш дружні райони за обраним профілем',
    topRecommendationsSubtitle:
      'Рекомендація на основі зваженого багатофакторного алгоритму з урахуванням населення та площі.',
    matchScoreLabel: 'Індекс відповідності',
    rankBadgePrefix: 'Місце',
    topCard: {
      prmPill: 'синіх місць',
      stepFreePill: 'платформ без сходинок',
      tactilePill: 'тактильних смуг',
      seniorPill: 'Центри сеньйорів',
      viewAudit: 'Деталі аудиту',
    },

    districtInspectorTitle: 'Детальний аудит інфраструктури району',
    districtInspectorSubtitle:
      'Оберіть будь-який район, щоб переглянути точні муніципальні дані щодо зупинок, паркомісць та громадських об\'єктів.',
    districtLabel: 'Оберіть район:',
    selectedDistrictHeading: 'Обрана одиниця:',
    areaLabel: 'Площа',
    residentsLabel: 'Мешканці',
    seniorsLabel: 'Люди похилого віку (65+)',
    accessibilityIndexLabel: 'Індекс доступності',

    inspectorCards: {
      prmTitle: 'Сині конверти',
      prmLocations: 'вулиць та локацій',
      prmPer10k: 'на 10 тис. мешканців',
      prmPerKm2: 'місць на км²',

      transitTitle: 'Доступність громадського транспорту',
      transitUnit: 'платформ без сходинок',
      transitPer10k: 'зупинок на 10 тис. мешканців',

      facilitiesTitle: 'Доступні міські установи та офіси',
      seniorTitle: 'Підтримка сеньйорів та зелені зони',
      seniorPer10k: 'клубів на 10 тис. сеньйорів',
    },

    plurals: {
      prmSpots: ['місце', 'місця', 'місць'] as PluralForms,
      transitKasselStops: ['зупинка зі зручним бордюром без сходинок', 'зупинки зі зручним бордюром без сходинок', 'зупинок зі зручним бордюром без сходинок'] as PluralForms,
      transitTactileStops: ['зупинка з тактильними смугами', 'зупинки з тактильними смугами', 'зупинок з тактильними смугами'] as PluralForms,
      transitTotalStops: ['зупинка у всьому районі', 'зупинки у всьому районі', 'зупинок у всьому районі'] as PluralForms,
      facilitiesAudited: ['перевірений об\'єкт', 'перевірених об\'єкти', 'перевірених об\'єктів'] as PluralForms,
      facilitiesElevators: ['ліфт / підйомник', 'ліфти / підйомники', 'ліфтів / підйомників'] as PluralForms,
      facilitiesToilets: ['адаптований санвузол без бар\'єрів', 'адаптовані санвузли без бар\'єрів', 'адаптованих санвузлів без бар\'єрів'] as PluralForms,
      facilitiesHearingLoops: ['індукційна петля', 'індукційні петлі', 'індукційних петель'] as PluralForms,
      facilitiesSignLanguage: ['перекладач жестової мови PJM', 'перекладачі жестової мови PJM', 'перекладачів жестової мови PJM'] as PluralForms,
      recreationCityParks: ['міський парк', 'міські парки', 'міських парків'] as PluralForms,
      recreationPocketParks: ['кишеньковий парк', 'кишенькові парки', 'кишенькових парків'] as PluralForms,
    },

    keyStrengthsTitle: 'Ключові інфраструктурні переваги:',
    facilitiesListTitle: 'Перевірені об\'єкти громадського призначення в районі',
    noFacilitiesNotice:
      'У цьому районі немає головного офісу UMK, охопленого міністерським аудитом. Мешканці обслуговуються в центральних адміністративних центрах із повним безбар\'єрним облаштуванням.',
    wheelchairGood: 'Добра доступність',
    wheelchairPartial: 'Часткова доступність',
    wheelchairWeak: 'Слабка доступність',
    wheelchairNone: 'Доступність відсутня',
    facilityDepartments: 'Відділи / Департаменти:',
    facilityAuditDesc: 'Обсяг доступності:',
    methodologyLink: 'Методологія та джерела',

    amenities: {
      ramp: 'Пандус',
      elevator: 'Ліфт/Підйомник',
      toilet: 'Туалет PRM',
      loop: 'Індукційна петля',
      pjm: 'Жестова мова',
      braille: 'Брайль/Тактильність',
    },
    footerDataNotice:
      'Дані аудиту взяті з Бюлетеня публічної інформації Кракова (BIP UMK), Управління доріг (ZDMK), Управління транспорту (ZTP) та звіту UMK для Міністерства фондів та регіональної політики.',
  },
} as const;

export function getAccessibilityI18n(lang: Language) {
  return ACCESSIBILITY_I18N[lang] || ACCESSIBILITY_I18N.pl;
}

/**
 * Returns grammatical pill label for PRM parking stalls.
 */
export function getPrmPillLabel(count: number, lang: Language): string {
  if (lang === 'en') {
    return count === 1 ? 'blue space' : 'blue spaces';
  }
  if (lang === 'ua') {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return 'синє місце';
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'синіх місця';
    return 'синіх місць';
  }
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (count === 1) return 'niebieska koperta';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'niebieskie koperty';
  return 'niebieskich kopert';
}

/**
 * Returns grammatical pill label for Senior Activity Centres (CAS).
 */
export function getCasPillLabel(count: number, lang: Language): string {
  if (lang === 'en') {
    return count === 1 ? 'Senior Club' : 'Senior Clubs';
  }
  if (lang === 'ua') {
    if (count === 1) return 'Центр сеньйорів';
    if (count >= 2 && count <= 4) return 'Центри сеньйорів';
    return 'Центрів сеньйорів';
  }
  if (count === 1) return 'Centrum Seniora';
  if (count >= 2 && count <= 4) return 'Centra Seniora';
  return 'Centrów Seniora';
}

/**
 * Professional trilingual localization for all 25 audited public facilities in Krakow.
 */
interface FacilityLocEntry {
  en: { name: string; departments: string; auditDescription: string };
  ua: { name: string; departments: string; auditDescription: string };
}

export const FACILITY_LOCALIZATION: Record<string, FacilityLocEntry> = {
  'Siedziba G\u0142\u00f3wna Magistratu - Pa\u0142ac Wielopolskich': {
    en: {
      name: 'City Hall Headquarters - Wielopolski Palace',
      departments: 'Mayor of Krakow, Krakow City Council, Council Office',
      auditDescription: 'Electric platform at staircase F from the courtyard, elevator, accessible restrooms, induction loop in the Council Chamber.',
    },
    ua: {
      name: 'Головна резиденція мерії - Палац Вєлопольських',
      departments: 'Мер Кракова, Міська рада Кракова, Канцелярія ради',
      auditDescription: 'Електрична платформа у під\'їзді F з внутрішнього двору, ліфт, адаптовані вбиральні, індукційна петля у Залі засідань.',
    },
  },
  'Urz\u0105d Miasta Krakowa - Zesp\u00f3\u0142 Obs\u0142ugi Mieszka\u0144c\u00f3w': {
    en: {
      name: 'Krakow City Hall - Resident Service Complex',
      departments: 'Department of Administrative Affairs, Vehicle & Driver Registration, Taxes and Fees, Mayor\'s Office',
      auditDescription: 'Two threshold-free entrance ramps, modern elevator, fully accessible PRM restroom, PJM sign language support, induction loops.',
    },
    ua: {
      name: 'Мерія Кракова - Комплекс обслуговування мешканців',
      departments: 'Відділ адміністративних справ, Реєстрація авто та водіїв, Податки та збори, Канцелярія мера',
      auditDescription: 'Два безпорогові пандуси, сучасний ліфт, повністю адаптований санвузол, підтримка перекладача PJM, індукційні петлі.',
    },
  },
  'Urz\u0105d Miasta Krakowa - Wydzia\u0142 Architektury i Urbanistyki': {
    en: {
      name: 'Krakow City Hall - Department of Architecture and Urban Planning',
      departments: 'Department of Architecture and Urban Planning, Spatial Planning Department',
      auditDescription: 'Ground-level entrance, adapted elevator, accessible restrooms, portable induction loop for client service.',
    },
    ua: {
      name: 'Мерія Кракова - Департамент архітектури та містобудування',
      departments: 'Департамент архітектури та містобудування, Відділ просторового планування',
      auditDescription: 'Вхід на рівні землі, адаптований ліфт, пристосовані вбиральні, портативна індукційна петля для відвідувачів.',
    },
  },
  'Urz\u0105d Miasta Krakowa - Wydzia\u0142 Spraw Administracyjnych': {
    en: {
      name: 'Krakow City Hall - Department of Administrative Affairs',
      departments: 'ID Cards, Vital Records, Population Registry, Commercial Activity',
      auditDescription: 'External driveway ramp, wide door passageways, adapted elevator, certified sign language staff assistance.',
    },
    ua: {
      name: 'Мерія Кракова - Департамент адміністративних справ',
      departments: 'Паспорти, Реєстрація актів, Облік населення, Підприємницька діяльність',
      auditDescription: 'Зовнішній пологий пандус, широкі дверні прорізи, адаптований ліфт, сертифікована допомога жестовою мовою.',
    },
  },
  'Urz\u0105d Miasta Krakowa - Wydzia\u0142 Geodezji': {
    en: {
      name: 'Krakow City Hall - Department of Geodesy',
      departments: 'City Geodesy and Cartography Resource, Cadastre Office',
      auditDescription: 'Barrier-free ramp, automatic doors, modern elevator, tactile guidance markers for visually impaired.',
    },
    ua: {
      name: 'Мерія Кракова - Департамент геодезії',
      departments: 'Міський геодезичний та картографічний фонд, Кадастрове бюро',
      auditDescription: 'Безбар\'єрний пандус, автоматичні двері, сучасний ліфт, тактильні смуги навігації для слабозорих.',
    },
  },
  'Urz\u0105d Miasta Krakowa - Wydzia\u0142 Finansowy': {
    en: {
      name: 'Krakow City Hall - Financial Department',
      departments: 'Taxes and Local Fees, Debt Enforcement, Budget Accounting',
      auditDescription: 'External ramp with handrails, adapted elevator, accessible customer counter desk, induction hearing loop.',
    },
    ua: {
      name: 'Мерія Кракова - Фінансовий департамент',
      departments: 'Місцеві податки та збори, Стягнення заборгованостей, Бюджетний облік',
      auditDescription: 'Зовнішній пандус із поручнями, ліфт, знижена стійка обслуговування клієнтів, індукційна петля.',
    },
  },
  'Urz\u0105d Miasta Krakowa - Wydzia\u0142 Edukacji i MCOO': {
    en: {
      name: 'Krakow City Hall - Department of Education & MCOO',
      departments: 'Department of Education, Municipal Centre of Education Operations (MCOO)',
      auditDescription: 'Step-free main entrance, elevator to all office floors, adapted restroom, remote PJM sign language interpreter on site.',
    },
    ua: {
      name: 'Мерія Кракова - Департамент освіти та MCOO',
      departments: 'Департамент освіти, Міський центр обслуговування освіти (MCOO)',
      auditDescription: 'Вхід без сходинок, ліфт на всі робочі поверхи, адаптований санвузол, дистанційний перекладач PJM.',
    },
  },
  'Urz\u0105d Miasta Krakowa - Wydzia\u0142 Bezpiecze\u0144stwa i Zarz\u0105dzania Kryzysowego': {
    en: {
      name: 'Department of Public Safety and Crisis Management',
      departments: 'Crisis Management Centre, Safety Monitoring, Civic Protection',
      auditDescription: 'Ramp at main entrance, wide corridors, adapted ground-floor office for citizen appointments, accessible restroom.',
    },
    ua: {
      name: 'Департамент безпеки та кризового управління',
      departments: 'Центр кризового управління, Моніторинг безпеки, Цивільний захист',
      auditDescription: 'Пандус на головному вході, широкі коридори, кабінет прийому громадян на першому поверсі, адаптований санвузол.',
    },
  },
  'Urz\u0105d Miasta Krakowa - Wydzia\u0142 Mieszkalnictwa': {
    en: {
      name: 'Krakow City Hall - Department of Housing',
      departments: 'Municipal Housing Supply, Residential Support, Tenant Relations',
      auditDescription: 'Entrance platform lift, adapted elevator, accessible restrooms, designated ground-floor appointment room.',
    },
    ua: {
      name: 'Мерія Кракова - Департамент житлового господарства',
      departments: 'Муніципальне житло, Житлова підтримка, Робота з орендарями',
      auditDescription: 'Підйомник на вході, адаптований ліфт, доступні вбиральні, спеціальна кімната прийому на першому поверсі.',
    },
  },
  'Urz\u0105d Miasta Krakowa - Wydzia\u0142 \u015arodowiska': {
    en: {
      name: 'Krakow City Hall - Department of Environment',
      departments: 'Air Quality Protection, Environmental Permits, Waste Management',
      auditDescription: 'Wheelchair ramp, passenger elevator, adapted restroom, induction loop installed at resident service window.',
    },
    ua: {
      name: 'Мерія Кракова - Департамент охорони довкілля',
      departments: 'Охорона чистоти повітря, Екологічні дозволи, Управління відходами',
      auditDescription: 'Пандус для візків, пасажирський ліфт, адаптований санвузол, індукційна петля біля вікна обслуговування.',
    },
  },
  'Urz\u0105d Miasta Krakowa - Wydzia\u0142 Kultury i Dziedzictwa': {
    en: {
      name: 'Department of Culture and National Heritage',
      departments: 'Culture and National Heritage, Art Promotion, Monuments Protection',
      auditDescription: 'External ramp with certified slope, adapted elevator, accessible restroom, sign language support available.',
    },
    ua: {
      name: 'Департамент культури та національної спадщини',
      departments: 'Культура та спадщина, Промоція мистецтва, Охорона пам\'яток',
      auditDescription: 'Зовнішній пандус нормативного нахилу, ліфт, адаптований санвузол, підтримка жестової мови.',
    },
  },
  'Urz\u0105d Miasta Krakowa - Wydzia\u0142 Sportu': {
    en: {
      name: 'Krakow City Hall - Department of Sports',
      departments: 'Sports Infrastructure Development, Recreation Programs',
      auditDescription: 'Ground-level entry, wide doors, adapted elevator, accessible restrooms, tactile directional tiles.',
    },
    ua: {
      name: 'Мерія Кракова - Департамент спорту',
      departments: 'Розвиток спортивної інфраструктури, Рекреаційні програми',
      auditDescription: 'Вхід на рівні землі, широкі двері, адаптований ліфт, доступні санвузли, тактильна плитка навігації.',
    },
  },
  'Urz\u0105d Miasta Krakowa - Wydzia\u0142 ds. Przedsi\u0119biorc\u00f3w': {
    en: {
      name: 'Krakow City Hall - Entrepreneurs Service Centre',
      departments: 'Investor Service, Business Activity Registry (CEIDG)',
      auditDescription: 'Fully barrier-free: automatic entrance doors, accessible ramp, elevator, accessible restrooms, induction loops.',
    },
    ua: {
      name: 'Мерія Кракова - Центр обслуговування підприємців',
      departments: 'Обслуговування інвесторів, Реєстрація бізнесу (CEIDG)',
      auditDescription: 'Повна доступність: автоматичні двері, пологий пандус, ліфт, адаптований санвузол, індукційні петлі.',
    },
  },
  'Urz\u0105d Miasta Krakowa - Zesp\u00f3\u0142 ds. Dzielnic': {
    en: {
      name: 'Krakow City Hall - Districts Coordination Office',
      departments: 'Cooperation with 18 District Councils, Civic Participatory Budget',
      auditDescription: 'Ramp at courtyard entrance, adapted passenger elevator, accessible restroom, certified sign language service.',
    },
    ua: {
      name: 'Мерія Кракова - Бюро координації районів',
      departments: 'Співпраця з радами 18 районів, Громадський бюджет участі',
      auditDescription: 'Пандус із боку внутрішнього двору, пасажирський ліфт, адаптований санвузол, обслуговування жестовою мовою.',
    },
  },
  'Urz\u0105d Stanu Cywilnego - Podg\u00f3rze': {
    en: {
      name: 'Civil Registry Office - Podgorze',
      departments: 'Civil Registry, Marriage Ceremonies Hall, Birth & Death Registry',
      auditDescription: 'Electric platform lift at exterior entrance, adapted elevator, accessible restroom, ceremony hall with induction loop.',
    },
    ua: {
      name: 'РАЦС - Подгуже',
      departments: 'Реєстрація актів цивільного стану, Зала шлюбних церемоній',
      auditDescription: 'Електричний підйомник біля входу, адаптований ліфт, пристосований санвузол, церемоніальна зала з індукційною петлею.',
    },
  },
  'Urz\u0105d Stanu Cywilnego - Nowa Huta': {
    en: {
      name: 'Civil Registry Office - Nowa Huta',
      departments: 'Civil Registry, Marriage Hall, Certificates Issuance',
      auditDescription: 'Step-free main entrance, ground-floor client service area, accessible restroom, induction loops.',
    },
    ua: {
      name: 'РАЦС - Нова Гута',
      departments: 'Реєстрація актів цивільного стану, Зала шлюбів, Видача свідоцтв',
      auditDescription: 'Вхід без сходинок, зона прийому громадян на першому поверсі, адаптований санвузол, індукційні петлі.',
    },
  },
  'Urz\u0105d Miasta Krakowa - Wydzia\u0142y Kultury i Gospodarki': {
    en: {
      name: 'Krakow City Hall - Culture & Economy Departments',
      departments: 'Department of Culture, Municipal Economy, Department of Districts',
      auditDescription: 'Mobile stair climber available, sign language service, official direct descent to the ground floor for visitors.',
    },
    ua: {
      name: 'Мерія Кракова - Відділи культури та економіки',
      departments: 'Відділ культури, Комунальне господарство, Відділ зв\'язків з районами',
      auditDescription: 'Мобільний сходолаз, обслуговування жестовою мовою, можливість прямого спуску працівника до відвідувача.',
    },
  },
  'Wydzia\u0142 Gospodarki Komunalnej i Klimatu': {
    en: {
      name: 'Department of Municipal Economy and Climate',
      departments: 'Department of Municipal Economy and Climate',
      auditDescription: 'Internal elevator available; main entrance has exterior steps; assistance provided upon arrival.',
    },
    ua: {
      name: 'Відділ комунального господарства та клімату',
      departments: 'Відділ комунального господарства та клімату',
      auditDescription: 'Ліфт усередині будівлі; на головному вході є сходи; за потреби надається супровід працівника.',
    },
  },
  'Urz\u0105d Stanu Cywilnego - Krowodrza': {
    en: {
      name: 'Civil Registry Office - Krowodrza',
      departments: 'Civil Registry Office - Vital Records Division',
      auditDescription: 'Stair climber available, accessible restroom, sign language assistance, ground-floor service on request.',
    },
    ua: {
      name: 'РАЦС - Кроводжа',
      departments: 'Відділ РАЦС - Реєстрація актів цивільного стану',
      auditDescription: 'Сходолаз, адаптована вбиральня, обслуговування жестовою мовою, прийом працівником на першому поверсі.',
    },
  },
  'Miejski O\u015brodek Pomocy Spo\u0142ecznej w Krakowie (Centrala)': {
    en: {
      name: 'Municipal Social Welfare Centre (Headquarters)',
      departments: 'MOPS Krakow - Directorate & Disability Support Departments',
      auditDescription: 'Fully accessible facility: automatic sliding doors, ramp, elevator, accessible restrooms, induction hearing loops.',
    },
    ua: {
      name: 'Міський центр соціальної допомоги (Головний офіс)',
      departments: 'MOPS Краків - Дирекція та відділи допомоги людям з інвалідністю',
      auditDescription: 'Повністю безбар\'єрний об\'єкт: автоматичні двері, пандус, ліфт, адаптовані вбиральні, індукційні петлі.',
    },
  },
  'Wydzia\u0142 Polityki Spo\u0142ecznej i Zdrowia': {
    en: {
      name: 'Department of Social Policy and Health',
      departments: 'Department of Social Policy, Equality and Health, Plenipotentiary for Persons with Disabilities',
      auditDescription: 'Step-free entrance ramp, adapted elevator, accessible restrooms, induction loops, sign language certified staff.',
    },
    ua: {
      name: 'Департамент соціальної політики та охорони здоров\'я',
      departments: 'Департамент соціальної політики, рівності та здоров\'я, Уповноважений у справах людей з інвалідністю',
      auditDescription: 'Безпороговий пандус, адаптований ліфт, пристосовані санвузли, індукційні петлі, перекладач жестової мови.',
    },
  },
  'Zarz\u0105d Dr\u00f3g Miasta Krakowa (ZDMK)': {
    en: {
      name: 'Municipal Roads Authority (ZDMK)',
      departments: 'Paid Parking Zone Service, Road Maintenance, Traffic Engineering',
      auditDescription: 'Threshold-free main entrance, elevator, accessible restrooms, dedicated disability parking directly at entrance.',
    },
    ua: {
      name: 'Управління доріг міста Кракова (ZDMK)',
      departments: 'Служба платних зон паркування, Утримання доріг, Організація дорожнього руху',
      auditDescription: 'Вхід без порогів, ліфт, пристосований санвузол, виділені паркомісця для людей з інвалідністю безпосередньо біля входу.',
    },
  },
  'Zarz\u0105d Transportu Publicznego w Krakowie (ZTP)': {
    en: {
      name: 'Public Transport Authority (ZTP)',
      departments: 'ZTP Krakow - Ticket Operations, Resident Transit Card Office',
      auditDescription: 'Passenger Service Point with induction loop and staff assistance, internal elevator.',
    },
    ua: {
      name: 'Управління громадського транспорту (ZTP)',
      departments: 'ZTP Краків - Пункт обслуговування пасажирів, Проїзні квитки',
      auditDescription: 'Пункт обслуговування пасажирів з індукційною петлею та супроводом, ліфт у будівлі.',
    },
  },
  'Urz\u0105d Miasta Krakowa - Sarego': {
    en: {
      name: 'Krakow City Hall - Sarego Branch',
      departments: 'Internal Audit Department, Organization and Supervision',
      auditDescription: 'Transport stair climber, accessible restroom, staff assistance and ground-floor direct meeting service.',
    },
    ua: {
      name: 'Мерія Кракова - Відділення на Сарего',
      departments: 'Відділ внутрішнього контролю, Відділ організації та нагляду',
      auditDescription: 'Транспортний сходолаз, адаптований санвузол, асистентська допомога персоналу та спуск фахівця до відвідувача.',
    },
  },
  'Biblioteka Krak\u00f3w - Filia G\u0142\u00f3wna': {
    en: {
      name: 'Krakow Library - Main Branch',
      departments: 'Central Library, Lending Room & Reading Hall for Readers with Disabilities',
      auditDescription: 'Exemplary accessible venue: Braille collection and audiobooks, entrance ramp, elevator, adapted restrooms, induction loop.',
    },
    ua: {
      name: 'Краківська бібліотека - Головна філія',
      departments: 'Головна бібліотека, Абонемент та читальна зала для людей з особливими потребами',
      auditDescription: 'Зразковий об\'єкт: книги шрифтом Брайля та аудіокниги, пандус, ліфт, адаптовані вбиральні, індукційна петля.',
    },
  },
  'Nowohuckie Centrum Kultury (NCK)': {
    en: {
      name: 'Nowa Huta Cultural Centre (NCK)',
      departments: 'Education and Exhibition Department, Workshop Halls',
      auditDescription: 'Modernized cultural venue: step-free exterior ramps, panoramic elevator, PRM restrooms on every floor, induction loop in the auditorium.',
    },
    ua: {
      name: 'Новогуцький культурний центр (NCK)',
      departments: 'Відділ освіти та виставок, Майстерні',
      auditDescription: 'Модернізований культурний заклад: безпорогові зовнішні пандуси, панорамний ліфт, туалети PRM на кожному поверсі, індукційна петля в залі.',
    },
  },
  'Krakowskie Forum Kultury': {
    en: {
      name: 'Krakow Forum of Culture',
      departments: 'Center for Culture and Social Integration',
      auditDescription: 'Historic townhouse: elevator in outbuilding, adapted restroom, induction loop in auditorium.',
    },
    ua: {
      name: 'Краківський форум культури',
      departments: 'Центр культури та соціальної інтеграції',
      auditDescription: 'Історична кам\'яниця: ліфт у флігелі, адаптована вбиральня, індукційна петля у глядацькій залі.',
    },
  },
  'Centrum Obywatelskie Centrum C 10': {
    en: {
      name: 'Civic Centre - Centrum C 10',
      departments: 'Support for NGOs and Resident Civic Initiatives',
      auditDescription: 'Full architectural and digital accessibility, wheelchair stair platform, PRM restroom, meeting hall with induction loop.',
    },
    ua: {
      name: 'Громадський центр - Центрум С 10',
      departments: 'Підтримка громадських організацій та ініціатив мешканців',
      auditDescription: 'Повна архітектурна та цифрова доступність, сходова платформа, вбиральня PRM, зала зустрічей з індукційною петлею.',
    },
  },
};

/**
 * Returns localized name, departments, and auditDescription for any of the 25 public facilities.
 */
export function getLocalizedFacility(
  fac: { name: string; departments?: string; auditDescription?: string },
  lang: Language
): { name: string; departments: string; auditDescription: string } {
  if (lang === 'pl') {
    return {
      name: fac.name,
      departments: fac.departments || '',
      auditDescription: fac.auditDescription || '',
    };
  }

  const entry = FACILITY_LOCALIZATION[fac.name];
  if (!entry) {
    return {
      name: fac.name,
      departments: fac.departments || '',
      auditDescription: fac.auditDescription || '',
    };
  }

  const loc = lang === 'ua' ? entry.ua : entry.en;
  return {
    name: loc.name,
    departments: loc.departments,
    auditDescription: loc.auditDescription,
  };
}

/**
 * Synthesizes data-driven localized strengths for district cards.
 */
export function getLocalizedDistrictStrengths(
  metrics: {
    prmParking: { totalSpots: number; locationsCount: number };
    transit: { kasselKerbPct: number; tactilePavingPct: number; kasselKerbStops: number; tactilePavingStops: number };
    publicFacilities: { auditedTotal: number; elevators: number; accessibleToilets: number; hearingLoops: number; signLanguagePJM: number };
    seniorCare: { casCount: number };
  },
  lang: Language,
  activeProfile: string
): string[] {
  const strengths: string[] = [];

  // Mobility profile
  if (activeProfile === 'mobility') {
    if (metrics.transit.kasselKerbPct >= 15) {
      if (lang === 'en') strengths.push(`Step-free platforms on ${metrics.transit.kasselKerbPct}% of transit stops for level boarding`);
      else if (lang === 'ua') strengths.push(`Зручні платформи без сходинок на ${metrics.transit.kasselKerbPct}% зупинок KMK`);
      else strengths.push(`Wygodne perony bez stopni (${metrics.transit.kasselKerbPct}% przystanków) ułatwiające wsiadanie z poziomu chodnika`);
    }
    if (metrics.prmParking.totalSpots >= 25) {
      if (lang === 'en') strengths.push(`Dedicated disability parking: ${metrics.prmParking.totalSpots} blue spaces across ${metrics.prmParking.locationsCount} locations`);
      else if (lang === 'ua') strengths.push(`Висока доступність паркомісць PRM (${metrics.prmParking.totalSpots} синіх місць у ${metrics.prmParking.locationsCount} локаціях)`);
      else strengths.push(`Wysoka dostępność miejsc postojowych PRM (${metrics.prmParking.totalSpots} niebieskich kopert w ${metrics.prmParking.locationsCount} lokalizacjach)`);
    }
    if (metrics.publicFacilities.elevators >= 1) {
      if (lang === 'en') strengths.push(`Barrier-free public buildings with wheelchair lifts and elevators (${metrics.publicFacilities.elevators})`);
      else if (lang === 'ua') strengths.push(`Доступні адміністративні будівлі з ліфтами та підйомниками (${metrics.publicFacilities.elevators})`);
      else strengths.push(`Dostępne budynki publiczne z windami (${metrics.publicFacilities.elevators}), rampami i toaletami bez barier`);
    }
  }

  // Visual profile
  else if (activeProfile === 'visual') {
    if (metrics.transit.tactilePavingPct >= 20) {
      if (lang === 'en') strengths.push(`Tactile paving and guidance paths on ${metrics.transit.tactilePavingPct}% of transit stops`);
      else if (lang === 'ua') strengths.push(`Тактильні смуги та плити для незрячих на ${metrics.transit.tactilePavingPct}% зупинок`);
      else strengths.push(`Pasy i płyty dotykowe dla osób niewidomych na ${metrics.transit.tactilePavingPct}% przystanków KMK`);
    }
    if (lang === 'en') strengths.push(`Braille signage and tyflographic orientation plans in municipal offices`);
    else if (lang === 'ua') strengths.push(`Позначення шрифтом Брайля та тактильні плани в установах`);
    else strengths.push(`Oznaczenia w alfabecie Braille'a i plany tyflograficzne w urzędach miejskich`);
  }

  // Hearing profile
  else if (activeProfile === 'hearing') {
    if (metrics.publicFacilities.hearingLoops >= 1 || metrics.publicFacilities.signLanguagePJM >= 1) {
      if (lang === 'en') strengths.push(`Certified PJM sign language support and hearing induction loops in city hall`);
      else if (lang === 'ua') strengths.push(`Індукційні петлі та сертифікований супровід жестовою мовою PJM у мерії`);
      else strengths.push(`Pętle indukcyjne oraz obsługa tłumacza Polskiego Języka Migowego (PJM) w placówkach`);
    }
  }

  // Senior profile
  else if (activeProfile === 'senior') {
    if (metrics.seniorCare.casCount >= 1) {
      if (lang === 'en') strengths.push(`Well-developed network of Senior Activity Clubs (${metrics.seniorCare.casCount} CAS)`);
      else if (lang === 'ua') strengths.push(`Розгалужена мережа Центрів активності сеньйорів (${metrics.seniorCare.casCount} CAS)`);
      else strengths.push(`Rozbudowana sieć Centrów Aktywności Seniora (${metrics.seniorCare.casCount} CAS)`);
    }
  }

  // Fallback if needed
  if (strengths.length === 0) {
    if (lang === 'en') strengths.push(`Comprehensive barrier-free municipal infrastructure`);
    else if (lang === 'ua') strengths.push(`Комплексна безбар'єрна міська інфраструктура`);
    else strengths.push(`Zrównoważona infrastruktura dostępności miejskiej`);
  }

  return strengths;
}
