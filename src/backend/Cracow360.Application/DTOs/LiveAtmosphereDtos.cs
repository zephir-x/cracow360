namespace Cracow360.Application.DTOs;

/// <summary>
/// Consolidated real-time atmospheric and air quality telemetry for Krakow and its 18 districts.
/// Ingested periodically from Open-Meteo European Weather & CAMS/GIOS Air Quality monitoring engines.
/// </summary>
public record LiveAtmosphereDto(
    int DistrictId,
    string DistrictRoman,
    string DistrictName,
    DateTime MeasuredAtUtc,
    DateTime CachedUntilUtc,
    CurrentWeatherDto CurrentWeather,
    CurrentAirQualityDto CurrentAirQuality,
    IReadOnlyList<HourlyAtmospherePointDto> HourlyForecast24H,
    HealthRecommendationsDto Recommendations,
    string DataSource
);

/// <summary>
/// High-level ambient summary for the compact top ticker bar.
/// </summary>
public record DistrictAtmosphereSummaryDto(
    int DistrictId,
    string DistrictRoman,
    string DistrictName,
    double TemperatureC,
    double ApparentTemperatureC,
    int WeatherCode,
    string WeatherLabel,
    int EuropeanAqi,
    string AqiLevelName,
    string AqiColorHex,
    double WindSpeedKmh,
    int PrecipitationProbabilityPct,
    double Pm25UgM3,
    double Pm10UgM3
);

/// <summary>
/// Real-time meteorological readings for a specific district.
/// </summary>
public record CurrentWeatherDto(
    double TemperatureC,
    double ApparentTemperatureC,
    int RelativeHumidityPct,
    int WeatherCode,
    string WeatherLabel,
    double PrecipitationMm,
    double RainMm,
    double SnowfallCm,
    double WindSpeedKmh,
    int WindDirectionDegrees,
    int CloudCoverPct,
    bool IsDay
);

/// <summary>
/// Real-time particulate matter, toxic gases, UV radiation, and active botanical pollen levels.
/// </summary>
public record CurrentAirQualityDto(
    int EuropeanAqi,
    string AqiLevelName,
    string AqiColorHex,
    double Pm10UgM3,
    double Pm25UgM3,
    double NitrogenDioxideUgM3,
    double UvIndex,
    PollenLevelsDto Pollen
);

/// <summary>
/// Active seasonal botanical allergens (grains/m³).
/// </summary>
public record PollenLevelsDto(
    double GrassPollen,
    double BirchPollen,
    double AlderPollen,
    double MugwortPollen,
    double RagweedPollen
);

/// <summary>
/// Hourly forecast point for the 24-hour interactive distribution chart.
/// </summary>
public record HourlyAtmospherePointDto(
    string TimeIso,
    string HourLabel,
    double TemperatureC,
    int PrecipitationProbabilityPct,
    double PrecipitationMm,
    double SnowfallCm,
    double WindSpeedKmh,
    int WeatherCode
);

/// <summary>
/// Contextual health guidelines and civic warnings based on atmospheric and air quality thresholds.
/// Ported from the Krakow open-data evaluation engine.
/// </summary>
public record HealthRecommendationsDto(
    HealthAdviceItemDto Uv,
    HealthAdviceItemDto OutdoorSport,
    HealthAdviceItemDto TrafficExhaust,
    HealthAdviceItemDto Allergens,
    HealthAdviceItemDto SensitiveGroups
);

/// <summary>
/// Granular health recommendation item with severity level and civic message.
/// </summary>
public record HealthAdviceItemDto(
    string Level, // "safe", "moderate", "warning", "danger"
    string ShortLabel,
    string Message
);
