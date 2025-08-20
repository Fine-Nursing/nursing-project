'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { ProgressSegment } from '../types';
import { getSizeStyles, calculatePercentage } from '../utils';

interface SegmentedProgressBarProps {
  segments: ProgressSegment[];
  max?: number;
  height?: number;
  showLabel?: boolean;
  showPercentage?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  duration?: number;
  className?: string;
  backgroundColor?: string;
}

export function SegmentedProgressBar({
  segments,
  max = 100,
  height,
  showLabel = false,
  showPercentage = true,
  label,
  size = 'md',
  duration = 1.5,
  className = '',
  backgroundColor = '#e5e7eb',
}: SegmentedProgressBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  
  const totalProgress = segments.reduce((sum, segment) => sum + segment.value, 0);
  const percentage = calculatePercentage(totalProgress, max);
  
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
        style={{ backgroundColor, ...getSizeStyles(size, height) }}
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