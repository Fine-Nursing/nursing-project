'use client';

import { motion } from 'framer-motion';

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
    <div className="flex items-center justify-center mb-8 px-4">
      <div className="flex items-center gap-3 overflow-x-auto max-w-full">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start flex-shrink-0">
            <div className="flex flex-col items-center">
              <motion.div
                className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                  step.isCompleted
                    ? 'bg-emerald-500 shadow-lg shadow-emerald-200'
                    : step.isActive
                    ? 'bg-emerald-50 border-2 border-emerald-500 shadow-md'
                    : 'bg-gray-50 border-2 border-gray-200'
                }`}
                onClick={() => onStepClick?.(index)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{ cursor: onStepClick ? 'pointer' : 'default' }}
              >
                {step.isCompleted ? (
                  <motion.svg
                    className="w-5 h-5 text-white"
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
                  </motion.svg>
                ) : (
                  <span className={`text-sm font-bold ${
                    step.isActive ? 'text-emerald-600' : 'text-gray-500'
                  }`}>
                    {index + 1}
                  </span>
                )}
              </motion.div>
              
              <div className="mt-2 hidden sm:block">
                <div className={`text-xs font-medium text-center ${
                  step.isActive ? 'text-emerald-700' : step.isCompleted ? 'text-emerald-600' : 'text-gray-500'
                }`}>
                  {step.label}
                </div>
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <motion.div
                className={`mt-5 mx-4 sm:mx-6 h-0.5 w-12 sm:w-16 rounded-full transition-all duration-300 ${
                  step.isCompleted ? 'bg-emerald-400' : 'bg-gray-200'
                }`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: step.isCompleted ? 1 : 0.3 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}