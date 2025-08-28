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
  if (isLoading) {
    return "Analyzing your career progression and generating personalized insights...";
  }
  
  // AI 데이터가 있는 경우 직접 사용
  if (careerInsight?.content) {
    return careerInsight.content;
  }
  
  // AI 데이터가 없는 경우 더 일반적인 메시지
  return "Complete your profile to receive AI-powered career insights and personalized recommendations.";
}