import type { DistrictDetailsDto } from '../../../types/contracts';
import type {
  BaselineDistrictMetrics,
  SimulatedDistrictMetrics,
  SimulatedMarketStatus,
  SimulatorInputs,
} from './types';

export const CAPEX_COSTS = {
  NURSERY_PLACE_PLN: 30000,
  CAS_FACILITY_PLN: 120000,
  POCKET_PARK_PLN: 250000,
  AVG_POCKET_PARK_M2: 2500,
};

export const DEFAULT_SIMULATOR_INPUTS: SimulatorInputs = {
  additionalNurseryPlaces: 120,
  additionalCasCount: 1,
  additionalPocketParks: 1,
};

export function mapDetailsToBaseline(d: DistrictDetailsDto): BaselineDistrictMetrics {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawD = d.demographics as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawF = d.forecastsAndB2B as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawEdu = d.educationAndCare as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawGreen = d.greeneryAndSport as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawCulture = d.cultureAndSociety as any;

  const population: number = rawD?.totalPopulation ?? 0;
  const areaKm2: number = d.areaKm2 ?? 1;

  const c03: number = rawD?.age0To3 ?? rawD?.age0to3 ?? 0;
  const f03: number = rawF?.forecastedAge0To3_2028 ?? rawF?.forecastedAge0to3_2028 ?? c03;
  const fBal: number = rawF?.forecastedCarePlacesBalance_2028 ?? rawF?.forecastedCarePlacesBalance2028 ?? 0;
  const carePlaces: number = rawEdu?.totalCarePlaces0to3 ?? rawEdu?.totalCarePlaces0To3 ?? 0;
  const baselineCoverage: number = f03 > 0 ? Math.round((carePlaces / f03) * 100) : 100;

  const seniors: number = rawD?.seniors65Plus ?? 0;
  const seniorShare: number = population > 0 ? Number(((seniors / population) * 100).toFixed(1)) : 21.9;
  const currentCas: number = rawCulture?.seniorActivityCentersCount ?? 0;

  const cityParks: number = rawGreen?.cityParksCount ?? 0;
  const pocketParks: number = rawGreen?.pocketParksCount ?? 0;
  const totalGreenHa: number = rawGreen?.totalGreenAreaHa ?? 0;
  const greenM2PerCapita: number = rawGreen?.greenAreaM2PerCapita ?? 0;

  const nurseryB2B = (rawF?.nurseryInvestmentPotentialB2B as 'HIGH' | 'MEDIUM' | 'LOW') || 'LOW';
  const seniorDeficit = (rawF?.seniorInfrastructureDeficit as 'HIGH' | 'MEDIUM' | 'LOW') || 'LOW';
  const greenDeficit = (rawF?.greenSpaceDeficit as 'HIGH' | 'MEDIUM' | 'LOW') || 'LOW';

  return {
    districtId: d.districtId,
    districtRoman: d.districtRoman,
    districtName: d.districtName,
    population,
    areaKm2,
    carePlaces0To3: carePlaces,
    age0To3_current: c03,
    forecastedAge0To3_2028: f03,
    baselineBalance2028: fBal,
    baselineCoveragePct2028: baselineCoverage,
    nurseryPotentialB2B: nurseryB2B,
    seniors65Plus: seniors,
    seniorSharePct: seniorShare,
    currentCasCount: currentCas,
    seniorDeficitLevel: seniorDeficit,
    cityParksCount: cityParks,
    pocketParksCount: pocketParks,
    totalGreenAreaHa: totalGreenHa,
    greenAreaM2PerCapita: greenM2PerCapita,
    greenDeficitLevel: greenDeficit,
    demographicVitalityScore: d.scores.demographicVitalityScore,
    rawDetails: d,
  };
}

