import dayjs from 'dayjs';

export const renderDuration = (years: number, months: number): string => {
  if (years > 0) {
    const yearText = `${years}y`;
    return months > 0 ? `${yearText} ${months}m` : yearText;
  }
  return months > 0 ? `${months}m` : '< 1m';
};

export const calculateDuration = (startDate: Date | string | null, endDate?: Date | string | null) => {
  if (!startDate) {
    return {
      years: 0,
      months: 0,
      totalMonths: 0,
      ongoing: false
    };
  }
  
  const start = dayjs(startDate);
  const end = endDate ? dayjs(endDate) : dayjs();
  const durationMonths = end.diff(start, 'month');
  const durationYears = Math.floor(durationMonths / 12);
  const remainingDurationMonths = durationMonths % 12;
  
  return {
    years: durationYears,
    months: remainingDurationMonths,
    totalMonths: durationMonths,
    ongoing: !endDate
  };
};

export const calculateGap = (currentEndDate: Date | string | null | undefined, nextStartDate: Date | string | null): number => {
  if (!nextStartDate) return 0;
  const end = currentEndDate ? dayjs(currentEndDate) : dayjs();
  return dayjs(nextStartDate).diff(end, 'month');
};