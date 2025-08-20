// src/hooks/api/useCompensationApi.ts
import type { QueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import axiosApiClient from 'src/lib/axios';
import queryKeys from 'src/constants/queryKeys';

// Types
interface Differentials {
  night: number;
  weekend: number;
  other: number;
}

interface CompensationData {
  hourlyRate: number;
  annualSalary: number;
  differentials: Differentials;
}

interface CompensationResponse {
  success: boolean;
  data: CompensationData;
}

// API function
const fetchMyCompensation = async (): Promise<CompensationData> => {
  const { data } = await axiosApiClient.get<CompensationResponse>(
    '/api/profile/compensation'
  );

  if (!data.success || !data.data) {
    throw new Error('Failed to fetch compensation data');
  }

  return data.data;
};

// Custom hook
export const useMyCompensation = () =>
  useQuery({
    queryKey: queryKeys.user.compensation(), // queryKeys에 추가했으므로 이제 사용 가능
    queryFn: fetchMyCompensation,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
  });

// Optional: Prefetch function for SSR/SSG
export const prefetchMyCompensation = async (queryClient: QueryClient) => {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.user.compensation(),
    queryFn: fetchMyCompensation,
  });
};
