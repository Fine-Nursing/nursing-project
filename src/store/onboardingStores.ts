import { create } from 'zustand';
import type { OnboardingFormData, OnboardingStep } from '../types/onboarding';

interface OnboardingProgress {
  basicInfoCompleted: boolean;
  employmentCompleted: boolean;
  cultureCompleted: boolean;
  accountCompleted: boolean;
}

interface OnboardingStore {
  currentStep: OnboardingStep;
  formData: Partial<OnboardingFormData>;
  tempUserId: string | null;
  sessionId: string | null;

  // Progress tracking
  existingProgress: OnboardingProgress | null;
  hasExistingSession: boolean;

  // Actions
  setStep: (step: OnboardingStep) => void;
  setTempUserId: (id: string) => void;
  setSessionId: (id: string) => void;
  updateFormData: (data: Partial<OnboardingFormData>) => void;
  resetForm: () => void;

  // Progress actions
  setExistingProgress: (progress: OnboardingProgress | null) => void;
  setHasExistingSession: (hasSession: boolean) => void;
  continueFromLastStep: () => void;
  resetOnboarding: () => void;
  
  // 서버에서 상태 복원
  restoreFromServer: () => Promise<void>;
}

const initialFormData: Partial<OnboardingFormData> = {
  // BasicInfo
  name: '',
  education: undefined,
  nursingRole: undefined,
  experienceYears: 0,

  // Employment
  specialty: '',
  subSpecialty: '',
  organizationName: '',
  organizationCity: '',
  organizationState: '',
  employmentStartYear: new Date().getFullYear(),
  employmentType: undefined,
  shiftType: undefined,
  nurseToPatientRatio: '',
  basePay: 0,
  paymentFrequency: 'hourly',
  isUnionized: false,
  individualDifferentials: [],
  differentialsFreeText: '',

  // Culture
  unitCulture: 3,
  benefits: 3,
  growthOpportunities: 3,
  hospitalQuality: 3,
  freeTextFeedback: '',

  // Account
  email: '',
  password: '',
  confirmPassword: '',
};

const useOnboardingStore = create<OnboardingStore>((set, get) => ({
  currentStep: 'welcome',
  formData: initialFormData,
  tempUserId: null,
  sessionId: null,
  existingProgress: null,
  hasExistingSession: false,

  setStep: (step) => set({ currentStep: step }),
  setTempUserId: (id) => set({ tempUserId: id }),
  setSessionId: (id) => set({ sessionId: id }),
  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  resetForm: () =>
    set({
      formData: initialFormData,
      currentStep: 'welcome',
      tempUserId: null,
      sessionId: null,
      existingProgress: null,
      hasExistingSession: false,
    }),

  // Progress tracking methods
  setExistingProgress: (progress) => set({ existingProgress: progress }),
  setHasExistingSession: (hasSession) =>
    set({ hasExistingSession: hasSession }),

  continueFromLastStep: () =>
    set((state) => {
      if (!state.existingProgress) {
        return state;
      }

      // Determine the next step based on progress
      let nextStep: OnboardingStep = 'welcome';

      if (!state.existingProgress.basicInfoCompleted) {
        nextStep = 'basicInfo';
      } else if (!state.existingProgress.employmentCompleted) {
        nextStep = 'employment';
      } else if (!state.existingProgress.cultureCompleted) {
        nextStep = 'culture';
      } else if (!state.existingProgress.accountCompleted) {
        nextStep = 'account';
      } else {
        // All steps completed
        // Onboarding already completed, redirect to dashboard
        window.location.href = '/dashboard';
        return state;
      }

      return { currentStep: nextStep };
    }),

  resetOnboarding: () => {
    // Clear localStorage session
    localStorage.removeItem('onboarding_session');

    // Reset store state
    set({
      formData: initialFormData,
      currentStep: 'welcome',
      tempUserId: null,
      sessionId: null,
      existingProgress: null,
      hasExistingSession: false,
    });
  },

  // 서버에서 온보딩 진행상황 복원
  restoreFromServer: async () => {
    try {
      // localStorage에서 tempUserId 가져오기
      const sessionData = localStorage.getItem('onboarding_session');
      if (!sessionData) {
        return;
      }

      const { tempUserId } = JSON.parse(sessionData);
      if (!tempUserId) {
        return;
      }

      // 서버에서 진행상황 조회
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BE_URL}/api/onboarding/progress?tempUserId=${tempUserId}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        return;
      }

      const progress = await response.json();
      
      // 상태 업데이트
      set({
        tempUserId,
        formData: progress.formData || initialFormData,
        existingProgress: {
          basicInfoCompleted: progress.basicInfoCompleted || false,
          employmentCompleted: progress.employmentCompleted || false,
          cultureCompleted: progress.cultureCompleted || false,
          accountCompleted: progress.accountCompleted || false,
        },
        hasExistingSession: true,
      });

      // 적절한 단계로 이동
      get().continueFromLastStep();

    } catch (error) {
      console.error('Error restoring onboarding progress:', error);
      // 에러가 발생해도 앱은 계속 동작하도록 함
    }
  },
}));

export default useOnboardingStore;
