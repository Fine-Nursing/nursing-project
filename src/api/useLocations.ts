import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import queryKeys from 'src/constants/queryKeys';
import type { RegionStates } from 'src/types/location';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface StatesResponse {
  regions: RegionStates;
}

const fetchStates = async (): Promise<RegionStates> => {
  const { data } = await apiClient.get<StatesResponse>('/api/locations/states');
  return data.regions;
};

export const useStates = () =>
  useQuery({
    queryKey: queryKeys.location.states(),
    queryFn: fetchStates,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - states don't change
    gcTime: 1000 * 60 * 60 * 24 * 7, // 1 week
  });

// Prefetch functions for SSR/SSG
export const prefetchStates = async (queryClient: any) => {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.location.states(),
    queryFn: fetchStates,
  });
};

// Helper functions (optional)
export const getAllStates = (regions: RegionStates) =>
  Object.values(regions).flat();

export const getStatesByRegion = (
  regions: RegionStates,
  regionName: keyof RegionStates
) => regions[regionName] || [];

export const findStateByCode = (regions: RegionStates, code: string) => {
  const allStates = getAllStates(regions);
  return allStates.find((state) => state.code === code);
};
