'use client';

import React, { useState, lazy, Suspense } from 'react';
import { LazyMotion } from 'framer-motion';
import motionFeatures from 'src/lib/framer-motion-features';
import { useRouter, useParams } from 'next/navigation';
import { Stethoscope, RefreshCw, AlertCircle, Home } from 'lucide-react';
import { useTheme } from 'src/contexts/ThemeContext';
import { ThemeSwitch } from 'src/components/ui/common/ThemeToggle';

import { useMyProfile } from 'src/api/useProfileData';
import { useMyCompensation } from 'src/api/useCompensation';
import useWageDistribution from 'src/api/useDashboard';
import { useUserMetrics } from 'src/api/useUserMetrics';
import { useDifferentialsSummary } from 'src/api/useDifferentials';

const UserProfileCard = lazy(() => import('src/components/features/dashboard/UserProfileCard'));
const CareerDashboard = lazy(() => import('src/components/features/career/CareerDashboard'));
const CompensationAnalysis = lazy(() => import('src/components/features/dashboard/CompensationAnalysis'));
const RadarAnalytics = lazy(() => import('src/components/features/dashboard/RadarAnalytics'));
const PredictiveCompChart = lazy(() => import('src/components/features/dashboard/PredictiveCompChart'));
const AiCareerInsights = lazy(() => import('src/components/features/dashboard/AiCareerInsights'));
const NextSteps = lazy(() => import('src/components/features/dashboard/NextSteps'));

// 목 데이터
const mockMetrics = {
  totalCompensation: 8.5,
  workload: 7.2,
  experienceLevel: 8.0,
  careerGrowth: 7.5,
  marketCompetitiveness: 8.8,
};

const regionalAverages = {
  hourlyRate: 33.2,
  annualSalary: 69056,
  metrics: {
    totalCompensation: 6.5,
    workload: 6.0,
    experienceLevel: 6.5,
    careerGrowth: 6.2,
    marketCompetitiveness: 6.8,
  },
};

const metricAnalysis: Record<string, string> = {
  totalCompensation: 'Your total compensation including differentials is above regional average.',
  workload: 'Your nurse-to-patient ratio indicates a manageable workload.',
  experienceLevel: 'Your experience level is well-matched with regional standards.',
  careerGrowth: 'Your salary progression aligns well with your years of experience.',
  marketCompetitiveness: 'Your compensation is competitive within your specialty and region.',
};

