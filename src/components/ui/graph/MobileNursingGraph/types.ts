import type { ExperienceGroup } from 'src/types/common';

export interface MiniBarChartProps {
  value: number;
  maxValue: number;
  label: string;
  highlighted?: boolean;
}

export interface SpecialtyListItemProps {
  specialty: string;
  data: any;
  rank: number;
  onClick: () => void;
  isSelected: boolean;
}

export interface ExperienceTabsProps {
  selected: ExperienceGroup[];
  onChange: (levels: ExperienceGroup[]) => void;
}

export interface StatsData {
  max: number;
  min: number;
  avg: number;
}

export interface DetailModalProps {
  selectedSpecialty: string | null;
  selectedSpecialtyData: any;
  onClose: () => void;
}

export interface HeaderSectionProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedExperience: ExperienceGroup[];
  onExperienceChange: (levels: ExperienceGroup[]) => void;
  viewMode: 'list' | 'chart';
  onViewModeChange: (mode: 'list' | 'chart') => void;
}