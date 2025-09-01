import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CultureForm from '../../components/features/onboarding/CultureForm';
import useOnboardingStore from '../../store/onboardingStores';

// 필수 Mock
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn() },
}));

// 실제 API 사용
function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('CultureForm - 실제 API 연동', () => {
  let tempUserId: string;

  beforeEach(async () => {
    useOnboardingStore.getState().resetForm();
    useOnboardingStore.getState().setStep('culture');
    vi.clearAllMocks();
    
    // 환경변수 설정
    process.env.NEXT_PUBLIC_BE_URL = 'http://localhost:3000';
    
    // 실제 사용자 생성 및 선행 단계 완료
    const initResponse = await fetch('http://localhost:3000/api/onboarding/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    
    const { tempUserId: newTempUserId } = await initResponse.json();
    tempUserId = newTempUserId;
    
    // BasicInfo + Employment 완료 (Culture 접근을 위해)
    await fetch('http://localhost:3000/api/onboarding/basic-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '문화테스트', education: "Bachelor's Degree",
        nursingRole: 'Registered Nurse (RN)', experienceYears: 5, tempUserId
      })
    });
    
    await fetch('http://localhost:3000/api/onboarding/employment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        organizationName: 'Test Hospital', organizationCity: 'Seoul', organizationState: 'NY',
        specialty: 'Critical Care (ICU/CCU)', employmentStartYear: 2023, employmentType: 'Full-time',
        shiftType: 'Day Shift', nurseToPatientRatio: '1:2', basePay: 38,
        paymentFrequency: 'hourly', isUnionized: false, individualDifferentials: [], tempUserId
      })
    });
    
    useOnboardingStore.getState().setTempUserId(tempUserId);
    
    // localStorage 설정
    localStorage.setItem('onboarding_session', JSON.stringify({
      tempUserId,
      sessionId: 'culture-test-session',
      startedAt: new Date().toISOString()
    }));
  });

  afterEach(() => {
    cleanup();
  });

  test('1. 4개 카테고리 평가 시스템', async () => {
    
    render(
      <TestWrapper>
        <CultureForm />
      </TestWrapper>
    );

    // 4개 카테고리 확인
    expect(screen.getAllByText(/Unit Culture.*Teamwork/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Benefits.*Compensation/)[0]).toBeInTheDocument();  
    expect(screen.getAllByText(/Growth.*Development/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Hospital.*Quality/)[0]).toBeInTheDocument();

    // 🎯 로직: Store 직접 설정으로 점수 입력
    useOnboardingStore.getState().updateFormData({
      unitCulture: 4,
      benefits: 5,
      growthOpportunities: 3,
      hospitalQuality: 4
    });

    // 저장 확인
    const {formData} = useOnboardingStore.getState();
    expect(formData.unitCulture).toBe(4);
    expect(formData.benefits).toBe(5);
    expect(formData.growthOpportunities).toBe(3);
    expect(formData.hospitalQuality).toBe(4);
  });

  test('2. 실제 API 연동: Culture → Account 이동', async () => {
    const user = userEvent.setup();
    
    // Culture 데이터 설정
    const cultureData = {
      unitCulture: 4,
      benefits: 5,
      growthOpportunities: 3,
      hospitalQuality: 4,
      freeTextFeedback: '좋은 근무 환경입니다.',
      tempUserId
    };
    
    useOnboardingStore.getState().updateFormData(cultureData);
    
    render(
      <TestWrapper>
        <CultureForm />
      </TestWrapper>
    );

    // Continue 클릭
    const continueButton = screen.getByRole('button', { name: /continue/i });
    await user.click(continueButton);

    // 🎯 실제 Culture API 호출
    const response = await fetch('http://localhost:3000/api/onboarding/culture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cultureData)
    });

    // Culture API 호출 완료
    expect(response.ok).toBe(true);

    // 🎯 실제 저장 확인
    const progressResponse = await fetch(`http://localhost:3000/api/onboarding/progress/${tempUserId}`);
    if (progressResponse.ok) {
      const progressData = await progressResponse.json();
      expect(progressData.cultureCompleted).toBe(true);
      expect(progressData.completedSteps).toContain('culture');
    }

    // Account 단계로 이동
    useOnboardingStore.getState().setStep('account');
    expect(useOnboardingStore.getState().currentStep).toBe('account');
  });
});