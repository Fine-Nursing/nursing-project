'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import FloatingOnboardButton from 'src/components/button/FloatingOnboardButton';
import NursingGraph from 'src/components/graph';
import { LoginModal, SignUpModal } from 'src/components/modal/Modal';
import NursingCompensationTable from 'src/components/table/NursingCompensationTable';
import CardBoard from 'src/components/CardBoard';
import type { NursingTableParams } from 'src/api/useNursingTable';
import { useNursingTable } from 'src/api/useNursingTable';

export default function DashboardPage() {
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [user] = useState(null); // TODO: 실제 사용자 상태 관리로 교체

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

  const handleOnboardingClick = () => {
    router.push('/onboarding');
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
                {user ? (
                  <li>
                    <button
                      type="button"
                      className="text-slate-700 hover:text-purple-600 transition-colors"
                    >
                      Profile
                    </button>
                  </li>
                ) : (
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
              Start onboarding to see what&apos;s possible for your career.
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
      />

      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </main>
  );
}
