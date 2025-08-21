'use client';

import React from 'react';
import { Save, RotateCcw, ChevronUp, ChevronDown } from 'lucide-react';

// 업데이트된 ColumnId 타입 - 실제 accessor와 매칭
export type ColumnId =
  | 'id' // user ID
  | 'specialty'
  | 'location'
  | 'experience'
  | 'shiftType' // shift 타입
  | 'compensation'; // 통합된 compensation 컬럼

interface ColumnInfo {
  Header: string;
  accessor: ColumnId;
}

interface CustomizePanelProps {
  activeColumns: ColumnId[];
  setActiveColumns: React.Dispatch<React.SetStateAction<ColumnId[]>>;
  allColumns: ColumnInfo[];
  setShowCustomize: React.Dispatch<React.SetStateAction<boolean>>;
}

function CustomizePanel({
  activeColumns,
  setActiveColumns,
  allColumns,
  setShowCustomize,
}: CustomizePanelProps) {
  // 모든 컬럼의 체크 상태를 관리
  const [checkedColumns, setCheckedColumns] = React.useState<Set<ColumnId>>(
    new Set(activeColumns)
  );

  // allColumns가 없는 경우 처리
  if (!allColumns || !Array.isArray(allColumns)) {
    return null;
  }

  const handleColumnToggle = (columnId: ColumnId, isChecked: boolean) => {
    const newCheckedColumns = new Set(checkedColumns);

    if (isChecked) {
      newCheckedColumns.add(columnId);
      // 체크하면 activeColumns에 추가
      if (!activeColumns.includes(columnId)) {
        setActiveColumns([...activeColumns, columnId]);
      }
    } else {
      newCheckedColumns.delete(columnId);
      // 체크 해제하면 activeColumns에서 제거
      setActiveColumns(activeColumns.filter((id) => id !== columnId));
    }

    setCheckedColumns(newCheckedColumns);
  };

  const handleReset = () => {
    const defaultColumns: ColumnId[] = [
      'id',
      'specialty',
      'location',
      'experience',
      'shiftType',
      'compensation',
    ];
    setActiveColumns(defaultColumns);
    setCheckedColumns(new Set(defaultColumns));
  };

  const handleMoveUp = (columnId: ColumnId, currentIndex: number) => {
    if (currentIndex > 0) {
      const newColumns = [...activeColumns];
      [newColumns[currentIndex - 1], newColumns[currentIndex]] = [
        newColumns[currentIndex],
        newColumns[currentIndex - 1],
      ];
      setActiveColumns(newColumns);
    }
  };

  const handleMoveDown = (columnId: ColumnId, currentIndex: number) => {
    if (currentIndex < activeColumns.length - 1) {
      const newColumns = [...activeColumns];
      [newColumns[currentIndex], newColumns[currentIndex + 1]] = [
        newColumns[currentIndex + 1],
        newColumns[currentIndex],
      ];
      setActiveColumns(newColumns);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-lg mb-4 border border-emerald-200 dark:border-zinc-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-emerald-800 dark:text-emerald-100">Column Order & Visibility</h3>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setShowCustomize(false)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-sm transition-all duration-200"
          >
            <Save className="w-4 h-4 mr-2" />
            Apply
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center px-3 py-2 border border-emerald-200 dark:border-zinc-700 text-sm font-medium rounded-xl text-emerald-700 dark:text-zinc-300 bg-white/80 dark:bg-zinc-800/70 hover:bg-emerald-50 dark:hover:bg-zinc-700/50 backdrop-blur-sm transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {/* 모든 컬럼을 표시 - 체크 여부와 관계없이 */}
        {allColumns.map((column) => {
          const columnId = column.accessor;
          const isChecked = checkedColumns.has(columnId);
          const activeIndex = activeColumns.indexOf(columnId);
          const isActive = activeIndex !== -1;

          return (
            <div
              key={columnId}
              className={`flex items-center justify-between p-2 rounded-lg border transition-all duration-200 ${
                isActive
                  ? 'border-emerald-300 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20'
                  : 'border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 opacity-75'
              }`}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) =>
                    handleColumnToggle(columnId, e.target.checked)
                  }
                  className="mr-3 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 dark:border-zinc-600 dark:text-emerald-400"
                />
                <span className={isActive ? 'font-medium text-emerald-700 dark:text-emerald-300' : 'text-gray-600 dark:text-zinc-400'}>
                  {column.Header}
                </span>
              </div>

              {/* 순서 변경 버튼은 활성화된 컬럼에만 표시 */}
              {isActive && (
                <div className="flex space-x-1">
                  <button
                    type="button"
                    onClick={() => handleMoveUp(columnId, activeIndex)}
                    disabled={activeIndex === 0}
                    className="p-1 hover:bg-emerald-100 dark:hover:bg-zinc-700 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(columnId, activeIndex)}
                    disabled={activeIndex === activeColumns.length - 1}
                    className="p-1 hover:bg-emerald-100 dark:hover:bg-zinc-700 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CustomizePanel;
