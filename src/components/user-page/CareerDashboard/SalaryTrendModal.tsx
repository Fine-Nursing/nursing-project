// components/CareerDashboard/SalaryTrendModal.tsx
import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { X as CloseIcon } from 'lucide-react';

interface TrendData {
  month: string;
  hourlyRate: number;
}

interface SalaryTrendModalProps {
  visible: boolean;
  data: TrendData[];
  onClose: () => void;
}

export default function SalaryTrendModal({
  visible,
  data,
  onClose,
}: SalaryTrendModalProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white p-4 rounded-lg shadow-md w-96 relative">
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
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fill: '#0f172a', fontSize: 11 }} />
              <YAxis
                label={{
                  value: 'Hourly Rate',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: '#0f172a', fontSize: 11 },
                }}
                tick={{ fill: '#0f172a', fontSize: 11 }}
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
        <p className="text-xs text-gray-400 mt-2">
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
