import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from 'src/lib/axios';
import toast from 'react-hot-toast';

export interface CareerHistoryItem {
  id: string;
  facility: string;
  role: string;
  specialty: string;
  startDate: Date | string;
  endDate: Date | string | null;
  hourlyRate: number;
}

interface CareerHistoryResponse {
  success: boolean;
  data: CareerHistoryItem[];
}

const useCareerHistory = () =>
  useQuery<CareerHistoryItem[]>({
    queryKey: ['careerHistory'],
    queryFn: async () => {
      const { data } = await apiClient.get<CareerHistoryResponse>(
        '/api/profile/career-history'
      );
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

// Add Career mutation hook
export const useAddCareer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (careerData: any) => {
      const { data } = await apiClient.post('/api/profile/career-history', careerData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['careerHistory'] });
      queryClient.invalidateQueries({ queryKey: ['compensation'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success('Career history added successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to add career history');
    },
  });
};

// Delete Career mutation hook
export const useDeleteCareer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: string) => {
      const { data } = await apiClient.delete(`/api/profile/career-history/${jobId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['careerHistory'] });
      queryClient.invalidateQueries({ queryKey: ['compensation'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success('Career history deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete career history');
    },
  });
};

export default useCareerHistory;