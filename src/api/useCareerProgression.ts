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
      try {
        const { data } = await apiClient.get<CareerProgressionResponse>(
          '/api/profile/career-progression'
        );
        return data.data;
      } catch {
        // 서버 오류 시 임시 데이터 반환
        return {
          totalYears: 5,
          progressionData: [
            { expBracket: '0-1', salary: 60000, isUser: false },
            { expBracket: '1-3', salary: 65000, isUser: false },
            { expBracket: '3-5', salary: 72000, isUser: true },
            { expBracket: '5-10', salary: 80000, isUser: false },
            { expBracket: '10+', salary: 90000, isUser: false },
          ],
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: false, // 서버 오류 시 재시도 안함
  });

export default useCareerProgression;