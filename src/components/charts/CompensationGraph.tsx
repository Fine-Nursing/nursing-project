'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import type { CompensationDataPoint } from 'src/types/nurse';

interface CompensationGraphProps {
  data: CompensationDataPoint[];
}

function CompensationGraph({ data }: CompensationGraphProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Compensation Distribution Analysis
      </h3>
      <div className="w-full overflow-x-auto">
        <AreaChart
          width={800}
          height={400}
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <XAxis
            dataKey="hourly"
            label={{ value: 'Hourly Pay', position: 'bottom' }}
            tick={{ fill: '#64748B' }}
          />
          <YAxis
            label={{ value: 'Concentration', angle: -90, position: 'left' }}
            tick={{ fill: '#64748B' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFF',
              border: '1px solid #E2E8F0',
              borderRadius: '0.5rem',
            }}
          />
          <ReferenceLine
            x={42.04}
            stroke="#7C3AED"
            strokeDasharray="3 3"
            label={{
              value: 'Avg: $42.04',
              fill: '#7C3AED',
              position: 'top',
            }}
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="concentration"
            stroke="#7C3AED"
            fill="url(#colorGradient)"
          />
        </AreaChart>
      </div>
    </div>
  );
}

export default CompensationGraph;
