'use client';

import { useEffect, useState , useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface ProgressSegment {
  value: number;
  color?: string;
  label?: string;
}

interface AnimatedProgressBarProps {
  progress: number;
  max?: number;
  segments?: ProgressSegment[];
  height?: number;
  showLabel?: boolean;
  showPercentage?: boolean;
  label?: string;
  variant?: 'default' | 'gradient' | 'striped' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  duration?: number;
  className?: string;
  color?: string;
  backgroundColor?: string;
}

export function AnimatedProgressBar({
  progress,
  max = 100,
  segments,
  height,
  showLabel = false,
  showPercentage = true,
  label,
  variant = 'default',
  size = 'md',
  animated = true,
  duration = 1.5,
  className = '',
  color = '#3b82f6',
  backgroundColor = '#e5e7eb',
}: AnimatedProgressBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const percentage = Math.min((progress / max) * 100, 100);

  useEffect(() => {
    if (isInView && animated) {
      const timer = setTimeout(() => {
        setAnimatedProgress(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } if (!animated) {
      setAnimatedProgress(percentage);
    }
  }, [isInView, percentage, animated]);

  const getSizeStyles = () => {
    if (height) return { height: `${height}px` };
    
    switch (size) {
      case 'sm': return { height: '6px' };
      case 'lg': return { height: '16px' };
      default: return { height: '10px' };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-r from-blue-500 to-purple-600';
      case 'striped':
        return 'bg-blue-500 bg-striped';
      case 'glow':
        return 'bg-blue-500 shadow-blue-500/50 shadow-lg';
      default:
        return '';
    }
  };

  // Multi-segment progress bar
  if (segments && segments.length > 0) {
    let cumulativeValue = 0;
    
    return (
      <div ref={ref} className={`w-full ${className}`}>
        {(showLabel || label) && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              {label || 'Progress'}
            </span>
            {showPercentage && (
              <span className="text-sm text-gray-500">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}
        
        <div
          className="w-full rounded-full overflow-hidden"
          style={{ backgroundColor, ...getSizeStyles() }}
        >
          <div className="flex h-full">
            {segments.map((segment, index) => {
              const segmentPercentage = (segment.value / max) * 100;
              cumulativeValue += segment.value;
              
              return (
                <motion.div
                  key={index}
                  className="h-full flex items-center justify-center relative"
                  style={{ 
                    backgroundColor: segment.color || `hsl(${index * 60}, 70%, 60%)`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ 
                    width: isInView ? `${segmentPercentage}%` : 0 
                  }}
                  transition={{ 
                    duration, 
                    delay: index * 0.2,
                    ease: 'easeOut' 
                  }}
                >
                  {segment.label && size === 'lg' && (
                    <span className="text-xs text-white font-medium">
                      {segment.label}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
        
        {/* Segment labels below */}
        {segments.some(s => s.label) && (
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            {segments.map((segment, index) => (
              <span key={index}>{segment.label}</span>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Single progress bar
  return (
    <div ref={ref} className={`w-full ${className}`}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            {label || 'Progress'}
          </span>
          {showPercentage && (
            <motion.span 
              className="text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: duration }}
            >
              {Math.round(animatedProgress)}%
            </motion.span>
          )}
        </div>
      )}
      
      <div
        className="w-full rounded-full overflow-hidden relative"
        style={{ backgroundColor, ...getSizeStyles() }}
      >
        <motion.div
          className={`h-full rounded-full relative ${getVariantStyles()}`}
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${animatedProgress}%` }}
          transition={{ duration, ease: 'easeOut' }}
        >
          {variant === 'striped' && (
            <motion.div
              className="absolute inset-0 bg-striped-animation"
              animate={{ x: ['0%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          )}
          
          {variant === 'glow' && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Circular progress bar
export function CircularProgressBar({
  progress,
  max = 100,
  size = 120,
  strokeWidth = 8,
  showPercentage = true,
  label,
  color = '#3b82f6',
  backgroundColor = '#e5e7eb',
  animated = true,
  duration = 1.5,
  className = '',
}: {
  progress: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
  label?: string;
  color?: string;
  backgroundColor?: string;
  animated?: boolean;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min((progress / max) * 100, 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: isInView && animated ? strokeDashoffset : circumference
          }}
          transition={{ duration, ease: 'easeOut' }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          {showPercentage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.5 }}
              transition={{ duration: 0.5, delay: duration * 0.7 }}
              className="text-2xl font-bold text-gray-900"
            >
              {Math.round(percentage)}%
            </motion.div>
          )}
          {label && (
            <div className="text-sm text-gray-600 mt-1">{label}</div>
          )}
        </div>
      </div>
    </div>
  );
}

// Step progress bar
export function StepProgressBar({
  currentStep,
  totalSteps,
  steps,
  variant = 'default',
  size = 'md',
  className = '',
}: {
  currentStep: number;
  totalSteps: number;
  steps?: { label: string; description?: string }[];
  variant?: 'default' | 'numbers' | 'dots';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return { stepSize: 'w-6 h-6', text: 'text-xs' };
      case 'lg': return { stepSize: 'w-12 h-12', text: 'text-base' };
      default: return { stepSize: 'w-8 h-8', text: 'text-sm' };
    }
  };

  const { stepSize, text } = getSizeStyles();

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
                <motion.div
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
                </motion.div>
                
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
                  <motion.div
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