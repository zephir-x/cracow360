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
} from '../../../i18n/modules';
import {
  calculatePrimarySchoolCapacity,
  calculateTotalEduCareCapacity,
} from '../../../utils/educationCapacity';

// City-wide Macro Aggregations (Infants, Preschool, Primary, All) – Pure Current State
export function getMacroIndicators(
  districts: DistrictDetailsDto[]
): Record<ChildAgeCohort, MacroIndicators> {
  let nurseryPlaces = 0;
  let nurseryWhiteSpots = 0;
  let current0To3 = 0;

  let kgPlaces = 0;
  let kgDistrictsHighDemand = 0;
  let current4To6 = 0;

  let primarySchools = 0;
  let current7To14 = 0;
  let primaryStudents = 0;
  let crowdedSchoolsDistricts = 0;

  let allTotalCapacity = 0;
  let allTotalChildren = 0;
  let allTightDistricts = 0;

  districts.forEach((d) => {
    const rawD = d.demographics as any;
    const rawE = d.educationAndCare as any;

    const c03 = rawD?.age0To3 ?? rawD?.age0to3 ?? 0;
    const c46 = rawD?.age4To6 ?? rawD?.age4to6 ?? 0;
    const c714 = rawD?.age7To14 ?? rawD?.age7to14 ?? 0;
    const stud = rawE?.primarySchoolStudentsTotal ?? 0;

    current0To3 += c03;
    current4To6 += c46;
    current7To14 += c714;
    primaryStudents += stud;

    // 1. Infants (0–3)
    const carePlaces = rawE?.totalCarePlaces0To3 ?? rawE?.totalCarePlaces0to3 ?? 0;
    nurseryPlaces += carePlaces;
    const nurBal = carePlaces - c03;
    const nurCov = c03 > 0 ? (carePlaces / c03) * 100 : 0;
    if (nurCov < 50 || nurBal <= -600) {
      nurseryWhiteSpots++;
    }

    // 2. Preschool (4–6)
    const kPlaces = rawE?.kindergartenPlacesTotal ?? 0;
    kgPlaces += kPlaces;
    const kCov = c46 > 0 ? (kPlaces / c46) * 100 : 0;
    const kBal = kPlaces - c46;
    if (kCov < 125 || kBal < 150) {
      kgDistrictsHighDemand++;
    }

    // 3. Primary Schools (7–14) – Pure Demographics
    const schCount = rawE?.primarySchoolsCount ?? 0;
    primarySchools += schCount;
    const schCap = calculatePrimarySchoolCapacity(schCount);
    const schBal = schCap - c714;
    const schCov = c714 > 0 ? (schCap / c714) * 100 : 0;
    if (schCov < 100 || schBal <= 0) {
      crowdedSchoolsDistricts++;
    }

    // 4. All Cohorts (0–14) – Pure Demographics 0–3, 4–6, 7–14
    const totCap = calculateTotalEduCareCapacity(carePlaces, kPlaces, schCount);
    const totKids = c03 + c46 + c714;
    const totBal = totCap - totKids;

    allTotalCapacity += totCap;
    allTotalChildren += totKids;

    // Harmonized with Investor Mode: overall deficit OR severe nursery/school shortage
    if (totBal <= 0 || nurBal <= -800 || schBal <= -400) {
      allTightDistricts++;
    }
  });

  const nurseryBalance = nurseryPlaces - current0To3;
  const infantCoverage = current0To3 > 0 ? Math.round((nurseryPlaces / current0To3) * 100) : 0;
  const preschoolBalance = kgPlaces - current4To6;
  const preschoolCoverage = current4To6 > 0 ? Math.round((kgPlaces / current4To6) * 100) : 0;
  const schoolCapacity = calculatePrimarySchoolCapacity(primarySchools);
  const schoolBalance = schoolCapacity - current7To14;
  const schoolCoverage = current7To14 > 0 ? Math.round((schoolCapacity / current7To14) * 100) : 0;

  const allTotalBalance = allTotalCapacity - allTotalChildren;
  const allCoveragePct = allTotalChildren > 0 ? Math.round((allTotalCapacity / allTotalChildren) * 100) : 0;

  return {
    infant: {
      balance: nurseryBalance,
      criticalDistricts: nurseryWhiteSpots,
      coveragePct: infantCoverage,
      projectedChildren: current0To3,
    },
    preschool: {
      balance: preschoolBalance,
      criticalDistricts: kgDistrictsHighDemand,
      coveragePct: preschoolCoverage,
      projectedChildren: current4To6,
    },
    school: {
      balance: schoolBalance,
      criticalDistricts: crowdedSchoolsDistricts,
      coveragePct: schoolCoverage,
      projectedChildren: current7To14,
    },
    all: {
      balance: allTotalBalance,
      criticalDistricts: allTightDistricts,
      coveragePct: allCoveragePct,
      projectedChildren: allTotalChildren,
    },
  };
}

