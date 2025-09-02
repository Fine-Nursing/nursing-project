import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import WelcomePage from '../../components/features/onboarding/WelcomePage';
import useOnboardingStore from '../../store/onboardingStores';

// 필수 Mock만
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('../../hooks/useAuthStore', () => ({
  default: vi.fn(() => ({
    user: null, // 비로그인 사용자
  })),
}));

vi.mock('react-hot-toast', () => ({
  default: { 
    success: vi.fn(),
  },
}));

function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('WelcomePage - 핵심 로직', () => {
  beforeEach(() => {
    localStorage.clear();
    useOnboardingStore.getState().resetForm();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  test('첫 방문자: Get Started 클릭 → BasicInfo 이동', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <WelcomePage />
      </TestWrapper>
    );

    expect(useOnboardingStore.getState().currentStep).toBe('welcome');
    
    await user.click(screen.getByRole('button', { name: /get started/i }));
    
    expect(useOnboardingStore.getState().currentStep).toBe('basicInfo');
  });

  test('첫 방문자: 기존 세션 UI 표시 안됨', () => {
    render(
      <TestWrapper>
        <WelcomePage />
      </TestWrapper>
    );

    expect(screen.queryByText('Continue')).not.toBeInTheDocument();
    expect(screen.queryByText(/Welcome back/i)).not.toBeInTheDocument();
  });
});