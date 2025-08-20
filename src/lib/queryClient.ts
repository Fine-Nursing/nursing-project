import { QueryClient } from '@tanstack/react-query';

// Common Query Client configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Number of automatic retries on error
      retry: (failureCount, error: unknown) => {
        // Do not retry 401, 403, 404 errors
        const axiosError = error as { response?: { status?: number } };
        if (axiosError?.response?.status && [401, 403, 404].includes(axiosError.response.status)) {
          return false;
        }
        // Retry other errors up to 2 times
        return failureCount < 2;
      },
      
      // Retry delay time
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Disable auto refetch on focus (enable individually per query if needed)
      refetchOnWindowFocus: false,
      
      // Disable auto refetch on mount (enable individually per query if needed)
      refetchOnMount: true,
      
      // Default stale time (5 minutes)
      staleTime: 5 * 60 * 1000,
      
      // Default garbage collection time (10 minutes)
      gcTime: 10 * 60 * 1000,
    },
    mutations: {
      // Do not retry mutation errors
      retry: false,
    },
  },
});

// Query debugging in development environment
if (process.env.NODE_ENV === 'development') {
  queryClient.getQueryCache().subscribe((event) => {
    if (event.type === 'updated' && event.action?.type === 'error') {
      // Ignore 404 errors (no data found)
      const error = event.action.error as { response?: { status?: number } };
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