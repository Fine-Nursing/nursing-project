// components/NurseDashboard/PredictiveCompChart.tsx
import React from 'react';
import type { TooltipProps } from 'recharts';
// Optimized imports - using ES6 modules for better tree-shaking (4.2MB -> ~1.5MB)
// @ts-ignore - These imports work but don't have TypeScript declarations
import { BarChart } from 'recharts/es6/chart/BarChart';
// @ts-ignore
import { Bar } from 'recharts/es6/cartesian/Bar';
// @ts-ignore
import { CartesianGrid } from 'recharts/es6/cartesian/CartesianGrid';
// @ts-ignore
import { XAxis } from 'recharts/es6/cartesian/XAxis';
// @ts-ignore
import { YAxis } from 'recharts/es6/cartesian/YAxis';
// @ts-ignore
import { Tooltip } from 'recharts/es6/component/Tooltip';
// @ts-ignore
import { ReferenceLine } from 'recharts/es6/cartesian/ReferenceLine';
// @ts-ignore
import { ResponsiveContainer } from 'recharts/es6/component/ResponsiveContainer';
// @ts-ignore
import { Cell } from 'recharts/es6/component/Cell';
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
  userSpecialty?: string;
  userState?: string;
}

// CustomTooltip 컴포넌트를 별도 파일로 분리하는 것이 가장 좋지만,
// 여기서는 동일 파일에서 완전히 분리하여 정의합니다.
function CustomTooltip(
  props: TooltipProps<number, string> & { 
    themeMode: 'light' | 'dark';
    userBarLabel?: string;
    avgBarLabel?: string;
  }
) {
  const { active, payload, themeMode, userBarLabel, avgBarLabel } = props;

  if (active && payload && payload.length) {
    const { count, label } = payload[0].payload as PayDistributionEntry;
    const isUserWage = label === userBarLabel;
    const isAvgWage = label === avgBarLabel;
    
    return (
      <div
        className={`p-3 ${
          themeMode === 'light' ? 'bg-white' : 'bg-slate-700'
        } shadow-lg rounded-2xl border ${
          themeMode === 'light' ? 'border-slate-100' : 'border-slate-600'
        }`}
      >
        <p className="font-semibold">Wage Range: {label}</p>
        <p className="text-slate-600 dark:text-slate-300 font-medium flex items-center">
          <User className="w-3 h-3 mr-1" />
          Nurses: {count}
        </p>
        {isUserWage && (
          <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mt-1">
            ⭐ Your Position
          </p>
        )}
        {isAvgWage && !isUserWage && (
          <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium mt-1">
            📊 Regional Average
          </p>
        )}
      </div>
    );
  }
  return null;
}

// 이 CustomTooltipRenderer는 Tooltip의 content 속성에 전달할 함수를 생성합니다.
// PredictiveCompChart 외부에 정의하여 렌더링마다 재생성되지 않도록 합니다.
// eslint-disable-next-line react/display-name
const createTooltipRenderer = (
  theme: 'light' | 'dark',
  userBarLabel?: string,
  avgBarLabel?: string
) => {
  function tooltipRenderer(tooltipProps: TooltipProps<number, string>) {
    return (
      <CustomTooltip 
        {...tooltipProps} 
        themeMode={theme}
        userBarLabel={userBarLabel}
        avgBarLabel={avgBarLabel}
      />
    );
  }
  return tooltipRenderer;
};

