'use client';

import React, { useState, useMemo } from 'react';
import { Search, TrendingUp, TrendingDown, Minus, ChevronRight, BarChart3, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ExperienceGroup } from 'src/types/common';
import { useSpecialtyAverageCompensation } from 'src/api/useSpecialties';

// Minimalist Chart Bar - Inspired by Apple Health/Google Fit
function MiniBarChart({ 
  value, 
  maxValue, 
  label,
  highlighted = false 
}: { 
  value: number; 
  maxValue: number; 
  label: string;
  highlighted?: boolean;
}) {
  const percentage = (value / maxValue) * 100;
  
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 dark:text-zinc-500 w-8 text-right">
        {label}
      </span>
      <div className="flex-1 h-6 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full rounded-full ${
            highlighted 
              ? 'bg-gradient-to-r from-purple-500 to-purple-600' 
              : 'bg-gray-300 dark:bg-zinc-600'
          }`}
        />
      </div>
      <span className={`text-sm font-medium w-12 ${
        highlighted ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-zinc-400'
      }`}>
        ${value}
      </span>
    </div>
  );
}

// Specialty List Item - Clean and Scannable
function SpecialtyListItem({ 
  specialty, 
  data, 
  rank,
  onClick,
  isSelected 
}: { 
  specialty: string;
  data: any;
  rank: number;
  onClick: () => void;
  isSelected: boolean;
}) {
  const avgCompensation = data?.averageCompensation || 0;
  const trend = rank <= 3 ? 'up' : rank >= 8 ? 'down' : 'stable';
  
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full p-4 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 last:border-b-0 transition-colors ${
        isSelected ? 'bg-purple-50 dark:bg-purple-900/20' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Rank Badge */}
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
            rank <= 3 ? 'bg-green-100 text-green-700' :
            rank <= 6 ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {rank}
          </div>
          
          {/* Specialty Name */}
          <div className="text-left">
            <p className="font-medium text-sm text-gray-900 dark:text-white">
              {specialty}
            </p>
            <p className="text-xs text-gray-500 dark:text-zinc-500">
              {data?.count || 0} positions
            </p>
          </div>
        </div>
        
        {/* Compensation & Trend */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-semibold text-gray-900 dark:text-white">
              ${avgCompensation}
            </p>
            <p className="text-xs text-gray-500 dark:text-zinc-500">avg/hr</p>
          </div>
          
          {/* Trend Indicator */}
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            trend === 'up' ? 'bg-green-100' :
            trend === 'down' ? 'bg-red-100' :
            'bg-gray-100'
          }`}>
            {trend === 'up' ? <TrendingUp size={14} className="text-green-600" /> :
             trend === 'down' ? <TrendingDown size={14} className="text-red-600" /> :
             <Minus size={14} className="text-gray-400" />}
          </div>
          
          <ChevronRight size={16} className="text-gray-400" />
        </div>
      </div>
    </motion.button>
  );
}

