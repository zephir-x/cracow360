using Cracow360.Domain.Entities;
using Cracow360.Domain.Enums;

namespace Cracow360.Domain.Interfaces;

/// <summary>
/// Repository contract for Krakow district aggregate retrieval and persistence.
/// </summary>
public interface IDistrictRepository
{
    // Retrieves all 18 Krakow districts with full domain entities and value objects
    Task<IReadOnlyList<District>> GetAllAsync(CancellationToken cancellationToken = default);

    // Retrieves a specific district by its official numeric identifier (1..18)
    Task<District?> GetByIdAsync(int districtId, CancellationToken cancellationToken = default);

    // Returns total count of persisted districts (expected: 18)
    Task<int> CountAsync(CancellationToken cancellationToken = default);
}

/// <summary>
/// Repository contract for Point of Interest (POI) spatial queries and filtering.
/// </summary>
public interface IPointOfInterestRepository
{
    // Queries POIs with optional filtering by administrative district, category, and subcategory
    Task<IReadOnlyList<PointOfInterest>> GetAllAsync(
        int? districtId = null,
        PoiCategory? category = null,
        PoiSubCategory? subCategory = null,
        CancellationToken cancellationToken = default);

    // Returns total count of seeded Points of Interest
    Task<int> CountAsync(CancellationToken cancellationToken = default);
}
