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
import useCareerProgression from 'src/api/useCareerProgression';

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
      className={`p-3 ${theme === 'light' ? 'bg-white border-slate-200 shadow-lg' : 'bg-slate-800 border-slate-600 shadow-xl'} border text-sm rounded-lg`}
    >
      <p className={`font-bold mb-1 ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>
        {item.expBracket}
      </p>
      <p className={`${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
        Annual Salary: <span className="font-semibold">${item.salary.toLocaleString()}</span>
        {item.isUser && (
          <span
            className={`block text-xs mt-1 px-2 py-1 rounded font-medium ${
              theme === 'light' ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-900/50 text-emerald-300'
            }`}
          >
            Your current bracket
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
  const userFill = theme === 'light' ? '#059669' : '#10b981'; // emerald green for user bracket

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  careerData,
  theme = 'light',
}: ProgressionBarChartProps) {
  const { data: progressionData, isLoading } = useCareerProgression();
  
  const chartGridColor = theme === 'light' ? '#e2e8f0' : '#475569';
  const chartTextColor = theme === 'light' ? '#64748b' : '#94a3b8';
  const bgClass = theme === 'light' ? 'bg-white' : 'bg-slate-800';
  const borderClass =
    theme === 'light' ? 'border-slate-200' : 'border-slate-600';
  const textClass = theme === 'light' ? 'text-slate-800' : 'text-slate-200';
  const textGrayClass = theme === 'light' ? 'text-slate-600' : 'text-slate-400';
  const barFillColor = theme === 'light' ? '#e2e8f0' : '#475569'; // light gray for industry average

  if (isLoading) {
    return (
      <div
        className={`${bgClass} border ${borderClass} rounded-xl p-4 sm:p-6 shadow-lg mb-4 sm:mb-6`}
      >
        <div className="mb-4">
          <h4 className={`font-bold ${textClass} text-lg sm:text-xl mb-1`}>
            How You Stack Up
          </h4>
          <p className={`text-sm ${textGrayClass}`}>
            Compare your salary with industry benchmarks by experience level
          </p>
        </div>
        <div className="flex flex-col items-center justify-center h-64 sm:h-80 lg:h-96">
          <div className="w-8 h-8 border-t-2 border-slate-400 border-solid rounded-full animate-spin" />
          <p className={`mt-2 text-sm font-medium ${textGrayClass}`}>
            Loading progression data...
          </p>
        </div>
      </div>
    );
  }

  if (!progressionData || !progressionData.progressionData) {
    return (
      <div
        className={`${bgClass} border ${borderClass} rounded-xl p-4 sm:p-6 shadow-lg mb-4 sm:mb-6`}
      >
        <div className="mb-4">
          <h4 className={`font-bold ${textClass} text-lg sm:text-xl mb-1`}>
            How You Stack Up
          </h4>
          <p className={`text-sm ${textGrayClass}`}>
            Compare your salary with industry benchmarks by experience level
          </p>
        </div>
        <div className={`text-center ${textGrayClass} py-10 text-sm h-64 sm:h-80 lg:h-96`}>
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
      className={`${bgClass} border ${borderClass} rounded-xl p-4 sm:p-6 shadow-lg mb-4 sm:mb-6`}
    >
      <div className="mb-4">
        <h4 className={`font-bold ${textClass} text-lg sm:text-xl mb-1`}>
          How You Stack Up
        </h4>
        <p className={`text-sm ${textGrayClass}`}>
          Compare your salary with industry benchmarks by experience level
        </p>
      </div>
      <div className="w-full h-64 sm:h-80 lg:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 40, right: 10, bottom: 50, left: 40 }}
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
              width={80}
              label={{
                value: 'Annual Salary ($)',
                angle: -90,
                position: 'insideLeft',
                fontSize: 12,
                fill: chartTextColor,
              }}
              tick={{ fill: chartTextColor, fontSize: 11 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              interval={0}
              domain={[0, (dataMax: number) => Math.ceil((dataMax * 1.4) / 10000) * 10000]}
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
        className={`mt-3 text-xs sm:text-sm ${textGrayClass} flex flex-wrap gap-3 sm:gap-4`}
      >
        <div className="flex items-center">
          <div
            className="w-3 h-3 rounded-sm mr-2"
            style={{ backgroundColor: theme === 'light' ? '#059669' : '#10b981' }}
          />
          <span className="font-medium">Your salary bracket</span>
        </div>
        <div className="flex items-center">
          <div
            className="w-3 h-3 rounded-sm mr-2"
            style={{ backgroundColor: barFillColor }}
          />
          <span className="font-medium">Industry average</span>
        </div>
      </div>
    </div>
  );
}