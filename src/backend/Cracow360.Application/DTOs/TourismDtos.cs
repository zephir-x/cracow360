using System;
using System.Collections.Generic;

namespace Cracow360.Application.DTOs;

/// <summary>
/// Root payload representing the official municipal tourism & exploration dataset for Krakow.
/// Sourced from UMK, MOT 2024 reports, BIP, NID, MSIP, and ZTP.
/// </summary>
public record TourismDatasetDto(
    string GeneratedAt,
    TourismMetaDto Meta,
    CityTourismSummaryDto CityTourismSummary,
    IReadOnlyList<TourismAttractionDto> Attractions,
    IReadOnlyList<OvertourismAlternativeDto> OvertourismAlternatives,
    IReadOnlyList<ThematicItineraryDto> ThematicItineraries,
    IReadOnlyList<DistrictTouristPassportDto> DistrictPassports
);

/// <summary>
/// Metadata describing open data provenance and versioning.
/// </summary>
public record TourismMetaDto(
    string Title,
    string Description,
    string Version,
    IReadOnlyList<TourismSourceDto> Sources
);

/// <summary>
/// Verified municipal source attribution.
/// </summary>
public record TourismSourceDto(
    string Id,
    string Name,
    string Url
);

/// <summary>
/// City-wide tourism telemetry based on official UMK and MOT 2024 studies.
/// </summary>
public record CityTourismSummaryDto(
    long AnnualVisitorsTotal,
    long OvernightTourists,
    long DomesticVisitors,
    long InternationalVisitors,
    long EstimatedEconomicImpactPln,
    double AverageStayDays,
    int TotalCuratedAttractions,
    int UnescoSitesCount,
    int CuratedItinerariesCount,
    int OvertourismAlternativePairsCount,
    IReadOnlyList<TopMarketDto> TopInternationalMarkets
);

/// <summary>
/// International inbound visitor market share.
/// </summary>
public record TopMarketDto(
    string Country,
    double SharePct,
    string Flag
);

/// <summary>
/// Direct public transit connection from Krakow Main Station (Dworzec Główny).
/// </summary>
public record DirectTransitInfoDto(
    string Line,
    int TimeMinutes
);

/// <summary>
/// Curated municipal attraction with geographic, crowd, and transit telemetry.
/// </summary>
public record TourismAttractionDto(
    string Id,
    int DistrictId,
    string Name,
    string Category,
    string CrowdLevel,
    double Lat,
    double Lng,
    int EstimatedVisitMinutes,
    bool IsUnesco,
    DirectTransitInfoDto DirectTransitFromMainStation,
    string Description,
    IReadOnlyList<string> Tags
);

/// <summary>
/// Pair comparing a crowded tourist hotspot with an authentic, serene alternative.
/// Alleviates overtourism ("Zejdź z utartego szlaku").
/// </summary>
public record OvertourismAlternativeDto(
    string Id,
    string CrowdedAttractionId,
    string CrowdedName,
    string CrowdedCrowdLevel,
    string PeacefulAttractionId,
    string PeacefulName,
    string PeacefulCrowdLevel,
    string ReasonPl,
    string ReasonEn,
    string ReasonUa
);

/// <summary>
/// Step inside an itinerary with calculated walking time and distance to next point.
/// </summary>
public record ItineraryStopDto(
    int StepNumber,
    string AttractionId,
    string Name,
    string Category,
    string CrowdLevel,
    double Lat,
    double Lng,
    int VisitMinutes,
    int WalkToNextMinutes,
    double DistanceToNextKm,
    int DistrictId
);

/// <summary>
/// Curated thematic trail with duration and profile targeting.
/// </summary>
public record ThematicItineraryDto(
    string Id,
    string TitlePl,
    string TitleEn,
    string TitleUa,
    int TargetHours,
    string Theme,
    IReadOnlyList<string> StopIds,
    IReadOnlyList<string> SuitableFor,
    string DescriptionPl,
    string DescriptionEn,
    string DescriptionUa,
    int CalculatedDurationMinutes,
    IReadOnlyList<ItineraryStopDto> Stops
);

/// <summary>
/// Top attraction preview within a district passport.
/// </summary>
public record DistrictTopAttractionDto(
    string Id,
    string Name,
    string Category,
    string CrowdLevel,
    int EstimatedVisitMinutes
);

/// <summary>
/// Tourist passport for one of the 18 administrative districts of Krakow.
/// </summary>
public record DistrictTouristPassportDto(
    int DistrictId,
    string DistrictRoman,
    string DistrictName,
    double DistanceFromMainStationKm,
    int TransitTimeFromStationMinutes,
    string DirectTransitLines,
    int TotalAttractionsCount,
    IReadOnlyList<DistrictTopAttractionDto> TopAttractions
);
