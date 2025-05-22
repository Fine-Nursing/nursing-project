import React from 'react';
import {
  ResponsiveBar,
  type BarDatum,
  type BarTooltipProps,
  type BarCustomLayerProps,
} from '@nivo/bar';
import { statesData } from 'src/api/mock-data';
import type { NursingSpecialty } from 'src/types/nurse';

interface ChartProps {
  data: NursingSpecialty[];
}

// -------------------------------------------
// 1) 데이터 타입 정의
// -------------------------------------------
type NursingBarDatum = NursingSpecialty & BarDatum;

// -------------------------------------------
// 2) 숫자 포맷팅 함수
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

// -------------------------------------------
// 3) 별도 레이어 컴포넌트(함수) 정의
//    (BarCustomLayerProps<T>를 사용)
// -------------------------------------------
function TopLabelsLayer(props: BarCustomLayerProps<NursingBarDatum>) {
  const { bars } = props;

  // specialty별 최상단 값만 추려서 라벨 표시
  const topBars: Record<string, { x: number; y: number; total: number }> = {};

  bars.forEach((bar) => {
    const specialty = bar.data.indexValue;
    if (!topBars[specialty] || bar.y < topBars[specialty].y) {
      topBars[specialty] = {
        x: bar.x + bar.width / 2,
        y: bar.y - 14,
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
          fill="#374151"
          fontSize={11}
          fontWeight="500"
        >
          {formatCompactNumber(bar.total)}
        </text>
      ))}
    </g>
  );
}

// -------------------------------------------
// 4) 툴팁 컴포넌트
// -------------------------------------------
function ChartTooltip({
  id,
  value,
  indexValue,
  data,
}: BarTooltipProps<NursingBarDatum>) {
  // color 를 쓰고 싶다면 스타일에 활용해도 됩니다
  return (
    <div className="bg-white p-4 shadow-xl rounded-lg border border-gray-100">
      <div className="font-semibold text-gray-800 text-lg mb-2">
        {typeof indexValue === 'number' ? indexValue.toString() : indexValue}
      </div>
      <div className="flex items-center justify-between text-base">
        <span className="text-gray-700">{id}:</span>
        <span className="ml-4 font-medium">
          ${new Intl.NumberFormat().format(value as number)}
        </span>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="font-semibold text-gray-800 text-base">
          Total: ${new Intl.NumberFormat().format(data.total as number)}
        </div>
        <div className="text-sm text-gray-600 mt-1">
          Location: {statesData.find((s) => s.value === data.state)?.label}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------
// 5) 최종 Chart 컴포넌트
// -------------------------------------------
function Chart({ data }: ChartProps) {
  // 스페셜티명 축약 함수 (원하시면 삭제/수정 가능)
  const truncateSpecialty = (name: string) => {
    if (name.length > 15) {
      return `${name.substring(0, 13)}...`;
    }
    return name;
  };

  return (
    <div className="h-[700px]">
      <ResponsiveBar
        data={data as NursingBarDatum[]}
        keys={['Base Pay', 'Differential Pay']}
        indexBy="specialty"
        groupMode="stacked"
        layout="vertical"
        margin={{ top: 60, right: 150, bottom: 140, left: 100 }}
        padding={0.35}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={['#7986cb', '#a4b0f5']}
        borderRadius={0}
        borderWidth={0}
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
          format: (value) => truncateSpecialty(value as string),
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 10,
          tickRotation: 0,
          legend: 'Annual Compensation ($)',
          legendPosition: 'middle',
          legendOffset: -70,
          format: (value) => `$${value / 1000}k`,
          tickValues: 5,
        }}
        enableGridY
        enableGridX={false}
        gridYValues={5}
        theme={{
          grid: {
            line: {
              stroke: '#e2e8f0',
              strokeWidth: 1,
            },
          },
          axis: {
            domain: {
              line: {
                stroke: '#cbd5e1',
                strokeWidth: 1,
              },
            },
            ticks: {
              line: {
                stroke: '#cbd5e1',
                strokeWidth: 1,
              },
              text: {
                fontSize: 12,
                fill: '#64748b',
                fontWeight: 500,
              },
            },
            legend: {
              text: {
                fontSize: 13,
                fill: '#475569',
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
          TopLabelsLayer, // <--- 별도 레이어
        ]}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'top-right',
            direction: 'column',
            justify: false,
            translateX: -20,
            translateY: 0,
            itemsSpacing: 10,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 12,
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
        tooltip={ChartTooltip}
      />
    </div>
  );
}

export default Chart;
