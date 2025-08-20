import type { CompensationCard } from 'src/types/dashboard';

export interface MobileCardBoardProps {
  filters: {
    specialty?: string;
    state?: string;
    city?: string;
  };
  onFiltersChange?: (filters: any) => void;
}

export interface MetricCardProps {
  label: string;
  value: string;
  change?: number;
  sublabel?: string;
}

export interface CompensationCardProps {
  card: CompensationCard;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

export interface FilterBadgeProps {
  label: string;
  value: string;
  onRemove: () => void;
}

export type ExperienceLevel = 'beginner' | 'junior' | 'experienced' | 'senior';