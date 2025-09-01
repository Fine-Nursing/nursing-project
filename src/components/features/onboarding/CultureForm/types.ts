import type { LucideIcon } from 'lucide-react';

export interface RatingCategory {
  key: 'unitCulture' | 'benefits' | 'growthOpportunities' | 'hospitalQuality';
  label: string;
  description: string;
  icon: LucideIcon;
}

export interface RatingOption {
  value: number;
  label: string;
}

export interface Review {
  id: number;
  rating: number;
  name: string;
  role: string;
  timeAgo: string;
  unitCulture: number;
  benefits: number;
  growthOpportunities: number;
  hospitalQuality: number;
  feedback: string;
}

export interface HoveredRating {
  category: string;
  value: number;
}

export interface CultureFormData {
  unitCulture?: number;
  benefits?: number;
  growthOpportunities?: number;
  hospitalQuality?: number;
  freeTextFeedback?: string;
}