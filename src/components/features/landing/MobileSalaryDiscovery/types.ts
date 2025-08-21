export interface MobileSalaryDiscoveryProps {
  onOnboardingClick: () => void;
  onLoginClick?: () => void;
}

export interface CalculatorResult {
  min: number;
  avg: number;
  max: number;
  annual: number;
  dataPoints: number;
}

export interface TestimonialData {
  text: string;
  name: string;
  role: string;
}