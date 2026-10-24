import type { DistrictDetailsDto } from '../../../types/contracts';

export type InvestorB2BFilter = 'all' | 'high' | 'medium' | 'low';

export interface InvestorMacro2028 {
  projectedToddlers2028: number;
  currentToddlers: number;
  toddlerGrowthPct: number;
  projectedPreschoolers2028: number;
  currentPreschoolers: number;
  preschoolGrowthPct: number;
  currentPrimaryStudents: number;
  primarySharePct: number;
  projectedNurseryBalance2028: number;
  highPotentialDistrictsCount: number;
}

export interface InvestorDistrictForecastData {
  districtId: number;
  districtRoman: string;
  districtName: string;

  // 0-3 Toddlers (Nurseries)
  carePlaces0to3: number;
  age0To3_current: number;
  age0To3_2028: number;
  toddlerDelta: number;
  nurseryBalance2028: number;

  // 4-6 Preschoolers (Kindergartens)
  kindergartenPlacesTotal: number;
  age4To6_current: number;
  age4To6_2028: number;
  preschoolDelta: number;
  kindergartenBalance2028: number;

  // 7-14 Primary Schools (Fully symmetrical with 0-3 and 4-6)
  primarySchoolsCount: number;
  primarySchoolStudentsTotal: number;
  age7To14_current: number;
  age7To14_2028: number;
  studentDelta: number;
  avgStudentsPerClass: number;
  schoolPlacesBalance: number;
  schoolPlacesBalance2028: number;

  // 0-14 Comprehensive Summary (Fully symmetrical with 2028 projection)
  totalChildren0To14: number;
  totalChildren2028: number;
  totalDelta0To14: number;
  totalCapacity0To14: number;
  totalBalance0To14: number;
  totalBalance2028: number;
  totalCoveragePct0To14: number;
  totalCoveragePct2028: number;

  // B2B & Deficits
  nurseryPotentialB2B: 'HIGH' | 'MEDIUM' | 'LOW';
  seniorDeficit: 'HIGH' | 'MEDIUM' | 'LOW';
  greenDeficit: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedAction: string;
  educationalAction: string;
  demographicVitalityScore: number;
  rawDetails: DistrictDetailsDto;
}
