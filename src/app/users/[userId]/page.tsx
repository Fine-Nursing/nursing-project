'use client';

import React, { useState, lazy, Suspense } from 'react';
import { LazyMotion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { HeartHandshake, RefreshCw, AlertCircle, Home } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from 'src/contexts/ThemeContext';
import { ThemeSwitch } from 'src/components/ui/common/ThemeToggle';

import { useMyProfile } from 'src/api/useProfileData';
import { useMyCompensation } from 'src/api/useCompensation';
import useWageDistribution from 'src/api/useDashboard';
import { useUserMetrics } from 'src/api/useUserMetrics';
import { useDifferentialsSummary } from 'src/api/useDifferentials';
import { useAllAiInsights } from 'src/api/ai/useAiInsights';
import { useSpecialtyAverageCompensation } from 'src/api/useSpecialties';
import { useUpdateCompensation } from 'src/api/useUpdateCompensation';
import useAuthStore from 'src/hooks/useAuthStore';
import UserProfileCardSkeleton from '../../../components/features/dashboard/UserProfileCard/components/UserProfileCardSkeleton';
import motionFeatures from '../../../lib/framer-motion-features';
import { CompensationCalculator } from 'src/utils/compensation';

const UserProfileCard = lazy(() => import('src/components/features/dashboard/UserProfileCard'));
const CareerDashboard = lazy(() => import('src/components/features/career/CareerDashboard'));
const CompensationAnalysis = lazy(() => import('src/components/features/dashboard/CompensationAnalysis'));
const RadarAnalytics = lazy(() => import('src/components/features/dashboard/RadarAnalytics'));
const PredictiveCompChart = lazy(() => import('src/components/features/dashboard/PredictiveCompChart'));
const AiCareerInsights = lazy(() => import('src/components/features/dashboard/AiCareerInsights'));
const NextSteps = lazy(() => import('src/components/features/dashboard/NextSteps'));
const EditCompensationModal = lazy(() => import('src/components/features/profile/EditCompensationModal'));

// 기본값 - 실제 데이터가 없을 때만 사용
const defaultMetrics = {
  pay: 6.5,
  hospitalQuality: 7.0,
  hospitalCulture: 6.8,
  growthOpportunities: 6.5,
  benefits: 7.2,
};

const metricAnalysis: Record<string, string> = {
  pay: 'Your total compensation including differentials compared to regional average.',
  hospitalQuality: 'Hospital quality rating based on your evaluation of care standards and facilities.',
  hospitalCulture: 'Work environment and team dynamics including shift flexibility.',
  growthOpportunities: 'Career advancement and professional development opportunities.',
  benefits: 'Healthcare, retirement, and other benefits package quality.',
};

export default function UserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.userId as string;
  const [dataRefreshDate] = useState(new Date().toLocaleDateString());
  const { theme } = useTheme();
  const { user } = useAuthStore();
  

  // API 호출
  const { data: profileData, error: profileError, refetch: refetchProfile } = useMyProfile();
  const { data: compensationData, error: compensationError, refetch: refetchCompensation } = useMyCompensation();
  
  
  // 사용자 정보 기반으로 wage distribution 호출
  const userSpecialty = profileData?.specialty || '';
  const userState = profileData?.location?.split(',')[1]?.trim() || ''; // "City, State" 형식에서 State 추출
  
  const { data: wageDistributionData, error: wageDistributionError, isLoading: isWageDistributionLoading } = useWageDistribution({
    specialty: userSpecialty,
    state: userState,
  });

  // Get specialty-specific average compensation data
  const { data: specialtyCompensationData } = useSpecialtyAverageCompensation({
    search: userSpecialty,
    limit: 5,
  });
  
  const { data: metricsData, isLoading: isMetricsLoading, error: metricsError } = useUserMetrics();
  const { data: aiInsights } = useAllAiInsights(user?.id);
  const updateCompensationMutation = useUpdateCompensation();
  useDifferentialsSummary();

  // Edit Compensation Modal state
  const [showEditCompensationModal, setShowEditCompensationModal] = useState(false);
  

  // 데이터 처리 - wage distribution은 조정하지 않음
  const enhancedPayData = React.useMemo(() => {
    if (!wageDistributionData?.payDistributionData) return [];

    // 사용자의 임금 범위 찾기
    const userRate = compensationData?.hourlyRate;

    return wageDistributionData.payDistributionData.map((item) => {
      // 백엔드의 wage distribution은 이미 모든 사용자의 실제 시급 기반
      // 조정할 필요 없이 직접 비교
      if (item.label) {
        const match = item.label.match(/\$(\d+)-(\d+)/);
        if (match) {
          const min = parseInt(match[1], 10);
          const max = parseInt(match[2], 10);

          // 사용자가 이 범위에 속하는지 확인
          const isUser = !!(userRate && userRate >= min && userRate < max);

          return {
            ...item,
            isUser,
            highlight: isUser // 사용자 범위 하이라이트
          };
        }
      }
      return { ...item, isUser: false };
    });
  }, [wageDistributionData, compensationData]);

  // Regional average wage - 백엔드에서 이미 실제 시급으로 계산됨
  const actualRegionalAvgHourlyRate = wageDistributionData?.regionalAvgWage || 35;
  const shiftHours = compensationData?.shiftHours || 12; // Get shift hours from compensation data
  const actualRegionalAvgAnnualSalary = CompensationCalculator.hourlyToAnnual(actualRegionalAvgHourlyRate, shiftHours);

  // 디버그: 세 컴포넌트 데이터 비교
  React.useEffect(() => {
    if (compensationData) {
      const pattern = CompensationCalculator.getShiftPattern(compensationData.shiftHours || 12);

      // Base and Differential Pay 계산 확인
      const totalMonthly = CompensationCalculator.hourlyToMonthly(compensationData.hourlyRate, compensationData.shiftHours || 12);
      const calculatedHourlyFromMonthly = CompensationCalculator.monthlyToHourly(totalMonthly, compensationData.shiftHours || 12);

    }
  }, [compensationData, enhancedPayData]);

  // Calculate specialty average from API data
  const specialtyAvgHourlyRate = React.useMemo(() => {
    if (!specialtyCompensationData || specialtyCompensationData.length === 0) {
      return actualRegionalAvgHourlyRate; // Fallback to regional average
    }
    
    // Get the first matching specialty (since we filtered by userSpecialty)
    const matchingSpecialty = specialtyCompensationData.find(item => 
      item.specialty.toLowerCase().includes(userSpecialty.toLowerCase())
    ) || specialtyCompensationData[0]; // Use first result if no exact match
    
    // Convert annual to hourly using shift pattern
    return CompensationCalculator.annualToHourly(matchingSpecialty.totalCompensation, shiftHours);
  }, [specialtyCompensationData, userSpecialty, actualRegionalAvgHourlyRate]);

  const calculateDifference = (userValue: number, avg: number) => Math.round(((userValue - avg) / avg) * 100);

  const getCompensationInsight = () => {
    if (!compensationData) return '';
    const diff = calculateDifference(compensationData.annualSalary, actualRegionalAvgAnnualSalary);
    return diff > 0
      ? `You're about ${diff}% above similar local RNs in total comp. Nice!`
      : `You're about ${Math.abs(diff)}% below average comp. Room to negotiate?`;
  };

  // 각 differential 타입별 예상 근무시간 계산
  const getEstimatedHours = (type: string) => {
    const lowerType = type.toLowerCase();
    switch (lowerType) {
      case 'night':
      case 'night_shift':
        return 80; // 주 5일 * 4주 * 4시간
      case 'weekend':
      case 'weekend_shift':
        return 32; // 주말 2일 * 4주 * 4시간
      case 'charge':
      case 'charge_nurse':
        return 160; // 전체 근무시간
      case 'on_call':
      case 'oncall':
        return 40; // 월 평균 40시간
      case 'certification':
      case 'cert':
      case 'experience':
      case 'exp':
        return 160; // 월급 고정 수당은 전체 시간으로 계산
      default:
        return 20; // 기타 수당
    }
  };

  const calculatePotentialDifferentials = () => {
    // AI API에서 skill_transfer 데이터를 우선 사용
    const skillTransferContent = (aiInsights?.skillTransfer as any)?.content;
    if (skillTransferContent) {
      const opportunities: string[] = [];
      
      // AI 데이터에서 급여 관련 기회 추출
      const lines = skillTransferContent.split('•').map((line: string) => line.trim()).filter(Boolean);
      lines.forEach((line: string) => {
        if (line.includes('+$') || line.includes('salary') || line.includes('pay') || line.includes('/hr') || line.includes('differential')) {
          opportunities.push(line);
        }
      });
      
      if (opportunities.length > 0) {
        return opportunities.slice(0, 4); // 최대 4개만 표시
      }
    }

    // AI 데이터가 없는 경우 기본 분석 로직 (개선된 버전)
    const opportunities = [];
    if (compensationData?.differentials) {
      const nightDiff = compensationData.differentials.night;
      const weekendDiff = compensationData.differentials.weekend;
      
      if (!nightDiff || nightDiff < 3) {
        opportunities.push('Night shift differential: +$3-5/hr potential');
      }
      if (!weekendDiff || weekendDiff < 2) {
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
      return ['Complete your profile for AI-powered compensation analysis'];
    }
    return opportunities;
  };

  // Handle Edit Compensation Modal
  const handleEditCompensation = () => {
    setShowEditCompensationModal(true);
  };

  const handleCompensationSave = async (data: {
    basePay: number;
    basePayUnit: 'hourly' | 'yearly';
    shiftHours?: number;
    differentials: {
      type: string;
      value: number;
      frequency: number;
    }[];
  }) => {
    try {
      await updateCompensationMutation.mutateAsync(data);
      toast.success('Compensation updated successfully!', {
        icon: '💰',
        duration: 3000,
      });
      setShowEditCompensationModal(false);
    } catch (error) {
      console.error('Failed to update compensation:', error);
      toast.error('Failed to update compensation. Please try again.', {
        icon: '❌',
        duration: 4000,
      });
      throw error; // Re-throw to prevent modal from closing
    }
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
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-600 dark:text-emerald-400 transition-colors">
                Nurse Journey
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
            <Suspense fallback={<UserProfileCardSkeleton theme={theme} />}>
              <UserProfileCard userProfile={profileData} theme={theme} />
            </Suspense>
          ) : (
            <UserProfileCardSkeleton theme={theme} />
          )}

          {/* Two-column: Compensation & Radar */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <Suspense fallback={
              <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-xl shadow-lg border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} animate-pulse`}>
                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-slate-700">
                  <div className="flex justify-between items-center">
                    <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-56" />
                    <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-16" />
                  </div>
                </div>
                {/* Content */}
                <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
                  {/* Primary Display */}
                  <div className="text-center space-y-2">
                    <div className="h-12 bg-gray-200 dark:bg-slate-700 rounded w-48 mx-auto" />
                    <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-32 mx-auto" />
                  </div>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="p-3 bg-gray-100 dark:bg-slate-700 rounded space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-20" />
                        <div className="h-8 bg-gray-200 dark:bg-slate-600 rounded w-16" />
                      </div>
                    ))}
                  </div>
                  {/* Differential Breakdown */}
                  <div className="space-y-3">
                    <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-40" />
                    {[1,2,3].map(i => (
                      <div key={i} className="flex justify-between items-center">
                        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-24" />
                        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-16" />
                      </div>
                    ))}
                  </div>
                  {/* AI Insights */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg space-y-3">
                    <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-32" />
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full" />
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
                  </div>
                </div>
              </div>
            }>
              <CompensationAnalysis
                userProfile={compensationData ? {
                  hourlyRate: compensationData.hourlyRate, // 총 보상 시급 (맨 위 Total에 사용)
                  annualSalary: compensationData.annualSalary, // 총 보상 연봉 (맨 위 Total에 사용)
                  baseHourlyRate: compensationData.baseHourlyRate, // Base pay 시급 (Base Pay Section에 사용)
                  baseAnnualSalary: CompensationCalculator.hourlyToAnnual(
                    compensationData.baseHourlyRate || compensationData.hourlyRate,
                    shiftHours
                  ), // Base pay 연봉
                  differentials: compensationData.differentials.details && compensationData.differentials.details.length > 0 ?
                    compensationData.differentials.details
                      .filter(detail => detail.value > 0)
                      .map(detail => ({
                        type: detail.type,
                        label: detail.label,
                        value: detail.value,
                        frequency: detail.frequency, // Use BE-calculated frequency
                        monthlyAmount: detail.monthlyAmount, // Use BE-calculated monthly amount
                        estimatedHours: getEstimatedHours(detail.type), // Keep for backward compatibility
                        description: `${detail.label} differential pay`
                      })) : [
                    // Fallback to old structure if details not available
                    compensationData.differentials.night > 0 ? {
                      type: 'night',
                      label: 'Night Shift',
                      value: CompensationCalculator.monthlyToHourly(compensationData.differentials.night, shiftHours),
                      frequency: 3, // Default: 3 nights per week
                      monthlyAmount: compensationData.differentials.night,
                      estimatedHours: 40, // Keep for compatibility
                      description: 'Night shift differential pay'
                    } : null,
                    compensationData.differentials.weekend > 0 ? {
                      type: 'weekend',
                      label: 'Weekend',
                      value: CompensationCalculator.monthlyToHourly(compensationData.differentials.weekend, shiftHours),
                      frequency: 2, // Default: 2 weekends per month
                      monthlyAmount: compensationData.differentials.weekend,
                      estimatedHours: 32, // Keep for compatibility
                      description: 'Weekend differential pay'
                    } : null,
                    compensationData.differentials.other > 0 ? {
                      type: 'other',
                      label: 'Other',
                      value: CompensationCalculator.monthlyToHourly(compensationData.differentials.other, shiftHours),
                      frequency: 1, // Default frequency
                      monthlyAmount: compensationData.differentials.other,
                      estimatedHours: 20,
                      description: 'Other differential pay'
                    } : null
                  ].filter(Boolean) as any[]
                } : { hourlyRate: 0, annualSalary: 0, differentials: [] }}
                theme={theme}
                getCompensationInsight={getCompensationInsight}
                calculatePotentialDifferentials={calculatePotentialDifferentials}
                userSpecialty={userSpecialty}
                userState={userState}
                regionalAvgWage={actualRegionalAvgHourlyRate}
                specialtyAvgWage={specialtyAvgHourlyRate}
                shiftHours={shiftHours}
                onEditCompensation={handleEditCompensation}
              />
            </Suspense>
            
            {/* Radar Analytics - 데이터 로딩 완료 후에만 렌더링 */}
            {!isMetricsLoading && metricsData ? (
              <Suspense fallback={
                <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-xl shadow-lg border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} animate-pulse`}>
                  <div className="p-4 sm:p-6 space-y-6">
                    <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-40" />
                    <div className="flex justify-center items-center h-64">
                      <div className="w-48 h-48 bg-gray-200 dark:bg-slate-700 rounded-full relative">
                        <div className="absolute inset-8 bg-gray-300 dark:bg-slate-600 rounded-full" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="h-4 bg-gray-200 dark:bg-slate-700 rounded" />
                      ))}
                    </div>
                  </div>
                </div>
              }>
                <RadarAnalytics
                  userMetrics={metricsData.userMetrics || defaultMetrics}
                  avgMetrics={metricsData.regionalAverageMetrics || defaultMetrics}
                  theme={theme}
                  metricAnalysis={metricAnalysis}
                  userId={userId}
                  isLoading={false}
                  error={metricsError}
                />
              </Suspense>
            ) : (
              // 로딩 중일 때 Skeleton 표시
              <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-xl shadow-lg border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} animate-pulse`}>
                <div className="p-4 sm:p-6 space-y-6">
                  <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-40" />
                  <div className="flex justify-center items-center h-64">
                    <div className="w-48 h-48 bg-gray-200 dark:bg-slate-700 rounded-full relative">
                      <div className="absolute inset-8 bg-gray-300 dark:bg-slate-600 rounded-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="h-4 bg-gray-200 dark:bg-slate-700 rounded" />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Predictive Compensation Chart */}
          <div className="mb-4 sm:mb-6">
            <Suspense fallback={
              <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-xl shadow-lg border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} animate-pulse`}>
                <div className="p-4 sm:p-6 space-y-6">
                  <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-56" />
                  <div className="h-64 bg-gray-100 dark:bg-slate-700 rounded-lg relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4 space-x-2">
                      {[1,2,3,4,5,6,7].map(i => (
                        <div key={i} className="bg-gray-200 dark:bg-slate-600 rounded-t" style={{width: '12%', height: `${30 + i * 10}%`}} />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-24" />
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-32" />
                  </div>
                </div>
              </div>
            }>
              {!isWageDistributionLoading && wageDistributionData && profileData ? (
                <PredictiveCompChart
                  payDistributionData={enhancedPayData}
                  userHourlyRate={compensationData?.hourlyRate || actualRegionalAvgHourlyRate} // Use regional average as fallback
                  regionalAvgWage={actualRegionalAvgHourlyRate}
                  theme={theme}
                  userSpecialty={userSpecialty}
                  userState={userState}
                />
              ) : (
                <div className={`${
                  theme === 'light' ? 'bg-white' : 'bg-slate-800'
                } rounded-xl shadow-lg border ${
                  theme === 'light' ? 'border-gray-200' : 'border-slate-700'
                } p-8`}>
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
                    <div className="h-64 bg-gray-100 dark:bg-slate-900 rounded" />
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-20 bg-gray-100 dark:bg-slate-900 rounded" />
                      <div className="h-20 bg-gray-100 dark:bg-slate-900 rounded" />
                      <div className="h-20 bg-gray-100 dark:bg-slate-900 rounded" />
                    </div>
                  </div>
                </div>
              )}
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
              <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-xl shadow-lg border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} animate-pulse`}>
                <div className="p-4 sm:p-6 space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-slate-700 rounded" />
                    <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-44" />
                  </div>
                  <div className="space-y-4">
                    {[1,2,3].map(i => (
                      <div key={i} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-gray-200 dark:bg-slate-700 rounded-full mt-2" />
                        <div className="flex-1 space-y-2">
                          <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-full" />
                          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            }>
              <AiCareerInsights theme={theme} />
            </Suspense>
            <Suspense fallback={
              <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-xl shadow-lg border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} animate-pulse`}>
                <div className="p-4 sm:p-6 space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-slate-700 rounded" />
                    <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-32" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="p-3 bg-gray-100 dark:bg-slate-700 rounded-lg space-y-2">
                        <div className="h-5 bg-gray-200 dark:bg-slate-600 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            }>
              <NextSteps 
                theme={theme} 
                userSpecialty={userSpecialty}
                userState={userState}
                userHourlyRate={compensationData?.hourlyRate}
              />
            </Suspense>
          </div>

          {/* Footer */}
          <div className={`mt-6 text-center text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>
            <p>
              Analytics processed by NursePayBuddy™ AI | Last updated {dataRefreshDate}
            </p>
          </div>
        </div>

        {/* Edit Compensation Modal */}
        <Suspense fallback={null}>
          <EditCompensationModal
            isOpen={showEditCompensationModal}
            onClose={() => setShowEditCompensationModal(false)}
            currentCompensation={{
              basePay: compensationData?.baseHourlyRate || compensationData?.hourlyRate || 0,
              basePayUnit: 'hourly' as const,
              shiftHours: compensationData?.shiftHours || 12,
              differentials: compensationData?.differentials?.details?.filter(detail => {
                // Filter out entries with invalid data
                return detail.type && detail.value > 0;
              }).map(detail => ({
                // Remove any null bytes from the type string
                type: String(detail.type)
                  .split('')
                  .filter(char => char.charCodeAt(0) !== 0)
                  .join('')
                  .trim(),
                value: Number(detail.value) || 0,
                frequency: Number(detail.frequency) || 1, // Use actual frequency value
              })).filter(d => d.type && d.type.length > 0) || [],
            }}
            onSave={handleCompensationSave}
            theme={theme}
          />
        </Suspense>
      </div>
    </LazyMotion>
  );
}