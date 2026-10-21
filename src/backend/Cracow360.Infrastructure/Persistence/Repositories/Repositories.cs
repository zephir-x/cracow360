using Cracow360.Domain.Entities;
using Cracow360.Domain.Enums;
using Cracow360.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Cracow360.Infrastructure.Persistence.Repositories;

/// <summary>
/// District repository implementation utilizing EF Core read-only queries with in-memory caching.
/// Caches the static 18-district list for 10 minutes to maximize throughput and minimize SQLite disk I/O.
/// </summary>
public class DistrictRepository(Cracow360DbContext dbContext, IMemoryCache cache) : IDistrictRepository
{
    private const string AllDistrictsCacheKey = "districts_all";

    // Retrieves all 18 districts with in-memory caching (10 min TTL)
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

    // Retrieves a single district by identifier without tracking
    public async Task<District?> GetByIdAsync(int districtId, CancellationToken cancellationToken = default)
    {
        return await dbContext.Districts
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.DistrictId == districtId, cancellationToken);
    }

    // Counts total districts in database
    public async Task<int> CountAsync(CancellationToken cancellationToken = default)
    {
        return await dbContext.Districts.CountAsync(cancellationToken);
    }
}

/// <summary>
/// Point of Interest repository implementation providing dynamic multi-predicate queries
/// across administrative districts, categories, and subcategories.
/// </summary>
public class PointOfInterestRepository(Cracow360DbContext dbContext) : IPointOfInterestRepository
{
    // Queries POIs with optional predicates for district, category, and subcategory
    public async Task<IReadOnlyList<PointOfInterest>> GetAllAsync(
        int? districtId = null,
        PoiCategory? category = null,
        PoiSubCategory? subCategory = null,
        CancellationToken cancellationToken = default)
    {
        var query = dbContext.PointsOfInterest.AsNoTracking().AsQueryable();

        // Apply optional district filter
        if (districtId.HasValue)
            query = query.Where(p => p.DistrictId == districtId.Value);

        // Apply optional high-level category filter
        if (category.HasValue)
            query = query.Where(p => p.Category == category.Value);

        // Apply optional granular subcategory filter
        if (subCategory.HasValue)
            query = query.Where(p => p.SubCategory == subCategory.Value);

        return await query.OrderBy(p => p.Name).ToListAsync(cancellationToken);
    }

    // Counts total Points of Interest in database
    public async Task<int> CountAsync(CancellationToken cancellationToken = default)
    {
        return await dbContext.PointsOfInterest.CountAsync(cancellationToken);
    }
}
