import { Users, DollarSign, TrendingUp, Building2 } from 'lucide-react';
import type { RatingCategory, RatingOption, Review } from './types';

// Evaluation items definition
export const RATING_CATEGORIES: RatingCategory[] = [
  {
    key: 'unitCulture',
    label: 'Unit Culture & Teamwork',
    description: 'How well does your unit work together?',
    icon: Users,
  },
  {
    key: 'benefits',
    label: 'Benefits & Compensation',
    description: 'Quality of benefits package and compensation',
    icon: DollarSign,
  },
  {
    key: 'growthOpportunities',
    label: 'Growth & Development',
    description: 'Opportunities for professional growth',
    icon: TrendingUp,
  },
  {
    key: 'hospitalQuality',
    label: 'Hospital/Facility Quality',
    description: 'Overall quality of care and facilities',
    icon: Building2,
  },
];

// Evaluation score options
export const RATING_OPTIONS: RatingOption[] = [
  { value: 1, label: 'Poor' },
  { value: 2, label: 'Fair' },
  { value: 3, label: 'Good' },
  { value: 4, label: 'Very Good' },
  { value: 5, label: 'Excellent' },
];

// Existing review data
export const EXISTING_REVIEWS: Review[] = [
  {
    id: 1,
    rating: 4.2,
    name: 'Sarah J.',
    role: 'RN, Critical Care',
    timeAgo: '2 days ago',
    unitCulture: 4,
    benefits: 4,
    growthOpportunities: 5,
    hospitalQuality: 4,
    feedback:
      'The teamwork in our unit is fantastic. Everyone is willing to help each other out, especially during high-stress situations. Leadership really values our input.',
  },
  {
    id: 2,
    rating: 3.5,
    name: 'Michael T.',
    role: 'Nurse Practitioner',
    timeAgo: '1 week ago',
    unitCulture: 4,
    benefits: 3,
    growthOpportunities: 4,
    hospitalQuality: 3,
    feedback:
      'Great learning opportunities and mentorship programs. The benefits package could be more competitive compared to other hospitals in the area.',
  },
  {
    id: 3,
    rating: 4.5,
    name: 'Jessica L.',
    role: 'RN, Emergency Department',
    timeAgo: '2 weeks ago',
    unitCulture: 5,
    benefits: 4,
    growthOpportunities: 4,
    hospitalQuality: 5,
    feedback:
      'Management is very supportive and responsive to our needs. The facility is well-maintained with modern equipment. Staffing ratios have improved significantly.',
  },
];