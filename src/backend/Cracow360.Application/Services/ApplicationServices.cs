using Cracow360.Application.DTOs;
using Cracow360.Application.Interfaces;
using Cracow360.Domain.Entities;
using Cracow360.Domain.Enums;
using Cracow360.Domain.Interfaces;

namespace Cracow360.Application.Services;

/// <summary>
/// Application service orchestrating district retrievals, weighted quality of life index calculations,
/// dynamic rankings, and detailed comparisons across the 8 calibrated urban pillars.
/// </summary>
public class DistrictService(IDistrictRepository districtRepository) : IDistrictService
{
    // Fetches all 18 districts, evaluates their weighted index according to user preferences, and sorts descending
    public async Task<IReadOnlyList<DistrictSummaryDto>> GetAllSummariesAsync(
        double mobilityWeight = 5.0,
        double educationWeight = 5.0,
        double greeneryWeight = 5.0,
        double cultureWeight = 5.0,
        double environmentWeight = 5.0,
        double safetyWeight = 5.0,
        double housingAffordabilityWeight = 5.0,
        double demographicVitalityWeight = 5.0,
        CancellationToken cancellationToken = default)
    {
        var districts = await districtRepository.GetAllAsync(cancellationToken);

        // Project domain entities to summary DTOs and sort descending by the computed composite index
        return districts
            .Select(d => new DistrictSummaryDto(
                d.DistrictId,
                d.DistrictRoman,
                d.DistrictName,
                d.AreaKm2,
                MapScores(d.Scores),
                d.Demographics.TotalPopulation,
                d.CalculateWeightedQualityOfLifeIndex(
                    mobilityWeight,
                    educationWeight,
                    greeneryWeight,
                    cultureWeight,
                    environmentWeight,
                    safetyWeight,
                    housingAffordabilityWeight,
                    demographicVitalityWeight)))
            .OrderByDescending(d => d.WeightedQualityOfLifeIndex)
            .ToList();
    }

    // Fetches a single district by its unique numeric ID (1..18) and maps all granular domains
    public async Task<DistrictDetailsDto?> GetDistrictDetailsAsync(int districtId, CancellationToken cancellationToken = default)
    {
        var d = await districtRepository.GetByIdAsync(districtId, cancellationToken);
        return d is null ? null : MapToDetailsDto(d);
    }

    // Performs side-by-side comparative analysis between two districts and calculates exact metric deltas
    public async Task<DistrictComparisonDto?> CompareDistrictsAsync(
        int firstDistrictId,
        int secondDistrictId,
        double mobilityWeight = 5.0,
        double educationWeight = 5.0,
        double greeneryWeight = 5.0,
        double cultureWeight = 5.0,
        double environmentWeight = 5.0,
        double safetyWeight = 5.0,
        double housingAffordabilityWeight = 5.0,
        double demographicVitalityWeight = 5.0,
        CancellationToken cancellationToken = default)
    {
        var first = await districtRepository.GetByIdAsync(firstDistrictId, cancellationToken);
        var second = await districtRepository.GetByIdAsync(secondDistrictId, cancellationToken);

        if (first is null || second is null)
            return null;

        // Calculate composite quality of life indexes using the provided user weights
        var firstIndex = first.CalculateWeightedQualityOfLifeIndex(
            mobilityWeight, educationWeight, greeneryWeight, cultureWeight, environmentWeight, safetyWeight, housingAffordabilityWeight, demographicVitalityWeight);
        var secondIndex = second.CalculateWeightedQualityOfLifeIndex(
            mobilityWeight, educationWeight, greeneryWeight, cultureWeight, environmentWeight, safetyWeight, housingAffordabilityWeight, demographicVitalityWeight);

        // Calculate metric score deltas (First District minus Second District) across all 8 pillars
        var deltas = new DistrictScoreDeltasDto(
            WeightedIndexDelta: Math.Round(firstIndex - secondIndex, 2),
            MobilityScoreDelta: Math.Round(first.Scores.MobilityScore - second.Scores.MobilityScore, 2),
            EducationScoreDelta: Math.Round(first.Scores.EducationScore - second.Scores.EducationScore, 2),
            GreeneryScoreDelta: Math.Round(first.Scores.GreeneryScore - second.Scores.GreeneryScore, 2),
            CultureAndSeniorScoreDelta: Math.Round(first.Scores.CultureAndSeniorScore - second.Scores.CultureAndSeniorScore, 2),
            EnvironmentScoreDelta: Math.Round(first.Scores.EnvironmentScore - second.Scores.EnvironmentScore, 2),
            SafetyScoreDelta: Math.Round(first.Scores.SafetyScore - second.Scores.SafetyScore, 2),
            HousingAffordabilityScoreDelta: Math.Round(first.Scores.HousingAffordabilityScore - second.Scores.HousingAffordabilityScore, 2),
            DemographicVitalityScoreDelta: Math.Round(first.Scores.DemographicVitalityScore - second.Scores.DemographicVitalityScore, 2)
        );

        return new DistrictComparisonDto(
            FirstDistrict: MapToDetailsDto(first),
            FirstWeightedIndex: firstIndex,
            SecondDistrict: MapToDetailsDto(second),
            SecondWeightedIndex: secondIndex,
            ScoreDeltas: deltas
        );
    }

