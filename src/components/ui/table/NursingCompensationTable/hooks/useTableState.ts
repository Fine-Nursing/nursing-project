import { useState } from 'react';
import type { ColumnId } from '../CustomizePanel';
import type { TableState } from '../types';

export function useTableState() {
  const [viewMode, setViewMode] = useState<'table' | 'compact'>('table');
  const [showCustomize, setShowCustomize] = useState(false);
  const [activeColumns, setActiveColumns] = useState<ColumnId[]>([
    'id',
    'specialty',
    'location',
    'experience',
    'shiftType',
    'compensation',
  ]);

  return {
    viewMode,
    setViewMode,
    showCustomize,
    setShowCustomize,
    activeColumns,
    setActiveColumns,
  };
}