import type { Language } from '../types';
import type { AccessibilityMetricsDto, AccessibilityProfileKey } from '../../types/contracts';

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
      prmUnit: 'miejsc',
      prmLocations: 'ulic i lokalizacji',
      prmPer10k: 'na 10 tys. mieszkańców',
      prmPerKm2: 'miejsc na km²',

      transitTitle: 'Dostępność transportu publicznego',
      transitUnit: 'peronów bez stopni',
      transitKassel: 'przystanków z krawędzią bez barier',
      transitTactile: 'płyt i pasów dotykowych dla osób niewidomych',
      transitTactileUnit: 'przystanków ze ścieżkami dotykowymi',
      transitTotal: 'przystanków w całej dzielnicy',

      facilitiesTitle: 'Dostępne urzędy i placówki miejskie',
      facilitiesUnit: 'sprawdzonych obiektów',
      facilitiesElevators: 'wind / podnośników',
      facilitiesToilets: 'toalet przystosowanych bez barier',
      facilitiesHearingLoops: 'pętli indukcyjnych',
      facilitiesSignLanguage: 'tłum. języka migowego PJM',

      seniorTitle: 'Wsparcie seniorów i tereny zielone',
      seniorUnit: 'Centrów Seniora (CAS)',
      seniorPer10k: 'placówek na 10 tys. seniorów',
      seniorParks: 'parków miejskich',
      seniorPockets: 'ogrodów kieszonkowych',
    },

    keyStrengthsTitle: 'Kluczowe atuty infrastrukturalne:',
    facilitiesListTitle: 'Zaudytowane obiekty użyteczności publicznej w dzielnicy',
    noFacilitiesNotice:
      'W tej dzielnicy nie ma głównej siedziby jednostki UMK objętej audytem ministerialnym. Mieszkańcy korzystają z centralnych magistratów (np. Plac Wszystkich Świętych, Rynek Podgórski, ul. Wielicka, al. Powstania Warszawskiego) z pełnym zapleczem bez barier.',
    wheelchairFull: 'Pełna dostępność',
    wheelchairPartial: 'Dostępność częściowa',
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
        desc: 'Blind and visually impaired citizens requiring tactile navigation',
        keyFactor: 'Tactile warning paving on transit platforms, Braille signage in halls',
      },
      hearing: {
        title: 'Hearing',
        badge: 'Hearing & Comms',
        desc: 'Deaf and hard-of-hearing residents using hearing aids or sign language',
        keyFactor: 'Hearing induction loops in service halls and certified PJM translators',
      },
      senior: {
        title: 'Seniors',
        badge: 'Seniors',
        desc: 'Elderly citizens prioritizing easy transit boarding, green spaces, and clubs',
        keyFactor: 'Senior Activity Centers (CAS), low-floor KMK boarding, safe paths',
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
      prmUnit: 'spaces',
      prmLocations: 'street locations',
      prmPer10k: 'per 10k residents',
      prmPerKm2: 'spaces per km²',

      transitTitle: 'Public Transit Accessibility',
      transitUnit: 'step-free platforms',
      transitKassel: 'stops with barrier-free boarding curbs',
      transitTactile: 'tactile warning pavers for visually impaired',
      transitTactileUnit: 'stops with tactile guidance paths',
      transitTotal: 'total transit stops in district',

      facilitiesTitle: 'Accessible City Offices & Public Facilities',
      facilitiesUnit: 'audited facilities',
      facilitiesElevators: 'elevators / wheelchair lifts',
      facilitiesToilets: 'accessible barrier-free restrooms',
      facilitiesHearingLoops: 'hearing induction loops',
      facilitiesSignLanguage: 'PJM sign language translators',

      seniorTitle: 'Senior Care & Accessible Greenery',
      seniorUnit: 'Senior Activity Clubs (CAS)',
      seniorPer10k: 'clubs per 10k seniors',
      seniorParks: 'city parks',
      seniorPockets: 'pocket parks',
    },

    keyStrengthsTitle: 'Key Infrastructure Strengths:',
    facilitiesListTitle: 'Audited Public Facilities in Selected District',
    noFacilitiesNotice:
      'There is no primary city hall headquarter in this district included in the ministerial audit. Residents are served by central administrative hubs (e.g. Plac Wszystkich Świętych, Rynek Podgórski, ul. Wielicka) with full barrier-free support.',
    wheelchairFull: 'Full Accessibility',
    wheelchairPartial: 'Partial Accessibility',
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
        title: 'Крісло колісне / Рух',
        badge: 'Рух & Крісло',
        desc: 'Люди на кріслах колісних та з порушеннями опорно-рухового апарату',
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
      prmUnit: 'місць',
      prmLocations: 'вулиць та локацій',
      prmPer10k: 'на 10 тис. мешканців',
      prmPerKm2: 'місць на км²',

      transitTitle: 'Доступність громадського транспорту',
      transitUnit: 'платформ без сходинок',
      transitKassel: 'зупинок зі зручним бордюром без сходинок',
      transitTactile: 'тактильних плит та смуг для незрячих',
      transitTactileUnit: 'зупинок з тактильними смугами',
      transitTotal: 'зупинок у всьому районі',

      facilitiesTitle: 'Доступні міські установи та офіси',
      facilitiesUnit: 'перевірених об\'єктів',
      facilitiesElevators: 'ліфтів / підйомників',
      facilitiesToilets: 'адаптованих санвузлів без бар\'єрів',
      facilitiesHearingLoops: 'індукційних петель',
      facilitiesSignLanguage: 'перекладачів жестової мови PJM',

      seniorTitle: 'Підтримка літніх людей та зелені зони',
      seniorUnit: 'Centrów Seniora (CAS)',
      seniorPer10k: 'закладів на 10 тис. сеньйорів',
      seniorParks: 'міських парків',
      seniorPockets: 'кишенькових парків',
    },

    keyStrengthsTitle: 'Ключові інфраструктурні переваги:',
    facilitiesListTitle: 'Перевірені громадські об\'єкти в обраному районі',
    noFacilitiesNotice:
      'У цьому районі немає головного офісу UMK, охопленого міністерським аудитом. Мешканці обслуговуються в центральних адміністративних центрах із повним безбар\'єрним облаштуванням.',
    wheelchairFull: 'Повна доступність',
    wheelchairPartial: 'Часткова доступність',
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
  'Siedziba Główna Magistratu - Pałac Wielopolskich': {
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
  'Urząd Miasta Krakowa - Zespół Obsługi Mieszkańców': {
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
  'Urząd Miasta Krakowa - Wydział Architektury i Urbanistyki': {
    en: {
      name: 'Krakow City Hall - Department of Architecture and Urban Planning',
      departments: 'Department of Architecture and Urban Planning, Spatial Planning Department',
      auditDescription: 'Barrier-free entrance, elevator, accessible restrooms, counters equipped with induction loops for hard of hearing.',
    },
    ua: {
      name: 'Мерія Кракова - Відділ архітектури та містобудування',
      departments: 'Відділ архітектури та містобудування, Відділ просторового планування',
      auditDescription: 'Безбар\'єрний вхід, ліфт, адаптовані санвузли, робочі місця з індукційними петлями для слабочуючих.',
    },
  },
  'Krakowskie Centrum Świadczeń': {
    en: {
      name: 'Krakow Benefits Center',
      departments: 'Krakow Benefits Center, Department of Education',
      auditDescription: 'Ramp access from inner courtyard, smooth elevator, wheelchair-accessible restroom, PJM sign language service.',
    },
    ua: {
      name: 'Краківський центр соціальних виплат',
      departments: 'Краківський центр виплат, Відділ освіти',
      auditDescription: 'Пандус із внутрішнього двору, тихий ліфт, пристосований для крісел колісних санвузол, перекладач PJM.',
    },
  },
  'Urząd Miasta Krakowa - Rynek Podgórski 1': {
    en: {
      name: 'Krakow City Hall - Rynek Podgórski 1',
      departments: 'Housing Department, Department of Environment, Climate and Air',
      auditDescription: 'Ramp access, video intercom at entrance, wide elevator, accessible ground-floor restroom, barrier-free service counters.',
    },
    ua: {
      name: 'Мерія Кракова - Ринек Подгурський 1',
      departments: 'Відділ житлового господарства, Відділ довкілля, клімату та повітря',
      auditDescription: 'Пандус, відеодомофон на вході, широкий ліфт, пристосований санвузол на 1 поверсі, безбар\'єрні робочі місця.',
    },
  },
  'Urząd Miasta Krakowa - Rynek Podgórski 2': {
    en: {
      name: 'Krakow City Hall - Rynek Podgórski 2',
      departments: 'Housing Department (selected divisions)',
      auditDescription: 'Historic townhouse with complex staircase. Barrier-free resident service is provided by officials assisting on the ground floor.',
    },
    ua: {
      name: 'Мерія Кракова - Ринек Подгурський 2',
      departments: 'Відділ житлового господарства (частина відділів)',
      auditDescription: 'Історична кам\'яниця зі сходами. Обслуговування маломобільних громадян здійснюється шляхом спуску працівника на 1 поверх.',
    },
  },
  'Centrum Administracyjne Podgórze / Wielicka': {
    en: {
      name: 'Podgórze Administrative Center / Wielicka',
      departments: 'Department of Vehicle & Driver Registration, Administrative Affairs, Building Inspection, Taxes',
      auditDescription: 'Full accessibility: wide ramp, passenger elevator, accessible PRM restroom, tactile guiding paths, induction loops.',
    },
    ua: {
      name: 'Адміністративний центр Подгуже / Вєліцька',
      departments: 'Реєстрація транспорту та водіїв, Адміністративні справи, Будівельна інспекція, Податки',
      auditDescription: 'Повна доступність: зручний пандус, пасажирський ліфт, адаптований санвузол, тактильні смуги, індукційна петля.',
    },
  },
  'Urząd Stanu Cywilnego i Wydziały UMK - Nowa Huta': {
    en: {
      name: 'Civil Registry Office & City Hall Departments - Nowa Huta',
      departments: 'Civil Registry Office, Population & Vehicle Records, Environment, Public Safety and Crisis Management',
      auditDescription: 'Model accessibility in Nowa Huta: wide ramp, elevator, accessible restrooms, certified PJM translator on site, induction loops.',
    },
    ua: {
      name: 'РАЦС та відділи мерії - Нова Гута',
      departments: 'Відділ РАЦС, Облік населення та транспорту, Довкілля, Безпека та кризовий менеджмент',
      auditDescription: 'Зразкова доступність у Новій Гуті: пандус, ліфт, адаптовані вбиральні, перекладач PJM на місці, індукційні петлі.',
    },
  },
  'Urząd Miasta Krakowa - Wydziały Kultury i Gospodarki': {
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
  'Wydział Gospodarki Komunalnej i Klimatu': {
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
  'Urząd Stanu Cywilnego - Krowodrza': {
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
  'Miejski Ośrodek Pomocy Społecznej w Krakowie (Centrala)': {
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
  'Wydział Polityki Społecznej i Zdrowia': {
    en: {
      name: 'Department of Social Policy and Health',
      departments: 'Department of Social Policy, Equality and Health, Plenipotentiary for Persons with Disabilities',
      auditDescription: 'Headquarters of Mayor\'s Disability Plenipotentiary: ramp, elevator, PRM restroom, PJM translator, induction loop.',
    },
    ua: {
      name: 'Відділ соціальної політики та охорони здоров\'я',
      departments: 'Відділ соціальної політики, рівності та здоров\'я, Уповноважений у справах людей з інвалідністю',
      auditDescription: 'Офіс Уповноваженого у справах людей з інвалідністю: пандус, ліфт, туалет PRM, переклад PJM, індукційна петля.',
    },
  },
  'Punkt Pomocy Prawnej i Obsługi Mieszkańców': {
    en: {
      name: 'Legal Aid & Resident Service Point',
      departments: 'Free Legal Aid Point, Civic Participation Office',
      auditDescription: 'Powered wheelchair platform lift, wide access ramp by the reception, accessible restroom.',
    },
    ua: {
      name: 'Пункт безоплатної правової допомоги та обслуговування',
      departments: 'Пункт безоплатної правової допомоги, Бюро громадської участі',
      auditDescription: 'Сходовий електричний підйомник, широкий пандус від чергового, адаптований санвузол.',
    },
  },
  'Urząd Miasta Krakowa - Sarego': {
    en: {
      name: 'Krakow City Hall - Sarego Branch',
      departments: 'Internal Audit Department, Organization and Supervision Department',
      auditDescription: 'Transport stair climber, accessible restroom, staff assistance and ground-floor direct consultations.',
    },
    ua: {
      name: 'Мерія Кракова - відділення Сарего',
      departments: 'Відділ внутрішнього контролю, Відділ організації та нагляду',
      auditDescription: 'Транспортний сходолаз, адаптований санвузол, супровід персоналу та спуск фахівця для консультації.',
    },
  },
  'Wydział Podatków i Opłat': {
    en: {
      name: 'Department of Taxes and Fees',
      departments: 'Department of Taxes and Fees - Customer Service',
      auditDescription: 'Ground floor with ramp access, accessible restroom, service desks equipped with hearing induction loops.',
    },
    ua: {
      name: 'Відділ податків та зборів',
      departments: 'Відділ податків та зборів - Відділи обслуговування',
      auditDescription: 'Перший поверх із пандусом, адаптований санвузол, робочі місця оснащені індукційними петлями.',
    },
  },
  'Punkt Obsługi Mieszkańców Galeria Serenada': {
    en: {
      name: 'Resident Service Point - Serenada Mall',
      departments: 'Administrative Affairs, Vehicle & Driver Registration',
      auditDescription: 'Modern shopping centre branch: elevator from parking, step-free access, PRM restrooms, induction hearing loop.',
    },
    ua: {
      name: 'Пункт обслуговування мешканців - ТЦ Серенада',
      departments: 'Відділ адміністративних справ, Реєстрація транспорту та водіїв',
      auditDescription: 'Сучасний пункт у торговому центрі: ліфт із паркінгу, повна безбар\'єрність, туалети PRM, індукційна петля.',
    },
  },
  'Punkt Obsługi Mieszkańców Galeria Bonarka': {
    en: {
      name: 'Resident Service Point - Bonarka Mall',
      departments: 'Administrative Affairs, Vehicle & Driver Registration',
      auditDescription: 'Full step-free accessibility, blue parking stalls right at entrance, accessible restrooms, induction loops.',
    },
    ua: {
      name: 'Пункт обслуговування мешканців - ТЦ Бонарка',
      departments: 'Відділ адміністративних справ, Реєстрація транспорту та водіїв',
      auditDescription: 'Повна безступінчаста доступність, сині паркомісця перед входом, адаптовані вбиральні, індукційні петлі.',
    },
  },
  'Zarząd Transportu Publicznego w Krakowie (ZTP)': {
    en: {
      name: 'Public Transport Authority (ZTP Krakow)',
      departments: 'ZTP Krakow - Passenger Service & Ticketing Department',
      auditDescription: 'Passenger Service Point with induction hearing loop and staff assistance, building elevator.',
    },
    ua: {
      name: 'Управління громадського транспорту (ZTP Краків)',
      departments: 'ZTP Краків - Відділ обслуговування пасажирів та квитків',
      auditDescription: 'Пункт обслуговування пасажирів з індукційною петлею та супроводом, ліфт у будівлі.',
    },
  },
  'Zarząd Dróg Miasta Krakowa (ZDMK Centrala)': {
    en: {
      name: 'Municipal Roads Authority (ZDMK Headquarters)',
      departments: 'ZDMK - Resident Service, Permits & Paid Parking Zone',
      auditDescription: 'Single-storey customer pavilion: step-free entrance, PRM restrooms, dedicated low-counter service.',
    },
    ua: {
      name: 'Управління доріг міста Кракова (Головний офіс ZDMK)',
      departments: 'ZDMK - Обслуговування мешканців, Дозволи та платне паркування',
      auditDescription: 'Одноповерховий модернізований павільйон: безпороговий вхід, туалети PRM, спеціальні робочі місця.',
    },
  },
  'Zarząd Zieleni Miejskiej w Krakowie (ZZM)': {
    en: {
      name: 'Municipal Greenery Authority (ZZM Krakow)',
      departments: 'ZZM - Main Headquarters',
      auditDescription: 'Entrance ramp, accessible restroom, ground-floor customer service with no threshold barriers.',
    },
    ua: {
      name: 'Управління зелених насаджень (ZZM Краків)',
      departments: 'ZZM - Головний офіс',
      auditDescription: 'Пандус біля входу, адаптована вбиральня, прийом на першому поверсі без порогів.',
    },
  },
  'Biblioteka Kraków - Biblioteka Główna': {
    en: {
      name: 'Krakow Library - Main Branch',
      departments: 'Main Library, Lending Room & Reading Hall for Special Needs',
      auditDescription: 'Exemplary accessible library: Braille books and audiobooks, ramp, elevator, accessible restrooms, induction loop.',
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

  const loc = entry[lang] || entry.en;
  return {
    name: loc.name || fac.name,
    departments: loc.departments || fac.departments || '',
    auditDescription: loc.auditDescription || fac.auditDescription || '',
  };
}

/**
 * Returns dynamic, grammatically natural, profile-contextual strengths for a district
 * in Polish, English, or Ukrainian.
 */
export function getLocalizedDistrictStrengths(
  metrics: AccessibilityMetricsDto,
  lang: Language,
  profile?: AccessibilityProfileKey
): string[] {
  const strengths: string[] = [];

  if (profile === 'mobility') {
    // 1. Kassel-kerb step-free transit
    if (metrics.transit.kasselKerbPct >= 15) {
      if (lang === 'en') {
        strengths.push(
          `Step-free platforms on ${metrics.transit.kasselKerbPct}% of transit stops for level boarding`
        );
      } else if (lang === 'ua') {
        strengths.push(
          `Зручні платформи без сходинок на ${metrics.transit.kasselKerbPct}% зупинок для посадки на рівні тротуару`
        );
      } else {
        strengths.push(
          `Wygodne perony bez stopni (${metrics.transit.kasselKerbPct}% przystanków) ułatwiające wsiadanie z poziomu chodnika`
        );
      }
    }

    // 2. PRM parking spaces
    if (metrics.prmParking.totalSpots >= 25 || metrics.prmParking.spotsPer10kPop >= 15) {
      const prmWord = getPrmPillLabel(metrics.prmParking.totalSpots, lang);
      if (lang === 'en') {
        strengths.push(
          `Dedicated disability parking: ${metrics.prmParking.totalSpots} ${prmWord} across ${metrics.prmParking.locationsCount} locations`
        );
      } else if (lang === 'ua') {
        strengths.push(
          `Виділені місця для людей з інвалідністю: ${metrics.prmParking.totalSpots} ${prmWord} у ${metrics.prmParking.locationsCount} локаціях`
        );
      } else {
        strengths.push(
          `Wysoka dostępność miejsc postojowych PRM (${metrics.prmParking.totalSpots} ${prmWord} w ${metrics.prmParking.locationsCount} lokalizacjach)`
        );
      }
    }

    // 3. Elevators / ramps in facilities
    if (metrics.publicFacilities.elevators >= 1 || metrics.publicFacilities.ramps >= 1) {
      if (lang === 'en') {
        strengths.push(
          `Barrier-free public buildings with wheelchair lifts and elevators (${metrics.publicFacilities.elevators})`
        );
      } else if (lang === 'ua') {
        strengths.push(
          `Безбар'єрні громадські будівлі з підйомниками та ліфтами (${metrics.publicFacilities.elevators})`
        );
      } else {
        strengths.push(
          `Dostępne budynki publiczne z windami (${metrics.publicFacilities.elevators}), rampami i toaletami bez barier`
        );
      }
    }
  } else if (profile === 'visual') {
    // 1. Tactile paving
    if (metrics.transit.tactilePavingPct >= 25) {
      if (lang === 'en') {
        strengths.push(
          `Tactile warning strips and guidance pavers on ${metrics.transit.tactilePavingPct}% of transit stops`
        );
      } else if (lang === 'ua') {
        strengths.push(
          `Тактильні смуги та рельєфні плити орієнтування на ${metrics.transit.tactilePavingPct}% зупинок KMK`
        );
      } else {
        strengths.push(
          `Pasy i płyty dotykowe dla osób niewidomych na ${metrics.transit.tactilePavingPct}% przystanków KMK`
        );
      }
    }

    // 2. Braille signage
    if (metrics.publicFacilities.brailleTactile >= 1) {
      if (lang === 'en') {
        strengths.push(
          'Braille signage and tactile orientation maps in municipal offices'
        );
      } else if (lang === 'ua') {
        strengths.push(
          'Шрифт Брайля та тактильні плани орієнтування в міських установах'
        );
      } else {
        strengths.push(
          'Oznaczenia w alfabecie Braille\'a i plany tyflograficzne w urzędach miejskich'
        );
      }
    }

    // 3. Kassel-kerb edge guidance
    if (metrics.transit.kasselKerbPct >= 10) {
      if (lang === 'en') {
        strengths.push(
          'Standardized curb edges with tactile transition zones for safe transit approach'
        );
      } else if (lang === 'ua') {
        strengths.push(
          'Стандартизовані краї платформ із тактильними зонами безпеки'
        );
      } else {
        strengths.push(
          'Bezpieczne perony z liniami krawędziowymi ułatwiające orientację przestrzenną'
        );
      }
    }
  } else if (profile === 'hearing') {
    // 1. Induction loops with proper Polish inflection: 1 instalacja, 2-4 instalacje, 5+ instalacji
    if (metrics.publicFacilities.hearingLoops >= 1) {
      const loopCount = metrics.publicFacilities.hearingLoops;
      const loopWord =
        lang === 'pl'
          ? loopCount === 1
            ? 'instalacja'
            : loopCount >= 2 && loopCount <= 4
            ? 'instalacje'
            : 'instalacji'
          : lang === 'ua'
          ? loopCount === 1
            ? 'установка'
            : loopCount >= 2 && loopCount <= 4
            ? 'установки'
            : 'установок'
          : loopCount === 1
          ? 'installed hall'
          : 'installed halls';

      if (lang === 'en') {
        strengths.push(
          `Hearing induction loops in resident service halls (${loopCount} ${loopWord})`
        );
      } else if (lang === 'ua') {
        strengths.push(
          `Індукційні петлі для слухових апаратів у залах обслуговування (${loopCount} ${loopWord})`
        );
      } else {
        strengths.push(
          `Pętle indukcyjne dla aparatów słuchowych w salach obsługi mieszkańców (${loopCount} ${loopWord})`
        );
      }
    }

    // 2. Sign language
    if (metrics.publicFacilities.signLanguagePJM >= 1) {
      if (lang === 'en') {
        strengths.push(
          'Certified Polish Sign Language (PJM) translation support in municipal branch'
        );
      } else if (lang === 'ua') {
        strengths.push(
          'Сертифікований сурдопереклад польською жестовою мовою (PJM) в установах'
        );
      } else {
        strengths.push(
          'Certyfikowana obsługa tłumacza Polskiego Języka Migowego (PJM) w magistracie'
        );
      }
    }

    // 3. Digital visual info
    if (lang === 'en') {
      strengths.push(
        'Digital visual passenger information screens deployed across district transit lines'
      );
    } else if (lang === 'ua') {
      strengths.push(
        'Цифрові інформаційні табло на зупинках та у вагонах міського транспорту'
      );
    } else {
      strengths.push(
        'Cyfrowa informacja pasażerska na przystankach i wizualne systemy kolejkowe'
      );
    }
  } else if (profile === 'senior') {
    // 1. CAS clubs
    if (metrics.seniorCare.casCount >= 1) {
      const casLabel = getCasPillLabel(metrics.seniorCare.casCount, lang);
      if (lang === 'en') {
        strengths.push(
          `Active senior support network (${metrics.seniorCare.casCount} ${casLabel})`
        );
      } else if (lang === 'ua') {
        strengths.push(
          `Розвинена мережа дозвілля (${metrics.seniorCare.casCount} ${casLabel})`
        );
      } else {
        strengths.push(
          `Rozbudowana sieć wsparcia (${metrics.seniorCare.casCount} ${casLabel})`
        );
      }
    }

    // 2. Level boarding
    if (metrics.transit.kasselKerbPct >= 10) {
      if (lang === 'en') {
        strengths.push(
          `Level sidewalk boarding on ${metrics.transit.kasselKerbPct}% of transit stops for comfortable access`
        );
      } else if (lang === 'ua') {
        strengths.push(
          `Посадка в транспорт на рівні тротуару на ${metrics.transit.kasselKerbPct}% зупинок для літніх людей`
        );
      } else {
        strengths.push(
          `Wygodne wsiadanie do transportu z poziomu chodnika na ${metrics.transit.kasselKerbPct}% przystanków`
        );
      }
    }

    // 3. Parks & benches with natural grammar: 1 park miejski, 2-4 parki miejskie, 5+ parków miejskich
    if (metrics.recreation.cityParks + metrics.recreation.pocketParks >= 2) {
      const pCount = metrics.recreation.cityParks;
      const kCount = metrics.recreation.pocketParks;

      const parkWord =
        lang === 'pl'
          ? pCount === 1
            ? 'park miejski'
            : pCount >= 2 && pCount <= 4
            ? 'parki miejskie'
            : 'parków miejskich'
          : lang === 'ua'
          ? pCount === 1
            ? 'міський парк'
            : pCount >= 2 && pCount <= 4
            ? 'міські парки'
            : 'міських парків'
          : pCount === 1
          ? 'city park'
          : 'city parks';

      const pocketWord =
        lang === 'pl'
          ? kCount === 1
            ? 'ogród kieszonkowy'
            : kCount >= 2 && kCount <= 4
            ? 'ogrody kieszonkowe'
            : 'ogrodów kieszonkowych'
          : lang === 'ua'
          ? kCount === 1
            ? 'кишеньковий сад'
            : kCount >= 2 && kCount <= 4
            ? 'кишенькові сади'
            : 'кишенькових садів'
          : kCount === 1
          ? 'pocket park'
          : 'pocket parks';

      if (lang === 'en') {
        strengths.push(
          `Peaceful green areas: ${pCount} ${parkWord} and ${kCount} ${pocketWord} with resting benches`
        );
      } else if (lang === 'ua') {
        strengths.push(
          `Затишні зелені зони: ${pCount} ${parkWord} та ${kCount} ${pocketWord} з лавками`
        );
      } else {
        strengths.push(
          `Przyjazne tereny zielone: ${pCount} ${parkWord} i ${kCount} ${pocketWord} z ławkami`
        );
      }
    }
  } else if (profile === 'familyStroller') {
    // 1. Step-free transit
    if (metrics.transit.kasselKerbPct >= 15) {
      if (lang === 'en') {
        strengths.push(
          `Effortless baby pram boarding without steps on ${metrics.transit.kasselKerbPct}% of transit stops`
        );
      } else if (lang === 'ua') {
        strengths.push(
          `Зручний заїзд дитячим візком без сходинок на ${metrics.transit.kasselKerbPct}% зупинок транспорту`
        );
      } else {
        strengths.push(
          `Wygodne wprowadzanie wózka dziecięcego bez stopni na ${metrics.transit.kasselKerbPct}% przystanków`
        );
      }
    }

    // 2. Parks
    if (metrics.recreation.cityParks >= 2) {
      const pCount = metrics.recreation.cityParks;
      const parkWord =
        lang === 'pl'
          ? pCount === 1
            ? 'park miejski'
            : pCount >= 2 && pCount <= 4
            ? 'parki miejskie'
            : 'parków miejskich'
          : lang === 'ua'
          ? pCount === 1
            ? 'міський парк'
            : pCount >= 2 && pCount <= 4
            ? 'міські парки'
            : 'міських парків'
          : pCount === 1
          ? 'city park'
          : 'city parks';

      if (lang === 'en') {
        strengths.push(
          `Expansive parks (${pCount} ${parkWord}) with paved barrier-free stroller alleys`
        );
      } else if (lang === 'ua') {
        strengths.push(
          `Великі парки (${pCount} ${parkWord}) із заасфальтованими алеями для дитячих прогулянок`
        );
      } else {
        strengths.push(
          `Liczne parki miejskie (${pCount} ${parkWord}) z utwardzonymi alejkami bez barier`
        );
      }
    }

    // 3. Facilities
    if (metrics.publicFacilities.elevators >= 1 || metrics.publicFacilities.ramps >= 1) {
      if (lang === 'en') {
        strengths.push(
          'Accessible public facilities with ramps and wide elevators for prams'
        );
      } else if (lang === 'ua') {
        strengths.push(
          'Доступні будівлі з пандусами та просторими ліфтами для дитячих візків'
        );
      } else {
        strengths.push(
          'Dostępne obiekty publiczne z podjazdami i windami mieszczącymi wózki'
        );
      }
    }
  }

  // Fallbacks if fewer than 2 strengths matched
  if (strengths.length < 2) {
    if (metrics.transit.kasselKerbPct >= 10) {
      if (lang === 'en') {
        strengths.push(`Step-free transit boarding on ${metrics.transit.kasselKerbPct}% of stops`);
      } else if (lang === 'ua') {
        strengths.push(`Платформи без сходинок на ${metrics.transit.kasselKerbPct}% зупинок`);
      } else {
        strengths.push(`Wygodne perony bez stopni (${metrics.transit.kasselKerbPct}% przystanków)`);
      }
    }
    if (metrics.prmParking.totalSpots >= 20) {
      const prmLabel = getPrmPillLabel(metrics.prmParking.totalSpots, lang);
      if (lang === 'en') {
        strengths.push(`${metrics.prmParking.totalSpots} ${prmLabel} across ${metrics.prmParking.locationsCount} locations`);
      } else if (lang === 'ua') {
        strengths.push(`${metrics.prmParking.totalSpots} ${prmLabel} у ${metrics.prmParking.locationsCount} локаціях`);
      } else {
        strengths.push(`${metrics.prmParking.totalSpots} ${prmLabel} w ${metrics.prmParking.locationsCount} lokalizacjach`);
      }
    }
  }

  if (strengths.length === 0) {
    if (lang === 'en') {
      strengths.push('Standard municipal amenities and continuously modernized KMK transit infrastructure');
    } else if (lang === 'ua') {
      strengths.push('Базові міські зручності та постійно модернізована інфраструктура зупинок KMK');
    } else {
      strengths.push('Podstawowe udogodnienia miejskie i stale modernizowana infrastruktura przystankowa KMK');
    }
  }

  return strengths.slice(0, 3);
}
