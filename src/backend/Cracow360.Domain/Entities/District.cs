using Cracow360.Domain.Enums;

namespace Cracow360.Domain.Entities;

/// <summary>
/// Root domain aggregate representing an official administrative district of Krakow (1..18).
/// Encompasses all 10 domain facets, 8 Quality of Life category scores, and associated POI facilities.
/// </summary>
public class District
{
    // Official administrative district ID (1 to 18)
    public int DistrictId { get; set; }

    // Official Roman numeral representation ("I" to "XVIII")
    public string DistrictRoman { get; set; } = string.Empty;

    // Official statutory district name (e.g. "Stare Miasto", "Zwierzyniec")
    public string DistrictName { get; set; } = string.Empty;

    // Official geographic area in square kilometers (MSIP)
    public double AreaKm2 { get; set; }

    // 8 Normalized Quality of Life Category Scores (0.0 to 100.0)
    public DistrictScores Scores { get; set; } = new();

    // Demographic breakdown, age cohorts, and migration statistics
    public DistrictDemographics Demographics { get; set; } = new();

    // Childcare nurseries, kindergartens, primary schools, and class capacity
    public DistrictEducationAndCare EducationAndCare { get; set; } = new();

    // Public transit stops, 500m isochrone coverage, and bicycle network
    public DistrictMobilityAndTransport MobilityAndTransport { get; set; } = new();

    // Municipal parks, pocket parks, forests, and school athletic facilities
    public DistrictGreeneryAndSport GreeneryAndSport { get; set; } = new();

    // Libraries, cultural community centers, and Senior Activity Centers (CAS)
    public DistrictCultureAndSociety CultureAndSociety { get; set; } = new();

    // Road safety incidents, collisions, and municipal police interventions
    public DistrictPublicSafety PublicSafety { get; set; } = new();

    // Real estate purchase prices, rental rates, and salary purchasing power
    public DistrictHousingMarket HousingMarket { get; set; } = new();

    // Air quality monitoring (PM10/PM2.5), smog days, and acoustic noise
    public DistrictEnvironmentalQuality EnvironmentalQuality { get; set; } = new();

    // 2028 Demographic forecasts, childcare balance, and municipal recommendations
    public DistrictForecastsAndB2B ForecastsAndB2B { get; set; } = new();

    // Collection of physical Points of Interest located within the district boundaries
    public ICollection<PointOfInterest> PointsOfInterest { get; set; } = new List<PointOfInterest>();

    /// <summary>
    /// Calculates the weighted composite Quality of Life Index (0.0 - 100.0) across all 8 urban pillars
    /// using the calibrated CES / Bottleneck-Aware econometric formula.
    /// Default weight for each pillar is 5.0 on a 0.0 - 10.0 scale.
    /// </summary>
    public double CalculateWeightedQualityOfLifeIndex(
        double mobilityWeight = 5.0,
        double educationWeight = 5.0,
        double greeneryWeight = 5.0,
        double cultureWeight = 5.0,
        double environmentWeight = 5.0,
        double safetyWeight = 5.0,
        double housingAffordabilityWeight = 5.0,
        double demographicVitalityWeight = 5.0)
    {
        var scores = new[]
        {
            Scores.MobilityScore,
            Scores.EducationScore,
            Scores.GreeneryScore,
            Scores.CultureAndSeniorScore,
            Scores.EnvironmentScore,
            Scores.SafetyScore,
            Scores.HousingAffordabilityScore,
            Scores.DemographicVitalityScore
        };

        var weights = new[]
        {
            Math.Max(0.0, mobilityWeight),
            Math.Max(0.0, educationWeight),
            Math.Max(0.0, greeneryWeight),
            Math.Max(0.0, cultureWeight),
            Math.Max(0.0, environmentWeight),
            Math.Max(0.0, safetyWeight),
            Math.Max(0.0, housingAffordabilityWeight),
            Math.Max(0.0, demographicVitalityWeight)
        };

        var totalWeight = weights.Sum();
        if (totalWeight <= 0)
        {
            for (var i = 0; i < weights.Length; i++)
            {
                weights[i] = 5.0;
            }
            totalWeight = 40.0;
        }

        // 1. Linear weighted mean across all 8 calibrated urban pillars
        var weightedSum = 0.0;
        for (var i = 0; i < 8; i++)
        {
            weightedSum += scores[i] * weights[i];
        }
        var weightedMean = weightedSum / totalWeight;

        // 2. Non-compensatory bottleneck penalty for critical deficits below 52.0 pts
        const double bottleneckThreshold = 52.0;
        var penaltyNumerator = 0.0;
        var normalizedWeightSum = 0.0;

        for (var i = 0; i < 8; i++)
        {
            var relWeight = weights[i] / 10.0;
            normalizedWeightSum += relWeight;
            if (scores[i] < bottleneckThreshold && relWeight > 0)
            {
                var deficit = bottleneckThreshold - scores[i];
                penaltyNumerator += relWeight * relWeight * Math.Pow(deficit, 1.5);
            }
        }

        var bottleneckPenalty = normalizedWeightSum > 0
            ? (penaltyNumerator / normalizedWeightSum) * 0.25
            : 0.0;

        // 3. Contrast calibration around Krakow's healthy municipal standard (70.0 pts)
        var rawNetScore = weightedMean - bottleneckPenalty;
        var calibratedIndex = 70.0 + (rawNetScore - 62.8) * 1.35;

        return Math.Round(Math.Clamp(calibratedIndex, 0.0, 100.0), 2);
    }
}

