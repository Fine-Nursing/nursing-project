'use client';

import { useEffect } from 'react';
import useAuthStore from 'src/components/AuthInitializer';
import JotaiProvider from 'src/lib/JotaiProvider';
import QueryProvider from 'src/lib/QueryPrivider';

function AuthInit() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <JotaiProvider>
        <AuthInit />
        {children}
      </JotaiProvider>
    </QueryProvider>
  );
}
