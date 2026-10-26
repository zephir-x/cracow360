import type { DistrictDetailsDto } from '../../../types/contracts';
import type { Language } from '../../../i18n/types';
import { getEducationalRecommendation as getEduRec } from '../../../i18n/investorForecastI18n';
import type { InvestorDistrictForecastData, InvestorMacro2028 } from './types';

export function determineEducationExpansionPriority(
  nurseryBalance2028: number,
  kindergartenBalance2028: number,
  schoolPlacesBalance2028: number,
  totalBalance2028: number,
  totalCoveragePct2028: number
): 'HIGH' | 'MEDIUM' | 'LOW' {
  // HIGH ("Pilna potrzeba rozbudowy"): negative total 0-14 balance OR severe deficit in nurseries (<= -800) or schools (<= -400)
  if (
    totalBalance2028 < 0 ||
    nurseryBalance2028 <= -800 ||
    schoolPlacesBalance2028 <= -400
  ) {
    return 'HIGH';
  }

  // LOW ("Dobra dostępność miejsc"): high overall coverage (>= 135%), no school/kindergarten deficit, and mild/positive nursery balance (>= -350)
  if (
    totalCoveragePct2028 >= 135 &&
    schoolPlacesBalance2028 >= 0 &&
    kindergartenBalance2028 >= 0 &&
    nurseryBalance2028 >= -350
  ) {
    return 'LOW';
  }

  // MEDIUM ("Umiarkowane zapotrzebowanie"): positive overall balance, but moderate gap in one of the age brackets
  return 'MEDIUM';
}

export function getEducationalRecommendation(
  nurseryPotential: 'HIGH' | 'MEDIUM' | 'LOW',
  nurseryBal2028: number,
  kinderBal2028: number,
  schoolBal2028: number,
  avgPerClass: number,
  language: Language = 'pl'
): string {
  return getEduRec(
    {
      nurseryPotentialB2B: nurseryPotential,
      nurseryBalance2028: nurseryBal2028,
      kindergartenBalance2028: kinderBal2028,
      schoolPlacesBalance2028: schoolBal2028,
      avgStudentsPerClass: avgPerClass,
    },
    language
  );
}

export function calculateInvestorMacro2028(details: DistrictDetailsDto[]): InvestorMacro2028 {
  let projectedToddlers = 0;
  let currentToddlers = 0;
  let projectedPreschoolers = 0;
  let currentPreschoolers = 0;
  let projectedPrimaryStudents = 0;
  let currentPrimaryStudents = 0;
  let projectedNurseryBalance = 0;
  let highPotentialCount = 0;

  details.forEach((d) => {
    const mapped = mapDistrictForecastData(d, 'pl');

    currentToddlers += mapped.age0To3_current;
    projectedToddlers += mapped.age0To3_2028;
    currentPreschoolers += mapped.age4To6_current;
    projectedPreschoolers += mapped.age4To6_2028;
    currentPrimaryStudents += mapped.age7To14_current;
    projectedPrimaryStudents += mapped.age7To14_2028;
    projectedNurseryBalance += mapped.nurseryBalance2028;

    if (mapped.nurseryPotentialB2B === 'HIGH') {
      highPotentialCount++;
    }
  });

  const toddlerGrowthPct =
    currentToddlers > 0
      ? Number((((projectedToddlers - currentToddlers) / currentToddlers) * 100).toFixed(1))
      : 0;

  const preschoolGrowthPct =
    currentPreschoolers > 0
      ? Number((((projectedPreschoolers - currentPreschoolers) / currentPreschoolers) * 100).toFixed(1))
      : 0;

  const primaryStudentsGrowthPct =
    currentPrimaryStudents > 0
      ? Number(
          (((projectedPrimaryStudents - currentPrimaryStudents) / currentPrimaryStudents) * 100).toFixed(1)
        )
      : 0;

  const totalKids2028 = projectedToddlers + projectedPreschoolers + projectedPrimaryStudents;
  const primarySharePct =
    totalKids2028 > 0
      ? Number(((projectedPrimaryStudents / totalKids2028) * 100).toFixed(1))
      : 0;

  return {
    projectedToddlers2028: projectedToddlers,
    currentToddlers,
    toddlerGrowthPct,
    projectedPreschoolers2028: projectedPreschoolers,
    currentPreschoolers,
    preschoolGrowthPct,
    projectedPrimaryStudents2028: projectedPrimaryStudents,
    currentPrimaryStudents,
    primaryStudentsGrowthPct,
    primarySharePct,
    projectedNurseryBalance2028: projectedNurseryBalance,
    highPotentialDistrictsCount: highPotentialCount,
  };
}