export default function PredictiveCompChart({
  payDistributionData,
  userHourlyRate,
  regionalAvgWage,
  theme,
  userSpecialty = '',
  userState = '',
}: PredictiveCompChartProps) {
  // 디버깅용 로그
  React.useEffect(() => {
    console.log('📊 PredictiveCompChart Debug:', {
      userHourlyRate,
      regionalAvgWage,
      payDistributionDataLength: payDistributionData?.length,
      firstDistItem: payDistributionData?.[0],
    });
  }, [userHourlyRate, regionalAvgWage, payDistributionData]);

  if (!payDistributionData || payDistributionData.length === 0) {
    return (
      <div className={`${
        theme === 'light' ? 'bg-white' : 'bg-slate-800'
      } rounded-xl shadow-lg border ${
        theme === 'light' ? 'border-gray-200' : 'border-slate-700'
      } p-6`}>
        <p className="text-center text-gray-500">No wage distribution data available</p>
      </div>
    );
  }
  
  // Find which bar represents the user's wage range
  const userBarLabel = React.useMemo(() => {
    // Find the range that contains the user's hourly rate
    for (const item of payDistributionData) {
      if (item.label) {
        const match = item.label.match(/\$(\d+)-(\d+)/);
        if (match) {
          const min = parseInt(match[1]);
          const max = parseInt(match[2]);
          // Use <= for the upper bound to include exact matches at the boundary
          if (userHourlyRate >= min && userHourlyRate <= max) {
            console.log('🎯 Found user bar:', item.label, 'for rate:', userHourlyRate);
            return item.label;
          }
        }
      }
    }
    console.log('❌ User bar not found for rate:', userHourlyRate);
    return null;
  }, [payDistributionData, userHourlyRate]);

  // Find which bar represents the regional average
  const avgBarLabel = React.useMemo(() => {
    // Find the range that contains the regional average
    for (const item of payDistributionData) {
      if (item.label) {
        const match = item.label.match(/\$(\d+)-(\d+)/);
        if (match) {
          const min = parseInt(match[1]);
          const max = parseInt(match[2]);
          // Use <= for the upper bound to include exact matches at the boundary
          if (regionalAvgWage >= min && regionalAvgWage <= max) {
            return item.label;
          }
        }
      }
    }
    return null;
  }, [payDistributionData, regionalAvgWage]);

  // theme에 따라 적절한 렌더러 함수 선택
  const tooltipRenderer = React.useMemo(
    () => createTooltipRenderer(theme, userBarLabel || undefined, avgBarLabel || undefined),
    [theme, userBarLabel, avgBarLabel]
  );

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
              {userSpecialty && userState 
                ? `Wage distribution for ${userSpecialty} in ${userState}`
                : userSpecialty 
                ? `Wage distribution for ${userSpecialty}`
                : userState
                ? `Wage distribution in ${userState}`
                : 'Wage distribution'
              }
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
                dataKey="label"
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
              {/* User position marker - using ReferenceLine with categorical X */}
              {userBarLabel && (
                <ReferenceLine
                  x={userBarLabel}
                  stroke="#3b82f6"
                  strokeWidth={3}
                  isFront
                  label={<CuteWageLabel wage={userHourlyRate} />}
                />
              )}
              {/* Regional average marker - only if different from user */}
              {avgBarLabel && avgBarLabel !== userBarLabel && (
                <ReferenceLine
                  x={avgBarLabel}
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  label={{
                    value: `Avg $${regionalAvgWage}/hr`,
                    position: 'top',
                    fill: '#10b981',
                    fontSize: 11,
                    offset: 10,
                    style: {
                      textAnchor: 'middle',
                      fontWeight: 600
                    }
                  }}
                />
              )}
              <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={30}>
                {payDistributionData.map((entry) => {
                  let fillColor = theme === 'light' ? '#e5e7eb' : '#4b5563'; // Gray-200/Gray-600 default
                  
                  // Highlight user's bar with blue (no border)
                  if (entry.label === userBarLabel) {
                    fillColor = theme === 'light' ? '#3b82f6' : '#60a5fa'; // Blue-500/Blue-400
                  }
                  // Highlight regional average bar with green (if different from user)
                  else if (entry.label === avgBarLabel) {
                    fillColor = theme === 'light' ? '#10b981' : '#34d399'; // Emerald-500/Emerald-400
                  }
                  // Nearby ranges get subtle purple highlighting
                  else if (entry.highlight) {
                    fillColor = theme === 'light' ? '#c7d2fe' : '#6366f1'; // Indigo-200/Indigo-500
                  }
                  
                  return (
                    <Cell 
                      key={`cell-${entry.id}`} 
                      fill={fillColor}
                    />
                  );
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
                {userHourlyRate > regionalAvgWage 
                  ? `+$${(userHourlyRate - regionalAvgWage).toFixed(2)}/hr (+${((userHourlyRate - regionalAvgWage) / regionalAvgWage * 100).toFixed(0)}%)`
                  : userHourlyRate < regionalAvgWage
                  ? `-$${(regionalAvgWage - userHourlyRate).toFixed(2)}/hr (${((userHourlyRate - regionalAvgWage) / regionalAvgWage * 100).toFixed(0)}%)`
                  : 'Same as average'
                }
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
                {userState || 'All Regions'}
              </p>
            </div>

            {/* Specialty Info */}
            <div className={`p-2 sm:p-4 rounded-lg ${
              theme === 'light' ? 'bg-amber-50' : 'bg-amber-900/20'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400" />
                <span className={`text-xs sm:text-sm font-medium ${
                  theme === 'light' ? 'text-amber-700' : 'text-amber-400'
                }`}>
                  Specialty
                </span>
              </div>
              <p className={`text-base sm:text-lg font-bold ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {userSpecialty || 'All Specialties'}
              </p>
              <p className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400">
                {payDistributionData.reduce((sum, d) => sum + d.count, 0)} nurses
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}