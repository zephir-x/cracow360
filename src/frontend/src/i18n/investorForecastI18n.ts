import type { Language } from './types';

export interface InvestorForecastLabels {
  // Hero CTA & Capabilities Toggle
  heroCtaRanking: string;
  heroCtaForecast: string;
  heroCapabilitiesToggleBtn: string;
  heroCapabilitiesCloseBtn: string;

  // Hero 4 Unique Stat Cards
  heroStatSeniorsLabel: string;
  heroStatSeniorsSub: string;
  heroStatEnrolledLabel: string;
  heroStatEnrolledSub: (pctSchools: number) => string;
  heroStatPriceLabel: string;
  heroStatPriceSub: string;
  heroStatB2BLabel: string;
  heroStatB2BSub: (districts: string) => string;

  sectionTitle: string;
  sectionSubtitle: string;
  badgeSection: string;

  // Macro Cards (4 Cards: 0-3, 4-6, 7-14, B2B) - Concise & Non-truncating
  macroToddlersTitle: string;
  macroToddlersSub: (growth: number) => string;
  macroPreschoolTitle: string;
  macroPreschoolSub: (growth: number) => string;
  macroStudentsTitle: string;
  macroStudentsSub: (sharePct: number) => string;
  macroB2BTitle: string;
  macroB2BSub: string;

  // Filters
  filterAll: string;
  filterHigh: string;
  filterMedium: string;
  filterLow: string;

  // District Card & Uniform Cohorts
  placesUnit: string;
  balanceUnit: string;
  deficitUnit: string;
  studentsUnit: string;
  schoolsUnit: string;
  currentLabel: string;
  forecast2028Label: string;
  toddlersLabel: string;
  preschoolersLabel: string;
  studentsLabel: string;
  placesLabel: string;
  balance2028Label: string;
  schoolBalanceShortLabel: string;
  classSizeUnit: string;
  totalCardSummaryLabel: string;
  coverageShortLabel: string;
  b2bBadge: Record<'HIGH' | 'MEDIUM' | 'LOW', string>;
  detailsBtn: string;
  closeBtn: string;

  // Pagination
  prevPage: string;
  nextPage: string;
  showingDistricts: (from: number, to: number, total: number) => string;

  // Drawer
  drawerTitle: string;
  drawerBadge: string;
  educationalRecommendationTitle: string;
  sectorDeficitsTitle: string;
  nurseryB2BLabel: string;
  seniorDeficitLabel: string;
  greenDeficitLabel: string;
  deficitLevels: Record<'HIGH' | 'MEDIUM' | 'LOW', string>;
  demographics2028Title: string;
  toddlerCohortSubtitle: string;
  preschoolCohortSubtitle: string;
  schoolCohortSubtitle: string;
  totalSummaryTitle: string;
  totalSummarySubtitle: string;
  totalDemandLabel: string;
  totalPlacesLabel: string;
  totalBalanceLabel: string;
  coverageLabel: string;
  vitalityLabel: string;
}

