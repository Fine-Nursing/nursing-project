'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { nurseData } from 'src/api/mock-data';

import FloatingOnboardButton from 'src/components/button/FloatingOnboardButton';
import NursingGraph from 'src/components/graph';
import NurseBoard from 'src/components/NurseBoard';
import NursingCompensationTable from 'src/components/table/NursingCompensationTable';

export default function DashboardPage() {
  const router = useRouter();

  const handleOnboardingClick = () => {
    router.push('/onboarding');
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
              <ul className="flex space-x-8 text-sm font-medium">
                <li>
                  <button type="button">프로필</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Hero Section - 줄어든 상하 공간과 강조된 문구 */}
        <section className="text-center max-w-3xl mx-auto mb-20">
          <div className="relative h-[48px] flex justify-center mb-4">
            <FloatingOnboardButton onClick={handleOnboardingClick} />
          </div>
          {/* 강조된 문구 (색상/폰트 사이즈만 정돈) */}
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
    </main>
  );
}
