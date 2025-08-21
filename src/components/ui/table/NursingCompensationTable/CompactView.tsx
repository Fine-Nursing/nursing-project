'use client';

import React from 'react';
import type { Row } from 'react-table';
import type { NursingPosition } from 'src/types/nursing';

type Props = {
  page: Row<NursingPosition>[];
  prepareRow: (row: Row<NursingPosition>) => void;
};

export default function CompactView({ page, prepareRow }: Props) {
  return (
    <div className="divide-y divide-gray-200">
      {page.map((row) => {
        prepareRow(row);
        const { key, ...rowProps } = row.getRowProps();

        const { compensation, shift, id, specialty, location, experience } =
          row.original;

        return (
          <div
            key={key}
            {...rowProps}
            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="grid grid-cols-12 gap-4">
              {/* User & Specialty */}
              <div className="col-span-4 flex items-center space-x-3">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    User {id?.slice(-4) || 'Unknown'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {specialty || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {shift || 'Unknown'} Shift
                  </div>
                </div>
              </div>

              {/* Location & Experience */}
              <div className="col-span-4 flex items-center">
                <div className="text-sm">
                  <div className="font-medium text-gray-700">
                    {location || 'N/A'}
                  </div>
                  <div className="text-gray-500">{experience || 'N/A'}</div>
                </div>
              </div>

              {/* Compensation with Tooltip */}
              <div className="col-span-4 flex items-center justify-end px-4">
                <div className="relative group">
                  {/* 메인 표시 - 시급 */}
                  <div className="font-bold text-lg text-green-600 cursor-pointer">
                    ${compensation?.hourly || 0}/hr
                  </div>

                  {/* 툴팁 */}
                  {compensation && (
                    <div
                      className="absolute z-[200] invisible group-hover:visible opacity-0 group-hover:opacity-100 
                                    transition-all duration-200 
                                    top-0 right-0 mr-2
                                    bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl min-w-[180px]"
                    >
                      {/* 오른쪽 화살표 */}
                      <div
                        className="absolute top-3 -right-1 
                                      border-4 border-transparent border-l-gray-900"
                      />

                      {/* 내용 */}
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

                              {/* Differential 종류별 상세 */}
                              {compensation.differentialBreakdown &&
                                compensation.differentialBreakdown.length >
                                  0 && (
                                  <div className="ml-2 space-y-0.5 text-gray-300">
                                    {compensation.differentialBreakdown.map(
                                      (diff) => (
                                        <div
                                          key={`${diff.type}-${diff.amount}`}
                                          className="flex justify-between items-center text-xs"
                                        >
                                          <span>• {diff.type}:</span>
                                          <span>+${diff.amount || 0}/hr</span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
