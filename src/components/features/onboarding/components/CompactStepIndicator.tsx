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
    <div className="flex items-center justify-center gap-4 mb-6">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <motion.div
            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 cursor-pointer transition-all duration-200 ${
              step.isCompleted
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : step.isActive
                ? 'bg-white border-emerald-500 text-emerald-500'
                : 'bg-gray-100 border-gray-300 text-gray-500'
            }`}
            onClick={() => onStepClick?.(index)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {step.isCompleted ? (
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <span className="text-sm font-semibold">{index + 1}</span>
            )}
          </motion.div>
          <span
            className={`ml-2 text-sm font-medium ${
              step.isActive ? 'text-emerald-600' : 'text-gray-500'
            }`}
          >
            {step.label}
          </span>
          {index < steps.length - 1 && (
            <div
              className={`mx-4 h-px w-8 ${
                step.isCompleted ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}