import type { Column } from 'react-table';

// Basic type definitions
export type NurseAvatar = '👩‍⚕️' | '👨‍⚕️';
export type ShiftType = 'Day' | 'Night';
export type Region = 'Northeast' | 'South' | 'Midwest' | 'West';

// Basic nurse information interface
export interface BaseNurseInfo {
  id: string;
  location: string;
  specialty: string;
  experience: string;
  workDays: string;
  salary: string;
}

// Nurse profile
export interface NurseProfile extends BaseNurseInfo {
  role: string;
  avatar: NurseAvatar;
}

// Nurse card component Props
export interface NurseCardProps {
  title: string;
  subtitle: string;
  className?: string;
  nurseInfo: NurseProfile;
}

// Nurse position
export interface NursePosition {
  id: string;
  title: string;
  subtitle: string;
  className?: string;
  nurseInfo: NurseProfile;
}

// Compensation/salary related
export interface CompensationDataPoint {
  hourly: number;
  concentration: number;
  years: string;
}

export interface HospitalCompensation {
  id: string;
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

// Table related
export interface NurseTableData extends BaseNurseInfo {
  user: string;
  shiftType: ShiftType;
  basePay: number;
  differentials: number;
  totalPay?: number;
}

export interface NurseTableProps {
  initialData: NurseTableData[];
  columns: Column<NurseTableData>[];
  pageSize?: number;
  customStyles?: Record<string, string>;
  enableFilters?: boolean;
  enableSorting?: boolean;
  enablePagination?: boolean;
}

// Region and state related
export interface State {
  value: string;
  label: string;
  region: Region;
  avgSalary: number;
}

export type RegionGroup = {
  [key in Region]: State[];
};

// Specialty related
export interface NursingSpecialty {
  specialty: string;
  'Base Pay': number;
  'Differential Pay': number;
  total: number;
  state: string;
}

// Filter and state related
export interface FilterState {
  searchTerm: string;
  salaryRange: [number, number];
  selectedLocations: string[];
}

// Chart related
export interface ChartProps {
  data: NursingSpecialty[];
  CustomTooltip: React.ComponentType<any>;
}

// Component Props
export interface LocationSelectorProps {
  selectedLocations: string[];
  onLocationChange: (locations: string[]) => void;
}

export interface FilterSectionProps {
  salaryRange: [number, number];
  onSalaryRangeChange: (range: [number, number]) => void;
  processedData: NursingSpecialty[];
}

export interface CustomTooltipProps {
  id: string;
  value: number;
  color: string;
  indexValue: string;
  data: NursingSpecialty;
}
