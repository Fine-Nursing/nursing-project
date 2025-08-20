import type { DifferentialItem } from './hooks/useDifferentialCalculator';

export interface LocationData {
  organizationName: string;
  organizationCity: string;
  organizationState: string;
}

export interface JobDetailsData {
  nursingRole: string;
  nursingSpecialty: string;
  contractLength: string;
  startDate: string;
  educationLevel: string;
  yearsOfExperience: string;
  certifications: string[];
  workSchedule: {
    shiftType: string;
    hoursPerWeek: string;
    daysPerWeek: string;
    preferredShifts: string[];
  };
  additionalInfo: string;
}

export interface PayrollData {
  hourlyRate: string;
  weeklyHours: string;
  payFrequency: string;
  contractType: string;
  customRatio: string;
  differentialItems: DifferentialItem[];
  baseWeeklyPay: number;
  totalDifferentialWeekly: number;
  totalWeeklyPay: number;
  estimatedAnnualPay: number;
  validation: {
    isValid: boolean;
    errors: string[];
  };
}

export interface EmploymentFormProps {
  onSubmit?: (data: {
    location: LocationData;
    jobDetails: JobDetailsData;
    payroll: PayrollData;
  }) => void;
  onCancel?: () => void;
  initialData?: {
    location?: Partial<LocationData>;
    jobDetails?: Partial<JobDetailsData>;
    payroll?: Partial<PayrollData>;
  };
}

export interface SectionNavigationProps {
  sections: Array<{
    label: string;
    isActive: boolean;
    isCompleted: boolean;
  }>;
  currentSection: number;
  onSectionClick: (index: number) => void;
}

export interface FormNavigationProps {
  currentSection: number;
  isLastSection: boolean;
  hasErrors: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onCancel?: () => void;
}