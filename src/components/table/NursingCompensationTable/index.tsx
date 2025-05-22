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
  Row,
  TableInstance,
  UseFiltersInstanceProps,
  UseFiltersState,
  UseSortByInstanceProps,
  UseSortByState,
  UsePaginationInstanceProps,
  UsePaginationState,
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

// 수정된 Combined Pay Cell 컴포넌트 - 스마트 포지셔닝
function CombinedPayCell({ row }: { row: Row<Nurse> }) {
  const { basePay } = row.original;
  const { differentials } = row.original;
  const { totalPay } = row.original;
  const [tooltipPosition, setTooltipPosition] = React.useState<'top' | 'left'>(
    'top'
  );

  // 실제 환경에서는 individualDifferentials 데이터를 받아야 합니다
  // 지금은 예시용으로 더미 데이터 사용
  const differentialBreakdown = [
    { type: 'Night Shift', amount: Math.floor(differentials * 0.5) },
    { type: 'Weekend', amount: Math.floor(differentials * 0.3) },
    { type: 'ICU', amount: Math.floor(differentials * 0.2) },
  ].filter((diff) => diff.amount > 0);

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // 화면 하단에 있으면 위쪽으로, 오른쪽에 있으면 왼쪽으로
    const isNearBottom = rect.bottom > viewportHeight - 200;
    const isNearRight = rect.right > viewportWidth - 250;

    if (isNearBottom) {
      setTooltipPosition('top');
    } else if (isNearRight) {
      setTooltipPosition('left');
    } else {
      setTooltipPosition('top');
    }
  };

  return (
    <div className="relative group" onMouseEnter={handleMouseEnter}>
      {/* 메인 표시 - 총액만 깔끔하게 */}
      <div className="font-bold text-green-600 cursor-pointer">
        ${totalPay.toLocaleString()}
      </div>

      {/* 동적 툴팁 */}
      <div
        className={`absolute z-[100] invisible group-hover:visible opacity-0 group-hover:opacity-100 
                      transition-all duration-200 
                      ${
                        tooltipPosition === 'top'
                          ? 'bottom-full left-1/2 transform -translate-x-1/2 mb-2'
                          : 'top-0 right-full mr-2'
                      }
                      bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl min-w-[200px]`}
      >
        {/* 동적 화살표 */}
        <div
          className={`absolute 
                        ${
                          tooltipPosition === 'top'
                            ? 'top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900'
                            : 'top-3 -right-1 border-4 border-transparent border-l-gray-900'
                        }`}
        />

        {/* 내용 */}
        <div className="space-y-2">
          <div className="font-semibold text-sm border-b border-gray-700 pb-1">
            Total: ${totalPay.toLocaleString()}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span>Base Pay:</span>
              <span className="font-medium">${basePay.toLocaleString()}</span>
            </div>

            {differentials > 0 && (
              <>
                <div className="flex justify-between items-center text-blue-300">
                  <span>Differentials:</span>
                  <span className="font-medium">
                    ${differentials.toLocaleString()}
                  </span>
                </div>

                {/* Differential 종류별 상세 */}
                <div className="ml-2 space-y-0.5 text-gray-300">
                  {differentialBreakdown.map((diff) => (
                    <div
                      key={`${diff.type}-${diff.amount}`}
                      className="flex justify-between items-center text-xs"
                    >
                      <span>• {diff.type}:</span>
                      <span>+${diff.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
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
    'compensation', // 통합된 컬럼
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

  // 모든 컬럼 정의 - 통합된 Compensation 컬럼
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
        Header: 'Compensation',
        accessor: 'totalPay', // accessor는 totalPay 사용 (정렬용)
        Cell: CombinedPayCell,
      },
    ],
    []
  );

  // 현재 활성화된 컬럼만
  const columns = useMemo<Column<Nurse>[]>(() => {
    // compensation을 totalPay로 매핑
    const mappedActiveColumns = activeColumns.map((colId) =>
      colId === 'compensation' ? 'totalPay' : colId
    );

    return mappedActiveColumns
      .map((colId) => allColumns.find((col) => col.accessor === colId))
      .filter(Boolean) as Column<Nurse>[];
  }, [allColumns, activeColumns]);

  // useTable 훅
  const instance = useTable<Nurse>(
    {
      columns,
      data,
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
          allColumns={[
            { Header: 'User', accessor: 'user' },
            { Header: 'Specialty', accessor: 'specialty' },
            { Header: 'Location', accessor: 'location' },
            { Header: 'Experience', accessor: 'experience' },
            { Header: 'Shift', accessor: 'shiftType' },
            { Header: 'Compensation', accessor: 'compensation' }, // 표시용
          ]}
          setShowCustomize={setShowCustomize}
        />
      )}

      {/* 테이블 / 콤팩트 뷰 - overflow 원복 */}
      <div className="shadow ring-1 ring-black ring-opacity-5 rounded-lg overflow-hidden">
        {viewMode === 'table' ? (
          <TableView
            headerGroups={headerGroups}
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
