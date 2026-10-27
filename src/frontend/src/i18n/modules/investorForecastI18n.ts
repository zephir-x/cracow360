import type { Language } from '../types';

export interface EduRecommendationInput {
  nurseryPotentialB2B: 'HIGH' | 'MEDIUM' | 'LOW';
  nurseryBalance2028: number;
  kindergartenBalance2028: number;
  schoolPlacesBalance2028: number;
  avgStudentsPerClass: number;
}

export interface InvestorForecastLabels {
  heroCtaRanking: string;
  heroCtaForecast: string;
  heroCtaSimulator: string;
  heroStatSeniorsLabel: string;
  heroStatSeniorsSub: (pct: number) => string;
  heroStatEnrolledLabel: string;
  heroStatEnrolledSub: (pct: number) => string;
  heroStatPriceLabel: string;
  heroStatPriceSub: string;
  heroStatB2BLabel: string;
  heroStatB2BSub: (districtsStr: string) => string;
  heroCapabilitiesToggleBtn: string;
  heroCapabilitiesCloseBtn: string;

  badgeSection: string;
  sectionTitle: string;
  sectionSubtitle: string;

  macroToddlersTitle: string;
  macroToddlersSub: (pct: number) => string;
  macroPreschoolTitle: string;
  macroPreschoolSub: (pct: number) => string;
  macroStudentsTitle: string;
  macroStudentsSub: (pct: number) => string;
  macroB2BTitle: string;
  macroB2BSub: string;

  filterAll: string;
  filterHigh: string;
  filterMedium: string;
  filterLow: string;

  b2bBadge: {
    HIGH: string;
    MEDIUM: string;
    LOW: string;
  };

  toddlersLabel: string;
  preschoolersLabel: string;
  studentsLabel: string;
  placesUnit: string;
  balance2028Label: string;
  totalCardSummaryLabel: string;
  detailsBtn: string;
  closeBtn: string;

  showingDistricts: (from: number, to: number, total: number) => string;
  prevPage: string;
  nextPage: string;

  drawerBadge: string;
  drawerTitle: string;
  educationalRecommendationTitle: string;
  demographics2028Title: string;
  vitalityLabel: string;
  toddlerCohortSubtitle: string;
  preschoolCohortSubtitle: string;
  schoolCohortSubtitle: string;
  placesLabel: string;
  totalSummaryTitle: string;
  totalSummarySubtitle: string;
  totalPlacesLabel: string;
  totalBalanceLabel: string;
  coverageLabel: string;
}

