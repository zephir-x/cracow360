using Cracow360.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Cracow360.Infrastructure.Persistence;

/// <summary>
/// Entity Framework Core database context for the Kraków360 platform.
/// Maps domain aggregates, owned value objects, and spatial POI entities to SQLite tables.
/// </summary>
public class Cracow360DbContext(DbContextOptions<Cracow360DbContext> options) : DbContext(options)
{
    // Districts aggregate table (18 administrative units)
    public DbSet<District> Districts => Set<District>();

    // Points of interest table (geocoded facilities across Krakow)
    public DbSet<PointOfInterest> PointsOfInterest => Set<PointOfInterest>();

    // Historical air quality station readings table
    public DbSet<AirQualityStationReading> AirQualityReadings => Set<AirQualityStationReading>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // 1. Configure District aggregate root with explicit primary key and owned value objects
        modelBuilder.Entity<District>(entity =>
        {
            entity.HasKey(d => d.DistrictId);
            entity.Property(d => d.DistrictId).ValueGeneratedNever();
            entity.Property(d => d.DistrictRoman).HasMaxLength(16).IsRequired();
            entity.Property(d => d.DistrictName).HasMaxLength(128).IsRequired();

            // Configure 10 owned domain value objects mapped inline into the Districts table
            entity.OwnsOne(d => d.Scores);
            entity.OwnsOne(d => d.Demographics);
            entity.OwnsOne(d => d.EducationAndCare);
            entity.OwnsOne(d => d.MobilityAndTransport);
            entity.OwnsOne(d => d.GreeneryAndSport);
            entity.OwnsOne(d => d.PublicSafety);
            entity.OwnsOne(d => d.HousingMarket);
            entity.OwnsOne(d => d.EnvironmentalQuality);
            entity.OwnsOne(d => d.CultureAndSociety, c =>
            {
                c.Property(p => p.MunicipalSubsidyPerCapitaPln).HasColumnType("decimal(18,2)");
            });
            entity.OwnsOne(d => d.ForecastsAndB2B, f =>
            {
                f.Property(p => p.NurseryInvestmentPotentialB2B).HasConversion<string>();
                f.Property(p => p.SeniorInfrastructureDeficit).HasConversion<string>();
                f.Property(p => p.GreenSpaceDeficit).HasConversion<string>();
                f.Property(p => p.RecommendedMunicipalAction).HasMaxLength(1000);
            });

            // One-to-many relationship: a district contains multiple Points of Interest
            entity.HasMany(d => d.PointsOfInterest)
                .WithOne(p => p.District)
                .HasForeignKey(p => p.DistrictId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // 2. Configure PointOfInterest entity with string enum conversions and owned metrics
        modelBuilder.Entity<PointOfInterest>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Id).HasMaxLength(128);
            entity.Property(p => p.Name).HasMaxLength(256).IsRequired();
            entity.Property(p => p.Address).HasMaxLength(256);
            entity.Property(p => p.Category).HasConversion<string>();
            entity.Property(p => p.SubCategory).HasConversion<string>();
            entity.OwnsOne(p => p.Metrics);
        });

        // 3. Configure AirQualityStationReading telemetry records
        modelBuilder.Entity<AirQualityStationReading>(entity =>
        {
            entity.HasKey(a => a.Id);
            entity.Property(a => a.StationName).HasMaxLength(128);
            entity.Property(a => a.IndexLevelName).HasMaxLength(64);
        });
    }
}
