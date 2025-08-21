import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Line 
} from 'recharts';
import type { CareerProgressionChartProps } from '../types';
import { prepareChartData } from '../utils';
import { CustomLineTooltip } from './CustomLineTooltip';
import { CareerStatistics } from './CareerStatistics';

export function CareerProgressionChart({ theme, filteredAndSortedCareerData }: CareerProgressionChartProps) {
  const lineData = prepareChartData(filteredAndSortedCareerData);
  
  return (
    <div className={`hidden lg:block p-4 sm:p-6 ${
      theme === 'light' ? 'bg-white' : 'bg-slate-800'
    }`}>
      <div className="mb-4">
        <h4 className={`text-lg font-bold mb-1 ${
          theme === 'light' ? 'text-slate-800' : 'text-slate-200'
        }`}>
          Career Progression Chart
        </h4>
        <p className={`text-sm font-medium ${
          theme === 'light' ? 'text-slate-600' : 'text-slate-400'
        }`}>
          Hourly rate development over time
        </p>
      </div>
      
      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={lineData}
            margin={{ top: 20, right: 20, bottom: 40, left: 30 }}
          >
            <CartesianGrid
              strokeDasharray="2 2"
              stroke={theme === 'light' ? '#e2e8f0' : '#475569'}
              opacity={0.5}
            />
            <XAxis
              dataKey="xLabel"
              tick={{ 
                fill: theme === 'light' ? '#64748b' : '#94a3b8', 
                fontSize: 11,
                fontWeight: 500
              }}
              axisLine={{ stroke: theme === 'light' ? '#cbd5e1' : '#64748b' }}
              tickLine={{ stroke: theme === 'light' ? '#cbd5e1' : '#64748b' }}
            />
            <YAxis
              tick={{ 
                fill: theme === 'light' ? '#64748b' : '#94a3b8', 
                fontSize: 11,
                fontWeight: 500
              }}
              axisLine={{ stroke: theme === 'light' ? '#cbd5e1' : '#64748b' }}
              tickLine={{ stroke: theme === 'light' ? '#cbd5e1' : '#64748b' }}
              label={{
                value: 'Hourly Rate ($)',
                angle: -90,
                position: 'insideLeft',
                style: { 
                  fill: theme === 'light' ? '#64748b' : '#94a3b8', 
                  fontSize: 11,
                  fontWeight: 500,
                  textAnchor: 'middle'
                }
              }}
            />
            <Tooltip content={<CustomLineTooltip theme={theme} />} />
            <Line
              type="monotone"
              dataKey="hourlyRate"
              stroke={theme === 'light' ? '#059669' : '#10b981'}
              strokeWidth={2.5}
              dot={{
                r: 4,
                fill: theme === 'light' ? '#059669' : '#10b981',
                strokeWidth: 2,
                stroke: theme === 'light' ? '#ffffff' : '#1f2937'
              }}
              activeDot={{
                r: 6,
                fill: theme === 'light' ? '#047857' : '#34d399',
                strokeWidth: 2,
                stroke: theme === 'light' ? '#ffffff' : '#1f2937'
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <CareerStatistics theme={theme} lineData={lineData} />
    </div>
  );
}