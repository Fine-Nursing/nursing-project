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
        return (
          <div
            key={key}
            {...rowProps}
            className="py-3 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4 flex items-center space-x-3">
                <div className="flex-1">
                  <div className="font-medium">{row.values.user}</div>
                  <div className="text-sm text-gray-500">
                    {row.values.specialty}
                  </div>
                </div>
              </div>

              <div className="col-span-4 flex items-center">
                <div className="text-sm">
                  <div>{row.values.location}</div>
                  <div className="text-gray-500">{row.values.experience}</div>
                </div>
              </div>

              <div className="col-span-4 flex items-center justify-end px-4">
                <div className="text-right">
                  <div className="font-medium text-green-600">
                    ${row.values.totalPay?.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    Base: ${row.values.basePay?.toLocaleString()}
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
