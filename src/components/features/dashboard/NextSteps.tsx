// components/NurseDashboard/NextSteps.tsx
import React from 'react';
import { CheckSquare, Star, Loader2, ArrowRight, Target } from 'lucide-react';
import { useAllAiInsights } from 'src/api/ai/useAiInsights';
import useAuthStore from 'src/hooks/useAuthStore';

interface NextStepsProps {
  theme: 'light' | 'dark';
}

export default function NextSteps({ theme }: NextStepsProps) {
  const { user } = useAuthStore();
  const { data: insights, isLoading } = useAllAiInsights(user?.id);

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

  // AI API에서 Next Steps 생성
  const generateNextStepsFromAI = () => {
    const steps: string[] = [];
    let opportunity: { title: string; description: string } | null = null;

    // nurse_summary에서 액션 아이템 추출
    const nurseSummary = insights?.nurseSummary?.content;
    if (nurseSummary) {
      if (nurseSummary.includes('career') || nurseSummary.includes('experience')) {
        steps.push('Continue building expertise in your current specialty area');
      }
      if (nurseSummary.includes('leadership') || nurseSummary.includes('team')) {
        steps.push('Develop leadership and mentoring skills for career advancement');
      }
    }

    // skill_transfer에서 기회 추출
    const skillTransfer = insights?.skillTransfer?.content;
    if (skillTransfer) {
      const transferLines = skillTransfer.split('•').map(line => line.trim()).filter(Boolean);
      
      if (transferLines.length > 0) {
        transferLines.slice(0, 2).forEach(line => {
          if (line.includes('+$') || line.includes('specialty')) {
            steps.push(`Explore transition to: ${line}`);
          }
        });
        
        // 첫 번째 전환 기회를 opportunity로 설정
        if (transferLines[0]) {
          opportunity = {
            title: 'Career Transition Opportunity',
            description: transferLines[0]
          };
        }
      }
    }

    // culture에서 개선점 추출
    const culture = insights?.culture?.content;
    if (culture) {
      const cultureLines = culture.split('•').map(line => line.trim()).filter(Boolean);
      if (cultureLines.length > 0) {
        steps.push('Address work environment factors based on your assessment');
      }
    }

    // 기본 단계가 없으면 기본값 사용
    if (steps.length === 0) {
      steps.push(
        'Review your career progression and identify areas for improvement',
        'Explore additional certifications relevant to your specialty',
        'Connect with mentors in your field for career guidance'
      );
    }

    return { steps: steps.slice(0, 3), opportunity }; // 최대 3개 단계만
  };

  const { steps, opportunity } = generateNextStepsFromAI();

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
      
      {insights?.nurseSummary && (
        <div className={`text-xs mt-4 text-center ${
          theme === 'light' ? 'text-slate-500' : 'text-slate-400'
        }`}>
          ✨ Generated from AI Career Analysis
        </div>
      )}
    </div>
  );
}
