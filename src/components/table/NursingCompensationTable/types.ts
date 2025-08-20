import type { NursingPosition } from 'src/types/nursing';
import type { Column } from 'react-table';
import type { ColumnId } from './CustomizePanel';

export interface NursingCompensationTableProps {
  data: NursingPosition[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
}

export interface TableControlsProps {
  viewMode: 'table' | 'compact';
  onViewModeChange: (mode: 'table' | 'compact') => void;
  showCustomize: boolean;
  onShowCustomizeChange: (show: boolean) => void;
}

export interface PaginationProps {
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
}

export interface TableState {
  viewMode: 'table' | 'compact';
  showCustomize: boolean;
  activeColumns: ColumnId[];
}

export type { ColumnId } from './CustomizePanel';