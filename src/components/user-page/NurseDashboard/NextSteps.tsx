// components/NurseDashboard/NextSteps.tsx
import React from 'react';
import { Clipboard, Star } from 'lucide-react';

interface NextStepsProps {
  theme: 'light' | 'dark';
}

export default function NextSteps({ theme }: NextStepsProps) {
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
          <Clipboard className="w-4 h-4 mr-2 text-slate-500" />
          Next Steps
        </h3>
        <div className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
          AI Recommended
        </div>
      </div>
      <ol className="list-decimal pl-5 text-sm space-y-2 mb-4">
        <li>Critical Care leadership program (apply in 45 days)</li>
        <li>Request more trauma shifts (qualify for extra night diff)</li>
        <li>Update your certification portfolio for mid-year review</li>
      </ol>
      <div
        className={`p-3 rounded-2xl border text-sm ${
          theme === 'light'
            ? 'bg-slate-50 border-slate-200'
            : 'bg-slate-700 border-slate-600 text-white'
        }`}
      >
        <p className="font-medium mb-1 flex items-center">
          <Star className="w-4 h-4 mr-1 text-yellow-500" />
          Upcoming Opportunity
        </p>
        <p>
          NYU Langone is launching an ER Advanced Practice initiative soon.
          Early applicants see a 68% higher acceptance rate!
        </p>
      </div>
    </div>
  );
}
