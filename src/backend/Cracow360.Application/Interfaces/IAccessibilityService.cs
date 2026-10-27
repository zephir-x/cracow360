using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Cracow360.Application.DTOs;

namespace Cracow360.Application.Interfaces;

/// <summary>
/// Service contract for querying municipal accessibility profiles and recommendations.
/// </summary>
public interface IAccessibilityService
{
    /// <summary>
    /// Retrieves the entire accessibility dataset with city averages and all 18 district profiles.
    /// </summary>
    Task<AccessibilityDatasetDto> GetAccessibilityDatasetAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves the accessibility profile and facility audits for a specific district.
    /// </summary>
    Task<DistrictAccessibilityProfileDto?> GetDistrictAccessibilityAsync(int districtId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves top recommended districts sorted by a specific accessibility profile (e.g. mobility, visual, hearing, senior, familyStroller).
    /// </summary>
    Task<IReadOnlyList<DistrictAccessibilityProfileDto>> GetTopDistrictsByProfileAsync(string profileKey, int count = 3, CancellationToken cancellationToken = default);
}
