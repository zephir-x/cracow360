import type { DistrictScoresDto } from '../../../types/contracts';

export type SimulatorPresetId =
  | 'custom'
  | 'family_package'
  | 'green_package'
  | 'mobility_package'
  | 'senior_culture_package';

export interface SimulatorLeversState {
  // 1. Education and Care (0–14 years)
  addedNurseries: number;       // 0..10 (+100 places for 0-3 year olds each)
  addedKindergartens: number;   // 0..10 (+125 places for 4-6 year olds each)
  addedPrimarySchools: number;  // 0..5  (+400 places for 7-14 year olds each)
  addedParentClubs: number;     // 0..10 (+1 Parent Club each)

  // 2. Greenery and Sport
  addedPocketParks: number;     // 0..15 (+0.25 ha of greenery each)
  addedCityParks: number;       // 0..5  (+2.0 ha of greenery each)
  addedSchoolSports: number;    // 0..10 (+1 sports facility / swimming pool)

  // 3. Transportation and the Bicycle (KMK / ZTP)
  addedBusStops: number;        // 0..15 (+1 bus stop KMK)
  addedTramStops: number;       // 0..10 (+1 tram stop KMK)
  addedBikeLanesKm: number;     // 0..15 (+1 km of bike lanes DDR)
  addedParkAndRide: number;     // 0..5  (+1 parking P+R and +15 bike racks)

  // 4. Culture and Seniors (65+)
  addedCasCenters: number;      // 0..10 (+1 Senior Activity Center CAS)
  addedLibraries: number;       // 0..8  (+1 branch of Kraków Library)
  addedCulturalCenters: number; // 0..5  (+1 cultural center / cultural center)
}

export interface SimulatorScoresWithComposite extends DistrictScoresDto {
  weightedQualityOfLifeIndex: number;
}

export interface SimulatorScoreComparison {
  before: SimulatorScoresWithComposite;
  after: SimulatorScoresWithComposite;
  deltas: SimulatorScoresWithComposite;
  rankBefore: number;
  rankAfter: number;
  rankDelta: number;
}

export interface SimulatorImpactMetrics {
  districtId: number;
  districtRoman: string;
  districtName: string;
  totalAddedItemsCount: number;

  // 1. Results of 8 Quality of Life pillars and position in the ranking of 18 districts (Resident-centric Approach)
  scores: SimulatorScoreComparison;

  // 2. Education and Care (0–14 years) – 2028 capacity assessment (Parent-Centric Approach and 2028 Forecast)
  age0To3_2028: number;
  targetNurseryDemand2028: number;
  nurseryPlacesBefore: number;
  nurseryPlacesAfter: number;
  nurseryBalanceBefore: number;
  nurseryBalanceAfter: number;
  nurseryCoverageBeforePct: number;
  nurseryCoverageAfterPct: number;
  childrenPerPlaceBefore: number;
  childrenPerPlaceAfter: number;
  parentClubsBefore: number;
  parentClubsAfter: number;

  age4To6_2028: number;
  kindergartenPlacesBefore: number;
  kindergartenPlacesAfter: number;
  kindergartenBalanceBefore: number;
  kindergartenBalanceAfter: number;
  kindergartenCoverageBeforePct: number;
  kindergartenCoverageAfterPct: number;

  age7To14_2028: number;
  schoolPlacesBefore: number;
  schoolPlacesAfter: number;
  schoolBalanceBefore: number;
  schoolBalanceAfter: number;
  schoolCoverageBeforePct: number;
  schoolCoverageAfterPct: number;
  avgClassSizeBefore: number;
  avgClassSizeAfter: number;

  totalChildren0To14_2028: number;
  totalEduPlacesBefore: number;
  totalEduPlacesAfter: number;
  totalEduBalanceBefore: number;
  totalEduBalanceAfter: number;
  totalEduCoverageBeforePct: number;
  totalEduCoverageAfterPct: number;

  // 3. Greenery and Sport
  parksCountBefore: number;
  parksCountAfter: number;
  pocketParksBefore: number;
  pocketParksAfter: number;
  cityParksBefore: number;
  cityParksAfter: number;
  greenAreaHaBefore: number;
  greenAreaHaAfter: number;
  greenM2PerCapitaBefore: number;
  greenM2PerCapitaAfter: number;
  sportsFacilitiesBefore: number;
  sportsFacilitiesAfter: number;

  // 4. Transportation and the Bicycle
  busStopsBefore: number;
  busStopsAfter: number;
  tramStopsBefore: number;
  tramStopsAfter: number;
  kmkStopsBefore: number;
  kmkStopsAfter: number;
  isochroneBeforePct: number;
  isochroneAfterPct: number;
  bikeLanesKmBefore: number;
  bikeLanesKmAfter: number;
  parkAndRideBefore: number;
  parkAndRideAfter: number;
  bikeRacksBefore: number;
  bikeRacksAfter: number;

  // 5. Culture and Seniors (65+)
  seniors2028: number;
  casCountBefore: number;
  casCountAfter: number;
  seniorsPerCasBefore: number;
  seniorsPerCasAfter: number;
  librariesBefore: number;
  librariesAfter: number;
  culturalCentersBefore: number;
  culturalCentersAfter: number;

  // Potential / deficits for recommendations
  nurseryPotentialB2B: 'HIGH' | 'MEDIUM' | 'LOW';
  seniorDeficit: 'HIGH' | 'MEDIUM' | 'LOW';
  greenDeficit: 'HIGH' | 'MEDIUM' | 'LOW';
}
