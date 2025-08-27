import React from 'react';
import { Sparkles, ChevronRight, Loader2 } from 'lucide-react';
import { useAllAiInsights } from 'src/api/ai/useAiInsights';
import useAuthStore from 'src/hooks/useAuthStore';

interface AIInsightsProps {
  theme: 'light' | 'dark';
  getCompensationInsight: () => string;
  potentialDifferentials: string[] | number | string;
}

export function AIInsights({
  theme,
  getCompensationInsight,
  potentialDifferentials
}: AIInsightsProps) {
  const { user } = useAuthStore();
  const { data: insights, isLoading } = useAllAiInsights(user?.id);
  
  // AI API에서 가져온 데이터가 있으면 사용, 없으면 기존 로직 사용
  const nurseSummary = (insights?.nurseSummary as any)?.content;
  const skillTransfer = (insights?.skillTransfer as any)?.content;
  
  const displayInsight = nurseSummary || getCompensationInsight();
  
  // skill_transfer에서 급여 관련 정보 추출
  const extractSalaryOpportunities = (skillTransferText: string) => {
    if (!skillTransferText) return [];
    
    const opportunities: string[] = [];
    const lines = skillTransferText.split('•').map(line => line.trim()).filter(Boolean);
    
    lines.forEach(line => {
      // "+$" 패턴이나 급여 관련 키워드가 있는 라인만 추출
      if (line.includes('+$') || line.includes('salary') || line.includes('pay') || line.includes('/hr')) {
        opportunities.push(line);
      }
    });
    
    return opportunities.length > 0 ? opportunities : [];
  };
  
  const aiBasedOpportunities = skillTransfer ? extractSalaryOpportunities(skillTransfer) : [];
  const displayOpportunities = aiBasedOpportunities.length > 0 
    ? aiBasedOpportunities 
    : (Array.isArray(potentialDifferentials) ? potentialDifferentials : []);

  if (isLoading) {
    return (
      <div className={`rounded-lg p-4 ${
        theme === 'light' 
          ? 'bg-amber-50 border border-amber-200' 
          : 'bg-amber-900/20 border border-amber-800/50'
      }`}>
        <div className="flex items-center gap-3">
          <Loader2 className="w-4 h-4 animate-spin text-amber-600 dark:text-amber-400" />
          <span className={`text-sm ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-300'
          }`}>
            Loading AI insights...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg p-4 ${
      theme === 'light' 
        ? 'bg-amber-50 border border-amber-200' 
        : 'bg-amber-900/20 border border-amber-800/50'
    }`}>
      <div className="flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
        
        <div className="flex-1">
          <h4 className={`text-sm font-semibold mb-2 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            {nurseSummary ? 'AI Career Insights' : 'AI Insights'}
          </h4>
          
          <p className={`text-sm mb-3 ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-300'
          }`}>
            {displayInsight}
          </p>
          
          {displayOpportunities.length > 0 && (
            <div className="space-y-1.5">
              {displayOpportunities.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 text-amber-500" />
                  <span className={`text-sm ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                  }`}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          {nurseSummary && (
            <div className={`text-xs mt-2 ${
              theme === 'light' ? 'text-amber-600' : 'text-amber-400'
            }`}>
              ✨ Powered by AI Career Analysis
            </div>
          )}
        </div>
      </div>
    </div>
  );
}