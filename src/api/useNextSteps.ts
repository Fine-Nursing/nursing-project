import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BE_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export interface NextStepsInsight {
  insight: string;
  summary_type: string;
  user_id: string;
}

export const useNextStepsInsight = () => {
  return useQuery<NextStepsInsight>({
    queryKey: ['ai-insights', 'next_steps'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/ai-insights/next_steps');
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};

// NextSteps 컴포넌트에서 사용할 수 있도록 파싱된 데이터를 반환하는 hook
export const useParsedNextSteps = () => {
  const { data, isLoading, error } = useNextStepsInsight();

  // AI 응답을 NextSteps 형식으로 파싱
  const parseNextSteps = (insight: string | undefined) => {
    if (!insight) return { steps: [], opportunity: null };

    // 기본 구조
    const result = {
      steps: [] as string[],
      opportunity: null as { title: string; description: string } | null,
    };

    try {
      // 줄바꿈으로 분리
      const lines = insight.split('\n').filter(line => line.trim());
      
      let isOpportunitySection = false;
      let opportunityTitle = '';
      let opportunityDesc = '';

      lines.forEach(line => {
        // 번호가 매겨진 항목 찾기 (1. 2. 3. 또는 - 로 시작)
        if (/^[0-9]+\./.test(line) || /^-\s/.test(line)) {
          result.steps.push(line.replace(/^[0-9]+\.\s*/, '').replace(/^-\s*/, '').trim());
        }
        // "Opportunity" 섹션 찾기
        else if (line.toLowerCase().includes('opportunity') || line.toLowerCase().includes('upcoming')) {
          isOpportunitySection = true;
          opportunityTitle = line.replace(/[*:]/g, '').trim();
        }
        // Opportunity 설명
        else if (isOpportunitySection && line.trim()) {
          opportunityDesc += line.trim() + ' ';
        }
      });

      if (opportunityTitle && opportunityDesc) {
        result.opportunity = {
          title: opportunityTitle,
          description: opportunityDesc.trim(),
        };
      }

      // 최소 3개의 스텝이 없으면 기본값 사용
      if (result.steps.length < 3) {
        result.steps = [
          'Review your career progression and identify areas for improvement',
          'Explore additional certifications relevant to your specialty',
          'Connect with mentors in your field for career guidance',
        ];
      }

      return result;
    } catch (error) {
      console.error('Failed to parse next steps:', error);
      return {
        steps: [
          'Review your career progression and identify areas for improvement',
          'Explore additional certifications relevant to your specialty',
          'Connect with mentors in your field for career guidance',
        ],
        opportunity: null,
      };
    }
  };

  return {
    data: parseNextSteps(data?.insight),
    isLoading,
    error,
  };
};