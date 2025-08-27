import React from 'react';
import { TrendingUp, ChevronRight } from 'lucide-react';

interface CareerInsightsProps {
  content: string;
  isLoading: boolean;
  theme: 'light' | 'dark';
}

export function CareerInsights({ content, isLoading, theme }: CareerInsightsProps) {
  return (
    <div 
      className={`rounded-lg p-4 ${
        theme === 'light' 
          ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100' 
          : 'bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-800/30'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-sm font-semibold ${
              theme === 'light' ? 'text-indigo-700' : 'text-indigo-300'
            }`}>AI Career Insights</span>
            {!isLoading && (
              <TrendingUp className="w-4 h-4 text-green-500" />
            )}
          </div>
          <p 
            className={`text-base leading-relaxed ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}
          >
            {isLoading ? (
              <span className="animate-pulse">{content}</span>
            ) : (
              content
            )}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 cursor-pointer" />
      </div>
    </div>
  );
}