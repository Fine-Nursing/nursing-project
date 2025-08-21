import type { IndividualDifferentialItem } from 'src/types/onboarding';
import type { DifferentialTotals } from '../types';

export const calculateTotalDifferentials = (differentials: IndividualDifferentialItem[]): DifferentialTotals => 
  differentials.reduce(
    (totals, diff) => {
      if (diff.unit === 'hourly') {
        totals.hourly += diff.amount;
      } else {
        totals.annual += diff.amount;
      }
      return totals;
    },
    { hourly: 0, annual: 0 }
  );

export const formatCurrency = (amount: number, unit: 'hourly' | 'annual'): string => {
  const formatted = amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: unit === 'hourly' ? 2 : 0,
    maximumFractionDigits: unit === 'hourly' ? 2 : 0,
  });
  
  return unit === 'hourly' ? `${formatted}/hr` : `${formatted}/year`;
};

export const validateCompensationSection = (formData: any): boolean => {
  return !!(
    formData.baseSalary &&
    formData.salaryUnit &&
    formData.shiftType &&
    formData.nurseName &&
    formData.experienceInSpecialty !== undefined &&
    formData.nurseToPatientRatio
  );
};