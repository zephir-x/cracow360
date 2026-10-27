using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Cracow360.Application.DTOs;
using Cracow360.Application.Interfaces;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Cracow360.Api.Endpoints;

/// <summary>
/// Minimal API route configuration for Civic Accessibility & Inclusion Navigator.
/// Provides endpoints for designated PRM parking ("Niebieskie Koperty"), Kassel-kerb transit accessibility,
/// public building accessibility audits (UMK / MFiPR), and profile-based district recommendations.
/// </summary>
public static class AccessibilityEndpoints
{
    public static IEndpointRouteBuilder MapAccessibilityEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/accessibility")
            .WithTags("Civic Accessibility & Inclusion");

        // GET /api/accessibility - Retrieves the complete accessibility dataset with city averages and all 18 districts
        group.MapGet("/", async (
            IAccessibilityService accessibilityService,
            CancellationToken cancellationToken) =>
        {
            var dataset = await accessibilityService.GetAccessibilityDatasetAsync(cancellationToken);
            return Results.Ok(dataset);
        })
        .WithName("GetAccessibilityDataset")
        .WithSummary("Retrieves the complete municipal accessibility dataset, benchmark city averages, and 18 district profiles.")
        .Produces<AccessibilityDatasetDto>(StatusCodes.Status200OK);

        // GET /api/accessibility/districts/{id} - Retrieves the detailed accessibility profile and facility audits for a district
        group.MapGet("/districts/{id:int}", async (
            int id,
            IAccessibilityService accessibilityService,
            CancellationToken cancellationToken) =>
        {
            var district = await accessibilityService.GetDistrictAccessibilityAsync(id, cancellationToken);
            return district is not null
                ? Results.Ok(district)
                : Results.NotFound(new { Message = $"Accessibility profile for district ID={id} was not found." });
        })
        .WithName("GetDistrictAccessibilityById")
        .WithSummary("Retrieves detailed accessibility indicators, scores, strengths, and audited facilities for a specific district.")
        .Produces<DistrictAccessibilityProfileDto>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound);

        // GET /api/accessibility/top/{profile} - Retrieves TOP recommended districts sorted by profile need
        group.MapGet("/top/{profile}", async (
            string profile,
            int? count,
            IAccessibilityService accessibilityService,
            CancellationToken cancellationToken) =>
        {
            var topDistricts = await accessibilityService.GetTopDistrictsByProfileAsync(
                profile,
                count ?? 3,
                cancellationToken);

            return Results.Ok(topDistricts);
        })
        .WithName("GetTopAccessibilityDistricts")
        .WithSummary("Retrieves TOP recommended districts sorted by specific accessibility profile (mobility, visual, hearing, senior, familyStroller).")
        .Produces<IReadOnlyList<DistrictAccessibilityProfileDto>>(StatusCodes.Status200OK);

        return app;
    }
}
