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

export type SummaryType = 'career' | 'compensation' | 'growth' | 'skills' | 'market';

interface AiInsight {
  insight: string;
  summary_type: string;
  user_id: string;
  created_at?: string;
}

interface AllInsights {
  career: string;
  compensation: string;
  growth: string;
  skills: string;
  market: string;
}

// 특정 타입의 인사이트 가져오기
export const useAiInsight = (summaryType: SummaryType) => {
  return useQuery<AiInsight>({
    queryKey: ['ai-insight', summaryType],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/ai-insights/${summaryType}`);
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    retry: 1,
  });
};

// 모든 인사이트 가져오기
export const useAllAiInsights = () => {
  return useQuery<AllInsights>({
    queryKey: ['ai-insights-all'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/ai-insights/all');
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    retry: 1,
  });
};

// 인사이트 재생성
export const useGenerateInsight = () => {
  return async (summaryType: SummaryType) => {
    const { data } = await apiClient.post(`/api/ai-insights/${summaryType}`);
    return data.data;
  };
};