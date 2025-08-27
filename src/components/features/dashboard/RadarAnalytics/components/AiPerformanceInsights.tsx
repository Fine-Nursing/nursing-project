import React from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import { useAllAiInsights } from 'src/api/ai/useAiInsights';

interface AiPerformanceInsightsProps {
  theme: 'light' | 'dark';
  scoreDiff: string;
  userId?: string;
}

export default function AiPerformanceInsights({ theme, scoreDiff, userId }: AiPerformanceInsightsProps) {
  // API 호출을 제거하고 즉시 렌더링 - LCP 최적화
  // const { data: allInsights, isLoading: isInsightsLoading } = useAllAiInsights(userId);
  const allInsights = null;
  const isInsightsLoading = false;

  return (
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
                
                {/* AI Recommendations - Only render if data exists */}
                {(allInsights as any)?.skillTransfer && (allInsights as any).skillTransfer?.content && (
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
                          {(() => {
                            const content = (allInsights as any).skillTransfer.content;
                            const firstPoint = content.split('•')[0];
                            return firstPoint?.trim() || content;
                          })()}
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
  );
}