using Cracow360.Application.Interfaces;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Cracow360.Api.Endpoints;

public static class PoiEndpoints
{
    public static IEndpointRouteBuilder MapPoiEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/pois")
            .WithTags("Points of Interest (Module 2 - Education & Care Compass)");

        group.MapGet("/", async (
            IPointOfInterestService poiService,
            int? districtId,
            string? category,
            string? subCategory,
            CancellationToken cancellationToken) =>
        {
            var pois = await poiService.GetPointsOfInterestAsync(districtId, category, subCategory, cancellationToken);
            return Results.Ok(pois);
        })
        .WithName("GetPointsOfInterest")
        .WithSummary("Retrieves Points of Interest (POI) with optional filtering by district and category.");

        return app;
    }
}
