export type EducationLevel =
  | 'High School Diploma or Equivalent'
  | 'Vocational/Technical Certificate'
  | "Associate's Degree"
  | "Bachelor's Degree"
  | "Master's Degree"
  | 'Doctorate Degree'
  | "Post-Master's Certificate"
  | 'Specialized Nursing Certification';

export type NursingRole =
  | 'Certified Nursing Assistant (CNA)'
  | 'Licensed Practical Nurse (LPN)'
  | 'Registered Nurse (RN)'
  | 'Nurse Practitioner (NP)'
  | 'Clinical Nurse Specialist (CNS)'
  | 'Certified Nurse Midwife (CNM)'
  | 'Certified Registered Nurse Anesthetist (CRNA)'
  | 'Nurse Administrator'
  | 'Travel Nurse'
  | 'Staff Nurse'
  | 'Public Health Nurse'
  | 'Emergency Room Nurse'
  | 'Critical Care Nurse'
  | 'Pediatric Nurse'
  | 'Geriatric Nurse'
  | 'Neonatal Nurse'
  | 'Psychiatric Nurse'
  | 'Hospice Nurse'
  | 'Case Manager Nurse';

export type ExperienceGroup =
  | '1-3 years'
  | '3-5 years'
  | '5-10 years'
  | '10+ years';

export type ShiftType =
  | 'Day Shift'
  | 'Night Shift'
  | 'Evening Shift'
  | 'Rotating Shift'
  | 'Split Shift'
  | 'On-Call Shift'
  | 'Per Diem Shift'
  | 'Weekend Shift'
  | 'Flexible Shift'
  | 'Overtime Shift';

export interface BasicInfoFormData {
  name: string;
  education: EducationLevel;
  nursingRole: NursingRole;
  experienceGroup: ExperienceGroup;
}

export interface DifferentialPay {
  group: string;
  type: string;
  amount: number;
  unit: 'hourly' | 'annual';
}

export interface EmploymentFormData {
  employmentType: string;
  specialty: string;
  subSpecialty?: string;
  organizationName: string;
  organizationCity: string;
  organizationState: string;
  employmentStartYear: number;
  isUnionized: boolean;
  yearsAtOrganization: number;
  basePay: number;
  paymentFrequency: 'hourly' | 'yearly';
  shiftType: ShiftType;

  // 기존 필드 제거하고 새로운 구조로 교체
  // bonusesAndDifferentials: {
  //   id: string;
  //   type: string;
  //   amount: number;
  // }[];

  // 새로운 differential 구조
  individualDifferentials: DifferentialPay[];
  totalDifferential: number;
  differentialsFreeText?: string;

  nurseToPatientRatio: string;
}

export interface CultureFormData {
  cultureRating: number;
  unitStrengths: string;
  improvementAreas: string;
}

export interface AccountFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export type OnboardingFormData = BasicInfoFormData &
  EmploymentFormData &
  CultureFormData &
  AccountFormData;

export type OnboardingStep =
  | 'welcome'
  | 'basicInfo'
  | 'employment'
  | 'culture'
  | 'account';
