using Cracow360.Application.Interfaces;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Cracow360.Api.Endpoints;

public static class DistrictEndpoints
{
    public static IEndpointRouteBuilder MapDistrictEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/districts")
            .WithTags("Districts (Module 1 - Quality of Life Index)");

        group.MapGet("/", async (
            IDistrictService districtService,
            double? mobilityWeight,
            double? educationWeight,
            double? greeneryWeight,
            double? cultureWeight,
            double? environmentWeight,
            CancellationToken cancellationToken) =>
        {
            var summaries = await districtService.GetAllSummariesAsync(
                mobilityWeight ?? 5.0,
                educationWeight ?? 5.0,
                greeneryWeight ?? 5.0,
                cultureWeight ?? 5.0,
                environmentWeight ?? 5.0,
                cancellationToken);

            return Results.Ok(summaries);
        })
        .WithName("GetAllDistricts")
        .WithSummary("Retrieves all 18 Krakow districts with their calculated Quality of Life Index.");

        group.MapGet("/geojson", async (
            IWebHostEnvironment env,
            CancellationToken cancellationToken) =>
        {
            var geoJsonPath = Path.GetFullPath(
                Path.Combine(env.ContentRootPath, "..", "..", "..", "data", "contracts", "krakow_districts.geojson"));

            if (!File.Exists(geoJsonPath))
            {
                return Results.NotFound(new { Message = "Districts GeoJSON boundary file not found." });
            }

            var content = await File.ReadAllTextAsync(geoJsonPath, cancellationToken);
            return Results.Content(content, "application/geo+json");
        })
        .WithName("GetDistrictsGeoJson")
        .WithSummary("Returns the GeoJSON FeatureCollection containing vector boundaries of all 18 Krakow districts.");

        group.MapGet("/compare", async (
            int firstId,
            int secondId,
            IDistrictService districtService,
            double? mobilityWeight,
            double? educationWeight,
            double? greeneryWeight,
            double? cultureWeight,
            double? environmentWeight,
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
                cancellationToken);

            return comparison is not null
                ? Results.Ok(comparison)
                : Results.NotFound(new { Message = $"One or both districts ({firstId}, {secondId}) were not found." });
        })
        .WithName("CompareDistricts")
        .WithSummary("Compares two Krakow districts side-by-side across all Quality of Life dimensions and metrics.");

        group.MapGet("/{id:int}", async (
            int id,
            IDistrictService districtService,
            CancellationToken cancellationToken) =>
        {
            var district = await districtService.GetDistrictDetailsAsync(id, cancellationToken);
            return district is not null ? Results.Ok(district) : Results.NotFound(new { Message = $"District with ID={id} was not found." });
        })
        .WithName("GetDistrictById")
        .WithSummary("Retrieves full demographic, infrastructure, and forecast metrics for a specific district.");

        return app;
    }
}
