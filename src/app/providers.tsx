'use client';

import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import useAuthStore from 'src/hooks/useAuthStore';
import ErrorBoundary from 'src/components/ErrorBoundary';
import QueryProvider from 'src/lib/QueryProvider';
import { ThemeProvider } from 'src/contexts/ThemeContext';

function AuthInit() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  
  useEffect(() => {
    // 페이지 로드 시 한 번만 인증 상태 확인
    let isMounted = true;
    
    const initAuth = async () => {
      if (isMounted) {
        try {
          await checkAuth();
        } catch {
          // Silent fail on initial auth check
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, [checkAuth]); // checkAuth 의존성 추가

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryProvider>
          <AuthInit />
          {children}
          <Toaster 
          position="bottom-center"
          reverseOrder={false}
          gutter={8}
          containerStyle={{
            bottom: 100, // Above the floating button on mobile
          }}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#1f2937',
              maxWidth: '400px',
              padding: '12px 16px',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              border: '1px solid #e5e7eb',
            },
            success: {
              duration: 3000,
              style: {
                background: '#f0fdf4',
                color: '#166534',
                border: '1px solid #86efac',
              },
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              style: {
                background: '#fef2f2',
                color: '#991b1b',
                border: '1px solid #fca5a5',
              },
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        </QueryProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
