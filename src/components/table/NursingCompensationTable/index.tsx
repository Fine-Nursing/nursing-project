'use client';

import React, { useMemo, useState } from 'react';
import type { Column, CellProps, Row } from 'react-table';
import { useTable, useSortBy } from 'react-table';
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
  return <span className="font-medium">User {value.slice(-4)}</span>;
}

function ShiftCell({
  value,
}: CellProps<NursingPosition, NursingPosition['shift']>) {
  const shiftColors = {
    Day: 'bg-yellow-100 text-yellow-800',
    Night: 'bg-blue-100 text-blue-800',
    Evening: 'bg-purple-100 text-purple-800',
    Rotating: 'bg-gray-100 text-gray-800',
  };

  const bgColor = shiftColors[value] || 'bg-gray-100 text-gray-800';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}
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
                    bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl min-w-[200px]`}
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
        Header: 'User',
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
        Header: 'Experience',
        accessor: 'experience',
        Cell: ExperienceCell,
      },
      {
        Header: 'Shift',
        accessor: 'shift',
        Cell: ShiftCell,
      },
      {
        Header: 'Compensation',
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setShowCustomize(!showCustomize)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Settings2 className="w-4 h-4 mr-2" />
            Customize Columns
          </button>
          <div className="flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 rounded-l-md border text-sm font-medium ${
                viewMode === 'table'
                  ? 'bg-purple-100 text-purple-700 border-purple-500'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Layout className="w-4 h-4 inline mr-2" />
              Table
            </button>
            <button
              type="button"
              onClick={() => setViewMode('compact')}
              className={`px-3 py-2 rounded-r-md border text-sm font-medium ${
                viewMode === 'compact'
                  ? 'bg-purple-100 text-purple-700 border-purple-500'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <List className="w-4 h-4 inline mr-2" />
              Compact
            </button>
          </div>
        </div>
      </div>

      {showCustomize && (
        <CustomizePanel
          activeColumns={activeColumns}
          setActiveColumns={setActiveColumns}
          allColumns={[
            { Header: 'User', accessor: 'id' as ColumnId },
            { Header: 'Specialty', accessor: 'specialty' as ColumnId },
            { Header: 'Location', accessor: 'location' as ColumnId },
            { Header: 'Experience', accessor: 'experience' as ColumnId },
            { Header: 'Shift', accessor: 'shiftType' as ColumnId },
            { Header: 'Compensation', accessor: 'compensation' as ColumnId },
          ]}
          setShowCustomize={setShowCustomize}
        />
      )}

      <div className="shadow ring-1 ring-black ring-opacity-5 rounded-lg overflow-x-auto">
        <div style={{ minWidth: '1200px' }}>
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

      <div className="flex items-center justify-between">
        <div>
          {meta && (
            <p className="text-sm text-gray-700">
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
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handlePreviousPage}
            disabled={!meta || meta.page <= 1}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
