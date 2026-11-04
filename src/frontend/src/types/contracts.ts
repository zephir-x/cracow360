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

// Calibrated Quality of Life Category Scores (0.0 to 100.0)
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

// Traffic safety, road incidents, and resident safety rating
export interface DistrictPublicSafetyDto {
  roadCollisionsAnnual: number;
  pedestrianAccidents: number;
  injuryAccidents: number;
  safetyRatingSurvey: number;
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

// Environmental monitoring: PM10/PM2.5 concentrations, smog days, and NO2 exhaust levels (Open-Meteo 90d telemetry)
export interface DistrictEnvironmentalQualityDto {
  pm10Avg90dUgM3: number;
  pm25Avg90dUgM3: number;
  smogDays90dCount: number;
  no2Avg90dUgM3: number;
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

// Complete granular district metrics across all domain facets
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

// Real-Time Weather & Air Quality Live Atmosphere Contracts
export interface CurrentWeatherDto {
  temperatureC: number;
  apparentTemperatureC: number;
  relativeHumidityPct: number;
  weatherCode: number;
  weatherLabel: string;
  precipitationMm: number;
  rainMm: number;
  snowfallCm: number;
  windSpeedKmh: number;
  windDirectionDegrees: number;
  cloudCoverPct: number;
  isDay: boolean;
}

export interface PollenLevelsDto {
  grassPollen: number;
  birchPollen: number;
  alderPollen: number;
  mugwortPollen: number;
  ragweedPollen: number;
}

export interface CurrentAirQualityDto {
  europeanAqi: number;
  aqiLevelName: string;
  aqiColorHex: string;
  pm10UgM3: number;
  pm25UgM3: number;
  nitrogenDioxideUgM3: number;
  uvIndex: number;
  pollen: PollenLevelsDto;
}

export interface HourlyAtmospherePointDto {
  timeIso: string;
  hourLabel: string;
  temperatureC: number;
  precipitationProbabilityPct: number;
  precipitationMm: number;
  snowfallCm: number;
  windSpeedKmh: number;
  weatherCode: number;
}

export interface HealthAdviceItemDto {
  level: 'safe' | 'moderate' | 'warning' | 'danger';
  shortLabel: string;
  message: string;
}

export interface HealthRecommendationsDto {
  uv: HealthAdviceItemDto;
  outdoorSport: HealthAdviceItemDto;
  trafficExhaust: HealthAdviceItemDto;
  allergens: HealthAdviceItemDto;
  sensitiveGroups: HealthAdviceItemDto;
}

export interface LiveAtmosphereDto {
  districtId: number;
  districtRoman: string;
  districtName: string;
  measuredAtUtc: string;
  cachedUntilUtc: string;
  currentWeather: CurrentWeatherDto;
  currentAirQuality: CurrentAirQualityDto;
  hourlyForecast24H: HourlyAtmospherePointDto[];
  recommendations: HealthRecommendationsDto;
  dataSource: string;
}

export interface DistrictAtmosphereSummaryDto {
  districtId: number;
  districtRoman: string;
  districtName: string;
  temperatureC: number;
  apparentTemperatureC: number;
  weatherCode: number;
  weatherLabel: string;
  europeanAqi: number;
  aqiLevelName: string;
  aqiColorHex: string;
  windSpeedKmh: number;
  precipitationProbabilityPct: number;
  pm25UgM3: number;
  pm10UgM3: number;
}

// Civic Accessibility & Inclusion Contracts
export type AccessibilityProfileKey =
  | 'mobility'
  | 'visual'
  | 'hearing'
  | 'senior'
  | 'familyStroller';

export interface PrmParkingMetricsDto {
  totalSpots: number;
  locationsCount: number;
  spotsPer10kPop: number;
  spotsPerKm2: number;
}

export interface TransitAccessibilityMetricsDto {
  totalStops: number;
  kasselKerbStops: number;
  kasselKerbPct: number;
  tactilePavingStops: number;
  tactilePavingPct: number;
}

export interface PublicFacilitiesMetricsDto {
  auditedTotal: number;
  wheelchairGood?: number;
  wheelchairPartial: number;
  wheelchairWeak?: number;
  wheelchairNone?: number;
  wheelchairFull?: number;
  elevators: number;
  ramps: number;
  accessibleToilets: number;
  hearingLoops: number;
  signLanguagePJM: number;
  brailleTactile: number;
}

export interface SeniorCareMetricsDto {
  casCount: number;
  casPer10kSeniors: number;
}

export interface RecreationAccessibilityMetricsDto {
  cityParks: number;
  pocketParks: number;
}

export interface AccessibilityMetricsDto {
  prmParking: PrmParkingMetricsDto;
  transit: TransitAccessibilityMetricsDto;
  publicFacilities: PublicFacilitiesMetricsDto;
  seniorCare: SeniorCareMetricsDto;
  recreation: RecreationAccessibilityMetricsDto;
}

export interface AccessibilityScoresDto {
  overallScore: number;
  mobilityScore: number;
  visualScore: number;
  hearingScore: number;
  seniorScore: number;
  familyStrollerScore: number;
}

export interface PublicFacilityAuditDto {
  name: string;
  departments: string;
  address: string;
  wheelchairAccessible: string;
  hasRamp: boolean;
  hasElevatorOrPlatform: boolean;
  accessibleToilet: boolean;
  hearingLoop: boolean;
  signLanguageTranslator: boolean;
  brailleOrTactile: boolean;
  auditDescription: string;
}

export interface DistrictAccessibilityProfileDto {
  districtId: number;
  districtRoman: string;
  districtName: string;
  areaKm2: number;
  totalPopulation: number;
  seniors65Plus: number;
  metrics: AccessibilityMetricsDto;
  scores: AccessibilityScoresDto;
  keyStrengths: string[];
  facilities: PublicFacilityAuditDto[];
}

export interface AccessibilityCityAveragesDto {
  totalPrmParkingSpots: number;
  totalPrmLocations: number;
  totalAuditedFacilities: number;
  totalSeniorCenters: number;
  avgKasselKerbPct: number;
  avgTactilePavingPct: number;
  avgOverallScore: number;
}

export interface AccessibilitySourceDto {
  id: string;
  name: string;
  url: string;
}

export interface AccessibilityMetaDto {
  title: string;
  description: string;
  sources: AccessibilitySourceDto[];
  profilesSupported: string[];
}

export interface AccessibilityDatasetDto {
  generatedAt: string;
  meta: AccessibilityMetaDto;
  cityAverages: AccessibilityCityAveragesDto;
  districts: DistrictAccessibilityProfileDto[];
}

// Smart Tourism & Exploration Contracts
export type TourismAttractionCategory =
  | 'HISTORIC_HERITAGE'
  | 'CULTURE_ART'
  | 'GREEN_NATURE'
  | 'MODERN_EXPERIENCE';

export type TourismCrowdLevel =
  | 'PEAK'
  | 'VERY_HIGH'
  | 'HIGH'
  | 'MODERATE'
  | 'LOW'
  | 'PEACEFUL';

export interface DirectTransitInfoDto {
  line: string;
  timeMinutes: number;
}

export interface TourismAttractionDto {
  id: string;
  districtId: number;
  name: string;
  category: TourismAttractionCategory | string;
  crowdLevel: TourismCrowdLevel | string;
  lat: number;
  lng: number;
  estimatedVisitMinutes: number;
  isUnesco: boolean;
  directTransitFromMainStation: DirectTransitInfoDto;
  description: string;
  tags: string[];
}

export interface OvertourismAlternativeDto {
  id: string;
  crowdedAttractionId: string;
  crowdedName: string;
  crowdedCrowdLevel: TourismCrowdLevel | string;
  peacefulAttractionId: string;
  peacefulName: string;
  peacefulCrowdLevel: TourismCrowdLevel | string;
  reasonPl: string;
  reasonEn: string;
  reasonUa: string;
}

export interface ItineraryStopDto {
  stepNumber: number;
  attractionId: string;
  name: string;
  category: string;
  crowdLevel: string;
  lat: number;
  lng: number;
  visitMinutes: number;
  walkToNextMinutes: number;
  distanceToNextKm: number;
  districtId: number;
}

export interface ThematicItineraryDto {
  id: string;
  titlePl: string;
  titleEn: string;
  titleUa: string;
  targetHours: number;
  theme: string;
  stopIds: string[];
  suitableFor: string[];
  descriptionPl: string;
  descriptionEn: string;
  descriptionUa: string;
  calculatedDurationMinutes: number;
  stops: ItineraryStopDto[];
}

export interface DistrictTopAttractionDto {
  id: string;
  name: string;
  category: string;
  crowdLevel: string;
  estimatedVisitMinutes: number;
}

export interface DistrictTouristPassportDto {
  districtId: number;
  districtRoman: string;
  districtName: string;
  distanceFromMainStationKm: number;
  transitTimeFromStationMinutes: number;
  directTransitLines: string;
  totalAttractionsCount: number;
  topAttractions: DistrictTopAttractionDto[];
}

export interface TopMarketDto {
  country: string;
  sharePct: number;
  flag: string;
}

export interface CityTourismSummaryDto {
  annualVisitorsTotal: number;
  overnightTourists: number;
  domesticVisitors: number;
  internationalVisitors: number;
  estimatedEconomicImpactPln: number;
  averageStayDays: number;
  totalCuratedAttractions: number;
  unescoSitesCount: number;
  curatedItinerariesCount: number;
  overtourismAlternativePairsCount: number;
  topInternationalMarkets: TopMarketDto[];
}

export interface TourismSourceDto {
  id: string;
  name: string;
  url: string;
}

export interface TourismMetaDto {
  title: string;
  description: string;
  version: string;
  sources: TourismSourceDto[];
}

export interface TourismDatasetDto {
  generatedAt: string;
  meta: TourismMetaDto;
  cityTourismSummary: CityTourismSummaryDto;
  attractions: TourismAttractionDto[];
  overtourismAlternatives: OvertourismAlternativeDto[];
  thematicItineraries: ThematicItineraryDto[];
  districtPassports: DistrictTouristPassportDto[];
}

// Wawelek AI Assistant Contracts (DeepSeek Platform + Live City Grounding)
export type WawelekMascotAnimationState = 'idle' | 'listening' | 'thinking' | 'speaking';

export interface WawelekChatMessageDto {
  role: 'user' | 'assistant';
  content: string;
}

export interface WawelekChatRequestDto {
  message: string;
  history?: WawelekChatMessageDto[];
  activeTab?: string;
  language?: string;
  selectedDistrictId?: number | null;
  enableLiveContext?: boolean;
}

export interface WawelekChatResponseDto {
  reply: string;
  mascotState: WawelekMascotAnimationState | string;
  suggestedFollowUps: string[];
  isAiPowered: boolean;
  usedLiveCityContext: boolean;
  modelUsed: string;
  timestampUtc: string;
}

export interface WawelekAssistantMetadataDto {
  assistantName: string;
  assistantRole: string;
  isConfigured: boolean;
  configuredModel: string;
  maxCompletionTokens: number;
  suggestedPromptsByTab: Record<string, string[]>;
}