export function getInvestorForecastLabels(language: Language): InvestorForecastLabels {
  if (language === 'en') {
    return {
      heroCtaRanking: 'TOP 6 Vitality Ranking',
      heroCtaForecast: '2028 Projections & B2B',
      heroCapabilitiesToggleBtn: 'What does Official & Investor Mode offer? (Explore features)',
      heroCapabilitiesCloseBtn: 'Collapse module features',

      heroStatSeniorsLabel: 'Senior Residents (65+)',
      heroStatSeniorsSub: '21.9% of Krakow population (BDK)',
      heroStatEnrolledLabel: 'Total Edu-Care Places',
      heroStatEnrolledSub: (pct) => `Nurseries, kindergartens & schools (${pct}% schools)`,
      heroStatPriceLabel: 'Avg Housing Price',
      heroStatPriceSub: 'Real estate investment benchmark',
      heroStatB2BLabel: 'B2B Priority Hotspots',
      heroStatB2BSub: (districts) => `Districts ${districts}`,

      sectionTitle: '2028 Demographic Projections & B2B/B2G Investment Potential',
      sectionSubtitle:
        'Integrated econometric forecasting of toddler, preschool and primary school cohorts (0–14 yrs) to 2028 with municipal and private investment prioritization across all 18 Krakow districts.',
      badgeSection: 'Decision Support & Forecast 2028',

      macroToddlersTitle: 'Demand 0–3 (2028 Forecast)',
      macroToddlersSub: (growth) => `Registry trend (${growth >= 0 ? `+${growth}` : growth}%)`,
      macroPreschoolTitle: 'Demand 4–6 (2028 Forecast)',
      macroPreschoolSub: (growth) => `Demographic wave (${growth >= 0 ? `+${growth}` : growth}%)`,
      macroStudentsTitle: 'Demand 7–14 (Primary Schools)',
      macroStudentsSub: (share) => `57.6k students (${share}% of kids)`,
      macroB2BTitle: 'B2B Priority Hotspots',
      macroB2BSub: 'Private nursery supply gap',

      filterAll: 'All Districts',
      filterHigh: 'High B2B Priority',
      filterMedium: 'Moderate Priority',
      filterLow: 'Established Market',

      placesUnit: 'places',
      balanceUnit: 'balance',
      deficitUnit: 'places deficit',
      studentsUnit: 'students',
      schoolsUnit: 'schools',
      currentLabel: 'Currently:',
      forecast2028Label: '2028 Projection:',
      toddlersLabel: '0–3 yrs (Nurseries):',
      preschoolersLabel: '4–6 yrs (Kindergartens):',
      studentsLabel: '7–14 yrs (Primary Schools):',
      placesLabel: 'Capacity:',
      balance2028Label: '2028 Balance:',
      schoolBalanceShortLabel: '2028 Balance:',
      classSizeUnit: 'stud./class',
      totalCardSummaryLabel: 'Total Balance (0–14):',
      coverageShortLabel: 'Coverage:',
      b2bBadge: {
        HIGH: 'High B2B Potential',
        MEDIUM: 'Moderate Potential',
        LOW: 'Saturated Market',
      },
      detailsBtn: 'Analysis & Recommendation',
      closeBtn: 'Close Analysis',

      prevPage: 'Previous',
      nextPage: 'Next',
      showingDistricts: (from, to, total) => `Showing ${from}–${to} of ${total} districts`,

      drawerTitle: 'Strategic Investment Profile & Municipal Recommendation',
      drawerBadge: 'Decision Support B2G & B2B',
      educationalRecommendationTitle: 'Educational & Childcare Strategic Recommendation (0–14 yrs):',
      sectorDeficitsTitle: 'Sector Infrastructure Deficit Assessment',
      nurseryB2BLabel: 'Private Nursery Investment Potential (B2B):',
      seniorDeficitLabel: 'Senior Activity Centers (CAS) Deficit:',
      greenDeficitLabel: 'Pocket Parks & Biological Buffer Deficit:',
      deficitLevels: {
        HIGH: 'High Priority (Severe Deficit)',
        MEDIUM: 'Moderate Deficit',
        LOW: 'Low Deficit (Stable)',
      },
      demographics2028Title: '2028 Demographic Projections & Educational Infrastructure',
      toddlerCohortSubtitle: 'Econometric forecast of 0–3 cohort in 2028',
      preschoolCohortSubtitle: 'Econometric forecast of 4–6 cohort in 2028',
      schoolCohortSubtitle: 'Econometric forecast of 7–14 cohort in 2028',
      totalSummaryTitle: 'Edu-Care Summary (0–14)',
      totalSummarySubtitle: 'Aggregated 2028 cohort projection (0–14 yrs)',
      totalDemandLabel: 'Total Demand (0–14):',
      totalPlacesLabel: 'Capacity:',
      totalBalanceLabel: '2028 Balance:',
      coverageLabel: 'Coverage:',
      vitalityLabel: 'Demographic Vitality Score:',
    };
  }

  if (language === 'ua') {
    return {
      heroCtaRanking: 'Рейтинг ТОП 6 Вітальності',
      heroCtaForecast: 'Прогнози 2028 та B2B',
      heroCapabilitiesToggleBtn: 'Що пропонує Режим Посадовця та Інвестора? (Дізнатися більше)',
      heroCapabilitiesCloseBtn: 'Згорнути можливості модуля',

      heroStatSeniorsLabel: 'Мешканці Сеньйори (65+)',
      heroStatSeniorsSub: '21.9% населення Кракова (BDK)',
      heroStatEnrolledLabel: 'Місць в Освіті та Догляді',
      heroStatEnrolledSub: (pct) => `Ясла, дитсадки та школи (${pct}% школи)`,
      heroStatPriceLabel: 'Середня Ціна Житла',
      heroStatPriceSub: 'Ринок нерухомості в Кракові',
      heroStatB2BLabel: 'Гарячі Точки B2B',
      heroStatB2BSub: (districts) => `Райони ${districts}`,

      sectionTitle: 'Демографічні Прогнози 2028 та Інвестиційний Потенціал B2B/B2G',
      sectionSubtitle:
        'Інтегровані економетричні прогнози попиту на ясла, дитсадки та початкові школи (0–14 років) до 2028 року з муніципальною та комерційною пріоритезацією для 18 районів Кракова.',
      badgeSection: 'Підтримка Рішень та Прогноз 2028',

      macroToddlersTitle: 'Попит 0–3 (Прогноз 2028)',
      macroToddlersSub: (growth) => `Тренд реєстрацій (${growth >= 0 ? `+${growth}` : growth}%)`,
      macroPreschoolTitle: 'Попит 4–6 (Прогноз 2028)',
      macroPreschoolSub: (growth) => `Демографічний спад (${growth >= 0 ? `+${growth}` : growth}%)`,
      macroStudentsTitle: 'Попит 7–14 (Школи)',
      macroStudentsSub: (share) => `57.6 тис. учнів (${share}% дітей)`,
      macroB2BTitle: 'Гарячі Точки B2B',
      macroB2BSub: 'Гостра потреба приватних ясел',

      filterAll: 'Усі Райони',
      filterHigh: 'Високий Пріоритет B2B',
      filterMedium: 'Помірний Пріоритет',
      filterLow: 'Стабільний Ринок',

      placesUnit: 'місць',
      balanceUnit: 'баланс',
      deficitUnit: 'дефіцит місць',
      studentsUnit: 'учнів',
      schoolsUnit: 'шкіл',
      currentLabel: 'Зараз:',
      forecast2028Label: 'Прогноз 2028:',
      toddlersLabel: '0–3 роки (Ясла):',
      preschoolersLabel: '4–6 років (Дитсадки):',
      studentsLabel: '7–14 років (Початкові Школи):',
      placesLabel: 'База місць:',
      balance2028Label: 'Баланс 2028:',
      schoolBalanceShortLabel: 'Баланс 2028:',
      classSizeUnit: 'осіб/клас',
      totalCardSummaryLabel: 'Загальний Баланс (0–14):',
      coverageShortLabel: 'Покриття:',
      b2bBadge: {
        HIGH: 'Високий Потенціал B2B',
        MEDIUM: 'Помірний Потенціал',
        LOW: 'Насичений Ринок',
      },
      detailsBtn: 'Аналіз та Рекомендація',
      closeBtn: 'Закрити Аналіз',

      prevPage: 'Попередня',
      nextPage: 'Наступна',
      showingDistricts: (from, to, total) => `Відображення ${from}–${to} з ${total} районів`,

      drawerTitle: 'Стратегічний Інвестиційний Профіль та Рекомендація',
      drawerBadge: 'Підтримка Рішень B2G & B2B',
      educationalRecommendationTitle: 'Стратегічна Освітньо-Виховна Рекомендація (0–14 років):',
      sectorDeficitsTitle: 'Оцінка Секторальних Дефіцитів Інфраструктури',
      nurseryB2BLabel: 'Потенціал Приватних Ясел (B2B):',
      seniorDeficitLabel: 'Дефіцит Центрів для Сеньйорів (CAS):',
      greenDeficitLabel: 'Дефіцит Парків та Зелених Зон:',
      deficitLevels: {
        HIGH: 'Високий Пріоритет (Гострий Дефіцит)',
        MEDIUM: 'Помірний Дефіцит',
        LOW: 'Низький Дефіцит (Стабільно)',
      },
      demographics2028Title: 'Підсумок Прогнозів Демографії 2028 та Освітньої Інфраструктури',
      toddlerCohortSubtitle: 'Економетричний прогноз дітей 0–3 на 2028 рік',
      preschoolCohortSubtitle: 'Економетричний прогноз дітей 4–6 на 2028 рік',
      schoolCohortSubtitle: 'Економетричний прогноз дітей 7–14 на 2028 рік',
      totalSummaryTitle: 'Підсумок Edu-Care (0–14)',
      totalSummarySubtitle: 'Агрегований прогноз дітей 0–14 на 2028 рік',
      totalDemandLabel: 'Загальний попит (0–14):',
      totalPlacesLabel: 'База місць:',
      totalBalanceLabel: 'Баланс 2028:',
      coverageLabel: 'Покриття:',
      vitalityLabel: 'Індекс Демографічної Вітальності:',
    };
  }

  // Polish default
  return {
    heroCtaRanking: 'Ranking Witalności TOP 6',
    heroCtaForecast: 'Predykcje 2028 & B2B',
    heroCapabilitiesToggleBtn: 'Co oferuje Tryb Urzędnika i Inwestora? (Poznaj możliwości)',
    heroCapabilitiesCloseBtn: 'Zwiń możliwości modułu',

    heroStatSeniorsLabel: 'Mieszkańcy Seniorzy (65+)',
    heroStatSeniorsSub: '21.9% populacji Krakowa (BDK)',
    heroStatEnrolledLabel: 'Miejsc w Edukacji i Opiece',
    heroStatEnrolledSub: (pct) => `Żłobki, przedszkola i szkoły (${pct}% szkoły)`,
    heroStatPriceLabel: 'Średnia Cena Mieszkań',
    heroStatPriceSub: 'Rynek nieruchomości w Krakowie',
    heroStatB2BLabel: 'Strefy Hotspot B2B',
    heroStatB2BSub: (districts) => `Dzielnice ${districts}`,

    sectionTitle: 'Predykcje Demograficzne 2028 & Potencjał Inwestycyjny B2B/B2G',
    sectionSubtitle:
      'Zintegrowane modele ekonometryczne prognozujące popyt na żłobki, przedszkola i szkoły podstawowe (0–14 lat) do 2028 roku wraz z priorytetyzacją inwestycji miejskich i prywatnych dla 18 dzielnic Krakowa.',
    badgeSection: 'Wspomaganie Decyzji & Prognoza 2028',

    macroToddlersTitle: 'Popyt 0–3 (Prognoza 2028)',
    macroToddlersSub: (growth) => `Trend meldunkowy (${growth >= 0 ? `+${growth}` : growth}%)`,
    macroPreschoolTitle: 'Popyt 4–6 (Prognoza 2028)',
    macroPreschoolSub: (growth) => `Niż demograficzny (${growth >= 0 ? `+${growth}` : growth}%)`,
    macroStudentsTitle: 'Popyt 7–14 (Szkoły)',
    macroStudentsSub: (share) => `57.6 tys. uczniów (${share}% dzieci)`,
    macroB2BTitle: 'Strefy Hotspot B2B',
    macroB2BSub: 'Pilna potrzeba placówek prywatnych',

    filterAll: 'Wszystkie Dzielnice',
    filterHigh: 'Wysoki Priorytet B2B',
    filterMedium: 'Umiarkowany Potencjał',
    filterLow: 'Rynek Nasycony',

    placesUnit: 'miejsc',
    balanceUnit: 'bilans',
    deficitUnit: 'deficyt miejsc',
    studentsUnit: 'uczniów',
    schoolsUnit: 'szkół',
    currentLabel: 'Obecnie:',
    forecast2028Label: 'Prognoza 2028:',
    toddlersLabel: '0–3 lata (Żłobki):',
    preschoolersLabel: '4–6 lat (Przedszkola):',
    studentsLabel: '7–14 lat (Szkoły Podstawowe):',
    placesLabel: 'Baza miejsc:',
    balance2028Label: 'Bilans 2028:',
    schoolBalanceShortLabel: 'Bilans 2028:',
    classSizeUnit: 'os./klasę',
    totalCardSummaryLabel: 'Łączny Bilans (0–14):',
    coverageShortLabel: 'Pokrycie:',
    b2bBadge: {
      HIGH: 'Wysoki Potencjał B2B',
      MEDIUM: 'Umiarkowany Potencjał',
      LOW: 'Rynek Nasycony',
    },
    detailsBtn: 'Analiza & Rekomendacja',
    closeBtn: 'Zamknij Analizę',

    prevPage: 'Poprzednia',
    nextPage: 'Następna',
    showingDistricts: (from, to, total) => `Wyświetlanie ${from}–${to} z ${total} dzielnic`,

    drawerTitle: 'Strategiczny Profil Inwestycyjny i Rekomendacja Miejska',
    drawerBadge: 'Wsparcie Decyzji B2G & B2B',
    educationalRecommendationTitle: 'Strategiczna Rekomendacja Edukacyjno-Opiekuńcza (0–14 lat):',
    sectorDeficitsTitle: 'Ocena Deficytów Sektorowych Dzielnicy',
    nurseryB2BLabel: 'Potencjał Inwestycyjny Żłobków (B2B):',
    seniorDeficitLabel: 'Deficyt Centrów Aktywności Seniora (CAS):',
    greenDeficitLabel: 'Deficyt Zieleni i Parków Kieszonkowych:',
    deficitLevels: {
      HIGH: 'Wysoki Priorytet (Znaczny Deficyt)',
      MEDIUM: 'Umiarkowany Deficyt',
      LOW: 'Niski Deficyt (Stabilnie)',
    },
    demographics2028Title: 'Zestawienie Predykcji Demograficznych & Bazy Oświatowej 2028',
    toddlerCohortSubtitle: 'Prognoza rocznika 0–3 na 2028 rok',
    preschoolCohortSubtitle: 'Prognoza rocznika 4–6 na 2028 rok',
    schoolCohortSubtitle: 'Prognoza rocznika 7–14 na 2028 rok',
    totalSummaryTitle: 'Podsumowanie Edu-Care (0–14)',
    totalSummarySubtitle: 'Łączna prognoza roczników 0–14 na 2028 rok',
    totalDemandLabel: 'Łączny popyt (0–14):',
    totalPlacesLabel: 'Baza miejsc:',
    totalBalanceLabel: 'Bilans 2028:',
    coverageLabel: 'Pokrycie:',
    vitalityLabel: 'Wskaźnik Witalności Demograficznej:',
  };
}

