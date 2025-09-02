import React, { useState, useEffect } from 'react';
import {
  ResponsiveBar,
  type BarDatum,
  type BarTooltipProps,
  type BarCustomLayerProps,
} from '@nivo/bar';
import type { RegionStates } from 'src/types/location';
import { findStateByCode } from 'src/api/useLocations';
import { useTheme } from 'src/contexts/ThemeContext';

// -------------------------------------------
// Types
// -------------------------------------------
interface ChartProps {
  data: Array<{
    specialty: string;
    'Base Pay': number;
    'Differential Pay': number;
    total: number;
    state: string;
  }>;
  states?: RegionStates;
}

type NursingBarDatum = {
  specialty: string;
  'Base Pay': number;
  'Differential Pay': number;
  total: number;
  state: string;
} & BarDatum;

interface ChartTooltipProps extends BarTooltipProps<NursingBarDatum> {
  states?: RegionStates;
}

// -------------------------------------------
// Utility functions
// -------------------------------------------
function formatCompactNumber(num: number): string {
  if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `$${(num / 1_000).toFixed(1)}K`;
  }
  return `$${num}`;
}

function truncateSpecialty(name: string): string {
  if (!name || typeof name !== 'string') {
    return '';
  }
  if (name.length > 15) {
    return `${name.substring(0, 13)}...`;
  }
  return name;
}

// -------------------------------------------
// Components (defined outside of main component)
// -------------------------------------------
function createTopLabelsLayer(isMobile: boolean) {
  return function TopLabelsLayer({ bars }: BarCustomLayerProps<NursingBarDatum>) {
    // specialty별 최상단 값만 추려서 라벨 표시
    const topBars: Record<string, { x: number; y: number; total: number }> = {};

    bars.forEach((bar) => {
      const specialty = bar.data.indexValue as string;
      if (!topBars[specialty] || bar.y < topBars[specialty].y) {
        topBars[specialty] = {
          x: bar.x + bar.width / 2,
          y: bar.y - (isMobile ? 10 : 14),
          total: bar.data.data.total,
        };
      }
    });

    return (
      <g>
        {Object.entries(topBars).map(([key, bar]) => (
          <text
            key={key}
            x={bar.x}
            y={bar.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={document.documentElement.classList.contains('dark') ? '#e2e8f0' : '#374151'}
            fontSize={isMobile ? 9 : 11}
            fontWeight="500"
          >
            {formatCompactNumber(bar.total)}
          </text>
        ))}
      </g>
    );
  };
}

function ChartTooltip({
  indexValue,
  data,
  states,
}: ChartTooltipProps) {
  const stateName =
    states && data.state !== 'ALL'
      ? findStateByCode(states, data.state)?.name
      : 'All Locations';

  return (
    <div className="bg-white p-3 sm:p-4 shadow-xl rounded-lg border border-gray-100 min-w-[250px]">
      <div className="font-semibold text-gray-800 text-sm sm:text-lg mb-2 sm:mb-3">
        {typeof indexValue === 'number' ? indexValue.toString() : indexValue}
      </div>
      
      {/* Base Pay */}
      <div className="flex items-center justify-between text-xs sm:text-sm mb-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
          <span className="text-gray-700">Base Pay:</span>
        </div>
        <span className="font-medium text-indigo-600">
          ${new Intl.NumberFormat().format(data['Base Pay'])}
        </span>
      </div>
      
      {/* Differential Pay */}
      <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-300"></div>
          <span className="text-gray-700">Differential Pay:</span>
        </div>
        <span className="font-medium text-indigo-400">
          ${new Intl.NumberFormat().format(data['Differential Pay'])}
        </span>
      </div>
      
      <div className="pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between font-semibold text-gray-800 text-xs sm:text-base mb-1">
          <span>Total Compensation:</span>
          <span className="text-emerald-600">
            ${new Intl.NumberFormat().format(data.total)}
          </span>
        </div>
        <div className="text-xs sm:text-sm text-gray-600">
          Location: {stateName || data.state}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------
// Main Chart Component
// -------------------------------------------
function Chart({ data, states }: ChartProps) {
  const [isMobile, setIsMobile] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 데이터가 없거나 유효하지 않을 때 처리
  if (!data || data.length === 0) {
    return (
      <div className="h-[650px] w-full flex items-center justify-center text-gray-500 dark:text-neutral-400 text-sm sm:text-base">
        No data to display
      </div>
    );
  }

  // 데이터 유효성 검사
  const validData = data.filter(
    (item) => item && item.specialty && typeof item.specialty === 'string'
  );

  if (validData.length === 0) {
    return (
      <div className="h-[650px] w-full flex items-center justify-center text-gray-500 dark:text-neutral-400 text-sm sm:text-base">
        No valid data to display
      </div>
    );
  }

  return (
    <div className="h-[650px] w-full">
      <ResponsiveBar
        data={validData as NursingBarDatum[]}
        keys={['Base Pay', 'Differential Pay']}
        indexBy="specialty"
        groupMode="stacked"
        layout="vertical"
        margin={{ 
          top: isMobile ? 40 : 60, 
          right: isMobile ? 40 : 80, 
          bottom: isMobile ? 100 : 140, 
          left: isMobile ? 80 : 120 
        }}
        padding={0.25}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={isDark ? ['#818cf8', '#a5b4fc'] : ['#7986cb', '#a4b0f5']}
        borderRadius={2}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
        enableLabel={false}
        animate
        motionConfig="gentle"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 10,
          tickRotation: -35,
          legend: 'Nursing Specialties',
          legendPosition: 'middle',
          legendOffset: 110,
          format: (value) => truncateSpecialty(String(value || '')),
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 10,
          tickRotation: 0,
          legend: 'Annual Compensation ($)',
          legendPosition: 'middle',
          legendOffset: -70,
          format: (value) => `$${(value as number) / 1000}k`,
          tickValues: 5,
        }}
        enableGridY
        enableGridX={false}
        gridYValues={5}
        theme={{
          grid: {
            line: {
              stroke: isDark ? '#334155' : '#e2e8f0',
              strokeWidth: 1,
            },
          },
          axis: {
            domain: {
              line: {
                stroke: isDark ? '#475569' : '#cbd5e1',
                strokeWidth: 1,
              },
            },
            ticks: {
              line: {
                stroke: isDark ? '#475569' : '#cbd5e1',
                strokeWidth: 1,
              },
              text: {
                fontSize: isMobile ? 10 : 12,
                fill: isDark ? '#94a3b8' : '#64748b',
                fontWeight: 500,
              },
            },
            legend: {
              text: {
                fontSize: isMobile ? 11 : 13,
                fill: isDark ? '#cbd5e1' : '#475569',
                fontWeight: 600,
              },
            },
          },
        }}
        layers={[
          'grid',
          'axes',
          'bars',
          'markers',
          'legends',
          'annotations',
          createTopLabelsLayer(isMobile),
        ]}
        legends={isMobile ? [] : [
          {
            dataFrom: 'keys',
            anchor: 'top-right',
            direction: 'column',
            justify: false,
            translateX: -10,
            translateY: 20,
            itemsSpacing: 12,
            itemWidth: 120,
            itemHeight: 22,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 14,
            symbolShape: 'circle',
            effects: [
              {
                on: 'hover',
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        // eslint-disable-next-line react/no-unstable-nested-components
        tooltip={(props) => <ChartTooltip {...props} states={states} />}
      />
    </div>
  );
}

export default Chart;
