import axios from 'axios';
import type {
  AccessibilityDatasetDto,
  DistrictAccessibilityProfileDto,
  DistrictAtmosphereSummaryDto,
  DistrictComparisonDto,
  DistrictDetailsDto,
  DistrictsGeoJsonCollection,
  DistrictSummaryDto,
  DistrictTouristPassportDto,
  LiveAtmosphereDto,
  OvertourismAlternativeDto,
  PointOfInterestDto,
  QualityWeights,
  SystemHelloDto,
  ThematicItineraryDto,
  TourismAttractionDto,
  TourismDatasetDto,
  WawelekAssistantMetadataDto,
  WawelekChatRequestDto,
  WawelekChatResponseDto,
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
  getTourismDataset: () => Promise<TourismDatasetDto>;
  getCuratedAttractions: (params?: { districtId?: number; category?: string; crowdLevel?: string }) => Promise<TourismAttractionDto[]>;
  getOvertourismAlternatives: () => Promise<OvertourismAlternativeDto[]>;
  getThematicItineraries: (params?: { targetHours?: number; theme?: string }) => Promise<ThematicItineraryDto[]>;
  getDistrictTouristPassport: (id: number) => Promise<DistrictTouristPassportDto>;
  getWawelekMetadata: () => Promise<WawelekAssistantMetadataDto>;
  sendWawelekMessage: (payload: WawelekChatRequestDto) => Promise<WawelekChatResponseDto>;
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

  // Retrieves deep analytical indicators, full metrics set and history for a single district
  getDistrictDetails: async (id: number): Promise<DistrictDetailsDto> => {
    const { data } = await apiClient.get<DistrictDetailsDto>(`/districts/${id}`);
    return data;
  },

  // Performs pairwise district comparison across all 8 quality dimensions
  compareDistricts: async (
    firstId: number,
    secondId: number,
    weights?: QualityWeights
  ): Promise<DistrictComparisonDto> => {
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
    const { data } = await apiClient.get<DistrictComparisonDto>(`/districts/compare/${firstId}/${secondId}`, { params });
    return data;
  },

  // Retrieves official WGS84 GeoJSON polygons for all 18 Krakow administrative districts
  getDistrictsGeoJson: async (): Promise<DistrictsGeoJsonCollection> => {
    const { data } = await apiClient.get<DistrictsGeoJsonCollection>('/districts/geojson');
    return data;
  },

  // Retrieves Points of Interest with optional spatial and category filters
  getPois: async (params?: {
    districtId?: number;
    category?: string;
    subCategory?: string;
  }): Promise<PointOfInterestDto[]> => {
    const { data } = await apiClient.get<PointOfInterestDto[]>('/pois', { params });
    return data;
  },

  // System diagnostic handshake endpoint
  getSystemHello: async (): Promise<SystemHelloDto> => {
    const { data } = await apiClient.get<SystemHelloDto>('/system/hello');
    return data;
  },

  // Retrieves real-time weather and air quality for a selected district or City Hall baseline
  getLiveAtmosphere: async (districtId?: number): Promise<LiveAtmosphereDto> => {
    const { data } = await apiClient.get<LiveAtmosphereDto>('/live/atmosphere', {
      params: districtId ? { districtId } : undefined,
    });
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

  // Retrieves the complete municipal tourism exploration dataset
  getTourismDataset: async (): Promise<TourismDatasetDto> => {
    const { data } = await apiClient.get<TourismDatasetDto>('/tourism');
    return data;
  },

  // Retrieves curated municipal attractions with optional filtering
  getCuratedAttractions: async (params?: {
    districtId?: number;
    category?: string;
    crowdLevel?: string;
  }): Promise<TourismAttractionDto[]> => {
    const { data } = await apiClient.get<TourismAttractionDto[]>('/tourism/attractions', { params });
    return data;
  },

  // Retrieves overtourism alleviation pairs
  getOvertourismAlternatives: async (): Promise<OvertourismAlternativeDto[]> => {
    const { data } = await apiClient.get<OvertourismAlternativeDto[]>('/tourism/alternatives');
    return data;
  },

  // Retrieves multi-step thematic itineraries
  getThematicItineraries: async (params?: {
    targetHours?: number;
    theme?: string;
  }): Promise<ThematicItineraryDto[]> => {
    const { data } = await apiClient.get<ThematicItineraryDto[]>('/tourism/itineraries', { params });
    return data;
  },

  // Retrieves tourist passport for a specific district
  getDistrictTouristPassport: async (id: number): Promise<DistrictTouristPassportDto> => {
    const { data } = await apiClient.get<DistrictTouristPassportDto>(`/tourism/districts/${id}`);
    return data;
  },

  // Retrieves Wawelek AI Assistant readiness and tab-aware starter prompts
  getWawelekMetadata: async (): Promise<WawelekAssistantMetadataDto> => {
    const { data } = await apiClient.get<WawelekAssistantMetadataDto>('/assistant/metadata');
    return data;
  },

  // Sends a conversational prompt to the Wawelek AI Assistant (extended 35s timeout for LLM inference)
  sendWawelekMessage: async (payload: WawelekChatRequestDto): Promise<WawelekChatResponseDto> => {
    const { data } = await apiClient.post<WawelekChatResponseDto>('/assistant/chat', payload, {
      timeout: 38000,
    });
    return data;
  },
};
