'use client';

import { m } from 'framer-motion';

interface StepItem {
  label: string;
  isCompleted: boolean;
  isActive: boolean;
}

interface CompactStepIndicatorProps {
  steps: StepItem[];
  currentStep: number;
  onStepClick?: (index: number) => void;
}

export default function CompactStepIndicator({
  steps,
  currentStep,
  onStepClick
}: CompactStepIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-6 sm:mb-8 px-2 sm:px-4">
      <div className="flex items-center gap-2 sm:gap-3 w-full justify-center">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-shrink-0">
            <div className="flex flex-col items-center">
              <m.div
                className={`relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 ${
                  step.isCompleted
                    ? 'bg-emerald-500 shadow-md'
                    : step.isActive
                    ? 'bg-emerald-50 border-2 border-emerald-500'
                    : 'bg-gray-50 border border-gray-300'
                }`}
                onClick={() => onStepClick?.(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ cursor: onStepClick ? 'pointer' : 'default' }}
              >
                {step.isCompleted ? (
                  <m.svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </m.svg>
                ) : (
                  <span className={`text-xs sm:text-sm font-bold ${
                    step.isActive ? 'text-emerald-600' : 'text-gray-500'
                  }`}>
                    {index + 1}
                  </span>
                )}
              </m.div>

              {/* Show labels on mobile too but smaller */}
              <div className="mt-1 sm:mt-2">
                <div className={`text-[10px] sm:text-xs font-medium text-center max-w-[50px] sm:max-w-none ${
                  step.isActive ? 'text-emerald-700' : step.isCompleted ? 'text-emerald-600' : 'text-gray-500'
                }`}>
                  {step.label.length > 8 ? step.label.substring(0, 8) + '...' : step.label}
                </div>
              </div>
            </div>

            {index < steps.length - 1 && (
              <m.div
                className={`h-0.5 w-8 sm:w-12 mx-2 sm:mx-4 rounded-full transition-all duration-300 ${
                  step.isCompleted ? 'bg-emerald-400' : 'bg-gray-200'
                }`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: step.isCompleted ? 1 : 0.3 }}
                transition={{ duration: 0.5 }}
                style={{ marginTop: '16px' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}