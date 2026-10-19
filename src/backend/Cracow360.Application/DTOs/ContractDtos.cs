namespace Cracow360.Application.DTOs;

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

public record DistrictSummaryDto(
    int DistrictId,
    string DistrictRoman,
    string DistrictName,
    double AreaKm2,
    DistrictScoresDto Scores,
    int TotalPopulation,
    double WeightedQualityOfLifeIndex
);

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
    DistrictForecastsAndB2BDto ForecastsAndB2B
);

public record DistrictScoresDto(
    double MobilityScore,
    double EducationScore,
    double GreeneryScore,
    double CultureAndSeniorScore,
    double EnvironmentScore
);

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

public record DistrictMobilityAndTransportDto(
    int KmkStopsCount,
    double IsochroneCoveragePct,
    int ParkAndRideCount,
    int BikeRacksCount,
    double BikeLanesLengthKm
);

public record DistrictGreeneryAndSportDto(
    int CityParksCount,
    int PocketParksCount,
    double TotalParksAreaHa,
    double GreenAreaM2PerCapita,
    int SchoolSportsFacilitiesCount,
    int SchoolSwimmingPoolsCount
);

public record DistrictCultureAndSocietyDto(
    int LibraryBranchesCount,
    int CulturalCentersCount,
    int SeniorActivityCentersCount,
    int AnnualCulturalEventsCount,
    decimal MunicipalSubsidyPerCapitaPln
);

public record DistrictForecastsAndB2BDto(
    int ForecastedAge0To3_2028,
    int ForecastedCarePlacesBalance_2028,
    int ForecastedAge4To6_2028,
    string NurseryInvestmentPotentialB2B,
    string SeniorInfrastructureDeficit,
    string GreenSpaceDeficit,
    string RecommendedMunicipalAction
);

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

public record PoiMetricsDto(
    int? Capacity,
    double? AreaHa,
    string AdditionalInfo
);
