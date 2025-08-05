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
    <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Column Order & Visibility</h3>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setShowCustomize(false)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Apply
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
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
              className={`flex items-center justify-between bg-white p-2 rounded border ${
                isActive
                  ? 'border-purple-300 bg-purple-50'
                  : 'border-gray-300 opacity-75'
              }`}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) =>
                    handleColumnToggle(columnId, e.target.checked)
                  }
                  className="mr-3 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className={isActive ? 'font-medium' : 'text-gray-600'}>
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
                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(columnId, activeIndex)}
                    disabled={activeIndex === activeColumns.length - 1}
                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
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
