// src/api/onboarding/useEmploymentMutation.ts
import { useMutation } from '@tanstack/react-query';
import useOnboardingStore from 'src/store/onboardingStores';

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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BE_URL}/api/onboarding/employment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            ...data,
            tempUserId: storedTempUserId,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || 'Failed to save employment information'
        );
      }

      return response.json();
    },
    onSuccess: () => {
      setStep('culture');
    },
  });
};

export default useEmploymentMutation;
