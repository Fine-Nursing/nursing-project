'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import toast from 'react-hot-toast';
import useCareerHistory from 'src/api/useCareerHistory';
import { useMyCompensation } from 'src/api/useCompensation';

import type { CareerItem, NewItemInput } from './types';
import CareerHeader from './CareerHeader';
import CareerStatsGrid from './CareerStatsGrid';
import CareerControlPanel from './CareerControlPanel';
import CareerForm from './CareerForm';
import CareerTimeline from './CareerTimeline';
import AiRoleModal from './AiRoleModal';
import SalaryTrendModal from './SalaryTrendModal';
import ProgressionBarChart from './ProgressionBarChart';

interface CareerDashboardProps {
  theme?: 'light' | 'dark';
}


function CareerDashboard({ theme = 'light' }: CareerDashboardProps) {
  // State
  const [careerData, setCareerData] = useState<CareerItem[]>([]);
  const [newItem, setNewItem] = useState<NewItemInput>({
    facility: '',
    role: '',
    specialty: '',
    startDate: new Date(),
    endDate: null,
    hourlyRate: '',
  });
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [aiReason, setAiReason] = useState<string | null>(null);
  const [showTrend, setShowTrend] = useState(false);
  const [trendData, setTrendData] = useState<{ month: string; hourlyRate: number }[]>([]);

  // API calls
  const { data: careerHistoryData, isLoading: isCareerLoading } = useCareerHistory();
  const { data: compensationData, isLoading: isCompensationLoading } = useMyCompensation();

  // Transform API data and remove duplicates
  useEffect(() => {
    if (careerHistoryData) {
      // Remove duplicates based on all fields except id
      const uniqueData = careerHistoryData.filter((item, index, self) => 
        index === self.findIndex((t) => (
          t.facility === item.facility &&
          t.role === item.role &&
          t.specialty === item.specialty &&
          t.startDate === item.startDate &&
          t.endDate === item.endDate &&
          t.hourlyRate === item.hourlyRate
        ))
      );
      
      const transformedData = uniqueData.map((item, index) => ({
        id: index + 1,
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
  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };
  const handleChangeStartDate = (date: Date | null) => {
    setNewItem((prev) => ({ ...prev, startDate: date }));
  };
  const handleChangeEndDate = (date: Date | null) => {
    setNewItem((prev) => ({ ...prev, endDate: date }));
  };

  const handleAdd = useCallback(() => {
    if (!newItem.facility || !newItem.role) {
      toast.error('Facility & Role are required!');
      return;
    }
    const nextId = careerData.length
      ? Math.max(...careerData.map((d) => d.id)) + 1
      : 1;
    setCareerData((prev) => [
      ...prev,
      {
        id: nextId,
        facility: newItem.facility,
        role: newItem.role,
        specialty: newItem.specialty,
        startDate: newItem.startDate || new Date(),
        endDate: newItem.endDate || null,
        hourlyRate: parseFloat(newItem.hourlyRate || '0'),
      },
    ]);
    // reset
    setNewItem({
      facility: '',
      role: '',
      specialty: '',
      startDate: new Date(),
      endDate: null,
      hourlyRate: '',
    });
    setFormVisible(false);
  }, [careerData, newItem]);

  const handleEdit = (id: number) => {
    const itemToEdit = careerData.find((item) => item.id === id);
    if (itemToEdit) {
      setNewItem({
        facility: itemToEdit.facility,
        role: itemToEdit.role,
        specialty: itemToEdit.specialty || '',
        startDate: itemToEdit.startDate,
        endDate: itemToEdit.endDate,
        hourlyRate: itemToEdit.hourlyRate.toString(),
      });
      setEditingItemId(id);
      setFormVisible(true);
    }
  };

  const handleUpdate = () => {
    if (editingItemId === null) return;

    setCareerData((prev) =>
      prev.map((item) => {
        if (item.id === editingItemId) {
          return {
            ...item,
            facility: newItem.facility,
            role: newItem.role,
            specialty: newItem.specialty,
            startDate: newItem.startDate || new Date(),
            endDate: newItem.endDate,
            hourlyRate: parseFloat(newItem.hourlyRate || '0'),
          };
        }
        return item;
      })
    );

    setNewItem({
      facility: '',
      role: '',
      specialty: '',
      startDate: new Date(),
      endDate: null,
      hourlyRate: '',
    });
    setEditingItemId(null);
    setFormVisible(false);
  };

  const handleCancel = () => {
    setNewItem({
      facility: '',
      role: '',
      specialty: '',
      startDate: new Date(),
      endDate: null,
      hourlyRate: '',
    });
    setEditingItemId(null);
    setFormVisible(false);
  };

  const handleDelete = (id: number) => {
    // TODO: Replace with a proper confirmation modal
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to delete this career entry?')) {
      setCareerData((prev) => prev.filter((item) => item.id !== id));
      toast.success('Career entry deleted successfully');
    }
  };

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

  const handleAiSuggest = () => {
    const { role, specialty, reason } = getAiRoleRecommendation();
    setNewItem((prev) => ({ ...prev, role, specialty }));
    setAiReason(reason);
  };

  const handleSalaryTrend = () => {
    setTrendData(getAiSalaryTrend());
    setShowTrend(true);
  };

  const handleCloseAiModal = () => setAiReason(null);
  const handleCloseTrend = () => setShowTrend(false);

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
    const currentRole = sorted.length ? sorted[sorted.length - 1] : null;

    return {
      sortedCareerData: sorted,
      totalYears: Math.floor(months / 12),
      remainingMonths: months % 12,
      highestHourlyRate: highestRate,
      totalPositions: sorted.length,
      currentRole
    };
  }, [careerData]);

  const annualSalary = compensationData?.annualSalary || 0;

  // Loading state
  if (isCareerLoading || isCompensationLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-8 h-8 border-t-2 border-slate-400 border-solid rounded-full animate-spin" />
        <p className="mt-2 text-sm font-medium text-slate-600">
          Loading career history...
        </p>
      </div>
    );
  }

  return (
    <div className={theme === 'light' 
      ? 'bg-white rounded-xl shadow-lg border border-gray-200' 
      : 'bg-slate-800 rounded-xl shadow-lg border border-slate-700'}>
      {/* Modals */}
      <AiRoleModal
        reason={aiReason}
        onClose={handleCloseAiModal}
        theme={theme}
      />
      <SalaryTrendModal
        visible={showTrend}
        data={trendData}
        onClose={handleCloseTrend}
        theme={theme}
      />

      {/* Header */}
      <CareerHeader
        theme={theme}
        totalPositions={totalPositions}
        totalYears={totalYears}
        highestHourlyRate={highestHourlyRate}
      />

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Stats Grid */}
        <CareerStatsGrid
          theme={theme}
          totalYears={totalYears}
          remainingMonths={remainingMonths}
          currentRole={currentRole}
          highestHourlyRate={highestHourlyRate}
          annualSalary={annualSalary}
        />

        {/* Control Panel */}
        <CareerControlPanel
          theme={theme}
          formVisible={formVisible}
          setFormVisible={setFormVisible}
        />
        
        {/* Career Form */}
        <AnimatePresence>
          {formVisible && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CareerForm
                newItem={newItem}
                onChangeText={handleChangeText}
                onChangeStartDate={handleChangeStartDate}
                onChangeEndDate={handleChangeEndDate}
                onAdd={editingItemId ? handleUpdate : handleAdd}
                onAiSuggest={handleAiSuggest}
                onSalaryTrend={handleSalaryTrend}
                editingItemId={editingItemId}
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className={`px-4 py-2 border rounded-lg ${theme === 'light' ? 'border-gray-300 text-gray-600 hover:bg-gray-50' : 'border-slate-500 text-gray-300 hover:bg-slate-600'} text-sm`}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Career Timeline */}
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

        {/* Progression Bar Chart */}
        <ProgressionBarChart careerData={careerData} theme={theme} />
      </div>
    </div>
  );
}

export default React.memo(CareerDashboard);
