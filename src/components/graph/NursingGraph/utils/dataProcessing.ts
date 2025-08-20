import type { SpecialtyCompensation } from 'src/types/specialty';
import type { ProcessedDataItem, SalaryRangeValues } from '../types';

export const calculateSalaryRange = (compensations: SpecialtyCompensation[] | undefined): SalaryRangeValues => {
  if (!compensations || compensations.length === 0) {
    return { min: 70000, max: 120000 };
  }

  const values = compensations.map((item) => item.totalCompensation);
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
  selectedLocations: string[]
): ProcessedDataItem[] => {
  if (!compensations) return [];

  return compensations
    .filter((item) => {
      const matchesSalary =
        item.totalCompensation >= salaryRange[0] &&
        item.totalCompensation <= salaryRange[1];
      return matchesSalary;
    })
    .map((item) => ({
      specialty: item.specialty,
      'Base Pay': item.basePay,
      'Differential Pay': item.differentialPay,
      total: item.totalCompensation,
      state: selectedLocations[0] || 'ALL',
    }));
};