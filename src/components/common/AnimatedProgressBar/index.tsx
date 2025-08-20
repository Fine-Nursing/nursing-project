'use client';

import { LinearProgressBar } from './components/LinearProgressBar';
import { SegmentedProgressBar } from './components/SegmentedProgressBar';
import { CircularProgressBar } from './components/CircularProgressBar';
import { StepProgressBar } from './components/StepProgressBar';
import type { AnimatedProgressBarProps, CircularProgressBarProps, StepProgressBarProps } from './types';

// Main AnimatedProgressBar component that handles both single and segmented progress
export function AnimatedProgressBar(props: AnimatedProgressBarProps) {
  // Multi-segment progress bar
  if (props.segments && props.segments.length > 0) {
    return <SegmentedProgressBar {...props} segments={props.segments} />;
  }

  // Single progress bar
  return <LinearProgressBar {...props} />;
}

// Re-export all progress bar components
export { CircularProgressBar, StepProgressBar };

// Re-export types
export type {
  AnimatedProgressBarProps,
  CircularProgressBarProps,
  StepProgressBarProps,
  ProgressSegment,
} from './types';