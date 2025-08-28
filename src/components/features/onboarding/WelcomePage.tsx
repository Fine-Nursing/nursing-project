'use client';

import { Eye, Ear, Handshake, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import ActionButton from 'src/components/ui/button/ActionButton';
import useOnboardingStore from 'src/store/onboardingStores';
import useAuthStore from 'src/hooks/useAuthStore';

export default function WelcomePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    setStep,
    hasExistingSession,
    existingProgress,
    continueFromLastStep,
    resetOnboarding,
  } = useOnboardingStore();

  // 모든 온보딩이 완료된 경우 처리
  useEffect(() => {
    if (existingProgress && 
        existingProgress.basicInfoCompleted && 
        existingProgress.employmentCompleted && 
        existingProgress.cultureCompleted && 
        existingProgress.accountCompleted) {
      // 온보딩이 이미 완료됨, 사용자 페이지로 이동
      toast.success('Onboarding already completed!');
      
      // 사용자 ID가 있으면 사용자 페이지로, 없으면 대시보드로 이동
      if (user?.id) {
        router.push(`/users/${user.id}`);
      } else {
        router.push('/dashboard');
      }
    }
  }, [existingProgress, user, router]);

  const handleStartNew = () => {
    // Clear existing session and start fresh
    localStorage.removeItem('onboarding_session');
    resetOnboarding();
    window.location.reload(); // Reload to get new session
  };

  const handleContinue = () => {
    if (hasExistingSession && existingProgress) {
      continueFromLastStep();
    } else {
      setStep('basicInfo');
    }
  };

  const getProgressMessage = () => {
    if (!existingProgress) return '';

    const steps = [];
    if (existingProgress.basicInfoCompleted) steps.push('Basic Info');
    if (existingProgress.employmentCompleted) steps.push('Employment');
    if (existingProgress.cultureCompleted) steps.push('Culture');

    if (steps.length === 0) {
      return 'You have an unfinished onboarding session.';
    }

    return `Progress saved: ${steps.join(' → ')} completed`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex items-start pt-16 sm:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Existing Session Alert */}
        {hasExistingSession && existingProgress && (
          <div className="mb-12 max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-100 dark:bg-emerald-800 p-2.5 rounded-xl transition-colors">
                  <AlertCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Welcome back!</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {getProgressMessage()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleContinue}
                  className="px-4 py-2 bg-emerald-600 dark:bg-emerald-700 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors"
                >
                  Continue
                </button>
                <button
                  type="button"
                  onClick={handleStartNew}
                  className="px-4 py-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900 transition-colors"
                >
                  Start Over
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to <span className="text-emerald-600 dark:text-emerald-400">Nurse Journey</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Connect, Share, and Grow with Our Healthcare Community
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {/* Know Your Worth Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group min-h-[320px] flex flex-col">
            <div className="p-8 lg:p-10 flex-1 flex flex-col">
              <div className="flex justify-center mb-8">
                <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-800 dark:to-emerald-900 p-5 rounded-2xl transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Eye className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
                Know Your Worth, Now
              </h3>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 text-center leading-relaxed flex-1">
                See how your pay compares in real time. Your input builds an honest, nationwide picture of nurse compensation and pushes for fairness.
              </p>
            </div>
          </div>

          {/* Your Story Matters Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group min-h-[320px] flex flex-col">
            <div className="p-8 lg:p-10 flex-1 flex flex-col">
              <div className="flex justify-center mb-8">
                <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-800 dark:to-emerald-900 p-5 rounded-2xl transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Ear className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
                Your Story Matters
              </h3>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 text-center leading-relaxed flex-1">
                Hear real nurse experiences and share your own. Together we create a trusted space where nurses learn from and support each other.
              </p>
            </div>
          </div>

          {/* Guidance for Your Next Step Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group min-h-[320px] flex flex-col">
            <div className="p-8 lg:p-10 flex-1 flex flex-col">
              <div className="flex justify-center mb-8">
                <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-800 dark:to-emerald-900 p-5 rounded-2xl transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Handshake className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
                Guidance for Your Next Step
              </h3>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 text-center leading-relaxed flex-1">
                Get advice tailored to your role, specialty, and goals — whether you're exploring new units, planning further education, or looking for a healthier work environment.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <ActionButton onClick={handleContinue} size="lg">
            {hasExistingSession ? 'Continue Onboarding →' : 'Get Started 🚀'}
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
