import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  isActive: boolean;
}

interface StepTransitionProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

export default function StepTransition({ 
  steps, 
  currentStep,
  onStepClick 
}: StepTransitionProps) {
  return (
    <div className="w-full">
      {/* Mobile view - horizontal compact */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between px-2">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{ 
                    scale: step.isActive ? 1.1 : 1
                  }}
                  transition={{ duration: 0.3 }}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${step.isCompleted 
                      ? 'bg-emerald-500 text-white' 
                      : step.isActive 
                        ? 'bg-emerald-100 border-2 border-emerald-500 text-emerald-600'
                        : 'bg-gray-100 border-2 border-gray-300 text-gray-400'
                    }
                  `}
                >
                  {step.isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </motion.div>
                <p className={`
                  mt-1 text-[10px] font-medium text-center max-w-[60px]
                  ${step.isActive 
                    ? 'text-emerald-600' 
                    : step.isCompleted 
                      ? 'text-gray-700'
                      : 'text-gray-400'
                  }
                `}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-gray-200 mx-1">
                  <motion.div
                    className="h-full bg-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: step.isCompleted ? '100%' : '0%'
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Desktop view - horizontal */}
      <div className="hidden sm:flex items-center justify-center">
        <div className="flex items-center justify-between max-w-2xl w-full px-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
          <div className="flex items-center">
            <motion.button
              type="button"
              onClick={() => onStepClick?.(index)}
              disabled={!step.isCompleted && !step.isActive}
              className={`
                relative flex flex-col items-center text-center
                ${(step.isCompleted || step.isActive) ? 'cursor-pointer' : 'cursor-not-allowed'}
              `}
              whileHover={(step.isCompleted || step.isActive) ? { scale: 1.05 } : {}}
              whileTap={(step.isCompleted || step.isActive) ? { scale: 0.95 } : {}}
            >
              {/* Step circle */}
              <motion.div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  ${step.isCompleted 
                    ? 'bg-slate-600 text-white' 
                    : step.isActive 
                      ? 'bg-slate-100 border-[3px] border-slate-600 text-slate-600'
                      : 'bg-gray-100 border-[3px] border-gray-300 text-gray-400'
                  }
                `}
                animate={{ 
                  scale: step.isActive ? [1, 1.1, 1] : 1,
                }}
                transition={{ 
                  duration: 2,
                  repeat: step.isActive ? Infinity : 0,
                  repeatType: "reverse"
                }}
              >
                {step.isCompleted ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <span className="text-lg font-semibold">{index + 1}</span>
                )}
              </motion.div>

              {/* Step title */}
              <motion.p
                className={`
                  mt-2 text-sm font-medium
                  ${step.isActive 
                    ? 'text-slate-900' 
                    : step.isCompleted 
                      ? 'text-slate-600'
                      : 'text-gray-400'
                  }
                `}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {step.title}
              </motion.p>

              {/* Description */}
              {step.description && step.isActive && (
                <motion.p
                  className="mt-1 text-xs text-gray-500 max-w-[120px]"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {step.description}
                </motion.p>
              )}
            </motion.button>

          </div>
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4">
                <div className="relative h-0.5 bg-gray-200">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-slate-600"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: step.isCompleted ? '100%' : '0%'
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                  {step.isCompleted && (
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 right-0"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <ArrowRight className="w-4 h-4 text-slate-600" />
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
        </div>
      </div>
    </div>
  );
}