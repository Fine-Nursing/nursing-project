'use client';

import { AnimatePresence, motion } from 'framer-motion';
import useInitializeOnboarding from 'src/api/onboarding/useInitializeOnboarding';
import AccountForm from 'src/components/onboarding/pages/AccountForm';
import BasicInfoForm from 'src/components/onboarding/pages/BasicInfoForm';
import CultureForm from 'src/components/onboarding/pages/CultureForm';
import EmploymentForm from 'src/components/onboarding/pages/EmploymentForm';
import WelcomePage from 'src/components/onboarding/pages/WelcomePage';
import StepTransition from 'src/components/onboarding/components/StepTransition';
import { ONBOARDING_STEPS } from 'src/constants/onboarding';
import useOnboardingStore from 'src/store/onboardingStores';
import type { OnboardingStep } from 'src/types/onboarding';
import { ThemeSwitch } from 'src/components/common/ThemeToggle';

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 dark:border-slate-400 mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Preparing your onboarding...</p>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Theme Toggle Button - Fixed position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeSwitch />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps - Welcome 단계일 때는 숨김 */}
        {currentStep !== 'welcome' && (
          <div className="py-4 sm:py-8 px-4 sm:px-0">
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
            className="py-4 sm:py-8"
          >
            {renderStep(currentStep)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
