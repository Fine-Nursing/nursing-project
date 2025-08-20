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
import { TrendingUp, User, BarChart3, Activity } from 'lucide-react';
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
          themeMode === 'light' ? 'border-slate-100' : 'border-slate-600'
        }`}
      >
        <p className="font-semibold">Wage: {label}</p>
        <p className="text-slate-600 font-medium flex items-center">
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

  // Calculate dynamic X-axis domain based on data and user rate
  const xDomain = React.useMemo(() => {
    const wages = payDistributionData.map(d => d.wageValue);
    wages.push(userHourlyRate, regionalAvgWage);
    const minWage = Math.min(...wages);
    const maxWage = Math.max(...wages);
    
    // Add 10% padding on both sides
    const padding = (maxWage - minWage) * 0.1;
    return [
      Math.floor(minWage - padding),
      Math.ceil(maxWage + padding)
    ];
  }, [payDistributionData, userHourlyRate, regionalAvgWage]);

  // Calculate dynamic Y-axis domain based on count values
  const yDomain = React.useMemo(() => {
    const counts = payDistributionData.map(d => d.count);
    const maxCount = Math.max(...counts);
    
    // Add 20% padding on top
    return [0, Math.ceil(maxCount * 1.2)];
  }, [payDistributionData]);

  return (
    <div
      className={`${
        theme === 'light' ? 'bg-white' : 'bg-slate-800'
      } rounded-xl shadow-lg border ${
        theme === 'light' ? 'border-gray-200' : 'border-slate-700'
      }`}
    >
      {/* Header */}
      <div className={`px-6 py-4 border-b ${
        theme === 'light' ? 'border-gray-100' : 'border-slate-700'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-lg font-semibold ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Predictive Compensation Comparison
            </h2>
            <p className={`text-sm mt-0.5 ${
              theme === 'light' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              AI-powered wage analysis for ER nurses in New York City
            </p>
          </div>
          
          <div className={`px-3 py-2 rounded-lg ${
            theme === 'light' ? 'bg-green-50' : 'bg-green-900/30'
          }`}>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Live Data</p>
                <p className="text-sm font-bold text-green-600 dark:text-green-400">
                  Updated
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Chart Container */}
        <div className={`rounded-lg p-3 sm:p-6 ${
          theme === 'light' ? 'bg-gray-50' : 'bg-slate-900/30'
        }`}>
          <div className="w-full">
            <div className="h-64 sm:h-80 lg:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={payDistributionData}
                  margin={{ 
                    top: 40, 
                    right: 20, 
                    bottom: 40, 
                    left: 20 
                  }}
                >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === 'light' ? '#f3f4f6' : '#374151'}
              />
              <XAxis
                type="number"
                dataKey="wageValue"
                domain={xDomain}
                tick={{
                  fill: theme === 'light' ? '#6b7280' : '#e5e7eb',
                  fontSize: 9,
                }}
                label={{
                  value: 'Hourly Wage ($)',
                  position: 'insideBottom',
                  offset: -5,
                  style: {
                    textAnchor: 'middle',
                    fill: theme === 'light' ? '#6b7280' : '#e5e7eb',
                    fontSize: 10,
                  },
                }}
              />
              <YAxis
                dataKey="count"
                domain={yDomain}
                tick={{
                  fill: theme === 'light' ? '#6b7280' : '#e5e7eb',
                  fontSize: 9,
                }}
                label={{
                  value: 'Nurses',
                  angle: -90,
                  position: 'insideLeft',
                  style: {
                    textAnchor: 'middle',
                    fill: theme === 'light' ? '#6b7280' : '#e5e7eb',
                    fontSize: 12,
                  },
                }}
              />
              <Tooltip content={tooltipRenderer} />
              <ReferenceLine
                x={userHourlyRate}
                stroke="#3b82f6"
                strokeWidth={3}
                isFront
                label={<CuteWageLabel wage={userHourlyRate} />}
              />
              <ReferenceLine
                x={regionalAvgWage}
                stroke="#6b7280"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{
                  value: 'Regional Avg',
                  position: 'top',
                  fill: '#6b7280',
                  fontSize: 11,
                  offset: 15,
                  style: {
                    textAnchor: 'middle'
                  }
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {payDistributionData.map((entry) => {
                  let fillColor = theme === 'light' ? '#ddd6fe' : '#5b21b6'; // Purple-200/Purple-800
                  if (entry.isUser)
                    fillColor = theme === 'light' ? '#3b82f6' : '#60a5fa'; // Blue-500/Blue-400
                  else if (entry.highlight) 
                    fillColor = theme === 'light' ? '#8b5cf6' : '#a78bfa'; // Purple-500/Purple-400
                  return <Cell key={`cell-${entry.id}`} fill={fillColor} />;
                })}
              </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Chart Summary */}
        <div className={`mt-3 sm:mt-4 pt-3 sm:pt-4 border-t ${
          theme === 'light' ? 'border-gray-200' : 'border-slate-700'
        }`}>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {/* Your Position */}
            <div className={`p-2 sm:p-4 rounded-lg ${
              theme === 'light' ? 'bg-green-50' : 'bg-green-900/20'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
                <span className={`text-xs sm:text-sm font-medium ${
                  theme === 'light' ? 'text-green-700' : 'text-green-400'
                }`}>
                  Your Position
                </span>
              </div>
              <p className={`text-base sm:text-lg font-bold ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                ${userHourlyRate}/hr
              </p>
              <p className="text-[10px] sm:text-xs text-green-600 dark:text-green-400">
                Top 15%
              </p>
            </div>

            {/* Regional Average */}
            <div className={`p-2 sm:p-4 rounded-lg ${
              theme === 'light' ? 'bg-emerald-50' : 'bg-emerald-900/20'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
                <span className={`text-xs sm:text-sm font-medium ${
                  theme === 'light' ? 'text-emerald-700' : 'text-blue-400'
                }`}>
                  Regional Avg
                </span>
              </div>
              <p className={`text-base sm:text-lg font-bold ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                ${regionalAvgWage}/hr
              </p>
              <p className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400">
                NYC ER
              </p>
            </div>

            {/* Market Analysis */}
            <div className={`p-2 sm:p-4 rounded-lg ${
              theme === 'light' ? 'bg-amber-50' : 'bg-amber-900/20'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
                <span className={`text-xs sm:text-sm font-medium ${
                  theme === 'light' ? 'text-amber-700' : 'text-amber-400'
                }`}>
                  Market
                </span>
              </div>
              <p className={`text-base sm:text-lg font-bold ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                +8.5%
              </p>
              <p className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400">
                YoY growth
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}