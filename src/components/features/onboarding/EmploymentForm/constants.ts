import type { EmploymentType, ShiftType } from 'src/types/onboarding';

export const POPULAR_DIFFERENTIALS = [
  'Night Shift',
  'Weekend',
  'Holiday',
  'Call Pay',
  'Charge Nurse',
  'Float Pool'
];

export const EMPLOYMENT_TYPE_OPTIONS = [
  { value: 'Full-time' as EmploymentType, description: '36+ hours per week' },
  { value: 'Part-time' as EmploymentType, description: 'Less than 36 hours' },
  { value: 'Per Diem/PRN' as EmploymentType, description: 'As-needed basis' },
  { value: 'Temporary/Contract' as EmploymentType, description: 'Fixed-term employment' },
  { value: 'Travel Nursing' as EmploymentType, description: 'Short-term assignments' },
  { value: 'Agency Nursing' as EmploymentType, description: 'Staffing agency placement' },
];

export const SHIFT_TYPE_OPTIONS = [
  { value: 'Day Shift' as ShiftType, description: '7 AM - 3 PM' },
  { value: 'Evening Shift' as ShiftType, description: '3 PM - 11 PM' },
  { value: 'Night Shift' as ShiftType, description: '11 PM - 7 AM' },
  { value: 'Rotating Shift' as ShiftType, description: 'Variable shifts' },
];

export const NURSE_RATIO_OPTIONS = [
  '1:1', '1:2', '1:3', '1:4', '1:5', 'Custom'
];

export const GOOGLE_MAPS_LIBRARIES: ['places'] = ['places'];