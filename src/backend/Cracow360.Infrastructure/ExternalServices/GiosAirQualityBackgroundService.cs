using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Cracow360.Infrastructure.ExternalServices;

/// <summary>
/// Periodic background worker synchronizing air quality readings
/// from GIOS measurement stations in Krakow (PM10, PM2.5, CAQI index).
/// Full GIOS API polling implementation is scheduled for Stage 3.
/// </summary>
public class GiosAirQualityBackgroundService(
    ILogger<GiosAirQualityBackgroundService> logger) : BackgroundService
{
    private static readonly TimeSpan SyncInterval = TimeSpan.FromMinutes(30);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation("GiosAirQualityBackgroundService started (sync interval: {Interval}).", SyncInterval);

        using var timer = new PeriodicTimer(SyncInterval);
        while (!stoppingToken.IsCancellationRequested && await timer.WaitForNextTickAsync(stoppingToken))
        {
            try
            {
                logger.LogDebug("Executing periodic GIOS air quality data synchronization for Krakow...");
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                logger.LogWarning(ex, "Error while synchronizing GIOS air quality readings.");
            }
        }
    }
}
