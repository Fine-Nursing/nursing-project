export interface NurseProfile {
  role: string;
  location: string;
  salary: string;
  specialty: string;
  workDays: string;
  experience: string;
  avatar: '👩‍⚕️' | '👨‍⚕️';
}

export interface NurseCardProps {
  title: string;
  subtitle: string;
  className?: string;
  nurseInfo: NurseProfile;
}
