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

  // 현재 스텝의 인덱스 (0, 1, 2...)
  const currentStepIndex = ONBOARDING_STEPS.findIndex(
    (s) => s.id === currentStep
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="py-8 flex items-center justify-center">
          <nav aria-label="Progress" className="w-full max-w-2xl">
            <ol className="flex items-center justify-between">
              {ONBOARDING_STEPS.map((step, index) => {
                // 단계 상태 계산
                const isCompleted = index < currentStepIndex; // 이미 지난 단계
                const isActive = index === currentStepIndex; // 현재 단계
                const isPending = index > currentStepIndex; // 앞으로 올 단계

                return (
                  <li
                    key={step.id}
                    className="relative flex-1 flex items-center"
                  >
                    {/* 선(Line) - 첫번째 원 이전에는 그리지 않음 */}
                    {index > 0 && (
                      <div
                        className={`absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full ${
                          isCompleted ? 'bg-teal-600' : 'bg-gray-200'
                        }`}
                      />
                    )}

                    {/* 원형 아이콘 */}
                    <div
                      className={`
                        relative z-10 flex h-8 w-8 items-center justify-center rounded-full
                        ${
                          isCompleted
                            ? 'bg-teal-600 text-white'
                            : isActive
                              ? 'bg-teal-100 text-teal-800 border-2 border-teal-600'
                              : 'bg-white border-2 border-gray-300 text-gray-400'
                        }
                      `}
                    >
                      {isCompleted ? (
                        // 완료된 단계: 체크 아이콘
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
                        // 진행중/대기중 단계: 단계 번호
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>

                    {/* 단계 타이틀 */}
                    <div className="ml-3 text-left">
                      <p
                        className={`
                          text-sm font-semibold
                          ${
                            isActive
                              ? 'text-teal-700'
                              : isCompleted
                                ? 'text-teal-600'
                                : 'text-gray-500'
                          }
                        `}
                      >
                        {step.title}
                      </p>
                    </div>
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
