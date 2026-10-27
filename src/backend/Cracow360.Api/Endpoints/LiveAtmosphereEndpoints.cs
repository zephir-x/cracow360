using Cracow360.Application.DTOs;
using Cracow360.Application.Interfaces;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Cracow360.Api.Endpoints;

/// <summary>
/// Minimal API endpoints for real-time weather forecasts, air quality, UV, botanical pollen,
/// and civic health recommendations for the City of Krakow and its 18 districts.
/// Powered by Open-Meteo European Weather & CAMS/GIOS monitoring models.
/// </summary>
public static class LiveAtmosphereEndpoints
{
    public static IEndpointRouteBuilder MapLiveAtmosphereEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/live")
            .WithTags("Live Environment & Weather");

        // GET /api/live/atmosphere?districtId={id} - Retrieves detailed current weather, 24h forecast, air quality & guidelines
        group.MapGet("/atmosphere", async (
            ILiveAtmosphereService atmosphereService,
            int? districtId,
            CancellationToken cancellationToken) =>
        {
            var targetDistrictId = districtId.GetValueOrDefault(1);
            var atmosphere = await atmosphereService.GetDistrictAtmosphereAsync(targetDistrictId, cancellationToken);
            return Results.Ok(atmosphere);
        })
        .WithName("GetLiveAtmosphere")
        .WithSummary("Retrieves live weather, 24h hourly forecast, air quality (AQI, PM10, PM2.5, NO2), UV, pollen, and civic recommendations for a district.")
        .Produces<LiveAtmosphereDto>(StatusCodes.Status200OK);

        // GET /api/live/atmosphere/summary - Retrieves compact ambient summary across all 18 districts for tickers and map overlays
        group.MapGet("/atmosphere/summary", async (
            ILiveAtmosphereService atmosphereService,
            CancellationToken cancellationToken) =>
        {
            var summaries = await atmosphereService.GetAllDistrictsSummaryAsync(cancellationToken);
            return Results.Ok(summaries);
        })
        .WithName("GetAllDistrictsAtmosphereSummary")
        .WithSummary("Retrieves a compact ambient summary (temperature, weather, AQI, wind, precipitation chance) for all 18 districts of Krakow.")
        .Produces<IReadOnlyList<DistrictAtmosphereSummaryDto>>(StatusCodes.Status200OK);

        return app;
    }
}
