'use client';

import React, { useMemo, useState } from 'react';
import type { Column, CellProps, Row } from 'react-table';
import { useTable, useSortBy } from 'react-table';
import { motion } from 'framer-motion';
import {
  Settings2,
  Layout,
  List,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import type { NursingPosition } from 'src/types/nursing';
import type { ColumnId } from './CustomizePanel';

import CustomizePanel from './CustomizePanel';
import TableView from './TableView';
import CompactView from './CompactView';
import MobileCompensationCard from './MobileCompensationCard';
import ResponsiveWrapper from './ResponsiveWrapper';

interface NursingCompensationTableProps {
  data: NursingPosition[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
}

function UserCell({ value }: CellProps<NursingPosition, string>) {
  if (!value) return <span className="text-gray-400">-</span>;
  return <span className="font-medium text-sm">#{value.slice(-4)}</span>;
}

function ShiftCell({
  value,
}: CellProps<NursingPosition, NursingPosition['shift']>) {
  const shiftColors = {
    Day: 'bg-yellow-100 text-yellow-800',
    Night: 'bg-blue-100 text-blue-800',
    Evening: 'bg-zinc-100 text-zinc-800',
    Rotating: 'bg-gray-100 text-gray-800',
  };

  const bgColor = shiftColors[value] || 'bg-gray-100 text-gray-800';

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bgColor}`}
    >
      {value}
    </span>
  );
}

function CombinedPayCell({ row }: { row: Row<NursingPosition> }) {
  const { compensation } = row.original;
  const [isNearBottom, setIsNearBottom] = React.useState(false);

  if (!compensation) {
    return <div className="text-gray-500">N/A</div>;
  }

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    setIsNearBottom(rect.bottom > viewportHeight - 300);
  };

  return (
    <div className="relative group" onMouseEnter={handleMouseEnter}>
      <div className="font-bold text-green-600 cursor-pointer">
        ${compensation.hourly?.toLocaleString() || 0}/hr
      </div>

      <div
        className={`absolute z-[100] invisible group-hover:visible opacity-0 group-hover:opacity-100 
                    transition-all duration-200 
                    ${
                      isNearBottom
                        ? 'bottom-full right-0 mb-2'
                        : 'top-0 right-full mr-2'
                    }
                    bg-gray-900 text-white text-xs rounded-lg px-2 py-1 shadow-xl min-w-[180px]`}
      >
        <div
          className={`absolute border-4 border-transparent
                      ${
                        isNearBottom
                          ? 'top-full right-4 border-t-gray-900'
                          : 'top-3 -right-1 border-l-gray-900'
                      }`}
        />

        <div className="space-y-2">
          <div className="font-semibold text-sm border-b border-gray-700 pb-1">
            Total: ${compensation.hourly || 0}/hr
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span>Base Pay:</span>
              <span className="font-medium">
                ${compensation.basePay || 0}/hr
              </span>
            </div>

            {(compensation.totalDifferential || 0) > 0 && (
              <>
                <div className="flex justify-between items-center text-blue-300">
                  <span>Differentials:</span>
                  <span className="font-medium">
                    ${compensation.totalDifferential || 0}/hr
                  </span>
                </div>

                {compensation.differentialBreakdown &&
                  compensation.differentialBreakdown.length > 0 && (
                    <div className="ml-2 space-y-0.5 text-gray-300">
                      {compensation.differentialBreakdown.map((diff) => (
                        <div
                          key={`${diff.type}-${diff.amount}`}
                          className="flex justify-between items-center text-xs"
                        >
                          <span>• {diff.type}:</span>
                          <span>+${diff.amount || 0}/hr</span>
                        </div>
                      ))}
                    </div>
                  )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExperienceCell({ value }: CellProps<NursingPosition, string>) {
  return <span className="text-sm text-gray-900">{value}</span>;
}

export default function NursingCompensationTable({
  data,
  meta,
  onPageChange,
}: NursingCompensationTableProps) {
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

  const tableData = useMemo<NursingPosition[]>(() => data || [], [data]);

  const allColumns = useMemo<Column<NursingPosition>[]>(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        Cell: UserCell,
      },
      {
        Header: 'Specialty',
        accessor: 'specialty',
      },
      {
        Header: 'Location',
        accessor: 'location',
      },
      {
        Header: 'Exp.',
        accessor: 'experience',
        Cell: ExperienceCell,
      },
      {
        Header: 'Shift',
        accessor: 'shift',
        Cell: ShiftCell,
      },
      {
        Header: 'Pay/Hr',
        accessor: (row) => row.compensation?.hourly || 0,
        Cell: CombinedPayCell,
        id: 'compensation',
      },
    ],
    []
  );

  const columns = useMemo<Column<NursingPosition>[]>(
    () =>
      activeColumns
        .map((colId) => {
          if (colId === 'shiftType') {
            return allColumns.find(
              (col) => col.id === 'shift' || col.accessor === 'shift'
            );
          }
          return allColumns.find(
            (col) => col.id === colId || col.accessor === colId
          );
        })
        .filter(Boolean) as Column<NursingPosition>[],
    [allColumns, activeColumns]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable<NursingPosition>(
      {
        columns,
        data: tableData,
      },
      useSortBy
    );

  const handlePreviousPage = () => {
    if (meta && meta.page > 1 && onPageChange) {
      onPageChange(meta.page - 1);
    }
  };

  const handleNextPage = () => {
    if (meta && meta.page < meta.totalPages && onPageChange) {
      onPageChange(meta.page + 1);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-4"
    >
      {/* Desktop controls - hidden on mobile */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="hidden md:flex justify-between items-center"
      >
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setShowCustomize(!showCustomize)}
            className="inline-flex items-center px-3 py-2 border border-blue-200 rounded-xl shadow-sm text-sm font-medium text-blue-700 bg-white/80 backdrop-blur-sm hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
          >
            <Settings2 className="w-4 h-4 mr-2" />
            Customize Columns
          </button>
          <div className="flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 rounded-l-xl border text-sm font-medium transition-all duration-200 ${
                viewMode === 'table'
                  ? 'bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 border-blue-300 shadow-sm'
                  : 'border-blue-200 text-blue-600 hover:bg-blue-50 bg-white/80 backdrop-blur-sm'
              }`}
            >
              <Layout className="w-4 h-4 inline mr-2" />
              Table
            </button>
            <button
              type="button"
              onClick={() => setViewMode('compact')}
              className={`px-3 py-2 rounded-r-xl border text-sm font-medium transition-all duration-200 ${
                viewMode === 'compact'
                  ? 'bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 border-blue-300 shadow-sm'
                  : 'border-blue-200 text-blue-600 hover:bg-blue-50 bg-white/80 backdrop-blur-sm'
              }`}
            >
              <List className="w-4 h-4 inline mr-2" />
              Compact
            </button>
          </div>
        </div>
      </motion.div>

      {showCustomize && (
        <CustomizePanel
          activeColumns={activeColumns}
          setActiveColumns={setActiveColumns}
          allColumns={[
            { Header: 'ID', accessor: 'id' as ColumnId },
            { Header: 'Specialty', accessor: 'specialty' as ColumnId },
            { Header: 'Location', accessor: 'location' as ColumnId },
            { Header: 'Exp.', accessor: 'experience' as ColumnId },
            { Header: 'Shift', accessor: 'shiftType' as ColumnId },
            { Header: 'Pay/Hr', accessor: 'compensation' as ColumnId },
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

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          {meta && (
            <p className="text-sm text-gray-700 text-center md:text-left">
              Showing{' '}
              <span className="font-medium">
                {(meta.page - 1) * meta.limit + 1}
              </span>{' '}
              to{' '}
              <span className="font-medium">
                {Math.min(meta.page * meta.limit, meta.total)}
              </span>{' '}
              of <span className="font-medium">{meta.total}</span> results
            </p>
          )}
        </div>
        <div className="flex items-center justify-center md:justify-end space-x-2">
          <button
            type="button"
            onClick={handlePreviousPage}
            disabled={!meta || meta.page <= 1}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-zinc-600 text-sm font-medium rounded-md text-gray-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {meta && (
            <span className="px-3 py-2 text-sm">
              Page {meta.page} of {meta.totalPages}
            </span>
          )}

          <button
            type="button"
            onClick={handleNextPage}
            disabled={!meta || meta.page >= meta.totalPages}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-zinc-600 text-sm font-medium rounded-md text-gray-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