// District Cohort Calculation (Pure Current Math & Logic)
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
  
  const rawD = details.demographics as any;
  const rawE = details.educationAndCare as any;

  // 1. PRESCHOOL (4–6)
  if (cohort === 'preschool') {
    const kgPlaces: number = rawE?.kindergartenPlacesTotal ?? 0;
    const kgCount: number = rawE?.kindergartensCount ?? 0;
    const c46: number = rawD?.age4To6 ?? rawD?.age4to6 ?? 0;
    const kgBal = kgPlaces - c46;
    const covPct = c46 > 0 ? Math.round((kgPlaces / c46) * 100) : 0;
    const isWhiteSpot = covPct < 125 || kgBal < 150;
    const isSurplus = covPct >= 140 && kgBal >= 400;
    const isBalanced = !isWhiteSpot && !isSurplus;

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
      forecastChildren: c46.toLocaleString(),
      forecastChildrenUnit: isEn ? 'preschoolers' : isUa ? 'дошкільнят' : 'przedszkolaków',
      coverageLabel: isEn ? 'Preschool demand coverage' : isUa ? 'Покриття попиту в дитсадках' : 'Pokrycie popytu przedszkolnego',
      coverageValue: `${covPct}%`,
      progressPercent: Math.min(100, covPct),
      status: { isWhiteSpot, isSurplus, isBalanced },
      statusBadge,
    };
  }

  // 2. SCHOOL (7–14) – Pure Demographics (BDK age 7–14)
  if (cohort === 'school') {
    const schools: number = rawE?.primarySchoolsCount ?? 0;
    const schoolCap = calculatePrimarySchoolCapacity(schools);
    const c714: number = rawD?.age7To14 ?? rawD?.age7to14 ?? 0;
    const schoolBal = schoolCap - c714;
    const covPct = c714 > 0 ? Math.round((schoolCap / c714) * 100) : 0;

    const isWhiteSpot = covPct < 100 || schoolBal <= 0;
    const isSurplus = covPct >= 120 && schoolBal >= 300;
    const isBalanced = !isWhiteSpot && !isSurplus;

    const statusBadge = isWhiteSpot
      ? isEn ? 'High Demand' : isUa ? 'Підвищений Попит' : 'Zwiększone Zapotrzebowanie'
      : isSurplus
      ? isEn ? 'High Availability' : isUa ? 'Висока Доступність' : 'Wysoka Dostępność'
      : isEn ? 'Balanced Market' : isUa ? 'Збалансований Ринок' : 'Rynek Zrównoważony';

    return {
      placesShortLabel: isEn ? 'Primary School Places' : isUa ? 'Місця в Початкових Школах' : 'Miejsca w Szkołach SP',
      placesCount: schoolCap.toLocaleString(),
      placesRaw: schoolCap,
      facilitiesSubtitle: formatSchoolsLabel(schools, language),
      balanceFormatted: `${schoolBal >= 0 ? `+${schoolBal.toLocaleString()}` : schoolBal.toLocaleString()}`,
      balanceRaw: schoolBal,
      balanceSubtitle: schoolBal >= 0
        ? (isEn ? 'catchment reserve in SP' : isUa ? 'районний резерв у школах' : 'rezerwa rejonowa w SP')
        : (isEn ? 'places deficit in SP' : isUa ? 'дефіцит місць у школах' : 'deficyt miejsc w SP'),
      isNegativeBalance: schoolBal < 0,
      forecastChildren: c714.toLocaleString(),
      forecastChildrenUnit: isEn ? 'children (7–14)' : isUa ? 'дітей (7–14)' : 'dzieci (7–14)',
      coverageLabel: isEn ? 'Catchment demand coverage' : isUa ? 'Покриття районного попиту' : 'Pokrycie popytu rejonowego',
      coverageValue: `${covPct}%`,
      progressPercent: Math.min(100, covPct),
      status: { isWhiteSpot, isSurplus, isBalanced },
      statusBadge,
    };
  }

  // 3. INFANT (0–3) – Pure current state arithmetic
  if (cohort === 'infant') {
    const carePlaces: number = rawE?.totalCarePlaces0To3 ?? rawE?.totalCarePlaces0to3 ?? 0;
    const nurseriesCount: number =
      (rawE?.nurseriesPublicCount ?? 0) +
      (rawE?.nurseriesContractedCount ?? 0) +
      (rawE?.nurseriesPrivateCount ?? 0) +
      (rawE?.kidsClubsCount ?? 0);
    const c03: number = rawD?.age0To3 ?? rawD?.age0to3 ?? 0;
    const balance: number = carePlaces - c03;
    const covPct = c03 > 0 ? Math.round((carePlaces / c03) * 100) : 0;
    const isWhiteSpot = covPct < 50 || balance <= -600;
    const isSurplus = covPct >= 75 && balance >= -200;
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
      forecastChildren: c03.toLocaleString(),
      forecastChildrenUnit: isEn ? 'toddlers (0–3)' : isUa ? 'малюків (0–3)' : 'maluchów (0–3)',
      coverageLabel: isEn ? 'Nursery demand coverage' : isUa ? 'Покриття попиту в яслах' : 'Pokrycie popytu żłobkowego',
      coverageValue: `${covPct}%`,
      progressPercent: Math.min(100, covPct),
      status: { isWhiteSpot, isSurplus, isBalanced },
      statusBadge,
    };
  }

  // 4. ALL COHORTS (0–14) – Pure current demographic population (0–3 + 4–6 + 7–14)
  const carePlaces: number = rawE?.totalCarePlaces0To3 ?? rawE?.totalCarePlaces0to3 ?? 0;
  const kgPlaces: number = rawE?.kindergartenPlacesTotal ?? 0;
  const schools: number = rawE?.primarySchoolsCount ?? 0;
  const totalCapacity = calculateTotalEduCareCapacity(carePlaces, kgPlaces, schools);

  const nurseriesCount: number =
    (rawE?.nurseriesPublicCount ?? 0) +
    (rawE?.nurseriesContractedCount ?? 0) +
    (rawE?.nurseriesPrivateCount ?? 0) +
    (rawE?.kidsClubsCount ?? 0);
  const kgCount: number = rawE?.kindergartensCount ?? 0;
  const totalFacilities = nurseriesCount + kgCount + schools;

  const c03: number = rawD?.age0To3 ?? rawD?.age0to3 ?? 0;
  const c46: number = rawD?.age4To6 ?? rawD?.age4to6 ?? 0;
  const c714: number = rawD?.age7To14 ?? rawD?.age7to14 ?? 0;
  const totalChildren = c03 + c46 + c714;
  const totalBal = totalCapacity - totalChildren;

  // Real Demand Coverage (Supply vs Demand):
  const totalCovPct = totalChildren > 0 ? Math.round((totalCapacity / totalChildren) * 100) : 0;

  const nurBal = carePlaces - c03;
  const schCap = calculatePrimarySchoolCapacity(schools);
  const schBal = schCap - c714;

  // Harmonized market classification across all 18 districts (10 Deficit / 4 Balanced / 4 High Availability):
  const isWhiteSpot = totalBal <= 0 || nurBal <= -800 || schBal <= -400;
  const isSurplus = !isWhiteSpot && totalCovPct >= 160 && totalBal >= 1000;
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
    : nurBal <= -800
    ? (isEn ? 'nursery care deficit' : isUa ? 'дефіцит ясельного догляду' : 'deficyt opieki żłobkowej')
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
