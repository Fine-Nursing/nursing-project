import React from 'react';
import { m } from 'framer-motion';
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
    <svg 
      width="350" 
      height="350" 
      viewBox="0 0 350 350" 
      className="w-full h-auto max-w-[280px] sm:max-w-sm"
    >
      {/* Definitions */}
      <defs>
        <radialGradient id="userGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
        </radialGradient>
      </defs>

      {/* Background circles */}
      <g className="opacity-20">
        {[80, 60, 40, 20].map((r) => (
          <circle
            key={r}
            cx="175"
            cy="175"
            r={r}
            fill="none"
            stroke={theme === 'light' ? '#9ca3af' : '#475569'}
            strokeWidth="1"
          />
        ))}
      </g>

      {/* Axis lines */}
      {Object.keys(userMetrics).map((_, i) => {
        const angleSlice = (Math.PI * 2) / Object.keys(userMetrics).length;
        const angle = angleSlice * i - Math.PI / 2;
        const x2 = 175 + 80 * Math.cos(angle);
        const y2 = 175 + 80 * Math.sin(angle);
        
        return (
          <line
            key={i}
            x1="175"
            y1="175"
            x2={x2}
            y2={y2}
            stroke={theme === 'light' ? '#d1d5db' : '#475569'}
            strokeWidth="1"
            opacity="0.5"
          />
        );
      })}

      {/* Average polygon */}
      <m.polygon
        points={createPolygonPoints(avgPoints)}
        fill="none"
        stroke={theme === 'light' ? '#9ca3af' : '#6b7280'}
        strokeWidth="2"
        strokeDasharray="4,4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      />

      {/* User polygon */}
      <m.polygon
        points={createPolygonPoints(userPoints)}
        fill="url(#userGradient)"
        stroke="#3b82f6"
        strokeWidth="2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          delay: 0.3, 
          type: "spring", 
          stiffness: 100, 
          damping: 15 
        }}
        style={{ transformOrigin: '175px 175px' }}
      />

      {/* Average data points (작은 회색 점) */}
      {avgPoints.map((pt, i) => (
        <circle
          key={`avg-${pt.label}`}
          cx={pt.x}
          cy={pt.y}
          r="3"
          fill={theme === 'light' ? '#9ca3af' : '#6b7280'}
          opacity="0.7"
        />
      ))}

      {/* User data points */}
      {userPoints.map((pt, i) => (
        <g key={pt.label}>
          <m.circle
            cx={pt.x}
            cy={pt.y}
            r="5"
            fill="#3b82f6"
            stroke="white"
            strokeWidth="2"
            className="cursor-pointer"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              delay: 0.4 + i * 0.02,
              type: "spring",
              stiffness: 200,
              damping: 10
            }}
            whileHover={{ 
              scale: 1.3,
              transition: { duration: 0.15 }
            }}
            onMouseEnter={() => setHoveredMetric(pt.label || null)}
            onMouseLeave={() => setHoveredMetric(null)}
          />
          
          {/* Hover tooltip - 사용자 값과 평균값 모두 표시 */}
          {hoveredMetric === pt.label && (
            <g>
              <rect
                x={pt.x - 35}
                y={pt.y - 40}
                width="70"
                height="35"
                rx="3"
                fill={theme === 'light' ? 'white' : '#1e293b'}
                stroke="#3b82f6"
                strokeWidth="1"
              />
              <text
                x={pt.x}
                y={pt.y - 25}
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill="#3b82f6"
              >
                You: {pt.value?.toFixed(1)}
              </text>
              <text
                x={pt.x}
                y={pt.y - 12}
                textAnchor="middle"
                fontSize="11"
                fill={theme === 'light' ? '#6b7280' : '#9ca3af'}
              >
                Avg: {avgPoints[i]?.value?.toFixed(1)}
              </text>
            </g>
          )}
        </g>
      ))}

      {/* Labels */}
      {Object.keys(userMetrics).map((cat, i) => {
        const angleSlice = (Math.PI * 2) / Object.keys(userMetrics).length;
        const angle = angleSlice * i - Math.PI / 2;
        const labelRadius = 100;
        const x = 175 + labelRadius * Math.cos(angle);
        const y = 175 + labelRadius * Math.sin(angle);
        
        return (
          <text
            key={cat}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fill={theme === 'light' ? '#4b5563' : '#d1d5db'}
            fontWeight="500"
            className="select-none"
          >
            {metricDisplayNames[cat] || cat}
          </text>
        );
      })}
    </svg>
  );
}