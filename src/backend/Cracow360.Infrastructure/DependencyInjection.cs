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

public static class DependencyInjection
{
    public static IServiceCollection AddCracow360Infrastructure(
        this IServiceCollection services,
        IConfiguration configuration,
        string contentRootPath)
    {
        var configuredConnectionString = configuration.GetConnectionString("DefaultConnection");
        string connectionString;

        if (string.IsNullOrWhiteSpace(configuredConnectionString))
        {
            var defaultDbFolder = Path.GetFullPath(Path.Combine(contentRootPath, "..", "..", "..", "data", "db"));
            Directory.CreateDirectory(defaultDbFolder);
            var dbPath = Path.Combine(defaultDbFolder, "cracow360.db");
            connectionString = $"Data Source={dbPath}";
        }
        else
        {
            connectionString = configuredConnectionString;
        }

        services.AddDbContext<Cracow360DbContext>(options =>
            options.UseSqlite(connectionString));

        services.AddMemoryCache();
        services.AddHttpClient();

        // Repositories
        services.AddScoped<IDistrictRepository, DistrictRepository>();
        services.AddScoped<IPointOfInterestRepository, PointOfInterestRepository>();

        // Application Services
        services.AddScoped<IDistrictService, DistrictService>();
        services.AddScoped<IPointOfInterestService, PointOfInterestService>();

        // Seeder & Background Workers
        services.AddScoped<DatabaseSeeder>();
        services.AddHostedService<GiosAirQualityBackgroundService>();

        return services;
    }
}
