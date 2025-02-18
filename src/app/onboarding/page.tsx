'use client';

import { AnimatePresence, motion } from 'framer-motion';
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="py-8">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-center space-x-8">
              {ONBOARDING_STEPS.map((step, index) => {
                const isActive =
                  index <=
                  ONBOARDING_STEPS.findIndex((s) => s.id === currentStep);
                const isCurrent = step.id === currentStep;

                return (
                  <li key={step.id} className="relative">
                    <div className="flex items-center">
                      <div
                        className={`
                          flex h-6 w-6 items-center justify-center rounded-full
                          ${
                            isActive
                              ? 'bg-blue-600 text-white'
                              : 'border-2 border-gray-300 bg-white text-gray-400'
                          }
                        `}
                      >
                        <span className="text-sm">{index + 1}</span>
                      </div>
                      <span
                        className={`
                          ml-2 text-sm font-medium
                          ${isCurrent ? 'text-blue-600' : 'text-gray-500'}
                        `}
                      >
                        {step.title}
                      </span>
                    </div>
                    {index < ONBOARDING_STEPS.length - 1 && (
                      <div
                        className={`
                          absolute top-3 left-0 -ml-px mt-0.5 h-0.5 w-full
                          ${isActive ? 'bg-blue-600' : 'bg-gray-300'}
                        `}
                      />
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

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
