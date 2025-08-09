import { QueryClient } from '@tanstack/react-query';

// 공통 Query Client 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 에러 발생 시 자동 재시도 횟수
      retry: (failureCount, error: any) => {
        // 401, 403, 404 에러는 재시도하지 않음
        if (error?.response?.status && [401, 403, 404].includes(error.response.status)) {
          return false;
        }
        // 다른 에러는 최대 2번 재시도
        return failureCount < 2;
      },
      
      // 재시도 지연 시간
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // 포커스 시 자동 리페치 비활성화 (필요시 개별 쿼리에서 활성화)
      refetchOnWindowFocus: false,
      
      // 마운트 시 자동 리페치 비활성화 (필요시 개별 쿼리에서 활성화)
      refetchOnMount: true,
      
      // 스테일 타임 기본값 (5분)
      staleTime: 5 * 60 * 1000,
      
      // 가비지 컬렉션 타임 기본값 (10분)
      gcTime: 10 * 60 * 1000,
    },
    mutations: {
      // 뮤테이션 에러는 재시도하지 않음
      retry: false,
    },
  },
});

// 개발 환경에서 쿼리 디버깅
if (process.env.NODE_ENV === 'development') {
  queryClient.getQueryCache().subscribe((event) => {
    if (event.type === 'updated' && event.action?.type === 'error') {
      // Ignore 404 errors (no data found)
      const error = event.action.error as any;
      if (error?.response?.status === 404) return;
      
      // eslint-disable-next-line no-console
      console.error('Query Error:', {
        queryKey: event.query.queryKey,
        error: event.action.error,
      });
    }
  });
}

export default queryClient;