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
/// High-performance caching service serving municipal accessibility profiles
/// for people with disabilities, seniors, and parents with baby strollers.
/// Ingested from verified municipal open data contracts (ZDMK, UMK, ZTP).
/// </summary>
public class AccessibilityService : IAccessibilityService
{
    private const string CacheKey = "Krakow_Accessibility_Profiles_Dataset";
    private static readonly TimeSpan CacheDuration = TimeSpan.FromHours(4);

    private readonly IMemoryCache _cache;
    private readonly IConfiguration _configuration;
    private readonly IHostEnvironment _hostEnvironment;
    private readonly ILogger<AccessibilityService> _logger;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public AccessibilityService(
        IMemoryCache cache,
        IConfiguration configuration,
        IHostEnvironment hostEnvironment,
        ILogger<AccessibilityService> logger)
    {
        _cache = cache;
        _configuration = configuration;
        _hostEnvironment = hostEnvironment;
        _logger = logger;
    }

    public async Task<AccessibilityDatasetDto> GetAccessibilityDatasetAsync(CancellationToken cancellationToken = default)
    {
        if (_cache.TryGetValue(CacheKey, out AccessibilityDatasetDto? cached) && cached is not null)
        {
            return cached;
        }

        var filePath = ResolveAccessibilityContractPath();
        if (!File.Exists(filePath))
        {
            _logger.LogError("Accessibility contract file not found at: {FilePath}", filePath);
            throw new FileNotFoundException($"Accessibility contract not found at: {filePath}");
        }

        var json = await File.ReadAllTextAsync(filePath, cancellationToken);
        var dataset = JsonSerializer.Deserialize<AccessibilityDatasetDto>(json, JsonOptions)
            ?? throw new InvalidOperationException("Failed to deserialize accessibility profiles dataset.");

        _cache.Set(CacheKey, dataset, CacheDuration);
        _logger.LogInformation("Loaded and cached accessibility dataset with {Count} districts from {FilePath}", dataset.Districts.Count, filePath);

        return dataset;
    }

    public async Task<DistrictAccessibilityProfileDto?> GetDistrictAccessibilityAsync(int districtId, CancellationToken cancellationToken = default)
    {
        var dataset = await GetAccessibilityDatasetAsync(cancellationToken);
        return dataset.Districts.FirstOrDefault(d => d.DistrictId == districtId);
    }

    public async Task<IReadOnlyList<DistrictAccessibilityProfileDto>> GetTopDistrictsByProfileAsync(string profileKey, int count = 3, CancellationToken cancellationToken = default)
    {
        var dataset = await GetAccessibilityDatasetAsync(cancellationToken);
        var normalizedKey = (profileKey ?? "").Trim().ToLowerInvariant();

        IEnumerable<DistrictAccessibilityProfileDto> sorted = normalizedKey switch
        {
            "mobility" or "wozek" or "ruch" =>
                dataset.Districts.OrderByDescending(d => d.Scores.MobilityScore),
            "visual" or "wzrok" or "niewidomi" =>
                dataset.Districts.OrderByDescending(d => d.Scores.VisualScore),
            "hearing" or "sluch" or "glusi" =>
                dataset.Districts.OrderByDescending(d => d.Scores.HearingScore),
            "senior" or "seniorzy" =>
                dataset.Districts.OrderByDescending(d => d.Scores.SeniorScore),
            "familystroller" or "stroller" or "wozekdzieciecy" or "dzieci" =>
                dataset.Districts.OrderByDescending(d => d.Scores.FamilyStrollerScore),
            _ =>
                dataset.Districts.OrderByDescending(d => d.Scores.OverallScore)
        };

        return sorted.Take(Math.Max(1, count)).ToList();
    }

    private string ResolveAccessibilityContractPath()
    {
        var explicitPath = _configuration["DataContractsPath"] ?? Environment.GetEnvironmentVariable("CONTRACTS_PATH");
        if (!string.IsNullOrWhiteSpace(explicitPath) && Directory.Exists(explicitPath))
        {
            var p = Path.Combine(explicitPath, "krakow_accessibility_profiles.json");
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
                var candidateFile = Path.Combine(dir, "krakow_accessibility_profiles.json");
                if (File.Exists(candidateFile))
                {
                    return candidateFile;
                }
            }
        }

        return Path.Combine(candidates[1], "krakow_accessibility_profiles.json");
    }
}
