using Cracow360.Application.DTOs;

namespace Cracow360.Application.Interfaces;

public interface IDistrictService
{
    Task<IReadOnlyList<DistrictSummaryDto>> GetAllSummariesAsync(
        double mobilityWeight = 5.0,
        double educationWeight = 5.0,
        double greeneryWeight = 5.0,
        double cultureWeight = 5.0,
        double environmentWeight = 5.0,
        CancellationToken cancellationToken = default);

    Task<DistrictDetailsDto?> GetDistrictDetailsAsync(int districtId, CancellationToken cancellationToken = default);
}

public interface IPointOfInterestService
{
    Task<IReadOnlyList<PointOfInterestDto>> GetPointsOfInterestAsync(
        int? districtId = null,
        string? category = null,
        string? subCategory = null,
        CancellationToken cancellationToken = default);
}
