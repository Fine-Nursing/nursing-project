import type { DifferentialItem } from '../../hooks/useDifferentialCalculator';

export interface PayrollConfigurationProps {
  onPayrollDataChange?: (data: any) => void;
  initialData?: {
    hourlyRate?: string;
    weeklyHours?: string;
    payFrequency?: string;
    contractType?: string;
    customRatio?: string;
    differentialItems?: DifferentialItem[];
  };
}

export interface BasicPaySectionProps {
  hourlyRate: string;
  weeklyHours: string;
  payFrequency: string;
  contractType: string;
  updateHourlyRate: (value: string) => void;
  updateWeeklyHours: (value: string) => void;
  updatePayFrequency: (value: string) => void;
  updateContractType: (value: string) => void;
}

export interface DifferentialSectionProps {
  differentialItems: DifferentialItem[];
  isAddingDifferential: boolean;
  newDifferentialType: string;
  newDifferentialAmount: string;
  newDifferentialUnit: string;
  newDifferentialGroup: string;
  differentialTypes: string[];
  differentialGroups: string[];
  startAddingDifferential: () => void;
  cancelAddingDifferential: () => void;
  addDifferential: () => boolean;
  removeDifferential: (id: string) => void;
  setNewDifferentialType: (value: string) => void;
  setNewDifferentialAmount: (value: string) => void;
  setNewDifferentialUnit: (value: any) => void;
  setNewDifferentialGroup: (value: string) => void;
}

export interface PaySummaryProps {
  baseWeeklyPay: number;
  totalDifferentialWeekly: number;
  totalWeeklyPay: number;
  estimatedAnnualPay: number;
}

export interface CustomRatioSectionProps {
  customRatio: string;
  updateCustomRatio: (value: string) => void;
}