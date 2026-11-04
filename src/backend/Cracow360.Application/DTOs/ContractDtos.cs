namespace Cracow360.Application.DTOs;

// System diagnostic and connectivity verification DTO
public record SystemHelloDto(
    string Message,
    string ProjectName,
    string Competition,
    string Environment,
    string DatabaseProvider,
    bool DatabaseConnected,
    int SeededDistrictsCount,
    int SeededPoisCount,
    DateTime ServerTimeUtc
);

// High-level district summary for the ranking leaderboard and map cards
public record DistrictSummaryDto(
    int DistrictId,
    string DistrictRoman,
    string DistrictName,
    double AreaKm2,
    DistrictScoresDto Scores,
    int TotalPopulation,
    double WeightedQualityOfLifeIndex
);

// Complete granular district metrics across all 10 domain facets and 2028 econometric forecasts
public record DistrictDetailsDto(
    int DistrictId,
    string DistrictRoman,
    string DistrictName,
    double AreaKm2,
    DistrictScoresDto Scores,
    DistrictDemographicsDto Demographics,
    DistrictEducationAndCareDto EducationAndCare,
    DistrictMobilityAndTransportDto MobilityAndTransport,
    DistrictGreeneryAndSportDto GreeneryAndSport,
    DistrictCultureAndSocietyDto CultureAndSociety,
    DistrictPublicSafetyDto PublicSafety,
    DistrictHousingMarketDto HousingMarket,
    DistrictEnvironmentalQualityDto EnvironmentalQuality,
    DistrictForecastsAndB2BDto ForecastsAndB2B
);

// Side-by-side comparative model for two selected districts
public record DistrictComparisonDto(
    DistrictDetailsDto FirstDistrict,
    double FirstWeightedIndex,
    DistrictDetailsDto SecondDistrict,
    double SecondWeightedIndex,
    DistrictScoreDeltasDto ScoreDeltas
);

// Metric difference deltas between the two compared districts (First - Second)
public record DistrictScoreDeltasDto(
    double WeightedIndexDelta,
    double MobilityScoreDelta,
    double EducationScoreDelta,
    double GreeneryScoreDelta,
    double CultureAndSeniorScoreDelta,
    double EnvironmentScoreDelta,
    double SafetyScoreDelta,
    double HousingAffordabilityScoreDelta,
    double DemographicVitalityScoreDelta
);

// 8 Calibrated Quality of Life Category Scores (0.0 - 100.0)
public record DistrictScoresDto(
    double MobilityScore,
    double EducationScore,
    double GreeneryScore,
    double CultureAndSeniorScore,
    double EnvironmentScore,
    double SafetyScore,
    double HousingAffordabilityScore,
    double DemographicVitalityScore
);

// Demographic cohorts, registration breakdown, and 3-year growth trend
public record DistrictDemographicsDto(
    int TotalPopulation,
    int PermanentResidents,
    int TemporaryResidents,
    int ForeignersTotal,
    int Age0To3,
    int Age4To6,
    int Age7To14,
    int Age15To64,
    int Age65Plus,
    double PopulationGrowthRate3YrPct
);

// Childcare facilities, schools, places, and capacity ratios
public record DistrictEducationAndCareDto(
    int NurseriesPublicCount,
    int NurseriesContractedCount,
    int NurseriesPrivateCount,
    int KidsClubsCount,
    int TotalCarePlaces0To3,
    double ChildrenPerCarePlaceRatio,
    int ParentClubsCount,
    int KindergartensCount,
    int KindergartenPlacesTotal,
    int PrimarySchoolsCount,
    int PrimarySchoolStudentsTotal,
    double AvgStudentsPerClass
);

// Public transit stops, 500m isochrone coverage, cycling infrastructure, and P+R
public record DistrictMobilityAndTransportDto(
    int KmkStopsCount,
    int TramStopsCount,
    int BusStopsCount,
    int OnDemandStopsCount,
    int ScheduleBoardsCount,
    double TramNetworkSharePct,
    double IsochroneCoveragePct,
    int ParkAndRideCount,
    int BikeRacksCount,
    double BikeLanesLengthKm,
    double BikeLanesSeparatedKm,
    double BikeLanesCombinedKm,
    int BikeRepairStationsCount
);

// Parks, forests, biological buffer areas, and youth sports facilities
public record DistrictGreeneryAndSportDto(
    int CityParksCount,
    int PocketParksCount,
    double TotalParksAreaHa,
    double ForestAreaHa,
    double TotalGreenAreaHa,
    double GreenAreaM2PerCapita,
    double TotalGreenM2PerCapita,
    int SchoolSportsFacilitiesCount,
    int SchoolSwimmingPoolsCount
);

// Cultural institutions, library branches, senior activity centers, and municipal subsidies
public record DistrictCultureAndSocietyDto(
    int LibraryBranchesCount,
    int CulturalCentersCount,
    int SeniorActivityCentersCount,
    int AnnualCulturalEventsCount,
    decimal MunicipalSubsidyPerCapitaPln
);

// Traffic safety, road incidents, and resident safety rating
public record DistrictPublicSafetyDto(
    int RoadCollisionsAnnual,
    int PedestrianAccidents,
    int InjuryAccidents,
    double SafetyRatingSurvey
);

// Housing transaction prices, rental rates, affordability index, and YoY dynamics
public record DistrictHousingMarketDto(
    double AvgPricePerM2,
    double PriceSecondaryM2,
    double PricePrimaryM2,
    double PriceMedianM2,
    double AvgRentalPriceM2,
    double PriceGrowthYoYPct,
    double M2PerAverageSalary
);

// Environmental monitoring: PM10/PM2.5 concentrations, smog days, and NO2 exhaust levels (Open-Meteo 90d telemetry)
public record DistrictEnvironmentalQualityDto(
    double Pm10Avg90dUgM3,
    double Pm25Avg90dUgM3,
    int SmogDays90dCount,
    double No2Avg90dUgM3
);

// 2028 Econometric forecasts, childcare balance, and municipal/B2B recommendations
public record DistrictForecastsAndB2BDto(
    int ForecastedAge0To3_2028,
    int ForecastedCarePlacesBalance_2028,
    int ForecastedAge4To6_2028,
    string NurseryInvestmentPotentialB2B,
    string SeniorInfrastructureDeficit,
    string GreenSpaceDeficit,
    string RecommendedMunicipalAction
);

// Geocoded municipal Point of Interest (POI) with geographic coordinates (WGS84)
public record PointOfInterestDto(
    string Id,
    int DistrictId,
    string Category,
    string SubCategory,
    string Name,
    string Address,
    double Lat,
    double Lng,
    PoiMetricsDto Metrics
);

// Specific quantitative metrics associated with a point of interest
public record PoiMetricsDto(
    int? Capacity,
    double? AreaHa,
    string AdditionalInfo
);
