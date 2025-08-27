'use client';

import React, { memo } from 'react';
import { m } from 'framer-motion';
import type { CompensationAnalysisProps } from './types';
import { calculateMonthlyCompensation } from './utils';
import { useCompensationState } from './hooks';
import {
  Header,
  PrimaryCompensationDisplay,
  StatsGrid,
  DifferentialBreakdown,
  AIInsights,
  ActionButtons
} from './components';

function CompensationAnalysis({
  userProfile,
  theme,
  getCompensationInsight,
  calculatePotentialDifferentials,
}: CompensationAnalysisProps) {
  const {
    isEditing,
    setIsEditing,
    editedProfile,
    setEditedProfile,
    handleSave,
    handleCancel
  } = useCompensationState(userProfile);

  const {
    monthlyBase,
    nightDifferential,
    weekendDifferential,
    specialtyDifferential,
    totalMonthlyDifferentials,
    totalMonthly,
    differentialAmounts
  } = calculateMonthlyCompensation(
    editedProfile?.annualSalary || 0, 
    editedProfile?.differentials || []
  );

  const potentialDifferentials = calculatePotentialDifferentials();

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${
        theme === 'light' ? 'bg-white' : 'bg-slate-800'
      } rounded-xl shadow-lg border ${
        theme === 'light' ? 'border-gray-200' : 'border-slate-700'
      }`}
    >
      <Header
        theme={theme}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />

      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        <PrimaryCompensationDisplay
          theme={theme}
          totalMonthly={totalMonthly}
          monthlyBase={monthlyBase}
          totalMonthlyDifferentials={totalMonthlyDifferentials}
        />

        <StatsGrid
          theme={theme}
          isEditing={isEditing}
          editedProfile={editedProfile}
          setEditedProfile={setEditedProfile}
          monthlyBase={monthlyBase}
        />

        <DifferentialBreakdown
          theme={theme}
          isEditing={isEditing}
          editedProfile={editedProfile}
          setEditedProfile={setEditedProfile}
          differentialAmounts={differentialAmounts}
        />

        <AIInsights
          theme={theme}
          getCompensationInsight={getCompensationInsight}
          potentialDifferentials={potentialDifferentials}
        />

        <ActionButtons
          theme={theme}
          isEditing={isEditing}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </m.div>
  );
}

export default memo(CompensationAnalysis);