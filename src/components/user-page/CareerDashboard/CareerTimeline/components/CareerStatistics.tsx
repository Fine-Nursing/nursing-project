import React from 'react';
import type { CareerStatisticsProps } from '../types';
import { calculateGrowthRate, calculateRateIncrease } from '../utils';

export function CareerStatistics({ theme, lineData }: CareerStatisticsProps) {
  return (
    <div className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg border ${
      theme === 'light' 
        ? 'bg-slate-50 border-slate-200' 
        : 'bg-slate-700 border-slate-600'
    }`}>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className={`text-[10px] sm:text-xs font-medium mb-1 ${
            theme === 'light' ? 'text-slate-600' : 'text-slate-400'
          }`}>
            Growth Rate
          </div>
          <div className={`text-base sm:text-lg font-bold ${
            theme === 'light' ? 'text-slate-800' : 'text-slate-200'
          }`}>
            {calculateGrowthRate(lineData)}
          </div>
        </div>
        <div className="text-center">
          <div className={`text-[10px] sm:text-xs font-medium mb-1 ${
            theme === 'light' ? 'text-slate-600' : 'text-slate-400'
          }`}>
            Rate Increase
          </div>
          <div className={`text-base sm:text-lg font-bold ${
            theme === 'light' ? 'text-slate-800' : 'text-slate-200'
          }`}>
            {calculateRateIncrease(lineData)}
          </div>
        </div>
      </div>
    </div>
  );
}