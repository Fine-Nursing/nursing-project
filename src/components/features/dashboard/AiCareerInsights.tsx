// components/NurseDashboard/AiCareerInsights.tsx
import React, { useEffect } from 'react';
import { Brain, TrendingUp, Loader2, RefreshCw, Sparkles, Target } from 'lucide-react';
import { useAllAiInsights, useGenerateAllInsights } from 'src/api/ai/useAiInsights';
import useAuthStore from 'src/hooks/useAuthStore';

interface AiCareerInsightsProps {
  theme: 'light' | 'dark';
}

export default function AiCareerInsights({ theme }: AiCareerInsightsProps) {
  const { user } = useAuthStore();
  const userId = user?.id;
  
  const { data: insights, isLoading } = useAllAiInsights(userId);
  const { generateAll, isLoading: isGenerating } = useGenerateAllInsights();
  
  const nurseSummary = insights?.nurseSummary;
  const culture = insights?.culture;
  const skillTransfer = insights?.skillTransfer;
  
  // 데이터가 없을 때 자동으로 생성 시도 (한 번만)
  useEffect(() => {
    const hasData = nurseSummary || culture || skillTransfer;
    const shouldGenerate = userId && !hasData && !isLoading && !isGenerating;
    
    if (shouldGenerate) {
      const timeoutId = setTimeout(() => {
        generateAll();
      }, 1000); // 1초 딜레이로 초기 렌더링 안정화
      
      return () => clearTimeout(timeoutId);
    }
  }, [userId]); // 의존성 배열을 userId만으로 제한
  
  const handleRefreshInsights = async () => {
    if (userId) {
      await generateAll();
    }
  };
  
  return (
    <div
      className={`flex-1 ${
        theme === 'light' ? 'bg-white' : 'bg-slate-800'
      } rounded-xl shadow-lg p-4 sm:p-6 border ${
        theme === 'light' ? 'border-slate-200' : 'border-slate-600'
      }`}
    >
      <div className="mb-4 sm:mb-6">
        <h3
          className={`font-bold text-lg sm:text-xl flex items-center gap-2 sm:gap-3 ${
            theme === 'light' ? 'text-slate-800' : 'text-slate-100'
          }`}
        >
          <div className={`p-1.5 sm:p-2 rounded-lg ${
            theme === 'light' ? 'bg-slate-600' : 'bg-slate-700'
          }`}>
            <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          AI Career Insights
        </h3>
        <p className={`text-sm mt-1 font-medium ${
          theme === 'light' ? 'text-slate-600' : 'text-slate-300'
        }`}>
          Data-driven analysis of your career progression
        </p>
      </div>
      {/* Refresh Button */}
      <button
        onClick={handleRefreshInsights}
        disabled={isGenerating || isLoading}
        className={`absolute top-4 right-4 sm:top-6 sm:right-6 p-1.5 sm:p-2 rounded-lg transition-all ${
          theme === 'light' 
            ? 'hover:bg-slate-100 text-slate-600' 
            : 'hover:bg-slate-700 text-slate-400'
        } ${isGenerating || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        title="Refresh AI Insights"
      >
        <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
      </button>
      
      {isLoading || isGenerating ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          <span className={`ml-3 text-sm font-medium ${
            theme === 'light' ? 'text-slate-600' : 'text-slate-400'
          }`}>
            Analyzing your career data...
          </span>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {/* Main Insight */}
          <div className={`p-3 sm:p-4 rounded-lg border ${
            theme === 'light' 
              ? 'bg-emerald-50 border-emerald-200' 
              : 'bg-emerald-900/20 border-emerald-700'
          }`}>
            <div className="flex items-start gap-3">
              <TrendingUp className={`w-5 h-5 mt-0.5 ${
                theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'
              }`} />
              <div>
                <h4 className={`font-semibold text-sm sm:text-base mb-1.5 sm:mb-2 ${
                  theme === 'light' ? 'text-emerald-800' : 'text-emerald-300'
                }`}>
                  Career Growth Analysis
                </h4>
                <p className={`text-sm leading-relaxed ${
                  theme === 'light' ? 'text-emerald-700' : 'text-emerald-200'
                }`}>
                  {nurseSummary?.content || "Analyzing your nursing career profile..."}
                </p>
              </div>
            </div>
          </div>

          {/* Culture Insights */}
          {culture && (
            <div className={`p-3 sm:p-4 rounded-lg border ${
              theme === 'light'
                ? 'bg-blue-50 border-blue-200'
                : 'bg-blue-900/20 border-blue-700'
            }`}>
              <div className="flex items-start gap-3">
                <Sparkles className={`w-5 h-5 mt-0.5 ${
                  theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                }`} />
                <div>
                  <h4 className={`font-semibold text-sm sm:text-base mb-1.5 sm:mb-2 ${
                    theme === 'light' ? 'text-blue-800' : 'text-blue-300'
                  }`}>
                    Work Culture Analysis
                  </h4>
                  <div className={`text-sm leading-relaxed ${
                    theme === 'light' ? 'text-blue-700' : 'text-blue-200'
                  }`}>
                    {culture.content.split('•').map((point: string, idx: number) => point.trim() && (
                      <div key={idx} className="flex items-start gap-2 mb-1">
                        <span className="text-blue-500">•</span>
                        <span>{point.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Skill Transfer Opportunities */}
          <div className={`p-3 sm:p-4 rounded-lg border ${
            theme === 'light'
              ? 'bg-purple-50 border-purple-200'
              : 'bg-purple-900/20 border-purple-700'
          }`}>
            <div className="flex items-start gap-3">
              <Target className={`w-5 h-5 mt-0.5 ${
                theme === 'light' ? 'text-purple-600' : 'text-purple-400'
              }`} />
              <div>
                <h4 className={`font-semibold text-sm sm:text-base mb-1.5 sm:mb-2 ${
                  theme === 'light' ? 'text-purple-800' : 'text-purple-300'
                }`}>
                  Career Transition Opportunities
                </h4>
                <div className={`text-sm leading-relaxed ${
                  theme === 'light' ? 'text-purple-700' : 'text-purple-200'
                }`}>
                  {skillTransfer && skillTransfer.content ? (
                    skillTransfer.content.split('•').map((point: string, idx: number) => point.trim() && (
                      <div key={idx} className="flex items-start gap-2 mb-1">
                        <span className="text-purple-500">•</span>
                        <span>{point.trim()}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-2">
                      <p className={`${
                        theme === 'light' ? 'text-purple-600' : 'text-purple-300'
                      }`}>
                        No transition opportunities were found based on your current experience and expertise.
                      </p>
                      <p className={`text-xs mt-1 ${
                        theme === 'light' ? 'text-purple-500' : 'text-purple-400'
                      }`}>
                        We recommend continuing to develop your expertise in your current position.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* No Data State */}
          {!nurseSummary && !culture && !skillTransfer && !isLoading && !isGenerating && (
            <div className={`p-3 sm:p-4 rounded-lg border ${
              theme === 'light'
                ? 'bg-gray-50 border-gray-200'
                : 'bg-gray-700 border-gray-600'
            }`}>
              <p className={`text-sm text-center ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                AI insights will be generated based on your profile data.
                <button
                  onClick={handleRefreshInsights}
                  className={`block mx-auto mt-2 text-sm font-medium ${
                    theme === 'light' ? 'text-emerald-600 hover:text-emerald-700' : 'text-emerald-400 hover:text-emerald-300'
                  }`}
                >
                  Generate Insights
                </button>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className={`mt-4 sm:mt-6 pt-3 sm:pt-4 border-t text-[10px] sm:text-xs ${
        theme === 'light' 
          ? 'border-slate-200 text-slate-500' 
          : 'border-slate-600 text-slate-400'
      }`}>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
          <span>Data sources: Bureau of Labor Statistics, ANA, Hospital surveys</span>
          <span>Last updated: March 2025</span>
        </div>
      </div>
    </div>
  );
}
