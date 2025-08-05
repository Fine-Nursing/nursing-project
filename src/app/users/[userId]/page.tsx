'use client';

import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Stethoscope, RefreshCw, Moon, Sun, AlertCircle } from 'lucide-react';

import { useMyProfile } from 'src/api/useProfileData';
import { useMyCompensation } from 'src/api/useCompensation';
import useWageDistribution from 'src/api/useDashboard';
import { useUserMetrics } from 'src/api/useUserMetrics';
import { useDifferentialsSummary } from 'src/api/useDifferentials';
import UserProfileCard from 'src/components/user-page/NurseDashboard/UserProfileCard';
import CompensationAnalysis from 'src/components/user-page/NurseDashboard/CompensationAnalysis';
import RadarAnalytics from 'src/components/user-page/NurseDashboard/RadarAnalytics';
import PredictiveCompChart from 'src/components/user-page/NurseDashboard/PredictiveCompChart';
import AiCareerInsights from 'src/components/user-page/NurseDashboard/AiCareerInsights';
import NextSteps from 'src/components/user-page/NurseDashboard/NextSteps';
// Lazy load heavy components
const CareerDashboard = lazy(() => import('src/components/user-page/CareerDashboard/CareerDashboard'));

// API에서 가져오지 않는 데이터들은 일단 목 데이터로 유지
const mockMetrics = {
  totalCompensation: 8.2,
  workload: 7.5,
  experienceLevel: 6.9,
  careerGrowth: 7.8,
  marketCompetitiveness: 6.5,
};

const regionalAverages = {
  hourlyRate: 33.2,
  annualSalary: 69056,
  metrics: {
    totalCompensation: 7.0,
    workload: 6.5,
    experienceLevel: 7.0,
    careerGrowth: 6.8,
    marketCompetitiveness: 7.0,
  },
};

const metricAnalysis: Record<string, string> = {
  totalCompensation:
    'Your total compensation including differentials is above regional average.',
  workload:
    'Your nurse-to-patient ratio indicates a manageable workload.',
  experienceLevel:
    'Your experience level is well-matched with regional standards.',
  careerGrowth:
    'Your salary progression aligns well with your years of experience.',
  marketCompetitiveness:
    'Your compensation is competitive within your specialty and region.',
};

