import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OnboardingFormData, OnboardingStep } from '../types/onboarding';

interface OnboardingStore {
  currentStep: OnboardingStep;
  formData: Partial<OnboardingFormData>;
  tempUserId: string | null;
  sessionId: string | null;
  setStep: (step: OnboardingStep) => void;
  setTempUserId: (id: string) => void;
  setSessionId: (id: string) => void;
  updateFormData: (data: Partial<OnboardingFormData>) => void;
  resetForm: () => void;
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
        }),
    }),
    {
      name: 'nurse-onboarding-storage',
    }
  )
);

export default useOnboardingStore;
