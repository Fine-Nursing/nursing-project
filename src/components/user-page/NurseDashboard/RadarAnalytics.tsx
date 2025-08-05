// components/NurseDashboard/RadarAnalytics.tsx
import React, { useState } from 'react';
import { Award } from 'lucide-react';
import { useAllAiInsights } from 'src/api/useAiInsights';

interface RadarAnalyticsProps {
  userMetrics: Record<string, number>;
  avgMetrics: Record<string, number>;
  theme: 'light' | 'dark';
  metricAnalysis: Record<string, string>;
}

// 포인트의 타입 정의
interface RadarPoint {
  x: number;
  y: number;
  label?: string;
  value?: number;
}

// 유틸함수
function calculateRadarPoints(
  metrics: Record<string, number>,
  radius: number
): RadarPoint[] {
  const categories = Object.keys(metrics);
  const angleSlice = (Math.PI * 2) / categories.length;
  const points: RadarPoint[] = [];

  categories.forEach((cat, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    const value = metrics[cat] / 10; // convert 0-10 to 0-1
    const cx = 160;
    const cy = 160;
    const x = cx + radius * value * Math.cos(angle);
    const y = cy + radius * value * Math.sin(angle);
    points.push({ x, y, label: cat, value: metrics[cat] });
  });
  return points;
}

function createPolygonPoints(points: RadarPoint[]): string {
  return points.map((p) => `${p.x},${p.y}`).join(' ');
}

export default function RadarAnalytics({
  userMetrics,
  avgMetrics,
  theme,
  metricAnalysis,
}: RadarAnalyticsProps) {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const { data: allInsights, isLoading: isInsightsLoading } = useAllAiInsights();

  const userPoints = calculateRadarPoints(userMetrics, 120);
  const avgPoints = calculateRadarPoints(avgMetrics, 120);

  return (
    <div
      className={`${
        theme === 'light' ? 'bg-white' : 'bg-slate-700'
      } rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border ${
        theme === 'light' ? 'border-slate-100' : 'border-slate-600'
      } space-y-3`}
    >
      <h2 className="text-lg sm:text-xl font-bold flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="flex items-center">
          <Award className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-slate-500" />
          <span>Advanced Analytics</span>
        </div>
        <div className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full w-fit">
          AI Powered
        </div>
      </h2>

      <div className="relative overflow-x-auto">
        <svg 
          width="320" 
          height="320" 
          viewBox="0 0 320 320" 
          className="mx-auto w-full h-auto max-w-xs sm:max-w-sm"
        >
          {/* Background circles */}
          {[120, 90, 60, 30].map((r) => (
            <circle
              key={r}
              cx="160"
              cy="160"
              r={r}
              fill="none"
              stroke={theme === 'light' ? '#e5e7eb' : '#4b5563'}
              strokeWidth="1"
            />
          ))}

          {/* Axis lines */}
          <line
            x1="160"
            y1="40"
            x2="160"
            y2="280"
            stroke={theme === 'light' ? '#e5e7eb' : '#4b5563'}
            strokeWidth="1"
          />
          <line
            x1="40"
            y1="160"
            x2="280"
            y2="160"
            stroke={theme === 'light' ? '#e5e7eb' : '#4b5563'}
            strokeWidth="1"
          />
          {/* Diagonals */}
          <line
            x1="76"
            y1="76"
            x2="244"
            y2="244"
            stroke={theme === 'light' ? '#e5e7eb' : '#4b5563'}
            strokeWidth="1"
          />
          <line
            x1="244"
            y1="76"
            x2="76"
            y2="244"
            stroke={theme === 'light' ? '#e5e7eb' : '#4b5563'}
            strokeWidth="1"
          />

          {/* Average polygon */}
          <polygon
            points={createPolygonPoints(avgPoints)}
            fill="rgba(20, 184, 166, 0.1)"
            stroke="#14b8a6"
            strokeWidth="1"
            strokeDasharray="3,3"
          />

          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feFlood floodColor="#14b8a6" floodOpacity="0.5" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="shadow" />
            <feComposite in="SourceGraphic" in2="shadow" operator="over" />
          </filter>

          {/* User polygon with glow */}
          <polygon
            points={createPolygonPoints(userPoints)}
            fill="rgba(20,184,166,0.3)"
            stroke="#14b8a6"
            strokeWidth="2"
            filter="url(#glow)"
          />

          {/* Points */}
          {userPoints.map((pt) => (
            <g key={pt.label}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r="4"
                fill="#14b8a6"
                className="cursor-pointer hover:r-6 transition-all duration-300"
                onMouseEnter={() => setShowTooltip(pt.label || null)}
                onMouseLeave={() => setShowTooltip(null)}
              />
              {showTooltip !== null && showTooltip === pt.label && pt.label && (
                <foreignObject
                  x={pt.x - 80}
                  y={pt.y - 50}
                  width="160"
                  height="60"
                >
                  <div
                    className={`shadow-lg rounded-2xl p-3 text-xs border ${
                      theme === 'light'
                        ? 'bg-white border-slate-200 text-gray-800'
                        : 'bg-slate-700 border-slate-600 text-white'
                    }`}
                  >
                    <div className="font-bold text-slate-600 mb-1">
                      {pt.label}: {pt.value?.toFixed(1)}
                    </div>
                    <div>{pt.label && metricAnalysis[pt.label]}</div>
                  </div>
                </foreignObject>
              )}
            </g>
          ))}

          {/* Category labels */}
          {Object.keys(userMetrics).map((cat, i) => {
            const angleSlice = (Math.PI * 2) / Object.keys(userMetrics).length;
            const angle = angleSlice * i - Math.PI / 2;
            const labelRadius = 140;
            const labelX = 160 + labelRadius * Math.cos(angle);
            const labelY = 160 + labelRadius * Math.sin(angle);
            return (
              <text
                key={cat}
                x={labelX}
                y={labelY}
                textAnchor="middle"
                fontSize="10"
                fill={theme === 'light' ? '#374151' : '#e5e7eb'}
                dy="4"
              >
                {cat.length > 12 ? cat.substring(0, 10) + '...' : cat}
              </text>
            );
          })}
        </svg>
      </div>

      <div
        className={`p-3 rounded-xl sm:rounded-2xl border text-xs sm:text-sm ${
          theme === 'light'
            ? 'bg-slate-50 border-slate-200'
            : 'bg-slate-600 border-slate-500 text-white'
        }`}
      >
        <p
          className={`font-medium mb-2 ${
            theme === 'light' ? 'text-slate-700' : 'text-slate-300'
          }`}
        >
          AI Career Insights
        </p>
        {isInsightsLoading ? (
          <p className="text-slate-400 text-xs">Loading AI insights...</p>
        ) : allInsights?.market || allInsights?.compensation ? (
          <div className="space-y-2">
            {allInsights.market && (
              <div>
                <p className="font-medium text-xs mb-1">Market Analysis:</p>
                <p className="text-xs leading-relaxed">{allInsights.market}</p>
              </div>
            )}
            {allInsights.compensation && (
              <div>
                <p className="font-medium text-xs mb-1">Compensation Insights:</p>
                <p className="text-xs leading-relaxed">{allInsights.compensation}</p>
              </div>
            )}
          </div>
        ) : (
          <ul
            className={`list-disc list-inside space-y-1 text-xs ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-200'
            }`}
          >
            {Object.keys(metricAnalysis).slice(0, 3).map((key) => (
              <li key={key} className="leading-relaxed">{metricAnalysis[key]}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
