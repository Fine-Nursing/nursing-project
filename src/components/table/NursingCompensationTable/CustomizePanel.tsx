'use client';

import React from 'react';
import { Save, RotateCcw, ChevronUp, ChevronDown } from 'lucide-react';
import arrayMove from './utils/arrayMove';

// 이 예시에서 사용할 ColumnId 타입 (실제 테이블에서 사용하는 accessor 키들을 정의)
export type ColumnId =
  | 'user'
  | 'specialty'
  | 'location'
  | 'experience'
  | 'shiftType'
  | 'basePay'
  | 'differentials'
  | 'totalPay';

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
            onClick={() => {
              // 기본(초기) 컬럼 배열로 리셋
              setActiveColumns([
                'user',
                'specialty',
                'location',
                'experience',
                'shiftType',
                'basePay',
                'differentials',
                'totalPay',
              ]);
            }}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {activeColumns.map((columnId, index) => {
          const column = allColumns.find((col) => col.accessor === columnId);
          if (!column) return null;

          return (
            <div
              key={columnId}
              className="flex items-center justify-between bg-white p-2 rounded border"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={activeColumns.includes(columnId)}
                  onChange={(e) => {
                    setActiveColumns((prev) =>
                      e.target.checked
                        ? [...prev, columnId]
                        : prev.filter((id) => id !== columnId)
                    );
                  }}
                  className="mr-3 rounded border-gray-300 text-purple-600"
                />
                <span>{column.Header}</span>
              </div>
              <div className="flex space-x-1">
                <button
                  type="button"
                  onClick={() => {
                    if (index > 0) {
                      setActiveColumns(
                        arrayMove(activeColumns, index, index - 1)
                      );
                    }
                  }}
                  disabled={index === 0}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (index < activeColumns.length - 1) {
                      setActiveColumns(
                        arrayMove(activeColumns, index, index + 1)
                      );
                    }
                  }}
                  disabled={index === activeColumns.length - 1}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CustomizePanel;
