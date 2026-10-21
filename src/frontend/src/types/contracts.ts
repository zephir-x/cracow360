import type { FeatureCollection, Geometry } from 'geojson';

// System diagnostic and connection verification contract
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

// 8 Calibrated Quality of Life Category Scores (0.0 to 100.0)
export interface DistrictScoresDto {
  mobilityScore: number;
  educationScore: number;
  greeneryScore: number;
  cultureAndSeniorScore: number;
  environmentScore: number;
  safetyScore: number;
  housingAffordabilityScore: number;
  demographicVitalityScore: number;
}

// High-level district summary for the ranking leaderboard and map cards
export interface DistrictSummaryDto {
  districtId: number;
  districtRoman: string;
  districtName: string;
  areaKm2: number;
  scores: DistrictScoresDto;
  totalPopulation: number;
  weightedQualityOfLifeIndex: number;
}

// Demographic cohorts, registration breakdown, and 3-year growth trend
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

// Childcare facilities, schools, places, and capacity ratios
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

// Public transit stops, 500m isochrone coverage, cycling infrastructure, and P+R
export interface DistrictMobilityAndTransportDto {
  kmkStopsCount: number;
  tramStopsCount: number;
  busStopsCount: number;
  onDemandStopsCount: number;
  scheduleBoardsCount: number;
  tramNetworkSharePct: number;
  isochroneCoveragePct: number;
  parkAndRideCount: number;
  bikeRacksCount: number;
  bikeLanesLengthKm: number;
  bikeLanesSeparatedKm: number;
  bikeLanesCombinedKm: number;
  bikeRepairStationsCount: number;
}

// Parks, forests, biological buffer areas, and youth sports facilities
export interface DistrictGreeneryAndSportDto {
  cityParksCount: number;
  pocketParksCount: number;
  totalParksAreaHa: number;
  forestAreaHa: number;
  totalGreenAreaHa: number;
  greenAreaM2PerCapita: number;
  totalGreenM2PerCapita: number;
  schoolSportsFacilitiesCount: number;
  schoolSwimmingPoolsCount: number;
}

// Cultural institutions, library branches, senior activity centers, and municipal subsidies
export interface DistrictCultureAndSocietyDto {
  libraryBranchesCount: number;
  culturalCentersCount: number;
  seniorActivityCentersCount: number;
  annualCulturalEventsCount: number;
  municipalSubsidyPerCapitaPln: number;
}

// Traffic safety, road incidents, and municipal police interventions
export interface DistrictPublicSafetyDto {
  roadCollisionsAnnual: number;
  pedestrianAccidents: number;
  injuryAccidents: number;
  municipalPoliceInterventionsTotal: number;
  publicDisturbanceInterventions: number;
}

// Housing transaction prices, rental rates, affordability index, and YoY dynamics
export interface DistrictHousingMarketDto {
  avgPricePerM2: number;
  priceSecondaryM2: number;
  pricePrimaryM2: number;
  priceMedianM2: number;
  avgRentalPriceM2: number;
  priceGrowthYoYPct: number;
  m2PerAverageSalary: number;
}

// Environmental monitoring: PM10/PM2.5 concentrations, smog days, and noise exposure
export interface DistrictEnvironmentalQualityDto {
  pm10AnnualUgM3: number;
  pm25AnnualUgM3: number;
  smogDaysCount: number;
  trafficNoiseExceededPct: number;
}

// 2028 Econometric forecasts, childcare balance, and municipal/B2B recommendations
export interface DistrictForecastsAndB2BDto {
  forecastedAge0To3_2028: number;
  forecastedCarePlacesBalance_2028: number;
  forecastedAge4To6_2028: number;
  nurseryInvestmentPotentialB2B: string;
  seniorInfrastructureDeficit: string;
  greenSpaceDeficit: string;
  recommendedMunicipalAction: string;
}

// Complete granular district metrics across all 10 domain facets
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
  publicSafety: DistrictPublicSafetyDto;
  housingMarket: DistrictHousingMarketDto;
  environmentalQuality: DistrictEnvironmentalQualityDto;
  forecastsAndB2B: DistrictForecastsAndB2BDto;
}

// Metric difference deltas between two compared districts (First - Second)
export interface DistrictScoreDeltasDto {
  weightedIndexDelta: number;
  mobilityScoreDelta: number;
  educationScoreDelta: number;
  greeneryScoreDelta: number;
  cultureAndSeniorScoreDelta: number;
  environmentScoreDelta: number;
  safetyScoreDelta: number;
  housingAffordabilityScoreDelta: number;
  demographicVitalityScoreDelta: number;
}

// Side-by-side comparative model for two selected districts
export interface DistrictComparisonDto {
  firstDistrict: DistrictDetailsDto;
  firstWeightedIndex: number;
  secondDistrict: DistrictDetailsDto;
  secondWeightedIndex: number;
  scoreDeltas: DistrictScoreDeltasDto;
}

// Feature properties for district boundary GeoJSON polygons
export interface DistrictGeoJsonProperties {
  districtId: number;
  districtRoman: string;
  districtName: string;
  areaKm2: number;
}

// Top-level GeoJSON FeatureCollection of 18 Krakow districts
export type DistrictsGeoJsonCollection = FeatureCollection<Geometry, DistrictGeoJsonProperties>;

// 8 User Preference Slider Weights (0 to 10 scale)
export interface QualityWeights {
  mobility: number;
  education: number;
  greenery: number;
  culture: number;
  environment: number;
  safety: number;
  housingAffordability: number;
  demographicVitality: number;
}

// Curated resident persona preset
export interface ResidentPreset {
  id: string;
  label: string;
  description: string;
  weights: QualityWeights;
}

// High-level Point of Interest functional category
export type PoiCategory =
  | 'EDU_CARE'
  | 'GREENERY'
  | 'CULTURE_SOCIETY'
  | 'MOBILITY';

// Granular Point of Interest functional subcategory
export type PoiSubCategory =
  | 'NURSERY_PUBLIC'
  | 'NURSERY_CONTRACTED'
  | 'NURSERY_PRIVATE'
  | 'KIDS_CLUB'
  | 'PARENT_CLUB'
  | 'KINDERGARTEN'
  | 'PRIMARY_SCHOOL'
  | 'SCHOOL_SPORT'
  | 'CITY_PARK'
  | 'POCKET_PARK'
  | 'LIBRARY'
  | 'CULTURAL_CENTER'
  | 'SENIOR_CENTER'
  | 'PARK_AND_RIDE';

// Quantitative metrics associated with a point of interest
export interface PoiMetricsDto {
  capacity?: number | null;
  areaHa?: number | null;
  additionalInfo?: string | null;
}

// Geocoded municipal Point of Interest (POI) with geographic coordinates (WGS84)
export interface PointOfInterestDto {
  id: string;
  districtId: number;
  category: PoiCategory;
  subCategory: PoiSubCategory;
  name: string;
  address: string;
  lat: number;
  lng: number;
  metrics: PoiMetricsDto;
}
