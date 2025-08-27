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
  return num.toLocaleString();
};

import type { DifferentialDetail } from './types';

export const calculateMonthlyCompensation = (
  annualSalary: number,
  differentials: DifferentialDetail[] = []
) => {
  const monthlyBase = Math.round(annualSalary / 12);
  
  // Calculate each differential's monthly amount
  const differentialAmounts = differentials.map(diff => ({
    ...diff,
    monthlyAmount: diff.value * diff.estimatedHours
  }));

  const totalMonthlyDifferentials = differentialAmounts.reduce(
    (sum, diff) => sum + diff.monthlyAmount, 
    0
  );
  const totalMonthly = monthlyBase + totalMonthlyDifferentials;

  // Legacy support for old structure
  const nightDifferential = differentialAmounts.find(d => d.type === 'night')?.monthlyAmount || 0;
  const weekendDifferential = differentialAmounts.find(d => d.type === 'weekend')?.monthlyAmount || 0;
  const specialtyDifferential = differentialAmounts
    .filter(d => d.type !== 'night' && d.type !== 'weekend')
    .reduce((sum, d) => sum + d.monthlyAmount, 0);

  return {
    monthlyBase,
    nightDifferential,
    weekendDifferential,
    specialtyDifferential,
    totalMonthlyDifferentials,
    totalMonthly,
    differentialAmounts
  };
};