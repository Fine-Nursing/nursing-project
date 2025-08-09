'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  PieChart,
  AreaChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  Pie,
} from 'recharts';

interface ChartData {
  [key: string]: any;
}

interface AnimatedChartProps {
  data: ChartData[];
  type: 'line' | 'bar' | 'area' | 'pie';
  xKey: string;
  yKeys: string[];
  colors?: string[];
  title?: string;
  className?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  height?: number;
  animate?: boolean;
}

export function AnimatedChart({
  data,
  type,
  xKey,
  yKeys,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  title,
  className = '',
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  height = 300,
  animate = true,
}: AnimatedChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  // Custom Tooltip
  function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload || !payload.length) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-3 rounded-lg shadow-lg border"
      >
        <p className="font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mt-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">{entry.name}:</span>
            <span className="text-sm font-medium">{entry.value}</span>
          </div>
        ))}
      </motion.div>
    );
  }

  // Animated Line Chart
  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
        <XAxis dataKey={xKey} className="text-sm" />
        <YAxis className="text-sm" />
        {showTooltip && <Tooltip content={<CustomTooltip />} />}
        {showLegend && <Legend />}
        {yKeys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[index % colors.length]}
            strokeWidth={3}
            dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: colors[index % colors.length] }}
            animationDuration={animate ? 2000 : 0}
            animationBegin={animate ? index * 200 : 0}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );

  // Animated Bar Chart
  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
        <XAxis dataKey={xKey} className="text-sm" />
        <YAxis className="text-sm" />
        {showTooltip && <Tooltip content={<CustomTooltip />} />}
        {showLegend && <Legend />}
        {yKeys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            fill={colors[index % colors.length]}
            radius={[4, 4, 0, 0]}
            animationDuration={animate ? 1500 : 0}
            animationBegin={animate ? index * 100 : 0}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );

  // Animated Area Chart
  const renderAreaChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
        <XAxis dataKey={xKey} className="text-sm" />
        <YAxis className="text-sm" />
        {showTooltip && <Tooltip content={<CustomTooltip />} />}
        {showLegend && <Legend />}
        {yKeys.map((key, index) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stackId="1"
            stroke={colors[index % colors.length]}
            fill={colors[index % colors.length]}
            fillOpacity={0.6}
            animationDuration={animate ? 2000 : 0}
            animationBegin={animate ? index * 200 : 0}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );

  // Animated Pie Chart
  const renderPieChart = () => {
    const pieData = data.map((item, index) => ({
      name: item[xKey],
      value: item[yKeys[0]],
      color: colors[index % colors.length],
    }));

    return (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={Math.min(height * 0.35, 120)}
            fill="#8884d8"
            dataKey="value"
            animationDuration={animate ? 1000 : 0}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke={activeIndex === index ? '#fff' : 'none'}
                strokeWidth={activeIndex === index ? 2 : 0}
              />
            ))}
          </Pie>
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          {showLegend && <Legend />}
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'line': return renderLineChart();
      case 'bar': return renderBarChart();
      case 'area': return renderAreaChart();
      case 'pie': return renderPieChart();
      default: return renderLineChart();
    }
  };

  return (
    <motion.div
      ref={chartRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white rounded-xl shadow-lg p-6 ${className}`}
    >
      {title && (
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg font-semibold text-gray-900 mb-4"
        >
          {title}
        </motion.h3>
      )}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {renderChart()}
      </motion.div>
    </motion.div>
  );
}

// Pre-configured chart variants
export function AnimatedLineChart(props: Omit<AnimatedChartProps, 'type'>) {
  return <AnimatedChart {...props} type="line" />;
}

export function AnimatedBarChart(props: Omit<AnimatedChartProps, 'type'>) {
  return <AnimatedChart {...props} type="bar" />;
}

export function AnimatedAreaChart(props: Omit<AnimatedChartProps, 'type'>) {
  return <AnimatedChart {...props} type="area" />;
}

export function AnimatedPieChart(props: Omit<AnimatedChartProps, 'type'>) {
  return <AnimatedChart {...props} type="pie" />;
}