    // Maps a domain District aggregate to a deep DistrictDetailsDto contract
    private static DistrictDetailsDto MapToDetailsDto(District d) =>
        new(
            d.DistrictId,
            d.DistrictRoman,
            d.DistrictName,
            d.AreaKm2,
            MapScores(d.Scores),
            new DistrictDemographicsDto(
                d.Demographics.TotalPopulation,
                d.Demographics.PermanentResidents,
                d.Demographics.TemporaryResidents,
                d.Demographics.ForeignersTotal,
                d.Demographics.Age0To3,
                d.Demographics.Age4To6,
                d.Demographics.Age7To14,
                d.Demographics.Age15To64,
                d.Demographics.Age65Plus,
                d.Demographics.PopulationGrowthRate3YrPct),
            new DistrictEducationAndCareDto(
                d.EducationAndCare.NurseriesPublicCount,
                d.EducationAndCare.NurseriesContractedCount,
                d.EducationAndCare.NurseriesPrivateCount,
                d.EducationAndCare.KidsClubsCount,
                d.EducationAndCare.TotalCarePlaces0To3,
                d.EducationAndCare.ChildrenPerCarePlaceRatio,
                d.EducationAndCare.ParentClubsCount,
                d.EducationAndCare.KindergartensCount,
                d.EducationAndCare.KindergartenPlacesTotal,
                d.EducationAndCare.PrimarySchoolsCount,
                d.EducationAndCare.PrimarySchoolStudentsTotal,
                d.EducationAndCare.AvgStudentsPerClass),
            new DistrictMobilityAndTransportDto(
                d.MobilityAndTransport.KmkStopsCount,
                d.MobilityAndTransport.TramStopsCount,
                d.MobilityAndTransport.BusStopsCount,
                d.MobilityAndTransport.OnDemandStopsCount,
                d.MobilityAndTransport.ScheduleBoardsCount,
                d.MobilityAndTransport.TramNetworkSharePct,
                d.MobilityAndTransport.IsochroneCoveragePct,
                d.MobilityAndTransport.ParkAndRideCount,
                d.MobilityAndTransport.BikeRacksCount,
                d.MobilityAndTransport.BikeLanesLengthKm,
                d.MobilityAndTransport.BikeLanesSeparatedKm,
                d.MobilityAndTransport.BikeLanesCombinedKm,
                d.MobilityAndTransport.BikeRepairStationsCount),
            new DistrictGreeneryAndSportDto(
                d.GreeneryAndSport.CityParksCount,
                d.GreeneryAndSport.PocketParksCount,
                d.GreeneryAndSport.TotalParksAreaHa,
                d.GreeneryAndSport.ForestAreaHa,
                d.GreeneryAndSport.TotalGreenAreaHa,
                d.GreeneryAndSport.GreenAreaM2PerCapita,
                d.GreeneryAndSport.TotalGreenM2PerCapita,
                d.GreeneryAndSport.SchoolSportsFacilitiesCount,
                d.GreeneryAndSport.SchoolSwimmingPoolsCount),
            new DistrictCultureAndSocietyDto(
                d.CultureAndSociety.LibraryBranchesCount,
                d.CultureAndSociety.CulturalCentersCount,
                d.CultureAndSociety.SeniorActivityCentersCount,
                d.CultureAndSociety.AnnualCulturalEventsCount,
                d.CultureAndSociety.MunicipalSubsidyPerCapitaPln),
            new DistrictPublicSafetyDto(
                d.PublicSafety.RoadCollisionsAnnual,
                d.PublicSafety.PedestrianAccidents,
                d.PublicSafety.InjuryAccidents,
                d.PublicSafety.SafetyRatingSurvey),
            new DistrictHousingMarketDto(
                d.HousingMarket.AvgPricePerM2,
                d.HousingMarket.PriceSecondaryM2,
                d.HousingMarket.PricePrimaryM2,
                d.HousingMarket.PriceMedianM2,
                d.HousingMarket.AvgRentalPriceM2,
                d.HousingMarket.PriceGrowthYoYPct,
                d.HousingMarket.M2PerAverageSalary),
            new DistrictEnvironmentalQualityDto(
                d.EnvironmentalQuality.Pm10Avg90dUgM3,
                d.EnvironmentalQuality.Pm25Avg90dUgM3,
                d.EnvironmentalQuality.SmogDays90dCount,
                d.EnvironmentalQuality.No2Avg90dUgM3),
            new DistrictForecastsAndB2BDto(
                d.ForecastsAndB2B.ForecastedAge0To3_2028,
                d.ForecastsAndB2B.ForecastedCarePlacesBalance_2028,
                d.ForecastsAndB2B.ForecastedAge4To6_2028,
                d.ForecastsAndB2B.NurseryInvestmentPotentialB2B.ToString(),
                d.ForecastsAndB2B.SeniorInfrastructureDeficit.ToString(),
                d.ForecastsAndB2B.GreenSpaceDeficit.ToString(),
                d.ForecastsAndB2B.RecommendedMunicipalAction)
        );

