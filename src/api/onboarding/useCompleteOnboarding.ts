// src/hooks/useCompleteOnboarding.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useAuthStore from 'src/hooks/useAuthStore';
import useOnboardingStore from 'src/store/onboardingStores';

interface CompleteOnboardingResult {
  success: boolean;
  message?: string;
  userId?: string; // 사용자 ID 추가
}

const useCompleteOnboarding = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { tempUserId, resetForm } = useOnboardingStore();
  const checkAuth = useAuthStore((state) => state.checkAuth);

  const completeOnboarding = async (): Promise<CompleteOnboardingResult> => {
    if (!tempUserId) {
      toast.error('No temporary user ID found');
      throw new Error('No temporary user ID found');
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BE_URL}/api/onboarding/complete`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            tempUserId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: 'Failed to complete onboarding' }));
        const errorMessage =
          errorData.message || 'Failed to complete onboarding';
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      const result = await response.json();

      // Clear onboarding data
      localStorage.removeItem('onboarding_session');
      resetForm();

      // Refresh user authentication
      try {
        await checkAuth();
      } catch (authError) {
        // eslint-disable-next-line no-console
        console.error('Failed to refresh auth after onboarding:', authError);
        // Continue even if auth refresh fails - the user can try logging in again
      }

      toast.success('Onboarding completed successfully!');

      // 사용자 상세 페이지로 이동
      if (result.userId) {
        router.push(`/users/${result.userId}`);
      } else {
        // userId가 없으면 대시보드로 이동
        router.push('/dashboard');
      }

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';

      // Don't show duplicate toast if we already showed one
      if (
        !errorMessage.includes('Failed to complete onboarding') &&
        !errorMessage.includes('No temporary user ID')
      ) {
        toast.error(errorMessage);
      }

      // eslint-disable-next-line no-console
      console.error('Onboarding completion error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    completeOnboarding,
    isLoading,
  };
};

export default useCompleteOnboarding;
