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

export default useCareerHistory;