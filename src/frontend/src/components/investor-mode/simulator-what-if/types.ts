import type { DistrictDetailsDto } from '../../../types/contracts';

export interface SimulatorInputs {
  additionalNurseryPlaces: number; // 0 to 300
  additionalCasCount: number; // 0 to 3
  additionalPocketParks: number; // 0 to 4
}

export type SimulatedMarketStatus = 'CRITICAL_DEFICIT' | 'MODERATE_DEFICIT' | 'BALANCED' | 'SURPLUS';

export interface BaselineDistrictMetrics {
  districtId: number;
  districtRoman: string;
  districtName: string;
  population: number;
  areaKm2: number;

  // 0-3 Nursery
  carePlaces0To3: number;
  age0To3_current: number;
  forecastedAge0To3_2028: number;
  baselineBalance2028: number;
  baselineCoveragePct2028: number;
  nurseryPotentialB2B: 'HIGH' | 'MEDIUM' | 'LOW';

  // Senior 65+ & CAS
  seniors65Plus: number;
  seniorSharePct: number;
  currentCasCount: number;
  seniorDeficitLevel: 'HIGH' | 'MEDIUM' | 'LOW';

  // Greenery & Parks
  cityParksCount: number;
  pocketParksCount: number;
  totalGreenAreaHa: number;
  greenAreaM2PerCapita: number;
  greenDeficitLevel: 'HIGH' | 'MEDIUM' | 'LOW';

  // Demographic vitality
  demographicVitalityScore: number;

  rawDetails: DistrictDetailsDto;
}

export interface SimulatedDistrictMetrics {
  inputs: SimulatorInputs;

  // Childcare 0-3
  newCarePlaces0To3: number;
  newBalance2028: number;
  balanceImprovement: number;
  newCoveragePct2028: number;
  coverageImprovementPct: number;

  // Senior & CAS
  newCasCount: number;
  casImprovement: number;
  seniorDeficitRelieved: boolean;

  // Greenery & Parks
  newPocketParksCount: number;
  parksImprovement: number;
  estimatedNewGreenM2PerCapita: number;
  greenDeficitRelieved: boolean;

  // Score impact
  newVitalityScore: number;
  vitalityScoreDelta: number;

  // Status & Financials
  newMarketStatus: SimulatedMarketStatus;
  estimatedCapexPln: number;
  estimatedNurseryCapexPln: number;
  estimatedCasCapexPln: number;
  estimatedParksCapexPln: number;
}
