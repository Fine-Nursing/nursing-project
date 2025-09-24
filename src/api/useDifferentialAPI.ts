import { useQuery, useMutation } from '@tanstack/react-query';

const API_BASE_URL = '/api';

// Types
export interface DifferentialItem {
  type: string;
  value: number;
  frequency: number;
}

export interface DifferentialConfig {
  question: string;
  frequencyRange: {
    min: number;
    max: number;
    unit: string;
  };
  valueRange: {
    min: number;
    max: number;
    unit: string;
  };
  category: 'essential' | 'common' | 'rare' | 'bonus';
  description: string;
}

export interface DifferentialCalculationResult {
  items: Record<string, {
    value: number;
    frequency: number;
    monthly: number;
    annual: number;
    description: string;
  }>;
  metadata: {
    base_monthly: number;
    total_monthly: number;
    annual_total: number;
    effective_hourly: number;
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
    calculation_date: string;
  };
}

export interface DifferentialTypes {
  essential: string[];
  common: string[];
  rare: string[];
  bonus: string[];
}

// API functions
async function fetchDifferentialTypes(): Promise<DifferentialTypes> {
  const response = await fetch(`${API_BASE_URL}/differentials/types`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch differential types');
  }

  const data = await response.json();
  return data.data;
}

async function fetchAllDifferentialConfigs(): Promise<Record<string, DifferentialConfig>> {
  const response = await fetch(`${API_BASE_URL}/differentials/config`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch differential configs');
  }

  const data = await response.json();
  return data.data;
}

async function fetchDifferentialConfig(type: string): Promise<DifferentialConfig> {
  const response = await fetch(`${API_BASE_URL}/differentials/config/${type}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch config for ${type}`);
  }

  const data = await response.json();
  return data.data;
}

async function previewDifferentialCalculation(
  differentials: DifferentialItem[],
  basePay: number,
  basePayUnit: string = 'hourly'
): Promise<DifferentialCalculationResult> {
  const response = await fetch(`${API_BASE_URL}/differentials/preview`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      differentials,
      basePay,
      basePayUnit,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to preview differential calculation');
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'Calculation failed');
  }

  return data.data;
}

