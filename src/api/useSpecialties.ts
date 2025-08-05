import { keepPreviousData, useQuery } from '@tanstack/react-query';
import queryKeys from 'src/constants/queryKeys';
import type {
  SpecialtyCompensation,
  CompensationSortBy,
} from 'src/types/specialty';
import type { ExperienceGroup, SortOrder } from 'src/types/common';
import { apiClient } from 'src/lib/axios';

// API 파라미터
interface SpecialtyCompensationParams {
  states?: string[];
  experienceGroups?: ExperienceGroup[];
  search?: string;
  limit?: number;
  sortBy?: CompensationSortBy;
  sortOrder?: SortOrder;
}

// API 응답 - 실제 응답에 맞게 수정

interface SpecialtyListResponse {
  specialties: string[];
}

// API functions
const fetchSpecialtyAverageCompensation = async (
  params?: SpecialtyCompensationParams
): Promise<SpecialtyCompensation[]> => {
  // URLSearchParams를 사용하여 배열 파라미터 처리
  const queryParams = new URLSearchParams();

  // 배열 파라미터 처리 - states=NY&states=CA 형식
  params?.states?.forEach((state) => queryParams.append('states', state));
  params?.experienceGroups?.forEach((group) =>
    queryParams.append('experienceGroups', group)
  );

  // 단일 파라미터 처리
  if (params?.search) queryParams.append('search', params.search);
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  const { data } = await apiClient.get<{ data: SpecialtyCompensation[] }>(
    `/api/specialties/average-compensation?${queryParams.toString()}`
  );

  // API 응답의 data 필드 반환
  return data.data;
};

const fetchSpecialtyList = async (search?: string): Promise<string[]> => {
  const { data } = await apiClient.get<SpecialtyListResponse>(
    '/api/specialties/list',
    { params: { search } }
  );

  return data.specialties;
};

// Custom hooks
export const useSpecialtyAverageCompensation = (
  params?: SpecialtyCompensationParams,
  options?: {
    enabled?: boolean;
  }
) =>
  useQuery({
    queryKey: queryKeys.specialty.averageCompensation(params),
    queryFn: () => fetchSpecialtyAverageCompensation(params),
    enabled: options?.enabled !== false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false, // 창 포커스 시 재요청 안함
  });

export const useSpecialtyList = (search?: string) =>
  useQuery({
    queryKey: queryKeys.specialty.list(search),
    queryFn: () => fetchSpecialtyList(search),
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });

// Prefetch functions for SSR/SSG
export const prefetchSpecialtyAverageCompensation = async (
  queryClient: any,
  params?: SpecialtyCompensationParams
) => {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.specialty.averageCompensation(params),
    queryFn: () => fetchSpecialtyAverageCompensation(params),
  });
};

export const prefetchSpecialtyList = async (
  queryClient: any,
  search?: string
) => {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.specialty.list(search),
    queryFn: () => fetchSpecialtyList(search),
  });
};

// Export types for component usage
export type { SpecialtyCompensationParams };
