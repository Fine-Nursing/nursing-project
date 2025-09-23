import { useQuery } from '@tanstack/react-query';
import { apiClient } from 'src/lib/axios';

interface WageDistributionResponse {
  payDistributionData: Array<{
    label: string;
    wageValue: number;
    count: number;
    highlight?: boolean;
    isUser?: boolean;
    id: string;
  }>;
  regionalAvgWage: number;
}

interface WageDistributionParams {
  specialty?: string;
  state?: string;
  city?: string;
}

const useWageDistribution = (params?: WageDistributionParams) =>
  useQuery<WageDistributionResponse>({
    queryKey: ['wageDistribution', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.specialty) queryParams.append('specialty', params.specialty);
      if (params?.state) queryParams.append('state', params.state);
      if (params?.city) queryParams.append('city', params.city);

      const { data } = await apiClient.get(
        `/api/dashboard/wage-distribution?${queryParams.toString()}`
      );
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1, // 1번은 재시도
  });

export default useWageDistribution;