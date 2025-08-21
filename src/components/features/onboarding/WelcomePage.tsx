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
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-slate-900 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to <span className="text-emerald-600 dark:text-emerald-400">Nurse Journey</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Connect, Share, and Grow with Our Healthcare Community
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Real-time Compensation Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="p-8">
              <div className="flex justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <div className="bg-emerald-100 dark:bg-emerald-800 p-4 rounded-2xl transition-colors">
                  <Eye className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center text-gray-900 dark:text-white">
                Real-time Compensation data
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 ml-2">
                    See how your pay compares in real time and drive
                    transparency.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 ml-2">
                    Help build a pay dashboard that empowers nurses.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 ml-2">
                    Contribute to real-time insights for fair nurse
                    compensation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Listen to Nurse Stories Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="p-8">
              <div className="flex justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <div className="bg-emerald-100 dark:bg-emerald-800 p-4 rounded-2xl transition-colors">
                  <Ear className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center text-gray-900 dark:text-white">
                Listen to Nurse Stories
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 ml-2">
                    Hear real stories from nurses about their workplaces and
                    cultures.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 ml-2">
                    Join a community where experiences are shared and valued.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 ml-2">
                    Share your voice to shape a supportive network for nurses.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dedicated Career Partner Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="p-8">
              <div className="flex justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <div className="bg-emerald-100 dark:bg-emerald-800 p-4 rounded-2xl transition-colors">
                  <Handshake className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center text-gray-900 dark:text-white">
                Dedicated Career Partner
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 ml-2">
                    Get personalized guidance for every step of your career.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 ml-2">
                    Access tailored insights to achieve your goals.
                  </p>
                </div>
              </div>
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
