'use client';

import React, { lazy, Suspense } from 'react';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import useInitializeOnboarding from 'src/api/onboarding/useInitializeOnboarding';
import { LoadingState } from 'src/components/ui/feedback';
import { ONBOARDING_STEPS } from 'src/constants/onboarding';
import useOnboardingStore from 'src/store/onboardingStores';
import type { OnboardingStep } from 'src/types/onboarding';
import { ThemeSwitch } from 'src/components/ui/common/ThemeToggle';

// Dynamic imports - 각 Form은 필요할 때만 로드
const WelcomePage = lazy(() => import('src/components/features/onboarding/WelcomePage'));
const BasicInfoForm = lazy(() => import('src/components/features/onboarding/BasicInfoForm'));
const EmploymentForm = lazy(() => import('src/components/features/onboarding/EmploymentForm'));
const CultureForm = lazy(() => import('src/components/features/onboarding/CultureForm'));
const AccountForm = lazy(() => import('src/components/features/onboarding/AccountForm'));
const StepTransition = lazy(() => import('src/components/features/onboarding/components/StepTransition'));

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// Form 로딩 컴포넌트 - WelcomePage와 동일한 레이아웃 유지
function FormLoader() {
  return (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex items-start pt-16 sm:pt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex items-center justify-center min-h-[600px]">
        <LoadingState size="md" color="slate" text="Loading..." />
      </div>
    </div>
  </div>
  );
}

function OnboardingFlow() {
  const { currentStep, restoreFromServer } = useOnboardingStore();
  const { isLoading, error } = useInitializeOnboarding();

  // 컴포넌트 마운트 시 서버에서 상태 복원
  React.useEffect(() => {
    restoreFromServer();
  }, [restoreFromServer]);

  const renderStep = (step: OnboardingStep) => {
    const Component = (() => {
      switch (step) {
        case 'welcome':
          return WelcomePage;
        case 'basicInfo':
          return BasicInfoForm;
        case 'employment':
          return EmploymentForm;
        case 'culture':
          return CultureForm;
        case 'account':
          return AccountForm;
        default:
          return null;
      }
    })();

    if (!Component) return null;

    return (
      <Suspense fallback={<FormLoader />}>
        <Component />
      </Suspense>
    );
  };

  const currentStepIndex = ONBOARDING_STEPS.findIndex(
    (s) => s.id === currentStep
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-start pt-16 sm:pt-20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="flex items-center justify-center min-h-[600px]">
            <LoadingState size="lg" color="slate" text="Preparing your onboarding..." />
          </div>
        </div>
      </div>
    );
  }

  // 에러 발생 시
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error.message}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-slate-600 dark:bg-slate-700 text-white rounded-md hover:bg-slate-700 dark:hover:bg-slate-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Theme Toggle Button - Fixed position */}
        <div className="fixed top-4 right-4 z-50">
          <ThemeSwitch />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Steps - Welcome 단계일 때는 숨김 */}
          {currentStep !== 'welcome' && (
            <div className="py-4 sm:py-8 px-4 sm:px-0">
              <Suspense fallback={<FormLoader />}>
                <StepTransition
                  steps={ONBOARDING_STEPS.filter((step) => step.id !== 'welcome').map((step) => {
                    const actualIndex = ONBOARDING_STEPS.findIndex((s) => s.id === step.id);
                    return {
                      id: step.id,
                      title: step.title,
                      description: step.description,
                      isCompleted: actualIndex < currentStepIndex,
                      isActive: actualIndex === currentStepIndex,
                    };
                  })}
                  currentStep={currentStepIndex - 1}
                />
              </Suspense>
            </div>
          )}

          {/* Form Content */}
          <AnimatePresence mode="wait">
            <m.div
              key={currentStep}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: 'tween', duration: 0.15 }}
              className="py-4 sm:py-8"
            >
              {renderStep(currentStep)}
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    </LazyMotion>
  );
}
export default OnboardingFlow;
