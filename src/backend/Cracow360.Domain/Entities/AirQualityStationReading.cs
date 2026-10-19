namespace Cracow360.Domain.Entities;

public class AirQualityStationReading
{
    public int Id { get; set; }
    public int StationId { get; set; }
    public string StationName { get; set; } = string.Empty;
    public double? Pm10 { get; set; }
    public double? Pm25 { get; set; }
    public int? CaqiIndexLevel { get; set; }
    public string IndexLevelName { get; set; } = "Brak danych";
    public DateTime MeasuredAtUtc { get; set; }
}
