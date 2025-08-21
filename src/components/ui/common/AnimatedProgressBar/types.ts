export interface ProgressSegment {
  value: number;
  color?: string;
  label?: string;
}

export interface AnimatedProgressBarProps {
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

export interface CircularProgressBarProps {
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
}

export interface StepProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps?: { label: string; description?: string }[];
  variant?: 'default' | 'numbers' | 'dots';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}