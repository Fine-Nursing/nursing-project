'use client';

import { AnimatePresence, motion } from 'framer-motion';
import useInitializeOnboarding from 'src/api/onboarding/useInitializeOnboarding';
import AccountForm from 'src/components/onboarding/pages/AccountForm';
import BasicInfoForm from 'src/components/onboarding/pages/BasicInfoForm';
import CultureForm from 'src/components/onboarding/pages/CultureForm';
import EmploymentForm from 'src/components/onboarding/pages/EmploymentForm';
import WelcomePage from 'src/components/onboarding/pages/WelcomePage';
import { ONBOARDING_STEPS } from 'src/constants/onboarding';
import useOnboardingStore from 'src/store/onboardingStores';
import type { OnboardingStep } from 'src/types/onboarding';

const pageVariants = {
  initial: { 
    opacity: 0, 
    x: 50,
    scale: 0.98,
  },
  animate: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    }
  },
  exit: { 
    opacity: 0, 
    x: -50,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1] as [number, number, number, number],
    }
  },
};

const progressVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    }
  },
};

const stepItemVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 20,
    }
  },
};

export default function OnboardingFlowEnhanced() {
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
      'relative z-10 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full transition-all duration-300';

    if (isCompleted) {
      return `${baseClasses} bg-gradient-to-br from-secondary-500 to-secondary-600 text-white shadow-lg`;
    }
    if (isActive) {
      return `${baseClasses} bg-gradient-to-br from-primary-400 to-primary-600 text-white border-2 border-primary-300 shadow-xl animate-pulse`;
    }
    return `${baseClasses} bg-gray-100 border-2 border-gray-300 text-gray-400`;
  };

  const getTitleClassName = (isCompleted: boolean, isActive: boolean) => {
    const baseClasses = 'text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-300';

    if (isActive) {
      return `${baseClasses} text-primary-700 font-bold`;
    }
    if (isCompleted) {
      return `${baseClasses} text-secondary-600`;
    }
    return `${baseClasses} text-gray-500`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto"
          />
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-primary-700 font-medium"
          >
            Preparing your onboarding experience...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white p-8 rounded-2xl shadow-xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.div>
          <p className="text-red-600 mb-4 font-medium">{error.message}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        {currentStep !== 'welcome' && (
          <motion.div 
            variants={progressVariants}
            initial="initial"
            animate="animate"
            className="py-4 sm:py-8 px-4 sm:px-0"
          >
            <nav aria-label="Progress" className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <ol className="flex items-center justify-between sm:justify-center gap-2 sm:gap-4">
                {ONBOARDING_STEPS.filter((step) => step.id !== 'welcome').map(
                  (step, index) => {
                    const actualIndex = ONBOARDING_STEPS.findIndex(
                      (s) => s.id === step.id
                    );
                    const isCompleted = actualIndex < currentStepIndex;
                    const isActive = actualIndex === currentStepIndex;

                    return (
                      <motion.li
                        key={step.id}
                        variants={stepItemVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: index * 0.1 }}
                        className="relative flex-shrink-0 flex flex-col items-center"
                      >
                        {index > 0 && (
                          <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
                            className={`hidden sm:block absolute left-0 top-4 -translate-y-1/2 h-1 w-full origin-left ${
                              isCompleted 
                                ? 'bg-gradient-to-r from-secondary-400 to-secondary-600' 
                                : 'bg-gray-200'
                            }`}
                            style={{ left: '-100%', width: '100%' }}
                          />
                        )}

                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className={getCircleClassName(isCompleted, isActive)}
                        >
                          {isCompleted ? (
                            <motion.svg
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                              className="h-4 w-4 sm:h-5 sm:w-5"
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
                            </motion.svg>
                          ) : (
                            <span className="text-sm font-bold">
                              {index + 1}
                            </span>
                          )}
                        </motion.div>

                        <motion.span
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 + 0.1 }}
                          className={`${getTitleClassName(isCompleted, isActive)} mt-2`}
                        >
                          {step.title}
                        </motion.span>
                      </motion.li>
                    );
                  }
                )}
              </ol>
            </nav>
          </motion.div>
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="pb-8"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
              {renderStep(currentStep)}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            x: [0, 20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
      </div>
    </div>
  );
}