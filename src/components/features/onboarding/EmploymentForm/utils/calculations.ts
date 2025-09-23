import type { IndividualDifferentialItem } from 'src/types/onboarding';
import type { DifferentialTotals } from '../types';
import { CompensationCalculator } from 'src/utils/compensation';

export const calculateTotalDifferentials = (differentials: IndividualDifferentialItem[]): DifferentialTotals => {
  // Use new unified calculation method
  return CompensationCalculator.legacyCalculateTotalDifferentials(differentials);
};

export const formatCurrency = (amount: number, unit: 'hourly' | 'annual'): string => {
  const decimals = unit === 'hourly' ? 2 : 0;
  const formatted = CompensationCalculator.formatCurrency(amount, decimals);

  return unit === 'hourly' ? `${formatted}/hr` : `${formatted}/year`;
};

export const validateCompensationSection = (formData: any): boolean => 
  // Compensation section only needs base pay info to be valid
  // Other fields like differentials and union status are optional
   true // Always valid since all fields in compensation are optional
;