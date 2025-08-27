import React from 'react';
// Optimized imports - tree-shakable for reduced bundle size
// @ts-ignore
import { ResponsiveContainer } from 'recharts/es6/component/ResponsiveContainer';
// @ts-ignore
import { LineChart } from 'recharts/es6/chart/LineChart';
// @ts-ignore
import { Line } from 'recharts/es6/cartesian/Line';
// @ts-ignore
import { XAxis } from 'recharts/es6/cartesian/XAxis';
// @ts-ignore
import { YAxis } from 'recharts/es6/cartesian/YAxis';
// @ts-ignore
import { CartesianGrid } from 'recharts/es6/cartesian/CartesianGrid';
// @ts-ignore
import { Tooltip } from 'recharts/es6/component/Tooltip';
import { X as CloseIcon } from 'lucide-react';

interface TrendData {
  month: string;
  hourlyRate: number;
}

interface SalaryTrendModalProps {
  visible: boolean;
  data: TrendData[];
  onClose: () => void;
  theme: 'light' | 'dark'; // theme prop 추가
}

export default function SalaryTrendModal({
  visible,
  data,
  onClose,
  theme, // theme 추가
}: SalaryTrendModalProps) {
  if (!visible) return null;

  // theme에 따른 동적 클래스 적용
  const bgColor = theme === 'light' ? 'bg-white' : 'bg-slate-800';
  const textColor = theme === 'light' ? 'text-gray-700' : 'text-gray-200';
  const gridColor = theme === 'light' ? '#e2e8f0' : '#4a5568';
  const axisTickColor = theme === 'light' ? '#0f172a' : '#e2e8f0';

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className={`${bgColor} p-4 rounded-lg shadow-md w-96 relative`}>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
        <h3 className="text-cyan-600 font-bold text-lg mb-2">
          Salary Trend (Next 6 months)
        </h3>
        <div className="w-full h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="month"
                tick={{ fill: axisTickColor, fontSize: 11 }}
              />
              <YAxis
                label={{
                  value: 'Hourly Rate',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: axisTickColor, fontSize: 11 },
                }}
                tick={{ fill: axisTickColor, fontSize: 11 }}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="hourlyRate"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={{ r: 5, fill: '#06b6d4' }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className={`text-xs text-gray-400 mt-2 ${textColor}`}>
          <em>Example AI prediction</em>
        </p>
        <div className="mt-3 text-right">
          <button
            type="button"
            onClick={onClose}
            className="bg-cyan-500 text-white px-3 py-1.5 rounded hover:bg-cyan-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
