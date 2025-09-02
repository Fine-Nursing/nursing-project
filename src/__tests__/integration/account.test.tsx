import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AccountForm from '../../components/features/onboarding/AccountForm';
import useOnboardingStore from '../../store/onboardingStores';

// Mock Auth hooks
const mockSignUp = vi.fn();
const mockSignIn = vi.fn();

vi.mock('../../api/Auth/useAuth', () => ({
  default: () => ({
    signUp: mockSignUp,
    signIn: mockSignIn,
    isLoading: false,
  }),
}));

// 필수 Mock
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock('../../hooks/useAuthStore', () => ({ default: () => ({ user: null, isAuthenticated: false }) }));
vi.mock('react-hot-toast', () => ({ default: { error: vi.fn(), loading: vi.fn(), success: vi.fn() } }));

// 실제 API 사용
function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('AccountForm - 실제 API 연동', () => {
  let tempUserId: string;

  beforeEach(async () => {
    useOnboardingStore.getState().resetForm();
    useOnboardingStore.getState().setStep('account');
    vi.clearAllMocks();
    
    // 환경변수 설정
    process.env.NEXT_PUBLIC_BE_URL = 'http://localhost:3000';
    
    // 실제 사용자 생성 및 모든 선행 단계 완료
    const initResponse = await fetch('http://localhost:3000/api/onboarding/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    
    const { tempUserId: newTempUserId } = await initResponse.json();
    tempUserId = newTempUserId;
    
    // BasicInfo + Employment + Culture 완료 (Account 접근을 위해)
    await fetch('http://localhost:3000/api/onboarding/basic-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '계정테스트', education: "Bachelor's Degree",
        nursingRole: 'Registered Nurse (RN)', experienceYears: 5, tempUserId
      })
    });
    
    await fetch('http://localhost:3000/api/onboarding/employment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        organizationName: 'Account Test Hospital', organizationCity: 'Seoul', organizationState: 'NY',
        specialty: 'Emergency', employmentStartYear: 2023, employmentType: 'Full-time',
        shiftType: 'Night Shift', nurseToPatientRatio: '1:2', basePay: 42,
        paymentFrequency: 'hourly', isUnionized: false, individualDifferentials: [], tempUserId
      })
    });
    
    await fetch('http://localhost:3000/api/onboarding/culture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        unitCulture: 4, benefits: 4, growthOpportunities: 4, hospitalQuality: 4, tempUserId
      })
    });
    
    useOnboardingStore.getState().setTempUserId(tempUserId);
    
    // localStorage 설정
    localStorage.setItem('onboarding_session', JSON.stringify({
      tempUserId,
      sessionId: 'account-test-session',
      startedAt: new Date().toISOString()
    }));
    
    mockSignUp.mockResolvedValue({ success: true });
    mockSignIn.mockResolvedValue({ success: true });
  });

  afterEach(() => {
    cleanup();
  });

  test('1. 회원가입 모드: 기본 필드 입력', async () => {
    const user = userEvent.setup();
    
    render(<TestWrapper><AccountForm /></TestWrapper>);

    // 🎯 회원가입 폼 요소들 확인
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    
    const passwordInputs = screen.getAllByLabelText(/password/i);
    expect(passwordInputs.length).toBe(2); // Password + Confirm Password

    // 기본 입력
    await user.type(screen.getByLabelText(/first name/i), '김');
    await user.type(screen.getByLabelText(/last name/i), '간호');
    await user.type(screen.getByLabelText(/email/i), 'test@test.com');

    // 입력 확인
    expect(screen.getByDisplayValue('김')).toBeInTheDocument();
    expect(screen.getByDisplayValue('간호')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@test.com')).toBeInTheDocument();
  });

  test('2. 실제 completeOnboarding API 호출', async () => {
    // 🎯 실제 Complete API 호출
    const response = await fetch('http://localhost:3000/api/onboarding/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tempUserId })
    });

    expect(response.ok).toBe(true);
    
    const result = await response.json();
    
    expect(result.message).toContain('completed');
    expect(result.userId).toBeTruthy(); // 실제 사용자 ID 생성

    // 🎯 최종 상태: localStorage 정리
    localStorage.removeItem('onboarding_session');
    expect(localStorage.getItem('onboarding_session')).toBeNull();
  });
});