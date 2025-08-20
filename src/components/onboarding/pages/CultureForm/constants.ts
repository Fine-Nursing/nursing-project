import { Users, DollarSign, TrendingUp, Building2 } from 'lucide-react';
import type { RatingCategory, RatingOption, ExistingReview } from './types';

export const RATING_CATEGORIES: RatingCategory[] = [
  {
    key: 'unitCulture' as const,
    label: 'Unit Culture & Teamwork',
    description: 'How well does your unit work together?',
    icon: Users,
  },
  {
    key: 'benefits' as const,
    label: 'Benefits & Compensation',
    description: 'Quality of benefits package and compensation',
    icon: DollarSign,
  },
  {
    key: 'growthOpportunities' as const,
    label: 'Growth & Development',
    description: 'Opportunities for professional growth',
    icon: TrendingUp,
  },
  {
    key: 'hospitalQuality' as const,
    label: 'Hospital/Facility Quality',
    description: 'Overall quality of care and facilities',
    icon: Building2,
  },
];

export const RATING_OPTIONS: RatingOption[] = [
  { value: 1, label: 'Poor' },
  { value: 2, label: 'Fair' },
  { value: 3, label: 'Good' },
  { value: 4, label: 'Very Good' },
  { value: 5, label: 'Excellent' },
];

export const EXISTING_REVIEWS: ExistingReview[] = [
  {
    id: '1',
    unitCulture: 4,
    benefits: 3,
    growthOpportunities: 4,
    hospitalQuality: 5,
    freeTextFeedback: 'Great team collaboration, management is supportive. Benefits could be better but overall a good place to work.',
    hospitalName: 'City General Hospital',
    location: 'San Francisco, CA',
    workUnit: 'ICU',
    submittedAt: '2024-01-15',
  },
  {
    id: '2',
    unitCulture: 5,
    benefits: 4,
    growthOpportunities: 3,
    hospitalQuality: 4,
    freeTextFeedback: 'Amazing workplace culture, everyone helps each other. Excellent benefits package.',
    hospitalName: 'Metro Medical Center',
    location: 'Los Angeles, CA',
    workUnit: 'Emergency Department',
    submittedAt: '2024-01-10',
  },
  {
    id: '3',
    unitCulture: 3,
    benefits: 2,
    growthOpportunities: 2,
    hospitalQuality: 3,
    freeTextFeedback: 'Understaffed but trying their best. Limited growth opportunities.',
    hospitalName: 'Community Health Center',
    location: 'Phoenix, AZ',
    workUnit: 'Med-Surg',
    submittedAt: '2024-01-08',
  },
];