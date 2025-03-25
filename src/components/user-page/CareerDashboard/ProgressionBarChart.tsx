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

import type { CareerItem } from './types';

/**
 * (A) 커스텀 Tooltip 컴포넌트
 * 렌더 함수 밖(또는 별도 파일)에서 정의 → ESLint 경고 해결
 */
function CustomBracketTooltip({ active, payload }: TooltipProps<any, any>) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0].payload;
  return (
    <div className="p-2 bg-white border border-teal-100 text-gray-700 text-xs rounded shadow-sm">
      <p className="font-bold">{item.expBracket}</p>
      <p>
        Salary: ${item.salary.toLocaleString()}
        {item.isUser && ' ← Your bracket'}
      </p>
    </div>
  );
}

/**
 * (B) 커스텀 Bar Shape (함수)
 * - shape={<CustomBouncingBar />} → shape={customBouncingBar} 로 변경
 * - TypeScript에서는 (props: BarProps) => ReactNode 형태를 맞춰줘야 함
 */
const customBouncingBar = (props: any) => {
  const { x, y, width, height, fill, payload } = props;
  if (!height || height <= 0) return null;

  const isUser = !!payload?.isUser;
  const barRadius = 4;

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
        fill={isUser ? '#0d9488' : fill}
        rx={barRadius}
        ry={barRadius}
      />
      {isUser && (
        <circle
          cx={xValue + widthValue / 2}
          cy={yValue - 8}
          r={8}
          fill="#0d9488"
          className="animate-bounce"
        />
      )}
    </g>
  );
};

interface ProgressionBarChartProps {
  careerData: CareerItem[];
}

export default function ProgressionBarChart({
  careerData,
}: ProgressionBarChartProps) {
  if (!careerData.length) {
    return (
      <div
        className="bg-mint-50 border border-teal-100 rounded-lg p-4 shadow-sm mb-6"
        style={{ height: '320px' }}
      >
        <h4 className="font-bold text-teal-700 text-sm mb-2">
          Career Progression Chart
        </h4>
        <div className="text-center text-gray-400 py-10 text-sm">
          <AlertCircle className="w-6 h-6 inline-block mr-1" />
          No data to compute progression...
        </div>
      </div>
    );
  }

  // 1) earliest
  const earliest = careerData.reduce((acc, cur) => {
    if (!acc || (cur.startDate && cur.startDate < acc)) {
      return cur.startDate;
    }
    return acc;
  }, careerData[0].startDate);

  if (!earliest) return null;

  // 2) totalYears
  const now = new Date();
  const monthsDiff =
    (now.getFullYear() - earliest.getFullYear()) * 12 +
    (now.getMonth() - earliest.getMonth());
  const totalYears = monthsDiff / 12;

  // 3) bracket
  const bracketArr = [
    { label: '0-1 yrs', min: 0, max: 1, salary: 62000 },
    { label: '1-3 yrs', min: 1, max: 3, salary: 67000 },
    { label: '3-5 yrs', min: 3, max: 5, salary: 73000 },
    { label: '5-8 yrs', min: 5, max: 8, salary: 80000 },
    { label: '9+ yrs', min: 8, max: 99, salary: 86000 },
  ];

  const data = bracketArr.map((b) => {
    let isUser = false;
    if (totalYears >= b.min && totalYears < b.max) {
      isUser = true;
    } else if (b.max === 99 && totalYears >= 8) {
      isUser = true;
    }
    return {
      expBracket: b.label,
      salary: b.salary,
      isUser,
    };
  });

  return (
    <div
      className="bg-mint-50 border border-teal-100 rounded-lg p-4 shadow-sm mb-6"
      style={{ height: '320px' }}
    >
      <h4 className="font-bold text-teal-700 text-sm mb-2">
        Career Progression Chart
      </h4>
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, bottom: 30, left: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="expBracket"
              label={{
                value: 'Experience Bracket',
                position: 'insideBottom',
                offset: 0,
                fontSize: 12,
              }}
              tick={{ fill: '#0f172a', fontSize: 11 }}
            />
            <YAxis
              domain={[60000, 90000]}
              label={{
                value: 'Annual Salary ($)',
                angle: -90,
                position: 'insideLeft',
                fontSize: 12,
                fill: '#0f172a',
              }}
              tick={{ fill: '#0f172a', fontSize: 11 }}
            />

            {/** (C) custom tooltip */}
            <Tooltip content={<CustomBracketTooltip />} />

            {/**
              (D) shape={customBouncingBar}
              - 'shape' expects a function type:
                (props: BarProps) => ReactNode
            */}
            <Bar
              dataKey="salary"
              fill="#5eead4"
              shape={customBouncingBar as any}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 text-xs text-gray-600 flex flex-wrap gap-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-teal-600 rounded-sm mr-1" />
          <span>Your bracket</span>
        </div>
      </div>
    </div>
  );
}
