export interface DifferentialDetail {
  type: string;
  label: string;
  value: number;
  estimatedHours: number;
  description: string;
}

export interface UserProfile {
  hourlyRate: number;
  annualSalary: number;
  differentials: DifferentialDetail[];
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