import { useQuery } from '@tanstack/react-query';
import { apiClient } from 'src/lib/axios';

export interface UserMetrics {
  pay: number;
  hospitalQuality: number;
  hospitalCulture: number;
  growthOpportunities: number;
  benefits: number;
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