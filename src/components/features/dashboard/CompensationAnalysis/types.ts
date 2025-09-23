export interface DifferentialDetail {
  type: string;
  label: string;
  value: number;
  frequency: number; // Weekly frequency
  monthlyAmount: number; // BE calculated monthly amount
  estimatedHours?: number; // Legacy - for backward compatibility
  description?: string; // Optional description
}

export interface UserProfile {
  hourlyRate: number; // 총 보상 시급
  annualSalary: number; // 총 보상 연봉
  baseHourlyRate?: number; // Base pay 시급
  baseAnnualSalary?: number; // Base pay 연봉
  differentials: DifferentialDetail[];
}

export interface CompensationAnalysisProps {
  userProfile: UserProfile;
  theme: 'light' | 'dark';
  getCompensationInsight: () => string;
  calculatePotentialDifferentials: () => string[] | number | string;
  userSpecialty?: string;
  userState?: string;
  regionalAvgWage?: number;
  specialtyAvgWage?: number;
  shiftHours?: number;
  onEditCompensation?: () => void;
}

export interface MonthlyCalculations {
  monthlyBase: number;
  nightDifferential: number;
  weekendDifferential: number;
  specialtyDifferential: number;
  totalMonthlyDifferentials: number;
  totalMonthly: number;
}