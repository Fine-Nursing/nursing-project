// 모든 개별 테스트들을 자동으로 실행
import './welcome.test';
import './basic-info.test'; 
import './employment.test';
import './culture.test';
import './account.test';

// 통합 로직 테스트
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import useOnboardingStore from '../../store/onboardingStores';

describe('온보딩 시스템 - 통합 관리', () => {
  beforeEach(() => {
    useOnboardingStore.getState().resetForm();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  // Store 통합 로직 테스트  
  describe('Store 상태 관리', () => {
    test('5단계 순차 진행', () => {
      // Welcome → BasicInfo → Employment → Culture → Account
      useOnboardingStore.getState().setStep('welcome');
      expect(useOnboardingStore.getState().currentStep).toBe('welcome');
      
      useOnboardingStore.getState().setStep('basicInfo');
      expect(useOnboardingStore.getState().currentStep).toBe('basicInfo');
      
      useOnboardingStore.getState().setStep('employment');
      expect(useOnboardingStore.getState().currentStep).toBe('employment');
      
      useOnboardingStore.getState().setStep('culture');
      expect(useOnboardingStore.getState().currentStep).toBe('culture');
      
      useOnboardingStore.getState().setStep('account');
      expect(useOnboardingStore.getState().currentStep).toBe('account');
    });

    test('전체 온보딩 데이터 누적 저장', () => {
      // 각 단계별 데이터 누적
      useOnboardingStore.getState().updateFormData({
        // BasicInfo
        name: '김간호',
        education: "Bachelor's Degree",
        nursingRole: 'Registered Nurse (RN)',
        experienceYears: 5
      });
      
      useOnboardingStore.getState().updateFormData({
        // Employment
        organizationName: 'Samsung Medical Center',
        specialty: 'Critical Care (ICU/CCU)',
        employmentType: 'Full-time',
        basePay: 38,
        individualDifferentials: [{ type: 'Night Shift', amount: 3, unit: 'hourly' }]
      });
      
      useOnboardingStore.getState().updateFormData({
        // Culture
        unitCulture: 4,
        benefits: 5,
        growthOpportunities: 3,
        hospitalQuality: 4
      });
      
      useOnboardingStore.getState().updateFormData({
        // Account
        email: 'test@test.com',
        password: 'password123'
      });
      
      // 🎯 최종 검증: 모든 데이터 누적 저장
      const finalData = useOnboardingStore.getState().formData;
      expect(finalData.name).toBe('김간호');
      expect(finalData.organizationName).toBe('Samsung Medical Center');
      expect(finalData.basePay).toBe(38);
      expect(finalData.individualDifferentials?.[0]?.type).toBe('Night Shift');
      expect(finalData.unitCulture).toBe(4);
      expect(finalData.email).toBe('test@test.com');
    });

    test('온보딩 완료 후 상태 리셋', () => {
      // 데이터 설정
      useOnboardingStore.getState().updateFormData({
        name: '김간호',
        organizationName: 'Samsung Medical',
        email: 'test@test.com'
      });
      
      // 리셋 실행
      useOnboardingStore.getState().resetForm();
      
      // 리셋 확인
      const resetData = useOnboardingStore.getState().formData;
      expect(resetData.name).toBe('');
      expect(resetData.organizationName).toBe('');
      expect(resetData.email).toBe('');
      expect(useOnboardingStore.getState().currentStep).toBe('welcome');
    });
  });
});