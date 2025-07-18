'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import FloatingOnboardButton from 'src/components/button/FloatingOnboardButton';
import NursingGraph from 'src/components/graph';
import { LoginModal, SignUpModal } from 'src/components/modal/Modal';
import NursingCompensationTable from 'src/components/table/NursingCompensationTable';
import CardBoard from 'src/components/CardBoard';
import type { NursingTableParams } from 'src/api/useNursingTable';
import { useNursingTable } from 'src/api/useNursingTable';
import useAuthStore from 'src/components/AuthInitializer';

export default function DashboardPage() {
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

  const handleOnboardingClick = () => {
    if (!user) {
      // 로그인하지 않은 경우 로그인 모달 표시
      setShowLoginModal(true);
      toast('Please sign in to start onboarding', {
        icon: '🔐',
      });
    } else {
      router.push('/onboarding');
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

  return (
    <main className="min-h-screen flex flex-col font-sans bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl tracking-tight font-semibold">
              <span className="text-slate-900">Nurse</span>
              <span className="text-purple-600"> Journey</span>
            </div>
            <nav>
              <ul className="flex items-center space-x-6 text-sm font-medium">
                {isCheckingAuth && (
                  <li>
                    <div className="animate-pulse bg-gray-200 h-8 w-20 rounded" />
                  </li>
                )}

                {!isCheckingAuth && user && (
                  <>
                    <li>
                      <span className="text-slate-600">
                        Welcome,{' '}
                        {user.first_name || user.firstName || user.email}!
                      </span>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => router.push('/profile')}
                        className="text-slate-700 hover:text-purple-600 transition-colors"
                      >
                        Profile
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="text-slate-700 hover:text-purple-600 transition-colors"
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
                        className="text-slate-700 hover:text-purple-600 font-medium transition-colors"
                      >
                        Sign In
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => setShowSignUpModal(true)}
                        className="bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-sm"
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

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-20">
          <div className="relative h-[48px] flex justify-center mb-4">
            <FloatingOnboardButton onClick={handleOnboardingClick} />
          </div>
          <div className="text-gray-700">
            <p className="text-lg font-semibold text-gray-800">
              {user
                ? "Continue your journey to see what's possible for your career."
                : "Start onboarding to see what's possible for your career."}
            </p>
            <p className="mt-2 text-base text-gray-600">
              We&apos;ll help you understand where you stand — and where you
              could go.
            </p>
          </div>
        </section>

        {/* NurseBoard */}
        <section className="mb-20">
          <CardBoard />
        </section>

        {/* Data Visualization */}
        <section className="space-y-16">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <NursingGraph />
          </div>

          {/* Nursing Compensation Table with API Data */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6">
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
                <NursingCompensationTable
                  data={nursingData.data}
                  meta={nursingData.meta}
                  onPageChange={handlePageChange}
                />

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
