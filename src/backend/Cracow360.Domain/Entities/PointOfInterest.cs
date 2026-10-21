using Cracow360.Domain.Enums;

namespace Cracow360.Domain.Entities;

/// <summary>
/// Domain entity representing a geocoded public facility or point of interest (POI) in Krakow.
/// </summary>
public class PointOfInterest
{
    // Unique identifier (e.g. "nursery_pub_1", "park_12", "lib_5")
    public string Id { get; set; } = string.Empty;

    // Foreign key to the parent administrative district (1 to 18)
    public int DistrictId { get; set; }

    // Primary functional category (EDU_CARE, GREENERY, CULTURE_SOCIETY, MOBILITY)
    public PoiCategory Category { get; set; }

    // Specific functional subcategory (e.g. NURSERY_PUBLIC, CITY_PARK, LIBRARY)
    public PoiSubCategory SubCategory { get; set; }

    // Official facility name
    public string Name { get; set; } = string.Empty;

    // Physical street address in Krakow
    public string Address { get; set; } = string.Empty;

    // Geographic latitude in WGS84 coordinates (EPSG:4326)
    public double Lat { get; set; }

    // Geographic longitude in WGS84 coordinates (EPSG:4326)
    public double Lng { get; set; }

    // Quantitative metrics associated with the facility (capacity, area, additional info)
    public PoiMetrics Metrics { get; set; } = new();

    // Navigation property to the parent administrative district
    public District? District { get; set; }
}

/// <summary>
/// Quantitative metrics associated with a point of interest (owned entity in EF Core).
/// </summary>
public class PoiMetrics
{
    // Capacity for nurseries, schools, P+R, or bike racks
    public int? Capacity { get; set; }

    // Area in hectares for parks, pocket parks, and forests
    public double? AreaHa { get; set; }

    // Additional contextual details (managing entity, equipment, opening notes)
    public string AdditionalInfo { get; set; } = string.Empty;
}
