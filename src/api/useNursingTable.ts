import { keepPreviousData, useQuery } from '@tanstack/react-query';
import queryKeys from 'src/constants/queryKeys';
import type { SortOrder, ExperienceGroup } from 'src/types/common';
import type {
  NursingTableSortBy,
  ShiftType,
  NursingPosition,
} from 'src/types/nursing';
import { apiClient } from 'src/lib/axios';

// API specific types
interface NursingTableMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface NursingTableResponse {
  data: NursingPosition[];
  meta: NursingTableMeta;
}

// API Parameters
interface NursingTableParams {
  page?: number;
  limit?: number;
  sortBy?: NursingTableSortBy;
  sortOrder?: SortOrder;
  states?: string[];
  cities?: string[];
  specialties?: string[];
  experienceGroups?: ExperienceGroup[];
  shiftTypes?: ShiftType[];
  minCompensation?: number;
  maxCompensation?: number;
}

// API function
const fetchNursingTable = async (
  params?: NursingTableParams
): Promise<NursingTableResponse> => {
  // URLSearchParams를 사용하여 파라미터 처리
  const queryParams = new URLSearchParams();

  // 배열 파라미터 처리
  params?.states?.forEach((state) => queryParams.append('states', state));
  params?.cities?.forEach((city) => queryParams.append('cities', city));
  params?.specialties?.forEach((specialty) =>
    queryParams.append('specialties', specialty)
  );
  params?.experienceGroups?.forEach((group) =>
    queryParams.append('experienceGroups', group)
  );
  params?.shiftTypes?.forEach((shift) =>
    queryParams.append('shiftTypes', shift)
  );

  // 단일 파라미터 처리
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
  if (params?.minCompensation) {
    queryParams.append('minCompensation', params.minCompensation.toString());
  }
  if (params?.maxCompensation) {
    queryParams.append('maxCompensation', params.maxCompensation.toString());
  }

  const { data } = await apiClient.get<NursingTableResponse>(
    `/api/nursing-table?${queryParams.toString()}`
  );

  return data;
};

// Custom hook with enhanced options
export const useNursingTable = (
  params?: NursingTableParams,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    cacheTime?: number;
    refetchOnWindowFocus?: boolean;
    refetchOnMount?: boolean;
  }
) =>
  useQuery({
    queryKey: queryKeys.nursing.table(params),
    queryFn: () => fetchNursingTable(params),
    enabled: options?.enabled !== false,
    staleTime: options?.staleTime ?? 1000 * 60 * 5, // 5 minutes default
    gcTime: options?.cacheTime ?? 1000 * 60 * 10, // 10 minutes default
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
    refetchOnMount: options?.refetchOnMount ?? true,
  });

// Prefetch function for SSR/SSG
export const prefetchNursingTable = async (
  queryClient: any,
  params?: NursingTableParams
) => {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.nursing.table(params),
    queryFn: () => fetchNursingTable(params),
  });
};

// Export types for component usage
export type { NursingTableParams, NursingTableResponse, NursingTableMeta };
