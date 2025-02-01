'use client';

import React, { useMemo, useState } from 'react';
import { useTable, useFilters, useSortBy, usePagination } from 'react-table';
import {
  Settings2,
  Layout,
  List,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import type {
  Column,
  CellProps,
  TableInstance,
  UseFiltersInstanceProps,
  UseFiltersState,
  UseSortByInstanceProps,
  UseSortByState,
  UsePaginationInstanceProps,
  UsePaginationState,

  // ↓ 초기 상태를 캐스팅할 때 필요한 TableState
  TableState,
} from 'react-table';
import type { ColumnId } from './CustomizePanel';

import CustomizePanel from './CustomizePanel';
import TableView from './TableView';
import CompactView from './CompactView';

interface Nurse {
  user: string;
  specialty: string;
  location: string;
  experience: number | string;
  shiftType: 'Day' | 'Night';
  basePay: number;
  differentials: number;
  totalPay: number;
}

interface NursingCompensationTableProps {
  initialData: Omit<Nurse, 'totalPay'>[];
  pageSize?: number;
}

type EnhancedTableInstance<T extends object> = TableInstance<T> &
  UseFiltersInstanceProps<T> &
  UseSortByInstanceProps<T> &
  UsePaginationInstanceProps<T> & {
    state: UseFiltersState<T> & UseSortByState<T> & UsePaginationState<T>;
  };

function UserCell({ value }: CellProps<Nurse, Nurse['user']>) {
  return <span className="font-medium">{value}</span>;
}

function ShiftCell({ value }: CellProps<Nurse, Nurse['shiftType']>) {
  const isDay = value === 'Day';
  const bgColor = isDay
    ? 'bg-green-100 text-green-800'
    : 'bg-blue-100 text-blue-800';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}
    >
      {value}
    </span>
  );
}

function BasePayCell({ value }: CellProps<Nurse, Nurse['basePay']>) {
  return <span className="font-medium">${value.toLocaleString()}</span>;
}

function DifferentialsCell({
  value,
}: CellProps<Nurse, Nurse['differentials']>) {
  return <span>${value.toLocaleString()}</span>;
}

function TotalPayCell({ value }: CellProps<Nurse, Nurse['totalPay']>) {
  return (
    <span className="font-medium text-green-600">
      ${value.toLocaleString()}
    </span>
  );
}

export default function NursingCompensationTable({
  initialData,
  pageSize: initialPageSize = 10,
}: NursingCompensationTableProps) {
  const [viewMode, setViewMode] = useState<'table' | 'compact'>('table');
  const [showCustomize, setShowCustomize] = useState(false);
  const [activeColumns, setActiveColumns] = useState<ColumnId[]>([
    'user',
    'specialty',
    'location',
    'experience',
    'shiftType',
    'basePay',
    'differentials',
    'totalPay',
  ]);

  // totalPay 미리 계산
  const data = useMemo<Nurse[]>(
    () =>
      initialData.map((nurse) => ({
        ...nurse,
        totalPay: nurse.basePay + nurse.differentials,
      })),
    [initialData]
  );

  // 모든 컬럼 정의
  const allColumns = useMemo<Column<Nurse>[]>(
    () => [
      {
        Header: 'User',
        accessor: 'user',
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
      },
      {
        Header: 'Shift',
        accessor: 'shiftType',
        Cell: ShiftCell,
      },
      {
        Header: 'Base Pay',
        accessor: 'basePay',
        Cell: BasePayCell,
      },
      {
        Header: 'Differentials',
        accessor: 'differentials',
        Cell: DifferentialsCell,
      },
      {
        Header: 'Total Pay',
        accessor: 'totalPay',
        Cell: TotalPayCell,
      },
    ],
    []
  );

  // 현재 활성화된 컬럼만
  const columns = useMemo<Column<Nurse>[]>(
    () =>
      activeColumns
        .map((colId) => allColumns.find((col) => col.accessor === colId))
        .filter(Boolean) as Column<Nurse>[],
    [allColumns, activeColumns]
  );

  // useTable 훅
  const instance = useTable<Nurse>(
    {
      columns,
      data,
      // @ts-ignore 또는 as Partial<TableState<Nurse>>
      initialState: {
        pageSize: initialPageSize,
        sortBy: [{ id: 'totalPay', desc: true }],
      } as Partial<TableState<Nurse>>,
    },
    useFilters,
    useSortBy,
    usePagination
  ) as EnhancedTableInstance<Nurse>;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = instance;

  return (
    <div className="space-y-4">
      {/* 상단 버튼들 */}
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

      {/* 컬럼 커스터마이징 패널 */}
      {showCustomize && (
        <CustomizePanel
          activeColumns={activeColumns}
          setActiveColumns={setActiveColumns}
          allColumns={allColumns.map((c) => ({
            Header: String(c.Header),
            accessor: c.accessor as ColumnId,
          }))}
          setShowCustomize={setShowCustomize}
        />
      )}

      {/* 테이블 / 콤팩트 뷰 */}
      <div className="shadow ring-1 ring-black ring-opacity-5 rounded-lg overflow-hidden">
        {viewMode === 'table' ? (
          <TableView
            headerGroups={headerGroups} // <— HeaderGroup<Data>[]
            page={page}
            prepareRow={prepareRow}
            getTableProps={getTableProps}
            getTableBodyProps={getTableBodyProps}
          />
        ) : (
          <CompactView page={page} prepareRow={prepareRow} />
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Page <span className="font-medium">{pageIndex + 1}</span> of{' '}
            <span className="font-medium">{pageOptions.length}</span>
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
