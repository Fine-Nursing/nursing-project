import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import useOnboardingStore from 'src/store/onboardingStores';

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
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BE_URL}/api/onboarding/progress/${tempUserId}`,
    {
      credentials: 'include',
    }
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
};

const createNewOnboarding = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BE_URL}/api/onboarding/init`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({}),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to initialize onboarding.');
  }

  return response.json();
};

const useInitializeOnboarding = () => {
  const { setStep, setTempUserId, setSessionId } = useOnboardingStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['onboarding-init'],
    queryFn: async () => {
      // 1. LocalStorage에서 기존 세션 확인
      const savedSession = localStorage.getItem('onboarding_session');

      if (savedSession) {
        const session: OnboardingSession = JSON.parse(savedSession);

        // 2. 서버에서 진행 상황 확인
        const progress = await checkExistingProgress(session.tempUserId);

        if (progress) {
          return {
            isExisting: true,
            tempUserId: session.tempUserId,
            sessionId: session.sessionId,
            progress,
          };
        }

        // 진행 상황이 없으면 localStorage 정리
        localStorage.removeItem('onboarding_session');
      }

      // 3. 새로운 온보딩 시작
      const newSession = await createNewOnboarding();

      // 4. LocalStorage에 저장
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
    staleTime: Infinity, // 온보딩 초기화는 한 번만 실행
    gcTime: Infinity,
    retry: 1,
  });

  // 데이터가 준비되면 store 업데이트 및 적절한 단계로 이동
  useEffect(() => {
    if (data) {
      setTempUserId(data.tempUserId);
      setSessionId(data.sessionId);

      if (data.isExisting && data.progress) {
        // 진행 상황에 따라 적절한 단계로 이동
        if (!data.progress.basicInfoCompleted) {
          setStep('basicInfo');
        } else if (!data.progress.employmentCompleted) {
          setStep('employment');
        } else if (!data.progress.cultureCompleted) {
          setStep('culture');
        } else if (!data.progress.accountCompleted) {
          setStep('account');
        } else {
          setStep('welcome');
        }
      } else {
        // 새로운 온보딩
        setStep('welcome');
      }
    }
  }, [data, setStep, setTempUserId, setSessionId]);

  return {
    isLoading,
    error: error as Error | null,
  };
};

export default useInitializeOnboarding;