export function calculateWhatIfImpact(
  baseline: BaselineDistrictMetrics,
  inputs: SimulatorInputs
): SimulatedDistrictMetrics {
  // 1. Childcare 0-3 calculation
  const newCarePlaces0To3 = baseline.carePlaces0To3 + inputs.additionalNurseryPlaces;
  const newBalance2028 = baseline.baselineBalance2028 + inputs.additionalNurseryPlaces;
  const balanceImprovement = inputs.additionalNurseryPlaces;
  const newCoveragePct2028 =
    baseline.forecastedAge0To3_2028 > 0
      ? Math.round((newCarePlaces0To3 / baseline.forecastedAge0To3_2028) * 100)
      : 100;
  const coverageImprovementPct = Math.max(0, newCoveragePct2028 - baseline.baselineCoveragePct2028);

  // 2. Senior CAS calculation
  const newCasCount = baseline.currentCasCount + inputs.additionalCasCount;
  const casImprovement = inputs.additionalCasCount;
  const seniorDeficitRelieved =
    baseline.seniorDeficitLevel === 'HIGH' ? inputs.additionalCasCount >= 1 : true;

  // 3. Greenery & Pocket Parks calculation
  const newPocketParksCount = baseline.pocketParksCount + inputs.additionalPocketParks;
  const parksImprovement = inputs.additionalPocketParks;
  const additionalGreenM2 = inputs.additionalPocketParks * CAPEX_COSTS.AVG_POCKET_PARK_M2;
  const baseGreenM2Total = baseline.totalGreenAreaHa * 10000;
  const totalNewGreenM2 = baseGreenM2Total + additionalGreenM2;
  const estimatedNewGreenM2PerCapita =
    baseline.population > 0
      ? Number((totalNewGreenM2 / baseline.population).toFixed(1))
      : baseline.greenAreaM2PerCapita;
  const greenDeficitRelieved =
    baseline.greenDeficitLevel === 'HIGH' ? inputs.additionalPocketParks >= 1 : true;

  // 4. Score bump modeling
  // Coverage bump: up to 3.2 pts for substantial coverage expansion
  const coverageRatio = coverageImprovementPct / 30; // normalized
  const nurseryScoreBump = Math.min(3.2, coverageRatio * 3.2);
  // CAS bump: 0.7 pt per CAS facility (up to 2.1)
  const casScoreBump = inputs.additionalCasCount * 0.7;
  // Pocket park bump: 0.6 pt per park (up to 2.4)
  const parkScoreBump = inputs.additionalPocketParks * 0.6;

  const totalScoreDelta = Number((nurseryScoreBump + casScoreBump + parkScoreBump).toFixed(1));
  const newVitalityScore = Math.min(
    100,
    Number((baseline.demographicVitalityScore + totalScoreDelta).toFixed(1))
  );

  // 5. Market classification
  let newMarketStatus: SimulatedMarketStatus = 'CRITICAL_DEFICIT';
  if (newBalance2028 >= 40) {
    newMarketStatus = 'SURPLUS';
  } else if (newBalance2028 >= -100) {
    newMarketStatus = 'BALANCED';
  } else if (newBalance2028 >= -400) {
    newMarketStatus = 'MODERATE_DEFICIT';
  } else {
    newMarketStatus = 'CRITICAL_DEFICIT';
  }

  // 6. CAPEX modeling
  const estimatedNurseryCapexPln = inputs.additionalNurseryPlaces * CAPEX_COSTS.NURSERY_PLACE_PLN;
  const estimatedCasCapexPln = inputs.additionalCasCount * CAPEX_COSTS.CAS_FACILITY_PLN;
  const estimatedParksCapexPln = inputs.additionalPocketParks * CAPEX_COSTS.POCKET_PARK_PLN;
  const estimatedCapexPln =
    estimatedNurseryCapexPln + estimatedCasCapexPln + estimatedParksCapexPln;

  return {
    newCarePlaces0To3,
    newBalance2028,
    balanceImprovement,
    newCoveragePct2028,
    coverageImprovementPct,
    newCasCount,
    casImprovement,
    seniorDeficitRelieved,
    newPocketParksCount,
    parksImprovement,
    estimatedNewGreenM2PerCapita,
    greenDeficitRelieved,
    newVitalityScore,
    vitalityScoreDelta: totalScoreDelta,
    newMarketStatus,
    estimatedCapexPln,
    estimatedNurseryCapexPln,
    estimatedCasCapexPln,
    estimatedParksCapexPln,
  };
}
