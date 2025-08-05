export type NursingTableSortBy = 'compensation' | 'experience';
export type ShiftType = 'Day' | 'Night' | 'Evening' | 'Rotating';

export interface DifferentialBreakdown {
  type: string;
  amount: number;
}

export interface Compensation {
  hourly: number;
  basePay: number;
  totalDifferential: number;
  differentialBreakdown: DifferentialBreakdown[];
}

export interface NursingPosition {
  id: string;
  specialty: string;
  location: string;
  experience: string;
  shift: ShiftType;
  compensation: Compensation;
}
