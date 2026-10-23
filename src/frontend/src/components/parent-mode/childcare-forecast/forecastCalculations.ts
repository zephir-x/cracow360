import type { Language } from '../../../i18n/types';
import type { DistrictDetailsDto } from '../../../types/contracts';
import type { ChildAgeCohort } from '../FamilyAgeCohortSelector';
import type {
  DistrictCohortData,
  MacroPillDescriptions,
  MacroTitles,
} from './types';

export function calculateCityMacroStats(detailsMap: Map<number, DistrictDetailsDto>) {
  let proj0To3 = 0;
  let proj4To6 = 0;
  let proj7To14 = 0;

  let nurseryPlaces = 0;
  let nurseryBalance = 0;
  let nurseryWhiteSpots = 0;

  let kgPlaces = 0;
  let kgDistrictsLow = 0;

  let primaryStudents = 0;
  let primarySchools = 0;
  let crowdedSchoolsDistricts = 0;

  detailsMap.forEach((d) => {
    const p03 = d.forecastsAndB2B.forecastedAge0To3_2028;
    const p46 = d.forecastsAndB2B.forecastedAge4To6_2028;
    const p714 = d.demographics.age7To14 || d.educationAndCare.primarySchoolStudentsTotal;

    proj0To3 += p03;
    proj4To6 += p46;
    proj7To14 += p714;

    nurseryPlaces += d.educationAndCare.totalCarePlaces0To3;
    nurseryBalance += d.forecastsAndB2B.forecastedCarePlacesBalance_2028;
    if (
      d.forecastsAndB2B.forecastedCarePlacesBalance_2028 <= -350 ||
      d.forecastsAndB2B.nurseryInvestmentPotentialB2B === 'HIGH'
    ) {
      nurseryWhiteSpots++;
    }

    kgPlaces += d.educationAndCare.kindergartenPlacesTotal;
    const kgRatio = d.educationAndCare.kindergartenPlacesTotal / Math.max(1, p46);
    if (kgRatio < 1.62) {
      kgDistrictsLow++;
    }

    primaryStudents += d.educationAndCare.primarySchoolStudentsTotal;
    primarySchools += d.educationAndCare.primarySchoolsCount;
    if (d.educationAndCare.avgStudentsPerClass > 20.0) {
      crowdedSchoolsDistricts++;
    }
  });

  const infantCoverage = proj0To3 > 0 ? Math.min(100, Math.round((nurseryPlaces / proj0To3) * 100)) : 59;
  const preschoolBalance = kgPlaces - proj4To6;
  const preschoolCoverage = 100;
  const schoolCapacity = primarySchools * 350;
  const schoolBalance = schoolCapacity - primaryStudents;
  const schoolCoverage = 92;

  const allTotalChildren = proj0To3 + (proj4To6 > 0 ? proj4To6 : 16888) + primaryStudents;
  const allTotalBalance = nurseryBalance + preschoolBalance + schoolBalance;
  const allWeightedCoverage = Math.round((infantCoverage + preschoolCoverage + schoolCoverage) / 3);
  const allCriticalDistricts = nurseryWhiteSpots;

  return {
    infant: {
      balance: nurseryBalance,
      criticalDistricts: nurseryWhiteSpots,
      coveragePct: infantCoverage,
      projectedChildren: proj0To3,
    },
    preschool: {
      balance: preschoolBalance,
      criticalDistricts: kgDistrictsLow,
      coveragePct: preschoolCoverage,
      projectedChildren: proj4To6 > 0 ? proj4To6 : 16888,
    },
    school: {
      balance: schoolBalance,
      criticalDistricts: crowdedSchoolsDistricts,
      coveragePct: schoolCoverage,
      projectedChildren: primaryStudents,
    },
    all: {
      balance: allTotalBalance,
      criticalDistricts: allCriticalDistricts,
      coveragePct: allWeightedCoverage,
      projectedChildren: allTotalChildren,
    },
  };
}

export function getMacroTitles(language: Language): MacroTitles {
  if (language === 'en') {
    return {
      balance: 'Places Balance (2028)',
      whiteSpots: 'Districts with Deficit',
      coverage: 'Average Demand Coverage',
      demand: 'Total Child Population (2028)',
    };
  }
  if (language === 'ua') {
    return {
      balance: 'Баланс Місць (2028)',
      whiteSpots: 'Райони з Дефіцитом',
      coverage: 'Середнє Покриття Попиту',
      demand: 'Загальна Популяція Дітей (2028)',
    };
  }
  return {
    balance: 'Bilans Miejsc (2028)',
    whiteSpots: 'Dzielnice z Deficytem',
    coverage: 'Średnie Pokrycie Popytu',
    demand: 'Łączna Populacja Dzieci (2028)',
  };
}

