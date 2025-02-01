'use client';

import React from 'react';
import { nurseData } from 'src/api/mock-data';

import FloatingOnboardButton from 'src/components/button/FloatingOnboardButton';
import NursingGraph from 'src/components/graph';
import NurseBoard from 'src/components/NurseBoard';
import NursingCompensationTable from 'src/components/table/NursingCompensationTable';

export default function DashboardPage() {
  return (
    <main className="min-h-screen flex flex-col font-sans bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl tracking-tight font-semibold">
              <span className="text-slate-900">Nurse</span>
              <span className="text-purple-600">Insights</span>
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

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-32">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 text-gray-900 tracking-tight">
            Own Your{' '}
            <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Worth
            </span>
          </h1>
          <p className="text-xl text-gray-700 mb-12 leading-relaxed">
            We provide the data. You make the call.
            <br />
            Let&apos;s make job searching smarter.
          </p>
          <div className="relative h-[48px] flex justify-center">
            <FloatingOnboardButton />
          </div>
        </section>

        {/* NurseBoard */}
        <section className="mb-32">
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
