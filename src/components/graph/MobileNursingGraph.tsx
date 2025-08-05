'use client';

import React, { useState, useMemo } from 'react';
import { Search, MapPin, TrendingUp, TrendingDown, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ExperienceGroup } from 'src/types/common';
import {
  useSpecialtyAverageCompensation,
} from 'src/api/useSpecialties';
import { useStates } from 'src/api/useLocations';

interface MobileFilterPanelProps {
  selectedLocations: string[];
  setSelectedLocations: (locations: string[]) => void;
  selectedExperience: ExperienceGroup[];
  setSelectedExperience: (experience: ExperienceGroup[]) => void;
  states: any;
  onClose: () => void;
}

function MobileFilterPanel({
  selectedLocations,
  setSelectedLocations,
  selectedExperience,
  setSelectedExperience,
  states,
  onClose,
}: MobileFilterPanelProps) {
  const experienceOptions: { value: ExperienceGroup; label: string }[] = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'junior', label: 'Junior' },
    { value: 'experienced', label: 'Experienced' },
    { value: 'senior', label: 'Senior' },
  ];

  const popularStates = ['CA', 'TX', 'NY', 'FL', 'PA'];

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25 }}
      className="fixed inset-0 bg-white z-50 overflow-y-auto"
    >
      <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button onClick={onClose} className="p-2">
          <X size={20} />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Experience Level */}
        <div>
          <h4 className="font-medium mb-3">Experience Level</h4>
          <div className="grid grid-cols-2 gap-2">
            {experienceOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setSelectedExperience(
                    selectedExperience.includes(option.value)
                      ? selectedExperience.filter((e) => e !== option.value)
                      : [...selectedExperience, option.value]
                  );
                }}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                  selectedExperience.includes(option.value)
                    ? 'bg-purple-100 border-purple-500 text-purple-700'
                    : 'border-gray-200 text-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Locations */}
        <div>
          <h4 className="font-medium mb-3">Popular Locations</h4>
          <div className="grid grid-cols-3 gap-2">
            {popularStates.map((stateCode) => {
              const stateName = states?.find((s: any) => s.code === stateCode)?.name || stateCode;
              return (
                <button
                  key={stateCode}
                  onClick={() => {
                    setSelectedLocations(
                      selectedLocations.includes(stateCode)
                        ? selectedLocations.filter((s) => s !== stateCode)
                        : [...selectedLocations, stateCode]
                    );
                  }}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    selectedLocations.includes(stateCode)
                      ? 'bg-purple-100 border-purple-500 text-purple-700'
                      : 'border-gray-200 text-gray-700'
                  }`}
                >
                  {stateName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Clear Filters */}
        {(selectedLocations.length > 0 || selectedExperience.length > 0) && (
          <button
            onClick={() => {
              setSelectedLocations([]);
              setSelectedExperience([]);
            }}
            className="w-full py-3 text-purple-600 font-medium"
          >
            Clear All Filters
          </button>
        )}
      </div>

      <div className="sticky bottom-0 bg-white border-t p-4">
        <button
          onClick={onClose}
          className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium"
        >
          Apply Filters
        </button>
      </div>
    </motion.div>
  );
}

function SpecialtyCard({ 
  specialty, 
  data, 
  rank,
  trend 
}: { 
  specialty: string; 
  data: any; 
  rank: number;
  trend?: 'up' | 'down' | 'stable';
}) {
  const trendIcon = trend === 'up' ? <TrendingUp size={16} className="text-green-600" /> :
                    trend === 'down' ? <TrendingDown size={16} className="text-red-600" /> :
                    null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.05 }}
      className="bg-white border rounded-xl p-4 shadow-sm"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold text-sm">
            {rank}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{specialty}</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {data.state === 'ALL' ? 'National Average' : data.state}
            </p>
          </div>
        </div>
        {trendIcon}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Total Pay</p>
          <p className="text-lg font-bold text-emerald-600">
            ${Math.round(data.totalCompensation / 1000)}k
          </p>
          <p className="text-xs text-gray-500 mt-1">/year</p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Hourly</p>
          <p className="text-lg font-bold text-gray-800">
            ${Math.round(data.totalCompensation / 2080)}
          </p>
          <p className="text-xs text-gray-500 mt-1">/hour</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-gray-600">
          Base: ${Math.round(data.basePay / 1000)}k
        </span>
        <span className="text-purple-600 font-medium">
          +${Math.round(data.differentialPay / 1000)}k diff
        </span>
      </div>
    </motion.div>
  );
}

export default function MobileNursingGraph() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<ExperienceGroup[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'top' | 'search'>('top');

  const { data: states } = useStates();

  const {
    data: compensations,
    isLoading,
  } = useSpecialtyAverageCompensation({
    states: selectedLocations.length > 0 ? selectedLocations : undefined,
    experienceGroups: selectedExperience.length > 0 ? selectedExperience : undefined,
    search: searchTerm || undefined,
    sortBy: 'total',
    sortOrder: 'desc',
  });

  const topSpecialties = useMemo(() => {
    if (!compensations) return [];
    return compensations.slice(0, 10);
  }, [compensations]);

  const activeFiltersCount = selectedLocations.length + selectedExperience.length;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-2">
            Nursing Specialties
          </h2>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search specialties..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setViewMode(e.target.value ? 'search' : 'top');
              }}
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(true)}
            className="mt-3 flex items-center gap-2 text-sm text-purple-600 font-medium"
          >
            <Filter size={16} />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Active Filters */}
          {(selectedLocations.length > 0 || selectedExperience.length > 0) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedLocations.map((loc) => (
                <span
                  key={loc}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
                >
                  <MapPin size={10} />
                  {loc}
                  <button
                    onClick={() => setSelectedLocations(selectedLocations.filter(l => l !== loc))}
                    className="ml-1"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              {selectedExperience.map((exp) => (
                <span
                  key={exp}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                >
                  {exp}
                  <button
                    onClick={() => setSelectedExperience(selectedExperience.filter(e => e !== exp))}
                    className="ml-1"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {topSpecialties.length > 0 
                    ? `$${Math.round(topSpecialties[0].totalCompensation / 1000)}k`
                    : '-'
                  }
                </p>
                <p className="text-xs text-gray-600 mt-1">Highest Paying</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-gray-800">
                  {compensations?.length || 0}
                </p>
                <p className="text-xs text-gray-600 mt-1">Specialties Found</p>
              </div>
            </div>

            {/* Specialty List */}
            <div className="space-y-3">
              {viewMode === 'top' && (
                <h3 className="font-medium text-gray-700 mb-2">Top Paying Specialties</h3>
              )}
              {topSpecialties.map((item, index) => (
                <SpecialtyCard
                  key={item.specialty}
                  specialty={item.specialty}
                  data={item}
                  rank={index + 1}
                  trend={index < 3 ? 'up' : index > 7 ? 'down' : 'stable'}
                />
              ))}
            </div>

            {compensations && compensations.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No specialties found</p>
                <p className="text-sm text-gray-500 mt-2">Try adjusting your filters</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <MobileFilterPanel
            selectedLocations={selectedLocations}
            setSelectedLocations={setSelectedLocations}
            selectedExperience={selectedExperience}
            setSelectedExperience={setSelectedExperience}
            states={states}
            onClose={() => setShowFilters(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}