    // Maps domain DistrictScores to the immutable DistrictScoresDto contract
    private static DistrictScoresDto MapScores(DistrictScores scores) =>
        new(
            scores.MobilityScore,
            scores.EducationScore,
            scores.GreeneryScore,
            scores.CultureAndSeniorScore,
            scores.EnvironmentScore,
            scores.SafetyScore,
            scores.HousingAffordabilityScore,
            scores.DemographicVitalityScore);
}

/// <summary>
/// Application service querying municipal points of interest with defensive enum parsing and DTO projection.
/// </summary>
public class PointOfInterestService(IPointOfInterestRepository poiRepository) : IPointOfInterestService
{
    // Queries POI repository with optional case-insensitive enum filters and projects to DTOs
    public async Task<IReadOnlyList<PointOfInterestDto>> GetPointsOfInterestAsync(
        int? districtId = null,
        string? category = null,
        string? subCategory = null,
        CancellationToken cancellationToken = default)
    {
        // Safe case-insensitive enum parsing for incoming string query filters
        PoiCategory? parsedCategory = Enum.TryParse<PoiCategory>(category, true, out var cat) ? cat : null;
        PoiSubCategory? parsedSubCategory = Enum.TryParse<PoiSubCategory>(subCategory, true, out var sub) ? sub : null;

        var pois = await poiRepository.GetAllAsync(districtId, parsedCategory, parsedSubCategory, cancellationToken);

        // Project domain entities to PointOfInterestDto records
        return pois
            .Select(p => new PointOfInterestDto(
                p.Id,
                p.DistrictId,
                p.Category.ToString(),
                p.SubCategory.ToString(),
                p.Name,
                p.Address,
                p.Lat,
                p.Lng,
                new PoiMetricsDto(p.Metrics.Capacity, p.Metrics.AreaHa, p.Metrics.AdditionalInfo)))
            .ToList();
    }
}
