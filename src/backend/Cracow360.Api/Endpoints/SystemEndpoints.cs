using Cracow360.Application.DTOs;
using Cracow360.Domain.Interfaces;
using Cracow360.Infrastructure.Persistence;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Cracow360.Api.Endpoints;

/// <summary>
/// Minimal API route configuration for system health inspection,
/// database connectivity verification, and contract seeding statistics.
/// </summary>
public static class SystemEndpoints
{
    public static IEndpointRouteBuilder MapSystemEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/system")
            .WithTags("System");

        // GET /api/system/hello - Returns system status, runtime environment, and database seeding verification
        group.MapGet("/hello", async (
            Cracow360DbContext dbContext,
            IDistrictRepository districtRepository,
            IPointOfInterestRepository poiRepository,
            IHostEnvironment env,
            CancellationToken cancellationToken) =>
        {
            var canConnect = await dbContext.Database.CanConnectAsync(cancellationToken);
            var districtsCount = canConnect ? await districtRepository.CountAsync(cancellationToken) : 0;
            var poisCount = canConnect ? await poiRepository.CountAsync(cancellationToken) : 0;

            var response = new SystemHelloDto(
                Message: "Hello World from Kraków360 .NET 9 Minimal API!",
                ProjectName: "Kraków360 – System Analizy Jakości Życia, Dostępności Usług i Predykcji Rozwoju Miejskiego",
                Competition: "Open Data App – Urząd Miasta Krakowa (2026)",
                Environment: env.EnvironmentName,
                DatabaseProvider: "SQLite (EF Core 9 + Dapper)",
                DatabaseConnected: canConnect,
                SeededDistrictsCount: districtsCount,
                SeededPoisCount: poisCount,
                ServerTimeUtc: DateTime.UtcNow
            );

            return Results.Ok(response);
        })
        .WithName("GetSystemHello")
        .WithSummary("Returns Hello World connection status, SQLite database connectivity, and seeding statistics.")
        .Produces<SystemHelloDto>(StatusCodes.Status200OK);

        return app;
    }
}
