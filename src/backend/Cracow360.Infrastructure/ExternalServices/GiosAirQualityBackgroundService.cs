using Cracow360.Application.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Cracow360.Infrastructure.ExternalServices;

/// <summary>
/// Periodic background worker synchronizing live atmospheric and air quality readings
/// (temperature, 24h forecast, PM10, PM2.5, NO2, UV, pollen allergens) for Krakow.
/// Warms up and refreshes in-memory cache periodically.
/// </summary>
public class GiosAirQualityBackgroundService(
    IServiceScopeFactory scopeFactory,
    ILogger<GiosAirQualityBackgroundService> logger) : BackgroundService
{
    // Interval for polling atmospheric monitoring stations (every 45 minutes)
    private static readonly TimeSpan SyncInterval = TimeSpan.FromMinutes(45);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation("GiosAirQualityBackgroundService started (sync interval: {Interval}).", SyncInterval);

        // Immediate cache warm-up upon application startup
        try
        {
            using var initScope = scopeFactory.CreateScope();
            var atmosphereService = initScope.ServiceProvider.GetRequiredService<ILiveAtmosphereService>();
            await atmosphereService.WarmUpCacheAsync(stoppingToken);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            logger.LogWarning(ex, "Initial live atmosphere cache warm-up failed; resilient fallback will be served.");
        }

        using var timer = new PeriodicTimer(SyncInterval);

        // Polling loop executing on each tick until service shutdown is requested
        while (!stoppingToken.IsCancellationRequested && await timer.WaitForNextTickAsync(stoppingToken))
        {
            try
            {
                logger.LogDebug("Executing periodic live atmosphere & GIOS air quality synchronization for Krakow...");
                using var scope = scopeFactory.CreateScope();
                var atmosphereService = scope.ServiceProvider.GetRequiredService<ILiveAtmosphereService>();
                await atmosphereService.WarmUpCacheAsync(stoppingToken);
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                logger.LogWarning(ex, "Error while synchronizing live atmosphere & GIOS air quality readings.");
            }
        }
    }
}
