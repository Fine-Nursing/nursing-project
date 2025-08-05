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

export const useDifferentialsSummary = () => {
  return useQuery<DifferentialsSummary>({
    queryKey: ['differentials-summary'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/profile/differentials-summary');
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};