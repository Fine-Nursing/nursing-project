import type { CareerItem } from '../../types';
import type { ChartDataItem } from '../types';

export const prepareChartData = (data: CareerItem[]): ChartDataItem[] => data.map((item, index) => ({
    ...item,
    xLabel: item.role.length > 8 ? `${item.role.slice(0, 8)}...` : item.role,
    index: index + 1,
  }));

export const calculateGrowthRate = (data: ChartDataItem[]): string => {
  if (data.length <= 1) return '0%';

  const firstRate = data[0].hourlyRate;
  const lastRate = data[data.length - 1].hourlyRate;
  const growthRate = ((lastRate - firstRate) / firstRate) * 100;

  // Add + sign only for positive values, negative values already have -
  if (growthRate > 0) {
    return `+${growthRate.toFixed(1)}%`;
  }
  return `${growthRate.toFixed(1)}%`;
};

export const calculateRateIncrease = (data: ChartDataItem[]): string => {
  if (data.length <= 1) return '$0/hr';

  const firstRate = data[0].hourlyRate;
  const lastRate = data[data.length - 1].hourlyRate;
  const increase = lastRate - firstRate;

  // Add + sign only for positive values, negative values already have -
  if (increase > 0) {
    return `+$${increase.toFixed(2)}/hr`;
  } else if (increase < 0) {
    return `-$${Math.abs(increase).toFixed(2)}/hr`;
  }
  return '$0/hr';
};