import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BasicInfoForm from '../../components/features/onboarding/BasicInfoForm';
import useOnboardingStore from '../../store/onboardingStores';

// 필수 Mock
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn() },
}));

// 타이핑 효과 즉시 완료
vi.mock('../../components/features/onboarding/components/EnhancedTypingEffect', () => ({
  default: function EnhancedTypingEffect({ text, onComplete }: any) {
    React.useEffect(() => onComplete?.(), [onComplete]);
    return <span>{text}</span>;
  }
}));

// Helper function (hoisting 문제 해결)
async function completeAllQuestions(user: any) {
  await user.type(screen.getByRole('textbox'), '김간호');
  await user.keyboard('{Enter}');
  
  await waitFor(() => screen.getByText("Bachelor's Degree"));
  await user.click(screen.getByText("Bachelor's Degree"));
  
  await waitFor(() => screen.getByText('Registered Nurse (RN)'));
  await user.click(screen.getByText('Registered Nurse (RN)'));
  
  await waitFor(() => screen.getByRole('spinbutton'));
  await user.type(screen.getByRole('spinbutton'), '5');
}

// 실제 API 호출을 위해 fetch Mock 없음

// 실제 API 사용 (Mock 제거)
function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('BasicInfoForm - 실제 API 연동', () => {
  let tempUserId: string;

  beforeEach(async () => {
    useOnboardingStore.getState().resetForm();
    useOnboardingStore.getState().setStep('basicInfo');
    vi.clearAllMocks();
    
    // 환경변수 설정
    process.env.NEXT_PUBLIC_BE_URL = 'http://localhost:3000';
    
    // 실제 임시 사용자 생성
    const initResponse = await fetch('http://localhost:3000/api/onboarding/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({})
    });
    
    const initResult = await initResponse.json();
    tempUserId = initResult.tempUserId;
    useOnboardingStore.getState().setTempUserId(tempUserId);
    
    // localStorage에도 설정 (Hook에서 사용)
    localStorage.setItem('onboarding_session', JSON.stringify({
      tempUserId,
      sessionId: initResult.sessionId,
      startedAt: new Date().toISOString()
    }));
    
    // 테스트용 tempUserId 설정 완료
  });

  afterEach(() => {
    cleanup();
  });

  test('Q&A 진행: 입력 → Store 저장 → 다음 질문', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <BasicInfoForm />
      </TestWrapper>
    );

    // Q1: 이름
    await user.type(screen.getByRole('textbox'), '김간호');
    expect(useOnboardingStore.getState().formData.name).toBe('김간호');
    await user.keyboard('{Enter}');

    // Q2: 학력
    await waitFor(() => screen.getByText("Bachelor's Degree"));
    await user.click(screen.getByText("Bachelor's Degree"));
    expect(useOnboardingStore.getState().formData.education).toBe("Bachelor's Degree");

    // Q3: 역할
    await waitFor(() => screen.getByText('Registered Nurse (RN)'));
    await user.click(screen.getByText('Registered Nurse (RN)'));
    expect(useOnboardingStore.getState().formData.nursingRole).toBe('Registered Nurse (RN)');
  });

  test('Summary 전환: 마지막 질문 완료 → Summary 화면', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <BasicInfoForm />
      </TestWrapper>
    );

    await completeAllQuestions(user);
    await user.keyboard('{Enter}'); // 마지막 Enter

    // Summary 전환 확인 (버튼 개수로 판단)
    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(1);
    });
  });

  test('실제 API 연동: Continue → Employment 이동', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <BasicInfoForm />
      </TestWrapper>
    );

    // Q&A 완료
    await completeAllQuestions(user);
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
    });

    // Continue 클릭 → 실제 useBasicInfoMutation 실행됨
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // 🎯 실제 API 호출 및 상태 전환 확인 (Hook이 처리)
    await waitFor(() => {
      expect(useOnboardingStore.getState().currentStep).toBe('employment');
    }, { timeout: 10000 });

    // 🎯 실제 DB 저장 확인
    const progressResponse = await fetch(`http://localhost:3000/api/onboarding/progress/${tempUserId}`);
    expect(progressResponse.ok).toBe(true);
    
    const progressData = await progressResponse.json();
    // BasicInfo 실제 저장 상태 확인
    
    expect(progressData.basicInfoCompleted).toBe(true);
    expect(progressData.completedSteps).toContain('basicInfo');
  });
});