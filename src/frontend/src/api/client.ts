import axios from 'axios';
import type {
  DistrictComparisonDto,
  DistrictDetailsDto,
  DistrictsGeoJsonCollection,
  DistrictSummaryDto,
  PointOfInterestDto,
  QualityWeights,
  SystemHelloDto,
} from '../types/contracts';

// Axios HTTP client configured for Vite dev proxy and production API paths
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Centralized API client service methods matching backend Minimal API endpoints
export const cracow360Api = {
  // Retrieves list of districts with calculated Quality of Life index (supports optional custom weights)
  getDistricts: async (weights?: QualityWeights): Promise<DistrictSummaryDto[]> => {
    const params = weights
      ? {
          mobilityWeight: weights.mobility,
          educationWeight: weights.education,
          greeneryWeight: weights.greenery,
          cultureWeight: weights.culture,
          environmentWeight: weights.environment,
          safetyWeight: weights.safety,
          housingAffordabilityWeight: weights.housingAffordability,
        }
      : undefined;
    const { data } = await apiClient.get<DistrictSummaryDto[]>('/districts', { params });
    return data;
  },

  // Retrieves full granular metrics and 2028 forecasts for a specific district
  getDistrictDetails: async (id: number): Promise<DistrictDetailsDto> => {
    const { data } = await apiClient.get<DistrictDetailsDto>(`/districts/${id}`);
    return data;
  },

  // Compares two districts side-by-side with calculated index and metric deltas across all 8 pillars
  compareDistricts: async (
    firstId: number,
    secondId: number,
    weights?: QualityWeights
  ): Promise<DistrictComparisonDto> => {
    const { data } = await apiClient.get<DistrictComparisonDto>('/districts/compare', {
      params: {
        firstId,
        secondId,
        mobilityWeight: weights?.mobility ?? 5,
        educationWeight: weights?.education ?? 5,
        greeneryWeight: weights?.greenery ?? 5,
        cultureWeight: weights?.culture ?? 5,
        environmentWeight: weights?.environment ?? 5,
        safetyWeight: weights?.safety ?? 5,
        housingAffordabilityWeight: weights?.housingAffordability ?? 5,
      },
    });
    return data;
  },

  // Retrieves the official vector boundaries (GeoJSON FeatureCollection) of all 18 Krakow districts
  getDistrictsGeoJson: async (): Promise<DistrictsGeoJsonCollection> => {
    const { data } = await apiClient.get<DistrictsGeoJsonCollection>('/districts/geojson');
    return data;
  },

  // Queries geocoded municipal Points of Interest with optional district and category filters
  getPois: async (params?: {
    districtId?: number;
    category?: string;
    subCategory?: string;
  }): Promise<PointOfInterestDto[]> => {
    const { data } = await apiClient.get<PointOfInterestDto[]>('/pois', { params });
    return data;
  },

  // Retrieves runtime health, database connection, and seeded entities diagnostic status
  getSystemHello: async (): Promise<SystemHelloDto> => {
    const { data } = await apiClient.get<SystemHelloDto>('/system/hello');
    return data;
  },
};