const PL_LABELS: InvestorForecastLabels = {
  heroCtaRanking: 'Ranking rozwoju',
  heroCtaForecast: 'Prognoza edukacji 2028',
  heroCtaSimulator: 'Symulator na żywo',
  heroStatSeniorsLabel: 'Mieszkańcy 65+ (Seniorzy)',
  heroStatSeniorsSub: (pct) => `${pct}% populacji Krakowa`,
  heroStatEnrolledLabel: 'Miejsca w placówkach (0–14)',
  heroStatEnrolledSub: (pct) => `Szkoły podstawowe: ${pct}% bazy`,
  heroStatPriceLabel: 'Średnia cena mieszkań',
  heroStatPriceSub: 'Średnia stawka za m² w mieście',
  heroStatB2BLabel: 'Dzielnice z pilnym brakiem miejsc',
  heroStatB2BSub: (str) => `Dzielnice: ${str}`,
  heroCapabilitiesToggleBtn: 'Co oferuje Tryb Urzędnika i Inwestora? (Zobacz możliwości)',
  heroCapabilitiesCloseBtn: 'Zwiń opis możliwości',

  badgeSection: 'Prognoza Demograficzna 2028 • Segment Edukacji i Opieki (0–14 lat)',
  sectionTitle: 'Prognozy Demograficzne 2028 dla Segmentu Edukacji i Potrzeby Rozbudowy Placówek',
  sectionSubtitle:
    'Moduł dedykowany wyłącznie prognozie demograficznej do 2028 roku dla sektora edukacji i opieki (żłobki 0–3, przedszkola 4–6 oraz szkoły podstawowe 7–14 lat). Zestawia obecną liczbę dzieci z prognozą na 2028 rok i wskazuje dzielnice, w których w kolejnych latach najbardziej zabraknie miejsc.',

  macroToddlersTitle: 'Prognoza dzieci 0–3 lata (2028)',
  macroToddlersSub: (pct) => `Zmiana do 2028 r.: ${pct >= 0 ? `+${pct}%` : `${pct}%`}`,
  macroPreschoolTitle: 'Prognoza przedszkolaków 4–6 (2028)',
  macroPreschoolSub: (pct) => `Zmiana do 2028 r.: ${pct >= 0 ? `+${pct}%` : `${pct}%`}`,
  macroStudentsTitle: 'Prognoza uczniów 7–14 lat (2028)',
  macroStudentsSub: (pct) => `Zmiana do 2028 r.: ${pct >= 0 ? `+${pct}%` : `${pct}%`}`,
  macroB2BTitle: 'Dzielnice z największymi brakami',
  macroB2BSub: 'Pilna potrzeba budowy nowych placówek',

  filterAll: 'Wszystkie dzielnice',
  filterHigh: 'Pilna potrzeba rozbudowy',
  filterMedium: 'Umiarkowane zapotrzebowanie',
  filterLow: 'Dobra dostępność miejsc',

  b2bBadge: {
    HIGH: 'Pilna potrzeba rozbudowy',
    MEDIUM: 'Umiarkowane potrzeby',
    LOW: 'Dobra dostępność',
  },

  toddlersLabel: 'Żłobki (0–3 lata)',
  preschoolersLabel: 'Przedszkola (4–6 lat)',
  studentsLabel: 'Szkoły (7–14 lat)',
  placesUnit: 'miejsc',
  balance2028Label: 'Bilans 2028:',
  totalCardSummaryLabel: 'Łączny bilans 0–14 (2028):',
  detailsBtn: 'Szczegóły i wnioski',
  closeBtn: 'Zamknij szczegóły',

  showingDistricts: (from, to, total) => `Wyświetlanie ${from}–${to} z ${total} dzielnic`,
  prevPage: 'Poprzednia',
  nextPage: 'Następna',

  drawerBadge: 'Szczegółowa prognoza edukacji dla dzielnicy (2028)',
  drawerTitle: 'Prognoza zmian liczby dzieci (0–14 lat) oraz dostępności miejsc w placówkach edukacyjnych do 2028 roku',
  educationalRecommendationTitle: 'Wnioski z prognozy 2028 dla segmentu edukacji',
  demographics2028Title: 'Prognoza liczby dzieci i bilans miejsc w 2028 roku',
  vitalityLabel: 'Wskaźnik rozwoju demograficznego:',
  toddlerCohortSubtitle: 'Zmiana liczby dzieci 0–3 lata do 2028 r.',
  preschoolCohortSubtitle: 'Zmiana liczby dzieci 4–6 lat do 2028 r.',
  schoolCohortSubtitle: 'Zmiana liczby uczniów 7–14 lat do 2028 r.',
  placesLabel: 'Obecna liczba miejsc:',
  totalSummaryTitle: 'Razem dzieci (0–14 lat)',
  totalSummarySubtitle: 'Łączna zmiana liczby dzieci do 2028 r.',
  totalPlacesLabel: 'Wszystkie miejsca 0–14:',
  totalBalanceLabel: 'Łączny bilans 2028:',
  coverageLabel: 'pokrycie',
};

