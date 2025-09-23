'use client';

import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import toast from 'react-hot-toast';
import useCareerHistory, { useAddCareer, useDeleteCareer } from 'src/api/useCareerHistory';
import { useMyCompensation } from 'src/api/useCompensation';
import { useUserProfile } from 'src/api/useProfileData';
import { LoadingState } from 'src/components/ui/feedback';

import type { CareerItem } from './types';
// 하위 컴포넌트들을 lazy loading으로 변경

const CareerHeader = lazy(() => import('./CareerHeader'));
const CareerStatsGrid = lazy(() => import('./CareerStatsGrid'));
const CareerControlPanel = lazy(() => import('./CareerControlPanel'));
const CompactCareerForm = lazy(() => import('./CompactCareerFormWithTabs'));
const CareerTimeline = lazy(() => import('./CareerTimeline'));
const AiRoleModal = lazy(() => import('./AiRoleModal'));
const SalaryTrendModal = lazy(() => import('./SalaryTrendModal'));
const ProgressionBarChart = lazy(() => import('./ProgressionBarChart'));

interface CareerDashboardProps {
  theme?: 'light' | 'dark';
}


function CareerDashboard({ theme = 'light' }: CareerDashboardProps) {
  // State
  const [careerData, setCareerData] = useState<CareerItem[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [aiReason, setAiReason] = useState<string | null>(null);
  const [showTrend, setShowTrend] = useState(false);
  const [trendData, setTrendData] = useState<{ month: string; hourlyRate: number }[]>([]);

  // API calls
  const { data: careerHistoryData, isLoading: isCareerLoading } = useCareerHistory();
  const { data: compensationData, isLoading: isCompensationLoading } = useMyCompensation();
  const { data: userProfile } = useUserProfile();
  const addCareerMutation = useAddCareer();
  const deleteCareerMutation = useDeleteCareer();

  // Transform API data and remove duplicates - Optimized O(n) complexity
  useEffect(() => {
    if (careerHistoryData) {
      // Use Map for O(n) duplicate removal instead of O(n²) findIndex
      const uniqueMap = new Map<string, typeof careerHistoryData[0]>();
      
      careerHistoryData.forEach(item => {
        // Create unique key from all relevant fields
        const key = `${item.facility}-${item.role}-${item.specialty}-${item.startDate}-${item.endDate}-${item.hourlyRate}`;
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, item);
        }
      });
      
      const transformedData = Array.from(uniqueMap.values()).map((item, index) => ({
        id: index + 1,
        jobId: item.id,  // Store the actual job ID
        facility: item.facility,
        role: item.role,
        specialty: item.specialty,
        startDate: item.startDate ? new Date(item.startDate) : new Date(),
        endDate: item.endDate ? new Date(item.endDate) : null,
        hourlyRate: item.hourlyRate,
      }));
      
      setCareerData(transformedData);
    }
  }, [careerHistoryData]);

  // Event handlers

  const handleAddCareer = useCallback(async (formData: any) => {
    return new Promise<void>((resolve, reject) => {
      addCareerMutation.mutate(formData, {
        onSuccess: () => {
          setFormVisible(false);
          resolve();
        },
        onError: (error) => {
          reject(error);
        },
      });
    });
  }, [addCareerMutation]);

  const handleEdit = useCallback((id: number) => {
    // TODO: Implement edit functionality with ImprovedCareerForm
    toast('Edit functionality coming soon', {
      icon: 'ℹ️',
    });
  }, []);

  const handleCancel = useCallback(() => {
    setFormVisible(false);
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    // Find the item to get the actual jobId
    const item = careerData.find((career) => career.id === id);
    if (!item) return;

    // TODO: Replace with a proper confirmation modal
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to delete this career entry?')) {
      try {
        await deleteCareerMutation.mutateAsync(item.jobId);
        // The UI will be updated automatically through React Query's invalidation
      } catch (error) {
        console.error('Failed to delete career entry:', error);
      }
    }
  }, [careerData, deleteCareerMutation]);

  // AI helpers
  const getAiRoleRecommendation = () => {
    const roles = ['RN', 'Charge Nurse', 'NP', 'Clinical Nurse Educator'];
    const specs = ['ER', 'ICU', 'Pediatrics', 'Oncology'];
    const reasons = [
      'Leadership potential in the ER',
      'ICU expansion soon',
      'Peds synergy for advanced practice',
      'Oncology is growing fast here',
    ];
    const rRole = roles[Math.floor(Math.random() * roles.length)];
    const rSpec = specs[Math.floor(Math.random() * specs.length)];
    const rReason = reasons[Math.floor(Math.random() * reasons.length)];
    return { role: rRole, specialty: rSpec, reason: rReason };
  };

  const getAiSalaryTrend = () => {
    const data = [];
    let base = 35 + Math.random() * 5;
    for (let i = 0; i < 6; i += 1) {
      base += Math.random() * 1.5;
      data.push({
        month: dayjs().add(i, 'month').format('MMM YYYY'),
        hourlyRate: +base.toFixed(2),
      });
    }
    return data;
  };

  const handleAiSuggest = useCallback(() => {
    const { reason } = getAiRoleRecommendation();
    setAiReason(reason);
  }, []);

  const handleSalaryTrend = useCallback(() => {
    setTrendData(getAiSalaryTrend());
    setShowTrend(true);
  }, []);

  const handleCloseAiModal = useCallback(() => setAiReason(null), []);
  const handleCloseTrend = useCallback(() => setShowTrend(false), []);

  // Computed values
  const { sortedCareerData, totalYears, remainingMonths, highestHourlyRate, totalPositions, currentRole } = useMemo(() => {
    const sorted = [...careerData].sort(
      (a, b) => (a.startDate?.getTime() || 0) - (b.startDate?.getTime() || 0)
    );

    // Calculate stats - 가장 이른 시작일부터 가장 늦은 종료일까지
    let months = 0;
    if (sorted.length > 0) {
      // 가장 이른 시작일
      const earliestStart = dayjs(sorted[0].startDate);
      
      // 가장 늦은 종료일 (null이면 현재 날짜)
      const latestEnd = sorted.reduce((latest, item) => {
        const itemEnd = item.endDate ? dayjs(item.endDate) : dayjs();
        return itemEnd.isAfter(latest) ? itemEnd : latest;
      }, earliestStart);
      
      // 전체 경력 기간 (중복 제거)
      months = latestEnd.diff(earliestStart, 'month');
    }
    
    const highestRate = Math.max(...sorted.map(item => item.hourlyRate), 0);
    const latestRole = sorted.length ? sorted[sorted.length - 1] : null;

    return {
      sortedCareerData: sorted,
      totalYears: Math.floor(months / 12),
      remainingMonths: months % 12,
      highestHourlyRate: highestRate,
      totalPositions: sorted.length,
      currentRole: latestRole
    };
  }, [careerData]);

  const annualSalary = compensationData?.annualSalary || 0;
  const currentHourlyRate = compensationData?.hourlyRate || 0;
  const shiftHours = compensationData?.shiftHours || 12;

  // Loading state
  if (isCareerLoading || isCompensationLoading) {
    return (
      <div className="py-12">
        <LoadingState size="md" color="slate" text="Loading career history..." />
      </div>
    );
  }

  return (
    <div className={theme === 'light' 
      ? 'bg-white rounded-xl shadow-lg border border-gray-200' 
      : 'bg-slate-800 rounded-xl shadow-lg border border-slate-700'}>
      {/* Modals */}
      <Suspense fallback={null}>
        <AiRoleModal
          reason={aiReason}
          onClose={handleCloseAiModal}
          theme={theme}
        />
      </Suspense>
      <Suspense fallback={null}>
        <SalaryTrendModal
          visible={showTrend}
          data={trendData}
          onClose={handleCloseTrend}
          theme={theme}
        />
      </Suspense>

      {/* Header */}
      <Suspense fallback={
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-slate-700 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-48" />
            <div className="flex gap-4">
              <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-16" />
              <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-20" />
              <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-24" />
            </div>
          </div>
        </div>
      }>
        <CareerHeader
          theme={theme}
          totalPositions={totalPositions}
          totalYears={totalYears}
          highestHourlyRate={highestHourlyRate}
        />
      </Suspense>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Stats Grid */}
        <Suspense fallback={
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            {[1,2,3,4].map((i) => (
              <div key={i} className="p-4 bg-gray-100 dark:bg-slate-700 rounded-lg">
                <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-16 mb-2" />
                <div className="h-8 bg-gray-200 dark:bg-slate-600 rounded w-20" />
              </div>
            ))}
          </div>
        }>
          <CareerStatsGrid
            theme={theme}
            totalYears={totalYears}
            remainingMonths={remainingMonths}
            currentRole={currentRole}
            highestHourlyRate={highestHourlyRate}
            annualSalary={annualSalary}
            currentHourlyRate={currentHourlyRate}
            shiftHours={shiftHours}
          />
        </Suspense>

        {/* Control Panel - No Suspense needed for static import */}
        <CareerControlPanel
          formVisible={formVisible}
          setFormVisible={setFormVisible}
        />
        
        {/* Career Form */}
        <AnimatePresence>
          {formVisible && (
            <m.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Suspense fallback={
                <div className="space-y-4 animate-pulse">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-12 bg-gray-200 dark:bg-slate-700 rounded" />
                    <div className="h-12 bg-gray-200 dark:bg-slate-700 rounded" />
                    <div className="h-12 bg-gray-200 dark:bg-slate-700 rounded" />
                    <div className="h-12 bg-gray-200 dark:bg-slate-700 rounded" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded w-24" />
                    <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded w-28" />
                  </div>
                </div>
              }>
                <CompactCareerForm
                  onSubmit={handleAddCareer}
                  onCancel={handleCancel}
                  isSubmitting={addCareerMutation.isPending}
                  isLoaded={typeof google !== 'undefined' && typeof google.maps !== 'undefined'}
                />
              </Suspense>
            </m.div>
          )}
        </AnimatePresence>

        {/* Career Timeline */}
        <Suspense fallback={
          <div className="space-y-4 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-32 mb-4" />
            {[1,2,3].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-4 bg-gray-100 dark:bg-slate-700 rounded-lg">
                <div className="w-3 h-3 bg-gray-200 dark:bg-slate-600 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 dark:bg-slate-600 rounded w-48" />
                  <div className="h-4 bg-gray-200 dark:bg-slate-600 rounded w-64" />
                </div>
                <div className="h-8 bg-gray-200 dark:bg-slate-600 rounded w-16" />
              </div>
            ))}
          </div>
        }>
          <CareerTimeline
            theme={theme}
            careerData={careerData}
            filteredAndSortedCareerData={sortedCareerData}
            highestHourlyRate={highestHourlyRate}
            setFormVisible={setFormVisible}
            filterRole=""
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Suspense>

        {/* Progression Bar Chart */}
        <Suspense fallback={
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-40 mb-4" />
            <div className="h-64 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-end justify-between p-4">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="bg-gray-200 dark:bg-slate-600 rounded-t w-8" style={{height: `${20 + i * 15}%`}} />
              ))}
            </div>
          </div>
        }>
          <ProgressionBarChart careerData={careerData} theme={theme} />
        </Suspense>
      </div>
    </div>
  );
}

export default React.memo(CareerDashboard);
