import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_BE_URL || 'http://localhost:3000';

// Axios instance with credentials
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

interface WageDistributionResponse {
  payDistributionData: Array<{
    label: string;
    wageValue: number;
    count: number;
    highlight?: boolean;
    isUser?: boolean;
    id: string;
  }>;
  regionalAvgWage: number;
}

interface WageDistributionParams {
  specialty?: string;
  state?: string;
  city?: string;
}

export const useWageDistribution = (params?: WageDistributionParams) => {
  return useQuery<WageDistributionResponse>({
    queryKey: ['wageDistribution', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.specialty) queryParams.append('specialty', params.specialty);
      if (params?.state) queryParams.append('state', params.state);
      if (params?.city) queryParams.append('city', params.city);

      const { data } = await apiClient.get(
        `/api/dashboard/wage-distribution?${queryParams.toString()}`
      );
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};