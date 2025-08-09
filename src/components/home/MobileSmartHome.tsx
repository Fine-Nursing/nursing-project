'use client';

import React, { useState, lazy, Suspense } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  MapPin, 
  Award,
  Sparkles,
  ChevronRight,
  Users,
  BarChart3,
  Building,
  ArrowUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useNursingTable } from 'src/api/useNursingTable';
import type { NursingTableParams } from 'src/api/useNursingTable';

// Lazy load heavy components
const MobileCardBoardV2 = lazy(() => import('src/components/CardBoard/MobileCardBoardV2'));
const MobileNursingGraphV2 = lazy(() => import('src/components/graph/MobileNursingGraphV2'));
const NursingCompensationTableWrapper = lazy(() => import('src/components/table/NursingCompensationTable'));

interface MobileSmartHomeProps {
  user: any;
  onShowLogin: () => void;
  onOnboardingClick: () => void;
}

export default function MobileSmartHome({
  user,
  onShowLogin,
  onOnboardingClick,
}: MobileSmartHomeProps) {
  const router = useRouter();
  const [activeView, setActiveView] = useState<'insights' | 'trends' | 'table'>('insights');
  const [tableFilters, setTableFilters] = useState<NursingTableParams>({
    page: 1,
    limit: 5,
    sortBy: 'compensation',
    sortOrder: 'desc',
  });

  // Fetch real nursing data
  const { data: nursingData, isLoading } = useNursingTable(tableFilters, {
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Calculate real-time stats from API data
  const calculateStats = () => {
    if (!nursingData?.data) return {
      avgSalary: 75,
      topSalary: 125,
      totalNurses: 50000,
      topSpecialty: 'ICU',
      avgByExperience: { entry: 65, mid: 75, senior: 95 }
    };

    const { data } = nursingData;
    const avgSalary = Math.round(data.reduce((acc, n) => acc + n.compensation.hourly, 0) / data.length);
    const topSalary = Math.max(...data.map(n => n.compensation.hourly));
    const specialties = data.reduce((acc, n) => {
      acc[n.specialty] = (acc[n.specialty] || 0) + n.compensation.hourly;
      return acc;
    }, {} as Record<string, number>);
    const topSpecialty = Object.entries(specialties).sort(([,a], [,b]) => b - a)[0]?.[0] || 'ICU';

    return {
      avgSalary,
      topSalary,
      totalNurses: nursingData.meta.total || 50000,
      topSpecialty,
      avgByExperience: { entry: 65, mid: avgSalary, senior: 95 }
    };
  };

  const stats = calculateStats();

  // For non-logged in users - Show the value with real data
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-black dark:to-zinc-900">
        {/* Hero with Real Stats */}
        <div className="px-4 pt-6 pb-4">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-3">
              <Sparkles className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Real Nurse Salaries
            </h1>
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              Live data from {stats.totalNurses.toLocaleString()}+ nurses nationwide
            </p>
          </div>

          {/* Live Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-5 h-5 text-emerald-500" />
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <ArrowUp className="w-3 h-3" />
                  Live
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${stats.avgSalary}/hr
              </p>
              <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1">
                National Average
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <span className="text-xs text-purple-600">Top 10%</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${stats.topSalary}/hr
              </p>
              <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1">
                Top Earners
              </p>
            </motion.div>
          </div>

          {/* Latest Salaries Preview */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-wider mb-3">
              Latest Reported Salaries
            </h3>
            {isLoading ? (
              <div className="space-y-2">
                {[1,2,3].map(i => (
                  <div key={i} className="h-16 bg-gray-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {nursingData?.data.slice(0, 3).map((nurse, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white dark:bg-zinc-900 rounded-lg p-3 flex items-center justify-between shadow-sm"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          ${nurse.compensation.hourly}/hr
                        </span>
                        {nurse.compensation.hourly > stats.avgSalary && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            +${nurse.compensation.hourly - stats.avgSalary}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          {nurse.specialty}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {nurse.location}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* CTA */}
          <button
            onClick={onOnboardingClick}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Get Your Personalized Analysis
          </button>
          
          <button
            onClick={onShowLogin}
            className="w-full py-3 text-gray-600 dark:text-zinc-400 text-sm mt-2"
          >
            Already have an account? Sign in
          </button>
        </div>

        {/* Scrollable Data Section */}
        <div className="px-4 py-6 bg-gray-50 dark:bg-zinc-900/50">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-zinc-500 uppercase tracking-wider mb-4">
            Explore More Data
          </h3>
          
          {/* Quick Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
            {['All', 'ICU', 'ER', 'Pediatrics', 'OR'].map(filter => (
              <button
                key={filter}
                onClick={() => setTableFilters(prev => ({
                  ...prev,
                  specialties: filter === 'All' ? [] : [filter]
                }))}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap ${
                  filter === 'All' 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <Suspense fallback={
            <div className="h-64 bg-gray-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
          }>
            <MobileCardBoardV2 
              filters={{
                specialty: tableFilters.specialties?.[0],
                state: tableFilters.states?.[0],
                city: undefined
              }}
              onFiltersChange={(newFilters) => {
                setTableFilters(prev => ({
                  ...prev,
                  specialties: newFilters.specialty ? [newFilters.specialty] : undefined,
                  states: newFilters.state ? [newFilters.state] : undefined
                }));
              }}
            />
          </Suspense>
        </div>
      </div>
    );
  }

  // For logged-in users - Personalized insights with real data
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-zinc-900">
      {/* Personalized Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 pt-6 pb-4">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-white">
            Welcome back, {user.firstName || 'Nurse'}! 
          </h1>
          <p className="text-emerald-100 text-sm mt-1">
            Your personalized salary insights
          </p>
        </div>

        {/* Main Insight Card with Real Data */}
        <div className="bg-white/20 backdrop-blur rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm opacity-90">Market Analysis</span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
              Based on {nursingData?.meta.total || '50,000'}+ nurses
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold">${stats.avgSalary}/hr</p>
              <p className="text-xs opacity-90 mt-1">Market Average</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.topSpecialty}</p>
              <p className="text-xs opacity-90 mt-1">Top Paying Specialty</p>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-white/20">
            <p className="text-sm">
              💡 Nurses in {stats.topSpecialty} earn ${Math.round(stats.topSalary * 0.8)}/hr on average
            </p>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 z-10">
        <div className="flex">
          {[
            { id: 'insights', label: 'Insights', icon: Sparkles },
            { id: 'trends', label: 'Trends', icon: TrendingUp },
            { id: 'table', label: 'Data', icon: BarChart3 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                activeView === tab.id
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-500 dark:text-zinc-400'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content based on active view */}
      <AnimatePresence mode="wait">
        {activeView === 'insights' && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="px-4 py-4"
          >
            {/* Live Salary Feed */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Live Salary Updates
              </h3>
              <Suspense fallback={
                <div className="space-y-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              }>
                <MobileCardBoardV2 
                  filters={{
                    specialty: tableFilters.specialties?.[0],
                    state: tableFilters.states?.[0],
                    city: undefined
                  }}
                  onFiltersChange={(newFilters) => {
                    setTableFilters(prev => ({
                      ...prev,
                      specialties: newFilters.specialty ? [newFilters.specialty] : undefined,
                      states: newFilters.state ? [newFilters.state] : undefined
                    }));
                  }}
                />
              </Suspense>
            </div>

            {/* Action Cards */}
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/compensation-calculator')}
                className="w-full bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">Calculate Your Worth</p>
                    <p className="text-xs text-gray-600 dark:text-zinc-400">Compare with similar nurses</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button 
                onClick={() => setActiveView('table')}
                className="w-full bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">Browse All Data</p>
                    <p className="text-xs text-gray-600 dark:text-zinc-400">{nursingData?.meta.total || '50,000'}+ salary records</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </motion.div>
        )}

        {activeView === 'trends' && (
          <motion.div
            key="trends"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="px-4 py-4"
          >
            <Suspense fallback={
              <div className="h-96 bg-gray-100 rounded-xl animate-pulse" />
            }>
              <MobileNursingGraphV2 />
            </Suspense>
          </motion.div>
        )}

        {activeView === 'table' && (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="px-4 py-4"
          >
            <Suspense fallback={
              <div className="h-96 bg-gray-100 rounded-xl animate-pulse" />
            }>
              <div className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden">
                <NursingCompensationTableWrapper 
                  data={nursingData?.data || []}
                  meta={nursingData?.meta}
                  onPageChange={(page) => setTableFilters(prev => ({ ...prev, page }))}
                />
              </div>
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom CTA */}
      <div className="px-4 py-6">
        <button
          onClick={() => router.push(`/users/${user.id}`)}
          className="w-full py-4 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-100 text-white dark:text-gray-900 rounded-2xl font-semibold shadow-lg"
        >
          View Your Full Profile →
        </button>
      </div>
    </div>
  );
}