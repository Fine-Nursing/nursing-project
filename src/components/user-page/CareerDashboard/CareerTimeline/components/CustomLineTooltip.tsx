import React from 'react';
import type { TooltipProps } from 'recharts';
import dayjs from 'dayjs';
import type { ChartDataItem } from '../types';

interface CustomLineTooltipProps extends TooltipProps<number, string> {
  theme?: 'light' | 'dark';
}

export function CustomLineTooltip({
  active,
  payload,
  theme = 'light',
}: CustomLineTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload as ChartDataItem;
  
  return (
    <div
      className={`${
        theme === 'light' 
          ? 'bg-white border-slate-200 shadow-lg' 
          : 'bg-slate-800 border-slate-600 shadow-xl'
      } border rounded-lg p-3 text-xs max-w-xs`}
    >
      <div className={`font-semibold mb-2 ${
        theme === 'light' ? 'text-slate-800' : 'text-slate-200'
      }`}>
        {data.role}
        {data.specialty && (
          <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${
            theme === 'light' ? 'bg-slate-100 text-slate-600' : 'bg-slate-700 text-slate-400'
          }`}>
            {data.specialty}
          </span>
        )}
      </div>
      
      <div className={`mb-2 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
        {data.facility}
      </div>
      
      <div className={`text-xs mb-2 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
        {data.startDate ? dayjs(data.startDate).format('MMM YYYY') : ''} - {data.endDate ? dayjs(data.endDate).format('MMM YYYY') : 'Present'}
      </div>
      
      <div className={`font-bold text-sm px-2 py-1 rounded ${
        theme === 'light' 
          ? 'bg-emerald-50 text-emerald-700' 
          : 'bg-emerald-900/30 text-emerald-400'
      }`}>
        ${data.hourlyRate.toFixed(2)}/hour
      </div>
    </div>
  );
}