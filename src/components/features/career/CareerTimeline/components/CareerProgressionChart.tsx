import React from 'react';
// Optimized imports - tree-shakable for reduced bundle size
// @ts-ignore
import { ResponsiveContainer } from 'recharts/es6/component/ResponsiveContainer';
// @ts-ignore
import { LineChart } from 'recharts/es6/chart/LineChart';
// @ts-ignore
import { CartesianGrid } from 'recharts/es6/cartesian/CartesianGrid';
// @ts-ignore
import { XAxis } from 'recharts/es6/cartesian/XAxis';
// @ts-ignore
import { YAxis } from 'recharts/es6/cartesian/YAxis';
// @ts-ignore
import { Tooltip } from 'recharts/es6/component/Tooltip';
// @ts-ignore
import { Line } from 'recharts/es6/cartesian/Line';
import type { CareerProgressionChartProps } from '../types';
import { prepareChartData } from '../utils';
import CustomLineTooltip from './CustomLineTooltip';
import CareerStatistics from './CareerStatistics';

function CareerProgressionChart({ theme, filteredAndSortedCareerData }: CareerProgressionChartProps) {
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

export default CareerProgressionChart;