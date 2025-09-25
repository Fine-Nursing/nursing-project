// src/api/onboarding/useEmploymentMutation.ts
import { useMutation } from '@tanstack/react-query';
import useOnboardingStore from 'src/store/onboardingStores';
import apiClient from 'src/lib/axios';

interface EmploymentPayload {
  specialty: string;
  subSpecialty?: string;
  organizationName: string;
  organizationCity: string;
  organizationState: string;
  employmentStartYear: number;
  employmentType: string;
  shiftType: string;
  nurseToPatientRatio: string;
  basePay: number;
  paymentFrequency: 'hourly' | 'yearly';
  isUnionized: boolean;
  individualDifferentials: Array<{
    type: string;
    amount: number;
    unit: 'hourly' | 'annual';
    group: string;
  }>;
  differentialsFreeText?: string;
}

const useEmploymentMutation = () => {
  const { setStep, tempUserId } = useOnboardingStore();

  return useMutation({
    mutationFn: async (data: EmploymentPayload) => {
      // Get tempUserId from store or localStorage
      const storedTempUserId = tempUserId ||
        JSON.parse(localStorage.getItem('onboarding_session') || '{}').tempUserId;

      const response = await apiClient.post('/api/onboarding/employment', {
        ...data,
        tempUserId: storedTempUserId,
      });

      if (!response.data.success) {
        throw new Error(
          response.data.message || 'Failed to save employment information'
        );
      }

      return response.data;
    },
    onSuccess: () => {
      setStep('culture');
    },
  });
};

export default useEmploymentMutation;
