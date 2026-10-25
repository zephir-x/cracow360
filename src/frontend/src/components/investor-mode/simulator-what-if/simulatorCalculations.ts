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
  const rawD = d.demographics as any;
  const rawF = d.forecastsAndB2B as any;
  const rawEdu = d.educationAndCare as any;
  const rawGreen = d.greeneryAndSport as any;
  const rawCulture = d.cultureAndSociety as any;

  const population: number = rawD?.totalPopulation ?? 0;
  const areaKm2: number = d.areaKm2 ?? 1;

  const c03: number = rawD?.age0To3 ?? rawD?.age0to3 ?? 0;
  const f03: number = rawF?.forecastedAge0To3_2028 ?? rawF?.forecastedAge0to3_2028 ?? c03;
  const fBal: number = rawF?.forecastedCarePlacesBalance_2028 ?? rawF?.forecastedCarePlacesBalance2028 ?? 0;
  const carePlaces: number = rawEdu?.totalCarePlaces0to3 ?? rawEdu?.totalCarePlaces0To3 ?? 0;
  const baselineCoverage: number = f03 > 0 ? Math.round((carePlaces / f03) * 100) : 100;

  const seniors: number = rawD?.age65Plus ?? rawD?.age65plus ?? rawD?.seniors65Plus ?? 0;
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

  // 2. CAS & Pocket Parks calculation
  const newCasCount = baseline.currentCasCount + inputs.additionalCasCount;
  const newPocketParksCount = baseline.pocketParksCount + inputs.additionalPocketParks;

  // Green Area added: each pocket park adds ~2,500 m2
  const additionalGreenM2 = inputs.additionalPocketParks * CAPEX_COSTS.AVG_POCKET_PARK_M2;
  const greenAreaM2PerCapitaDelta =
    baseline.population > 0 ? Number((additionalGreenM2 / baseline.population).toFixed(2)) : 0;
  const estimatedNewGreenM2PerCapita = Number(
    (baseline.greenAreaM2PerCapita + greenAreaM2PerCapitaDelta).toFixed(2)
  );

  // 3. Demographic Vitality Index Boost
  // Formula:
  // - each 10 nursery places reduces deficit -> +0.15 pts (up to +2.5 pts)
  // - each CAS adds +0.35 pts (up to +1.0 pts)
  // - each pocket park adds +0.25 pts (up to +1.0 pts)
  const nurseryVitalityBoost = Math.min(2.5, (inputs.additionalNurseryPlaces / 10) * 0.15);
  const casVitalityBoost = Math.min(1.0, inputs.additionalCasCount * 0.35);
  const parksVitalityBoost = Math.min(1.0, inputs.additionalPocketParks * 0.25);
  const vitalityScoreDelta = Number(
    (nurseryVitalityBoost + casVitalityBoost + parksVitalityBoost).toFixed(1)
  );
  const newVitalityScore = Number(
    Math.min(100, baseline.demographicVitalityScore + vitalityScoreDelta).toFixed(1)
  );

  // 4. Simulated Market Status
  let newMarketStatus: SimulatedMarketStatus = 'CRITICAL_DEFICIT';
  if (newBalance2028 >= 100) {
    newMarketStatus = 'SURPLUS';
  } else if (newBalance2028 >= -50) {
    newMarketStatus = 'BALANCED';
  } else if (newBalance2028 >= -200) {
    newMarketStatus = 'MODERATE_DEFICIT';
  } else {
    newMarketStatus = 'CRITICAL_DEFICIT';
  }

  // 5. Estimated Financial Capex
  const nurseryCapexPln = inputs.additionalNurseryPlaces * CAPEX_COSTS.NURSERY_PLACE_PLN;
  const casCapexPln = inputs.additionalCasCount * CAPEX_COSTS.CAS_FACILITY_PLN;
  const parksCapexPln = inputs.additionalPocketParks * CAPEX_COSTS.POCKET_PARK_PLN;
  const estimatedCapexPln = nurseryCapexPln + casCapexPln + parksCapexPln;

  return {
    inputs,
    newCarePlaces0To3,
    newBalance2028,
    newCoveragePct2028,
    balanceImprovement,
    coverageImprovementPct,
    newCasCount,
    casImprovement: inputs.additionalCasCount,
    seniorDeficitRelieved: newCasCount >= 2 || baseline.seniorDeficitLevel === 'LOW',
    newPocketParksCount,
    parksImprovement: inputs.additionalPocketParks,
    estimatedNewGreenM2PerCapita,
    greenDeficitRelieved: estimatedNewGreenM2PerCapita >= 25 || baseline.greenDeficitLevel === 'LOW',
    vitalityScoreDelta,
    newVitalityScore,
    newMarketStatus,
    estimatedCapexPln,
    estimatedNurseryCapexPln: nurseryCapexPln,
    estimatedCasCapexPln: casCapexPln,
    estimatedParksCapexPln: parksCapexPln,
  };
}
