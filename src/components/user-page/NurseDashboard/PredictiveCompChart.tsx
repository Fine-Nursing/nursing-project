// components/NurseDashboard/PredictiveCompChart.tsx
import React from 'react';
import type { TooltipProps } from 'recharts';
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { TrendingUp, User } from 'lucide-react';
import CuteWageLabel from './CuteWageLabel'; // 라벨

interface PayDistributionEntry {
  label: string;
  wageValue: number;
  count: number;
  highlight?: boolean;
  isUser?: boolean;
  id: string; // 고유 ID 추가
}

interface PredictiveCompChartProps {
  payDistributionData: PayDistributionEntry[];
  userHourlyRate: number;
  regionalAvgWage: number;
  theme: 'light' | 'dark';
}

// CustomTooltip 컴포넌트를 별도 파일로 분리하는 것이 가장 좋지만,
// 여기서는 동일 파일에서 완전히 분리하여 정의합니다.
function CustomTooltip(
  props: TooltipProps<number, string> & { themeMode: 'light' | 'dark' }
) {
  const { active, payload, themeMode } = props;

  if (active && payload && payload.length) {
    const { count, label, isUser } = payload[0].payload as PayDistributionEntry;
    return (
      <div
        className={`p-3 ${
          themeMode === 'light' ? 'bg-white' : 'bg-slate-700'
        } shadow-lg rounded-2xl border ${
          themeMode === 'light' ? 'border-emerald-100' : 'border-slate-600'
        }`}
      >
        <p className="font-semibold">Wage: {label}</p>
        <p className="text-emerald-600 font-medium flex items-center">
          <User className="w-3 h-3 mr-1" />
          Nurses: {count} {isUser && '← Your wage'}
        </p>
      </div>
    );
  }
  return null;
}

// 이 CustomTooltipRenderer는 Tooltip의 content 속성에 전달할 함수를 생성합니다.
// PredictiveCompChart 외부에 정의하여 렌더링마다 재생성되지 않도록 합니다.
// eslint-disable-next-line react/display-name
const createTooltipRenderer = (theme: 'light' | 'dark') => {
  function tooltipRenderer(tooltipProps: TooltipProps<number, string>) {
    return <CustomTooltip {...tooltipProps} themeMode={theme} />;
  }
  return tooltipRenderer;
};

export default function PredictiveCompChart({
  payDistributionData,
  userHourlyRate,
  regionalAvgWage,
  theme,
}: PredictiveCompChartProps) {
  // theme에 따라 적절한 렌더러 함수 선택
  const tooltipRenderer = React.useMemo(
    () => createTooltipRenderer(theme),
    [theme]
  );

  return (
    <div
      className={`${
        theme === 'light' ? 'bg-white' : 'bg-slate-700'
      } rounded-2xl shadow-lg p-6 mb-6 border ${
        theme === 'light' ? 'border-emerald-100' : 'border-slate-600'
      }`}
    >
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2 text-emerald-500" />
        <span>Predictive Compensation Comparison</span>
        <div className="ml-2 bg-emerald-100 text-emerald-600 text-xs px-2 py-0.5 rounded-full">
          AI Powered
        </div>
      </h2>

      <div
        className={`mb-6 ${
          theme === 'light'
            ? 'bg-gradient-to-r from-emerald-50 to-cyan-50'
            : 'bg-slate-600'
        } rounded-2xl shadow-md p-5 border ${
          theme === 'light' ? 'border-emerald-100' : 'border-slate-500'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className={`font-bold text-xl ${
              theme === 'light' ? 'text-gray-800' : 'text-white'
            } flex items-center`}
          >
            ER Average Pay in New York City, NY
          </h3>
          <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-xs font-medium flex items-center">
            Live Data
          </div>
        </div>

        <div className="w-full" style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={payDistributionData}
              margin={{ top: 40, right: 50, bottom: 40, left: 50 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === 'light' ? '#f3f4f6' : '#374151'}
              />
              <XAxis
                type="number"
                dataKey="wageValue"
                domain={[24, 46]}
                tick={{
                  fill: theme === 'light' ? '#6b7280' : '#e5e7eb',
                  fontSize: 12,
                }}
                label={{
                  value: 'Hourly Wage ($)',
                  position: 'insideBottomRight',
                  offset: -5,
                  style: {
                    fill: theme === 'light' ? '#6b7280' : '#e5e7eb',
                    fontSize: 12,
                  },
                }}
              />
              <YAxis
                dataKey="count"
                tick={{
                  fill: theme === 'light' ? '#6b7280' : '#e5e7eb',
                  fontSize: 12,
                }}
                label={{
                  value: 'Number of Nurses',
                  angle: -90,
                  position: 'insideLeft',
                  style: {
                    fill: theme === 'light' ? '#6b7280' : '#e5e7eb',
                    fontSize: 12,
                  },
                }}
              />
              <Tooltip content={tooltipRenderer} />
              <ReferenceLine
                x={userHourlyRate}
                stroke="#0d9488"
                strokeWidth={2}
                isFront
                label={<CuteWageLabel wage={userHourlyRate} />}
              />
              <ReferenceLine
                x={regionalAvgWage}
                stroke="#14b8a6"
                strokeWidth={2}
                strokeDasharray="3 3"
                label={{
                  value: 'Regional Avg',
                  position: 'top',
                  fill: '#14b8a6',
                  fontSize: 12,
                }}
              />
              <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                {payDistributionData.map((entry) => {
                  let fillColor = '#5eead4'; // Teal-200
                  if (entry.isUser)
                    fillColor = '#0d9488'; // Teal-600
                  else if (entry.highlight) fillColor = '#14b8a6'; // Teal-500
                  return <Cell key={`cell-${entry.id}`} fill={fillColor} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div
          className={`mt-4 pt-4 border-t ${
            theme === 'light' ? 'border-emerald-100' : 'border-slate-500'
          } flex flex-col items-start sm:flex-row sm:justify-between sm:items-center`}
        >
          <div className="flex items-center text-sm mb-2 sm:mb-0">
            <TrendingUp className="h-4 w-4 text-emerald-600 mr-2" />
            <span>
              Your wage:{' '}
              <span className="font-semibold">${userHourlyRate}</span> (Top
              ~15%)
            </span>
          </div>
          <div className="flex flex-wrap items-center">
            <div className="flex mr-4 mb-2 sm:mb-0">
              <div className="w-4 h-4 bg-emerald-600 rounded-sm mr-1 mt-1" />
              <span className="text-xs font-medium">Your wage</span>
            </div>
            <div className="flex mb-2 sm:mb-0">
              <div className="w-8 border-t-2 border-dashed border-emerald-500 mr-1 mt-2" />
              <span className="text-xs font-medium">Regional avg wage</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
