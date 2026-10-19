import type { Feature, FeatureCollection, Geometry } from 'geojson';

export interface SystemHelloDto {
  message: string;
  projectName: string;
  competition: string;
  environment: string;
  databaseProvider: string;
  databaseConnected: boolean;
  seededDistrictsCount: number;
  seededPoisCount: number;
  serverTimeUtc: string;
}

export interface DistrictScoresDto {
  mobilityScore: number;
  educationScore: number;
  greeneryScore: number;
  cultureAndSeniorScore: number;
  environmentScore: number;
}

export interface DistrictSummaryDto {
  districtId: number;
  districtRoman: string;
  districtName: string;
  areaKm2: number;
  scores: DistrictScoresDto;
  totalPopulation: number;
  weightedQualityOfLifeIndex: number;
}

export interface DistrictDemographicsDto {
  totalPopulation: number;
  permanentResidents: number;
  temporaryResidents: number;
  foreignersTotal: number;
  age0To3: number;
  age4To6: number;
  age7To14: number;
  age15To64: number;
  age65Plus: number;
  populationGrowthRate3YrPct: number;
}

export interface DistrictEducationAndCareDto {
  nurseriesPublicCount: number;
  nurseriesContractedCount: number;
  nurseriesPrivateCount: number;
  kidsClubsCount: number;
  totalCarePlaces0To3: number;
  childrenPerCarePlaceRatio: number;
  parentClubsCount: number;
  kindergartensCount: number;
  kindergartenPlacesTotal: number;
  primarySchoolsCount: number;
  primarySchoolStudentsTotal: number;
  avgStudentsPerClass: number;
}

export interface DistrictMobilityAndTransportDto {
  kmkStopsCount: number;
  isochroneCoveragePct: number;
  parkAndRideCount: number;
  bikeRacksCount: number;
  bikeLanesLengthKm: number;
}

export interface DistrictGreeneryAndSportDto {
  cityParksCount: number;
  pocketParksCount: number;
  totalParksAreaHa: number;
  greenAreaM2PerCapita: number;
  schoolSportsFacilitiesCount: number;
  schoolSwimmingPoolsCount: number;
}

export interface DistrictCultureAndSocietyDto {
  libraryBranchesCount: number;
  culturalCentersCount: number;
  seniorActivityCentersCount: number;
  annualCulturalEventsCount: number;
  municipalSubsidyPerCapitaPln: number;
}

export interface DistrictForecastsAndB2BDto {
  forecastedAge0To3_2028: number;
  forecastedCarePlacesBalance_2028: number;
  forecastedAge4To6_2028: number;
  nurseryInvestmentPotentialB2B: string;
  seniorInfrastructureDeficit: string;
  greenSpaceDeficit: string;
  recommendedMunicipalAction: string;
}

export interface DistrictDetailsDto {
  districtId: number;
  districtRoman: string;
  districtName: string;
  areaKm2: number;
  scores: DistrictScoresDto;
  demographics: DistrictDemographicsDto;
  educationAndCare: DistrictEducationAndCareDto;
  mobilityAndTransport: DistrictMobilityAndTransportDto;
  greeneryAndSport: DistrictGreeneryAndSportDto;
  cultureAndSociety: DistrictCultureAndSocietyDto;
  forecastsAndB2B: DistrictForecastsAndB2BDto;
}

export interface DistrictScoreDeltasDto {
  weightedIndexDelta: number;
  mobilityScoreDelta: number;
  educationScoreDelta: number;
  greeneryScoreDelta: number;
  cultureAndSeniorScoreDelta: number;
  environmentScoreDelta: number;
}

export interface DistrictComparisonDto {
  firstDistrict: DistrictDetailsDto;
  firstWeightedIndex: number;
  secondDistrict: DistrictDetailsDto;
  secondWeightedIndex: number;
  scoreDeltas: DistrictScoreDeltasDto;
}

export interface DistrictGeoJsonProperties {
  districtId: number;
  districtRoman: string;
  districtName: string;
  areaKm2: number;
}

export type DistrictGeoJsonFeature = Feature<Geometry, DistrictGeoJsonProperties>;
export type DistrictsGeoJsonCollection = FeatureCollection<Geometry, DistrictGeoJsonProperties>;

export interface QualityWeights {
  mobility: number;
  education: number;
  greenery: number;
  culture: number;
  environment: number;
}

export interface ResidentPreset {
  id: string;
  label: string;
  description: string;
  weights: QualityWeights;
}
