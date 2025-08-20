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

const useWageDistribution = (params?: WageDistributionParams) =>
  useQuery<WageDistributionResponse>({
    queryKey: ['wageDistribution', params],
    queryFn: async () => {
      try {
        const queryParams = new URLSearchParams();
        if (params?.specialty) queryParams.append('specialty', params.specialty);
        if (params?.state) queryParams.append('state', params.state);
        if (params?.city) queryParams.append('city', params.city);

        const { data } = await apiClient.get(
          `/api/dashboard/wage-distribution?${queryParams.toString()}`
        );
        return data;
      } catch {
        // 서버 오류 시 임시 데이터 반환
        return {
          payDistributionData: [
            { label: '$25-30', wageValue: 27, count: 15, id: '1' },
            { label: '$30-35', wageValue: 32, count: 35, id: '2' },
            { label: '$35-40', wageValue: 37, count: 45, isUser: true, id: '3' },
            { label: '$40-45', wageValue: 42, count: 30, id: '4' },
            { label: '$45-50', wageValue: 47, count: 20, id: '5' },
            { label: '$50+', wageValue: 52, count: 10, id: '6' },
          ],
          regionalAvgWage: 37.5,
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: false, // 서버 오류 시 재시도 안함
  });

export default useWageDistribution;