import type { EmploymentType, ShiftType, IndividualDifferentialItem } from 'src/types/onboarding';

export interface EmploymentOption {
  value: EmploymentType;
  description: string;
}

export interface ShiftOption {
  value: ShiftType;
  description: string;
}

export interface SectionInfo {
  label: string;
  isCompleted: boolean;
  isActive: boolean;
}

export interface CustomDifferential {
  type: string;
  amount: number;
  unit: 'hourly' | 'annual';
  group?: string;
}

export interface GoogleMapsState {
  showMapModal: boolean;
  placesResult: google.maps.places.PlaceResult[];
  selectedIndex: number | null;
  tempOrgName: string;
  tempCity: string;
  tempState: string;
}

export interface DifferentialTotals {
  hourly: number;
  annual: number;
}