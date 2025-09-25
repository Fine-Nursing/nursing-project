// src/hooks/useBasicInfoMutation.ts
import { useMutation } from '@tanstack/react-query';
import useOnboardingStore from 'src/store/onboardingStores';
import apiClient from 'src/lib/axios';

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

      const response = await apiClient.post('/api/onboarding/basic-info', {
        ...data,
        tempUserId: storedTempUserId,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to save basic information');
      }

      return response.data;
    },
    onSuccess: () => {
      setStep('employment');
    },
  });
};

export default useBasicInfoMutation;
