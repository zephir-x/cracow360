using System;
using System.Collections.Generic;

namespace Cracow360.Application.DTOs;

/// <summary>
/// Root payload representing the full accessibility profiles dataset for Krakow's 18 districts.
/// Conforms to European Accessibility Act (EAA) guidelines and real municipal open data contracts.
/// </summary>
public record AccessibilityDatasetDto(
    string GeneratedAt,
    AccessibilityMetaDto Meta,
    AccessibilityCityAveragesDto CityAverages,
    IReadOnlyList<DistrictAccessibilityProfileDto> Districts
);

/// <summary>
/// Metadata describing open data provenance and supported inclusion profiles.
/// </summary>
public record AccessibilityMetaDto(
    string Title,
    string Description,
    IReadOnlyList<AccessibilitySourceDto> Sources,
    IReadOnlyList<string> ProfilesSupported
);

/// <summary>
/// Verified municipal source attribution.
/// </summary>
public record AccessibilitySourceDto(
    string Id,
    string Name,
    string Url
);

/// <summary>
/// City-wide average indicators for accessibility benchmark comparisons.
/// </summary>
public record AccessibilityCityAveragesDto(
    int TotalPrmParkingSpots,
    int TotalPrmLocations,
    int TotalAuditedFacilities,
    int TotalSeniorCenters,
    double AvgKasselKerbPct,
    double AvgTactilePavingPct,
    double AvgOverallScore
);

/// <summary>
/// Full accessibility profile and granular metrics for a specific Krakow administrative district.
/// </summary>
public record DistrictAccessibilityProfileDto(
    int DistrictId,
    string DistrictRoman,
    string DistrictName,
    double AreaKm2,
    int TotalPopulation,
    int Seniors65Plus,
    AccessibilityMetricsDto Metrics,
    AccessibilityScoresDto Scores,
    IReadOnlyList<string> KeyStrengths,
    IReadOnlyList<PublicFacilityAuditDto> Facilities
);

/// <summary>
/// Aggregated multi-domain accessibility metrics for a district.
/// </summary>
public record AccessibilityMetricsDto(
    PrmParkingMetricsDto PrmParking,
    TransitAccessibilityMetricsDto Transit,
    PublicFacilitiesMetricsDto PublicFacilities,
    SeniorCareMetricsDto SeniorCare,
    RecreationAccessibilityMetricsDto Recreation
);

/// <summary>
/// Designated PRM parking stalls ("Niebieskie Koperty") based on ZDMK records.
/// </summary>
public record PrmParkingMetricsDto(
    int TotalSpots,
    int LocationsCount,
    double SpotsPer10kPop,
    double SpotsPerKm2
);

/// <summary>
/// Public transit stops accessibility (Kassel-kerb curbs & tactile paving strips) from KMK/ZTP.
/// </summary>
public record TransitAccessibilityMetricsDto(
    int TotalStops,
    int KasselKerbStops,
    double KasselKerbPct,
    int TactilePavingStops,
    double TactilePavingPct
);

/// <summary>
/// Audited public buildings accessibility from UMK / MFiPR report.
/// </summary>
public record PublicFacilitiesMetricsDto(
    int AuditedTotal,
    int WheelchairFull,
    int WheelchairPartial,
    int Elevators,
    int Ramps,
    int AccessibleToilets,
    int HearingLoops,
    int SignLanguagePJM,
    int BrailleTactile,
    int WheelchairGood = 0,
    int WheelchairWeak = 0,
    int WheelchairNone = 0
);

/// <summary>
/// Senior support infrastructure from UMK / DlaSeniora.
/// </summary>
public record SeniorCareMetricsDto(
    int CasCount,
    double CasPer10kSeniors
);

/// <summary>
/// Accessible recreational greenery.
/// </summary>
public record RecreationAccessibilityMetricsDto(
    int CityParks,
    int PocketParks
);

/// <summary>
/// Normalized 0-100 quality scores for different inclusion and mobility profiles.
/// </summary>
public record AccessibilityScoresDto(
    double OverallScore,
    double MobilityScore,
    double VisualScore,
    double HearingScore,
    double SeniorScore,
    double FamilyStrollerScore
);

/// <summary>
/// Individual public facility accessibility audit entry.
/// </summary>
public record PublicFacilityAuditDto(
    string Name,
    string Departments,
    string Address,
    string WheelchairAccessible,
    bool HasRamp,
    bool HasElevatorOrPlatform,
    bool AccessibleToilet,
    bool HearingLoop,
    bool SignLanguageTranslator,
    bool BrailleOrTactile,
    string AuditDescription
);
