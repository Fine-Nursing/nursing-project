export interface ShiftEvent {
  title: string;
  start: Date;
  end: Date;
  resource?: {
    earning: number;
    hourlyRate: number;
    basePay: number;
    differentials: string[];
    hours: number;
    isHoliday: boolean;
  };
}

export interface NurseShiftCalendarProps {
  events: ShiftEvent[];
  totalEarnings: number;
  theme: 'light' | 'dark';
}

export interface EventModalProps {
  event: ShiftEvent | null;
  onClose: () => void;
  theme: 'light' | 'dark';
}

export interface CalendarHeaderProps {
  totalEarnings: number;
  hoursWorked: number;
  shiftsCount: number;
  theme: 'light' | 'dark';
}

export interface ShiftStatsProps {
  events: ShiftEvent[];
  theme: 'light' | 'dark';
}

export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;