import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from 'src/lib/axios';
import queryKeys from 'src/constants/queryKeys';

interface UpdateProfileData {
  name?: string;
  role?: string;
  specialty?: string;
  education?: string;
  organization?: string;
  location?: string;
  experience?: number;
}

interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data?: {
    name: string;
    role: string;
    specialty: string;
    education: string;
    organization: string;
    location: string;
    experience: string;
  };
}

const updateProfile = async (data: UpdateProfileData): Promise<UpdateProfileResponse> => {
  const response = await apiClient.put<UpdateProfileResponse>('/api/profile/me', data);
  return response.data;
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    // Optimistic update - UI updates immediately
    onMutate: async (newData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.user.me() });

      // Snapshot the previous value
      const previousProfile = queryClient.getQueryData(queryKeys.user.me());

      // Optimistically update to the new value
      queryClient.setQueryData(queryKeys.user.me(), (old: any) => ({
        ...old,
        ...newData,
      }));

      // Return a context object with the snapshotted value
      return { previousProfile };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, newData, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(queryKeys.user.me(), context.previousProfile);
      }
    },
    // Always refetch after error or success to ensure we're in sync with server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.me() });
    },
    onSuccess: (data) => {
      // If server returns updated data, use it to update cache immediately
      if (data?.data) {
        queryClient.setQueryData(queryKeys.user.me(), data.data);
      }
    },
  });
};