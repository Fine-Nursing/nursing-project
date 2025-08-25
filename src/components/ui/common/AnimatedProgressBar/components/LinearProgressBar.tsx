'use client';

import { useEffect, useState, useRef } from 'react';
import { m, useInView } from 'framer-motion';
import type { AnimatedProgressBarProps } from '../types';
import { getSizeStyles, getVariantStyles, calculatePercentage } from '../utils';

export function LinearProgressBar({
  progress,
  max = 100,
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
}: Omit<AnimatedProgressBarProps, 'segments'>) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const percentage = calculatePercentage(progress, max);

  useEffect(() => {
    if (isInView && animated) {
      const timer = setTimeout(() => {
        setAnimatedProgress(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else if (!animated) {
      setAnimatedProgress(percentage);
    }
  }, [isInView, percentage, animated]);

  return (
    <div ref={ref} className={`w-full ${className}`}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            {label || 'Progress'}
          </span>
          {showPercentage && (
            <m.span 
              className="text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: duration }}
            >
              {Math.round(animatedProgress)}%
            </m.span>
          )}
        </div>
      )}
      
      <div
        className="w-full rounded-full overflow-hidden relative"
        style={{ backgroundColor, ...getSizeStyles(size, height) }}
      >
        <m.div
          className={`h-full rounded-full relative ${getVariantStyles(variant)}`}
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${animatedProgress}%` }}
          transition={{ duration, ease: 'easeOut' }}
        >
          {variant === 'striped' && (
            <m.div
              className="absolute inset-0 bg-striped-animation"
              animate={{ x: ['0%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          )}
          
          {variant === 'glow' && (
            <m.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          )}
        </m.div>
      </div>
    </div>
  );
}