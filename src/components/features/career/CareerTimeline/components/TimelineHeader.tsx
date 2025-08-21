import React from 'react';
import { History } from 'lucide-react';

interface TimelineHeaderProps {
  theme: 'light' | 'dark';
  itemCount: number;
}

export function TimelineHeader({ theme, itemCount }: TimelineHeaderProps) {
  const bgClass = theme === 'light' 
    ? 'bg-slate-50 border-slate-200' 
    : 'bg-slate-800 border-slate-600';
  
  return (
    <div className={`px-4 sm:px-6 py-3 sm:py-4 border-b ${bgClass}`}>
      <h3 className={`text-lg sm:text-xl font-bold flex items-center gap-2 sm:gap-3 ${
        theme === 'light' ? 'text-slate-800' : 'text-slate-100'
      }`}>
        <div className={`p-1.5 sm:p-2 rounded-lg ${
          theme === 'light' ? 'bg-slate-600' : 'bg-slate-700'
        }`}>
          <History className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        My Career Journey
        {itemCount > 0 && (
          <span className={`text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-lg ${
            theme === 'light' 
              ? 'bg-slate-200 text-slate-700' 
              : 'bg-slate-700 text-slate-300'
          }`}>
            {itemCount} positions
          </span>
        )}
      </h3>
      <p className={`text-sm mt-1 font-medium ${
        theme === 'light' ? 'text-slate-600' : 'text-slate-300'
      }`}>
        Professional career progression and development
      </p>
    </div>
  );
}