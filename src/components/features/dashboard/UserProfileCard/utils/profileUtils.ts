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
    return "Analyzing your career trajectory...";
  }
  if (careerInsight?.content) {
    return careerInsight.content;
  }
  return "You're on track for a 3-5% salary increase. Consider trauma specialization for additional 8-12% market value.";
}