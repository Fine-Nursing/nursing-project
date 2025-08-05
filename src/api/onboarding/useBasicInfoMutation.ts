// src/hooks/useBasicInfoMutation.ts
import { useMutation } from '@tanstack/react-query';
import useOnboardingStore from 'src/store/onboardingStores';

interface BasicInfoPayload {
  name: string;
  education: string;
  nursingRole: string;
  experienceYears: number;
}

const useBasicInfoMutation = () => {
  const { setStep } = useOnboardingStore();

  return useMutation({
    mutationFn: async (data: BasicInfoPayload) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BE_URL}/api/onboarding/basic-info`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save basic information');
      }

      return response.json();
    },
    onSuccess: () => {
      setStep('employment');
    },
  });
};

export default useBasicInfoMutation;
