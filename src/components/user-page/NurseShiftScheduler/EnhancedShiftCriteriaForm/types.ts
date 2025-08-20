import type { UNIT_BASE_PAY } from '../../../../utils/constants';

export type UnitKey = keyof typeof UNIT_BASE_PAY;

export interface Criteria {
  shiftPattern: string;
  rotationPattern: string;
  unitType: UnitKey;
  experienceYears: number;
  totalWeeks: number;
  maxConsecutiveShifts: number;
  minRestBetweenShifts: number;
  preferNight: boolean;
  preferWeekend: boolean;
  chargeNurse: boolean;
  preceptorDuty: boolean;
  maxWeeklyHours: number;
  startDate: Date;
  certifications: string[];
  requestedDaysOff: string[];
  selfScheduled: boolean;
}

export interface PayEstimates {
  basePay: string;
  diffRate: string;
  totalRate: string;
  weeklyHours: number;
  weeklyEarnings: string;
  totalEarnings: string;
}