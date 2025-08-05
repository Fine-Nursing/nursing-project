import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BE_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export interface UserMetrics {
  totalCompensation: number;
  workload: number;
  experienceLevel: number;
  careerGrowth: number;
  marketCompetitiveness: number;
  [key: string]: number; // 인덱스 시그니처 추가
}

export interface MetricsResponse {
  userMetrics: UserMetrics;
  regionalAverageMetrics: UserMetrics;
}

export const useUserMetrics = () =>
  useQuery<MetricsResponse>({
    queryKey: ['user-metrics'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/dashboard/user-metrics');
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });