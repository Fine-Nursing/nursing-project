'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, lazy, Suspense } from 'react';
import toast from 'react-hot-toast';
import type { NursingTableParams } from 'src/api/useNursingTable';
import { useNursingTable } from 'src/api/useNursingTable';
import useAuthStore from 'src/hooks/useAuthStore';
import FloatingOnboardButton from 'src/components/button/FloatingOnboardButton';
import { LoginModal, SignUpModal } from 'src/components/modal/Modal';
import CardBoard from 'src/components/CardBoard';

// Lazy load heavy components
const NursingCompensationTable = lazy(() => import('src/components/table/NursingCompensationTable'));
const NursingGraph = lazy(() => import('src/components/graph'));

export default function HomePage() {
  const router = useRouter();
  const {
    user,
    isLoading: isCheckingAuth,
    signOut,
    checkAuth,
  } = useAuthStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  // API 필터 상태
  const [tableFilters, setTableFilters] = useState<NursingTableParams>({
    page: 1,
    limit: 10,
    sortBy: 'compensation',
    sortOrder: 'desc',
  });

  // API 데이터 가져오기
  const {
    data: nursingData,
    isLoading,
    isError,
  } = useNursingTable(tableFilters);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  // 수정된 온보딩 핸들러 - 온보딩 완료 여부 확인 추가
  const handleOnboardingClick = async () => {
    try {
      // 로그인한 사용자이고 이미 온보딩을 완료했다면
      if (user && user.hasCompletedOnboarding) {
        router.push(`/users/${user.id}`);
        toast(
          'You have already completed onboarding! Check out your profile.',
          {
            icon: '👤',
            duration: 3000,
          }
        );
        return;
      }

      // 백엔드 URL 설정 (환경변수가 없을 경우 fallback)
      const API_URL = process.env.NEXT_PUBLIC_BE_URL || 'http://localhost:3000';

      // 1. 온보딩 세션 초기화 (로그인 여부와 관계없이)
      const response = await fetch(`${API_URL}/api/onboarding/init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Failed to initialize onboarding');
      }

      const data = await response.json();

      // 2. LocalStorage에 세션 정보 저장
      localStorage.setItem(
        'onboarding_session',
        JSON.stringify({
          tempUserId: data.tempUserId,
          sessionId: data.sessionId,
          startedAt: new Date().toISOString(),
          isLoggedIn: !data.tempUserId.startsWith('temp_'), // 로그인 여부 저장
        })
      );

      // 3. 온보딩 페이지로 이동
      router.push('/onboarding');

      // 4. 사용자에게 적절한 메시지 표시
      if (data.tempUserId.startsWith('temp_')) {
        toast.success(
          'Starting onboarding! You can create an account at the end.',
          {
            duration: 4000,
          }
        );
      } else {
        toast.success("Welcome back! Let's continue with your onboarding.", {
          duration: 3000,
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('온보딩 시작 실패:', error);
      toast.error('Failed to start onboarding. Please try again.');
    }
  };

  const handleSwitchToLogin = () => {
    setShowSignUpModal(false);
    setShowLoginModal(true);
  };

  const handleSwitchToSignUp = () => {
    setShowLoginModal(false);
    setShowSignUpModal(true);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    setTableFilters((prev) => ({ ...prev, page: newPage }));
  };

  // 온보딩 완료 여부 확인
  const hasCompletedOnboarding = user?.hasCompletedOnboarding || false;

  // 디버깅용 콘솔 로그
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('=== 온보딩 상태 확인 ===');
    // eslint-disable-next-line no-console
    console.log('User 객체:', user);
    // eslint-disable-next-line no-console
    console.log('hasCompletedOnboarding:', user?.hasCompletedOnboarding);
    // eslint-disable-next-line no-console
    console.log('isCheckingAuth:', isCheckingAuth);
    // eslint-disable-next-line no-console
    console.log('====================');
  }, [user, isCheckingAuth]);

  return (
    <main className="min-h-screen flex flex-col font-sans bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="text-lg sm:text-xl tracking-tight font-semibold">
              <span className="text-slate-900">Nurse</span>
              <span className="text-purple-600"> Journey</span>
            </div>
            <nav className="overflow-x-auto">
              <ul className="flex items-center space-x-3 sm:space-x-6 text-xs sm:text-sm font-medium">
                {isCheckingAuth && (
                  <li>
                    <div className="animate-pulse bg-gray-200 h-8 w-20 rounded" />
                  </li>
                )}

                {!isCheckingAuth && user && (
                  <>
                    <li className="hidden sm:block">
                      <span className="text-slate-600 truncate max-w-32">
                        Welcome,{' '}
                        {user.first_name || user.firstName || user.email}!
                      </span>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => router.push(`/users/${user.id}`)}
                        className="text-slate-700 hover:text-purple-600 transition-colors whitespace-nowrap"
                      >
                        Profile
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="text-slate-700 hover:text-purple-600 transition-colors whitespace-nowrap"
                      >
                        Sign Out
                      </button>
                    </li>
                  </>
                )}

                {!isCheckingAuth && !user && (
                  <>
                    <li>
                      <button
                        type="button"
                        onClick={() => setShowLoginModal(true)}
                        className="text-slate-700 hover:text-purple-600 font-medium transition-colors whitespace-nowrap"
                      >
                        Sign In
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => setShowSignUpModal(true)}
                        className="bg-purple-600 text-white px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-sm whitespace-nowrap"
                      >
                        Sign Up
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 xl:px-8 py-8 sm:py-12 lg:py-16">
        {/* Hero Section - 온보딩 완료 여부에 따라 다른 텍스트 표시 */}
        <section className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          <div className="relative h-[48px] flex justify-center mb-4">
            <FloatingOnboardButton onClick={handleOnboardingClick} isCompleted={hasCompletedOnboarding} />
          </div>
          <div className="text-gray-700 px-4">
            <p className="text-base sm:text-lg font-semibold text-gray-800">
              {hasCompletedOnboarding
                ? 'Welcome back! Explore your compensation insights and career opportunities.'
                : "Start onboarding to see what's possible for your career."}
            </p>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              {hasCompletedOnboarding
                ? 'Check out how your compensation compares with other nurses in your area.'
                : "We'll help you understand where you stand — and where you could go."}
              {!user && !hasCompletedOnboarding && (
                <span className="block mt-1 text-xs sm:text-sm text-gray-500">
                  No account needed to start. You can create one at the end!
                </span>
              )}
            </p>
          </div>
        </section>

        {/* NurseBoard */}
        <section className="mb-12 sm:mb-16 lg:mb-20">
          <CardBoard />
        </section>

        {/* Data Visualization */}
        <section className="space-y-8 sm:space-y-12 lg:space-y-16">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
            <Suspense fallback={
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
              </div>
            }>
              <NursingGraph />
            </Suspense>
          </div>

          {/* Nursing Compensation Table with API Data */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 overflow-hidden">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              Nursing Compensation Data
            </h2>

            {isLoading && (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">
                  Loading compensation data...
                </div>
              </div>
            )}

            {isError && (
              <div className="flex items-center justify-center h-64">
                <div className="text-red-500">
                  Error loading data. Please try again later.
                </div>
              </div>
            )}

            {!isLoading && !isError && nursingData && (
              <>
                <Suspense fallback={
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
                  </div>
                }>
                  <NursingCompensationTable
                    data={nursingData.data}
                    meta={nursingData.meta}
                    onPageChange={handlePageChange}
                  />
                </Suspense>

                {/* 추가 정보 표시 */}
                <div className="mt-4 text-sm text-gray-600 text-right">
                  Total nursing positions:{' '}
                  {nursingData.meta.total.toLocaleString()}
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      {/* Auth Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignUp={handleSwitchToSignUp}
        onAuthSuccess={checkAuth}
      />

      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onSwitchToLogin={handleSwitchToLogin}
        onAuthSuccess={checkAuth}
      />
    </main>
  );
}
