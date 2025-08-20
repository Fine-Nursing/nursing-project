import type { QueryClient } from '@tanstack/react-query';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import queryKeys from 'src/constants/queryKeys';
import type {
  SpecialtyCompensation,
  CompensationSortBy,
} from 'src/types/specialty';
import type { ExperienceGroup, SortOrder } from 'src/types/common';
import { apiClient } from 'src/lib/axios';

// API parameters
interface SpecialtyCompensationParams {
  states?: string[];
  experienceGroups?: ExperienceGroup[];
  search?: string;
  limit?: number;
  sortBy?: CompensationSortBy;
  sortOrder?: SortOrder;
}

// API response - modify according to actual response

interface SpecialtyListResponse {
  specialties: string[];
}

// API functions
const fetchSpecialtyAverageCompensation = async (
  params?: SpecialtyCompensationParams
): Promise<SpecialtyCompensation[]> => {
  // Handle array parameters using URLSearchParams
  const queryParams = new URLSearchParams();

  // Handle array parameters - format: states=NY&states=CA
  params?.states?.forEach((state) => queryParams.append('states', state));
  params?.experienceGroups?.forEach((group) =>
    queryParams.append('experienceGroups', group)
  );

  // Handle single parameters
  if (params?.search) queryParams.append('search', params.search);
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  const { data } = await apiClient.get<{ data: SpecialtyCompensation[] }>(
    `/api/specialties/average-compensation?${queryParams.toString()}`
  );

  // Return data field from API response
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
    refetchOnWindowFocus: false, // Do not refetch on window focus
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
  queryClient: QueryClient,
  params?: SpecialtyCompensationParams
) => {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.specialty.averageCompensation(params),
    queryFn: () => fetchSpecialtyAverageCompensation(params),
  });
};

export const prefetchSpecialtyList = async (
  queryClient: QueryClient,
  search?: string
) => {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.specialty.list(search),
    queryFn: () => fetchSpecialtyList(search),
  });
};

// Export types for component usage
export type { SpecialtyCompensationParams };
