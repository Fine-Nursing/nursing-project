import { Building2, MapPin, Briefcase, Clock } from 'lucide-react';
import type { UserProfile, ProfileInfoItem } from '../types';

export function getProfileInfoItems(userProfile: UserProfile): ProfileInfoItem[] {
  return [
    { icon: Building2, label: 'Organization', value: userProfile.organization },
    { icon: MapPin, label: 'Location', value: userProfile.location },
    { icon: Briefcase, label: 'Specialty', value: userProfile.specialty },
    { icon: Clock, label: 'Experience', value: userProfile.experience }
  ];
}

export function getCareerInsightContent(careerInsight: any, isLoading: boolean): string {
  // 기본값을 먼저 표시하고, AI 응답이 오면 업데이트
  const defaultInsight = "You're on track for a 3-5% salary increase. Consider trauma specialization for additional 8-12% market value.";
  
  if (careerInsight?.content) {
    return careerInsight.content;
  }
  return defaultInsight;
}