export interface NurseProfile {
  role: string;
  location: string;
  salary: string;
  specialty: string;
  workDays: string;
  experience: string;
  avatar: '👩‍⚕️' | '👨‍⚕️';
}

export interface NurseCardProps {
  title: string;
  subtitle: string;
  className?: string;
  nurseInfo: NurseProfile;
}

export interface NurseInfo {
  role: string;
  location: string;
  salary: string;
  specialty: string;
  workDays: string;
  experience: string;
  avatar: string;
}

export interface NursePosition {
  title: string;
  subtitle: string;
  className?: string;
  nurseInfo: NurseInfo;
}

export interface CompensationDataPoint {
  hourly: number;
  concentration: number;
  years: string;
}

export interface HospitalCompensation {
  hospital: string;
  specialty?: string;
  yearsOfExperience?: string;
  totalCompensation?: string;
}

export interface CompensationStats {
  medianCompensation: number;
  yearOverYearGrowth: number;
  nationalAverage: number;
  verifiedNurses: number;
}
