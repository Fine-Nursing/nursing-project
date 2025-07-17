'use client';

import { AnimatePresence, motion } from 'framer-motion';
import useInitializeOnboarding from 'src/api/onboarding/useInitializeOnboarding';
import AccountForm from 'src/components/onboarding/pages/AccountForm';
import BasicInfoForm from 'src/components/onboarding/pages/BasicInfoForm';
import CultureForm from 'src/components/onboarding/pages/CultureForm';
import EmploymentForm from 'src/components/onboarding/pages/EmploymentForm';
import WelcomePage from 'src/components/onboarding/pages/WelcomePage';
import { ONBOARDING_STEPS } from 'src/constants/onbarding';
import useOnboardingStore from 'src/store/onboardingStores';
import type { OnboardingStep } from 'src/types/onboarding';

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export default function OnboardingFlow() {
  const { currentStep } = useOnboardingStore();
  const { isLoading, error } = useInitializeOnboarding();

  const renderStep = (step: OnboardingStep) => {
    switch (step) {
      case 'welcome':
        return <WelcomePage />;
      case 'basicInfo':
        return <BasicInfoForm />;
      case 'employment':
        return <EmploymentForm />;
      case 'culture':
        return <CultureForm />;
      case 'account':
        return <AccountForm />;
      default:
        return null;
    }
  };

  const currentStepIndex = ONBOARDING_STEPS.findIndex(
    (s) => s.id === currentStep
  );

  const getCircleClassName = (isCompleted: boolean, isActive: boolean) => {
    const baseClasses =
      'relative z-10 flex h-8 w-8 items-center justify-center rounded-full';

    if (isCompleted) {
      return `${baseClasses} bg-slate-600 text-white`;
    }
    if (isActive) {
      return `${baseClasses} bg-slate-100 text-slate-800 border-2 border-slate-600`;
    }
    return `${baseClasses} bg-white border-2 border-gray-300 text-gray-400`;
  };

  const getTitleClassName = (isCompleted: boolean, isActive: boolean) => {
    const baseClasses = 'text-sm font-semibold';

    if (isActive) {
      return `${baseClasses} text-slate-700`;
    }
    if (isCompleted) {
      return `${baseClasses} text-slate-600`;
    }
    return `${baseClasses} text-gray-500`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto" />
          <p className="mt-4 text-gray-600">Preparing your onboarding...</p>
        </div>
      </div>
    );
  }

  // 에러 발생 시
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error.message}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps - Welcome 단계일 때는 숨김 */}
        {currentStep !== 'welcome' && (
          <div className="py-8 flex items-center justify-center">
            <nav aria-label="Progress" className="w-full max-w-2xl">
              <ol className="flex items-center justify-between">
                {ONBOARDING_STEPS.filter((step) => step.id !== 'welcome').map(
                  (step, index) => {
                    const actualIndex = ONBOARDING_STEPS.findIndex(
                      (s) => s.id === step.id
                    );
                    const isCompleted = actualIndex < currentStepIndex;
                    const isActive = actualIndex === currentStepIndex;

                    return (
                      <li
                        key={step.id}
                        className="relative flex-1 flex items-center"
                      >
                        {index > 0 && (
                          <div
                            className={`absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full ${
                              isCompleted ? 'bg-slate-600' : 'bg-gray-200'
                            }`}
                          />
                        )}

                        <div
                          className={getCircleClassName(isCompleted, isActive)}
                        >
                          {isCompleted ? (
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <span className="text-sm font-medium">
                              {index + 1}
                            </span>
                          )}
                        </div>

                        <div className="ml-3 text-left">
                          <p
                            className={getTitleClassName(isCompleted, isActive)}
                          >
                            {step.title}
                          </p>
                        </div>
                      </li>
                    );
                  }
                )}
              </ol>
            </nav>
          </div>
        )}

        {/* Form Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'tween', duration: 0.3 }}
            className="py-8"
          >
            {renderStep(currentStep)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
