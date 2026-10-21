using Cracow360.Api.Common;
using Cracow360.Application.DTOs;
using Cracow360.Application.Interfaces;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Cracow360.Api.Endpoints;

/// <summary>
/// Minimal API route configuration for Krakow administrative districts,
/// composite Quality of Life scores, GeoJSON vector boundaries, and district comparisons.
/// </summary>
public static class DistrictEndpoints
{
    public static IEndpointRouteBuilder MapDistrictEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/districts")
            .WithTags("Districts (Module 1 - Quality of Life Index)");

        // GET /api/districts - Retrieves all 18 districts with real-time Quality of Life index based on custom pillar weights
        group.MapGet("/", async (
            IDistrictService districtService,
            double? mobilityWeight,
            double? educationWeight,
            double? greeneryWeight,
            double? cultureWeight,
            double? environmentWeight,
            double? safetyWeight,
            double? housingAffordabilityWeight,
            CancellationToken cancellationToken) =>
        {
            var summaries = await districtService.GetAllSummariesAsync(
                mobilityWeight ?? 5.0,
                educationWeight ?? 5.0,
                greeneryWeight ?? 5.0,
                cultureWeight ?? 5.0,
                environmentWeight ?? 5.0,
                safetyWeight ?? 5.0,
                housingAffordabilityWeight ?? 5.0,
                cancellationToken);

            return Results.Ok(summaries);
        })
        .WithName("GetAllDistricts")
        .WithSummary("Retrieves all 18 Krakow districts with their calculated Quality of Life Index across 7 pillars.")
        .Produces<IReadOnlyList<DistrictSummaryDto>>(StatusCodes.Status200OK);

        // GET /api/districts/geojson - Serves the official vector boundaries (EPSG:4326 WGS84) for map visualization
        group.MapGet("/geojson", async (
            IWebHostEnvironment env,
            CancellationToken cancellationToken) =>
        {
            var contractsPath = DataPathResolver.ResolveContractsPath(env);
            var geoJsonPath = Path.Combine(contractsPath, "krakow_districts.geojson");

            if (!File.Exists(geoJsonPath))
            {
                return Results.NotFound(new { Message = "Districts GeoJSON boundary file not found." });
            }

            var content = await File.ReadAllTextAsync(geoJsonPath, cancellationToken);
            return Results.Content(content, "application/geo+json");
        })
        .WithName("GetDistrictsGeoJson")
        .WithSummary("Returns the GeoJSON FeatureCollection containing vector boundaries of all 18 Krakow districts.")
        .Produces(StatusCodes.Status200OK, contentType: "application/geo+json")
        .ProducesProblem(StatusCodes.Status404NotFound);

        // GET /api/districts/compare - Compares two districts side-by-side with calculated index and metric deltas
        group.MapGet("/compare", async (
            int firstId,
            int secondId,
            IDistrictService districtService,
            double? mobilityWeight,
            double? educationWeight,
            double? greeneryWeight,
            double? cultureWeight,
            double? environmentWeight,
            double? safetyWeight,
            double? housingAffordabilityWeight,
            CancellationToken cancellationToken) =>
        {
            var comparison = await districtService.CompareDistrictsAsync(
                firstId,
                secondId,
                mobilityWeight ?? 5.0,
                educationWeight ?? 5.0,
                greeneryWeight ?? 5.0,
                cultureWeight ?? 5.0,
                environmentWeight ?? 5.0,
                safetyWeight ?? 5.0,
                housingAffordabilityWeight ?? 5.0,
                cancellationToken);

            return comparison is not null
                ? Results.Ok(comparison)
                : Results.NotFound(new { Message = $"One or both districts ({firstId}, {secondId}) were not found." });
        })
        .WithName("CompareDistricts")
        .WithSummary("Compares two Krakow districts side-by-side across all 7 Quality of Life dimensions and metrics.")
        .Produces<DistrictComparisonDto>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound);

        // GET /api/districts/{id} - Fetches complete granular metrics and 2028 econometric forecasts for a specific district
        group.MapGet("/{id:int}", async (
            int id,
            IDistrictService districtService,
            CancellationToken cancellationToken) =>
        {
            var district = await districtService.GetDistrictDetailsAsync(id, cancellationToken);
            return district is not null 
                ? Results.Ok(district) 
                : Results.NotFound(new { Message = $"District with ID={id} was not found." });
        })
        .WithName("GetDistrictById")
        .WithSummary("Retrieves full demographic, infrastructure, housing, safety, and forecast metrics for a specific district.")
        .Produces<DistrictDetailsDto>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound);

        return app;
    }
}
