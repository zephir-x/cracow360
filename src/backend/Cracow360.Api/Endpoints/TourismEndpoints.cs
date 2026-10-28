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
/// Minimal API route configuration for Krakow Smart Tourism & Discovery Explorer (/api/tourism).
/// Exposes endpoints for curated municipal attractions, overtourism alternatives ("Zejdź z utartego szlaku"),
/// customized thematic itineraries, and 18 district tourist passports with transit telemetry.
/// </summary>
public static class TourismEndpoints
{
    public static IEndpointRouteBuilder MapTourismEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/tourism")
            .WithTags("Smart Tourism & Exploration");

        // GET /api/tourism - Retrieves full tourism dataset with summary, attractions, alternatives, itineraries, and district passports
        group.MapGet("/", async (
            ITourismService tourismService,
            CancellationToken cancellationToken) =>
        {
            var dataset = await tourismService.GetTourismDatasetAsync(cancellationToken);
            return Results.Ok(dataset);
        })
        .WithName("GetTourismDataset")
        .WithSummary("Retrieves the complete municipal tourism exploration dataset (UMK, MOT, NID, MSIP, ZTP).")
        .Produces<TourismDatasetDto>(StatusCodes.Status200OK);

        // GET /api/tourism/attractions - Retrieves curated attractions with optional filtering
        group.MapGet("/attractions", async (
            int? districtId,
            string? category,
            string? crowdLevel,
            ITourismService tourismService,
            CancellationToken cancellationToken) =>
        {
            var attractions = await tourismService.GetAttractionsAsync(districtId, category, crowdLevel, cancellationToken);
            return Results.Ok(attractions);
        })
        .WithName("GetCuratedAttractions")
        .WithSummary("Retrieves curated attractions with optional filtering by districtId, category, or crowdLevel.")
        .Produces<IReadOnlyList<TourismAttractionDto>>(StatusCodes.Status200OK);

        // GET /api/tourism/alternatives - Retrieves overtourism alleviation pairs
        group.MapGet("/alternatives", async (
            ITourismService tourismService,
            CancellationToken cancellationToken) =>
        {
            var alternatives = await tourismService.GetOvertourismAlternativesAsync(cancellationToken);
            return Results.Ok(alternatives);
        })
        .WithName("GetOvertourismAlternatives")
        .WithSummary("Retrieves pairs contrasting overcrowded hotspots with serene hidden gem alternatives.")
        .Produces<IReadOnlyList<OvertourismAlternativeDto>>(StatusCodes.Status200OK);

        // GET /api/tourism/itineraries - Retrieves thematic itineraries with optional filters
        group.MapGet("/itineraries", async (
            int? targetHours,
            string? theme,
            ITourismService tourismService,
            CancellationToken cancellationToken) =>
        {
            var itineraries = await tourismService.GetThematicItinerariesAsync(targetHours, theme, cancellationToken);
            return Results.Ok(itineraries);
        })
        .WithName("GetThematicItineraries")
        .WithSummary("Retrieves multi-step thematic trails with calculated walking distances and transit connections.")
        .Produces<IReadOnlyList<ThematicItineraryDto>>(StatusCodes.Status200OK);

        // GET /api/tourism/districts/{id} - Retrieves tourist passport for a specific district
        group.MapGet("/districts/{id:int}", async (
            int id,
            ITourismService tourismService,
            CancellationToken cancellationToken) =>
        {
            var passport = await tourismService.GetDistrictPassportAsync(id, cancellationToken);
            return passport is not null
                ? Results.Ok(passport)
                : Results.NotFound(new { Message = $"Tourist passport for district ID={id} was not found." });
        })
        .WithName("GetDistrictTouristPassportById")
        .WithSummary("Retrieves tourist passport, transit time from Main Station, and top attractions for a specific district.")
        .Produces<DistrictTouristPassportDto>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound);

        return app;
    }
}
