// components/NurseDashboard/NextSteps.tsx
import React from 'react';
import { CheckSquare, Star, Loader2, ArrowRight, Target } from 'lucide-react';
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
          theme === 'light' ? 'bg-white' : 'bg-slate-800'
        } rounded-xl shadow-lg p-4 sm:p-6 border ${
          theme === 'light' ? 'border-slate-200' : 'border-slate-600'
        }`}
      >
        <div className="mb-4 sm:mb-6">
          <h3
            className={`font-bold text-lg sm:text-xl flex items-center gap-2 sm:gap-3 ${
              theme === 'light' ? 'text-slate-800' : 'text-slate-100'
            }`}
          >
            <div className={`p-1.5 sm:p-2 rounded-lg ${
              theme === 'light' ? 'bg-slate-600' : 'bg-slate-700'
            }`}>
              <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            Next Steps
          </h3>
          <p className={`text-sm mt-1 font-medium ${
            theme === 'light' ? 'text-slate-600' : 'text-slate-300'
          }`}>
            AI-powered career recommendations
          </p>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          <span className={`ml-3 text-sm font-medium ${
            theme === 'light' ? 'text-slate-600' : 'text-slate-400'
          }`}>
            Generating personalized recommendations...
          </span>
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
        theme === 'light' ? 'bg-white' : 'bg-slate-800'
      } rounded-xl shadow-lg p-6 border ${
        theme === 'light' ? 'border-slate-200' : 'border-slate-600'
      }`}
    >
      <div className="mb-4 sm:mb-6">
        <h3
          className={`font-bold text-lg sm:text-xl flex items-center gap-2 sm:gap-3 ${
            theme === 'light' ? 'text-slate-800' : 'text-slate-100'
          }`}
        >
          <div className={`p-1.5 sm:p-2 rounded-lg ${
            theme === 'light' ? 'bg-slate-600' : 'bg-slate-700'
          }`}>
            <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          Next Steps
        </h3>
        <p className={`text-sm mt-1 font-medium ${
          theme === 'light' ? 'text-slate-600' : 'text-slate-300'
        }`}>
          AI-powered career recommendations
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border ${
              theme === 'light'
                ? 'bg-slate-50 border-slate-200'
                : 'bg-slate-700 border-slate-600'
            }`}
          >
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              theme === 'light'
                ? 'bg-slate-600 text-white'
                : 'bg-slate-500 text-white'
            }`}>
              {index + 1}
            </div>
            <div className="flex-1">
              <p className={`text-sm leading-relaxed ${
                theme === 'light' ? 'text-slate-700' : 'text-slate-300'
              }`}>
                {step}
              </p>
            </div>
            <ArrowRight className={`w-4 h-4 mt-0.5 ${
              theme === 'light' ? 'text-slate-400' : 'text-slate-500'
            }`} />
          </div>
        ))}
      </div>

      {opportunity && (
        <div
          className={`p-3 sm:p-4 rounded-lg border ${
            theme === 'light'
              ? 'bg-amber-50 border-amber-200'
              : 'bg-amber-900/20 border-amber-700'
          }`}
        >
          <div className="flex items-start gap-3">
            <Target className={`w-5 h-5 mt-0.5 ${
              theme === 'light' ? 'text-amber-600' : 'text-amber-400'
            }`} />
            <div>
              <h4 className={`font-semibold text-sm sm:text-base mb-1 flex items-center ${
                theme === 'light' ? 'text-amber-800' : 'text-amber-300'
              }`}>
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                {opportunity.title}
              </h4>
              <p className={`text-sm leading-relaxed ${
                theme === 'light' ? 'text-amber-700' : 'text-amber-200'
              }`}>
                {opportunity.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