const EN_LABELS: InvestorForecastLabels = {
  heroCtaRanking: 'Growth ranking',
  heroCtaForecast: '2028 Education Forecast',
  heroCtaSimulator: 'Live simulator',
  heroStatSeniorsLabel: 'Residents 65+ (Seniors)',
  heroStatSeniorsSub: (pct) => `${pct}% of Krakow's population`,
  heroStatEnrolledLabel: 'Facility places (0–14)',
  heroStatEnrolledSub: (pct) => `Primary schools: ${pct}% of total`,
  heroStatPriceLabel: 'Average housing price',
  heroStatPriceSub: 'Average rate per m² in the city',
  heroStatB2BLabel: 'Districts with urgent shortages',
  heroStatB2BSub: (str) => `Districts: ${str}`,
  heroCapabilitiesToggleBtn: 'What does Official & Investor Mode offer? (Explore features)',
  heroCapabilitiesCloseBtn: 'Collapse feature details',

  badgeSection: 'Demographic Forecast 2028 • Education & Childcare Segment (0–14 yrs)',
  sectionTitle: '2028 Demographic Projections for Education & Facility Expansion Needs',
  sectionSubtitle:
    'Dedicated 2028 demographic forecast module for the education and childcare sector (nurseries 0–3, kindergartens 4–6, and primary schools 7–14 yrs). Compares current child counts with 2028 projections to highlight districts where educational places will be needed most.',

  macroToddlersTitle: 'Projected toddlers 0–3 (2028)',
  macroToddlersSub: (pct) => `Change by 2028: ${pct >= 0 ? `+${pct}%` : `${pct}%`}`,
  macroPreschoolTitle: 'Projected preschoolers 4–6 (2028)',
  macroPreschoolSub: (pct) => `Change by 2028: ${pct >= 0 ? `+${pct}%` : `${pct}%`}`,
  macroStudentsTitle: 'Projected students 7–14 (2028)',
  macroStudentsSub: (pct) => `Change by 2028: ${pct >= 0 ? `+${pct}%` : `${pct}%`}`,
  macroB2BTitle: 'Districts with highest shortages',
  macroB2BSub: 'Urgent need to build new facilities',

  filterAll: 'All districts',
  filterHigh: 'Urgent expansion need',
  filterMedium: 'Moderate demand',
  filterLow: 'Good place availability',

  b2bBadge: {
    HIGH: 'Urgent expansion need',
    MEDIUM: 'Moderate need',
    LOW: 'Good availability',
  },

  toddlersLabel: 'Nurseries (0–3 yrs)',
  preschoolersLabel: 'Kindergartens (4–6 yrs)',
  studentsLabel: 'Schools (7–14 yrs)',
  placesUnit: 'places',
  balance2028Label: '2028 Balance:',
  totalCardSummaryLabel: 'Total balance 0–14 (2028):',
  detailsBtn: 'Details & summary',
  closeBtn: 'Close details',

  showingDistricts: (from, to, total) => `Showing ${from}–${to} of ${total} districts`,
  prevPage: 'Previous',
  nextPage: 'Next',

  drawerBadge: 'Detailed district education forecast (2028)',
  drawerTitle: 'Projected child population changes (0–14 yrs) and educational facility place availability up to 2028',
  educationalRecommendationTitle: '2028 forecast conclusions for the education sector',
  demographics2028Title: 'Projected child population and places balance in 2028',
  vitalityLabel: 'Demographic growth score:',
  toddlerCohortSubtitle: 'Change in children 0–3 yrs by 2028',
  preschoolCohortSubtitle: 'Change in children 4–6 yrs by 2028',
  schoolCohortSubtitle: 'Change in students 7–14 yrs by 2028',
  placesLabel: 'Current places:',
  totalSummaryTitle: 'Total children (0–14 yrs)',
  totalSummarySubtitle: 'Combined change in children by 2028',
  totalPlacesLabel: 'Total places 0–14:',
  totalBalanceLabel: 'Total 2028 balance:',
  coverageLabel: 'coverage',
};

