'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { nurseData } from 'src/api/mock-data';

import FloatingOnboardButton from 'src/components/button/FloatingOnboardButton';
import NursingGraph from 'src/components/graph';
import { LoginModal, SignUpModal } from 'src/components/modal/Modal';
import NurseBoard from 'src/components/NurseBoard';
import NursingCompensationTable from 'src/components/table/NursingCompensationTable';

export default function DashboardPage() {
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [user] = useState(null); // TODO: 실제 사용자 상태 관리로 교체

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
          <NurseBoard />
        </section>

        {/* Data Visualization */}
        <section className="space-y-16">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <NursingGraph />
          </div>
          <div className="bg-white rounded-xl shadow-sm p-8">
            <NursingCompensationTable initialData={nurseData} pageSize={10} />
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
