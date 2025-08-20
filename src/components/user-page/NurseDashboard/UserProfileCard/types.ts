import type { SimpleBeanHeadConfig } from '../SimpleBeanHead';

export interface UserProfile {
  id?: string;
  name: string;
  role: string;
  specialty: string;
  education: string;
  organization: string;
  location: string;
  experience: string;
}

export interface UserProfileCardProps {
  userProfile: UserProfile;
  theme: 'light' | 'dark';
}

export interface AvatarConfig extends SimpleBeanHeadConfig {}

export interface ProfileInfoItem {
  icon: any;
  label: string;
  value: string;
}