'use client';

import React from 'react';
import { motion } from 'framer-motion';
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

export default function CompensationAnalysis({
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
    totalMonthly
  } = calculateMonthlyCompensation(editedProfile.annualSalary, editedProfile.differentials);

  const potentialDifferentials = calculatePotentialDifferentials();

  return (
    <motion.div
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
          nightDifferential={nightDifferential}
          weekendDifferential={weekendDifferential}
          specialtyDifferential={specialtyDifferential}
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
    </motion.div>
  );
}