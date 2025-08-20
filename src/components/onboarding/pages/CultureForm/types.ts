export interface RatingCategory {
  key: 'unitCulture' | 'benefits' | 'growthOpportunities' | 'hospitalQuality';
  label: string;
  description: string;
  icon: React.ComponentType<any>;
}

export interface RatingOption {
  value: number;
  label: string;
}

export interface ExistingReview {
  id: string;
  unitCulture: number;
  benefits: number;
  growthOpportunities: number;
  hospitalQuality: number;
  freeTextFeedback?: string;
  hospitalName: string;
  location: string;
  workUnit: string;
  submittedAt: string;
}

export interface CultureFormData {
  unitCulture: number | null;
  benefits: number | null;
  growthOpportunities: number | null;
  hospitalQuality: number | null;
  freeTextFeedback: string;
}

export interface RatingCardProps {
  category: RatingCategory;
  value: number | null;
  onRatingChange: (category: string, value: number) => void;
}

export interface ExistingReviewsProps {
  reviews: ExistingReview[];
  isExpanded: boolean;
  onToggle: () => void;
}

export interface FreeTextSectionProps {
  value: string;
  onChange: (value: string) => void;
}