import type { SpecialtyCompensation } from 'src/types/specialty';
import type { ProcessedDataItem, SalaryRangeValues } from '../types';
import { CompensationCalculator } from 'src/utils/compensation';

// Convert annual salary to hourly wage using proper shift hours
const annualToHourly = (annualSalary: number, shiftHours: number = 12): number => {
  return CompensationCalculator.annualToHourly(annualSalary, shiftHours);
};

export const calculateSalaryRange = (compensations: SpecialtyCompensation[] | undefined): SalaryRangeValues => {
  if (!compensations || compensations.length === 0) {
    // Default hourly range: $35-60/hour (roughly equivalent to 70k-120k annually)
    return { min: 35, max: 60 };
  }

  // Convert annual compensation to hourly
  const values = compensations.map((item) => annualToHourly(item.totalCompensation));
  const min = Math.min(...values);
  const max = Math.max(...values);

  const padding = (max - min) * 0.1;
  return {
    min: Math.floor(min - padding),
    max: Math.ceil(max + padding),
  };
};

export const processCompensationData = (
  compensations: SpecialtyCompensation[] | undefined,
  salaryRange: [number, number],
  selectedLocations: string[],
  shiftHours: number = 12
): ProcessedDataItem[] => {
  if (!compensations) return [];

  return compensations
    .filter((item) => {
      // Convert annual compensation to hourly for comparison using proper shift hours
      const hourlyTotal = annualToHourly(item.totalCompensation, shiftHours);
      const matchesSalary =
        hourlyTotal >= salaryRange[0] &&
        hourlyTotal <= salaryRange[1];
      return matchesSalary;
    })
    .map((item) => ({
      specialty: item.specialty,
      'Base Pay': item.basePay, // Keep as annual, will be converted in Chart component
      'Differential Pay': item.differentialPay, // Keep as annual, will be converted in Chart component
      total: item.totalCompensation, // Keep as annual, will be converted in Chart component
      state: selectedLocations[0] || 'ALL',
      shiftHours, // Include shift hours for Chart component
    }));
};