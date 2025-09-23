import { useQuery } from '@tanstack/react-query';
import { apiClient } from 'src/lib/axios';

export interface DifferentialsSummary {
  hourlyRate: number;
  differentials: {
    night: number;
    weekend: number;
    other: number;
  };
  estimatedMonthlyDifferentials: number;
  shiftType: string | null;
  monthlyHours: {
    night: number;
    weekend: number;
    other: number;
  };
}

export const useDifferentialsSummary = () =>
  useQuery<DifferentialsSummary>({
    queryKey: ['differentials-summary'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/profile/differentials-summary');
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });