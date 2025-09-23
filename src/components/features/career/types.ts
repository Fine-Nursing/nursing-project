// components/CareerDashboard/types.ts

export interface CareerItem {
  id: number;  // UI display ID
  jobId: string;  // Actual job ID from database
  facility: string;
  role: string;
  specialty: string;
  startDate: Date | null;
  endDate: Date | null;
  hourlyRate: number;
}
