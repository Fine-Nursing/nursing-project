import type { BarDatum, BarTooltipProps } from '@nivo/bar';
import { ResponsiveBar } from '@nivo/bar';
import { statesData } from 'src/api/mock-data';
import type { NursingSpecialty } from 'src/types/nurse';

interface ChartProps {
  data: NursingSpecialty[];
}

type NursingBarDatum = NursingSpecialty & BarDatum;

function ChartTooltip({
  id,
  value,
  color,
  indexValue,
  data,
}: BarTooltipProps<NursingBarDatum>) {
  return (
    <div className="bg-white p-4 shadow-xl rounded-lg border border-gray-100">
      <div className="font-semibold text-gray-800 text-lg mb-2">
        {typeof indexValue === 'number' ? indexValue.toString() : indexValue}
      </div>
      <div className="flex items-center justify-between text-base">
        <span className="text-gray-700">{id}:</span>
        <span className="ml-4 font-medium">
          ${new Intl.NumberFormat().format(value)}
        </span>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="font-semibold text-gray-800 text-base">
          Total: ${new Intl.NumberFormat().format(data.total)}
        </div>
        <div className="text-sm text-gray-600 mt-1">
          Location: {statesData.find((s) => s.value === data.state)?.label}
        </div>
      </div>
    </div>
  );
}

// 숫자 포맷팅 함수: 천 단위로 줄여서 표시 (예: 48,500 -> 48.5K)
function formatCompactNumber(num: number): string {
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `$${(num / 1000).toFixed(1)}K`;
  }
  return `$${num}`;
}

function Chart({ data }: ChartProps) {
  // 깔끔한 파스텔 계열 색상
  const chartColors = ['#7986cb', '#a4b0f5'];

  // 스페셜티명 축약 함수
  const truncateSpecialty = (name: string) => {
    if (name.length > 15) {
      return `${name.substring(0, 13)}...`;
    }
    return name;
  };

  return (
    <div className="h-[700px]">
      <ResponsiveBar
        data={data as unknown as NursingBarDatum[]}
        keys={['Base Pay', 'Differential Pay']}
        indexBy="specialty"
        groupMode="stacked"
        layout="vertical"
        // 여백 대폭 늘림
        margin={{ top: 60, right: 150, bottom: 140, left: 100 }}
        padding={0.35}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={chartColors}
        // 둥근 모서리 설정 (상단만)
        borderRadius={[8, 8, 0, 0]}
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
          // 총액 표시 레이어
          (props) => {
            const { bars } = props;

            // 스페셜티별 최상단 바 찾아서 총액 표시
            const topBars = {};

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
                {Object.entries(topBars).map(([key, bar]: [string, any], i) => (
                  <text
                    key={key}
                    x={bar.x}
                    y={bar.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-gray-700 text-[11px] font-medium"
                  >
                    {formatCompactNumber(bar.total)}
                  </text>
                ))}
              </g>
            );
          },
        ]}
        // 범례 설정 - 위치 조정하여 겹치지 않게 함
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
