// components/NurseDashboard/AiCareerInsights.tsx
import React from 'react';
import { Star } from 'lucide-react';

interface AiCareerInsightsProps {
  theme: 'light' | 'dark';
}

export default function AiCareerInsights({ theme }: AiCareerInsightsProps) {
  return (
    <div
      className={`flex-1 ${
        theme === 'light' ? 'bg-white' : 'bg-slate-600'
      } rounded-2xl shadow-md p-5 border ${
        theme === 'light' ? 'border-slate-100' : 'border-slate-600'
      }`}
    >
      <div className="flex justify-between items-center mb-3">
        <h3
          className={`font-bold text-lg ${
            theme === 'light' ? 'text-gray-800' : 'text-white'
          } flex items-center`}
        >
          <Star className="w-4 h-4 mr-2 text-slate-500" />
          AI Career Insights
        </h3>
        <div className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
          Personalized
        </div>
      </div>
      <p className="text-sm mb-3">
        Your compensation is well-positioned for your experience level. You can
        expect ~15-18% growth in 3 years by staying in your current role.
      </p>
      <div
        className={`p-3 rounded-2xl border mb-3 ${
          theme === 'light'
            ? 'bg-slate-50 border-slate-200'
            : 'bg-slate-700 border-slate-600 text-white'
        }`}
      >
        <div className="flex items-center mb-2">
          <div className="h-2 w-2 rounded-full bg-slate-500 mr-2" />
          <span className="text-sm font-medium">Growth Opportunities</span>
        </div>
        <ul className="pl-4 text-xs space-y-1">
          <li>Critical Care certification: +8-12% potential</li>
          <li>Leadership training: +5-7% potential</li>
          <li>Trauma specialization: +7-10% potential</li>
        </ul>
      </div>
      <div className="text-xs flex justify-between opacity-60">
        <span>Data sources: BLS, ANA, Hospital surveys</span>
        <span>Updated: March 2025</span>
      </div>
    </div>
  );
}