async function calculateAndSaveDifferentials(
  jobId: string,
  differentials: DifferentialItem[],
  basePay: number,
  basePayUnit: string = 'hourly'
): Promise<DifferentialCalculationResult> {
  const response = await fetch(`${API_BASE_URL}/differentials/calculate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      jobId,
      differentials,
      basePay,
      basePayUnit,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to calculate and save differentials');
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'Calculation failed');
  }

  return data.data;
}

// React Query hooks
export function useDifferentialTypes() {
  return useQuery({
    queryKey: ['differential-types'],
    queryFn: fetchDifferentialTypes,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useAllDifferentialConfigs() {
  return useQuery({
    queryKey: ['differential-configs'],
    queryFn: fetchAllDifferentialConfigs,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useDifferentialConfig(type: string) {
  return useQuery({
    queryKey: ['differential-config', type],
    queryFn: () => fetchDifferentialConfig(type),
    enabled: !!type,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useDifferentialPreview() {
  return useMutation({
    mutationFn: ({
      differentials,
      basePay,
      basePayUnit,
    }: {
      differentials: DifferentialItem[];
      basePay: number;
      basePayUnit?: string;
    }) => previewDifferentialCalculation(differentials, basePay, basePayUnit),
  });
}

export function useDifferentialCalculation() {
  return useMutation({
    mutationFn: ({
      jobId,
      differentials,
      basePay,
      basePayUnit,
    }: {
      jobId: string;
      differentials: DifferentialItem[];
      basePay: number;
      basePayUnit?: string;
    }) => calculateAndSaveDifferentials(jobId, differentials, basePay, basePayUnit),
  });
}

// Helper functions
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatHourlyRate(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getDifferentialsByCategory(
  types: DifferentialTypes,
  category: keyof DifferentialTypes
): string[] {
  return types[category] || [];
}

export function validateFrequency(
  config: DifferentialConfig,
  frequency: number
): boolean {
  return (
    frequency >= config.frequencyRange.min &&
    frequency <= config.frequencyRange.max
  );
}

export function validateValue(
  config: DifferentialConfig,
  value: number
): boolean {
  return (
    value >= config.valueRange.min &&
    value <= config.valueRange.max
  );
}

export function getFrequencyInputType(unit: string): 'number' | 'select' {
  // Binary choices use select dropdown
  if (unit.includes('yes') || unit.includes('binary')) {
    return 'select';
  }
  // Categorical choices use select dropdown
  if (unit.includes('level') || unit.includes('degree') || unit.includes('percentage')) {
    return 'select';
  }
  // Numeric inputs use number field
  return 'number';
}

export function getFrequencyOptions(config: DifferentialConfig): Array<{ value: number; label: string }> {
  const { frequencyRange } = config;

  // Binary options
  if (frequencyRange.unit.includes('yes') || frequencyRange.unit.includes('binary')) {
    return [
      { value: 0, label: 'No' },
      { value: 1, label: 'Yes' },
    ];
  }

  // Degree levels
  if (frequencyRange.unit.includes('degree')) {
    return [
      { value: 0, label: 'ADN' },
      { value: 1, label: 'BSN' },
      { value: 2, label: 'MSN' },
      { value: 3, label: 'DNP' },
    ];
  }

  // Experience levels
  if (frequencyRange.unit.includes('tenure')) {
    return [
      { value: 0, label: '< 5 years' },
      { value: 1, label: '5-10 years' },
      { value: 2, label: '10-15 years' },
      { value: 3, label: '15+ years' },
    ];
  }

  // Clinical ladder levels
  if (frequencyRange.unit.includes('level')) {
    return [
      { value: 0, label: 'Level I' },
      { value: 1, label: 'Level II' },
      { value: 2, label: 'Level III' },
      { value: 3, label: 'Level IV' },
    ];
  }

  // Percentage options for preceptor
  if (frequencyRange.unit.includes('percentage') && frequencyRange.max === 75) {
    return [
      { value: 0, label: 'Never (0%)' },
      { value: 25, label: 'Sometimes (25%)' },
      { value: 50, label: 'Often (50%)' },
      { value: 75, label: 'Always (75%)' },
    ];
  }

  // Default: no predefined options (use number input)
  return [];
}

export function formatFrequencyDisplay(frequency: number, unit: string): string {
  if (unit.includes('yes') || unit.includes('binary')) {
    return frequency > 0 ? 'Yes' : 'No';
  }

  if (unit === 'one-time') {
    return frequency > 0 ? 'Received' : 'Not received';
  }

  if (unit === 'annual') {
    return frequency > 0 ? 'Yes (Annual)' : 'No';
  }

  if (unit.includes('percentage')) {
    return `${frequency}%`;
  }

  if (unit.includes('degree_level')) {
    const degrees = ['ADN', 'BSN', 'MSN', 'DNP'];
    return degrees[frequency] || `Level ${frequency}`;
  }

  if (unit.includes('tenure_level')) {
    const tenure = ['< 5 years', '5-10 years', '10-15 years', '15+ years'];
    return tenure[frequency] || `Level ${frequency}`;
  }

  if (unit.includes('level')) {
    return `Level ${['I', 'II', 'III', 'IV'][frequency] || frequency}`;
  }

  return `${frequency} ${unit}`;
}

export function formatDifferentialTypeDisplay(type: string): string {
  // Convert backend type names to user-friendly display names
  const displayNames: Record<string, string> = {
    'Night': 'Night Shift',
    'Weekend': 'Weekend',
    'Holiday': 'Holiday Pay',
    'Overtime': 'Overtime',
    'Charge_Nurse': 'Charge Nurse',
    'Certification': 'Certification',
    'On_Call': 'On-Call',
    'Float_Pool': 'Float Pool',
    'Call_Back': 'Call-Back',
    'Preceptor': 'Preceptor',
    'Evening_Shift': 'Evening Shift',
    'Specialty_Unit': 'Specialty Unit',
    'Education_BSN': 'Education (BSN+)',
    'Experience_Longevity': 'Experience/Longevity',
    'Standby': 'Standby',
    'Per_Diem_PRN': 'PRN/Per Diem',
    'Bilingual': 'Bilingual',
    'Mandatory_Overtime': 'Mandatory Overtime',
    'Clinical_Ladder': 'Clinical Ladder',
    'Weekend_Option_Baylor': 'Weekend Option (Baylor)',
    'Resource_Nurse': 'Resource Nurse',
    'Short_Notice': 'Short Notice',
    'Consecutive_Shift': 'Consecutive Shifts',
    'Hazard_Pay': 'Hazard Pay',
    'Double_Back': 'Double-Back',
    'Relief_Charge_Nurse': 'Relief Charge Nurse',
    'Special_Skills_ECMO': 'Special Skills (ECMO/CRRT)',
    'Mentor': 'Mentor',
    'Team_Leader': 'Team Leader',
    'High_Cost_Living': 'High Cost of Living',
    'Rural_Remote': 'Rural/Remote',
    'Seven_On_Seven_Off': '7-on/7-off Program',
    'Transport_Transfer': 'Patient Transport',
    'Rapid_Response_Team': 'Rapid Response Team',
    'Crisis_Market_Adjustment': 'Crisis/Market Adjustment',
    'Senior_Nurse': 'Senior Nurse',
    'Sign_On_Bonus': 'Sign-On Bonus',
    'Retention_Bonus': 'Retention Bonus',
    'Referral_Bonus': 'Referral Bonus',
    'Completion_Bonus': 'Completion Bonus',
  };

  return displayNames[type] || type;
}

// New helper function for formatting differential values with clarity
export function formatDifferentialValue(value: number, unit: string, frequency: number) {
  // If frequency is 0, it's not applied
  if (frequency === 0 && !unit.includes('yes') && !unit.includes('binary')) {
    return {
      display: "Not Applied",
      description: "",
      color: "text-gray-500",
      tooltip: ""
    };
  }

  switch(true) {
    // Multiplier type - Holiday, Overtime, Call_Back etc
    case unit === 'multiplier':
      const percentBonus = ((value - 1) * 100).toFixed(0);
      // More intuitive display
      if (value === 1) {
        return {
          display: "Regular rate",
          description: "",
          tooltip: "No additional pay",
          color: "text-gray-600"
        };
      } else if (value === 1.5) {
        return {
          display: "1.5× rate",
          description: "Time and a half",
          tooltip: "50% extra on top of your regular pay",
          color: "text-emerald-600"
        };
      } else if (value === 2) {
        return {
          display: "2× rate",
          description: "Double time",
          tooltip: "Double your regular hourly rate",
          color: "text-emerald-600"
        };
      } else if (value === 2.5) {
        return {
          display: "2.5× rate",
          description: "Double and a half",
          tooltip: "150% extra on top of your regular pay",
          color: "text-emerald-600"
        };
      } else if (value === 3) {
        return {
          display: "3× rate",
          description: "Triple time",
          tooltip: "Triple your regular hourly rate",
          color: "text-emerald-600"
        };
      }
      // Default for other values
      return {
        display: `${value}× rate`,
        description: `+${percentBonus}% extra`,
        tooltip: `${value} times your regular hourly rate`,
        color: "text-emerald-600"
      };

    // Hourly differential - Night, Weekend, Charge_Nurse etc
    case unit === '$/hour':
      return {
        display: `+$${value}/hr`,
        description: "extra per hour",
        tooltip: `Additional $${value} per hour worked`,
        color: "text-blue-600"
      };

    // Percentage bonus - On_Call, Per_Diem_PRN etc
    case unit === 'percentage':
      const percent = (value * 100).toFixed(0);
      return {
        display: `+${percent}% of base`,
        description: "salary bonus",
        tooltip: `${percent}% of your base salary added`,
        color: "text-purple-600"
      };

    // Fixed amount - Short_Notice etc
    case unit.includes('$ fixed'):
      return {
        display: `+$${value}`,
        description: "per occurrence",
        tooltip: `$${value} bonus each time`,
        color: "text-orange-600"
      };

    // Per level - Clinical_Ladder
    case unit.includes('per level'):
      return {
        display: `+$${value}/hr`,
        description: `per level`,
        tooltip: `$${value} per hour for each advancement level`,
        color: "text-indigo-600"
      };

    // Per month fixed - bonus amounts
    case unit === '$/month':
      return {
        display: `+$${value}/mo`,
        description: "monthly bonus",
        tooltip: `$${value} added to monthly pay`,
        color: "text-green-600"
      };

    default:
      return {
        display: `$${value}`,
        description: unit,
        tooltip: "",
        color: "text-gray-600"
      };
  }
}

// Helper to calculate monthly contribution for each differential
export function calculateDifferentialMonthlyContribution(
  diff: DifferentialItem,
  config: DifferentialConfig | undefined,
  basePay: number
): number {
  if (!config) return 0;

  // Standard hours per month (assuming 173.33 hours)
  const HOURS_PER_MONTH = 173.33;
  const WEEKS_PER_MONTH = 4.33;
  const STANDARD_SHIFT_HOURS = 12;

  // Calculate based on unit type
  const { frequency, value } = diff;
  const { unit: valueUnit } = config.valueRange;
  const { unit: freqUnit } = config.frequencyRange;

  // If frequency is 0 or it's a "No" response, no contribution
  if (frequency === 0) return 0;

  // Calculate based on different patterns
  if (valueUnit === 'multiplier') {
    // For multipliers, we need to calculate based on frequency unit
    if (freqUnit.includes('hours/week')) {
      return frequency * WEEKS_PER_MONTH * basePay * (value - 1);
    } else if (freqUnit.includes('days/year')) {
      return ((frequency * STANDARD_SHIFT_HOURS) / 12) * basePay * (value - 1);
    } else if (freqUnit.includes('times/month')) {
      return frequency * 4 * basePay * value; // Assuming 4 hours per callback
    }
  } else if (valueUnit === '$/hour') {
    if (freqUnit.includes('days/week')) {
      return frequency * STANDARD_SHIFT_HOURS * WEEKS_PER_MONTH * value;
    } else if (freqUnit.includes('days/month')) {
      return frequency * STANDARD_SHIFT_HOURS * value;
    } else if (freqUnit.includes('yes')) {
      return HOURS_PER_MONTH * value;
    }
  } else if (valueUnit === 'percentage') {
    if (freqUnit.includes('days/month')) {
      return frequency * 24 * basePay * value; // On-call calculation
    } else if (freqUnit.includes('yes')) {
      return 96 * basePay * value; // PRN calculation (96 hours/month)
    }
  } else if (valueUnit.includes('$ fixed')) {
    return frequency * value; // Simple multiplication for fixed amounts
  }

  // Default fallback
  return 0;
}