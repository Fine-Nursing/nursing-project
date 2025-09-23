import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EmploymentForm from '../../components/features/onboarding/EmploymentForm';
import useOnboardingStore from '../../store/onboardingStores';
import { CompensationCalculator } from '../../utils/compensation';

// Mock 설정
vi.mock('../../hooks/useSpecialties', () => ({
  useSpecialties: () => ({
    getAllSpecialties: { data: { specialties: [{ id: '1', name: 'Critical Care (ICU/CCU)' }] }, isLoading: false },
    getSubSpecialties: () => ({ data: null, isLoading: false }),
  }),
}));

vi.mock('@react-google-maps/api', () => ({ useJsApiLoader: () => ({ isLoaded: true }) }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock('react-hot-toast', () => ({ default: { error: vi.fn() } }));

// Helper functions (hoisting 문제 해결)
async function completeWorkplaceSection(user: any) {
  await user.type(screen.getByPlaceholderText(/search for hospital/i), 'Test Hospital');
  await user.type(screen.getByPlaceholderText('City'), 'Seoul');
  await user.type(screen.getByPlaceholderText(/state.*CA/i), 'NY');
  await user.click(screen.getByRole('button', { name: /Next: Your Role/i }));
  
  await waitFor(() => {
    expect(screen.getByText(/Your Role & Schedule/i)).toBeInTheDocument();
  });
}

async function completeRoleSection(user: any) {
  await waitFor(() => {
    expect(screen.getByRole('button', { name: /full-time/i })).toBeInTheDocument();
  });

  await user.click(screen.getByRole('button', { name: /full-time/i }));
  await user.click(screen.getByRole('button', { name: /night shift/i }));
  await user.click(screen.getByRole('button', { name: /1:2/i }));
  
  // Specialty Store 설정
  useOnboardingStore.getState().updateFormData({ specialty: 'Critical Care (ICU/CCU)' });
}

// 실제 API 호출을 위해 fetch Mock 없음

function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('EmploymentForm - 실제 API 연동', () => {
  let tempUserId: string;

  beforeEach(async () => {
    useOnboardingStore.getState().resetForm();
    useOnboardingStore.getState().setStep('employment');
    vi.clearAllMocks();
    
    // 환경변수 설정
    process.env.NEXT_PUBLIC_BE_URL = 'http://localhost:3000';
    
    // 실제 임시 사용자 생성 및 BasicInfo 완료
    const initResponse = await fetch('http://localhost:3000/api/onboarding/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({})
    });
    
    const { tempUserId: newTempUserId } = await initResponse.json();
    tempUserId = newTempUserId;
    
    // BasicInfo 먼저 완료 (Employment 접근을 위해)
    await fetch('http://localhost:3000/api/onboarding/basic-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        name: '테스트간호사',
        education: "Bachelor's Degree",
        nursingRole: 'Registered Nurse (RN)',
        experienceYears: 5,
        tempUserId
      })
    });
    
    useOnboardingStore.getState().setTempUserId(tempUserId);
    
    // localStorage 설정 (Hook에서 사용)
    localStorage.setItem('onboarding_session', JSON.stringify({
      tempUserId,
      sessionId: 'employment-test-session',
      startedAt: new Date().toISOString()
    }));
  });

  afterEach(() => {
    cleanup();
  });

  test('1. Workplace 섹션: 입력 → 저장 → 검증', async () => {
    const user = userEvent.setup();
    
    render(<TestWrapper><EmploymentForm /></TestWrapper>);

    // 🎯 3개 필수 필드 입력
    await user.type(screen.getByPlaceholderText(/search for hospital/i), 'Samsung Medical Center');
    await user.type(screen.getByPlaceholderText('City'), 'Seoul');
    await user.type(screen.getByPlaceholderText(/state.*CA/i), 'NY');

    // Store 저장 확인
    const {formData} = useOnboardingStore.getState();
    expect(formData.organizationName).toBe('Samsung Medical Center');
    expect(formData.organizationCity).toBe('Seoul');
    expect(formData.organizationState).toBe('NY');

    // Next 활성화 확인
    const nextButton = screen.getByRole('button', { name: /Next: Your Role/i });
    expect(nextButton).not.toBeDisabled();
  });

  test('2. Workplace → Role: 실제 사용자 플로우', async () => {
    const user = userEvent.setup();
    
    render(<TestWrapper><EmploymentForm /></TestWrapper>);

    // Workplace 완료
    await user.type(screen.getByPlaceholderText(/search for hospital/i), 'Test Hospital');
    await user.type(screen.getByPlaceholderText('City'), 'Seoul');
    await user.type(screen.getByPlaceholderText(/state.*CA/i), 'NY');

    // 🎯 핵심: Next 클릭 → Role 섹션 활성화
    const nextButton = screen.getByRole('button', { name: /Next: Your Role/i });
    await user.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/Your Role & Schedule/i)).toBeInTheDocument();
    });

    // 🎯 Role 필드들 입력
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /full-time/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /full-time/i }));
    expect(useOnboardingStore.getState().formData.employmentType).toBe('Full-time');

    await user.click(screen.getByRole('button', { name: /night shift/i }));
    expect(useOnboardingStore.getState().formData.shiftType).toBe('Night Shift');

    await user.click(screen.getByRole('button', { name: /1:2/i }));
    expect(useOnboardingStore.getState().formData.nurseToPatientRatio).toBe('1:2');
  });

  test('3. Role → Compensation: 연속 플로우', async () => {
    const user = userEvent.setup();
    
    render(<TestWrapper><EmploymentForm /></TestWrapper>);

    // Workplace 완료 후 Role 이동
    await user.type(screen.getByPlaceholderText(/search for hospital/i), 'Test Hospital');
    await user.type(screen.getByPlaceholderText('City'), 'Seoul');
    await user.type(screen.getByPlaceholderText(/state.*CA/i), 'NY');
    await user.click(screen.getByRole('button', { name: /Next: Your Role/i }));

    // Role 완료
    await waitFor(() => screen.getByRole('button', { name: /full-time/i }));
    await user.click(screen.getByRole('button', { name: /full-time/i }));
    await user.click(screen.getByRole('button', { name: /night shift/i }));
    await user.click(screen.getByRole('button', { name: /1:2/i }));
    
    // Specialty Store 설정
    useOnboardingStore.getState().updateFormData({ specialty: 'Critical Care (ICU/CCU)' });

    // 🎯 핵심: Role → Compensation 이동
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Next.*Compensation/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /Next.*Compensation/i }));

    await waitFor(() => {
      expect(screen.getByText(/Let's talk money/i)).toBeInTheDocument();
    });
  });

  test('4. Compensation 섹션: 기본급 + 차등수당', async () => {
    const user = userEvent.setup();
    
    render(<TestWrapper><EmploymentForm /></TestWrapper>);

    // 전체 플로우 실행
    await completeWorkplaceSection(user);
    await completeRoleSection(user);

    // Compensation 섹션 진입
    await user.click(screen.getByRole('button', { name: /Next.*Compensation/i }));

    await waitFor(() => {
      expect(screen.getByText(/Let's talk money/i)).toBeInTheDocument();
    });

    // 🎯 기본급 입력
    const payInputs = screen.getAllByRole('spinbutton');
    if (payInputs.length > 0) {
      await user.type(payInputs[0], '38');
      expect(useOnboardingStore.getState().formData.basePay).toBe(38);
    }

    // 🎯 차등수당 시스템: Store 로직으로 검증
    useOnboardingStore.getState().updateFormData({
      individualDifferentials: [
        { type: 'Night Shift', amount: 3, unit: 'hourly' },
        { type: 'Weekend', amount: 2, unit: 'hourly' }
      ]
    });

    const {formData} = useOnboardingStore.getState();
    expect(formData.individualDifferentials || []).toHaveLength(2);
    expect(formData.individualDifferentials[0]).toEqual(
      expect.objectContaining({ type: 'Night Shift', amount: 3 })
    );
  });

  test('5. 차등수당 계산 및 관리 로직', () => {
    // 🎯 순수 로직 테스트 (UI 없이)
    const basePay = 38;
    const differentials = [
      { type: 'Night Shift', amount: 3, unit: 'hourly' },
      { type: 'Weekend', amount: 2, unit: 'hourly' },
      { type: 'Holiday', amount: 5, unit: 'hourly' }
    ];

    // 실시간 계산 - Use proper shift-aware calculation
    const totalDifferentials = differentials.reduce((sum, diff) => sum + diff.amount, 0);
    const totalHourly = basePay + totalDifferentials;
    const shiftHours = 12; // Standard nursing shift
    const totalAnnual = CompensationCalculator.hourlyToAnnual(totalHourly, shiftHours);

    expect(totalDifferentials).toBe(10);
    expect(totalHourly).toBe(48);
    expect(totalAnnual).toBe(89856); // 48 * 1872 hours/year for 12-hour shifts

    // Store 적용 및 관리
    useOnboardingStore.getState().updateFormData({
      basePay,
      individualDifferentials: differentials as any
    });

    // 수정 로직
    let {formData} = useOnboardingStore.getState();
    const updated = formData.individualDifferentials?.map(diff => 
      diff.type === 'Night Shift' ? { ...diff, amount: 5 } : diff
    );
    
    useOnboardingStore.getState().updateFormData({ individualDifferentials: updated });
    formData = useOnboardingStore.getState().formData;
    expect(formData.individualDifferentials?.[0]?.amount).toBe(5);

    // 삭제 로직
    const filtered = formData.individualDifferentials?.filter(d => d.type !== 'Weekend');
    useOnboardingStore.getState().updateFormData({ individualDifferentials: filtered });
    formData = useOnboardingStore.getState().formData;
    expect(formData.individualDifferentials).toHaveLength(2);
  });

  test('6. 실제 API 연동: Employment → Culture', async () => {
    // 🎯 실제 Employment API 호출
    const employmentData = {
      organizationName: 'Samsung Medical Center',
      organizationCity: 'Seoul', 
      organizationState: 'NY',
      specialty: 'Critical Care (ICU/CCU)',
      employmentStartYear: 2023,
      employmentType: 'Full-time',
      shiftType: 'Night Shift',
      nurseToPatientRatio: '1:2',
      basePay: 38,
      paymentFrequency: 'hourly',
      isUnionized: false,
      individualDifferentials: [
        { type: 'Night Shift', amount: 3, unit: 'hourly', group: 'Shift Differentials' }
      ],
      tempUserId
    };

    useOnboardingStore.getState().updateFormData(employmentData as any);

    // 실제 API 호출
    const response = await fetch('http://localhost:3000/api/onboarding/employment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employmentData)
    });

    // Employment API 호출 완료
    expect(response.ok).toBe(true);

    // 실제 저장 확인
    const progressResponse = await fetch(`http://localhost:3000/api/onboarding/progress/${tempUserId}`);
    if (progressResponse.ok) {
      const progressData = await progressResponse.json();
      expect(progressData.employmentCompleted).toBe(true);
      expect(progressData.completedSteps).toContain('employment');
    }

    // Culture 단계 이동
    useOnboardingStore.getState().setStep('culture');
    expect(useOnboardingStore.getState().currentStep).toBe('culture');
  });
});