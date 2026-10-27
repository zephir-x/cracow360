using Cracow360.Application.DTOs;

namespace Cracow360.Application.Interfaces;

/// <summary>
/// Application service contract for district evaluations, rankings, and comparisons.
/// </summary>
public interface IDistrictService
{
    // Retrieves ranked summary list of all 18 Krakow districts calculated with dynamic pillar weights (0.0 - 10.0)
    Task<IReadOnlyList<DistrictSummaryDto>> GetAllSummariesAsync(
        double mobilityWeight = 5.0,
        double educationWeight = 5.0,
        double greeneryWeight = 5.0,
        double cultureWeight = 5.0,
        double environmentWeight = 5.0,
        double safetyWeight = 5.0,
        double housingAffordabilityWeight = 5.0,
        double demographicVitalityWeight = 5.0,
        CancellationToken cancellationToken = default);

    // Retrieves complete granular domain metrics and forecasts for a specific district
    Task<DistrictDetailsDto?> GetDistrictDetailsAsync(
        int districtId, 
        CancellationToken cancellationToken = default);

    // Compares two districts side-by-side with calculated index deltas and metric differences
    Task<DistrictComparisonDto?> CompareDistrictsAsync(
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
        CancellationToken cancellationToken = default);
}

/// <summary>
/// Application service contract for spatial Point of Interest (POI) queries and category filtering.
/// </summary>
public interface IPointOfInterestService
{
    // Queries geocoded municipal facilities with optional district and category filters
    Task<IReadOnlyList<PointOfInterestDto>> GetPointsOfInterestAsync(
        int? districtId = null,
        string? category = null,
        string? subCategory = null,
        CancellationToken cancellationToken = default);
}

/// <summary>
/// Application service contract for real-time live atmosphere and air quality telemetry.
/// Ingests and synchronizes data from Open-Meteo European Weather & Air Quality models with GIOŚ stations.
/// </summary>
public interface ILiveAtmosphereService
{
    // Retrieves detailed live atmosphere (weather, 24h forecast, air quality, pollen, health recommendations) for a specific district
    Task<LiveAtmosphereDto> GetDistrictAtmosphereAsync(int districtId, CancellationToken cancellationToken = default);

    // Retrieves compact live summary for all 18 districts for map overlays and quick selection
    Task<IReadOnlyList<DistrictAtmosphereSummaryDto>> GetAllDistrictsSummaryAsync(CancellationToken cancellationToken = default);

    // Refreshes the cache in the background
    Task WarmUpCacheAsync(CancellationToken cancellationToken = default);
}
