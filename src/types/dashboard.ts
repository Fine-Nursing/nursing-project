export interface CompensationCard {
  id: string;
  hospital: string;
  state: string;
  city: string;
  specialty: string;
  totalPay: number;
  basePay: number;
  differentialPay: number;
  unitCulture: number;
  unitFeedback: string;
  experienceLevel: 'beginner' | 'junior' | 'experienced' | 'senior';
  nursingRole: string;
  shiftType: string;
  employmentType: string;
  yearsOfExperience: number;
}

export interface CompensationBoardResponse {
  beginner: CompensationCard[];
  junior: CompensationCard[];
  experienced: CompensationCard[];
  senior: CompensationCard[];
}

// Compensation Board 필터
export interface CompensationFilters {
  specialties?: string[];
  states?: string[];
}

// Compensation Board 필터 요청
export interface CompensationFilterRequest {
  specialties?: string[];
  states?: string[];
  experienceLevel?: string[];
}
