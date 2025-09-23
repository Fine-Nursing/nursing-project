import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from 'src/lib/axios';
import queryKeys from 'src/constants/queryKeys';

interface UpdateCompensationData {
  basePay?: number;
  basePayUnit?: 'hourly' | 'yearly';
  shiftHours?: number;
  differentials?: {
    type: string;
    value: number;
    frequency: number;
  }[];
}

interface UpdateCompensationResponse {
  success: boolean;
  message: string;
  data?: {
    basePay: number;
    basePayUnit: string;
    differentials: {
      type: string;
      value: number;
      frequency: number;
    }[];
  };
}

const updateCompensation = async (data: UpdateCompensationData): Promise<UpdateCompensationResponse> => {
  // Clean the data before sending to remove any null bytes
  const cleanedData = {
    ...data,
    differentials: data.differentials?.map(diff => ({
      type: diff.type
        .replace(/\x00/g, '') // Remove null bytes
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
        .trim(),
      value: Number(diff.value) || 0,
      frequency: Number(diff.frequency) || 1,
    })).filter(d => d.type && d.type.length > 0),
  };

  const response = await apiClient.put<UpdateCompensationResponse>('/api/profile/compensation', cleanedData);
  return response.data;
};

export const useUpdateCompensation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCompensation,
    // Optimistic update - UI updates immediately
    onMutate: async (newData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.user.me() });

      // Snapshot the previous value
      const previousProfile = queryClient.getQueryData(queryKeys.user.me());

      // Optimistically update to the new value
      queryClient.setQueryData(queryKeys.user.me(), (old: any) => ({
        ...old,
        // Update compensation related fields if they exist in the user profile
        ...(newData.basePay !== undefined && { basePay: newData.basePay }),
        ...(newData.basePayUnit !== undefined && { basePayUnit: newData.basePayUnit }),
        ...(newData.differentials !== undefined && { differentials: newData.differentials }),
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
      queryClient.invalidateQueries({ queryKey: queryKeys.user.compensation() });
      // Also invalidate compensation-specific queries if they exist
      queryClient.invalidateQueries({ queryKey: ['profile', 'compensation'] });
    },
    onSuccess: (data) => {
      // If server returns updated data, use it to update cache immediately
      if (data?.data) {
        queryClient.setQueryData(queryKeys.user.me(), (old: any) => ({
          ...old,
          basePay: data.data?.basePay,
          basePayUnit: data.data?.basePayUnit,
          differentials: data.data?.differentials,
        }));

        // Also update compensation cache to reflect changes immediately
        queryClient.setQueryData(queryKeys.user.compensation(), (old: any) => ({
          ...old,
          baseHourlyRate: data.data?.basePay,
          // The backend should recalculate these values
        }));
      }

      // Force refetch to get updated calculated values from backend
      queryClient.invalidateQueries({ queryKey: queryKeys.user.compensation() });
    },
  });
};