import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import useOnboardingStore from 'src/store/onboardingStores';
import apiClient from 'src/lib/axios';

interface OnboardingSession {
  tempUserId: string;
  sessionId: string;
  startedAt: string;
}

interface OnboardingProgress {
  tempUserId: string;
  completedSteps: string[];
  basicInfoCompleted: boolean;
  employmentCompleted: boolean;
  cultureCompleted: boolean;
  accountCompleted: boolean;
}

const checkExistingProgress = async (
  tempUserId: string
): Promise<OnboardingProgress | null> => {
  try {
    const response = await apiClient.get(`/api/onboarding/progress/${tempUserId}`);

    if (!response.data.success) {
      return null;
    }

    return response.data.data || response.data;
  } catch {
    return null;
  }
};

const createNewOnboarding = async () => {
  try {
    const response = await apiClient.post('/api/onboarding/init', {});

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to initialize onboarding.');
    }

    return response.data.data || response.data;
  } catch (error: any) {
    // 401 에러는 무시하고 기본값 반환 (온보딩은 인증 없이 가능해야 함)
    if (error?.response?.status === 401) {
      console.warn('Onboarding init returned 401 - proceeding anyway');
      // 임시 ID 생성
      const tempUserId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return { tempUserId, sessionId };
    }
    throw error;
  }
};

const useInitializeOnboarding = () => {
  const {
    setStep,
    setTempUserId,
    setSessionId,
    setExistingProgress,
    setHasExistingSession,
  } = useOnboardingStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['onboarding-init'],
    queryFn: async () => {
      // 1. Check for existing session in LocalStorage
      const savedSession = localStorage.getItem('onboarding_session');

      if (savedSession) {
        const session: OnboardingSession = JSON.parse(savedSession);

        // 2. Check progress from server
        const progress = await checkExistingProgress(session.tempUserId);

        if (progress) {
          return {
            isExisting: true,
            tempUserId: session.tempUserId,
            sessionId: session.sessionId,
            progress,
          };
        }

        // Clean up localStorage if no progress found
        localStorage.removeItem('onboarding_session');
      }

      // 3. Start new onboarding
      const newSession = await createNewOnboarding();

      // 4. Save to LocalStorage
      localStorage.setItem(
        'onboarding_session',
        JSON.stringify({
          tempUserId: newSession.tempUserId,
          sessionId: newSession.sessionId,
          startedAt: new Date().toISOString(),
        })
      );

      return {
        isExisting: false,
        tempUserId: newSession.tempUserId,
        sessionId: newSession.sessionId,
        progress: null,
      };
    },
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 1,
  });

  // Update store when data is ready
  useEffect(() => {
    if (data) {
      setTempUserId(data.tempUserId);
      setSessionId(data.sessionId);

      // Always start from welcome page
      setStep('welcome');

      if (data.isExisting && data.progress) {
        // Save existing progress to store
        setExistingProgress({
          basicInfoCompleted: data.progress.basicInfoCompleted,
          employmentCompleted: data.progress.employmentCompleted,
          cultureCompleted: data.progress.cultureCompleted,
          accountCompleted: data.progress.accountCompleted,
        });
        setHasExistingSession(true);
      } else {
        // New onboarding session
        setExistingProgress(null);
        setHasExistingSession(false);
      }
    }
  }, [
    data,
    setStep,
    setTempUserId,
    setSessionId,
    setExistingProgress,
    setHasExistingSession,
  ]);

  return {
    isLoading,
    error: error as Error | null,
  };
};

export default useInitializeOnboarding;
