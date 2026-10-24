import type { Language } from '../../../i18n/types';
import type { DistrictDetailsDto } from '../../../types/contracts';
import type { ChildAgeCohort } from '../FamilyAgeCohortSelector';
import type {
  DistrictCohortData,
  MacroIndicators,
} from './types';
import {
  formatFacilitiesLabel,
  formatKindergartensLabel,
  formatSchoolsLabel,
  formatNurseriesLabel,
} from '../../../i18n/childcareForecastI18n';

// City-wide Macro Aggregations (Infants, Preschool, Primary, All)
export function getMacroIndicators(
  districts: DistrictDetailsDto[]
): Record<ChildAgeCohort, MacroIndicators> {
  let nurseryPlaces = 0;
  let nurseryWhiteSpots = 0;
  let proj0To3 = 0;

  let kgPlaces = 0;
  let kgDistrictsHighDemand = 0;
  let proj4To6 = 0;

  let primarySchools = 0;
  let primaryStudents = 0;
  let crowdedSchoolsDistricts = 0;

  let allTotalCapacity = 0;
  let allTotalChildren = 0;
  let allTightDistricts = 0;

  districts.forEach((d) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawF = d.forecastsAndB2B as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawD = d.demographics as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawE = d.educationAndCare as any;

    const p03 = rawF?.forecastedAge0To3_2028 ?? rawF?.forecastedAge0to3_2028 ?? rawD?.age0To3 ?? rawD?.age0to3 ?? 0;
    const p46 = rawF?.forecastedAge4To6_2028 ?? rawF?.forecastedAge4to6_2028 ?? rawD?.age4To6 ?? rawD?.age4to6 ?? 0;
    const stud = rawE?.primarySchoolStudentsTotal ?? 0;

    proj0To3 += p03;
    proj4To6 += p46;
    primaryStudents += stud;

    // 1. Infants
    const carePlaces = rawE?.totalCarePlaces0To3 ?? rawE?.totalCarePlaces0to3 ?? 0;
    nurseryPlaces += carePlaces;
    const nurBal = carePlaces - p03;
    const b2b = rawF?.nurseryInvestmentPotentialB2B ?? 'LOW';
    if (nurBal <= -750 || b2b === 'HIGH') {
      nurseryWhiteSpots++;
    }

    // 2. Preschool
    const kPlaces = rawE?.kindergartenPlacesTotal ?? 0;
    kgPlaces += kPlaces;
    const kRatio = p46 > 0 ? kPlaces / p46 : 2.0;
    if (kRatio < 1.62) {
      kgDistrictsHighDemand++;
    }

    // 3. Primary Schools
    const schCount = rawE?.primarySchoolsCount ?? 0;
    primarySchools += schCount;
    const avgClass = rawE?.avgStudentsPerClass ?? 0;
    if (avgClass > 20.0) {
      crowdedSchoolsDistricts++;
    }

    // 4. All
    const schCap = schCount * 350;
    const totCap = carePlaces + kPlaces + schCap;
    const totKids = p03 + p46 + stud;
    const totBal = totCap - totKids;

    allTotalCapacity += totCap;
    allTotalChildren += totKids;

    if (totBal <= 150) {
      allTightDistricts++;
    }
  });

  const nurseryBalance = nurseryPlaces - proj0To3;
  const infantCoverage = proj0To3 > 0 ? Math.min(100, Math.round((nurseryPlaces / proj0To3) * 100)) : 56;
  const preschoolBalance = kgPlaces - proj4To6;
  const preschoolCoverage = proj4To6 > 0 ? Math.min(100, Math.round((kgPlaces / proj4To6) * 100)) : 100;
  const schoolCapacity = primarySchools * 350;
  const schoolBalance = schoolCapacity - primaryStudents;
  const schoolCoverage = schoolCapacity > 0 ? Math.round((primaryStudents / schoolCapacity) * 100) : 92;

  const allTotalBalance = allTotalCapacity - allTotalChildren;
  const allCoveragePct = allTotalChildren > 0 ? Math.round((allTotalCapacity / allTotalChildren) * 100) : 100;

  return {
    infant: {
      balance: nurseryBalance,
      criticalDistricts: nurseryWhiteSpots,
      coveragePct: infantCoverage,
      projectedChildren: proj0To3,
    },
    preschool: {
      balance: preschoolBalance,
      criticalDistricts: kgDistrictsHighDemand,
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
      criticalDistricts: allTightDistricts,
      coveragePct: allCoveragePct,
      projectedChildren: allTotalChildren,
    },
  };
}

