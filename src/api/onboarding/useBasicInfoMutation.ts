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
  const { setStep, tempUserId } = useOnboardingStore();

  return useMutation({
    mutationFn: async (data: BasicInfoPayload) => {
      // Get tempUserId from store or localStorage
      const storedTempUserId = tempUserId ||
        JSON.parse(localStorage.getItem('onboarding_session') || '{}').tempUserId;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BE_URL}/api/onboarding/basic-info`,
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