const UA_LABELS: InvestorForecastLabels = {
  heroCtaRanking: 'Рейтинг розвитку',
  heroCtaForecast: 'Прогноз освіти 2028',
  heroCtaSimulator: 'Симулятор наживо',
  heroStatSeniorsLabel: 'Мешканці 65+ (Сеньйори)',
  heroStatSeniorsSub: (pct) => `${pct}% популяції Кракова`,
  heroStatEnrolledLabel: 'Місця в закладах (0–14)',
  heroStatEnrolledSub: (pct) => `Початкові школи: ${pct}% бази`,
  heroStatPriceLabel: 'Середня ціна житла',
  heroStatPriceSub: 'Середня ставка за м² у місті',
  heroStatB2BLabel: 'Райони з гострою нестачею місць',
  heroStatB2BSub: (str) => `Райони: ${str}`,
  heroCapabilitiesToggleBtn: 'Що пропонує Режим Посадовця та Інвестора? (Огляд можливостей)',
  heroCapabilitiesCloseBtn: 'Згорнути опис можливостей',

  badgeSection: 'Демографічний Прогноз 2028 • Сегмент Освіти та Опіки (0–14 років)',
  sectionTitle: 'Демографічні Прогнози 2028 для Сегменту Освіти та Потреби Розбудови Закладів',
  sectionSubtitle:
    'Модуль, присвячений виключно демографічному прогнозу до 2028 року для сектору освіти та опіки (ясла 0–3, дитсадки 4–6 та початкові школи 7–14 років). Порівнює поточну кількість дітей із прогнозом на 2028 рік і вказує райони, де найбільше бракуватиме місць.',

  macroToddlersTitle: 'Прогноз дітей 0–3 роки (2028)',
  macroToddlersSub: (pct) => `Зміна до 2028 р.: ${pct >= 0 ? `+${pct}%` : `${pct}%`}`,
  macroPreschoolTitle: 'Прогноз дошкільнят 4–6 (2028)',
  macroPreschoolSub: (pct) => `Зміна до 2028 р.: ${pct >= 0 ? `+${pct}%` : `${pct}%`}`,
  macroStudentsTitle: 'Прогноз учнів 7–14 років (2028)',
  macroStudentsSub: (pct) => `Зміна до 2028 р.: ${pct >= 0 ? `+${pct}%` : `${pct}%`}`,
  macroB2BTitle: 'Райони з найбільшим браком місць',
  macroB2BSub: 'Терміново потрібно будувати об єкти',

  filterAll: 'Усі райони',
  filterHigh: 'Нагальна потреба розбудови',
  filterMedium: 'Помірна потреба',
  filterLow: 'Добра доступність місць',

  b2bBadge: {
    HIGH: 'Нагальна потреба розбудови',
    MEDIUM: 'Помірна потреба',
    LOW: 'Добра доступність',
  },

  toddlersLabel: 'Ясла (0–3 роки)',
  preschoolersLabel: 'Дитсадки (4–6 років)',
  studentsLabel: 'Школи (7–14 років)',
  placesUnit: 'місць',
  balance2028Label: 'Баланс 2028:',
  totalCardSummaryLabel: 'Загальний баланс 0–14 (2028):',
  detailsBtn: 'Деталі та висновки',
  closeBtn: 'Закрити деталі',

  showingDistricts: (from, to, total) => `Показано ${from}–${to} з ${total} районів`,
  prevPage: 'Попередня',
  nextPage: 'Наступна',

  drawerBadge: 'Детальний прогноз освіти для району (2028)',
  drawerTitle: 'Прогноз зміни кількості дітей (0–14 років) та доступності місць у закладах освіти до 2028 року',
  educationalRecommendationTitle: 'Висновки з прогнозу 2028 для сегменту освіти',
  demographics2028Title: 'Прогноз кількості дітей та баланс місць у 2028 році',
  vitalityLabel: 'Показник демографічного розвитку:',
  toddlerCohortSubtitle: 'Зміна кількості дітей 0–3 роки до 2028 р.',
  preschoolCohortSubtitle: 'Зміна кількості дітей 4–6 років до 2028 р.',
  schoolCohortSubtitle: 'Зміна кількості учнів 7–14 років до 2028 р.',
  placesLabel: 'Наявна кількість місць:',
  totalSummaryTitle: 'Разом дітей (0–14 років)',
  totalSummarySubtitle: 'Сукупна зміна кількості дітей до 2028 р.',
  totalPlacesLabel: 'Усі місця 0–14:',
  totalBalanceLabel: 'Загальний баланс 2028:',
  coverageLabel: 'покриття',
};

export const INVESTOR_FORECAST_I18N = {
  pl: PL_LABELS,
  en: EN_LABELS,
  ua: UA_LABELS,
};

export function getInvestorForecastLabels(language: Language): InvestorForecastLabels {
  if (language === 'en') return EN_LABELS;
  if (language === 'ua') return UA_LABELS;
  return PL_LABELS;
}

