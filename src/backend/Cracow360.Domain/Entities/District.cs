using Cracow360.Domain.Enums;

namespace Cracow360.Domain.Entities;

public class District
{
    public int DistrictId { get; set; }
    public string DistrictRoman { get; set; } = string.Empty;
    public string DistrictName { get; set; } = string.Empty;
    public double AreaKm2 { get; set; }

    public DistrictScores Scores { get; set; } = new();
    public DistrictDemographics Demographics { get; set; } = new();
    public DistrictEducationAndCare EducationAndCare { get; set; } = new();
    public DistrictMobilityAndTransport MobilityAndTransport { get; set; } = new();
    public DistrictGreeneryAndSport GreeneryAndSport { get; set; } = new();
    public DistrictCultureAndSociety CultureAndSociety { get; set; } = new();
    public DistrictForecastsAndB2B ForecastsAndB2B { get; set; } = new();

    public ICollection<PointOfInterest> PointsOfInterest { get; set; } = new List<PointOfInterest>();

    /// <summary>
    /// Calculates the weighted Quality of Life Index (0-100) for Resident Mode (Module 1).
    /// Weights range from 0 to 10.
    /// </summary>
    public double CalculateWeightedQualityOfLifeIndex(
        double mobilityWeight,
        double educationWeight,
        double greeneryWeight,
        double cultureWeight,
        double environmentWeight)
    {
        var totalWeight = mobilityWeight + educationWeight + greeneryWeight + cultureWeight + environmentWeight;
        if (totalWeight <= 0)
        {
            return Math.Round(
                (Scores.MobilityScore +
                 Scores.EducationScore +
                 Scores.GreeneryScore +
                 Scores.CultureAndSeniorScore +
                 Scores.EnvironmentScore) / 5.0, 2);
        }

        var weightedSum =
            (Scores.MobilityScore * mobilityWeight) +
            (Scores.EducationScore * educationWeight) +
            (Scores.GreeneryScore * greeneryWeight) +
            (Scores.CultureAndSeniorScore * cultureWeight) +
            (Scores.EnvironmentScore * environmentWeight);

        return Math.Round(weightedSum / totalWeight, 2);
    }
}

public class DistrictScores
{
    public double MobilityScore { get; set; }
    public double EducationScore { get; set; }
    public double GreeneryScore { get; set; }
    public double CultureAndSeniorScore { get; set; }
    public double EnvironmentScore { get; set; }
}

public class DistrictDemographics
{
    public int TotalPopulation { get; set; }
    public int PermanentResidents { get; set; }
    public int TemporaryResidents { get; set; }
    public int ForeignersTotal { get; set; }
    public int Age0To3 { get; set; }
    public int Age4To6 { get; set; }
    public int Age7To14 { get; set; }
    public int Age15To64 { get; set; }
    public int Age65Plus { get; set; }
    public double PopulationGrowthRate3YrPct { get; set; }
}

public class DistrictEducationAndCare
{
    public int NurseriesPublicCount { get; set; }
    public int NurseriesContractedCount { get; set; }
    public int NurseriesPrivateCount { get; set; }
    public int KidsClubsCount { get; set; }
    public int TotalCarePlaces0To3 { get; set; }
    public double ChildrenPerCarePlaceRatio { get; set; }
    public int ParentClubsCount { get; set; }
    public int KindergartensCount { get; set; }
    public int KindergartenPlacesTotal { get; set; }
    public int PrimarySchoolsCount { get; set; }
    public int PrimarySchoolStudentsTotal { get; set; }
    public double AvgStudentsPerClass { get; set; }
}

public class DistrictMobilityAndTransport
{
    public int KmkStopsCount { get; set; }
    public double IsochroneCoveragePct { get; set; }
    public int ParkAndRideCount { get; set; }
    public int BikeRacksCount { get; set; }
    public double BikeLanesLengthKm { get; set; }
}

public class DistrictGreeneryAndSport
{
    public int CityParksCount { get; set; }
    public int PocketParksCount { get; set; }
    public double TotalParksAreaHa { get; set; }
    public double GreenAreaM2PerCapita { get; set; }
    public int SchoolSportsFacilitiesCount { get; set; }
    public int SchoolSwimmingPoolsCount { get; set; }
}

public class DistrictCultureAndSociety
{
    public int LibraryBranchesCount { get; set; }
    public int CulturalCentersCount { get; set; }
    public int SeniorActivityCentersCount { get; set; }
    public int AnnualCulturalEventsCount { get; set; }
    public decimal MunicipalSubsidyPerCapitaPln { get; set; }
}

public class DistrictForecastsAndB2B
{
    public int ForecastedAge0To3_2028 { get; set; }
    public int ForecastedCarePlacesBalance_2028 { get; set; }
    public int ForecastedAge4To6_2028 { get; set; }
    public PotentialLevel NurseryInvestmentPotentialB2B { get; set; }
    public PotentialLevel SeniorInfrastructureDeficit { get; set; }
    public PotentialLevel GreenSpaceDeficit { get; set; }
    public string RecommendedMunicipalAction { get; set; } = string.Empty;
}
