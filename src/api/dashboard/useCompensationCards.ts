import type { QueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import queryKeys from 'src/constants/queryKeys';
import type { CompensationCard } from 'src/types/dashboard';
import { apiClient } from 'src/lib/axios';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Query parameters interface
interface CompensationCardsParams {
  specialty?: string;
  state?: string;
  city?: string;
  page?: number;
  limit?: number;
}

interface CompensationCardsByLevelParams extends CompensationCardsParams {
  experienceLevel: 'beginner' | 'junior' | 'experienced' | 'senior';
}

// API functions 수정
const fetchCompensationCards = async (
  params?: CompensationCardsParams
): Promise<CompensationCard[]> => {
  const { data } = await apiClient.get('/api/dashboard/compensation-cards', {
    params: {
      // page와 limit 제거! 이 엔드포인트는 페이지네이션 없음
      specialty: params?.specialty,
      state: params?.state,
      city: params?.city,
    },
  });
  // 배열을 직접 반환
  return Array.isArray(data) ? data : data.data || [];
};

const fetchCompensationCardsByLevel = async (
  params: CompensationCardsByLevelParams
): Promise<PaginatedResponse<CompensationCard>> => {
  const { experienceLevel, ...queryParams } = params;
  const { data } = await apiClient.get(
    `/api/dashboard/compensation-cards/${experienceLevel}`,
    {
      params: {
        page: queryParams.page || 1,
        limit: queryParams.limit || 20,
        specialty: queryParams.specialty,
        state: queryParams.state,
        city: queryParams.city,
      },
    }
  );
  return data;
};

// Custom hooks
export const useCompensationCards = (params?: CompensationCardsParams) =>
  useQuery({
    queryKey: queryKeys.compensation.cards(params),
    queryFn: () => fetchCompensationCards(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
  });

export const useCompensationCardsByLevel = (
  params: CompensationCardsByLevelParams,
  options?: {
    enabled?: boolean;
  }
) => {
  const { experienceLevel, ...filterParams } = params;
  return useQuery({
    queryKey: queryKeys.compensation.byLevel(experienceLevel, filterParams),
    queryFn: () => fetchCompensationCardsByLevel(params),
    enabled: options?.enabled !== false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Optional: Prefetch functions for SSR/SSG
export const prefetchCompensationCards = async (
  queryClient: QueryClient,
  params?: CompensationCardsParams
) => {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.compensation.cards(params),
    queryFn: () => fetchCompensationCards(params),
  });
};

export const prefetchCompensationCardsByLevel = async (
  queryClient: QueryClient,
  params: CompensationCardsByLevelParams
) => {
  const { experienceLevel, ...filterParams } = params;
  await queryClient.prefetchQuery({
    queryKey: queryKeys.compensation.byLevel(experienceLevel, filterParams),
    queryFn: () => fetchCompensationCardsByLevel(params),
  });
};
