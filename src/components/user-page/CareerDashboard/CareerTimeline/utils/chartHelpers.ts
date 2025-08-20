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
  
  return `+${growthRate.toFixed(1)}%`;
};

export const calculateRateIncrease = (data: ChartDataItem[]): string => {
  if (data.length <= 1) return '$0/hr';
  
  const firstRate = data[0].hourlyRate;
  const lastRate = data[data.length - 1].hourlyRate;
  const increase = lastRate - firstRate;
  
  return `+$${increase.toFixed(2)}/hr`;
};