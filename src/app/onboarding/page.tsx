'use client';

import React, { lazy, Suspense } from 'react';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import useInitializeOnboarding from 'src/api/onboarding/useInitializeOnboarding';
import { LoadingState } from 'src/components/ui/feedback';
import { ONBOARDING_STEPS } from 'src/constants/onboarding';
import useOnboardingStore from 'src/store/onboardingStores';
import type { OnboardingStep } from 'src/types/onboarding';
import { ThemeSwitch } from 'src/components/ui/common/ThemeToggle';
import { Home, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [showExitModal, setShowExitModal] = React.useState(false);

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
        {/* Theme Toggle Button - Desktop only */}
        <div className="hidden sm:block fixed top-4 right-4 z-50">
          <ThemeSwitch />
        </div>

        {/* Home/Exit Button - Mobile only, not on welcome page */}
        {currentStep !== 'welcome' && (
          <div className="sm:hidden fixed bottom-6 right-6 z-50">
            <button
              onClick={() => setShowExitModal(true)}
              className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hover:scale-110"
              aria-label="Go to Home"
            >
              <Home className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        )}

        {/* Exit Confirmation Modal - Mobile */}
        {showExitModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-50">
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Exit Onboarding?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Your progress will be saved. You can continue where you left off anytime.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowExitModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Stay
                  </button>
                  <button
                    onClick={() => router.push('/')}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                  >
                    Exit
                  </button>
                </div>
              </div>
            </m.div>
          </div>
        )}

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