// 8 Calibrated Quality of Life Category Scores (rescaled to practical empirical bands 0.0 - 100.0)
public class DistrictScores
{
    public double MobilityScore { get; set; }
    public double EducationScore { get; set; }
    public double GreeneryScore { get; set; }
    public double CultureAndSeniorScore { get; set; }
    public double EnvironmentScore { get; set; }
    public double SafetyScore { get; set; }
    public double HousingAffordabilityScore { get; set; }
    public double DemographicVitalityScore { get; set; }
}

// Demographic cohorts, registration breakdown, and 3-year historical growth trend
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

// Childcare nurseries, kindergartens, primary schools, and capacity ratios
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

// Public transit stops, 500m isochrone coverage, cycling infrastructure, and P+R
public class DistrictMobilityAndTransport
{
    public int KmkStopsCount { get; set; }
    public int TramStopsCount { get; set; }
    public int BusStopsCount { get; set; }
    public int OnDemandStopsCount { get; set; }
    public int ScheduleBoardsCount { get; set; }
    public double TramNetworkSharePct { get; set; }
    public double IsochroneCoveragePct { get; set; }
    public int ParkAndRideCount { get; set; }
    public int BikeRacksCount { get; set; }
    public double BikeLanesLengthKm { get; set; }
    public double BikeLanesSeparatedKm { get; set; }
    public double BikeLanesCombinedKm { get; set; }
    public int BikeRepairStationsCount { get; set; }
}

// Parks, forests, biological buffer areas, and youth sports facilities
public class DistrictGreeneryAndSport
{
    public int CityParksCount { get; set; }
    public int PocketParksCount { get; set; }
    public double TotalParksAreaHa { get; set; }
    public double ForestAreaHa { get; set; }
    public double TotalGreenAreaHa { get; set; }
    public double GreenAreaM2PerCapita { get; set; }
    public double TotalGreenM2PerCapita { get; set; }
    public int SchoolSportsFacilitiesCount { get; set; }
    public int SchoolSwimmingPoolsCount { get; set; }
}

// Cultural institutions, library branches, senior activity centers, and municipal subsidies
public class DistrictCultureAndSociety
{
    public int LibraryBranchesCount { get; set; }
    public int CulturalCentersCount { get; set; }
    public int SeniorActivityCentersCount { get; set; }
    public int AnnualCulturalEventsCount { get; set; }
    public decimal MunicipalSubsidyPerCapitaPln { get; set; }
}

// Traffic safety, road incidents, and municipal police interventions
public class DistrictPublicSafety
{
    public int RoadCollisionsAnnual { get; set; }
    public int PedestrianAccidents { get; set; }
    public int InjuryAccidents { get; set; }
    public int MunicipalPoliceInterventionsTotal { get; set; }
    public int PublicDisturbanceInterventions { get; set; }
}

// Housing transaction prices, rental rates, affordability index, and YoY dynamics
public class DistrictHousingMarket
{
    public double AvgPricePerM2 { get; set; }
    public double PriceSecondaryM2 { get; set; }
    public double PricePrimaryM2 { get; set; }
    public double PriceMedianM2 { get; set; }
    public double AvgRentalPriceM2 { get; set; }
    public double PriceGrowthYoYPct { get; set; }
    public double M2PerAverageSalary { get; set; }
}

// Environmental monitoring: PM10/PM2.5 concentrations, smog days, and noise exposure
public class DistrictEnvironmentalQuality
{
    public double Pm10AnnualUgM3 { get; set; }
    public double Pm25AnnualUgM3 { get; set; }
    public int SmogDaysCount { get; set; }
    public double TrafficNoiseExceededPct { get; set; }
}

// 2028 Econometric forecasts, childcare balance, and municipal/B2B recommendations
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
