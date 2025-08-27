import React from 'react';
import { m } from 'framer-motion';
import { Sparkles, TrendingUp, ChevronRight } from 'lucide-react';

interface CareerInsightsProps {
  content: string;
  isLoading: boolean;
  theme: 'light' | 'dark';
}

export function CareerInsights({ content, isLoading, theme }: CareerInsightsProps) {
  return (
    <m.div 
      className={`rounded-lg p-4 ${
        theme === 'light' 
          ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100' 
          : 'bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-800/30'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-start gap-3">
        <m.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className={`w-5 h-5 ${
            theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'
          }`} />
        </m.div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-sm font-semibold ${
              theme === 'light' ? 'text-indigo-700' : 'text-indigo-300'
            }`}>AI Career Insights</span>
            {!isLoading && (
              <m.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
              >
                <TrendingUp className="w-4 h-4 text-green-500" />
              </m.div>
            )}
          </div>
          <m.p 
            className={`text-base leading-relaxed ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {isLoading ? (
              <span className="animate-pulse">{content}</span>
            ) : (
              content
            )}
          </m.p>
        </div>
        <m.div
          whileHover={{ x: 5 }}
          className="cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </m.div>
      </div>
    </m.div>
  );
}