// src/api/onboarding/useCultureMutation.ts
import { useMutation } from '@tanstack/react-query';
import useOnboardingStore from 'src/store/onboardingStores';

interface CulturePayload {
  unitCulture: number;
  benefits: number;
  growthOpportunities: number;
  hospitalQuality: number;
  freeTextFeedback?: string;
}

const useCultureMutation = () => {
  const { setStep, tempUserId } = useOnboardingStore();

  return useMutation({
    mutationFn: async (data: CulturePayload) => {
      // Get tempUserId from store or localStorage
      const storedTempUserId = tempUserId ||
        JSON.parse(localStorage.getItem('onboarding_session') || '{}').tempUserId;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BE_URL}/api/onboarding/culture`,
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
        throw new Error(error.message || 'Failed to save culture information');
      }

      return response.json();
    },
    onSuccess: () => {
      setStep('account');
    },
  });
};

export default useCultureMutation;
