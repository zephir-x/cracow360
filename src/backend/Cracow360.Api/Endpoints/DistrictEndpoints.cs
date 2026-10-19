using Cracow360.Application.Interfaces;
using Microsoft.AspNetCore.Builder;
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
        .WithSummary("Retrieves all Krakow districts with their calculated Quality of Life Index.");

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
