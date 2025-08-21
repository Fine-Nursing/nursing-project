import { useState, useCallback } from 'react';
import type { ExperienceGroup } from 'src/types/common';

export function useFilterState() {
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<ExperienceGroup[]>([]);
  const [salaryRange, setSalaryRangeState] = useState<[number, number]>([70000, 120000]);
  
  const setSalaryRange = useCallback((range: [number, number]) => {
    setSalaryRangeState(range);
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedLocations([]);
    setSelectedExperience([]);
  }, []);

  const removeLocation = useCallback((locationCode: string) => {
    setSelectedLocations((prev) => prev.filter((code) => code !== locationCode));
  }, []);

  const removeExperience = useCallback((exp: ExperienceGroup) => {
    setSelectedExperience((prev) => prev.filter((e) => e !== exp));
  }, []);

  return {
    selectedLocations,
    setSelectedLocations,
    selectedExperience,
    setSelectedExperience,
    salaryRange,
    setSalaryRange,
    clearAllFilters,
    removeLocation,
    removeExperience,
  };
}