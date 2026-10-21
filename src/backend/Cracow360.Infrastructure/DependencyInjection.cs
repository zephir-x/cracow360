using Cracow360.Application.Interfaces;
using Cracow360.Application.Services;
using Cracow360.Domain.Interfaces;
using Cracow360.Infrastructure.ExternalServices;
using Cracow360.Infrastructure.Persistence;
using Cracow360.Infrastructure.Persistence.Repositories;
using Cracow360.Infrastructure.Persistence.Seeding;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Cracow360.Infrastructure;

/// <summary>
/// Dependency injection registration for the Infrastructure layer.
/// Registers EF Core SQLite database context, in-memory caching, HTTP clients, repositories, and workers.
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddCracow360Infrastructure(
        this IServiceCollection services,
        IConfiguration configuration,
        string contentRootPath)
    {
        // 1. Resolve SQLite connection string from configuration or discover local database path dynamically
        var configuredConnectionString = configuration.GetConnectionString("DefaultConnection");
        string connectionString;

        if (string.IsNullOrWhiteSpace(configuredConnectionString))
        {
            var candidates = new[]
            {
                Path.Combine(contentRootPath, "data", "db"),
                Path.GetFullPath(Path.Combine(contentRootPath, "..", "..", "..", "data", "db")),
                Path.Combine(AppContext.BaseDirectory, "data", "db")
            };
            var defaultDbFolder = candidates.FirstOrDefault(Directory.Exists) ?? candidates[1];
            Directory.CreateDirectory(defaultDbFolder);
            var dbPath = Path.Combine(defaultDbFolder, "cracow360.db");
            connectionString = $"Data Source={dbPath}";
        }
        else
        {
            connectionString = configuredConnectionString;
        }

        // 2. Configure Entity Framework Core with SQLite provider
        services.AddDbContext<Cracow360DbContext>(options =>
            options.UseSqlite(connectionString));

        // 3. Register caching and HTTP client factory
        services.AddMemoryCache();
        services.AddHttpClient();

        // 4. Register data access repositories
        services.AddScoped<IDistrictRepository, DistrictRepository>();
        services.AddScoped<IPointOfInterestRepository, PointOfInterestRepository>();

        // 5. Register application domain services
        services.AddScoped<IDistrictService, DistrictService>();
        services.AddScoped<IPointOfInterestService, PointOfInterestService>();

        // 6. Register contract seeder and background workers
        services.AddScoped<DatabaseSeeder>();
        services.AddHostedService<GiosAirQualityBackgroundService>();

        return services;
    }
}
