import React from 'react';
import type { RegionStates } from 'src/types/location';
import Chart from '../../Chart';
import type { ProcessedDataItem } from '../types';

interface ChartSectionProps {
  processedData: ProcessedDataItem[];
  states: RegionStates | undefined;
  isFetchingCompensations: boolean;
  isPlaceholderData: boolean;
}

export function ChartSection({
  processedData,
  states,
  isFetchingCompensations,
  isPlaceholderData,
}: ChartSectionProps) {
  return (
    <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-white/50 dark:border-zinc-700 shadow-sm relative z-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-zinc-100">
          Compensation Analysis
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-zinc-300">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Real-time data
        </div>
      </div>
      <div className="relative w-full overflow-hidden">
        <Chart data={processedData} states={states} />

        {/* Loading overlay */}
        {isFetchingCompensations && isPlaceholderData && (
          <div className="absolute inset-0 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-3 border-violet-500 dark:border-violet-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-600 dark:text-zinc-300">
                Updating chart...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}