export default function UserPage() {
  const [dataRefreshDate] = useState(new Date().toLocaleDateString());
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // API 호출
  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useMyProfile();

  const {
    data: compensationData,
    isLoading: isCompensationLoading,
    error: compensationError,
    refetch: refetchCompensation,
  } = useMyCompensation();

  // 임금 분포 데이터 API 호출
  const {
    data: wageDistributionData,
    isLoading: isWageDistributionLoading,
    error: wageDistributionError,
  } = useWageDistribution({
    state: profileData?.location?.split(', ')[1],
    city: profileData?.location?.split(', ')[0],
    specialty: profileData?.specialty,
  });

  // 사용자 메트릭 데이터 API 호출
  const {
    data: metricsData,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isLoading: isMetricsLoading,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error: metricsError,
  } = useUserMetrics();

  // 차등수당 데이터 API 호출
  const {
    data: differentialsData,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isLoading: isDifferentialsLoading,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error: differentialsError,
  } = useDifferentialsSummary();

  // 데이터 로깅 - 개발 시 확인용
  useEffect(() => {
    if (profileData) {
      // eslint-disable-next-line no-console
      console.log('Profile Data:', profileData);
    }
  }, [profileData]);

  useEffect(() => {
    if (compensationData) {
      // eslint-disable-next-line no-console
      console.log('Compensation Data:', compensationData);
      // eslint-disable-next-line no-console
      console.log('Hourly Rate:', compensationData.hourlyRate);
      // eslint-disable-next-line no-console
      console.log('Annual Salary:', compensationData.annualSalary);
      // eslint-disable-next-line no-console
      console.log('Differentials:', compensationData.differentials);
    }
  }, [compensationData]);

  // 임금 분포 데이터 처리
  const enhancedPayData = React.useMemo(() => {
    if (!wageDistributionData?.payDistributionData) return [];
    
    // 사용자의 임금에 해당하는 데이터에 isUser 표시
    return wageDistributionData.payDistributionData.map((item) => ({
      ...item,
      isUser: compensationData && Math.round(compensationData.hourlyRate) === item.wageValue,
    }));
  }, [wageDistributionData, compensationData]);

  // Theme toggle
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Simple difference
  const calculateDifference = (user: number, avg: number) =>
    Math.round(((user - avg) / avg) * 100);

  // AI compensation insight
  const getCompensationInsight = () => {
    if (!compensationData) return '';

    const diff = calculateDifference(
      compensationData.annualSalary,
      regionalAverages.annualSalary
    );
    return diff > 0
      ? `You're about ${diff}% above similar local RNs in total comp. Nice!`
      : `You're about ${Math.abs(diff)}% below average comp. Room to negotiate?`;
  };

  // Calculate monthly differentials from actual data
  const calculatePotentialDifferentials = () => {
    if (!differentialsData) return 0;
    return differentialsData.estimatedMonthlyDifferentials;
  };

  // 로딩 상태
  if (isProfileLoading || isCompensationLoading || isWageDistributionLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-slate-400 border-solid rounded-full animate-spin" />
        <p className="mt-4 text-lg font-medium text-slate-600">
          Analyzing your data...
        </p>
      </div>
    );
  }

  // 에러 상태
  const hasError = profileError || compensationError || wageDistributionError;
  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <p className="text-lg font-medium text-slate-600 mb-2">
          Failed to load data
        </p>
        <p className="text-sm text-slate-500 mb-4">
          {profileError?.message ||
            compensationError?.message ||
            'Unknown error occurred'}
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

  // 데이터가 없는 경우
  if (!profileData || !compensationData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
        <p className="text-lg font-medium text-slate-600">No data available</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        theme === 'light' ? 'bg-stone-50' : 'bg-slate-800 text-white'
      } p-3 sm:p-6`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
          <div className="flex items-center">
            <div
              className={`${
                theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'
              } p-2 rounded-full mr-3`}
            >
              <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500" />
            </div>
            <h1
              className={`text-xl sm:text-2xl lg:text-3xl font-bold ${
                theme === 'light' ? 'text-slate-700' : 'text-slate-300'
              }`}
            >
              Nurse Pay Buddy
            </h1>
          </div>
          {/* Theme Toggle + Data Refresh Info */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                theme === 'light'
                  ? 'bg-slate-100 text-slate-500'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {theme === 'light' ? <Moon className="w-4 h-4 sm:w-5 sm:h-5" /> : <Sun className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
            <div className="hidden sm:flex items-center text-sm">
              <RefreshCw className="w-4 h-4 mr-1" />
              <span>Data updated: {dataRefreshDate}</span>
            </div>
          </div>
        </div>

        {/* User Profile Card - API 데이터 사용 */}
        <UserProfileCard userProfile={profileData} theme={theme} />

        {/* Two-column: Compensation & Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <CompensationAnalysis
            userProfile={compensationData}
            theme={theme}
            getCompensationInsight={getCompensationInsight}
            calculatePotentialDifferentials={calculatePotentialDifferentials}
          />
          <RadarAnalytics
            userMetrics={metricsData?.userMetrics || mockMetrics}
            avgMetrics={metricsData?.regionalAverageMetrics || regionalAverages.metrics}
            theme={theme}
            metricAnalysis={metricAnalysis}
          />
        </div>

        {/* PredictiveCompChart + CareerPathTimeline */}
        <div
          className={`${
            theme === 'light' ? 'bg-white' : 'bg-slate-700'
          } rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-6 mb-4 sm:mb-6 border ${
            theme === 'light' ? 'border-slate-100' : 'border-slate-600'
          }`}
        >
          <PredictiveCompChart
            payDistributionData={enhancedPayData}
            userHourlyRate={compensationData.hourlyRate}
            regionalAvgWage={wageDistributionData?.regionalAvgWage || regionalAverages.hourlyRate}
            theme={theme}
          />

          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600" />
            </div>
          }>
            <CareerDashboard theme={theme} />
          </Suspense>
        </div>

        {/* Bottom row: AI Career + Next Steps */}
        <div className="flex flex-col lg:flex-row items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
          <AiCareerInsights theme={theme} />
          <NextSteps theme={theme} />
        </div>

        {/* Footer */}
        <div
          className={`mt-6 text-center text-sm ${
            theme === 'light' ? 'text-gray-500' : 'text-gray-300'
          }`}
        >
          <p>
            Analytics processed by NursePayBuddy™ AI | Last updated{' '}
            {dataRefreshDate}
          </p>
        </div>
      </div>
    </div>
  );
}