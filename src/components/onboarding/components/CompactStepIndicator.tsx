import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Step {
  label: string;
  isCompleted: boolean;
  isActive: boolean;
}

interface CompactStepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (index: number) => void;
}

export default function CompactStepIndicator({
  steps,
  currentStep,
  onStepClick
}: CompactStepIndicatorProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Desktop view */}
      <div className="hidden sm:flex items-center justify-center">
        <div className="flex items-center gap-2">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <motion.button
                type="button"
                onClick={() => step.isCompleted || step.isActive ? onStepClick?.(index) : null}
                disabled={!step.isCompleted && !step.isActive}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full transition-all
                  ${step.isCompleted || step.isActive 
                    ? 'cursor-pointer' 
                    : 'cursor-not-allowed opacity-60'
                  }
                  ${step.isActive 
                    ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg' 
                    : step.isCompleted
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-500'
                  }
                `}
                whileHover={step.isCompleted || step.isActive ? { scale: 1.05 } : {}}
                whileTap={step.isCompleted || step.isActive ? { scale: 0.95 } : {}}
              >
                <motion.div
                  animate={{ 
                    rotate: step.isCompleted ? 360 : 0,
                    scale: step.isActive ? [1, 1.2, 1] : 1
                  }}
                  transition={{ 
                    rotate: { duration: 0.5 },
                    scale: { duration: 2, repeat: step.isActive ? Infinity : 0 }
                  }}
                >
                  {step.isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <div className={`
                      w-4 h-4 rounded-full border-2
                      ${step.isActive 
                        ? 'border-white bg-white/30' 
                        : 'border-current'
                      }
                    `} />
                  )}
                </motion.div>
                <span className="font-medium text-sm">{step.label}</span>
              </motion.button>
              
              {index < steps.length - 1 && (
                <div className="w-8 h-0.5 bg-gray-200 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600"
                    initial={{ x: '-100%' }}
                    animate={{ 
                      x: step.isCompleted ? '0%' : '-100%'
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Mobile view */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`
                flex-1 h-2 rounded-full mx-1
                ${step.isCompleted 
                  ? 'bg-green-500' 
                  : step.isActive 
                    ? 'bg-slate-600' 
                    : 'bg-gray-200'
                }
              `}
            />
          ))}
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-slate-900">
            Step {currentStep + 1}: {steps[currentStep]?.label}
          </p>
        </div>
      </div>
    </div>
  );
}