'use client';

import React, { useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import { m } from 'framer-motion';

import type { NursingPosition } from 'src/types/nursing';
import type { NursingCompensationTableProps } from './types';

import CustomizePanel from './CustomizePanel';
import TableView from './TableView';
import CompactView from './CompactView';
import MobileCompensationCard from './MobileCompensationCard';
import ResponsiveWrapper from './ResponsiveWrapper';
import { TableControls } from './components/TableControls';
import { TablePagination } from './components/TablePagination';
import { useTableState } from './hooks/useTableState';
import { useTableColumns } from './hooks/useTableColumns';

export default function NursingCompensationTable({
  data,
  meta,
  onPageChange,
}: NursingCompensationTableProps) {
  const {
    viewMode,
    setViewMode,
    showCustomize,
    setShowCustomize,
    activeColumns,
    setActiveColumns,
  } = useTableState();

  const { columns } = useTableColumns(activeColumns);
  const tableData = useMemo<NursingPosition[]>(() => data || [], [data]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable<NursingPosition>(
      {
        columns,
        data: tableData,
      },
      useSortBy
    );

  return (
    <m.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-4"
    >
      <TableControls
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showCustomize={showCustomize}
        onShowCustomizeChange={setShowCustomize}
      />

      {showCustomize && (
        <CustomizePanel
          activeColumns={activeColumns}
          setActiveColumns={setActiveColumns}
          allColumns={[
            { Header: 'ID', accessor: 'id' as any },
            { Header: 'Specialty', accessor: 'specialty' as any },
            { Header: 'Location', accessor: 'location' as any },
            { Header: 'Exp.', accessor: 'experience' as any },
            { Header: 'Shift', accessor: 'shiftType' as any },
            { Header: 'Pay/Hr', accessor: 'compensation' as any },
          ]}
          setShowCustomize={setShowCustomize}
        />
      )}

      <ResponsiveWrapper
        mobileContent={
          <div className="space-y-3 w-full max-w-full">
            {rows.map((row) => {
              prepareRow(row);
              return (
                <MobileCompensationCard
                  key={row.id || `row-${row.index}`}
                  position={row.original}
                />
              );
            })}
          </div>
        }
        desktopContent={
          <div className="shadow-xl ring-1 ring-blue-200/50 ring-opacity-20 rounded-2xl bg-white/50 backdrop-blur-sm border border-blue-100/30 overflow-hidden">
            <div className="w-full overflow-hidden">
              {viewMode === 'table' ? (
                <TableView
                  headerGroups={headerGroups}
                  page={rows}
                  prepareRow={prepareRow}
                  getTableProps={getTableProps}
                  getTableBodyProps={getTableBodyProps}
                />
              ) : (
                <CompactView page={rows} prepareRow={prepareRow} />
              )}
            </div>
          </div>
        }
      />

      <TablePagination meta={meta} onPageChange={onPageChange} />
    </m.div>
  );
}