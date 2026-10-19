using Cracow360.Domain.Entities;
using Cracow360.Domain.Enums;
using Cracow360.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Cracow360.Infrastructure.Persistence.Repositories;

public class DistrictRepository(Cracow360DbContext dbContext, IMemoryCache cache) : IDistrictRepository
{
    private const string AllDistrictsCacheKey = "districts_all";

    public async Task<IReadOnlyList<District>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        if (cache.TryGetValue(AllDistrictsCacheKey, out IReadOnlyList<District>? cached) && cached is not null)
        {
            return cached;
        }

        var districts = await dbContext.Districts
            .AsNoTracking()
            .OrderBy(d => d.DistrictId)
            .ToListAsync(cancellationToken);

        cache.Set(AllDistrictsCacheKey, (IReadOnlyList<District>)districts, TimeSpan.FromMinutes(10));
        return districts;
    }

    public async Task<District?> GetByIdAsync(int districtId, CancellationToken cancellationToken = default)
    {
        return await dbContext.Districts
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.DistrictId == districtId, cancellationToken);
    }

    public async Task<int> CountAsync(CancellationToken cancellationToken = default)
    {
        return await dbContext.Districts.CountAsync(cancellationToken);
    }
}

public class PointOfInterestRepository(Cracow360DbContext dbContext) : IPointOfInterestRepository
{
    public async Task<IReadOnlyList<PointOfInterest>> GetAllAsync(
        int? districtId = null,
        PoiCategory? category = null,
        PoiSubCategory? subCategory = null,
        CancellationToken cancellationToken = default)
    {
        var query = dbContext.PointsOfInterest.AsNoTracking().AsQueryable();

        if (districtId.HasValue)
            query = query.Where(p => p.DistrictId == districtId.Value);

        if (category.HasValue)
            query = query.Where(p => p.Category == category.Value);

        if (subCategory.HasValue)
            query = query.Where(p => p.SubCategory == subCategory.Value);

        return await query.OrderBy(p => p.Name).ToListAsync(cancellationToken);
    }

    public async Task<int> CountAsync(CancellationToken cancellationToken = default)
    {
        return await dbContext.PointsOfInterest.CountAsync(cancellationToken);
    }
}
