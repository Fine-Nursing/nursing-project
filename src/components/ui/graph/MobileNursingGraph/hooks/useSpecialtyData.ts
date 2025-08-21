import { useState, useMemo } from 'react';
import type { ExperienceGroup } from 'src/types/common';
import { useSpecialtyAverageCompensation } from 'src/api/useSpecialties';
import type { StatsData } from '../types';

export function useSpecialtyData() {
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
  const stats = useMemo<StatsData | null>(() => {
    if (!sortedSpecialties.length) return null;
    
    const compensations = sortedSpecialties.map(s => s.avgCompensation);
    const max = Math.max(...compensations);
    const min = Math.min(...compensations);
    const avg = Math.round(compensations.reduce((a, b) => a + b, 0) / compensations.length);
    
    return { max, min, avg };
  }, [sortedSpecialties]);
  
  const selectedSpecialtyData = sortedSpecialties.find(s => s.specialty === selectedSpecialty);

  return {
    searchTerm,
    setSearchTerm,
    selectedExperience,
    setSelectedExperience,
    selectedSpecialty,
    setSelectedSpecialty,
    viewMode,
    setViewMode,
    isLoading,
    sortedSpecialties,
    stats,
    selectedSpecialtyData,
  };
}