export function getEducationalRecommendation(
  data: EduRecommendationInput,
  language: Language = 'pl'
): string {
  const {
    nurseryPotentialB2B,
    nurseryBalance2028,
    kindergartenBalance2028,
    schoolPlacesBalance2028,
    avgStudentsPerClass,
  } = data;

  const absNursery = Math.abs(nurseryBalance2028);
  const absKinder = Math.abs(kindergartenBalance2028);
  const absSchool = Math.abs(schoolPlacesBalance2028);

  if (language === 'en') {
    if (nurseryPotentialB2B === 'HIGH') {
      const schoolNote =
        schoolPlacesBalance2028 < 0
          ? `Primary schools also face a projected shortage of ${absSchool} places (avg. ${avgStudentsPerClass} pupils/class)`
          : `Primary schools maintain a reserve of +${schoolPlacesBalance2028} places (avg. ${avgStudentsPerClass} pupils/class)`;
      return `Urgent need for new educational facilities (projected 2028 nursery shortage: ${absNursery} places for ages 0–3; ${
        kindergartenBalance2028 < 0
          ? `kindergarten gap: ${absKinder} places`
          : `kindergarten reserve: +${kindergartenBalance2028} places`
      }). ${schoolNote}. Test adding new facilities in the live simulator below!`;
    }
    if (nurseryPotentialB2B === 'MEDIUM') {
      return `Moderate need for new childcare places (2028 nursery balance: ${
        nurseryBalance2028 >= 0 ? `+${nurseryBalance2028}` : nurseryBalance2028
      } places). ${
        schoolPlacesBalance2028 < 0
          ? `Primary schools will need approx. ${absSchool} additional places by 2028.`
          : `Primary schools and kindergartens have stable capacity (+${schoolPlacesBalance2028} school places).`
      }`;
    }
    return `Good overall availability of educational places in the 2028 horizon (2028 nursery balance: ${
      nurseryBalance2028 >= 0 ? `+${nurseryBalance2028}` : nurseryBalance2028
    } places, kindergartens: +${kindergartenBalance2028}, schools: +${schoolPlacesBalance2028}, avg. ${avgStudentsPerClass} pupils per class). Worth focusing on green areas, senior centers (CAS), and public transit in the live simulator below.`;
  }

  if (language === 'ua') {
    if (nurseryPotentialB2B === 'HIGH') {
      const schoolNote =
        schoolPlacesBalance2028 < 0
          ? `У початкових школах також прогнозується дефіцит ${absSchool} місць (сер. ${avgStudentsPerClass} учнів у класі)`
          : `Початкові школи зберігають резерв +${schoolPlacesBalance2028} місць (сер. ${avgStudentsPerClass} учнів у класі)`;
      return `Нагальна потреба у розбудові освітніх закладів (прогнозований дефіцит у яслах 2028 р.: ${absNursery} місць для віку 0–3 роки; ${
        kindergartenBalance2028 < 0
          ? `нестача в дитсадках: ${absKinder} місць`
          : `резерв у дитсадках: +${kindergartenBalance2028} місць`
      }). ${schoolNote}. Перевірте ефект додавання нових закладів у симуляторі нижче!`;
    }
    if (nurseryPotentialB2B === 'MEDIUM') {
      return `Помірна потреба у додаткових місцях догляду (баланс ясел 2028: ${
        nurseryBalance2028 >= 0 ? `+${nurseryBalance2028}` : nurseryBalance2028
      } місць). ${
        schoolPlacesBalance2028 < 0
          ? `Початковим школам до 2028 року знадобиться близько ${absSchool} додаткових місць.`
          : `Початкові школи та дитсадки мають стабільний запас місць (+${schoolPlacesBalance2028} у школах).`
      }`;
    }
    return `Добра загальна доступність освітніх місць у горизонті 2028 року (баланс ясел 2028: ${
      nurseryBalance2028 >= 0 ? `+${nurseryBalance2028}` : nurseryBalance2028
    } місць, дитсадки: +${kindergartenBalance2028}, школи: +${schoolPlacesBalance2028}, у середньому ${avgStudentsPerClass} учнів у класі). Варто зосередитися на розвитку парків, клубів сеньйорів (CAS) та транспорту в симуляторі нижче.`;
  }

  // Default: Polish (natural, clear, zero corporate jargon)
  if (nurseryPotentialB2B === 'HIGH') {
    const schoolNote =
      schoolPlacesBalance2028 < 0
        ? `W szkołach podstawowych również prognozowany jest niedobór ${absSchool} miejsc (śr. ${avgStudentsPerClass} uczniów w klasie)`
        : `Szkoły podstawowe utrzymują zapas +${schoolPlacesBalance2028} miejsc (śr. ${avgStudentsPerClass} uczniów w klasie)`;
    return `Pilna potrzeba budowy nowych placówek edukacyjnych (w 2028 r. prognozowany brak w żłobkach to ${absNursery} miejsc dla maluchów 0–3 lata; ${
      kindergartenBalance2028 < 0
        ? `w przedszkolach brak ok. ${absKinder} miejsc`
        : `przedszkola utrzymują zapas +${kindergartenBalance2028} miejsc`
    }). ${schoolNote}. Sprawdź w symulatorze poniżej, jak dodanie nowych placówek poprawi aktualne wyniki dzielnicy!`;
  }
  if (nurseryPotentialB2B === 'MEDIUM') {
    return `Umiarkowane zapotrzebowanie na nowe miejsca opieki (bilans żłobków w 2028 r.: ${
      nurseryBalance2028 >= 0 ? `+${nurseryBalance2028}` : nurseryBalance2028
    } miejsc). ${
      schoolPlacesBalance2028 < 0
        ? `W szkołach podstawowych do 2028 r. przyda się ok. ${absSchool} dodatkowych miejsc.`
        : `Szkoły podstawowe i przedszkola dysponują stabilną rezerwą miejsc (+${schoolPlacesBalance2028} miejsc w szkołach).`
    }`;
  }
  return `Dobra łączna dostępność miejsc edukacyjnych w perspektywie 2028 r. (bilans żłobków 2028: ${
    nurseryBalance2028 >= 0 ? `+${nurseryBalance2028}` : nurseryBalance2028
  } miejsc, przedszkola: +${kindergartenBalance2028}, szkoły: +${schoolPlacesBalance2028}, średnio ${avgStudentsPerClass} uczniów w klasie). W tej dzielnicy warto przetestować w symulatorze poniżej wpływ nowych parków, przystanków KMK lub Centrów Aktywności Seniora (CAS).`;
}
