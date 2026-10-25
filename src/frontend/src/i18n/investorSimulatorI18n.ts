import type { Language } from './types';
import type {
  BaselineDistrictMetrics,
  SimulatedDistrictMetrics,
  SimulatedMarketStatus,
} from '../components/investor-mode/simulator-what-if/types';

export interface InvestorSimulatorLabels {
  // Section Header
  sectionBadge: string;
  sectionTitle: string;
  sectionSubtitle: string;

  // Toolbar & District Selector
  selectDistrictLabel: string;
  selectDistrictPlaceholder: string;
  resetLeversBtn: string;
  baselineSnapshotTitle: string;
  presetTitle: string;
  presets: {
    municipalPackage: string;
    b2bNurseries: string;
    greenAndSenior: string;
  };

  // Levers
  leversHeaderTitle: string;
  leversHeaderSubtitle: string;
  nurseryLeverTitle: string;
  nurseryLeverSubtitle: string;
  nurseryLeverUnit: (count: number) => string;
  casLeverTitle: string;
  casLeverSubtitle: string;
  casLeverUnit: (count: number) => string;
  parksLeverTitle: string;
  parksLeverSubtitle: string;
  parksLeverUnit: (count: number) => string;

  // Estimated Investment CAPEX
  capexTotalTitle: string;
  capexTotalSubtitle: string;
  capexCurrency: string;
  capexNurseryPart: string;
  capexCasPart: string;
  capexParksPart: string;

  // Impact Display Cards
  impactHeaderTitle: string;
  impactHeaderSubtitle: string;
  beforeLabel: string;
  afterLabel: string;
  deltaLabel: string;

  cardNurseryTitle: string;
  cardNurseryCoverageLabel: string;
  cardNurseryDeficitRelief: (places: number, pct: number) => string;

  cardVitalityTitle: string;
  cardVitalitySub: string;
  cardVitalityPoints: string;

  cardInfraTitle: string;
  cardInfraCasLabel: string;
  cardInfraParksLabel: string;
  cardInfraGreenPerCapita: string;

  cardStatusTitle: string;
  marketStatuses: Record<SimulatedMarketStatus, string>;
  marketStatusDesc: Record<SimulatedMarketStatus, string>;

  // Dynamic Municipal Justification Note
  generateDecisionNote: (
    baseline: BaselineDistrictMetrics,
    simulated: SimulatedDistrictMetrics,
    districtLocalized: string
  ) => string;

  // Municipal Guidelines Matrix (Senior CAS & Greenery deficits)
  guidelinesBadge: string;
  guidelinesTitle: string;
  guidelinesSubtitle: string;

  casMatrixTitle: string;
  casMatrixSubtitle: string;
  casPriorityDistricts: string;
  casRecommendationText: string;

  greenMatrixTitle: string;
  greenMatrixSubtitle: string;
  greenPriorityDistricts: string;
  greenRecommendationText: string;

  financeMatrixTitle: string;
  financeMatrixSubtitle: string;
  financeModels: {
    pppTitle: string;
    pppDesc: string;
    maluchTitle: string;
    maluchDesc: string;
    grantsTitle: string;
    grantsDesc: string;
  };

  finalExecutiveNotice: string;
}

