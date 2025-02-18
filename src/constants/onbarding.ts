// src/constants/onboarding.ts

export const NURSING_SPECIALTIES = [
  'Medical-Surgical',
  'Critical Care (ICU/CCU)',
  'Emergency',
  'Operating Room',
  'Post-Anesthesia Care (PACU)',
  'Labor & Delivery',
  'Pediatrics',
  'Neonatal',
  'Oncology',
  'Psychiatry',
  'Public Health',
  'Pulmonary',
  'Rehab',
  'Research',
  'Residency',
  'School Nursing',
  'SANE',
  'Skilled Nursing',
  'Transplant Care',
  'Triage',
  'Urology',
  'Wound Care',
] as const;

export const ONBOARDING_STEPS = [
  {
    id: 'welcome' as const,
    title: 'Welcome',
    description: 'Learn about our platform',
  },
  {
    id: 'basicInfo' as const,
    title: 'Basic Information',
    description: 'Tell us about yourself',
  },
  {
    id: 'employment' as const,
    title: 'Employment Details',
    description: 'Share your work experience',
  },
  {
    id: 'culture' as const,
    title: 'Workplace Culture',
    description: 'Help us understand your workplace',
  },
  {
    id: 'account' as const,
    title: 'Create Account',
    description: 'Set up your login credentials',
  },
] as const;

export const SHIFT_DIFFERENTIALS = [
  { label: 'Night Shift', value: '1:1' },
  { label: 'Weekend', value: '1:2' },
  { label: 'Holiday', value: '1:3' },
  { label: 'On-Call', value: '1:4' },
  { label: 'Charge Nurse', value: '1:5' },
  { label: 'Preceptor', value: '1:6' },
  { label: 'Critical Care', value: '1:7' },
  { label: 'Float Pool', value: '1:8' },
  { label: 'Education', value: '1:9' },
  { label: 'Certification', value: '1:10' },
] as const;

export const NURSE_PATIENT_RATIOS = [
  '1:1',
  '1:2',
  '1:3',
  '1:4',
  '1:5',
  '1:6',
  '1:7',
  '1:8',
  '1:9',
  '1:10',
  '1:10+',
] as const;
