using Cracow360.Domain.Entities;
using Cracow360.Domain.Enums;

namespace Cracow360.Domain.Interfaces;

public interface IDistrictRepository
{
    Task<IReadOnlyList<District>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<District?> GetByIdAsync(int districtId, CancellationToken cancellationToken = default);
    Task<int> CountAsync(CancellationToken cancellationToken = default);
}

public interface IPointOfInterestRepository
{
    Task<IReadOnlyList<PointOfInterest>> GetAllAsync(
        int? districtId = null,
        PoiCategory? category = null,
        PoiSubCategory? subCategory = null,
        CancellationToken cancellationToken = default);
    Task<int> CountAsync(CancellationToken cancellationToken = default);
}
