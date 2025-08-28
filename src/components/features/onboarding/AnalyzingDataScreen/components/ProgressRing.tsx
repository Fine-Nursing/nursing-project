import React from 'react';
import { m } from 'framer-motion';
import type { ProgressRingProps } from '../types';

export function ProgressRing({ 
  progress, 
  size = 200, 
  strokeWidth = 8,
  className = '' 
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI * 2;
  const dash = (progress * circumference) / 100;

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
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
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-slate-700"
        />
        
        {/* Progress circle */}
        <m.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - dash}
          className="text-emerald-500 dark:text-emerald-400"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - dash }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </svg>
      
      {/* Progress text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <m.span
          className="text-3xl font-bold text-gray-900 dark:text-white"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          key={Math.round(progress)}
        >
          {Math.round(progress)}%
        </m.span>
      </div>
    </div>
  );
}