import { CompensationCalculator } from 'src/utils/compensation';
import type { DifferentialDetail } from './types';

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 10000) {
    return `${Math.round(num / 1000)}k`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  // For smaller numbers, round to 2 decimal places if it's a decimal
  if (num % 1 !== 0) {
    return num.toFixed(2);
  }
  return num.toLocaleString();
};

export const calculateMonthlyCompensation = (
  annualSalary: number,
  differentials: DifferentialDetail[] = [],
  shiftHours: number = 12
) => {
  // Use enhanced shift-aware conversion: annual to hourly to monthly
  const hourlyRate = CompensationCalculator.annualToHourly(annualSalary, shiftHours);
  const monthlyBase = CompensationCalculator.hourlyToMonthly(hourlyRate, shiftHours);

  // Use BE-calculated monthlyAmount if available, otherwise fallback to legacy calculation
  const differentialAmounts = differentials.map(diff => ({
    ...diff,
    monthlyAmount: diff.monthlyAmount || (diff.estimatedHours ? diff.value * diff.estimatedHours : 0)
  }));

  const totalMonthlyDifferentials = differentialAmounts.reduce(
    (sum, diff) => sum + diff.monthlyAmount,
    0
  );
  const totalMonthly = monthlyBase + totalMonthlyDifferentials;

  // Legacy support for old structure - use type matching (case-insensitive)
  const nightDifferential = differentialAmounts.find(
    d => d.type.toLowerCase().includes('night')
  )?.monthlyAmount || 0;

  const weekendDifferential = differentialAmounts.find(
    d => d.type.toLowerCase().includes('weekend')
  )?.monthlyAmount || 0;

  const specialtyDifferential = differentialAmounts
    .filter(
      d => !d.type.toLowerCase().includes('night') &&
           !d.type.toLowerCase().includes('weekend')
    )
    .reduce((sum, d) => sum + d.monthlyAmount, 0);

  return {
    monthlyBase,
    nightDifferential,
    weekendDifferential,
    specialtyDifferential,
    totalMonthlyDifferentials,
    totalMonthly,
    differentialAmounts,
    shiftHours,
    effectiveHourlyRate: CompensationCalculator.monthlyToHourly(totalMonthly, shiftHours)
  };
};