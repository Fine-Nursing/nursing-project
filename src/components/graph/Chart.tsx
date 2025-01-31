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
      <div className="font-semibold text-lg mb-2">
        {typeof indexValue === 'number' ? indexValue.toString() : indexValue}
      </div>
      <div
        style={{ color }}
        className="flex items-center justify-between text-base"
      >
        <span>{id}:</span>
        <span className="ml-4 font-medium">
          ${new Intl.NumberFormat().format(value)}
        </span>
      </div>
      <div className="mt-3 pt-3 border-t">
        <div className="font-semibold text-gray-700 text-base">
          Total: ${new Intl.NumberFormat().format(data.total)}
        </div>
        <div className="text-sm text-gray-600 mt-1">
          Location: {statesData.find((s) => s.value === data.state)?.label}
        </div>
      </div>
    </div>
  );
}

export function Chart({ data }: ChartProps) {
  return (
    <div className="h-[600px]">
      <ResponsiveBar
        // data를 BarDatum 타입에 맞게 캐스팅
        data={data as unknown as NursingBarDatum[]}
        keys={['Base Pay', 'Differential Pay']}
        indexBy="specialty"
        groupMode="stacked"
        layout="vertical"
        margin={{ top: 50, right: 160, bottom: 120, left: 120 }}
        padding={0.4}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={({ id }) =>
          id === 'Base Pay' ? 'rgb(109, 40, 217)' : 'rgb(192, 132, 252)'
        }
        borderRadius={4}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 12,
          tickRotation: -35,
          legend: 'Nursing Specialties',
          legendPosition: 'middle',
          legendOffset: 90,
          // legendFontSize 제거 (지원되지 않는 prop)
          renderTick: ({ value, x, y }) => (
            <g transform={`translate(${x},${y})`}>
              <text
                x={0}
                y={0}
                dy={16}
                transform="rotate(-35)"
                textAnchor="end"
                className="fill-gray-600 text-[13px] font-medium"
              >
                {value}
              </text>
            </g>
          ),
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 12,
          tickRotation: 0,
          legend: 'Annual Compensation ($)',
          legendPosition: 'middle',
          legendOffset: -90,
          format: (value) => `$${value / 1000}k`,
          renderTick: ({ value, x, y }) => (
            <g transform={`translate(${x},${y})`}>
              <text
                x={-12}
                y={0}
                textAnchor="end"
                className="fill-gray-600 text-[13px] font-medium"
              >
                ${value / 1000}k
              </text>
            </g>
          ),
        }}
        theme={{
          axis: {
            legend: {
              text: {
                fontSize: 14,
                fontWeight: 600,
                fill: '#1F2937',
              },
            },
          },
        }}
        enableGridY
        enableGridX={false}
        gridYValues={6}
        animate
        motionConfig="gentle"
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'top-right',
            direction: 'column',
            justify: false,
            translateX: 140,
            translateY: 0,
            itemsSpacing: 6,
            itemWidth: 140,
            itemHeight: 24,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 20,
            itemTextColor: '#4B5563',
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
