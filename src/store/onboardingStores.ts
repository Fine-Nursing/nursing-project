import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OnboardingFormData, OnboardingStep } from '../types/onboarding';

interface OnboardingStore {
  currentStep: OnboardingStep;
  formData: Partial<OnboardingFormData>;
  setStep: (step: OnboardingStep) => void;
  updateFormData: (data: Partial<OnboardingFormData>) => void;
  resetForm: () => void;
}

const initialFormData: Partial<OnboardingFormData> = {
  basePay: 0,
  paymentFrequency: 'hourly',
  isUnionized: false,
  yearsAtOrganization: 0,
  cultureRating: 5,
  // 새로운 differential 필드들 초기화
  individualDifferentials: [],
  totalDifferential: 0,
  differentialsFreeText: '',
};

const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      currentStep: 'welcome',
      formData: initialFormData,
      setStep: (step) => set({ currentStep: step }),
      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      resetForm: () =>
        set({ formData: initialFormData, currentStep: 'welcome' }),
    }),
    {
      name: 'nurse-onboarding-storage',
    }
  )
);

export default useOnboardingStore;
