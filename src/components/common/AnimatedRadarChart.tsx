'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RadarDataPoint {
  axis: string;
  value: number;
  maxValue?: number;
}

interface AnimatedRadarChartProps {
  data: RadarDataPoint[];
  comparisionData?: RadarDataPoint[];
  size?: number;
  className?: string;
  showLabels?: boolean;
  showGrid?: boolean;
  colors?: {
    primary?: string;
    secondary?: string;
    grid?: string;
    text?: string;
  };
}

export default function AnimatedRadarChart({
  data,
  comparisionData,
  size = 300,
  className = '',
  showLabels = true,
  showGrid = true,
  colors = {
    primary: '#3b82f6',
    secondary: '#10b981',
    grid: '#e5e7eb',
    text: '#6b7280',
  },
}: AnimatedRadarChartProps) {
  const [hoveredAxis, setHoveredAxis] = useState<string | null>(null);
  const center = size / 2;
  const radius = size * 0.35;
  const angleSlice = (Math.PI * 2) / data.length;

  // Calculate polygon points
  const getPolygonPoints = (dataset: RadarDataPoint[]) => dataset
    .map((d, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const maxVal = d.maxValue || 100;
      const r = (d.value / maxVal) * radius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    })
    .join(' ');

  // Grid levels
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1];

  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size} className="overflow-visible">
        {/* Grid circles */}
        {showGrid && (
          <g>
            {gridLevels.map((level, i) => (
              <motion.circle
                key={`grid-${level}`}
                cx={center}
                cy={center}
                r={radius * level}
                fill="none"
                stroke={colors.grid}
                strokeWidth="1"
                initial={{ r: 0, opacity: 0 }}
                animate={{ r: radius * level, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: 'easeOut',
                }}
              />
            ))}
          </g>
        )}

        {/* Axis lines */}
        {showGrid && (
          <g>
            {data.map((_, i) => {
              const angle = angleSlice * i - Math.PI / 2;
              const x = center + radius * Math.cos(angle);
              const y = center + radius * Math.sin(angle);
              return (
                <motion.line
                  key={`axis-line-${i}`}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke={colors.grid}
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                />
              );
            })}
          </g>
        )}

        {/* Comparison data polygon */}
        {comparisionData && (
          <motion.polygon
            points={getPolygonPoints(comparisionData)}
            fill={colors.secondary}
            fillOpacity="0.2"
            stroke={colors.secondary}
            strokeWidth="2"
            strokeDasharray="5,5"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        )}

        {/* Main data polygon */}
        <motion.polygon
          points={getPolygonPoints(data)}
          fill={colors.primary}
          fillOpacity="0.3"
          stroke={colors.primary}
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            type: 'spring',
            stiffness: 100,
          }}
        />

        {/* Data points */}
        {data.map((d, i) => {
          const angle = angleSlice * i - Math.PI / 2;
          const maxVal = d.maxValue || 100;
          const r = (d.value / maxVal) * radius;
          const x = center + r * Math.cos(angle);
          const y = center + r * Math.sin(angle);
          const isHovered = hoveredAxis === d.axis;

          return (
            <g key={`datapoint-${d.axis}`}>
              <motion.circle
                cx={x}
                cy={y}
                r={isHovered ? 8 : 5}
                fill={colors.primary}
                stroke="white"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: 0.5 + i * 0.05,
                  type: 'spring',
                }}
                whileHover={{ scale: 1.5 }}
                onHoverStart={() => setHoveredAxis(d.axis)}
                onHoverEnd={() => setHoveredAxis(null)}
                style={{ cursor: 'pointer' }}
              />
              
              {/* Hover tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.g
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <rect
                      x={x - 30}
                      y={y - 40}
                      width="60"
                      height="25"
                      rx="4"
                      fill="rgba(0,0,0,0.8)"
                    />
                    <text
                      x={x}
                      y={y - 22}
                      textAnchor="middle"
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {d.value}
                    </text>
                  </motion.g>
                )}
              </AnimatePresence>
            </g>
          );
        })}

        {/* Axis labels */}
        {showLabels && (
          <g>
            {data.map((d, i) => {
              const angle = angleSlice * i - Math.PI / 2;
              const labelRadius = radius + 30;
              const x = center + labelRadius * Math.cos(angle);
              const y = center + labelRadius * Math.sin(angle);

              return (
                <motion.text
                  key={`label-${d.axis}`}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={colors.text}
                  fontSize="12"
                  fontWeight={hoveredAxis === d.axis ? 'bold' : 'normal'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.05 }}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredAxis(d.axis)}
                  onMouseLeave={() => setHoveredAxis(null)}
                >
                  {d.axis}
                </motion.text>
              );
            })}
          </g>
        )}
      </svg>

      {/* Legend */}
      {comparisionData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="absolute bottom-0 left-0 flex gap-4 text-sm"
        >
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: colors.primary, opacity: 0.7 }}
            />
            <span className="font-semibold">You</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded border-2 border-dashed"
              style={{ borderColor: colors.secondary, backgroundColor: `${colors.secondary}33` }}
            />
            <span className="font-semibold">Regional Avg</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export { AnimatedRadarChart };
