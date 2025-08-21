import { useMemo } from 'react';
import { useNursingTable } from 'src/api/useNursingTable';
import type { NursingTableParams } from 'src/api/useNursingTable';
import type { ExperienceGroup } from 'src/types/common';
import type { CalculatorResult } from '../types';

interface UseSalaryCalculatorProps {
  selectedSpecialty: string;
  selectedLocation: string;
  selectedExperience: string;
  showCalculatorResult: boolean;
}

export function useSalaryCalculator({
  selectedSpecialty,
  selectedLocation,
  selectedExperience,
  showCalculatorResult
}: UseSalaryCalculatorProps) {
  const calculatorParams: NursingTableParams = {};
  if (selectedSpecialty) calculatorParams.specialties = [selectedSpecialty];
  if (selectedLocation) calculatorParams.states = [selectedLocation];
  if (selectedExperience) calculatorParams.experienceGroups = [selectedExperience as ExperienceGroup];
  
  const { data: filteredData, isError: isFilterError } = useNursingTable(
    Object.keys(calculatorParams).length > 0 ? calculatorParams : { limit: 100 },
    {
      enabled: showCalculatorResult,
      refetchOnWindowFocus: false,
      refetchOnMount: false
    }
  );

  const calculatorResult = useMemo((): CalculatorResult | null => {
    if (!showCalculatorResult) return null;
    
    if (filteredData?.data?.length) {
      const salaries = filteredData.data.map(d => d.compensation.hourly);
      const avg = Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length);
      const min = Math.min(...salaries);
      const max = Math.max(...salaries);
      const annual = Math.round(avg * 2080);
      return { min, avg, max, annual, dataPoints: filteredData.meta.total };
    }
    
    if (isFilterError && (selectedSpecialty || selectedLocation || selectedExperience)) {
      let baseRate = 75;
      if (selectedLocation === 'CA' || selectedLocation === 'NY') baseRate += 10;
      if (selectedLocation === 'TX' || selectedLocation === 'FL') baseRate -= 5;
      if (selectedSpecialty === 'ICU' || selectedSpecialty === 'Emergency') baseRate += 5;
      if (selectedSpecialty === 'NICU') baseRate += 8;
      if (selectedExperience === 'beginner') baseRate -= 10;
      if (selectedExperience === 'senior') baseRate += 15;
      if (selectedExperience === 'experienced') baseRate += 8;
      
      return {
        min: Math.round(baseRate - 15),
        avg: Math.round(baseRate),
        max: Math.round(baseRate + 20),
        annual: Math.round(baseRate * 2080),
        dataPoints: 0
      };
    }
    
    return null;
  }, [filteredData, showCalculatorResult, isFilterError, selectedSpecialty, selectedLocation, selectedExperience]);

  return calculatorResult;
}