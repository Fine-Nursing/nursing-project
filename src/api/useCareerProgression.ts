import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_BE_URL || 'http://localhost:3000';

// Axios instance with credentials
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

interface CareerProgressionData {
  totalYears: number;
  progressionData: Array<{
    expBracket: string;
    salary: number;
    isUser: boolean;
  }>;
}

interface CareerProgressionResponse {
  success: boolean;
  data: CareerProgressionData;
}

const useCareerProgression = () =>
  useQuery<CareerProgressionData>({
    queryKey: ['career-progression'],
    queryFn: async () => {
      const { data } = await apiClient.get<CareerProgressionResponse>(
        '/api/profile/career-progression'
      );
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

export default useCareerProgression;