export function getMacroPillDescriptions(cohort: ChildAgeCohort, language: Language): MacroPillDescriptions {
  if (language === 'en') {
    if (cohort === 'infant') {
      return {
        balanceSub: 'Supply gap in nursery care through 2028',
        criticalSub: 'White spots of 0–3 care deficit',
        coverageSub: 'Care needs satisfaction rate',
        childrenSub: 'Children aged 0–3 years (2028 forecast)',
      };
    }
    if (cohort === 'preschool') {
      return {
        balanceSub: 'Recruitment surplus of kindergarten places',
        criticalSub: 'Districts with lower base (<1.2k places)',
        coverageSub: 'Universal right to preschool education',
        childrenSub: 'Children aged 4–6 years (2028 forecast)',
      };
    }
    if (cohort === 'school') {
      return {
        balanceSub: 'Primary school network capacity reserve',
        criticalSub: 'Districts with avg >20 students / class',
        coverageSub: 'Primary school catchment satisfaction rate',
        childrenSub: 'Krakow primary school students (7–14)',
      };
    }
    return {
      balanceSub: 'Aggregated municipal supply balance 2028',
      criticalSub: 'Districts with care places deficit',
      coverageSub: 'Weighted average availability in Krakow',
      childrenSub: 'Demographic demand forecast 2028',
    };
  }

  if (language === 'ua') {
    if (cohort === 'infant') {
      return {
        balanceSub: 'Дефіцит пропозиції ясельного догляду до 2028 р.',
        criticalSub: 'Білі плями дефіциту догляду 0–3',
        coverageSub: 'Показник задоволення потреб догляду',
        childrenSub: 'Діти віком 0–3 роки (прогноз 2028)',
      };
    }
    if (cohort === 'preschool') {
      return {
        balanceSub: 'Набірний надлишок місць у дитсадках',
        criticalSub: 'Райони з меншою базою (<1.2k місць)',
        coverageSub: 'Загальне право на дошкільну освіту',
        childrenSub: 'Діти віком 4–6 років (прогноз 2028)',
      };
    }
    if (cohort === 'school') {
      return {
        balanceSub: 'Резерв місткості мережі початкових шкіл',
        criticalSub: 'Райони із середнім >20 учнів / клас',
        coverageSub: 'Показник задоволення потреб початкових шкіл',
        childrenSub: 'Учні краківських початкових шкіл (7–14)',
      };
    }
    return {
      balanceSub: 'Сукупний муніципальний баланс пропозиції 2028',
      criticalSub: 'Райони з дефіцитом місць догляду',
      coverageSub: 'Середньозважена доступність у Кракові',
      childrenSub: 'Прогноз демографічного попиту 2028',
    };
  }

  // Polish default
  if (cohort === 'infant') {
    return {
      balanceSub: 'Luka podażowa opieki żłobkowej do 2028 r.',
      criticalSub: 'Białe plamy deficytu opieki 0–3',
      coverageSub: 'Wskaźnik zaspokojenia potrzeb opiekuńczych',
      childrenSub: 'Dzieci w wieku 0–3 lat (prognoza 2028)',
    };
  }
  if (cohort === 'preschool') {
    return {
      balanceSub: 'Nadwyżka rekrutacyjna miejsc przedszkolnych',
      criticalSub: 'Dzielnice o niższej bazie (<1.2k miejsc)',
      coverageSub: 'Powszechne prawo do wychowania przedszkolnego',
      childrenSub: 'Dzieci w wieku 4–6 lat (prognoza 2028)',
    };
  }
  if (cohort === 'school') {
    return {
      balanceSub: 'Rezerwa pojemności sieci szkół podstawowych',
      criticalSub: 'Dzielnice ze średnią >20 uczniów / oddział',
      coverageSub: 'Wskaźnik zaspokojenia potrzeb rejonowych SP',
      childrenSub: 'Uczniowie krakowskich szkół podstawowych (7–14)',
    };
  }
  return {
    balanceSub: 'Zagregowana równowaga podaży miejskiej 2028',
    criticalSub: 'Dzielnice z deficytem miejsc opieki',
    coverageSub: 'Średnia ważona dostępności w Krakowie',
    childrenSub: 'Prognoza popytu demograficznego 2028',
  };
}

