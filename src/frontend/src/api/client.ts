import axios from 'axios';
import type { DistrictSummaryDto, SystemHelloDto } from '../types/contracts';

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
};
