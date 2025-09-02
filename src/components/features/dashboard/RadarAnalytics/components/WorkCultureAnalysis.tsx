import React from 'react';
import { Building2, Loader2 } from 'lucide-react';
import type { AiInsight } from 'src/api/ai/useAiInsights';

interface WorkCultureAnalysisProps {
  theme: 'light' | 'dark';
  cultureData?: AiInsight | null;
  isLoading?: boolean;
}

export function WorkCultureAnalysis({
  theme,
  cultureData,
  isLoading,
}: WorkCultureAnalysisProps) {
  if (isLoading) {
    return (
      <div className={`p-5 rounded-xl border ${
        theme === 'light'
          ? 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200'
          : 'bg-gradient-to-br from-purple-900/10 to-indigo-900/10 border-purple-800/30'
      }`}>
        <div className="flex items-center gap-3">
          <Loader2 className="w-4 h-4 animate-spin text-purple-600 dark:text-purple-400" />
          <span className={`text-sm ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-300'
          }`}>
            Loading culture analysis...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-5 rounded-xl border ${
      theme === 'light'
        ? 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200'
        : 'bg-gradient-to-br from-purple-900/10 to-indigo-900/10 border-purple-800/30'
    }`}>
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-lg ${
          theme === 'light' ? 'bg-purple-100' : 'bg-purple-900/30'
        }`}>
          <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        
        <div className="flex-1">
          <h4 className={`text-lg font-semibold mb-3 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Work Culture Analysis
          </h4>
          
          {cultureData?.content ? (
            <div className={`text-sm leading-relaxed ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
{(() => {
                // Use regex to split by " - " pattern more accurately
                const items = cultureData.content
                  .split(/\s*-\s*/) // Split by dash with optional spaces around it
                  .map(item => item.trim())
                  .filter(item => item && item.length > 10); // Filter out very short items
                  
                return items.map((item, index) => (
                  <div key={index} className="flex items-start mb-2 last:mb-0">
                    <span className="mr-2">•</span>
                    <span>{item}</span>
                  </div>
                ));
              })()}
            </div>
          ) : (
            <div className={`text-sm text-center py-4 ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              Complete your profile to receive AI-powered work culture analysis.
            </div>
          )}
          
          {cultureData && (
            <div className={`text-xs mt-3 ${
              theme === 'light' ? 'text-purple-600' : 'text-purple-400'
            }`}>
              ✨ AI-powered culture analysis
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WorkCultureAnalysis;