import type { DistrictScoresDto } from '../../../types/contracts';

export type SimulatorPresetId =
  | 'custom'
  | 'family_package'
  | 'green_package'
  | 'mobility_package'
  | 'senior_culture_package';

export interface SimulatorLeversState {
  // 1. Edukacja i Opieka (0-14 lat)
  addedNurseries: number;       // 0..10 (+100 miejsc 0-3 lat każdy)
  addedKindergartens: number;   // 0..10 (+125 miejsc 4-6 lat każde)
  addedPrimarySchools: number;  // 0..5  (+400 miejsc 7-14 lat każda)
  addedParentClubs: number;     // 0..10 (+1 Klub Rodzica każdy)

  // 2. Zieleń i Sport
  addedPocketParks: number;     // 0..15 (+0.25 ha zieleni każdy)
  addedCityParks: number;       // 0..5  (+2.0 ha zieleni każdy)
  addedSchoolSports: number;    // 0..10 (+1 obiekt sportowy / pływalnia)

  // 3. Komunikacja i Rower (KMK / ZTP)
  addedBusStops: number;        // 0..15 (+1 przystanek autobusowy KMK)
  addedTramStops: number;       // 0..10 (+1 przystanek tramwajowy KMK)
  addedBikeLanesKm: number;     // 0..15 (+1 km dróg dla rowerów DDR)
  addedParkAndRide: number;     // 0..5  (+1 parking P+R i +15 stojaków rowerowych)

  // 4. Kultura i Seniorzy (65+)
  addedCasCenters: number;      // 0..10 (+1 Centrum Aktywności Seniora CAS)
  addedLibraries: number;       // 0..8  (+1 filia Biblioteki Kraków)
  addedCulturalCenters: number; // 0..5  (+1 dom / ośrodek kultury)
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

  // 1. Wyniki 8 filarów Jakości Życia i pozycja w rankingu 18 dzielnic (Tryb Mieszkańca)
  scores: SimulatorScoreComparison;

  // 2. Edukacja i Opieka (0-14 lat) - bilans miejsc 2028 (Tryb Rodzica i Prognoza 2028)
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

  // 3. Zieleń i Sport
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

  // 4. Komunikacja i Rower
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

  // 5. Kultura i Seniorzy (65+)
  seniors2028: number;
  casCountBefore: number;
  casCountAfter: number;
  seniorsPerCasBefore: number;
  seniorsPerCasAfter: number;
  librariesBefore: number;
  librariesAfter: number;
  culturalCentersBefore: number;
  culturalCentersAfter: number;

  // Potencjał / deficyty do rekomendacji
  nurseryPotentialB2B: 'HIGH' | 'MEDIUM' | 'LOW';
  seniorDeficit: 'HIGH' | 'MEDIUM' | 'LOW';
  greenDeficit: 'HIGH' | 'MEDIUM' | 'LOW';
}
