export interface DifferentialItem {
  display: string;
  group: string;
}

export const DIFFERENTIAL_LIST: DifferentialItem[] = [
  // Shift Differentials
  { display: 'Night Shift', group: 'Shift Differentials' },
  { display: 'Weekend', group: 'Shift Differentials' },
  { display: 'Holiday', group: 'Shift Differentials' },
  { display: 'Evening Shift', group: 'Shift Differentials' },
  { display: 'Rotating Shift', group: 'Shift Differentials' },
  
  // Role-Based Differentials
  { display: 'Charge Nurse', group: 'Role-Based' },
  { display: 'Preceptor', group: 'Role-Based' },
  { display: 'Float Pool', group: 'Role-Based' },
  { display: 'Resource Nurse', group: 'Role-Based' },
  { display: 'Clinical Leader', group: 'Role-Based' },
  { display: 'Team Leader', group: 'Role-Based' },
  
  // Specialty Differentials
  { display: 'Critical Care', group: 'Specialty' },
  { display: 'Emergency Room', group: 'Specialty' },
  { display: 'ICU', group: 'Specialty' },
  { display: 'NICU', group: 'Specialty' },
  { display: 'Pediatric ICU', group: 'Specialty' },
  { display: 'Cardiac Care', group: 'Specialty' },
  { display: 'Trauma', group: 'Specialty' },
  { display: 'OR/Surgery', group: 'Specialty' },
  { display: 'Labor & Delivery', group: 'Specialty' },
  { display: 'Oncology', group: 'Specialty' },
  { display: 'Dialysis', group: 'Specialty' },
  { display: 'Psychiatric', group: 'Specialty' },
  
  // Certification & Skills
  { display: 'BSN Differential', group: 'Certification' },
  { display: 'MSN Differential', group: 'Certification' },
  { display: 'Specialty Certification', group: 'Certification' },
  { display: 'CCRN', group: 'Certification' },
  { display: 'CEN', group: 'Certification' },
  { display: 'Bilingual', group: 'Skills' },
  { display: 'Sign Language', group: 'Skills' },
  { display: 'IV Therapy', group: 'Skills' },
  { display: 'PICC Line', group: 'Skills' },
  
  // Other
  { display: 'Call Pay', group: 'Other' },
  { display: 'On-Call', group: 'Other' },
  { display: 'Overtime', group: 'Other' },
  { display: 'Double Time', group: 'Other' },
  { display: 'Hazard Pay', group: 'Other' },
  { display: 'Retention Bonus', group: 'Other' },
  { display: 'Sign-On Bonus', group: 'Other' },
  { display: 'Referral Bonus', group: 'Other' },
  { display: 'Performance Bonus', group: 'Other' },
  { display: 'Year-End Bonus', group: 'Other' },
];