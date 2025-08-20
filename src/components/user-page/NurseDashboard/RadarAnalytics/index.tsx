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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className={`p-4 rounded-lg ${tc.getClass(
          'bg-gray-50',
          'bg-slate-700/50'
        )}`}>
          <RadarChart
            userMetrics={userMetrics}
            avgMetrics={avgMetrics}
            theme={theme}
            hoveredMetric={hoveredMetric}
            setHoveredMetric={setHoveredMetric}
          />
        </div>

        {/* Metric Cards */}
        <div className="space-y-3">
          {Object.keys(userMetrics).map((category) => (
            <MetricCard
              key={category}
              category={category}
              userValue={userMetrics[category]}
              avgValue={avgMetrics[category]}
              theme={theme}
              isSelected={selectedMetric === category}
              onSelect={() => handleMetricSelect(category)}
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

      {/* AI Insights Section */}
      {allInsights?.skillTransfer && (
        <div className="mt-6">
          <div className={`p-4 rounded-lg border ${tc.getClass(
            'bg-amber-50 border-amber-200',
            'bg-amber-900/20 border-amber-700'
          )}`}>
            <div className="flex items-start gap-3">
              <Brain className={`w-5 h-5 mt-0.5 ${tc.getClass(
                'text-amber-600',
                'text-amber-400'
              )}`} />
              <div>
                <h4 className={`font-semibold mb-2 ${tc.getClass(
                  'text-amber-800',
                  'text-amber-300'
                )}`}>
                  Career Insights
                </h4>
                <div className={`flex items-start gap-3 pt-2 pl-4 border-l-4 ${tc.getClass(
                  'border-amber-300',
                  'border-amber-600'
                )}`}>
                  <ChevronRight className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <span className={`text-sm ${tc.text.secondary}`}>
                    {allInsights.skillTransfer?.content || "Loading insights..."}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}