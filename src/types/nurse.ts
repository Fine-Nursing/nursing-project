import type { Column } from 'react-table';

// 기본 타입 정의
export type NurseAvatar = '👩‍⚕️' | '👨‍⚕️';
export type ShiftType = 'Day' | 'Night';
export type Region = 'Northeast' | 'South' | 'Midwest' | 'West';

// 기본 간호사 정보 인터페이스
export interface BaseNurseInfo {
  id: string;
  location: string;
  specialty: string;
  experience: string;
  workDays: string;
  salary: string;
}

// 간호사 프로필
export interface NurseProfile extends BaseNurseInfo {
  role: string;
  avatar: NurseAvatar;
}

// 간호사 카드 컴포넌트 Props
export interface NurseCardProps {
  title: string;
  subtitle: string;
  className?: string;
  nurseInfo: NurseProfile;
}

// 간호사 포지션
export interface NursePosition {
  id: string;
  title: string;
  subtitle: string;
  className?: string;
  nurseInfo: NurseProfile;
}

// 보상/급여 관련
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

// 테이블 관련
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

// 지역 및 상태 관련
export interface State {
  value: string;
  label: string;
  region: Region;
  avgSalary: number;
}

export type RegionGroup = {
  [key in Region]: State[];
};

// 전문 분야 관련
export interface NursingSpecialty {
  specialty: string;
  'Base Pay': number;
  'Differential Pay': number;
  total: number;
  state: string;
}

// 필터 및 상태 관련
export interface FilterState {
  searchTerm: string;
  salaryRange: [number, number];
  selectedLocations: string[];
}

// 차트 관련
export interface ChartProps {
  data: NursingSpecialty[];
  CustomTooltip: React.ComponentType<any>;
}

// 컴포넌트 Props
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