export function mapDistrictForecastData(
  d: DistrictDetailsDto,
  language: Language = 'pl'
): InvestorDistrictForecastData {
  const rawD = d.demographics as any;
  const rawF = d.forecastsAndB2B as any;
  const rawEdu = d.educationAndCare as any;

  const c03: number = rawD?.age0To3 ?? rawD?.age0to3 ?? 0;
  const c46: number = rawD?.age4To6 ?? rawD?.age4to6 ?? 0;
  const c714: number = rawD?.age7To14 ?? rawD?.age7to14 ?? 0;

  const f03: number = rawF?.forecastedAge0To3_2028 ?? rawF?.forecastedAge0to3_2028 ?? c03;
  const f46: number = rawF?.forecastedAge4To6_2028 ?? rawF?.forecastedAge4to6_2028 ?? c46;

  // Econometric demographic projection for 7-14 based on 3-year district growth trends
  const growthRate3Yr: number = rawD?.populationGrowthRate3YrPct ?? 0;
  const f714: number = Math.round(c714 * (1 + growthRate3Yr / 100));
  const studentDelta: number = f714 - c714;

  const carePlaces0to3: number = rawEdu?.totalCarePlaces0to3 ?? rawEdu?.totalCarePlaces0To3 ?? 0;
  // Consistent 100% cohort balance so 0-3 + 4-6 + 7-14 balances sum identically to totalBalance2028
  const nurseryBalance2028: number = carePlaces0to3 - f03;

  const kindergartenPlacesTotal: number =
    rawEdu?.kindergartenPlacesTotal ?? rawEdu?.kindergartensPlacesTotal ?? 0;
  const kindergartenBalance2028: number = kindergartenPlacesTotal - f46;

  const primarySchoolsCount: number = rawEdu?.primarySchoolsCount ?? 0;
  const primarySchoolStudentsTotal: number = rawEdu?.primarySchoolStudentsTotal ?? 0;
  const avgStudentsPerClass: number = rawEdu?.avgStudentsPerClass ?? 0;
  const schoolPlacesBalance: number = primarySchoolStudentsTotal - c714;
  const schoolPlacesBalance2028: number = primarySchoolStudentsTotal - f714;

  // Comprehensive 0-14 Edu-Care calculations (Current and 2028)
  const totalChildren0To14 = c03 + c46 + c714;
  const totalChildren2028 = f03 + f46 + f714;
  const totalDelta0To14 = totalChildren2028 - totalChildren0To14;
  const totalCapacity0To14 = carePlaces0to3 + kindergartenPlacesTotal + primarySchoolStudentsTotal;
  const totalBalance0To14 = totalCapacity0To14 - totalChildren0To14;
  const totalBalance2028 = totalCapacity0To14 - totalChildren2028;
  const totalCoveragePct0To14 =
    totalChildren0To14 > 0 ? Math.round((totalCapacity0To14 / totalChildren0To14) * 100) : 0;
  const totalCoveragePct2028 =
    totalChildren2028 > 0 ? Math.round((totalCapacity0To14 / totalChildren2028) * 100) : 0;

  const nurseryPotentialB2B = determineEducationExpansionPriority(
    nurseryBalance2028,
    kindergartenBalance2028,
    schoolPlacesBalance2028,
    totalBalance2028,
    totalCoveragePct2028
  );

  const seniorDeficit = (rawF?.seniorInfrastructureDeficit as 'HIGH' | 'MEDIUM' | 'LOW') || 'LOW';
  const greenDeficit = (rawF?.greenSpaceDeficit as 'HIGH' | 'MEDIUM' | 'LOW') || 'LOW';
  const recommendedAction: string = rawF?.recommendedMunicipalAction ?? '';

  const educationalAction = getEducationalRecommendation(
    nurseryPotentialB2B,
    nurseryBalance2028,
    kindergartenBalance2028,
    schoolPlacesBalance2028,
    avgStudentsPerClass,
    language
  );

  return {
    districtId: d.districtId,
    districtRoman: d.districtRoman,
    districtName: d.districtName,
    carePlaces0to3,
    age0To3_current: c03,
    age0To3_2028: f03,
    toddlerDelta: f03 - c03,
    nurseryBalance2028,
    kindergartenPlacesTotal,
    age4To6_current: c46,
    age4To6_2028: f46,
    preschoolDelta: f46 - c46,
    kindergartenBalance2028,
    primarySchoolsCount,
    primarySchoolStudentsTotal,
    age7To14_current: c714,
    age7To14_2028: f714,
    studentDelta,
    avgStudentsPerClass,
    schoolPlacesBalance,
    schoolPlacesBalance2028,
    totalChildren0To14,
    totalChildren2028,
    totalDelta0To14,
    totalCapacity0To14,
    totalBalance0To14,
    totalBalance2028,
    totalCoveragePct0To14,
    totalCoveragePct2028,
    nurseryPotentialB2B,
    seniorDeficit,
    greenDeficit,
    recommendedAction,
    educationalAction,
    demographicVitalityScore: d.scores.demographicVitalityScore,
    rawDetails: d,
  };
}
