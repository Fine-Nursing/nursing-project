import { useState, useCallback } from 'react';
import {
  validateSectionData,
  validateAllSections,
} from '../utils/validation';
import type { LocationData, JobDetailsData, PayrollData } from '../types';

export function useFormValidation(
  currentSection: number,
  locationData: LocationData,
  jobDetailsData: JobDetailsData,
  payrollData: PayrollData | null
) {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateCurrentSection = useCallback(() => {
    const errors = validateSectionData(
      currentSection,
      locationData,
      jobDetailsData,
      payrollData
    );
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [currentSection, locationData, jobDetailsData, payrollData]);

  const validateAllData = useCallback(() => {
    const allErrors = validateAllSections(
      locationData,
      jobDetailsData,
      payrollData
    );
    
    setFormErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  }, [locationData, jobDetailsData, payrollData]);

  const clearErrors = useCallback(() => {
    setFormErrors({});
  }, []);

  return {
    formErrors,
    validateCurrentSection,
    validateAllData,
    clearErrors,
  };
}