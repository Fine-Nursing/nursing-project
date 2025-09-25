// src/api/onboarding/useCultureMutation.ts
import { useMutation } from '@tanstack/react-query';
import useOnboardingStore from 'src/store/onboardingStores';
import apiClient from 'src/lib/axios';

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

      const response = await apiClient.post('/api/onboarding/culture', {
        ...data,
        tempUserId: storedTempUserId,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to save culture information');
      }

      return response.data;
    },
    onSuccess: () => {
      setStep('account');
    },
  });
};

export default useCultureMutation;
