'use client';

import React from 'react';

type Props = {
  page: any[];
  prepareRow: (row: any) => void;
};

export default function CompactView({ page, prepareRow }: Props) {
  return (
    <div className="divide-y divide-gray-200">
      {page.map((row) => {
        prepareRow(row);
        const { key, ...rowProps } = row.getRowProps();

        // 데이터 접근 - row.original 사용
        const basePay = row.original.basePay || 0;
        const differentials = row.original.differentials || 0;
        const totalPay = row.original.totalPay || basePay + differentials;

        // 더미 differential breakdown (테이블과 동일)
        const differentialBreakdown = [
          { type: 'Night Shift', amount: Math.floor(differentials * 0.5) },
          { type: 'Weekend', amount: Math.floor(differentials * 0.3) },
          { type: 'ICU', amount: Math.floor(differentials * 0.2) },
        ].filter((diff) => diff.amount > 0);

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
                    {row.values.user}
                  </div>
                  <div className="text-sm text-gray-500">
                    {row.values.specialty}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {row.values.shiftType} Shift
                  </div>
                </div>
              </div>

              {/* Location & Experience */}
              <div className="col-span-4 flex items-center">
                <div className="text-sm">
                  <div className="font-medium text-gray-700">
                    {row.values.location}
                  </div>
                  <div className="text-gray-500">
                    {row.values.experience} years exp.
                  </div>
                </div>
              </div>

              {/* Compensation with Tooltip - 테이블과 동일한 방식 */}
              <div className="col-span-4 flex items-center justify-end px-4">
                <div className="relative group">
                  {/* 메인 표시 - 총액만 */}
                  <div className="font-bold text-lg text-green-600 cursor-pointer">
                    ${totalPay.toLocaleString()}
                  </div>

                  {/* 툴팁 - 위치 조정 및 간소화 */}
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
                        Total: ${totalPay.toLocaleString()}
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span>Base Pay:</span>
                          <span className="font-medium">
                            ${basePay.toLocaleString()}
                          </span>
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
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