export function getInvestorSimulatorLabels(language: Language): InvestorSimulatorLabels {
  if (language === 'en') {
    return {
      sectionBadge: 'What-If Investment Simulator & Municipal Guidelines',
      sectionTitle: 'Infrastructure Impact Simulator & Strategic Directives (B2G / B2B)',
      sectionSubtitle:
        'Interactive econometric sandbox for municipal decision-makers (UMK) and institutional investors: test the live impact of opening new nursery places, Senior Activity Centers (CAS), or pocket parks on district vitality, deficit relief, and coverage indices.',

      selectDistrictLabel: 'Target District for Simulation:',
      selectDistrictPlaceholder: 'Select one of 18 districts...',
      resetLeversBtn: 'Reset Levers',
      baselineSnapshotTitle: 'Baseline District Snapshot',
      presetTitle: 'Quick Investment Presets:',
      presets: {
        municipalPackage: 'Standard Municipal Package (+120 places, +1 CAS, +1 park)',
        b2bNurseries: 'Private Nursery B2B Focus (+180 places)',
        greenAndSenior: 'Civic Revitalization (+2 CAS, +2 parks)',
      },

      leversHeaderTitle: 'Investment Levers & Capital Outlay',
      leversHeaderSubtitle: 'Adjust scale of planned municipal or private capital interventions:',
      nurseryLeverTitle: 'New Nursery Places (0–3 yrs)',
      nurseryLeverSubtitle: 'New facilities or kindergarten room conversions (Maluch+ / B2B)',
      nurseryLeverUnit: (count) => (count === 1 ? 'place' : 'places'),
      casLeverTitle: 'New Senior Activity Centers (CAS)',
      casLeverSubtitle: 'Dedicated integration & cultural hubs for seniors (65+)',
      casLeverUnit: (count) => (count === 1 ? 'center' : 'centers'),
      parksLeverTitle: 'New Pocket Parks & Green Spaces',
      parksLeverSubtitle: 'Micro-parks within 300m walking radius (Krakowian Gardens)',
      parksLeverUnit: (count) => (count === 1 ? 'park' : 'parks'),

      capexTotalTitle: 'Estimated Investment Outlay (CAPEX)',
      capexTotalSubtitle: 'Benchmark municipal / private capital expenditure estimate',
      capexCurrency: 'PLN',
      capexNurseryPart: 'Childcare:',
      capexCasPart: 'Senior Centers:',
      capexParksPart: 'Pocket Parks:',

      impactHeaderTitle: 'Simulated Impact & Outcome Telemetry',
      impactHeaderSubtitle: 'Live comparison: Current Baseline vs. Post-Investment Projections',
      beforeLabel: 'Baseline',
      afterLabel: 'Post-Investment',
      deltaLabel: 'Net Change',

      cardNurseryTitle: '2028 Childcare Balance & Coverage',
      cardNurseryCoverageLabel: 'Demand coverage:',
      cardNurseryDeficitRelief: (places, pct) =>
        `Deficit reduced by ${places} places (+${pct}% coverage)`,

      cardVitalityTitle: 'Demographic Vitality Index',
      cardVitalitySub: 'Composite quality of life & migration attraction index',
      cardVitalityPoints: 'pts',

      cardInfraTitle: 'Social & Green Infrastructure',
      cardInfraCasLabel: 'Senior Activity Centers:',
      cardInfraParksLabel: 'Pocket Parks:',
      cardInfraGreenPerCapita: 'm² green/capita',

      cardStatusTitle: 'District Investment Status',
      marketStatuses: {
        CRITICAL_DEFICIT: 'Severe Supply Deficit',
        MODERATE_DEFICIT: 'Moderate Deficit',
        BALANCED: 'Balanced Market',
        SURPLUS: 'Supply Reserve (Surplus)',
      },
      marketStatusDesc: {
        CRITICAL_DEFICIT: 'Urgent priority for new public nurseries and private operator subsidies.',
        MODERATE_DEFICIT: 'Stabilizing market; recommended expansion of selective private centers.',
        BALANCED: 'Satisfactory supply matching demand; focus on quality and proximity.',
        SURPLUS: 'Saturated market; optimal conditions for specialized offerings.',
      },

      generateDecisionNote: (baseline, simulated, districtName) => {
        const places = simulated.balanceImprovement;
        const pts = simulated.vitalityScoreDelta;
        if (places > 0 && simulated.newCasCount > baseline.currentCasCount) {
          return `For district ${districtName}, the planned addition of ${places} nursery places and ${simulated.casImprovement} CAS center elevates demand coverage to ${simulated.newCoveragePct2028}% and boosts the vitality score by +${pts} pts. This intervention effectively relieves both young family childcare pressure and senior isolation.`;
        }
        if (places > 0) {
          return `Injecting ${places} nursery places in district ${districtName} improves the 2028 balance to ${simulated.newBalance2028 >= 0 ? `+${simulated.newBalance2028}` : simulated.newBalance2028} places, reducing the local childcare gap by ${simulated.coverageImprovementPct} percentage points. Recommended for co-financing via UMK municipal subsidies.`;
        }
        return `Enhancing green and senior infrastructure in district ${districtName} (+${simulated.parksImprovement} pocket parks, +${simulated.casImprovement} CAS) lifts the district vitality index to ${simulated.newVitalityScore} pts and expands biologically active green area per resident.`;
      },

      guidelinesBadge: 'Strategic Municipal & B2B Guidelines',
      guidelinesTitle: 'Cross-Sector Infrastructure Priority Directives',
      guidelinesSubtitle:
        'Targeted municipal policy matrix coordinating Senior Centers (CAS), Urban Greenery, and Public-Private Partnership mechanisms.',

      casMatrixTitle: 'Senior Infrastructure (CAS Priorities)',
      casMatrixSubtitle: 'Districts with highest 65+ senior population shares and CAS shortages',
      casPriorityDistricts: 'Priority: District I Stare Miasto, II Grzegórzki, V Krowodrza, XVIII Nowa Huta',
      casRecommendationText:
        'Seniors represent up to 28% of residents in central and historic quarters. We recommend repurposing municipal commercial premises on ground floors for CAS community hubs with active health and digital literacy workshops.',

      greenMatrixTitle: 'Pocket Parks & Biological Buffer',
      greenMatrixSubtitle: 'Dense residential development zones lacking accessible neighborhood greenery',
      greenPriorityDistricts: 'Priority: District IV Prądnik Biały, XIII Podgórze, XIV Czyżyny',
      greenRecommendationText:
        'Intensive residential developments require high-density micro-greenery. Pocket parks (Krakowian Gardens) of 1,500–3,000 m² within a 300m walking radius provide vital biological buffering, urban heat mitigation, and family gathering spots.',

      financeMatrixTitle: 'Financing & Institutional Models',
      financeMatrixSubtitle: 'Operational mechanisms for municipal authorities (UMK) and institutional partners',
      financeModels: {
        pppTitle: 'Public-Private Partnerships (PPP)',
        pppDesc:
          'City provides land plots or lease rebates; private operators build and run modern non-public daycare centers.',
        maluchTitle: 'Maluch+ / Active Parent Integration',
        maluchDesc:
          'Direct state and municipal subsidies (up to 1,500 PLN/month per infant) bridging parent tuition to affordable municipal parity.',
        grantsTitle: 'Municipal Civic Grants & Participatory Budget',
        grantsDesc:
          'Dedicated budget reserves for Pocket Parks and Senior Clubs through district councils (Rady Dzielnic).',
      },

      finalExecutiveNotice:
        'Official Decision Support System – Kraków360. All econometric calculations and spatial buffers are computed from verified municipal data (BDK, EMUiA, BIP Kraków).',
    };
  }

  if (language === 'ua') {
    return {
      sectionBadge: 'Симулятор Інвестицій „Що-Якщо” та Муніципальні Вимоги',
      sectionTitle: 'Симулятор Впливу Інфраструктури та Стратегічні Директиви (B2G / B2B)',
      sectionSubtitle:
        'Інтерактивна економетрична пісочниця для міської влади (UMK) та інституційних інвесторів: перевірте в прямому ефірі вплив відкриття нових місць у яслах, Центрів для Сеньйорів (CAS) або кишенькових парків на вітальність району, баланс місць та охоплення попиту.',

      selectDistrictLabel: 'Цільовий Район для Симуляції:',
      selectDistrictPlaceholder: 'Оберіть один із 18 районів...',
      resetLeversBtn: 'Скинути Параметри',
      baselineSnapshotTitle: 'Базовий Зріз Показників Району',
      presetTitle: 'Швидкі Інвестиційні Пресети:',
      presets: {
        municipalPackage: 'Стандартний Міський Пакет (+120 місць, +1 CAS, +1 парк)',
        b2bNurseries: 'Фокус на Приватні Ясла B2B (+180 місць)',
        greenAndSenior: 'Громадська Ревіталізація (+2 CAS, +2 парки)',
      },

      leversHeaderTitle: 'Інвестиційні Важелі та Капітальні Витрати',
      leversHeaderSubtitle: 'Налаштуйте обсяг запланованих муніципальних чи приватних інвестицій:',
      nurseryLeverTitle: 'Нові Місця в Яслах (0–3 роки)',
      nurseryLeverSubtitle: 'Будівництво або адаптація приміщень дитсадків (Maluch+ / B2B)',
      nurseryLeverUnit: (count) => (count === 1 ? 'місце' : count >= 2 && count <= 4 ? 'місця' : 'місць'),
      casLeverTitle: 'Нові Центри для Сеньйорів (CAS)',
      casLeverSubtitle: 'Осередки інтеграції, дозвілля та активності літніх людей (65+)',
      casLeverUnit: (count) => (count === 1 ? 'осередок' : count >= 2 && count <= 4 ? 'осередки' : 'осередків'),
      parksLeverTitle: 'Нові Кишенькові Парки та Сквери',
      parksLeverSubtitle: 'Зелені зони у радіусі 300 метрів (Сади Краков’ян)',
      parksLeverUnit: (count) => (count === 1 ? 'парк' : count >= 2 && count <= 4 ? 'парки' : 'парків'),

      capexTotalTitle: 'Орієнтовні Капітальні Витрати (CAPEX)',
      capexTotalSubtitle: 'Бюджетний орієнтир міських або комерційних інвестицій',
      capexCurrency: 'PLN',
      capexNurseryPart: 'Ясла:',
      capexCasPart: 'Клуби Сеньйорів:',
      capexParksPart: 'Кишенькові парки:',

      impactHeaderTitle: 'Результати Симуляції на Живо',
      impactHeaderSubtitle: 'Порівняння: Поточний Базовий Стан vs. Після Інвестицій',
      beforeLabel: 'Базовий стан',
      afterLabel: 'Після інвестицій',
      deltaLabel: 'Чиста зміна',

      cardNurseryTitle: 'Баланс Ясел 2028 та Покриття Попиту',
      cardNurseryCoverageLabel: 'Покриття попиту:',
      cardNurseryDeficitRelief: (places, pct) =>
        `Дефіцит зменшено на ${places} місць (+${pct}% покриття)`,

      cardVitalityTitle: 'Індекс Демографічної Вітальності',
      cardVitalitySub: 'Комплексний показник якості життя та міграційної привабливості',
      cardVitalityPoints: 'балів',

      cardInfraTitle: 'Соціальна та Зелена Інфраструктура',
      cardInfraCasLabel: 'Центри для Сеньйорів (CAS):',
      cardInfraParksLabel: 'Кишенькові парки:',
      cardInfraGreenPerCapita: 'м² зелені/мешканця',

      cardStatusTitle: 'Інвестиційний Статус Району',
      marketStatuses: {
        CRITICAL_DEFICIT: 'Гострий Дефіцит Пропозиції',
        MODERATE_DEFICIT: 'Помірний Дефіцит',
        BALANCED: 'Збалансований Ринок',
        SURPLUS: 'Резерв Пропозиції (Профіцит)',
      },
      marketStatusDesc: {
        CRITICAL_DEFICIT: 'Терміновий пріоритет для муніципальних ясел та грантів приватним операторам.',
        MODERATE_DEFICIT: 'Ринок стабілізується; рекомендується вибіркове розширення мережі.',
        BALANCED: 'Задовільне покриття попиту; акцент на близькості та якості послуг.',
        SURPLUS: 'Насичений ринок; сприятливі умови для відкриття профільних закладів.',
      },

      generateDecisionNote: (baseline, simulated, districtName) => {
        const places = simulated.balanceImprovement;
        const pts = simulated.vitalityScoreDelta;
        if (places > 0 && simulated.newCasCount > baseline.currentCasCount) {
          return `Для району ${districtName} заплановане введення ${places} місць у яслах та ${simulated.casImprovement} CAS збільшує охоплення попиту до ${simulated.newCoveragePct2028}% та підвищує індекс вітальності на +${pts} балів. Це одночасно зменшує черги для молодих сімей та підтримує сеньйорів.`;
        }
        if (places > 0) {
          return `Створення ${places} місць у яслах для району ${districtName} скорочує дефіцит 2028 року до ${simulated.newBalance2028 >= 0 ? `+${simulated.newBalance2028}` : simulated.newBalance2028} місць (+${simulated.coverageImprovementPct} в.п. покриття). Рекомендовано співфінансування за програмами UMK.`;
        }
        return `Розбудова зеленої та ветеранської інфраструктури для району ${districtName} (+${simulated.parksImprovement} парків, +${simulated.casImprovement} CAS) підвищує вітальність до ${simulated.newVitalityScore} балів та забезпечує доступність зон відпочинку біля дому.`;
      },

      guidelinesBadge: 'Стратегічні Муніципальні Директиви',
      guidelinesTitle: 'Міжгалузеві Пріоритети Розвитку Інфраструктури',
      guidelinesSubtitle:
        'Комплексна матриця політики міського розвитку: Центри Сеньйорів (CAS), Міська Зелень та Механізми B2B / ДПП.',

      casMatrixTitle: 'Інфраструктура для Сеньйорів (CAS)',
      casMatrixSubtitle: 'Райони з найвищою часткою літніх людей 65+ та дефіцитом осередків CAS',
      casPriorityDistricts: 'Пріоритет: Район I Старе Місто, II Гжегужкі, V Кроводжа, XVIII Нова Гута',
      casRecommendationText:
        'Частка сеньйорів у центральних районах сягає 28%. Рекомендується переобладнання перших поверхів муніципальних будівель під клуби активного довголіття CAS з оздоровчими та комп’ютерними програмами.',

      greenMatrixTitle: 'Кишенькові Парки та Буферні Зони',
      greenMatrixSubtitle: 'Зони щільної забудови, які потребують доступної рекреації у пішій доступності',
      greenPriorityDistricts: 'Пріоритет: Район IV Пронднік Бяли, XIII Подгуже, XIV Чижини',
      greenRecommendationText:
        'Райони інтенсивного житлового будівництва потребують мікропарків (Сади Краков’ян) площею 1500–3000 м² у радіусі 300 метрів для запобігання міським тепловим островам та комфорту сімей.',

      financeMatrixTitle: 'Фінансові Моделі та Партнерство',
      financeMatrixSubtitle: 'Інструменти фінансування для міської влади (UMK) та інвесторів',
      financeModels: {
        pppTitle: 'Державно-Приватне Партнерство (ДПП)',
        pppDesc:
          'Місто виділяє ділянки або надає пільгову оренду; приватний оператор інвестує в будівництво та стандарти.',
        maluchTitle: 'Програма Maluch+ / Активні Батьки',
        maluchDesc:
          'Субсидії до 1500 PLN/місяць на дитину, що зрівнюють вартість приватних ясел з муніципальними.',
        grantsTitle: 'Міські Гранти та Громадський Бюджет',
        grantsDesc:
          'Фінансування кишенькових парків та оснащення клубів літніх людей через Ради Районів.',
      },

      finalExecutiveNotice:
        'Офіційна Система Підтримки Рішень – Kraków360. Усі розрахунки та просторові буфери базуються на верифікованих муніципальних реєстрах (BDK, EMUiA, BIP Kraków).',
    };
  }

  // Polish default
  return {
    sectionBadge: 'Symulator Inwestycyjny „Co-Jeśli” & Wytyczne B2G/B2B',
    sectionTitle: 'Symulator Wpływu Inwestycji & Strategiczne Wytyczne Miejskie',
    sectionSubtitle:
      'Interaktywny sandbox ekonometryczny dla decydentów Urzędu Miasta Krakowa oraz inwestorów prywatnych: przetestuj na żywo wpływ budowy nowego żłobka, CAS lub parku kieszonkowego na bilans 2028, pokrycie popytu i wskaźnik witalności dzielnicy.',

    selectDistrictLabel: 'Wybierz Dzielnicę do Symulacji Inwestycyjnej:',
    selectDistrictPlaceholder: 'Wybierz jedną z 18 dzielnic Krakowa...',
    resetLeversBtn: 'Zresetuj Suwaki',
    baselineSnapshotTitle: 'Aktualny Stan Wyjściowy Dzielnicy',
    presetTitle: 'Szybkie Scenariusze Inwestycyjne:',
    presets: {
      municipalPackage: 'Standardowy Pakiet Miejski (+120 miejsc, +1 CAS, +1 park)',
      b2bNurseries: 'Prywatny Inwestor Żłobkowy B2B (+180 miejsc)',
      greenAndSenior: 'Rewitalizacja Społeczno-Zielona (+2 CAS, +2 parki)',
    },

    leversHeaderTitle: 'Suwaki Inwestycyjne & Szacunkowy Nakład (CAPEX)',
    leversHeaderSubtitle: 'Dostosuj skalę planowanej interwencji samorządowej lub prywatnej:',
    nurseryLeverTitle: 'Nowe Miejsca Żłobkowe (0–3 lata)',
    nurseryLeverSubtitle: 'Budowa nowej placówki lub adaptacja sal (Maluch+ / partnerstwo B2B)',
    nurseryLeverUnit: (count) => (count === 1 ? 'miejsce' : count >= 2 && count <= 4 ? 'miejsca' : 'miejsc'),
    casLeverTitle: 'Nowe Centra Aktywności Seniora (CAS)',
    casLeverSubtitle: 'Kluby integracji, aktywizacji prozdrowotnej i warsztatowej (65+)',
    casLeverUnit: (count) => (count === 1 ? 'placówka' : count >= 2 && count <= 4 ? 'placówki' : 'placówek'),
    parksLeverTitle: 'Nowe Parki Kieszonkowe / Ogrody Krakowian',
    parksLeverSubtitle: 'Biologicznie czynne enklawy zieleni w buforze 300m od osiedli',
    parksLeverUnit: (count) => (count === 1 ? 'park' : count >= 2 && count <= 4 ? 'parki' : 'parków'),

    capexTotalTitle: 'Szacunkowy Nakład Inwestycyjny (CAPEX)',
    capexTotalSubtitle: 'Benchmarkowy koszt inwestycji publicznej lub wkładu prywatnego',
    capexCurrency: 'zł',
    capexNurseryPart: 'Żłobki:',
    capexCasPart: 'Kluby Seniora:',
    capexParksPart: 'Parki Kieszonkowe:',

    impactHeaderTitle: 'Wyniki Symulacji NA ŻYWO (Przed vs Po)',
    impactHeaderSubtitle: 'Bezpośrednie porównanie stanu bazowego z prognozą po realizacji inwestycji',
    beforeLabel: 'Stan bazowy',
    afterLabel: 'Po inwestycji',
    deltaLabel: 'Efekt netto',

    cardNurseryTitle: 'Bilans Żłobków 2028 & Pokrycie Popytu',
    cardNurseryCoverageLabel: 'Pokrycie popytu:',
    cardNurseryDeficitRelief: (places, pct) =>
      `Redukcja deficytu o ${places} miejsc (+${pct}% pokrycia)`,

    cardVitalityTitle: 'Wskaźnik Witalności Demograficznej',
    cardVitalitySub: 'Syntetyczny indeks atrakcyjności osiedleńczej i dynamiki rozwoju',
    cardVitalityPoints: 'pkt',

    cardInfraTitle: 'Infrastruktura Społeczna i Zieleń',
    cardInfraCasLabel: 'Centra Aktywności Seniora:',
    cardInfraParksLabel: 'Parki Kieszonkowe:',
    cardInfraGreenPerCapita: 'm² zieleni/mieszkańca',

    cardStatusTitle: 'Status Strategiczny Rynku w Dzielnicy',
    marketStatuses: {
      CRITICAL_DEFICIT: 'Pilny Deficyt Inwestycyjny',
      MODERATE_DEFICIT: 'Umiarkowany Deficyt',
      BALANCED: 'Rynek Zrównoważony',
      SURPLUS: 'Rezerwa Podażowa (Nasycenie)',
    },
    marketStatusDesc: {
      CRITICAL_DEFICIT: 'Priorytet dla miejskich inwestycji żłobkowych i dotacji celowych B2B.',
      MODERATE_DEFICIT: 'Stopniowa stabilizacja; zalecane punktowe wsparcie operatorów niepublicznych.',
      BALANCED: 'Baza zaspokaja zapotrzebowanie; priorytet jakości i bliskości dojścia.',
      SURPLUS: 'Wysokie nasycenie; optymalne warunki dla placówek profilowanych i autorskich.',
    },

    generateDecisionNote: (baseline, simulated, districtName) => {
      const places = simulated.balanceImprovement;
      const pts = simulated.vitalityScoreDelta;
      const casUnit = simulated.casImprovement === 1 ? 'nowego CAS' : 'nowych placówek CAS';
      if (places > 0 && simulated.newCasCount > baseline.currentCasCount) {
        return `Dla obszaru: ${districtName} planowane uruchomienie ${places} miejsc żłobkowych oraz ${simulated.casImprovement} ${casUnit} podnosi wskaźnik pokrycia popytu do ${simulated.newCoveragePct2028}% oraz zwiększa witalność dzielnicy o +${pts} pkt. Działanie to jednocześnie odciąża młode rodziny i niweluje samotność seniorów w dynamicznie rozwijającej się dzielnicy.`;
      }
      if (places > 0) {
        return `Dodanie ${places} miejsc żłobkowych w obszarze: ${districtName} redukuje deficyt 2028 roku do ${simulated.newBalance2028 >= 0 ? `+${simulated.newBalance2028}` : simulated.newBalance2028} miejsc, zmniejszając lukę opiekuńczą o ${simulated.coverageImprovementPct} punktów procentowych. Inwestycja rekomendowana do wsparcia w ramach miejskiego programu dotacji celowych UMK.`;
      }
      const parksUnit =
        simulated.parksImprovement === 1
          ? 'park kieszonkowy'
          : simulated.parksImprovement <= 4
          ? 'parki kieszonkowe'
          : 'parków kieszonkowych';
      return `Rozwój infrastruktury zielonej i senioralnej w obszarze: ${districtName} (+${simulated.parksImprovement} ${parksUnit}, +${simulated.casImprovement} ${casUnit}) podnosi indeks witalności do ${simulated.newVitalityScore} pkt oraz polepsza wskaźnik dostępności biologicznie czynnej zieleni przy osiedlach.`;
    },

    guidelinesBadge: 'Strategiczne Wytyczne Miejskie (B2G / B2B)',
    guidelinesTitle: 'Międzysektorowe Wytyczne Inwestycyjne dla Miasta Krakowa',
    guidelinesSubtitle:
      'Zintegrowana matryca priorytetów: Centra Aktywności Seniora (CAS), Parki Kieszonkowe oraz Modele Partnerstwa Publiczno-Prywatnego.',

    casMatrixTitle: 'Sektor Senioralny (Priorytety CAS 65+)',
    casMatrixSubtitle: 'Dzielnice o najwyższym udziale seniorów (22–28%) i pilnej potrzebie nowych klubów',
    casPriorityDistricts: 'Priorytet UMK: Dzielnica I Stare Miasto, II Grzegórzki, V Krowodrza, XVIII Nowa Huta',
    casRecommendationText:
      'W dzielnicach centralnych i nowohuckich odsetek seniorów sięga 28% populacji. Rekomendowana adaptacja parterów w miejskich lokalach użytkowych na CAS z bezpłatną ofertą prozdrowotną, cyfrową i integracyjną.',

    greenMatrixTitle: 'Zieleń Miejska (Parki Kieszonkowe / Ogrody Krakowian)',
    greenMatrixSubtitle: 'Strefy intensywnej zabudowy deweloperskiej z deficytem zieleni w buforze 300m',
    greenPriorityDistricts: 'Priorytet ZZM: Dzielnica IV Prądnik Biały, XIII Podgórze, XIV Czyżyny',
    greenRecommendationText:
      'Rejony nowej urbanizacji wymagają gęstej sieci mikrozieleni. Parki kieszonkowe o powierzchni 1500–3000 m² zlokalizowane do 5 minut spacerem stanowią kluczowy bufor biologiczny, obniżają miejską wyspę ciepła i służą integracji sąsiedzkiej.',

    financeMatrixTitle: 'Modele Finansowania i Partnerstwa B2B/B2G',
    financeMatrixSubtitle: 'Dostępne narzędzia realizacyjne dla Wydziału Polityki Społecznej UMK i inwestorów',
    financeModels: {
      pppTitle: 'Partnerstwo Publiczno-Prywatne (PPP)',
      pppDesc:
        'Miasto udostępnia uzbrojony grunt lub preferencyjny najem lokalu, a prywatny operator realizuje inwestycję kubaturową i standard opiekuńczy.',
      maluchTitle: 'Program Maluch+ / Aktywny Rodzic',
      maluchDesc:
        'Dotacja państwowa i miejska (do 1500 zł/mies. na dziecko) wyrównująca czesne w placówkach niepublicznych do poziomu żłobków samorządowych.',
      grantsTitle: 'Miejskie Granty Celowe i Budżet Obywatelski',
      grantsDesc:
        'Dedykowane pule na parki kieszonkowe i wyposażenie klubów seniora realizowane przez Rady Dzielnic.',
    },

    finalExecutiveNotice:
      'Oficjalne Narzędzie Wspomagania Decyzji Inwestycyjnych Kraków360. Wszystkie modele ekonometryczne i bufory przestrzenne oparto na zweryfikowanych rejestrach miejskich (BDK, EMUiA, BIP Kraków).',
  };
}
