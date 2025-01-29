// types.ts
import type { Column } from 'react-table';

export interface NurseData {
  id: string;
  user: string;
  specialty: string;
  location: string;
  experience: string;
  shiftType: 'Day' | 'Night';
  basePay: number;
  differentials: number;
  totalPay?: number;
}

export interface NurseTableProps {
  initialData: NurseData[];
  columns: Column<NurseData>[];
  pageSize?: number;
  customStyles?: Record<string, string>;
  enableFilters?: boolean;
  enableSorting?: boolean;
  enablePagination?: boolean;
}

// mock-data.ts
export const nurseData: NurseData[] = [
  {
    id: '1',
    user: 'dan***',
    specialty: 'PICU',
    location: 'Brooklyn, NY',
    experience: '2 - 3 years',
    shiftType: 'Night',
    basePay: 58.5,
    differentials: 4.5,
    totalPay: 63,
  },
  {
    id: '2',
    user: 'su8***',
    specialty: 'Pediatrics',
    location: 'Manhattan, NY',
    experience: '5 - 10 years',
    shiftType: 'Day',
    basePay: 75,
    differentials: 5,
    totalPay: 80,
  },
  {
    id: '3',
    user: 'rn2***',
    specialty: 'ER',
    location: 'Queens, NY',
    experience: '10+ years',
    shiftType: 'Night',
    basePay: 85,
    differentials: 7.5,
    totalPay: 92.5,
  },
  {
    id: '4',
    user: 'med***',
    specialty: 'Med-Surg',
    location: 'Bronx, NY',
    experience: '0 - 2 years',
    shiftType: 'Day',
    basePay: 45,
    differentials: 3,
    totalPay: 48,
  },
  {
    id: '5',
    user: 'icu***',
    specialty: 'ICU',
    location: 'Staten Island, NY',
    experience: '3 - 5 years',
    shiftType: 'Night',
    basePay: 65,
    differentials: 6,
    totalPay: 71,
  },
];
