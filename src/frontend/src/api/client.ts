import axios from 'axios';
import type {
  AccessibilityDatasetDto,
  DistrictAccessibilityProfileDto,
  DistrictAtmosphereSummaryDto,
  DistrictComparisonDto,
  DistrictDetailsDto,
  DistrictsGeoJsonCollection,
  DistrictSummaryDto,
  LiveAtmosphereDto,
  PointOfInterestDto,
  QualityWeights,
  SystemHelloDto,
} from '../types/contracts';

// Axios HTTP client configured for Vite dev proxy and production API paths
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Explicit typed contract for the centralized Cracow360 API client.
export interface Cracow360ApiClient {
  getDistricts: (weights?: QualityWeights) => Promise<DistrictSummaryDto[]>;
  getDistrictsMaster?: (weights?: QualityWeights) => Promise<DistrictSummaryDto[]>;
  getDistrictDetails: (id: number) => Promise<DistrictDetailsDto>;
  compareDistricts: (firstId: number, secondId: number, weights?: QualityWeights) => Promise<DistrictComparisonDto>;
  getDistrictsGeoJson: () => Promise<DistrictsGeoJsonCollection>;
  getPois: (params?: { districtId?: number; category?: string; subCategory?: string }) => Promise<PointOfInterestDto[]>;
  getSystemHello: () => Promise<SystemHelloDto>;
  getLiveAtmosphere: (districtId?: number) => Promise<LiveAtmosphereDto>;
  getLiveAtmosphereSummary: () => Promise<DistrictAtmosphereSummaryDto[]>;
  getAccessibilityDataset: () => Promise<AccessibilityDatasetDto>;
  getDistrictAccessibility: (id: number) => Promise<DistrictAccessibilityProfileDto>;
}

// Centralized API client service methods matching backend Minimal API endpoints
export const cracow360Api: Cracow360ApiClient = {
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

  getDistrictsMaster: async (weights?: QualityWeights): Promise<DistrictSummaryDto[]> => {
    return cracow360Api.getDistricts(weights);
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

  // Retrieves live weather, 24h hourly forecast, air quality (AQI, PM10, PM2.5, NO2), UV, and botanical pollen
  getLiveAtmosphere: async (districtId?: number): Promise<LiveAtmosphereDto> => {
    const params = districtId ? { districtId } : undefined;
    const { data } = await apiClient.get<LiveAtmosphereDto>('/live/atmosphere', { params });
    return data;
  },

  // Retrieves compact ambient summary across all 18 districts for tickers and map overlays
  getLiveAtmosphereSummary: async (): Promise<DistrictAtmosphereSummaryDto[]> => {
    const { data } = await apiClient.get<DistrictAtmosphereSummaryDto[]>('/live/atmosphere/summary');
    return data;
  },

  // Retrieves the entire municipal accessibility dataset
  getAccessibilityDataset: async (): Promise<AccessibilityDatasetDto> => {
    const { data } = await apiClient.get<AccessibilityDatasetDto>('/accessibility');
    return data;
  },

  // Retrieves granular accessibility indicators and facility audits for a district
  getDistrictAccessibility: async (id: number): Promise<DistrictAccessibilityProfileDto> => {
    const { data } = await apiClient.get<DistrictAccessibilityProfileDto>(`/accessibility/districts/${id}`);
    return data;
  },
};
