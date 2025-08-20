import { useQuery, useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import axios from 'axios';
import useAuthStore from 'src/hooks/useAuthStore';

// 직접 AI API 호출
// AI API는 SSL 인증서가 없어서 HTTP 사용 (하드코딩)
const AI_API_BASE_URL = 'http://199.241.139.206:8000';
const AI_API_KEY = process.env.NEXT_PUBLIC_AI_API_KEY || 'zetjam-Hywfek-2hixka-p3r4d6-8v9m3c-v5t7eu-w8y9za-b1c2d3-e4f5g6-h7i8j9-k0l1m2-n3o4p5-q6r7s8-t9u0v1';

// AI Insight 타입 정의
export type SummaryType = 'nurse_summary' | 'culture' | 'skill_transfer';

export interface AiInsight {
  id: string;
  user_id: string;
  summary_type: SummaryType;
  content: string;
  input_hash: string;
  prompt_template_id: string;
  created_at: string;
  updated_at: string;
}

export interface GenerateInsightResponse {
  message: string;
  summary_type: string;
  summary?: string;
  input_hash?: string;
}

// Axios 인스턴스 생성 (직접 AI API 호출)
const aiApiClient = axios.create({
  baseURL: AI_API_BASE_URL,
  headers: {
    'X-API-Key': AI_API_KEY,
    'Content-Type': 'application/json'
  }
});

// AI Insight 조회 (GET)
export const useAiInsight = (summaryType: SummaryType, userId?: string) => useQuery<AiInsight>({
    queryKey: ['aiInsight', summaryType, userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      const response = await aiApiClient.get(`/generate/${summaryType}?user_id=${userId}`);
      return response.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5분
    retry: false // CORS 에러로 재시도 비활성화
  });

// AI Insight 생성/갱신 (POST)
export const useGenerateAiInsight = () => {
  const { user } = useAuthStore();
  
  return useMutation<GenerateInsightResponse, Error, { summaryType: SummaryType }>({
    mutationFn: async ({ summaryType }) => {
      if (!user?.id) throw new Error('User ID is required');
      const response = await aiApiClient.post(`/generate/${summaryType}?user_id=${user.id}`);
      return response.data;
    },
    onError: () => {
      // AI Insight generation failed
    }
  });
};

// 모든 AI Insights 한번에 가져오기
export const useAllAiInsights = (userId?: string) => useQuery({
    queryKey: ['aiInsights', 'all', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      
      try {
        console.log('Calling AI API with userId:', userId);
        // 각 summary type을 개별적으로 호출
        const summaryTypes: SummaryType[] = ['nurse_summary', 'culture', 'skill_transfer'];
        const results = await Promise.allSettled(
          summaryTypes.map(async type => {
            console.log(`Fetching AI insight: ${type}`);
            try {
              // 먼저 GET으로 조회 시도
              const response = await aiApiClient.get(`/generate/${type}?user_id=${userId}`);
              return { type, data: response.data };
            } catch (err: any) {
              // 404인 경우 POST로 생성 시도
              if (err.response?.status === 404) {
                console.log(`${type} not found, generating new insight...`);
                try {
                  const postResponse = await aiApiClient.post(`/generate/${type}?user_id=${userId}`);
                  // POST 성공 후 다시 GET으로 조회
                  const getResponse = await aiApiClient.get(`/generate/${type}?user_id=${userId}`);
                  return { type, data: getResponse.data };
                } catch (postErr) {
                  console.error(`Failed to generate ${type}:`, postErr);
                  throw postErr;
                }
              }
              console.error(`Failed to fetch ${type}:`, err.message);
              throw err;
            }
          })
        );
        
        const insights: Record<SummaryType, AiInsight | null> = {
          nurse_summary: null,
          culture: null,
          skill_transfer: null
        };
        results.forEach((result) => {
          if (result.status === 'fulfilled') {
            const { type, data } = result.value;
            insights[type] = data;
            console.log(`Successfully fetched ${type}`);
          } else {
            console.log(`Failed to fetch insight:`, result.reason);
          }
        });
        
        return insights;
      } catch (error) {
        // CORS 에러나 네트워크 에러 처리
        const axiosError = error as AxiosError;
        console.error('AI API Error:', axiosError.message);
        if (axiosError.code === 'ERR_NETWORK' || axiosError.message?.includes('CORS')) {
          // AI Insights API is not accessible (CORS/Network error)
          return {
            nurse_summary: null,
            culture: null,
            skill_transfer: null
          };
        }
        // 다른 에러도 null 반환하여 앱이 중단되지 않도록
        return {
          nurse_summary: null,
          culture: null,
          skill_transfer: null
        };
      }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    retry: false, // CORS 에러로 재시도 비활성화
    select: (data) => ({
      nurseSummary: data?.nurse_summary || null,
      culture: data?.culture || null,
      skillTransfer: data?.skill_transfer || null,
      isLoading: false,
      errors: {}
    })
  });

// 모든 AI Insights 생성/갱신
export const useGenerateAllInsights = () => {
  const generateInsight = useGenerateAiInsight();

  const generateAll = async () => {
    try {
      const summaryTypes: SummaryType[] = ['nurse_summary', 'culture', 'skill_transfer'];
      
      const results = await Promise.allSettled(
        summaryTypes.map(summaryType => 
          generateInsight.mutateAsync({ summaryType })
        )
      );

      const successes = results.filter(r => r.status === 'fulfilled');
      const failures = results.filter(r => r.status === 'rejected');

      return {
        successes: successes.length,
        failures: failures.length,
        results
      };
    } catch (error) {
      // CORS 에러 무시
      const axiosError = error as AxiosError;
      if (axiosError.code === 'ERR_NETWORK' || axiosError.message?.includes('CORS')) {
        // AI Insights generation skipped (CORS/Network error)
        return {
          successes: 0,
          failures: 3,
          results: []
        };
      }
      throw error;
    }
  };

  return {
    generateAll,
    isLoading: generateInsight.isPending
  };
};