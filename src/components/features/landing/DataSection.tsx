'use client';

import React, { Suspense, lazy } from 'react';
import { m } from 'framer-motion';

const NursingGraph = lazy(() => import('src/components/ui/graph/NursingGraph'));
const NursingCompensationTable = lazy(
  () => import('src/components/ui/table/NursingCompensationTable')
);

interface DataSectionProps {
  nursingData: any;
  onPageChange: (page: number) => void;
}

export default function DataSection({ nursingData, onPageChange }: DataSectionProps) {
  return (
    <section
      id="data"
      className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-white/50 to-transparent dark:from-transparent dark:via-zinc-900/50 dark:to-transparent transition-colors"
    >
      {/* Section divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-200 dark:via-zinc-700 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center justify-center px-4 py-1 mb-4 text-xs font-semibold tracking-wide text-blue-600 dark:text-blue-400 uppercase bg-gradient-to-r from-blue-100 to-sky-100 dark:bg-blue-900/20 dark:border dark:border-blue-800 rounded-full">
            Compensation Data
          </div>
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Real-Time Analytics & Insights
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto px-4">
            Interactive charts and detailed tables to analyze market rates across specialties
          </p>
        </div>

        {/* Graph Section */}
        <div className="mb-8 sm:mb-12">
          <Suspense
            fallback={
              <div className="h-64 sm:h-96 bg-gray-100 dark:bg-zinc-900 animate-pulse rounded-lg flex items-center justify-center">
                <p className="text-gray-500 dark:text-zinc-400">Loading visualization...</p>
              </div>
            }
          >
            <NursingGraph />
          </Suspense>
        </div>

        {/* Table Section */}
        <div className="mt-8 sm:mt-12">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full bg-gradient-to-br from-white/90 via-emerald-50/30 to-blue-50/40 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-950/90 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200/50 dark:border-zinc-800 backdrop-blur-sm overflow-hidden"
          >
            {/* Header Section */}
            <div className="mb-4 sm:mb-8">
              <m.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6"
              >
                <div>
                  <h3 className="text-sm sm:text-lg font-semibold text-gray-800 dark:text-zinc-100">
                    Detailed Compensation Data
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 mt-1">
                    Browse real nursing salaries with filters and sorting options
                  </p>
                  {nursingData?.data && nursingData.data.length > 0 && (
                    <div className="flex items-center gap-4 mt-2 text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        {nursingData.data.length} positions found
                      </span>
                    </div>
                  )}
                </div>

                {/* Quick Stats - Hidden on mobile */}
                <div className="hidden sm:flex gap-4">
                  <div className="text-center px-3 py-2 bg-white/60 dark:bg-zinc-900 rounded-lg backdrop-blur-sm border border-blue-100 dark:border-zinc-700">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {nursingData?.meta?.total || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-zinc-500">Total</div>
                  </div>
                  <div className="text-center px-3 py-2 bg-white/60 dark:bg-zinc-900 rounded-lg backdrop-blur-sm border border-emerald-100 dark:border-zinc-700">
                    <div className="text-lg font-bold text-emerald-500 dark:text-emerald-400">
                      {nursingData?.meta?.page || 1}/{nursingData?.meta?.totalPages || 1}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-zinc-500">Page</div>
                  </div>
                </div>
              </m.div>
            </div>

            {/* Table Content */}
            <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-200/50 dark:border-zinc-700 shadow-sm relative z-10">
              <Suspense
                fallback={
                  <div className="h-64 sm:h-96 bg-gray-100 dark:bg-zinc-900 animate-pulse rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 dark:text-zinc-400">Loading table...</p>
                  </div>
                }
              >
                <NursingCompensationTable
                  data={nursingData?.data || []}
                  meta={nursingData?.meta}
                  onPageChange={onPageChange}
                />
              </Suspense>
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
}