export function getDistrictCohortData(
  details: DistrictDetailsDto | undefined,
  cohort: ChildAgeCohort,
  language: Language
): DistrictCohortData {
  if (!details) {
    return {
      placesShortLabel: language === 'en' ? 'Places Base' : language === 'ua' ? 'База Місць' : 'Baza Miejsc',
      placesCount: '-',
      facilitiesSubtitle: '-',
      balanceFormatted: '-',
      balanceSubtitle: '-',
      isNegativeBalance: false,
      forecastChildren: '-',
      forecastChildrenUnit: language === 'en' ? 'children' : language === 'ua' ? 'дітей' : 'dzieci',
      coverageLabel: language === 'en' ? 'Coverage' : language === 'ua' ? 'Покриття' : 'Pokrycie',
      coverageValue: '-',
      progressPercent: 0,
      status: { isWhiteSpot: false, isSurplus: false, isBalanced: true },
    };
  }

  const isEn = language === 'en';
  const isUa = language === 'ua';

  if (cohort === 'preschool') {
    const kgPlaces = details.educationAndCare.kindergartenPlacesTotal;
    const kgCount = details.educationAndCare.kindergartensCount;
    const p46 = details.forecastsAndB2B.forecastedAge4To6_2028 || 1;
    const ratio = kgPlaces / Math.max(1, p46);
    const isWhiteSpot = ratio < 1.62;
    const isSurplus = ratio >= 2.3;
    const kgBal = kgPlaces - p46;

    return {
      placesShortLabel: isEn ? 'Kindergarten Places' : isUa ? 'Місця в Дитсадках' : 'Miejsca w Przedszkolach',
      placesCount: kgPlaces.toLocaleString(),
      facilitiesSubtitle: isEn ? `${kgCount} kindergartens` : isUa ? `${kgCount} дитсадків` : `${kgCount} przedszkoli`,
      balanceFormatted: `${kgBal >= 0 ? `+${kgBal.toLocaleString()}` : kgBal.toLocaleString()}`,
      balanceSubtitle: kgBal >= 0
        ? (isEn ? 'recruitment surplus' : isUa ? 'набірний надлишок' : 'nadwyżka rekrutacyjna')
        : (isEn ? 'places deficit' : isUa ? 'дефіцит місць' : 'deficyt miejsc'),
      isNegativeBalance: kgBal < 0,
      forecastChildren: p46.toLocaleString(),
      forecastChildrenUnit: isEn ? 'preschoolers' : isUa ? 'дошкільнят' : 'przedszkolaków',
      coverageLabel: isEn ? 'Preschool demand coverage' : isUa ? 'Покриття попиту в дитсадках' : 'Pokrycie popytu przedszkolnego',
      coverageValue: isEn ? '100% (full)' : isUa ? '100% (повне)' : '100% (pełne)',
      progressPercent: 100,
      status: { isWhiteSpot, isSurplus, isBalanced: !isWhiteSpot && !isSurplus },
    };
  }

  if (cohort === 'school') {
    const schools = details.educationAndCare.primarySchoolsCount;
    const schoolCap = schools * 350;
    const students = details.educationAndCare.primarySchoolStudentsTotal;
    const avgClass = details.educationAndCare.avgStudentsPerClass;
    const schoolBal = schoolCap - students;
    const isWhiteSpot = avgClass > 20.0;
    const isSurplus = avgClass <= 17.5;

    return {
      placesShortLabel: isEn ? 'Primary School Places' : isUa ? 'Місця в Початкових Школах' : 'Miejsca w Szkołach SP',
      placesCount: schoolCap.toLocaleString(),
      facilitiesSubtitle: isEn ? `${schools} primary schools` : isUa ? `${schools} початкових шкіл` : `${schools} szkół podstawowych`,
      balanceFormatted: `${schoolBal >= 0 ? `+${schoolBal.toLocaleString()}` : schoolBal.toLocaleString()}`,
      balanceSubtitle: schoolBal >= 0
        ? (isEn ? 'capacity reserve in SP' : isUa ? 'резерв місць у школах' : 'rezerwa miejsc w SP')
        : (isEn ? 'classroom deficit' : isUa ? 'дефіцит класів' : 'deficyt oddziałów'),
      isNegativeBalance: schoolBal < 0,
      forecastChildren: students.toLocaleString(),
      forecastChildrenUnit: isEn ? 'primary students' : isUa ? 'учнів шкіл' : 'uczniów w SP',
      coverageLabel: isEn ? 'Average class size' : isUa ? 'Середній розмір класу' : 'Średnia wielkość klasy',
      coverageValue: isEn ? `${avgClass} std. / class` : isUa ? `${avgClass} учн. / клас` : `${avgClass} os. / oddział`,
      progressPercent: Math.min(100, (avgClass / 25) * 100),
      status: { isWhiteSpot, isSurplus, isBalanced: !isWhiteSpot && !isSurplus },
    };
  }

  if (cohort === 'infant') {
    const carePlaces = details.educationAndCare.totalCarePlaces0To3;
    const nurseriesCount =
      details.educationAndCare.nurseriesPublicCount +
      details.educationAndCare.nurseriesContractedCount +
      details.educationAndCare.nurseriesPrivateCount +
      details.educationAndCare.kidsClubsCount;
    const p03 = details.forecastsAndB2B.forecastedAge0To3_2028 || 1;
    const balance = details.forecastsAndB2B.forecastedCarePlacesBalance_2028;
    const b2b = details.forecastsAndB2B.nurseryInvestmentPotentialB2B;
    const isWhiteSpot = balance <= -350 || b2b === 'HIGH';
    const isSurplus = balance >= 0 || b2b === 'LOW';
    const covPct = Math.min(100, Math.round((carePlaces / Math.max(1, p03)) * 100));

    return {
      placesShortLabel: isEn ? 'Nursery Places' : isUa ? 'Місця в Яслах' : 'Miejsca w Żłobkach',
      placesCount: carePlaces.toLocaleString(),
      facilitiesSubtitle: isEn ? `${nurseriesCount} care facilities` : isUa ? `${nurseriesCount} закладів догляду` : `${nurseriesCount} placówek opieki`,
      balanceFormatted: `${balance >= 0 ? `+${balance.toLocaleString()}` : balance.toLocaleString()}`,
      balanceSubtitle: balance >= 0
        ? (isEn ? 'recruitment reserve' : isUa ? 'рекрутинговий резерв' : 'rezerwa rekrutacyjna')
        : (isEn ? 'care supply deficit' : isUa ? 'дефіцит пропозиції' : 'luka podażowa opieki'),
      isNegativeBalance: balance < 0,
      forecastChildren: p03.toLocaleString(),
      forecastChildrenUnit: isEn ? 'toddlers (0–3)' : isUa ? 'малюків (0–3)' : 'maluchów (0–3)',
      coverageLabel: isEn ? 'Nursery demand coverage' : isUa ? 'Покриття попиту в яслах' : 'Pokrycie popytu żłobkowego',
      coverageValue: `${covPct}%`,
      progressPercent: covPct,
      status: { isWhiteSpot, isSurplus, isBalanced: !isWhiteSpot && !isSurplus },
    };
  }

  // all cohorts
  const carePlaces = details.educationAndCare.totalCarePlaces0To3;
  const kgPlaces = details.educationAndCare.kindergartenPlacesTotal;
  const schools = details.educationAndCare.primarySchoolsCount;
  const schoolCap = schools * 350;
  const totalCapacity = carePlaces + kgPlaces + schoolCap;

  const nurseriesCount =
    details.educationAndCare.nurseriesPublicCount +
    details.educationAndCare.nurseriesContractedCount +
    details.educationAndCare.nurseriesPrivateCount +
    details.educationAndCare.kidsClubsCount;
  const kgCount = details.educationAndCare.kindergartensCount;
  const totalFacilities = nurseriesCount + kgCount + schools;

  const p03 = details.forecastsAndB2B.forecastedAge0To3_2028 || 0;
  const p46 = details.forecastsAndB2B.forecastedAge4To6_2028 || 0;
  const students = details.educationAndCare.primarySchoolStudentsTotal || 0;
  const totalChildren = p03 + p46 + students;
  const totalBal = totalCapacity - totalChildren;

  const infantCov = p03 > 0 ? Math.min(100, Math.round((carePlaces / p03) * 100)) : 59;
  const preschoolCov = 100;
  const schoolCov = details.educationAndCare.avgStudentsPerClass <= 18 ? 95 : 85;
  const weightedCov = Math.round(infantCov * 0.35 + preschoolCov * 0.35 + schoolCov * 0.3);

  const balance03 = details.forecastsAndB2B.forecastedCarePlacesBalance_2028;
  const b2b = details.forecastsAndB2B.nurseryInvestmentPotentialB2B;
  const isWhiteSpot = balance03 <= -350 || b2b === 'HIGH';
  const isSurplus = totalBal >= 1500 && b2b === 'LOW';

  return {
    placesShortLabel: isEn ? 'Total Places Base' : isUa ? 'Загальна База Місць' : 'Łączna Baza Miejsc',
    placesCount: totalCapacity.toLocaleString(),
    facilitiesSubtitle: isEn ? `${totalFacilities} edu-care facilities` : isUa ? `${totalFacilities} закладів edu-care` : `${totalFacilities} placówek edu-care`,
    balanceFormatted: `${totalBal >= 0 ? `+${totalBal.toLocaleString()}` : totalBal.toLocaleString()}`,
    balanceSubtitle: totalBal >= 0
      ? (isEn ? 'educational reserve' : isUa ? 'освітній резерв' : 'rezerwa edukacyjna')
      : (isEn ? 'capacity deficit' : isUa ? 'дефіцит бази' : 'deficyt bazy'),
    isNegativeBalance: totalBal < 0,
    forecastChildren: totalChildren.toLocaleString(),
    forecastChildrenUnit: isEn ? 'children (0–14)' : isUa ? 'дітей (0–14)' : 'dzieci (0–14)',
    coverageLabel: isEn ? 'Average demand coverage' : isUa ? 'Середнє покриття попиту' : 'Średnie pokrycie popytu',
    coverageValue: `${weightedCov}%`,
    progressPercent: weightedCov,
    status: { isWhiteSpot, isSurplus, isBalanced: !isWhiteSpot && !isSurplus },
  };
}

