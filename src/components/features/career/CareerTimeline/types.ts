import type { CareerItem } from '../types';

export interface CareerTimelineProps {
  theme: 'light' | 'dark';
  careerData: CareerItem[];
  filteredAndSortedCareerData: CareerItem[];
  highestHourlyRate: number;
  setFormVisible: (visible: boolean) => void;
  filterRole: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export interface TimelineItemProps {
  item: CareerItem;
  theme: 'light' | 'dark';
  index: number;
  totalItems: number;
  filteredAndSortedCareerData: CareerItem[];
  highestHourlyRate: number;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export interface EmptyStateProps {
  theme: 'light' | 'dark';
  careerData: CareerItem[];
  filterRole: string;
  setFormVisible: (visible: boolean) => void;
}

export interface CareerProgressionChartProps {
  theme: 'light' | 'dark';
  filteredAndSortedCareerData: CareerItem[];
}

export interface ChartDataItem extends CareerItem {
  xLabel: string;
  index: number;
}

export interface CareerStatisticsProps {
  theme: 'light' | 'dark';
  lineData: ChartDataItem[];
}