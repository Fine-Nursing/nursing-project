'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain,
  ChevronRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useAllAiInsights } from 'src/api/ai/useAiInsights';
import { useTheme } from 'src/hooks/useTheme';
import { RadarChart } from './components/RadarChart';
import { MetricCard } from './components/MetricCard';
import { getScoreColor } from './utils';
import type { RadarAnalyticsProps } from './types';

export default function RadarAnalytics({
  userMetrics,
  avgMetrics,
  theme,
  metricAnalysis,
  userId,
}: RadarAnalyticsProps) {
  const tc = useTheme(theme);
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const { data: allInsights, isLoading: isInsightsLoading } = useAllAiInsights(userId);

  // Calculate performance score
  const { performanceScore, scoreDiff } = useMemo(() => {
    const perfScore = Object.values(userMetrics).reduce((a, b) => a + b, 0) / Object.keys(userMetrics).length;
    const avgScr = Object.values(avgMetrics).reduce((a, b) => a + b, 0) / Object.keys(avgMetrics).length;
    const diff = ((perfScore - avgScr) / avgScr * 100).toFixed(1);
    
    return {
      performanceScore: perfScore,
      scoreDiff: diff,
    };
  }, [userMetrics, avgMetrics]);

  const handleMetricSelect = (category: string) => {
    setSelectedMetric(selectedMetric === category ? null : category);
  };

  return (
    <div className={`${tc.cardClass} p-6`}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${tc.getClass(
              'bg-blue-50',
              'bg-blue-900/30'
            )}`}>
              <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className={`text-lg font-semibold ${tc.text.primary}`}>
                Performance Analytics
              </h2>
              <p className={`text-sm ${tc.text.secondary}`}>
                Your profile vs. market average
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1.5 rounded-lg ${tc.getClass(
              'bg-gray-50',
              'bg-slate-700'
            )}`}>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className={`text-sm font-semibold ${tc.text.primary}`}>
                  {performanceScore.toFixed(1)}
                </span>
                <span className={`text-xs ${getScoreColor(parseFloat(scoreDiff), theme)}`}>
                  {parseFloat(scoreDiff) >= 0 ? '↑' : '↓'} {Math.abs(parseFloat(scoreDiff))}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Radar Chart */}
        <div className={`rounded-lg p-3 sm:p-6 ${
          theme === 'light' ? 'bg-gray-50' : 'bg-slate-900/30'
        }`}>
          <div className="flex justify-center">
            <RadarChart
              userMetrics={userMetrics}
              avgMetrics={avgMetrics}
              theme={theme}
              hoveredMetric={hoveredMetric}
              setHoveredMetric={setHoveredMetric}
            />
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
          {Object.entries(userMetrics).map(([key, value]) => (
            <MetricCard
              key={key}
              category={key}
              userValue={value}
              avgValue={avgMetrics[key]}
              theme={theme}
              isSelected={selectedMetric === key}
              onSelect={() => handleMetricSelect(key)}
            />
          ))}
        </div>
      </div>

      {/* Selected Metric Analysis */}
      <AnimatePresence>
        {selectedMetric && metricAnalysis[selectedMetric] && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6"
          >
            <div className={`p-4 rounded-lg border ${tc.getClass(
              'bg-blue-50 border-blue-200',
              'bg-blue-900/20 border-blue-700'
            )}`}>
              <div className="flex items-start gap-3">
                <Sparkles className={`w-5 h-5 mt-0.5 ${tc.getClass(
                  'text-blue-600',
                  'text-blue-400'
                )}`} />
                <div>
                  <h4 className={`font-semibold mb-2 ${tc.getClass(
                    'text-blue-800',
                    'text-blue-300'
                  )}`}>
                    Analysis: {selectedMetric}
                  </h4>
                  <p className={`text-sm ${tc.getClass(
                    'text-blue-700',
                    'text-blue-200'
                  )}`}>
                    {metricAnalysis[selectedMetric]}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Insights - Original Design */}
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
                
                {allInsights?.skillTransfer && (
                  <div className={`flex items-start gap-3 pt-2 pl-4 border-l-4 ${
                    theme === 'light' ? 'border-amber-300' : 'border-amber-600'
                  }`}>
                    <ChevronRight className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <span className={`text-sm sm:text-base ${
                      theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      {allInsights.skillTransfer.content || "Loading insights..."}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}