// Experience Level Selector - Pill Style
function ExperienceTabs({ 
  selected, 
  onChange 
}: { 
  selected: ExperienceGroup[];
  onChange: (levels: ExperienceGroup[]) => void;
}) {
  const levels: { id: ExperienceGroup; label: string; emoji: string }[] = [
    { id: 'beginner', label: 'Entry', emoji: '🌱' },
    { id: 'junior', label: 'Junior', emoji: '📘' },
    { id: 'experienced', label: 'Mid', emoji: '💼' },
    { id: 'senior', label: 'Senior', emoji: '👑' },
  ];
  
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar">
      {levels.map(level => {
        const isSelected = selected.includes(level.id);
        return (
          <button
            key={level.id}
            type="button"
            onClick={() => {
              if (isSelected) {
                onChange(selected.filter(l => l !== level.id));
              } else {
                onChange([...selected, level.id]);
              }
            }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              isSelected 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400'
            }`}
          >
            <span className="mr-1">{level.emoji}</span>
            {level.label}
          </button>
        );
      })}
    </div>
  );
}

export default function MobileNursingGraphV2() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExperience, setSelectedExperience] = useState<ExperienceGroup[]>(['experienced']);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');
  
  // Fetch compensation data
  const { data: compensationData, isLoading } = useSpecialtyAverageCompensation({
    search: searchTerm || undefined,
    experienceGroups: selectedExperience,
  });
  
  // Process and sort specialties
  const sortedSpecialties = useMemo(() => {
    if (!compensationData) return [];
    
    return Object.entries(compensationData)
      .map(([specialty, data]: [string, any]) => ({
        specialty,
        data,
        avgCompensation: data.averageCompensation || 0,
      }))
      .sort((a, b) => b.avgCompensation - a.avgCompensation)
      .slice(0, 15); // Top 15 specialties
  }, [compensationData]);
  
  // Calculate statistics
  const stats = useMemo(() => {
    if (!sortedSpecialties.length) return null;
    
    const compensations = sortedSpecialties.map(s => s.avgCompensation);
    const max = Math.max(...compensations);
    const min = Math.min(...compensations);
    const avg = Math.round(compensations.reduce((a, b) => a + b, 0) / compensations.length);
    
    return { max, min, avg };
  }, [sortedSpecialties]);
  
  const selectedSpecialtyData = sortedSpecialties.find(s => s.specialty === selectedSpecialty);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black p-4">
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-white dark:bg-zinc-900 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            Specialty Analysis
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-500">
            Average compensation by specialty
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search specialties..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-zinc-800 rounded-xl text-sm placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
        
        {/* Experience Filter */}
        <div className="px-4 pb-3">
          <ExperienceTabs 
            selected={selectedExperience}
            onChange={setSelectedExperience}
          />
        </div>
        
        {/* View Toggle */}
        <div className="px-4 pb-3 flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'list' 
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' 
                : 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400'
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('chart')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'chart' 
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' 
                : 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400'
            }`}
          >
            Chart View
          </button>
        </div>
      </div>
      
      {/* Stats Summary */}
      {stats && (
        <div className="grid grid-cols-3 gap-2 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 dark:text-zinc-500 mb-1">Highest</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">${stats.max}</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 dark:text-zinc-500 mb-1">Average</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">${stats.avg}</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 dark:text-zinc-500 mb-1">Entry</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">${stats.min}</p>
          </div>
        </div>
      )}
      
      {/* Content Area */}
      <div className="bg-white dark:bg-zinc-900 rounded-t-2xl min-h-screen">
        {viewMode === 'list' ? (
          // List View
          <div>
            {sortedSpecialties.map((item, index) => (
              <SpecialtyListItem
                key={item.specialty}
                specialty={item.specialty}
                data={item.data}
                rank={index + 1}
                onClick={() => setSelectedSpecialty(item.specialty)}
                isSelected={selectedSpecialty === item.specialty}
              />
            ))}
          </div>
        ) : (
          // Chart View
          <div className="p-4 space-y-3">
            {sortedSpecialties.map((item, index) => (
              <MiniBarChart
                key={item.specialty}
                value={item.avgCompensation}
                maxValue={stats?.max || 100}
                label={item.specialty.slice(0, 3).toUpperCase()}
                highlighted={index < 3}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Detail Modal */}
      <AnimatePresence>
        {selectedSpecialty && selectedSpecialtyData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setSelectedSpecialty(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white dark:bg-zinc-900 rounded-t-3xl w-full max-h-[70vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-gray-300 dark:bg-zinc-700 rounded-full mx-auto mt-3 mb-4" />
              
              <div className="px-6 pb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  {selectedSpecialty}
                </h2>
                
                {/* Compensation Breakdown */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600 dark:text-zinc-400">Average Hourly Rate</span>
                    <DollarSign size={18} className="text-purple-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    ${selectedSpecialtyData.avgCompensation}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-zinc-400">
                    Based on {selectedSpecialtyData.data.count || 0} data points
                  </p>
                </div>
                
                {/* Experience Breakdown */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">By Experience Level</h3>
                  {selectedSpecialtyData.data.byExperience && Object.entries(selectedSpecialtyData.data.byExperience).map(([level, value]: [string, any]) => (
                    <div key={level} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-zinc-800">
                      <span className="text-sm text-gray-600 dark:text-zinc-400 capitalize">{level}</span>
                      <span className="font-medium text-gray-900 dark:text-white">${value.average || 0}/hr</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}