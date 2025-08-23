import { TrendingUp, Activity, Award, Target, BarChart3 } from 'lucide-react';

export interface RadarAnalyticsProps {
  userMetrics: Record<string, number>;
  avgMetrics: Record<string, number>;
  theme: 'light' | 'dark';
  metricAnalysis: Record<string, string>;
  userId?: string;
  isLoading?: boolean;
  error?: Error | null;
}

export interface RadarPoint {
  x: number;
  y: number;
  label?: string;
  value?: number;
}

export interface MetricCardProps {
  category: string;
  userValue: number;
  avgValue: number;
  theme: 'light' | 'dark';
  isSelected: boolean;
  onSelect: () => void;
}

// Simplified metric display names - shortened for card display
export const metricDisplayNames: Record<string, string> = {
  'totalCompensation': 'Pay',
  'workload': 'Load',
  'experienceLevel': 'Exp.',
  'careerGrowth': 'Growth',
  'marketCompetitiveness': 'Market',
};

// Metric icons
export const metricIcons: Record<string, any> = {
  'totalCompensation': TrendingUp,
  'workload': Activity,
  'experienceLevel': Award,
  'careerGrowth': Target,
  'marketCompetitiveness': BarChart3,
};