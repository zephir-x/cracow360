namespace Cracow360.Domain.Enums;

// Categorical investment potential and deficit level classification
public enum PotentialLevel
{
    LOW = 0,
    MEDIUM = 1,
    HIGH = 2
}

// High-level Point of Interest (POI) functional categories
public enum PoiCategory
{
    EDU_CARE,          // Educational and early childcare facilities
    GREENERY,          // Parks, pocket parks, and municipal forests
    CULTURE_SOCIETY,   // Libraries, cultural centers, and senior clubs
    MOBILITY           // Transit hubs, bike stations, and P+R lots
}

// Granular Point of Interest (POI) subcategories
public enum PoiSubCategory
{
    NURSERY_PUBLIC,      // Municipal nursery
    NURSERY_CONTRACTED,  // Contracted non-public nursery with municipal subsidies
    NURSERY_PRIVATE,     // Private nursery
    KIDS_CLUB,           // Licensed children's club
    PARENT_CLUB,         // Municipal parent club for children 0-3
    KINDERGARTEN,        // Public and non-public kindergartens
    PRIMARY_SCHOOL,      // Primary schools
    SCHOOL_SPORT,        // School sports halls and fields
    CITY_PARK,           // Major municipal park
    POCKET_PARK,         // Neighborhood pocket park
    LIBRARY,             // Municipal library branch
    CULTURAL_CENTER,     // Community cultural center or club
    SENIOR_CENTER,       // Senior activity center
    PARK_AND_RIDE        // Multimodal transit interchange (Park & Ride)
}
