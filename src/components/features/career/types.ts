// components/CareerDashboard/types.ts

export interface CareerItem {
  id: number;
  facility: string;
  role: string;
  specialty: string;
  startDate: Date | null;
  endDate: Date | null;
  hourlyRate: number;
}

export interface NewItemInput {
  facility: string;
  role: string;
  specialty: string;
  startDate: Date | null;
  endDate: Date | null;
  hourlyRate: string;
}
