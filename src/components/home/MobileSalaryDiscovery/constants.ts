import type { TestimonialData } from './types';

export const SPECIALTIES = ['ICU', 'Emergency', 'Medical Surgical', 'NICU', 'Pediatric'] as const;
export const LOCATIONS = ['CA', 'TX', 'FL', 'NY', 'IL'] as const;
export const EXPERIENCE_LEVELS = ['beginner', 'junior', 'experienced', 'senior'] as const;

export const TESTIMONIALS: TestimonialData[] = [
  {
    text: 'Nurse Journey helped me negotiate a 25% salary increase. The data gave me confidence.',
    name: 'Sarah M.',
    role: 'ICU Nurse'
  },
  {
    text: 'I discovered I was underpaid by $15/hr. Found a new position in 3 months.',
    name: 'James K.',
    role: 'ER Nurse'
  },
  {
    text: 'Real-time updates keep me informed. Essential tool for my career.',
    name: 'Emily R.',
    role: 'NICU Nurse'
  }
];

export const TICKER_INTERVAL = 4000;
export const TESTIMONIAL_INTERVAL = 6000;