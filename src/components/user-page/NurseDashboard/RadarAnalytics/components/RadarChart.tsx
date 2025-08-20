import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'src/hooks/useTheme';
import { calculateRadarPoints, createPolygonPoints } from '../utils';
import { metricDisplayNames } from '../types';
import type { RadarPoint } from '../types';

interface RadarChartProps {
  userMetrics: Record<string, number>;
  avgMetrics: Record<string, number>;
  theme: 'light' | 'dark';
  hoveredMetric: string | null;
  setHoveredMetric: (metric: string | null) => void;
  maxRadius?: number;
}

export function RadarChart({
  userMetrics,
  avgMetrics,
  theme,
  hoveredMetric,
  setHoveredMetric,
  maxRadius = 80,
}: RadarChartProps) {
  const tc = useTheme(theme);
  const centerX = 175;
  const centerY = 175;
  
  const userPoints = calculateRadarPoints(userMetrics, maxRadius, centerX, centerY);
  const avgPoints = calculateRadarPoints(avgMetrics, maxRadius, centerX, centerY);
  const categories = Object.keys(userMetrics);
  const angleSlice = (Math.PI * 2) / categories.length;

  // Create grid lines
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <svg viewBox="0 0 350 350" className="w-full h-full">
      {/* Grid circles */}
      {gridLevels.map((level) => (
        <circle
          key={level}
          cx={centerX}
          cy={centerY}
          r={maxRadius * level}
          fill="none"
          stroke={tc.theme === 'light' ? '#e5e7eb' : '#475569'}
          strokeWidth="1"
          strokeDasharray="2 2"
          opacity="0.5"
        />
      ))}

      {/* Axis lines */}
      {categories.map((_, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        const x = centerX + maxRadius * Math.cos(angle);
        const y = centerY + maxRadius * Math.sin(angle);
        return (
          <line
            key={i}
            x1={centerX}
            y1={centerY}
            x2={x}
            y2={y}
            stroke={tc.theme === 'light' ? '#e5e7eb' : '#475569'}
            strokeWidth="1"
            opacity="0.5"
          />
        );
      })}

      {/* Average polygon */}
      <motion.polygon
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        points={createPolygonPoints(avgPoints)}
        fill={tc.theme === 'light' ? '#9ca3af' : '#64748b'}
        stroke={tc.theme === 'light' ? '#6b7280' : '#94a3b8'}
        strokeWidth="2"
      />

      {/* User polygon */}
      <motion.polygon
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.7, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        points={createPolygonPoints(userPoints)}
        fill={tc.theme === 'light' ? '#10b981' : '#34d399'}
        stroke={tc.theme === 'light' ? '#059669' : '#10b981'}
        strokeWidth="2.5"
      />

      {/* Data points and labels */}
      {userPoints.map((point, i) => {
        const category = categories[i];
        const labelAngle = angleSlice * i - Math.PI / 2;
        const labelX = centerX + (maxRadius + 25) * Math.cos(labelAngle);
        const labelY = centerY + (maxRadius + 25) * Math.sin(labelAngle);
        const isHovered = hoveredMetric === category;

        return (
          <g key={category}>
            {/* User data point */}
            <motion.circle
              cx={point.x}
              cy={point.y}
              r={isHovered ? 6 : 4}
              fill={tc.theme === 'light' ? '#059669' : '#10b981'}
              stroke="white"
              strokeWidth="2"
              whileHover={{ scale: 1.5 }}
              onMouseEnter={() => setHoveredMetric(category)}
              onMouseLeave={() => setHoveredMetric(null)}
              style={{ cursor: 'pointer' }}
            />

            {/* Label */}
            <text
              x={labelX}
              y={labelY}
              fill={isHovered 
                ? (tc.theme === 'light' ? '#059669' : '#10b981')
                : (tc.theme === 'light' ? '#6b7280' : '#9ca3af')
              }
              fontSize={isHovered ? "14" : "12"}
              fontWeight={isHovered ? "600" : "400"}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredMetric(category)}
              onMouseLeave={() => setHoveredMetric(null)}
            >
              {metricDisplayNames[category] || category}
            </text>

            {/* Value on hover */}
            {isHovered && (
              <motion.text
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                x={labelX}
                y={labelY + 15}
                fill={tc.theme === 'light' ? '#059669' : '#10b981'}
                fontSize="11"
                fontWeight="600"
                textAnchor="middle"
              >
                {point.value?.toFixed(1)}
              </motion.text>
            )}
          </g>
        );
      })}
    </svg>
  );
}