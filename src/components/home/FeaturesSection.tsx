'use client';

import React from 'react';

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative py-8 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-black transition-colors"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-slate-700 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center justify-center px-4 py-1 mb-4 text-xs font-semibold tracking-wide text-teal-500 dark:text-teal-400 uppercase bg-teal-50 dark:bg-teal-900/20 rounded-full border border-teal-200 dark:border-teal-800">
            Platform Features
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Tools for Career Success
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto px-4">
            Everything you need to advance your nursing career in one platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-zinc-700 hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-500 transition-all duration-300">
            <div className="w-12 sm:w-14 h-12 sm:h-14 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
              <svg
                className="w-6 sm:w-7 h-6 sm:h-7 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Career Analytics
            </h4>
            <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-400 leading-relaxed">
              Track your progression with detailed analytics and insights tailored to your nursing journey
            </p>
          </div>
          
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-zinc-700 hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-500 transition-all duration-300">
            <div className="w-12 sm:w-14 h-12 sm:h-14 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
              <svg
                className="w-6 sm:w-7 h-6 sm:h-7 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Salary Insights
            </h4>
            <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-400 leading-relaxed">
              Compare your compensation with market standards and discover opportunities for growth
            </p>
          </div>
          
          <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-zinc-700 hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-500 transition-all duration-300">
            <div className="w-12 sm:w-14 h-12 sm:h-14 bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/30 dark:to-teal-800/30 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
              <svg
                className="w-6 sm:w-7 h-6 sm:h-7 text-teal-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Smart Matching
            </h4>
            <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-400 leading-relaxed">
              AI-powered recommendations to find opportunities that match your skills and career goals
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}