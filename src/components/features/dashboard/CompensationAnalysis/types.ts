export interface UserProfile {
  hourlyRate: number;
  annualSalary: number;
  differentials: {
    night: number;
    weekend: number;
    other: number;
  };
}

export interface CompensationAnalysisProps {
  userProfile: UserProfile;
  theme: 'light' | 'dark';
  getCompensationInsight: () => string;
  calculatePotentialDifferentials: () => string[] | number | string;
}

export interface MonthlyCalculations {
  monthlyBase: number;
  nightDifferential: number;
  weekendDifferential: number;
  specialtyDifferential: number;
  totalMonthlyDifferentials: number;
  totalMonthly: number;
}