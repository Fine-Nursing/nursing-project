import React from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';

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
            AI Insights
          </h4>
          
          <p className={`text-sm mb-3 ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-300'
          }`}>
            {getCompensationInsight()}
          </p>
          
          {Array.isArray(potentialDifferentials) && potentialDifferentials.length > 0 && (
            <div className="space-y-1.5">
              {potentialDifferentials.map((item, index) => (
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
        </div>
      </div>
    </div>
  );
}