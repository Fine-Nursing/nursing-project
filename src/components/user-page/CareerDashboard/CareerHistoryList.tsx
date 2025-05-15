// components/CareerDashboard/CareerHistoryList.tsx
import React from 'react';
import { Trash2, Edit, Clipboard } from 'lucide-react';
import dayjs from 'dayjs';
import type { CareerItem } from './types';

interface CareerHistoryListProps {
  careerData: CareerItem[];
  onDelete: (id: number) => void;
}

export default function CareerHistoryList({
  careerData,
  onDelete,
}: CareerHistoryListProps) {
  return (
    <div className="bg-mint-50 border border-slate-100 rounded-lg p-4 shadow-sm">
      <h4 className="font-extrabold text-slate-700 mb-3 flex items-center">
        <Clipboard className="w-5 h-5 text-slate-500 mr-1" />
        Career History
      </h4>
      {careerData.length === 0 ? (
        <div className="text-sm text-gray-400">No history...</div>
      ) : (
        <ul className="divide-y divide-slate-100 text-sm">
          {careerData
            .sort(
              (a, b) =>
                (a.startDate?.getTime() || 0) - (b.startDate?.getTime() || 0)
            )
            .map((item) => {
              const ongoing = !item.endDate;
              return (
                <li
                  key={item.id}
                  className="py-2 flex items-center justify-between"
                >
                  <div>
                    <div
                      className={`font-bold ${
                        ongoing ? 'text-green-700' : 'text-slate-700'
                      }`}
                    >
                      {item.role} {item.specialty && `(${item.specialty})`}
                      {ongoing && (
                        <span className="ml-1 bg-green-100 text-green-700 px-1 py-0.5 text-xs rounded">
                          Ongoing
                        </span>
                      )}
                    </div>
                    <div className="text-gray-600">
                      {item.facility} |{' '}
                      {item.startDate
                        ? dayjs(item.startDate).format('MMM YYYY')
                        : ''}{' '}
                      ~{' '}
                      {item.endDate
                        ? dayjs(item.endDate).format('MMM YYYY')
                        : 'Now'}
                    </div>
                    <div className="text-gray-500 text-xs">
                      ${item.hourlyRate.toFixed(2)}/hr
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => alert('Edit not implemented.')}
                      className="p-1 rounded text-slate-600 hover:bg-slate-100"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      className="p-1 rounded text-red-600 hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}
