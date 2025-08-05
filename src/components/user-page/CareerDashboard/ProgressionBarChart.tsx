// components/CareerDashboard/ProgressionBarChart.tsx
import React from 'react';
import { AlertCircle } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  type TooltipProps,
} from 'recharts';
import { useCareerProgression } from 'src/api/useCareerProgression';

import type { CareerItem } from './types';

interface ProgressionBarChartProps {
  careerData: CareerItem[];
  theme?: 'light' | 'dark';
}

/**
 * (A) 커스텀 Tooltip 컴포넌트
 * 렌더 함수 밖(또는 별도 파일)에서 정의 → ESLint 경고 해결
 */
function CustomBracketTooltip({
  active,
  payload,
  theme = 'light',
}: TooltipProps<any, any> & { theme?: 'light' | 'dark' }) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0].payload;
  return (
    <div
      className={`p-2 ${theme === 'light' ? 'bg-white border-slate-100 text-gray-700' : 'bg-slate-700 border-slate-600 text-white'} border text-xs rounded shadow-sm`}
    >
      <p className="font-bold">{item.expBracket}</p>
      <p>
        Salary: ${item.salary.toLocaleString()}
        {item.isUser && (
          <span
            className={theme === 'light' ? 'text-slate-600' : 'text-slate-300'}
          >
            {' '}
            ← Your bracket
          </span>
        )}
      </p>
    </div>
  );
}

/**
 * (B) 커스텀 Bar Shape (함수)
 * - shape={<CustomBouncingBar />} → shape={customBouncingBar} 로 변경
 * - TypeScript에서는 (props: BarProps) => ReactNode 형태를 맞춰줘야 함
 */
const customBouncingBar = (props: any, theme = 'light') => {
  const { x, y, width, height, fill, payload } = props;
  if (!height || height <= 0) return null;

  const isUser = !!payload?.isUser;
  const barRadius = 4;
  const userFill = theme === 'light' ? '#0d9488' : '#0f766e'; // slate-600 for light, slate-700 for dark

  // TypeScript 에러를 방지하기 위해 숫자 값을 보장
  const xValue = typeof x === 'number' ? x : parseFloat(x || '0');
  const yValue = typeof y === 'number' ? y : parseFloat(y || '0');
  const widthValue =
    typeof width === 'number' ? width : parseFloat(width || '0');
  const heightValue =
    typeof height === 'number' ? height : parseFloat(height || '0');

  return (
    <g>
      <rect
        x={xValue}
        y={yValue}
        width={widthValue}
        height={heightValue}
        fill={isUser ? userFill : fill}
        rx={barRadius}
        ry={barRadius}
      />
      {isUser && (
        <circle
          cx={xValue + widthValue / 2}
          cy={yValue - 8}
          r={8}
          fill={userFill}
          className="animate-bounce"
        />
      )}
    </g>
  );
};

export default function ProgressionBarChart({
  careerData,
  theme = 'light',
}: ProgressionBarChartProps) {
  const { data: progressionData, isLoading } = useCareerProgression();
  
  const chartGridColor = theme === 'light' ? '#e2e8f0' : '#475569';
  const chartTextColor = theme === 'light' ? '#0f172a' : '#e2e8f0';
  const bgClass = theme === 'light' ? 'bg-mint-50 bg-white' : 'bg-slate-700';
  const borderClass =
    theme === 'light' ? 'border-slate-100' : 'border-slate-600';
  const textClass = theme === 'light' ? 'text-slate-700' : 'text-slate-300';
  const textGrayClass = theme === 'light' ? 'text-gray-400' : 'text-gray-500';
  const barFillColor = theme === 'light' ? '#5eead4' : '#2dd4bf'; // slate-200 for light, slate-400 for dark

  if (isLoading) {
    return (
      <div
        className={`${bgClass} border ${borderClass} rounded-lg p-4 shadow-sm mb-6`}
      >
        <h4 className={`font-bold ${textClass} text-sm mb-2`}>
          Career Progression Chart
        </h4>
        <div className="flex flex-col items-center justify-center" style={{ height: '280px' }}>
          <div className="w-8 h-8 border-t-2 border-slate-400 border-solid rounded-full animate-spin" />
          <p className="mt-2 text-sm font-medium text-slate-600">
            Loading progression data...
          </p>
        </div>
      </div>
    );
  }

  if (!progressionData || !progressionData.progressionData) {
    return (
      <div
        className={`${bgClass} border ${borderClass} rounded-lg p-4 shadow-sm mb-6`}
      >
        <h4 className={`font-bold ${textClass} text-sm mb-2`}>
          Career Progression Chart
        </h4>
        <div className={`text-center ${textGrayClass} py-10 text-sm`} style={{ height: '280px' }}>
          <AlertCircle className="w-6 h-6 inline-block mr-1" />
          No data to compute progression...
        </div>
      </div>
    );
  }

  const data = progressionData.progressionData;

  // 4) Custom shape function with theme
  const shapeWithTheme = (props: any) => customBouncingBar(props, theme);

  return (
    <div
      className={`${bgClass} border ${borderClass} rounded-lg p-4 shadow-sm mb-6`}
    >
      <h4 className={`font-bold ${textClass} text-sm mb-2`}>
        Career Progression Chart
      </h4>
      <div className="w-full" style={{ height: '280px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 30, right: 10, bottom: 40, left: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
            <XAxis
              dataKey="expBracket"
              label={{
                value: 'Experience Bracket',
                position: 'insideBottom',
                offset: 0,
                fontSize: 12,
                fill: chartTextColor,
              }}
              tick={{ fill: chartTextColor, fontSize: 11 }}
            />
            <YAxis
              label={{
                value: 'Annual Salary ($)',
                angle: -90,
                position: 'insideLeft',
                fontSize: 12,
                fill: chartTextColor,
              }}
              tick={{ fill: chartTextColor, fontSize: 11 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />

            {/** (C) custom tooltip with theme */}
            <Tooltip content={<CustomBracketTooltip theme={theme} />} />

            {/**
              (D) shape={shapeWithTheme}
            */}
            <Bar
              dataKey="salary"
              fill={barFillColor}
              shape={shapeWithTheme as any}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div
        className={`mt-2 text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} flex flex-wrap gap-4`}
      >
        <div className="flex items-center">
          <div
            className={`w-3 h-3 ${theme === 'light' ? 'bg-slate-600' : 'bg-slate-500'} rounded-sm mr-1`}
          />
          <span>Your bracket</span>
        </div>
      </div>
    </div>
  );
}
