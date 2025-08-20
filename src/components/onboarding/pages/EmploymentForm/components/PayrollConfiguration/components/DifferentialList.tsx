import React from 'react';
import type { DifferentialItem } from '../../../hooks/useDifferentialCalculator';

interface DifferentialListProps {
  differentialItems: DifferentialItem[];
  removeDifferential: (id: string) => void;
}

export function DifferentialList({
  differentialItems,
  removeDifferential,
}: DifferentialListProps) {
  if (differentialItems.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h5 className="text-sm font-medium text-gray-800">Current Differentials:</h5>
      {differentialItems.map(item => (
        <div key={item.id} className="bg-white rounded p-3 border border-blue-200 flex justify-between items-center">
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <span className="font-medium text-sm">{item.type}</span>
              <span className="text-sm text-gray-600">
                ${item.amount.toFixed(2)}/{item.unit}
              </span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {item.group}
              </span>
            </div>
          </div>
          <button
            onClick={() => removeDifferential(item.id)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}