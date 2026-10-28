using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Cracow360.Application.DTOs;
using Cracow360.Application.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Cracow360.Infrastructure.ExternalServices;

/// <summary>
/// High-performance caching service serving municipal tourism benchmarks,
/// curated attractions, overtourism alternatives, itineraries, and district passports.
/// Ingested from verified municipal open data contracts (UMK, MOT, NID, MSIP, ZTP).
/// </summary>
public class TourismService : ITourismService
{
    private const string CacheKey = "Krakow_Tourism_Explorer_Dataset";
    private static readonly TimeSpan CacheDuration = TimeSpan.FromHours(4);

    private readonly IMemoryCache _cache;
    private readonly IConfiguration _configuration;
    private readonly IHostEnvironment _hostEnvironment;
    private readonly ILogger<TourismService> _logger;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public TourismService(
        IMemoryCache cache,
        IConfiguration configuration,
        IHostEnvironment hostEnvironment,
        ILogger<TourismService> logger)
    {
        _cache = cache;
        _configuration = configuration;
        _hostEnvironment = hostEnvironment;
        _logger = logger;
    }

    public async Task<TourismDatasetDto> GetTourismDatasetAsync(CancellationToken cancellationToken = default)
    {
        if (_cache.TryGetValue(CacheKey, out TourismDatasetDto? cached) && cached is not null)
        {
            return cached;
        }

        var filePath = ResolveTourismContractPath();
        if (!File.Exists(filePath))
        {
            _logger.LogError("Tourism contract file not found at: {FilePath}", filePath);
            throw new FileNotFoundException($"Tourism contract not found at: {filePath}");
        }

        var json = await File.ReadAllTextAsync(filePath, cancellationToken);
        var dataset = JsonSerializer.Deserialize<TourismDatasetDto>(json, JsonOptions)
            ?? throw new InvalidOperationException("Failed to deserialize tourism explorer dataset.");

        _cache.Set(CacheKey, dataset, CacheDuration);
        _logger.LogInformation("Loaded and cached tourism dataset with {AttractionsCount} attractions and {DistrictsCount} district passports from {FilePath}",
            dataset.Attractions.Count, dataset.DistrictPassports.Count, filePath);

        return dataset;
    }

    public async Task<IReadOnlyList<TourismAttractionDto>> GetAttractionsAsync(
        int? districtId = null,
        string? category = null,
        string? crowdLevel = null,
        CancellationToken cancellationToken = default)
    {
        var dataset = await GetTourismDatasetAsync(cancellationToken);
        IEnumerable<TourismAttractionDto> query = dataset.Attractions;

        if (districtId.HasValue)
        {
            query = query.Where(a => a.DistrictId == districtId.Value);
        }

        if (!string.IsNullOrWhiteSpace(category))
        {
            var cat = category.Trim().ToUpperInvariant();
            query = query.Where(a => a.Category.Equals(cat, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(crowdLevel))
        {
            var crowd = crowdLevel.Trim().ToUpperInvariant();
            query = query.Where(a => a.CrowdLevel.Equals(crowd, StringComparison.OrdinalIgnoreCase));
        }

        return query.ToList();
    }

    public async Task<IReadOnlyList<OvertourismAlternativeDto>> GetOvertourismAlternativesAsync(
        CancellationToken cancellationToken = default)
    {
        var dataset = await GetTourismDatasetAsync(cancellationToken);
        return dataset.OvertourismAlternatives;
    }

    public async Task<IReadOnlyList<ThematicItineraryDto>> GetThematicItinerariesAsync(
        int? targetHours = null,
        string? theme = null,
        CancellationToken cancellationToken = default)
    {
        var dataset = await GetTourismDatasetAsync(cancellationToken);
        IEnumerable<ThematicItineraryDto> query = dataset.ThematicItineraries;

        if (targetHours.HasValue)
        {
            query = query.Where(i => i.TargetHours == targetHours.Value);
        }

        if (!string.IsNullOrWhiteSpace(theme))
        {
            var thm = theme.Trim().ToUpperInvariant();
            query = query.Where(i => i.Theme.Equals(thm, StringComparison.OrdinalIgnoreCase));
        }

        return query.ToList();
    }

    public async Task<DistrictTouristPassportDto?> GetDistrictPassportAsync(
        int districtId,
        CancellationToken cancellationToken = default)
    {
        var dataset = await GetTourismDatasetAsync(cancellationToken);
        return dataset.DistrictPassports.FirstOrDefault(d => d.DistrictId == districtId);
    }

    private string ResolveTourismContractPath()
    {
        var explicitPath = _configuration["DataContractsPath"] ?? Environment.GetEnvironmentVariable("CONTRACTS_PATH");
        if (!string.IsNullOrWhiteSpace(explicitPath) && Directory.Exists(explicitPath))
        {
            var p = Path.Combine(explicitPath, "krakow_tourism_explorer.json");
            if (File.Exists(p)) return p;
        }

        var candidates = new[]
        {
            Path.Combine(_hostEnvironment.ContentRootPath, "data", "contracts"),
            Path.GetFullPath(Path.Combine(_hostEnvironment.ContentRootPath, "..", "..", "..", "data", "contracts")),
            Path.Combine(AppContext.BaseDirectory, "data", "contracts")
        };

        foreach (var dir in candidates)
        {
            if (Directory.Exists(dir))
            {
                var candidateFile = Path.Combine(dir, "krakow_tourism_explorer.json");
                if (File.Exists(candidateFile))
                {
                    return candidateFile;
                }
            }
        }

        return Path.Combine(candidates[1], "krakow_tourism_explorer.json");
    }
}