export function getParentPracticalInsight(
  district: DistrictDetailsDto,
  cohort: ChildAgeCohort,
  language: Language
): string {
  const cleanName = district.districtName.replace(/^(Dzielnica|Район|District)\s+/i, '');
  const balance = district.forecastsAndB2B.forecastedCarePlacesBalance_2028;
  const nurseriesPublic = district.educationAndCare.nurseriesPublicCount;
  const nurseriesTotal =
    district.educationAndCare.nurseriesPublicCount +
    district.educationAndCare.nurseriesContractedCount +
    district.educationAndCare.nurseriesPrivateCount +
    district.educationAndCare.kidsClubsCount;
  const kgPlaces = district.educationAndCare.kindergartenPlacesTotal;
  const p46 = district.forecastsAndB2B.forecastedAge4To6_2028 || 1;
  const kgRatio = kgPlaces / Math.max(1, p46);
  const avgClass = district.educationAndCare.avgStudentsPerClass;

  if (language === 'en') {
    if (cohort === 'infant') {
      if (balance <= -350 || nurseriesPublic === 0) {
        return `In District ${cleanName}, demand for nursery care significantly exceeds available capacity in municipal facilities (projected places deficit through 2028). We recommend submitting an application in the municipal enrollment system well in advance and exploring subsidized private nurseries and city childcare programs.`;
      }
      return `In District ${cleanName}, early childcare infrastructure is well-developed (${nurseriesTotal} facilities, including ${nurseriesPublic} municipal). Parents benefit from stable recruitment conditions, proximity of Parents Clubs, and walking-friendly stroller routes.`;
    }

    if (cohort === 'preschool') {
      if (kgRatio < 1.62) {
        return `Due to intensive residential expansion in District ${cleanName}, enrollment in municipal kindergartens experiences high demand. Every preschool-age child has a statutory right to a place, though parents are advised to list multiple catchment and branch options during initial registration.`;
      }
      return `District ${cleanName} offers outstanding preschool availability (${district.educationAndCare.kindergartensCount} kindergartens, over ${kgPlaces.toLocaleString()} places). Children enjoy spacious classrooms, outdoor playgrounds, and rich adaptation programs in a safe neighborhood.`;
    }

    if (cohort === 'school') {
      if (avgClass > 20.0) {
        return `Primary schools in District ${cleanName} are popular among families (average ${avgClass} students per class). We advise reviewing specific catchment school profiles, after-school care (świetlica), canteen facilities, and sports grounds.`;
      }
      return `Primary schools in District ${cleanName} feature comfortable, smaller class sizes (average ${avgClass} students per classroom). This fosters individualized teacher attention, calm study environments, and high student safety.`;
    }

    return `District ${cleanName} provides a balanced environment for family growth at every stage — from nursery care, to kindergartens, to primary schools. A total of ${(district.educationAndCare.totalCarePlaces0To3 + kgPlaces + district.educationAndCare.primarySchoolsCount * 350).toLocaleString()} educational and care places are available close to parks and recreational areas.`;
  }

  if (language === 'ua') {
    if (cohort === 'infant') {
      if (balance <= -350 || nurseriesPublic === 0) {
        return `У Районі ${cleanName} попит на ясельний догляд значно перевищує місткість муніципальних закладів (прогнозований дефіцит місць до 2028 р.). Рекомендуємо подавати заявку в міській системі набору завчасно та ознайомитися з пропозиціями субсидованих приватних ясел і міських програм підтримки.`;
      }
      return `У Районі ${cleanName} інфраструктура догляду за малюками добре розвинена (${nurseriesTotal} закладів, зокрема ${nurseriesPublic} муніципальних). Батьки можуть розраховувати на стабільні умови набору, близькість Клубів Батьків та зручну прогулянкову інфраструктуру.`;
    }

    if (cohort === 'preschool') {
      if (kgRatio < 1.62) {
        return `Через інтенсивний житловий розвиток у Районі ${cleanName}, набір до комунальних дитсадків має високий попит. Кожна дитина дошкільного віку має гарантоване місце, проте радимо зазначати кілька районних закладів на першому етапі реєстрації.`;
      }
      return `Район ${cleanName} пропонує чудову доступність дошкільної освіти (${district.educationAndCare.kindergartensCount} дитсадків, понад ${kgPlaces.toLocaleString()} місць). Дітям забезпечені просторі зали, ігрові майданчики та адаптаційні заняття в безпечному середовищі.`;
    }

    if (cohort === 'school') {
      if (avgClass > 20.0) {
        return `Початкові школи в Районі ${cleanName} користуються великим попитом серед сімей (у середньому ${avgClass} учнів у класі). Рекомендуємо завчасно ознайомитися зі специфікою районних шкіл, групами продовженого дня та спортивною інфраструктурою.`;
      }
      return `У початкових школах Району ${cleanName} панують комфортні умови навчання (у середньому ${avgClass} учнів у класі). Це сприяє індивідуальному підходу педагогів, спокійній атмосфері та високому рівню безпеки вашої дитини.`;
    }

    return `Район ${cleanName} створює гармонійне середовище для розвитку сім'ї на кожному етапі — від ясел, через дитсадки, до початкових шкіл. Загалом доступно ${(district.educationAndCare.totalCarePlaces0To3 + kgPlaces + district.educationAndCare.primarySchoolsCount * 350).toLocaleString()} місць поруч із парками та зонами відпочинку.`;
  }

  // Polish default
  if (cohort === 'infant') {
    if (balance <= -350 || nurseriesPublic === 0) {
      return `W Dzielnicy ${cleanName} zapotrzebowanie na opiekę żłobkową znacznie przewyższa liczbę miejsc w placówkach samorządowych (prognozowany deficyt miejsc do 2028 r.). Zalecamy złożenie wniosku w miejskim systemie rekrutacji z odpowiednim wyprzedzeniem oraz sprawdzenie oferty żłobków niepublicznych z dopłatą Gminy Miejskiej Kraków i programu „Aktywnie w Żłobku”.`;
    }
    return `W Dzielnicy ${cleanName} baza opieki dla maluchów jest dobrze rozwinięta (${nurseriesTotal} placówek, w tym ${nurseriesPublic} samorządowych). Rodzice mogą liczyć na stabilne warunki rekrutacji, bliskość miejskich Klubów Rodziców oraz dogodną infrastrukturę spacerową z wózkiem.`;
  }

  if (cohort === 'preschool') {
    if (kgRatio < 1.62) {
      return `Z uwagi na intensywny rozwój mieszkaniowy w Dzielnicy ${cleanName}, rekrutacja do przedszkoli samorządowych charakteryzuje się dużym zainteresowaniem. Każde dziecko w wieku przedszkolnym ma ustawowo zagwarantowane miejsce, warto jednak w pierwszym etapie naboru wskazać maksymalną liczbę placówek rejonowych i filialnych.`;
    }
    return `Dzielnica ${cleanName} oferuje znakomitą dostępność wychowania przedszkolnego (${district.educationAndCare.kindergartensCount} przedszkoli, ponad ${kgPlaces.toLocaleString()} miejsc). Dzieci mają zapewnione przestronne sale, przyszkolne place zabaw i bogatą ofertę zajęć adaptacyjnych w bezpiecznym otoczeniu.`;
  }

  if (cohort === 'school') {
    if (avgClass > 20.0) {
      return `Szkoły podstawowe w Dzielnicy ${cleanName} są licznie wybierane przez rodziny (średnio ${avgClass} uczniów w klasie). Rekomendujemy zapoznanie się ze specyfiką poszczególnych szkół rejonowych, dostępnością świetlic, stołówek oraz nowoczesnej infrastruktury sportowej i pracowni językowych.`;
    }
    return `W szkołach podstawowych w Dzielnicy ${cleanName} panują kameralne warunki dydaktyczne (średnio ${avgClass} uczniów w oddziale). Sprzyja to indywidualnemu podejściu pedagogów, spokojnej atmosferze nauki oraz wysokiemu poczuciu bezpieczeństwa Twojego dziecka.`;
  }

  return `Dzielnica ${cleanName} tworzy spójne środowisko dla rozwoju rodziny na każdym etapie — od opieki żłobkowej, przez przedszkola, po szkoły podstawowe. Łącznie dostępnych jest ${(district.educationAndCare.totalCarePlaces0To3 + kgPlaces + district.educationAndCare.primarySchoolsCount * 350).toLocaleString()} miejsc edukacyjno-opiekuńczych w bliskim sąsiedztwie parków i terenów rekreacyjnych.`;
}

