namespace Cracow360.Domain.Entities;

/// <summary>
/// Domain entity storing historical and near-real-time air quality telemetry
/// captured by the background service from GIOŚ monitoring stations in Krakow.
/// </summary>
public class AirQualityStationReading
{
    // Auto-increment primary key
    public int Id { get; set; }

    // Official GIOŚ station identifier
    public int StationId { get; set; }

    // Official station location name (e.g. "Kraków, Aleje Krasińskiego", "Kraków, ul. Dietla")
    public string StationName { get; set; } = string.Empty;

    // PM10 particulate matter concentration in µg/m³
    public double? Pm10 { get; set; }

    // PM2.5 fine particulate matter concentration in µg/m³
    public double? Pm25 { get; set; }

    // Numeric European Air Quality Index (CAQI) level
    public int? CaqiIndexLevel { get; set; }

    // Descriptive air quality index label (e.g. "Very good", "Moderate", "Bad")
    public string IndexLevelName { get; set; } = "No data";

    // Measurement timestamp in UTC
    public DateTime MeasuredAtUtc { get; set; }
}