/// <summary>
/// Generates trilingual (PL, EN, UA) strategic decision-support recommendation
/// based on 2028 demographic forecasting and educational balance.
/// </summary>
export function getEducationalRecommendation(
  data: {
    nurseryPotentialB2B: 'HIGH' | 'MEDIUM' | 'LOW';
    nurseryBalance2028: number;
    kindergartenBalance2028: number;
    schoolPlacesBalance2028: number;
    avgStudentsPerClass: number;
  },
  language: Language
): string {
  const {
    nurseryPotentialB2B,
    nurseryBalance2028,
    kindergartenBalance2028,
    schoolPlacesBalance2028,
    avgStudentsPerClass,
  } = data;

  if (language === 'en') {
    if (nurseryPotentialB2B === 'HIGH') {
      return `Urgent need to launch 1–2 new 0–3 childcare facilities (municipal or B2B partnership) driven by a high deficit (${nurseryBalance2028} places) and dynamic inflow of families with children.`;
    }
    if (schoolPlacesBalance2028 < -300) {
      return `Necessary expansion of primary school capacity (projected catchment balance: ${schoolPlacesBalance2028} places) or school district redistricting, while monitoring nursery enrollment stability.`;
    }
    if (nurseryBalance2028 < -100 && kindergartenBalance2028 > 400) {
      return `Recommended adaptation of vacated kindergarten classrooms (demographic reserve: +${kindergartenBalance2028} places) into nursery groups, mitigating the infant care deficit.`;
    }
    if (nurseryBalance2028 >= 0 && schoolPlacesBalance2028 > 1000) {
      return `Stable childcare and education infrastructure with a substantial educational reserve (+${schoolPlacesBalance2028} places). Recommended retention of smaller classroom sizes (${avgStudentsPerClass.toFixed(1)} students/class) and expansion of specialized programs.`;
    }
    return `Balanced edu-care market. Recommended grant subsidies for private operators and ongoing tracking of saturation indices across newly developed housing estates.`;
  }

  if (language === 'ua') {
    if (nurseryPotentialB2B === 'HIGH') {
      return `Термінова потреба у відкритті 1–2 нових закладів догляду 0–3 (муніципальних або у моделі B2B-партнерства) через значний дефіцит (${nurseryBalance2028} місць) та динамічний приплив сімей з дітьми.`;
    }
    if (schoolPlacesBalance2028 < -300) {
      return `Необхідне розширення мережі початкових шкіл (прогнозований районний баланс: ${schoolPlacesBalance2028} місць) або реорганізація шкільних округів із постійним моніторингом набору до ясел.`;
    }
    if (nurseryBalance2028 < -100 && kindergartenBalance2028 > 400) {
      return `Рекомендована адаптація вивільнених приміщень дитсадків (демографічний резерв: +${kindergartenBalance2028} місць) під ясельні групи для зменшення дефіциту місць для наймолодших.`;
    }
    if (nurseryBalance2028 >= 0 && schoolPlacesBalance2028 > 1000) {
      return `Стабільна навчально-виховна база з високим освітнім резервом (+${schoolPlacesBalance2028} місць). Рекомендовано збереження камерних класів (${avgStudentsPerClass.toFixed(1)} уч./клас) та розвиток профільних програм.`;
    }
    return `Збалансований ринок edu-care. Рекомендована дотаційна підтримка приватних операторів та регулярний моніторинг показників забезпеченості в районах новобудов.`;
  }

  // Polish default
  if (nurseryPotentialB2B === 'HIGH') {
    return `Pilna potrzeba uruchomienia 1–2 nowych placówek opieki 0–3 (samorządowych lub w modelu partnerstwa B2B) ze względu na wysoki deficyt (${nurseryBalance2028} miejsc) i dynamiczny napływ rodzin z dziećmi.`;
  }
  if (schoolPlacesBalance2028 < -300) {
    return `Konieczna rozbudowa bazy szkół podstawowych (prognozowany bilans rejonowy: ${schoolPlacesBalance2028} miejsc) lub reorganizacja obwodów szkolnych przy jednoczesnym monitorowaniu stabilności naborów żłobkowych.`;
  }
  if (nurseryBalance2028 < -100 && kindergartenBalance2028 > 400) {
    return `Rekomendowana adaptacja części zwalniających się sal przedszkolnych (rezerwa niżu: +${kindergartenBalance2028} miejsc) na oddziały żłobkowe, co pozwoli zniwelować deficyt opieki najmłodszych.`;
  }
  if (nurseryBalance2028 >= 0 && schoolPlacesBalance2028 > 1000) {
    return `Stabilna baza opiekuńczo-edukacyjna o wysokiej rezerwie oświatowej (+${schoolPlacesBalance2028} miejsc). Rekomendowane utrzymanie kameralnych oddziałów szkolnych (${avgStudentsPerClass.toFixed(1)} os./klasę) oraz rozwój oferty profilowanej.`;
  }
  return `Zrównoważony rynek edu-care. Rekomendowane wsparcie dotacyjne dla operatorów niepublicznych oraz bieżący monitoring wskaźników nasycenia w rejonach nowych osiedli.`;
}
