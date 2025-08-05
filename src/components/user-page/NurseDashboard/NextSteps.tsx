// components/NurseDashboard/NextSteps.tsx
import React from 'react';
import { Clipboard, Star, Loader2 } from 'lucide-react';
import { useParsedNextSteps } from 'src/api/useNextSteps';

interface NextStepsProps {
  theme: 'light' | 'dark';
}

export default function NextSteps({ theme }: NextStepsProps) {
  const { data, isLoading } = useParsedNextSteps();

  // 로딩 상태
  if (isLoading) {
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
            <Clipboard className="w-4 h-4 mr-2 text-slate-500" />
            Next Steps
          </h3>
          <div className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium w-fit">
            AI Recommended
          </div>
        </div>
        <div className="flex items-center justify-center py-6 sm:py-8">
          <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-slate-400" />
          <span className="ml-2 text-xs sm:text-sm text-slate-500">Analyzing your profile...</span>
        </div>
      </div>
    );
  }

  // 에러 상태 또는 데이터 없음 - 기본값 표시
  const steps = data?.steps || [
    'Review your career progression and identify areas for improvement',
    'Explore additional certifications relevant to your specialty',
    'Connect with mentors in your field for career guidance',
  ];
  
  const opportunity = data?.opportunity;

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
          <Clipboard className="w-4 h-4 mr-2 text-slate-500" />
          Next Steps
        </h3>
        <div className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium w-fit">
          AI Recommended
        </div>
      </div>
      <ol className="list-decimal pl-4 sm:pl-5 text-xs sm:text-sm space-y-2 mb-3 sm:mb-4">
        {steps.map((step) => (
          <li key={step} className="leading-relaxed">{step}</li>
        ))}
      </ol>
      {opportunity && (
        <div
          className={`p-3 rounded-xl sm:rounded-2xl border text-xs sm:text-sm ${
            theme === 'light'
              ? 'bg-slate-50 border-slate-200'
              : 'bg-slate-700 border-slate-600 text-white'
          }`}
        >
          <p className="font-medium mb-1 flex items-center">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-yellow-500" />
            {opportunity.title}
          </p>
          <p className="leading-relaxed">{opportunity.description}</p>
        </div>
      )}
    </div>
  );
}
