// src/hooks/api/useProfileApi.ts
import { useQuery } from '@tanstack/react-query';
import axiosApiClient from 'src/lib/axios';

import queryKeys from 'src/constants/queryKeys';

// Types
interface UserProfileData {
  name: string;
  role: string;
  specialty: string;
  education: string;
  organization: string;
  location: string;
  experience: string;
}

interface UserProfileResponse {
  success: boolean;
  data: UserProfileData;
}

// API function
const fetchMyProfile = async (): Promise<UserProfileData> => {
  const { data } = await axiosApiClient.get<UserProfileResponse>('/api/profile/me');

  if (!data.success || !data.data) {
    throw new Error('Failed to fetch profile data');
  }

  return data.data;
};

// Custom hook
export const useMyProfile = () =>
  useQuery({
    queryKey: queryKeys.user.me(),
    queryFn: fetchMyProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
  });

// Optional: Prefetch function for SSR/SSG
export const prefetchMyProfile = async (queryClient: any) => {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.user.me(),
    queryFn: fetchMyProfile,
  });
};
