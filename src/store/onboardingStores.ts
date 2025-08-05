import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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

const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
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
          console.log('=== continueFromLastStep 호출됨 ===');
          console.log('existingProgress:', state.existingProgress);
          
          if (!state.existingProgress) {
            console.log('existingProgress가 없음');
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
            // 모든 단계가 완료된 경우
            console.log('모든 온보딩이 완료됨, 완료 처리 필요');
            // 온보딩이 이미 완료되었으므로 대시보드로 리다이렉트
            window.location.href = '/dashboard';
            return state;
          }

          console.log('다음 단계로 이동:', nextStep);
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
    }),
    {
      name: 'nurse-onboarding-storage',
      // Don't persist progress-related fields as they should come from server
      partialize: (state) => ({
        formData: state.formData,
        tempUserId: state.tempUserId,
        sessionId: state.sessionId,
      }),
    }
  )
);

export default useOnboardingStore;
