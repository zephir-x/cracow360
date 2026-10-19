using Cracow360.Domain.Enums;

namespace Cracow360.Domain.Entities;

public class PointOfInterest
{
    public string Id { get; set; } = string.Empty;
    public int DistrictId { get; set; }
    public PoiCategory Category { get; set; }
    public PoiSubCategory SubCategory { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public double Lat { get; set; }
    public double Lng { get; set; }
    public PoiMetrics Metrics { get; set; } = new();

    public District? District { get; set; }
}

public class PoiMetrics
{
    public int? Capacity { get; set; }
    public double? AreaHa { get; set; }
    public string AdditionalInfo { get; set; } = string.Empty;
}
