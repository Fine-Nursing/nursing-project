import type { EducationLevel, NursingRole } from 'src/types/onboarding';
import type { BasicQuestion } from './types';

export const BASIC_INFO_QUESTIONS: BasicQuestion[] = [
  {
    key: 'name',
    title: "Hi! Let's begin with your name — what should I call you?",
    subtitle: '',
    validation: (value: string) => value.length > 0,
  },
  {
    key: 'education',
    title: "Awesome — what's your highest completed education level?",
    subtitle: 'This helps me understand your academic background',
    options: [
      'High School Diploma or Equivalent',
      'Vocational/Technical Certificate',
      "Associate's Degree",
      "Bachelor's Degree",
      "Master's Degree",
      'Doctorate Degree',
      "Post-Master's Certificate",
      'Specialized Nursing Certification',
    ] as EducationLevel[],
  },
  {
    key: 'nursingRole',
    title: 'Amazing! Now, could you tell me about your current nursing role?',
    subtitle: 'Select the position that best describes your role',
    options: [
      'Certified Nursing Assistant (CNA)',
      'Licensed Practical Nurse (LPN)',
      'Registered Nurse (RN)',
      'Nurse Practitioner (NP)',
      'Clinical Nurse Specialist (CNS)',
      'Certified Nurse Midwife (CNM)',
      'Certified Registered Nurse Anesthetist (CRNA)',
      'Nurse Administrator',
      'Travel Nurse',
      'Staff Nurse',
      'Public Health Nurse',
      'Emergency Room Nurse',
      'Critical Care Nurse',
      'Pediatric Nurse',
      'Geriatric Nurse',
      'Neonatal Nurse',
      'Psychiatric Nurse',
      'Hospice Nurse',
      'Case Manager Nurse',
    ] as NursingRole[],
  },
  {
    key: 'experienceYears',
    title: 'And lastly, how many years of experience do you have?',
    subtitle: 'Your experience is valuable to us',
    inputType: 'number',
    validation: (value: string) => {
      const num = Number(value);
      return !Number.isNaN(num) && num >= 0 && num <= 50;
    },
  },
];

export const FIELD_ICONS = {
  name: 'User',
  education: 'GraduationCap', 
  nursingRole: 'Briefcase',
  experienceYears: 'Clock',
} as const;

export const FIELD_LABELS = {
  name: 'Name',
  education: 'Education',
  nursingRole: 'Nursing Role',
  experienceYears: 'Years of Experience',
} as const;