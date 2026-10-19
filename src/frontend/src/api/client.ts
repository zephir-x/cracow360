import axios from 'axios';
import type {
  DistrictComparisonDto,
  DistrictDetailsDto,
  DistrictsGeoJsonCollection,
  DistrictSummaryDto,
  QualityWeights,
  SystemHelloDto,
} from '../types/contracts';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const cracow360Api = {
  getSystemHello: async (): Promise<SystemHelloDto> => {
    const { data } = await apiClient.get<SystemHelloDto>('/system/hello');
    return data;
  },

  getDistricts: async (): Promise<DistrictSummaryDto[]> => {
    const { data } = await apiClient.get<DistrictSummaryDto[]>('/districts');
    return data;
  },

  getDistrictDetails: async (id: number): Promise<DistrictDetailsDto> => {
    const { data } = await apiClient.get<DistrictDetailsDto>(`/districts/${id}`);
    return data;
  },

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
      },
    });
    return data;
  },

  getDistrictsGeoJson: async (): Promise<DistrictsGeoJsonCollection> => {
    const { data } = await apiClient.get<DistrictsGeoJsonCollection>('/districts/geojson');
    return data;
  },
};
