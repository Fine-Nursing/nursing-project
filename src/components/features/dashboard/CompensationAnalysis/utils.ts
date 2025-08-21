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

export const calculateMonthlyCompensation = (
  annualSalary: number,
  differentials: { night: number; weekend: number; other: number }
) => {
  const monthlyBase = Math.round(annualSalary / 12);
  const nightDifferential = differentials.night * 60;
  const weekendDifferential = differentials.weekend * 32;
  const specialtyDifferential = differentials.other * 20;
  const totalMonthlyDifferentials = nightDifferential + weekendDifferential + specialtyDifferential;
  const totalMonthly = monthlyBase + totalMonthlyDifferentials;

  return {
    monthlyBase,
    nightDifferential,
    weekendDifferential,
    specialtyDifferential,
    totalMonthlyDifferentials,
    totalMonthly
  };
};