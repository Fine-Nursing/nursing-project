'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useState } from 'react';
import queryClient from './queryClient';

export default function QueryProvider({ children }: { children: ReactNode }) {
  // Use shared queryClient instance
  const [client] = useState(() => queryClient);

  return (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}
