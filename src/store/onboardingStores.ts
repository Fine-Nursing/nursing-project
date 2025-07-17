import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OnboardingFormData, OnboardingStep } from '../types/onboarding';

interface OnboardingStore {
  currentStep: OnboardingStep;
  formData: Partial<OnboardingFormData>;
  tempUserId: string | null; // 추가
  sessionId: string | null; // 추가
  setStep: (step: OnboardingStep) => void;
  setTempUserId: (id: string) => void; // 추가
  setSessionId: (id: string) => void; // 추가
  updateFormData: (data: Partial<OnboardingFormData>) => void;
  resetForm: () => void;
}

const initialFormData: Partial<OnboardingFormData> = {
  basePay: 0,
  paymentFrequency: 'hourly',
  isUnionized: false,
  yearsAtOrganization: 0,
  cultureRating: 5,
  individualDifferentials: [],
  totalDifferential: 0,
  differentialsFreeText: '',
};

const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      currentStep: 'welcome',
      formData: initialFormData,
      tempUserId: null, // 추가
      sessionId: null, // 추가
      setStep: (step) => set({ currentStep: step }),
      setTempUserId: (id) => set({ tempUserId: id }), // 추가
      setSessionId: (id) => set({ sessionId: id }), // 추가
      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      resetForm: () =>
        set({
          formData: initialFormData,
          currentStep: 'welcome',
          tempUserId: null, // 추가
          sessionId: null, // 추가
        }),
    }),
    {
      name: 'nurse-onboarding-storage',
    }
  )
);

export default useOnboardingStore;
