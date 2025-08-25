'use client';

import { useRef } from 'react';
import { m, useInView } from 'framer-motion';
import type { CircularProgressBarProps } from '../types';
import { calculatePercentage } from '../utils';

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
}: CircularProgressBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = calculatePercentage(progress, max);
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
        <m.circle
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
            <m.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.5 }}
              transition={{ duration: 0.5, delay: duration * 0.7 }}
              className="text-2xl font-bold text-gray-900"
            >
              {Math.round(percentage)}%
            </m.div>
          )}
          {label && (
            <div className="text-sm text-gray-600 mt-1">{label}</div>
          )}
        </div>
      </div>
    </div>
  );
}