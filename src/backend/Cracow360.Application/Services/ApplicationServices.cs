using Cracow360.Application.DTOs;
using Cracow360.Application.Interfaces;
using Cracow360.Domain.Entities;
using Cracow360.Domain.Enums;
using Cracow360.Domain.Interfaces;

namespace Cracow360.Application.Services;

public class DistrictService(IDistrictRepository districtRepository) : IDistrictService
{
    public async Task<IReadOnlyList<DistrictSummaryDto>> GetAllSummariesAsync(
        double mobilityWeight = 5.0,
        double educationWeight = 5.0,
        double greeneryWeight = 5.0,
        double cultureWeight = 5.0,
        double environmentWeight = 5.0,
        CancellationToken cancellationToken = default)
    {
        var districts = await districtRepository.GetAllAsync(cancellationToken);

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
                    environmentWeight)))
            .OrderByDescending(d => d.WeightedQualityOfLifeIndex)
            .ToList();
    }

    public async Task<DistrictDetailsDto?> GetDistrictDetailsAsync(int districtId, CancellationToken cancellationToken = default)
    {
        var d = await districtRepository.GetByIdAsync(districtId, cancellationToken);
        return d is null ? null : MapToDetailsDto(d);
    }

    public async Task<DistrictComparisonDto?> CompareDistrictsAsync(
        int firstDistrictId,
        int secondDistrictId,
        double mobilityWeight = 5.0,
        double educationWeight = 5.0,
        double greeneryWeight = 5.0,
        double cultureWeight = 5.0,
        double environmentWeight = 5.0,
        CancellationToken cancellationToken = default)
    {
        var first = await districtRepository.GetByIdAsync(firstDistrictId, cancellationToken);
        var second = await districtRepository.GetByIdAsync(secondDistrictId, cancellationToken);

        if (first is null || second is null)
            return null;

        var firstIndex = first.CalculateWeightedQualityOfLifeIndex(
            mobilityWeight, educationWeight, greeneryWeight, cultureWeight, environmentWeight);
        var secondIndex = second.CalculateWeightedQualityOfLifeIndex(
            mobilityWeight, educationWeight, greeneryWeight, cultureWeight, environmentWeight);

        var deltas = new DistrictScoreDeltasDto(
            WeightedIndexDelta: Math.Round(firstIndex - secondIndex, 2),
            MobilityScoreDelta: Math.Round(first.Scores.MobilityScore - second.Scores.MobilityScore, 2),
            EducationScoreDelta: Math.Round(first.Scores.EducationScore - second.Scores.EducationScore, 2),
            GreeneryScoreDelta: Math.Round(first.Scores.GreeneryScore - second.Scores.GreeneryScore, 2),
            CultureAndSeniorScoreDelta: Math.Round(first.Scores.CultureAndSeniorScore - second.Scores.CultureAndSeniorScore, 2),
            EnvironmentScoreDelta: Math.Round(first.Scores.EnvironmentScore - second.Scores.EnvironmentScore, 2)
        );

        return new DistrictComparisonDto(
            FirstDistrict: MapToDetailsDto(first),
            FirstWeightedIndex: firstIndex,
            SecondDistrict: MapToDetailsDto(second),
            SecondWeightedIndex: secondIndex,
            ScoreDeltas: deltas
        );
    }

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
                d.MobilityAndTransport.IsochroneCoveragePct,
                d.MobilityAndTransport.ParkAndRideCount,
                d.MobilityAndTransport.BikeRacksCount,
                d.MobilityAndTransport.BikeLanesLengthKm),
            new DistrictGreeneryAndSportDto(
                d.GreeneryAndSport.CityParksCount,
                d.GreeneryAndSport.PocketParksCount,
                d.GreeneryAndSport.TotalParksAreaHa,
                d.GreeneryAndSport.GreenAreaM2PerCapita,
                d.GreeneryAndSport.SchoolSportsFacilitiesCount,
                d.GreeneryAndSport.SchoolSwimmingPoolsCount),
            new DistrictCultureAndSocietyDto(
                d.CultureAndSociety.LibraryBranchesCount,
                d.CultureAndSociety.CulturalCentersCount,
                d.CultureAndSociety.SeniorActivityCentersCount,
                d.CultureAndSociety.AnnualCulturalEventsCount,
                d.CultureAndSociety.MunicipalSubsidyPerCapitaPln),
            new DistrictForecastsAndB2BDto(
                d.ForecastsAndB2B.ForecastedAge0To3_2028,
                d.ForecastsAndB2B.ForecastedCarePlacesBalance_2028,
                d.ForecastsAndB2B.ForecastedAge4To6_2028,
                d.ForecastsAndB2B.NurseryInvestmentPotentialB2B.ToString(),
                d.ForecastsAndB2B.SeniorInfrastructureDeficit.ToString(),
                d.ForecastsAndB2B.GreenSpaceDeficit.ToString(),
                d.ForecastsAndB2B.RecommendedMunicipalAction)
        );

    private static DistrictScoresDto MapScores(DistrictScores scores) =>
        new(
            scores.MobilityScore,
            scores.EducationScore,
            scores.GreeneryScore,
            scores.CultureAndSeniorScore,
            scores.EnvironmentScore);
}

public class PointOfInterestService(IPointOfInterestRepository poiRepository) : IPointOfInterestService
{
    public async Task<IReadOnlyList<PointOfInterestDto>> GetPointsOfInterestAsync(
        int? districtId = null,
        string? category = null,
        string? subCategory = null,
        CancellationToken cancellationToken = default)
    {
        PoiCategory? parsedCategory = Enum.TryParse<PoiCategory>(category, true, out var cat) ? cat : null;
        PoiSubCategory? parsedSubCategory = Enum.TryParse<PoiSubCategory>(subCategory, true, out var sub) ? sub : null;

        var pois = await poiRepository.GetAllAsync(districtId, parsedCategory, parsedSubCategory, cancellationToken);

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
