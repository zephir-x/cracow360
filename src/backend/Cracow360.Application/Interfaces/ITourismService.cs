using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Cracow360.Application.DTOs;

namespace Cracow360.Application.Interfaces;

/// <summary>
/// Service interface providing official tourism and urban discovery telemetry,
/// overtourism mitigation recommendations, itineraries, and district passports.
/// </summary>
public interface ITourismService
{
    /// <summary>
    /// Retrieves the complete tourism and exploration dataset.
    /// </summary>
    Task<TourismDatasetDto> GetTourismDatasetAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves curated attractions, optionally filtered by district, category, or crowd level.
    /// </summary>
    Task<IReadOnlyList<TourismAttractionDto>> GetAttractionsAsync(
        int? districtId = null,
        string? category = null,
        string? crowdLevel = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves overtourism alternative pairs ("Zejdź z utartego szlaku").
    /// </summary>
    Task<IReadOnlyList<OvertourismAlternativeDto>> GetOvertourismAlternativesAsync(
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves thematic itineraries, optionally filtered by target duration or theme.
    /// </summary>
    Task<IReadOnlyList<ThematicItineraryDto>> GetThematicItinerariesAsync(
        int? targetHours = null,
        string? theme = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves the tourist passport for a specific administrative district.
    /// </summary>
    Task<DistrictTouristPassportDto?> GetDistrictPassportAsync(
        int districtId,
        CancellationToken cancellationToken = default);
}
