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

// API에는 실제 EmploymentType이 정의되어 있음
export type EmploymentType =
  | 'Full-time'
  | 'Part-time'
  | 'Per Diem/PRN'
  | 'Temporary/Contract'
  | 'Travel Nursing'
  | 'Agency Nursing';

// API의 ShiftType은 더 간단함
export type ShiftType =
  | 'Day Shift'
  | 'Night Shift'
  | 'Evening Shift'
  | 'Rotating Shift';

// BasicInfo - experienceGroup을 experienceYears로 변경
export interface BasicInfoFormData {
  name: string;
  education: EducationLevel;
  nursingRole: NursingRole;
  experienceYears: number; // ExperienceGroup 대신 숫자로 변경
}

// Differential 구조 - Backend에 맞춤 (unit/group 저장 안 됨)
export interface DifferentialPay {
  type: string;
  amount: number;
  // Frontend 표시용으로만 사용, Backend에는 전송 안 됨
  unit?: 'hourly' | 'annual';
  group?: string; // 'Shift-Based', 'Unit-Based' 등
}

// Alias for compatibility
export type IndividualDifferentialItem = DifferentialPay;

// Employment - API 명세에 맞게 수정
export interface EmploymentFormData {
  specialty: string;
  subSpecialty?: string;
  organizationName: string;
  organizationCity: string;
  organizationState: string; // 2자리 주 코드 (예: "NY")
  employmentStartYear: number;
  employmentType: EmploymentType; // string 대신 타입 지정
  shiftType: ShiftType;
  nurseToPatientRatio: string;
  basePay: number;
  paymentFrequency: 'hourly' | 'yearly';
  isUnionized: boolean;
  individualDifferentials: DifferentialPay[];
  differentialsFreeText?: string;
  // 제거: yearsAtOrganization, totalDifferential (API에 없음)
}

// Culture - API 명세에 맞게 완전히 변경
export interface CultureFormData {
  unitCulture: number; // 1-5 점수
  benefits: number; // 1-5 점수
  growthOpportunities: number; // 1-5 점수
  hospitalQuality: number; // 1-5 점수
  freeTextFeedback?: string; // 자유 피드백
  // 제거: cultureRating, unitStrengths, improvementAreas
}

// Account - confirmPassword는 프론트엔드 검증용으로 유지
export interface AccountFormData {
  email: string;
  password: string;
  confirmPassword: string; // 프론트엔드 검증용
}

// 전체 폼 데이터
export type OnboardingFormData = BasicInfoFormData &
  EmploymentFormData &
  CultureFormData &
  AccountFormData & {
    // Store에서 관리하는 추가 필드들
    tempUserId?: string;
    sessionId?: string;
  };

export type OnboardingStep =
  | 'welcome'
  | 'basicInfo'
  | 'employment'
  | 'culture'
  | 'account';

// API 요청/응답 타입들 (선택사항)
export interface OnboardingProgress {
  tempUserId: string;
  completedSteps: string[];
  basicInfoCompleted: boolean;
  employmentCompleted: boolean;
  cultureCompleted: boolean;
  accountCompleted: boolean;
}
