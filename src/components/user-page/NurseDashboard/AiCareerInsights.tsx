// components/NurseDashboard/AiCareerInsights.tsx
import React from 'react';
import { Star } from 'lucide-react';
import { useAllAiInsights } from 'src/api/useAiInsights';

interface AiCareerInsightsProps {
  theme: 'light' | 'dark';
}

export default function AiCareerInsights({ theme }: AiCareerInsightsProps) {
  const { data: allInsights, isLoading } = useAllAiInsights();
  return (
    <div
      className={`flex-1 ${
        theme === 'light' ? 'bg-white' : 'bg-slate-600'
      } rounded-xl sm:rounded-2xl shadow-md p-3 sm:p-5 border ${
        theme === 'light' ? 'border-slate-100' : 'border-slate-600'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
        <h3
          className={`font-bold text-base sm:text-lg ${
            theme === 'light' ? 'text-gray-800' : 'text-white'
          } flex items-center`}
        >
          <Star className="w-4 h-4 mr-2 text-slate-500" />
          AI Career Insights
        </h3>
        <div className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium w-fit">
          Personalized
        </div>
      </div>
      <p className="text-xs sm:text-sm mb-3 leading-relaxed">
        {(() => {
          if (isLoading) {
            return <span className="text-slate-400">Loading insights...</span>;
          }
          if (allInsights?.growth) {
            return allInsights.growth;
          }
          return "Your compensation is well-positioned for your experience level. You can expect ~15-18% growth in 3 years by staying in your current role.";
        })()}
      </p>
      <div
        className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl border mb-3 ${
          theme === 'light'
            ? 'bg-slate-50 border-slate-200'
            : 'bg-slate-700 border-slate-600 text-white'
        }`}
      >
        <div className="flex items-center mb-2">
          <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-slate-500 mr-2" />
          <span className="text-xs sm:text-sm font-medium">Growth Opportunities</span>
        </div>
        <ul className="pl-3 sm:pl-4 text-xs space-y-1">
          {(() => {
            if (isLoading) {
              return <li className="text-slate-400">Loading skills insights...</li>;
            }
            if (allInsights?.skills) {
              return <li className="leading-relaxed">{allInsights.skills}</li>;
            }
            return (
              <>
                <li>Critical Care certification: +8-12% potential</li>
                <li>Leadership training: +5-7% potential</li>
                <li>Trauma specialization: +7-10% potential</li>
              </>
            );
          })()}
        </ul>
      </div>
      <div className="text-xs flex flex-col sm:flex-row sm:justify-between opacity-60 gap-1 sm:gap-0">
        <span>Data sources: BLS, ANA, Hospital surveys</span>
        <span>Updated: March 2025</span>
      </div>
    </div>
  );
}
