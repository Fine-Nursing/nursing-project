// components/NurseDashboard/AiCareerInsights.tsx
import React, { useEffect } from 'react';
import { Target, ArrowRight, Loader2, RefreshCw, Briefcase, TrendingUp } from 'lucide-react';
import { useAiInsight, useGenerateAiInsight } from 'src/api/ai/useAiInsights';
import useAuthStore from 'src/hooks/useAuthStore';

interface AiCareerInsightsProps {
  theme: 'light' | 'dark';
}

export default function AiCareerInsights({ theme }: AiCareerInsightsProps) {
  const { user } = useAuthStore();
  const userId = user?.id;
  
  // Only use skill_transfer API
  const { data: skillTransferData, isLoading } = useAiInsight('skill_transfer', userId);
  const generateSkillTransfer = useGenerateAiInsight();
  
  // Auto-generate skill transfer analysis if no data
  useEffect(() => {
    const shouldGenerate = userId && !skillTransferData && !isLoading && !generateSkillTransfer.isPending;
    
    if (shouldGenerate) {
      const timeoutId = setTimeout(() => {
        generateSkillTransfer.mutate({ summaryType: 'skill_transfer' });
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, [userId, skillTransferData, isLoading, generateSkillTransfer]);
  
  const handleRefreshInsights = async () => {
    if (userId) {
      generateSkillTransfer.mutate({ summaryType: 'skill_transfer' });
    }
  };
  
  // Parse skill transfer opportunities
  const parseSkillTransferOpportunities = (content: string): string[] => {
    if (!content) return [];
    
    const opportunities: string[] = [];
    
    // Try splitting by bullet points first
    let lines = content.split('•').map(line => line.trim()).filter(Boolean);
    
    // If no bullet points found, try splitting by dashes with regex
    if (lines.length <= 1) {
      lines = content.split(/\s*-\s*/).map(line => line.trim()).filter(Boolean);
    }
    
    lines.forEach(line => {
      if (line && line.length > 10) { // Filter out empty or very short lines
        opportunities.push(line);
      }
    });
    
    return opportunities.length > 0 ? opportunities : [content];
  };

  const transitionOpportunities = skillTransferData?.content 
    ? parseSkillTransferOpportunities(skillTransferData.content)
    : [];

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
            theme === 'light' ? 'bg-purple-600' : 'bg-purple-700'
          }`}>
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          Career Transition Opportunities
        </h3>
        <p className={`text-sm mt-1 font-medium ${
          theme === 'light' ? 'text-slate-600' : 'text-slate-300'
        }`}>
          AI-powered analysis of your transferable skills and career paths
        </p>
      </div>
      {/* Refresh Button */}
      <button
        type="button"
        onClick={handleRefreshInsights}
        disabled={generateSkillTransfer.isPending || isLoading}
        className={`absolute top-4 right-4 sm:top-6 sm:right-6 p-1.5 sm:p-2 rounded-lg transition-all ${
          theme === 'light' 
            ? 'hover:bg-slate-100 text-slate-600' 
            : 'hover:bg-slate-700 text-slate-400'
        } ${generateSkillTransfer.isPending || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        title="Refresh Career Analysis"
      >
        <RefreshCw className={`w-4 h-4 ${generateSkillTransfer.isPending ? 'animate-spin' : ''}`} />
      </button>
      
      {isLoading || generateSkillTransfer.isPending ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
          <span className={`ml-3 text-sm font-medium ${
            theme === 'light' ? 'text-slate-600' : 'text-slate-400'
          }`}>
            Analyzing career transition opportunities...
          </span>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {skillTransferData?.content ? (
            <>
              {/* Transition Opportunities */}
              <div className={`p-4 rounded-lg border ${
                theme === 'light' 
                  ? 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200' 
                  : 'bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-700'
              }`}>
                <div className="flex items-start gap-3 mb-4">
                  <Briefcase className={`w-5 h-5 mt-0.5 ${
                    theme === 'light' ? 'text-purple-600' : 'text-purple-400'
                  }`} />
                  <div>
                    <h4 className={`font-semibold text-base mb-2 ${
                      theme === 'light' ? 'text-purple-800' : 'text-purple-300'
                    }`}>
                      Recommended Career Paths
                    </h4>
                    <p className={`text-sm ${
                      theme === 'light' ? 'text-purple-600' : 'text-purple-400'
                    }`}>
                      Based on your skills and experience profile
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {transitionOpportunities.map((opportunity, index) => (
                    <div key={`opportunity-${index}-${opportunity.slice(0, 20)}`} className={`p-3 rounded-lg ${
                      theme === 'light' ? 'bg-white/80' : 'bg-slate-800/50'
                    }`}>
                      <div className="flex items-start gap-3">
                        <ArrowRight className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          theme === 'light' ? 'text-purple-500' : 'text-purple-400'
                        }`} />
                        <span className={`text-sm leading-relaxed ${
                          theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                        }`}>
                          {opportunity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Attribution */}
              <div className={`text-center text-xs ${
                theme === 'light' ? 'text-purple-600' : 'text-purple-400'
              }`}>
                ✨ AI-powered career transition analysis
              </div>
            </>
          ) : (
            /* No Data State */
            <div className={`p-4 sm:p-6 rounded-lg border text-center ${
              theme === 'light'
                ? 'bg-gray-50 border-gray-200'
                : 'bg-gray-700 border-gray-600'
            }`}>
              <Target className={`w-8 h-8 mx-auto mb-3 ${
                theme === 'light' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <h4 className={`font-semibold mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                Career Analysis Ready
              </h4>
              <p className={`text-sm mb-4 ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                Complete your profile to unlock personalized career transition opportunities and skill transfer recommendations.
              </p>
              <button
                type="button"
                onClick={handleRefreshInsights}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  theme === 'light' 
                    ? 'bg-purple-600 text-white hover:bg-purple-700' 
                    : 'bg-purple-700 text-white hover:bg-purple-600'
                }`}
              >
                <TrendingUp className="w-4 h-4 inline mr-2" />
                Generate Career Analysis
              </button>
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
          <span>Career analysis powered by AI skill matching algorithms</span>
          <span>Last updated: March 2025</span>
        </div>
      </div>
    </div>
  );
}