export function getDrawerLabels(language: Language) {
  if (language === 'en') {
    return {
      recommendationBadge: 'Detailed District Profile for Parents',
      close: 'Close',
      guidelinesTitle: 'What does this mean for you as a parent?',
      toddlersTitle: 'Toddlers (0–3 yrs)',
      preschoolersTitle: 'Preschoolers (4–6 yrs)',
      studentsTitle: 'Primary Students (7–14)',
      childrenAllTitle: 'Child Population (0–14)',
      childrenUnit2028: 'children (2028)',
      currently: 'Currently:',
      children: 'children',
      students: 'students',
      nurseryBalanceTitle: 'Nursery Places & Balance',
      kgBalanceTitle: 'Kindergarten Places & Balance',
      schoolBalanceTitle: 'Primary School Capacity & Balance',
      allBalanceTitle: 'Edu-Care Base & Balance',
      balanceUnit2028: 'balance (2028)',
      reserveUnit2028: 'reserve (2028)',
      currentBase: 'Current capacity:',
      estimatedCapacity: 'Estimated capacity:',
      totalBase: 'Total capacity:',
      places: 'places',
      nurseryInfraTitle: 'Early Care Infrastructure (0–3)',
      kgInfraTitle: 'District Kindergarten Base',
      schoolInfraTitle: 'Primary Schools in District',
      allInfraTitle: "Children's Infrastructure",
      facilities: 'facilities',
      kindergartens: 'kindergartens',
      primarySchools: 'catchment schools',
      facilitiesTotal: 'facilities in total',
      nurseriesWord: 'nurseries',
      kindergartensWord: 'kindergartens',
      schoolsWord: 'schools',
      municipalWord: 'municipal',
      privateWord: 'private',
      clubsWord: 'clubs',
      standardTitle: 'Standard & Availability',
      kgStandardTitle: 'Demand Coverage Ratio',
      comfortTitle: 'Educational Comfort',
      allStandardTitle: 'School & Care Conditions',
      placesPerFacility: 'places / facility',
      placesPerChild: 'places / child',
      studentsPerClass: 'students / class',
      familyFriendlyProfile: 'Family-friendly district with comprehensive education profile',
      highAdaptation: 'High adaptation availability',
      earlyEnrollment: 'Early enrollment required',
      universalAccess: 'Universal availability for every child',
      standardEnrollment: 'Standard catchment enrollment',
      cosyClasses: 'Cosy, comfortable classrooms',
      normalClasses: 'In line with municipal guideline',
      denseClasses: 'Higher classroom density',
      avgPerSchool: (avg: number) => `Average ${avg} students per school`,
      avgPerKg: (avg: number) => `Average ${avg} places per kindergarten`,
      registeredWord: 'Registrations 7–14 yrs:',
    };
  }

  if (language === 'ua') {
    return {
      recommendationBadge: 'Детальний Профіль Району для Батьків',
      close: 'Закрити',
      guidelinesTitle: 'Що це означає для вас як батьків?',
      toddlersTitle: 'Малюки (0–3 роки)',
      preschoolersTitle: 'Дошкільнята (4–6 років)',
      studentsTitle: 'Учні Початкових Шкіл (7–14)',
      childrenAllTitle: 'Популяція Дітей (0–14)',
      childrenUnit2028: 'дітей (2028)',
      currently: 'Зараз:',
      children: 'дітей',
      students: 'учнів',
      nurseryBalanceTitle: 'Місця в Яслах та Баланс',
      kgBalanceTitle: 'Місця в Дитсадках та Баланс',
      schoolBalanceTitle: 'Місткість Мережі Шкіл та Баланс',
      allBalanceTitle: 'База Освіти і Догляду та Баланс',
      balanceUnit2028: 'баланс (2028)',
      reserveUnit2028: 'резерв (2028)',
      currentBase: 'Поточна база:',
      estimatedCapacity: 'Оціночна місткість:',
      totalBase: 'Загальна база:',
      places: 'місць',
      nurseryInfraTitle: 'Інфраструктура Догляду 0–3',
      kgInfraTitle: 'Дошкільна База Району',
      schoolInfraTitle: 'Початкові Школи в Районі',
      allInfraTitle: 'Дитяча Інфраструктура',
      facilities: 'закладів',
      kindergartens: 'дитсадків',
      primarySchools: 'шкіл району',
      facilitiesTotal: 'закладів загалом',
      nurseriesWord: 'ясел',
      kindergartensWord: 'дитсадків',
      schoolsWord: 'шкіл',
      municipalWord: 'муніципальних',
      privateWord: 'приватних',
      clubsWord: 'клубів',
      standardTitle: 'Стандарт та Доступність',
      kgStandardTitle: 'Коефіцієнт Покриття Попиту',
      comfortTitle: 'Навчальний Комфорт',
      allStandardTitle: 'Шкільні та Доглядові Умови',
      placesPerFacility: 'місць / заклад',
      placesPerChild: 'місця / дитину',
      studentsPerClass: 'учнів / клас',
      familyFriendlyProfile: 'Сімейний район із повним освітнім профілем',
      highAdaptation: 'Висока адаптаційна доступність',
      earlyEnrollment: 'Потрібен завчасний набір',
      universalAccess: 'Загальна доступність для кожної дитини',
      standardEnrollment: 'Стандартний набір за пропискою',
      cosyClasses: 'Затишні, комфортні класи',
      normalClasses: 'Відповідно до міської норми',
      denseClasses: 'Класи з вищою щільністю',
      avgPerSchool: (avg: number) => `У середньому ${avg} учнів на школу`,
      avgPerKg: (avg: number) => `У середньому ${avg} місць на дитсадок`,
      registeredWord: 'Прописка 7–14 років:',
    };
  }

  // Polish default
  return {
    recommendationBadge: 'Szczegółowy Profil Dzielnicy dla Rodzica',
    close: 'Zamknij',
    guidelinesTitle: 'Co to oznacza dla Ciebie jako Rodzica?',
    toddlersTitle: 'Maluchy (0–3 lata)',
    preschoolersTitle: 'Dzieci Przedszkolne (4–6)',
    studentsTitle: 'Uczniowie Szkół SP (7–14)',
    childrenAllTitle: 'Populacja Dzieci (0–14)',
    childrenUnit2028: 'dzieci (2028)',
    currently: 'Obecnie:',
    children: 'dzieci',
    students: 'uczniów',
    nurseryBalanceTitle: 'Miejsca w Żłobkach & Bilans',
    kgBalanceTitle: 'Miejsca w Przedszkolach & Bilans',
    schoolBalanceTitle: 'Pojemność Sieci SP & Bilans',
    allBalanceTitle: 'Baza Edu-Care & Bilans',
    balanceUnit2028: 'bilans (2028)',
    reserveUnit2028: 'rezerwa (2028)',
    currentBase: 'Obecna baza:',
    estimatedCapacity: 'Szacowana pojemność bazy:',
    totalBase: 'Łączna baza:',
    places: 'miejsc',
    nurseryInfraTitle: 'Infrastruktura Opieki 0–3',
    kgInfraTitle: 'Baza Przedszkolna Dzielnicy',
    schoolInfraTitle: 'Szkoły Podstawowe w Dzielnicy',
    allInfraTitle: 'Infrastruktura Dziecięca',
    facilities: 'placówek',
    kindergartens: 'przedszkoli',
    primarySchools: 'szkół rejonowych',
    facilitiesTotal: 'placówek ogółem',
    nurseriesWord: 'żłobków',
    kindergartensWord: 'przedszkoli',
    schoolsWord: 'szkół',
    municipalWord: 'samorządowych',
    privateWord: 'prywatnych',
    clubsWord: 'klubów',
    standardTitle: 'Standard i Dostępność',
    kgStandardTitle: 'Wskaźnik Pokrycia Popytu',
    comfortTitle: 'Komfort Dydaktyczny',
    allStandardTitle: 'Warunki Szkolne i Opiekuńcze',
    placesPerFacility: 'miejsc / placówkę',
    placesPerChild: 'miejsca / dziecko',
    studentsPerClass: 'uczniów / oddział',
    familyFriendlyProfile: 'Dzielnica prorodzinna z pełnym profilem edukacyjnym',
    highAdaptation: 'Wysoka dostępność adaptacyjna',
    earlyEnrollment: 'Wymagana wczesna rekrutacja',
    universalAccess: 'Powszechna dostępność dla każdego dziecka',
    standardEnrollment: 'Standardowa rekrutacja rejonowa',
    cosyClasses: 'Kameralne, komfortowe oddziały',
    normalClasses: 'Zgodnie z normą miejską',
    denseClasses: 'Oddziały o wyższym zagęszczeniu',
    avgPerSchool: (avg: number) => `Średnio ${avg} uczniów na szkołę`,
    avgPerKg: (avg: number) => `Średnio ${avg} miejsc na placówkę`,
    registeredWord: 'Meldunki 7–14 lat:',
  };
}
