'use client';

import React, { useState, useMemo, memo } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { 
  Activity,
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

function RadarAnalytics({
  userMetrics,
  avgMetrics,
  theme,
  metricAnalysis,
  userId,
  // isLoading,
  // error,
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
              <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
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
          <m.div
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
          </m.div>
        )}
      </AnimatePresence>

      {/* AI Performance Insights Section - Improved Layout */}
      <div className="mt-6">
        <div className={`p-5 rounded-xl border ${
          theme === 'light'
            ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
            : 'bg-gradient-to-br from-amber-900/10 to-orange-900/10 border-amber-800/30'
        }`}>
          <div className="flex items-start gap-4">
            <div className={`p-2 rounded-lg ${
              theme === 'light' ? 'bg-amber-100' : 'bg-amber-900/30'
            }`}>
              <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            
            <div className="flex-1">
              <h4 className={`text-lg font-semibold mb-3 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                AI Performance Insights
              </h4>
              
              {isInsightsLoading ? (
                <div className="animate-pulse">
                  <div className={`h-4 rounded w-3/4 mb-2 ${
                    theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'
                  }`} />
                  <div className={`h-4 rounded w-1/2 ${
                    theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'
                  }`} />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Performance Summary */}
                  <div className={`p-3 rounded-lg ${
                    theme === 'light' ? 'bg-white/60' : 'bg-slate-800/30'
                  }`}>
                    <p className={`text-sm leading-relaxed ${
                      theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      Your performance score is{' '}
                      <span className={`font-bold text-base ${
                        Number(scoreDiff) > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'
                      }`}>
                        {Math.abs(Number(scoreDiff))}%
                      </span>{' '}
                      <span className="font-medium">
                        {Number(scoreDiff) > 0 ? 'above' : 'below'}
                      </span>{' '}
                      the regional average.
                      {Number(scoreDiff) > 0
                        ? ' Excellent work! You\'re outperforming most peers in your region.'
                        : ' There are opportunities for improvement in some areas.'}
                    </p>
                  </div>
                  
                  {/* AI Recommendations */}
                  {allInsights?.skillTransfer && (allInsights.skillTransfer as any)?.content && (
                    <div className={`p-3 rounded-lg ${
                      theme === 'light' ? 'bg-amber-50' : 'bg-amber-900/20'
                    }`}>
                      <div className="flex items-start gap-3">
                        <ChevronRight className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className={`text-xs font-semibold mb-1 uppercase tracking-wide ${
                            theme === 'light' ? 'text-amber-700' : 'text-amber-400'
                          }`}>
                            Recommended Focus Area
                          </p>
                          <p className={`text-sm leading-relaxed ${
                            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                          }`}>
                            {(allInsights.skillTransfer as any).content.split('•')[0]?.trim() || (allInsights.skillTransfer as any).content}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(RadarAnalytics);