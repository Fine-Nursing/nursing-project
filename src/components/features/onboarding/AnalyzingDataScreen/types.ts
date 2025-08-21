export interface AnalysisStep {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  metrics: string;
  duration: number;
}

export interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export interface AnalysisStepProps {
  step: AnalysisStep;
  isActive: boolean;
  isCompleted: boolean;
  index: number;
}

export interface FloatingParticlesProps {
  count?: number;
  isDark: boolean;
}

export interface AnalyzingDataScreenProps {
  userId?: string;
}