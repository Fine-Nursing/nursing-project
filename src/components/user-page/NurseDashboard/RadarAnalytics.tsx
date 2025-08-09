'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity,
  TrendingUp,
  Target,
  Brain,
  ChevronRight,
  Sparkles,
  BarChart3,
  Zap,
  Award
} from 'lucide-react';
import { useAllAiInsights } from 'src/api/useAiInsights';

interface RadarAnalyticsProps {
  userMetrics: Record<string, number>;
  avgMetrics: Record<string, number>;
  theme: 'light' | 'dark';
  metricAnalysis: Record<string, string>;
}

interface RadarPoint {
  x: number;
  y: number;
  label?: string;
  value?: number;
}

// Simplified metric display names - shortened for card display
const metricDisplayNames: Record<string, string> = {
  'totalCompensation': 'Pay',
  'workload': 'Load',
  'experienceLevel': 'Exp.',
  'careerGrowth': 'Growth',
  'marketCompetitiveness': 'Market',
};

// Metric icons
const metricIcons: Record<string, any> = {
  'totalCompensation': TrendingUp,
  'workload': Activity,
  'experienceLevel': Award,
  'careerGrowth': Target,
  'marketCompetitiveness': BarChart3,
};

function calculateRadarPoints(
  metrics: Record<string, number>,
  radius: number,
  centerX: number = 175,
  centerY: number = 175
): RadarPoint[] {
  const categories = Object.keys(metrics);
  const angleSlice = (Math.PI * 2) / categories.length;
  const points: RadarPoint[] = [];

  categories.forEach((cat, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    // Normalize the value properly - assuming metrics are 0-10 scale
    const normalizedValue = Math.min(metrics[cat] / 10, 1); // Ensure max is 1
    const x = centerX + radius * normalizedValue * Math.cos(angle);
    const y = centerY + radius * normalizedValue * Math.sin(angle);
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
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const { data: allInsights, isLoading: isInsightsLoading } = useAllAiInsights();

  // Memoized calculations for performance
  const maxRadius = 80; // Reduced to leave more space for labels
  
  const { userPoints, avgPoints, performanceScore, scoreDiff } = useMemo(() => {
    const userPts = calculateRadarPoints(userMetrics, maxRadius);
    const avgPts = calculateRadarPoints(avgMetrics, maxRadius);
    
    const perfScore = Object.values(userMetrics).reduce((a, b) => a + b, 0) / Object.keys(userMetrics).length;
    const avgScr = Object.values(avgMetrics).reduce((a, b) => a + b, 0) / Object.keys(avgMetrics).length;
    const scoreDf = ((perfScore - avgScr) / avgScr * 100).toFixed(1);
    
    return {
      userPoints: userPts,
      avgPoints: avgPts,
      performanceScore: perfScore,
      avgScore: avgScr,
      scoreDiff: scoreDf
    };
  }, [userMetrics, avgMetrics, maxRadius]);

  // Optimized hover handlers
  const handleMetricHover = useCallback((metric: string | null) => {
    setHoveredMetric(metric);
  }, []);

  const handleMetricClick = useCallback((metric: string) => {
    setSelectedMetric(prev => prev === metric ? null : metric);
  }, []);

  // Memoized selected metric analysis content
  const selectedMetricContent = useMemo(() => {
    if (!selectedMetric) return null;
    
    return {
      name: metricDisplayNames[selectedMetric] || selectedMetric,
      analysis: metricAnalysis[selectedMetric] || 'Analysis data not available for this metric.'
    };
  }, [selectedMetric, metricAnalysis]);


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4,
        ease: "easeOut"
      }}
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
              Performance Analytics
            </h2>
            <p className={`text-sm mt-0.5 ${
              theme === 'light' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Your metrics compared to regional average
            </p>
          </div>
          
          <div className={`px-3 py-2 rounded-lg ${
            theme === 'light' ? 'bg-emerald-50' : 'bg-emerald-900/30'
          }`}>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Overall</p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {performanceScore.toFixed(1)}/10
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Radar Chart */}
        <div className={`rounded-lg p-3 sm:p-6 ${
          theme === 'light' ? 'bg-gray-50' : 'bg-slate-900/30'
        }`}>
          <div className="flex justify-center">
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
              <motion.polygon
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
              <motion.polygon
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

              {/* Data points */}
              {userPoints.map((pt, i) => (
                <g key={pt.label}>
                  <motion.circle
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
                    onMouseEnter={() => handleMetricHover(pt.label || null)}
                    onMouseLeave={() => handleMetricHover(null)}
                    onClick={() => handleMetricClick(pt.label || '')}
                  />
                  
                  {/* Hover tooltip */}
                  {hoveredMetric === pt.label && (
                    <g>
                      <rect
                        x={pt.x - 20}
                        y={pt.y - 30}
                        width="40"
                        height="20"
                        rx="3"
                        fill={theme === 'light' ? 'white' : '#1e293b'}
                        stroke="#3b82f6"
                        strokeWidth="1"
                      />
                      <text
                        x={pt.x}
                        y={pt.y - 15}
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="bold"
                        fill="#3b82f6"
                      >
                        {pt.value?.toFixed(1)}
                      </text>
                    </g>
                  )}
                </g>
              ))}

              {/* Labels */}
              {Object.keys(userMetrics).map((cat, i) => {
                const angleSlice = (Math.PI * 2) / Object.keys(userMetrics).length;
                const angle = angleSlice * i - Math.PI / 2;
                const labelRadius = 100; // Increased from 120 to give more space
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
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full" />
              <span className={`text-xs ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                Your Score
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-gray-400 rounded-full" style={{borderStyle: 'dashed'}} />
              <span className={`text-xs ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                Regional Avg
              </span>
            </div>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
          {Object.entries(userMetrics).map(([key, value]) => {
            const IconComponent = metricIcons[key] || Activity;
            const avgValue = avgMetrics[key];
            const diff = ((value - avgValue) / avgValue * 100).toFixed(0);
            const isPositive = Number(diff) > 0;
            
            return (
              <motion.div
                key={key}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`p-3 sm:p-4 rounded-lg border cursor-pointer transition-colors duration-200 min-h-[100px] sm:min-h-[120px] flex flex-col justify-between ${
                  selectedMetric === key
                    ? theme === 'light'
                      ? 'bg-emerald-50 border-emerald-300'
                      : 'bg-emerald-900/30 border-emerald-700'
                    : theme === 'light'
                      ? 'bg-white border-gray-200'
                      : 'bg-slate-900/50 border-slate-700'
                }`}
                onClick={() => handleMetricClick(key)}
              >
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                  <span className={`text-xs font-medium whitespace-nowrap ${
                    isPositive
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {isPositive ? '+' : ''}{diff}%
                  </span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className={`text-[10px] sm:text-xs mb-1 sm:mb-2 leading-tight truncate ${
                    theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                  }`} title={metricDisplayNames[key] || key}>
                    {metricDisplayNames[key] || key}
                  </p>
                  <p className={`text-lg sm:text-xl font-bold ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    {value.toFixed(1)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Metric Analysis - Optimized */}
        <AnimatePresence mode="wait">
          {selectedMetric && selectedMetricContent && (
            <motion.div
              key={selectedMetric} // Force re-mount for different metrics
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ 
                duration: 0.15, 
                ease: [0.4, 0.0, 0.2, 1] // Custom cubic-bezier for snappier feel
              }}
              className={`p-4 rounded-lg mt-4 ${
                theme === 'light'
                  ? 'bg-emerald-50 border border-emerald-200'
                  : 'bg-emerald-900/20 border border-emerald-800/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <Brain className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-semibold mb-1 ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    {selectedMetricContent?.name} Analysis
                  </h4>
                  <p className={`text-sm leading-relaxed ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                  }`}>
                    {selectedMetricContent?.analysis}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Insights - Enlarged */}
        <div className={`p-4 sm:p-6 rounded-xl ${
          theme === 'light'
            ? 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border border-amber-200'
            : 'bg-gradient-to-br from-amber-900/20 via-orange-900/20 to-yellow-900/20 border border-amber-800/50'
        }`}>
          <div className="flex items-start gap-3 sm:gap-4">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400 mt-1" />
            <div className="flex-1">
              <h4 className={`text-base sm:text-lg font-bold mb-2 sm:mb-3 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                AI Performance Insights
              </h4>
              
              {isInsightsLoading ? (
                <p className={`text-sm sm:text-base ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                }`}>
                  Analyzing your performance metrics...
                </p>
              ) : (
                <div className="space-y-3">
                  <p className={`text-sm sm:text-base leading-relaxed ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    Your performance is <span className="font-semibold text-emerald-600 dark:text-emerald-400">{scoreDiff}%</span> {Number(scoreDiff) > 0 ? 'above' : 'below'} regional average.
                    {Number(scoreDiff) > 0
                      ? ' You\'re outperforming most peers in your region!'
                      : ' Consider focusing on areas marked in red for improvement.'}
                  </p>
                  
                  {allInsights?.market && (
                    <div className={`flex items-start gap-3 pt-2 pl-4 border-l-4 ${
                      theme === 'light' ? 'border-amber-300' : 'border-amber-600'
                    }`}>
                      <ChevronRight className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                      <span className={`text-sm sm:text-base ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                      }`}>
                        {allInsights.market}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}