// District Cohort Calculation (Pure Math & Logic)
export function getDistrictCohortData(
  details: DistrictDetailsDto | undefined,
  cohort: ChildAgeCohort,
  language: Language
): DistrictCohortData {
  if (!details) {
    return {
      placesShortLabel: language === 'en' ? 'Places Base' : language === 'ua' ? 'База Місць' : 'Baza Miejsc',
      placesCount: '-',
      placesRaw: 0,
      facilitiesSubtitle: '-',
      balanceFormatted: '-',
      balanceRaw: 0,
      balanceSubtitle: '-',
      isNegativeBalance: false,
      forecastChildren: '-',
      forecastChildrenUnit: language === 'en' ? 'children' : language === 'ua' ? 'дітей' : 'dzieci',
      coverageLabel: language === 'en' ? 'Coverage' : language === 'ua' ? 'Покриття' : 'Pokrycie',
      coverageValue: '-',
      progressPercent: 0,
      status: { isWhiteSpot: false, isSurplus: false, isBalanced: true },
      statusBadge: language === 'en' ? 'Balanced' : language === 'ua' ? 'Збалансований' : 'Zrównoważony',
    };
  }

  const isEn = language === 'en';
  const isUa = language === 'ua';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawF = details.forecastsAndB2B as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawD = details.demographics as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawE = details.educationAndCare as any;

  // 1. PRESCHOOL
  if (cohort === 'preschool') {
    const kgPlaces: number = rawE?.kindergartenPlacesTotal ?? 0;
    const kgCount: number = rawE?.kindergartensCount ?? 0;
    const p46: number = rawF?.forecastedAge4To6_2028 ?? rawF?.forecastedAge4to6_2028 ?? rawD?.age4To6 ?? rawD?.age4to6 ?? 1;
    const ratio = kgPlaces / Math.max(1, p46);
    const isWhiteSpot = ratio < 1.62;
    const isSurplus = ratio >= 2.3;
    const isBalanced = !isWhiteSpot && !isSurplus;
    const kgBal = kgPlaces - p46;

    const statusBadge = isWhiteSpot
      ? isEn ? 'High Demand' : isUa ? 'Підвищений Попит' : 'Zwiększone Zapotrzebowanie'
      : isSurplus
      ? isEn ? 'High Availability' : isUa ? 'Висока Доступність' : 'Wysoka Dostępność'
      : isEn ? 'Balanced Market' : isUa ? 'Збалансований Ринок' : 'Rynek Zrównoważony';

    return {
      placesShortLabel: isEn ? 'Kindergarten Places' : isUa ? 'Місця в Дитсадках' : 'Miejsca w Przedszkolach',
      placesCount: kgPlaces.toLocaleString(),
      placesRaw: kgPlaces,
      facilitiesSubtitle: formatKindergartensLabel(kgCount, language),
      balanceFormatted: `${kgBal >= 0 ? `+${kgBal.toLocaleString()}` : kgBal.toLocaleString()}`,
      balanceRaw: kgBal,
      balanceSubtitle: kgBal >= 0
        ? (isEn ? 'recruitment surplus' : isUa ? 'набірний надлишок' : 'nadwyżka rekrutacyjna')
        : (isEn ? 'places deficit' : isUa ? 'дефіцит місць' : 'deficyt miejsc'),
      isNegativeBalance: kgBal < 0,
      forecastChildren: p46.toLocaleString(),
      forecastChildrenUnit: isEn ? 'preschoolers' : isUa ? 'дошкільнят' : 'przedszkolaków',
      coverageLabel: isEn ? 'Preschool demand coverage' : isUa ? 'Покриття попиту в дитсадках' : 'Pokrycie popytu przedszkolnego',
      coverageValue: isEn ? '100% (full)' : isUa ? '100% (повне)' : '100% (pełne)',
      progressPercent: 100,
      status: { isWhiteSpot, isSurplus, isBalanced },
      statusBadge,
    };
  }

  // 2. SCHOOL
  if (cohort === 'school') {
    const schools: number = rawE?.primarySchoolsCount ?? 0;
    const schoolCap = schools * 350;
    const students: number = rawE?.primarySchoolStudentsTotal ?? 0;
    const avgClass: number = rawE?.avgStudentsPerClass ?? 0;
    const schoolBal = schoolCap - students;
    const isWhiteSpot = avgClass > 20.0;
    const isSurplus = avgClass <= 17.5;
    const isBalanced = !isWhiteSpot && !isSurplus;

    const statusBadge = isWhiteSpot
      ? isEn ? 'Crowded Classes' : isUa ? 'Переповнені Класи' : 'Zagęszczone Oddziały'
      : isSurplus
      ? isEn ? 'Cosy Classrooms' : isUa ? 'Затишні Класи' : 'Kameralne Oddziały'
      : isEn ? 'Standard Class Size' : isUa ? 'Стандартний Розмір' : 'Standardowy Wymiar';

    return {
      placesShortLabel: isEn ? 'Primary School Places' : isUa ? 'Місця в Початкових Школах' : 'Miejsca w Szkołach SP',
      placesCount: schoolCap.toLocaleString(),
      placesRaw: schoolCap,
      facilitiesSubtitle: formatSchoolsLabel(schools, language),
      balanceFormatted: `${schoolBal >= 0 ? `+${schoolBal.toLocaleString()}` : schoolBal.toLocaleString()}`,
      balanceRaw: schoolBal,
      balanceSubtitle: schoolBal >= 0
        ? (isEn ? 'capacity reserve in SP' : isUa ? 'резерв місць у школах' : 'rezerwa miejsc w SP')
        : (isEn ? 'classroom deficit' : isUa ? 'дефіцит класів' : 'deficyt oddziałów'),
      isNegativeBalance: schoolBal < 0,
      forecastChildren: students.toLocaleString(),
      forecastChildrenUnit: isEn ? 'primary students' : isUa ? 'учнів шкіл' : 'uczniów w SP',
      coverageLabel: isEn ? 'Average class size' : isUa ? 'Середній розмір класу' : 'Średnia wielkość klasy',
      coverageValue: isEn ? `${avgClass} std. / class` : isUa ? `${avgClass} учн. / клас` : `${avgClass} os. / oddział`,
      progressPercent: Math.min(100, (avgClass / 25) * 100),
      status: { isWhiteSpot, isSurplus, isBalanced },
      statusBadge,
    };
  }

  // 3. INFANT: Pure arithmetic (places minus projected 2028 toddlers)
  if (cohort === 'infant') {
    const carePlaces: number = rawE?.totalCarePlaces0To3 ?? rawE?.totalCarePlaces0to3 ?? 0;
    const nurseriesCount: number =
      (rawE?.nurseriesPublicCount ?? 0) +
      (rawE?.nurseriesContractedCount ?? 0) +
      (rawE?.nurseriesPrivateCount ?? 0) +
      (rawE?.kidsClubsCount ?? 0);
    const p03: number = rawF?.forecastedAge0To3_2028 ?? rawF?.forecastedAge0to3_2028 ?? rawD?.age0To3 ?? rawD?.age0to3 ?? 1;
    const balance: number = carePlaces - p03;
    const b2b: string = rawF?.nurseryInvestmentPotentialB2B ?? 'LOW';
    const isWhiteSpot = balance <= -750 || b2b === 'HIGH';
    const covPct = p03 > 0 ? Math.round((carePlaces / p03) * 100) : 0;
    const isSurplus = covPct >= 75 || balance >= -150;
    const isBalanced = !isWhiteSpot && !isSurplus;

    const statusBadge = isWhiteSpot
      ? isEn ? 'White Spot (High Deficit)' : isUa ? 'Біла Пляма (Високий Дефіцит)' : 'Biała Plama (Wysoki Deficyt)'
      : isSurplus
      ? isEn ? 'High Availability' : isUa ? 'Висока Доступність' : 'Wysoka Dostępność'
      : isEn ? 'Balanced Market' : isUa ? 'Збалансований Ринок' : 'Rynek Zrównoważony';

    return {
      placesShortLabel: isEn ? 'Nursery Places' : isUa ? 'Місця в Яслах' : 'Miejsca w Żłobkach',
      placesCount: carePlaces.toLocaleString(),
      placesRaw: carePlaces,
      facilitiesSubtitle: formatNurseriesLabel(nurseriesCount, language),
      balanceFormatted: `${balance >= 0 ? `+${balance.toLocaleString()}` : balance.toLocaleString()}`,
      balanceRaw: balance,
      balanceSubtitle: balance >= 0
        ? (isEn ? 'recruitment reserve' : isUa ? 'рекрутинговий резерв' : 'rezerwa rekrutacyjna')
        : (isEn ? 'care supply deficit' : isUa ? 'дефіцит пропозиції' : 'luka podażowa opieki'),
      isNegativeBalance: balance < 0,
      forecastChildren: p03.toLocaleString(),
      forecastChildrenUnit: isEn ? 'toddlers (0–3)' : isUa ? 'малюків (0–3)' : 'maluchów (0–3)',
      coverageLabel: isEn ? 'Nursery demand coverage' : isUa ? 'Покриття попиту в яслах' : 'Pokrycie popytu żłobkowego',
      coverageValue: `${covPct}%`,
      progressPercent: Math.min(100, covPct),
      status: { isWhiteSpot, isSurplus, isBalanced },
      statusBadge,
    };
  }

  // 4. ALL COHORTS (0–14)
  const carePlaces: number = rawE?.totalCarePlaces0To3 ?? rawE?.totalCarePlaces0to3 ?? 0;
  const kgPlaces: number = rawE?.kindergartenPlacesTotal ?? 0;
  const schools: number = rawE?.primarySchoolsCount ?? 0;
  const schoolCap = schools * 350;
  const totalCapacity = carePlaces + kgPlaces + schoolCap;

  const nurseriesCount: number =
    (rawE?.nurseriesPublicCount ?? 0) +
    (rawE?.nurseriesContractedCount ?? 0) +
    (rawE?.nurseriesPrivateCount ?? 0) +
    (rawE?.kidsClubsCount ?? 0);
  const kgCount: number = rawE?.kindergartensCount ?? 0;
  const totalFacilities = nurseriesCount + kgCount + schools;

  const p03: number = rawF?.forecastedAge0To3_2028 ?? rawF?.forecastedAge0to3_2028 ?? rawD?.age0To3 ?? rawD?.age0to3 ?? 0;
  const p46: number = rawF?.forecastedAge4To6_2028 ?? rawF?.forecastedAge4to6_2028 ?? rawD?.age4To6 ?? rawD?.age4to6 ?? 0;
  const students: number = rawE?.primarySchoolStudentsTotal ?? 0;
  const totalChildren = p03 + p46 + students;
  const totalBal = totalCapacity - totalChildren;

  // Real Demand Coverage (Supply vs Demand):
  const totalCovPct = totalChildren > 0 ? Math.round((totalCapacity / totalChildren) * 100) : 100;

  // Clean, consistent status logic for aggregated balance:
  const isWhiteSpot = totalBal <= 150;
  const isSurplus = totalBal >= 1600;
  const isBalanced = !isWhiteSpot && !isSurplus;

  const statusBadge = isWhiteSpot
    ? totalBal < 0
      ? isEn ? 'Edu-Care Base Deficit' : isUa ? 'Дефіцит Бази Edu-Care' : 'Deficyt Bazy Edu-Care'
      : isEn ? 'Tight Base Balance' : isUa ? 'Напружений Баланс Бази' : 'Napięty Bilans Bazy'
    : isSurplus
    ? isEn ? 'High Availability' : isUa ? 'Висока Доступність' : 'Wysoka Dostępność'
    : isEn ? 'Balanced Market' : isUa ? 'Збалансований Ринок' : 'Rynek Zrównoważony';

  const balanceSubtitle = totalBal < 0
    ? (isEn ? 'capacity deficit' : isUa ? 'дефіцит бази' : 'deficyt bazy')
    : totalBal <= 200
    ? (isEn ? 'minimal reserve' : isUa ? 'мінімальний резерв' : 'minimalna rezerwa')
    : (isEn ? 'educational reserve' : isUa ? 'освітній резерв' : 'rezerwa edukacyjna');

  return {
    placesShortLabel: isEn ? 'Total Places Base' : isUa ? 'Загальна База Місць' : 'Łączna Baza Miejsc',
    placesCount: totalCapacity.toLocaleString(),
    placesRaw: totalCapacity,
    facilitiesSubtitle: formatFacilitiesLabel(totalFacilities, language),
    balanceFormatted: `${totalBal >= 0 ? `+${totalBal.toLocaleString()}` : totalBal.toLocaleString()}`,
    balanceRaw: totalBal,
    balanceSubtitle,
    isNegativeBalance: totalBal < 0,
    forecastChildren: totalChildren.toLocaleString(),
    forecastChildrenUnit: isEn ? 'children (0–14)' : isUa ? 'дітей (0–14)' : 'dzieci (0–14)',
    coverageLabel: isEn ? 'Average demand coverage' : isUa ? 'Середнє покриття попиту' : 'Średnie pokrycie popytu',
    coverageValue: `${totalCovPct}%`,
    progressPercent: Math.min(100, totalCovPct),
    status: { isWhiteSpot, isSurplus, isBalanced },
    statusBadge,
  };
}

export function calculateCityMacroStats(
  detailsMap: Map<number, DistrictDetailsDto>
): Record<ChildAgeCohort, MacroIndicators> {
  const districts = Array.from(detailsMap.values());
  return getMacroIndicators(districts);
}
