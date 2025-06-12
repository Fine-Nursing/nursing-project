import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import queryKeys from 'src/constants/queryKeys';
import type { CompensationCard } from 'src/types/dashboard';

// API Base URL - 환경변수로 관리하는 것을 추천
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

// API functions
const fetchCompensationCards = async (
  params?: CompensationCardsParams
): Promise<CompensationCard[]> => {
  const { data } = await apiClient.get('/api/dashboard/compensation-cards', {
    params: {
      page: params?.page || 1,
      limit: params?.limit || 20,
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
  queryClient: any,
  params?: CompensationCardsParams
) => {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.compensation.cards(params),
    queryFn: () => fetchCompensationCards(params),
  });
};

export const prefetchCompensationCardsByLevel = async (
  queryClient: any,
  params: CompensationCardsByLevelParams
) => {
  const { experienceLevel, ...filterParams } = params;
  await queryClient.prefetchQuery({
    queryKey: queryKeys.compensation.byLevel(experienceLevel, filterParams),
    queryFn: () => fetchCompensationCardsByLevel(params),
  });
};