export default function UserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.userId as string;
  const [dataRefreshDate] = useState(new Date().toLocaleDateString());
  const { theme } = useTheme();

  // API 호출
  const { data: profileData, error: profileError, refetch: refetchProfile } = useMyProfile();
  const { data: compensationData, error: compensationError, refetch: refetchCompensation } = useMyCompensation();
  const { data: wageDistributionData, error: wageDistributionError } = useWageDistribution();
  const { data: metricsData, isLoading: isMetricsLoading, error: metricsError } = useUserMetrics();
  const { isLoading: isDifferentialsLoading, error: differentialsError } = useDifferentialsSummary();

  // 데이터 처리
  const enhancedPayData = React.useMemo(() => {
    if (!wageDistributionData?.payDistributionData) return [];
    return wageDistributionData.payDistributionData.map((item) => ({
      ...item,
      isUser: compensationData && Math.round(compensationData.hourlyRate) === item.wageValue,
    }));
  }, [wageDistributionData, compensationData]);

  const actualRegionalAvgHourlyRate = wageDistributionData?.regionalAvgWage || regionalAverages.hourlyRate;
  const actualRegionalAvgAnnualSalary = actualRegionalAvgHourlyRate * 2080;

  const calculateDifference = (user: number, avg: number) => Math.round(((user - avg) / avg) * 100);

  const getCompensationInsight = () => {
    if (!compensationData) return '';
    const diff = calculateDifference(compensationData.annualSalary, actualRegionalAvgAnnualSalary);
    return diff > 0
      ? `You're about ${diff}% above similar local RNs in total comp. Nice!`
      : `You're about ${Math.abs(diff)}% below average comp. Room to negotiate?`;
  };

  const calculatePotentialDifferentials = () => {
    const opportunities = [];
    if (compensationData?.differentials) {
      const nightDiff = compensationData.differentials.find(d => d.type === 'night');
      const weekendDiff = compensationData.differentials.find(d => d.type === 'weekend');
      
      if (!nightDiff || nightDiff.value < 3) {
        opportunities.push('Night shift differential: +$3-5/hr potential');
      }
      if (!weekendDiff || weekendDiff.value < 2) {
        opportunities.push('Weekend differential: +$2-4/hr potential');
      }
      if (profileData?.specialty === 'ICU' || profileData?.specialty === 'ER') {
        opportunities.push('Specialty certification: +$1-2/hr potential');
      }
      if (profileData?.experience && profileData.experience.includes('5+')) {
        opportunities.push('Senior nurse differential: +$2-3/hr potential');
      }
    }
    if (opportunities.length === 0) {
      opportunities.push('You are maximizing your differential opportunities!');
    }
    return opportunities;
  };

  // 에러 상태
  const hasError = profileError || compensationError || wageDistributionError;
  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <p className="text-lg font-medium text-slate-600 mb-2">Failed to load data</p>
        <p className="text-sm text-slate-500 mb-4">
          {profileError?.message || compensationError?.message || 'Unknown error occurred'}
        </p>
        <button
          type="button"
          onClick={() => {
            if (profileError) refetchProfile();
            if (compensationError) refetchCompensation();
          }}
          className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <LazyMotion features={motionFeatures} strict>
      <div className="min-h-screen bg-stone-50 dark:bg-slate-800 dark:text-white p-4 sm:p-6 transition-colors">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
            <div className="flex items-center">
              <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-full mr-3 transition-colors">
                <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500" />
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-700 dark:text-slate-300 transition-colors">
                Nurse Pay Buddy
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
                title="Back to Main Page"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Main Page</span>
              </button>
              <ThemeSwitch className="" />
              <div className="hidden sm:flex items-center text-sm">
                <RefreshCw className="w-4 h-4 mr-1" />
                <span>Data updated: {dataRefreshDate}</span>
              </div>
            </div>
          </div>

          {/* User Profile Card */}
          {profileData ? (
            <Suspense fallback={
              <div className={`mb-4 sm:mb-6 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-xl shadow-lg border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} h-32 animate-pulse`} />
            }>
              <UserProfileCard userProfile={profileData} theme={theme} />
            </Suspense>
          ) : (
            <div className={`mb-4 sm:mb-6 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-xl shadow-lg border ${theme === 'light' ? 'border-gray-100' : 'border-slate-700'} h-48 animate-pulse`} />
          )}

          {/* Two-column: Compensation & Radar */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <Suspense fallback={
              <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-xl shadow-lg border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} min-h-[384px] animate-pulse`} />
            }>
              <CompensationAnalysis
                userProfile={compensationData || { hourlyRate: 0, annualSalary: 0, differentials: [] }}
                theme={theme}
                getCompensationInsight={getCompensationInsight}
                calculatePotentialDifferentials={calculatePotentialDifferentials}
              />
            </Suspense>
            
            <Suspense fallback={
              <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-xl shadow-lg border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} min-h-[384px] animate-pulse`} />
            }>
              <RadarAnalytics
                userMetrics={metricsData?.userMetrics || mockMetrics}
                avgMetrics={metricsData?.regionalAverageMetrics || regionalAverages.metrics}
                theme={theme}
                metricAnalysis={metricAnalysis}
                userId={userId}
                isLoading={isMetricsLoading}
                error={metricsError}
              />
            </Suspense>
          </div>

          {/* Predictive Compensation Chart */}
          <div className="mb-4 sm:mb-6">
            <Suspense fallback={
              <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-xl shadow-lg border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} min-h-[256px] animate-pulse`} />
            }>
              <PredictiveCompChart
                payDistributionData={enhancedPayData}
                userHourlyRate={compensationData?.hourlyRate || 0}
                regionalAvgWage={actualRegionalAvgHourlyRate}
                theme={theme}
              />
            </Suspense>
          </div>

          {/* My Career Journey */}
          <div className="mb-4 sm:mb-6">
            <Suspense fallback={
              <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-xl shadow-lg border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} flex items-center justify-center h-64`}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
              </div>
            }>
              <CareerDashboard theme={theme} />
            </Suspense>
          </div>

          {/* Bottom row: AI Career + Next Steps */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <Suspense fallback={
              <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-xl shadow-lg border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} min-h-[256px] animate-pulse`} />
            }>
              <AiCareerInsights theme={theme} />
            </Suspense>
            <Suspense fallback={
              <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-xl shadow-lg border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} min-h-[256px] animate-pulse`} />
            }>
              <NextSteps theme={theme} />
            </Suspense>
          </div>

          {/* Footer */}
          <div className={`mt-6 text-center text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>
            <p>
              Analytics processed by NursePayBuddy™ AI | Last updated {dataRefreshDate}
            </p>
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}