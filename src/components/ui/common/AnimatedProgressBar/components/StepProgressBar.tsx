'use client';

import { m } from 'framer-motion';
import type { StepProgressBarProps } from '../types';
import { getStepSizeStyles } from '../utils';

export function StepProgressBar({
  currentStep,
  totalSteps,
  steps,
  variant = 'default',
  size = 'md',
  className = '',
}: StepProgressBarProps) {
  const { stepSize, text } = getStepSizeStyles(size);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const step = steps?.[index];

          return (
            <div key={index} className="flex items-center flex-1">
              {/* Step indicator */}
              <div className="relative">
                <m.div
                  className={`
                    ${stepSize} rounded-full flex items-center justify-center font-medium
                    ${isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isCurrent 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }
                  `}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {variant === 'numbers' ? (
                    stepNumber
                  ) : variant === 'dots' ? (
                    <div className="w-2 h-2 bg-current rounded-full" />
                  ) : isCompleted ? (
                    '✓'
                  ) : (
                    stepNumber
                  )}
                </m.div>
                
                {/* Step label */}
                {step && (
                  <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 text-center">
                    <div className={`font-medium ${text}`}>{step.label}</div>
                    {step.description && (
                      <div className="text-xs text-gray-500 mt-1">{step.description}</div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Connector line */}
              {index < totalSteps - 1 && (
                <div className="flex-1 h-0.5 mx-2 bg-gray-200 relative overflow-hidden">
                  <m.div
                    className="absolute inset-y-0 left-0 bg-green-500"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: isCompleted ? '100%' : '0%' 
                    }}
                    transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}