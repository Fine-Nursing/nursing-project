/**
 * Enhanced Compensation Calculation Constants and Utilities V2
 *
 * Accurate calculations considering different shift patterns
 * and nursing-specific compensation structures
 */

// Shift-based work patterns
export const SHIFT_PATTERNS = {
  8: {
    hoursPerShift: 8,
    daysPerWeek: 5,
    hoursPerWeek: 40,
    hoursPerMonth: 173.33,  // (40 * 52) / 12
    hoursPerYear: 2080      // 40 * 52
  },
  12: {
    hoursPerShift: 12,
    daysPerWeek: 3,         // Standard 3-day work week for 12hr shifts
    hoursPerWeek: 36,
    hoursPerMonth: 156,      // (36 * 52) / 12
    hoursPerYear: 1872       // 36 * 52
  },
  16: {
    hoursPerShift: 16,
    daysPerWeek: 2,
    hoursPerWeek: 32,
    hoursPerMonth: 138.67,   // (32 * 52) / 12
    hoursPerYear: 1664       // 32 * 52
  }
} as const;

export const COMPENSATION_CONSTANTS = {
  // ⏰ Time-based Constants (Default 12-hour pattern)
  HOURS_PER_YEAR: SHIFT_PATTERNS[12].hoursPerYear,
  HOURS_PER_MONTH: SHIFT_PATTERNS[12].hoursPerMonth,
  HOURS_PER_WEEK: SHIFT_PATTERNS[12].hoursPerWeek,
  WEEKS_PER_YEAR: 52,
  WEEKS_PER_MONTH: 4.33,

  // 🏥 Nursing-specific Constants
  STANDARD_SHIFT_HOURS: 12,       // Most common nursing shift length
  ALTERNATIVE_SHIFT_HOURS: {
    SHORT: 8,                     // 8-hour shifts
    STANDARD: 12,                 // 12-hour shifts
    LONG: 16,                     // 16-hour shifts
  },

  // 💰 Pay Calculation Constants
  OVERTIME_MULTIPLIER: 1.5,       // Federal overtime rate
  DOUBLE_TIME_MULTIPLIER: 2.0,    // Double-time rate
  HOLIDAY_MULTIPLIER_MIN: 1.5,    // Minimum holiday pay
  HOLIDAY_MULTIPLIER_MAX: 2.0,    // Maximum holiday pay

  // 📊 Statistical Constants
  OUTLIER_THRESHOLD_PERCENTAGE: 0.3,  // 30% above median = outlier
  MIN_SAMPLE_SIZE: 10,                 // Minimum data points for reliable stats
  CONFIDENCE_HIGH_THRESHOLD: 3,       // 3+ differentials = high confidence
  CONFIDENCE_MEDIUM_THRESHOLD: 1,     // 1+ differentials = medium confidence

  // 🎯 Validation Ranges
  MIN_HOURLY_RATE: 15,            // Minimum nursing hourly rate
  MAX_HOURLY_RATE: 200,           // Maximum reasonable hourly rate
  MIN_ANNUAL_SALARY: 31200,       // 15 × 2080
  MAX_ANNUAL_SALARY: 416000,      // 200 × 2080

} as const;

/**
 * Enhanced Frontend utility class for shift-aware compensation calculations
 * Mirrors Backend EnhancedCompensationCalculator for consistency
 */
export class CompensationCalculator {
  /**
   * Get shift pattern based on shift hours
   */
  static getShiftPattern(shiftHours: number) {
    // Find closest pattern
    if (shiftHours <= 8) return SHIFT_PATTERNS[8];
    if (shiftHours <= 12) return SHIFT_PATTERNS[12];
    if (shiftHours <= 16) return SHIFT_PATTERNS[16];
    return SHIFT_PATTERNS[12]; // Default to 12-hour
  }

  /**
   * Convert annual salary to hourly rate considering shift pattern
   */
  static annualToHourly(annual: number, shiftHours: number = 12): number {
    const pattern = this.getShiftPattern(shiftHours);
    return Number((annual / pattern.hoursPerYear).toFixed(2));
  }

  /**
   * Convert hourly rate to annual salary considering shift pattern
   */
  static hourlyToAnnual(hourly: number, shiftHours: number = 12): number {
    const pattern = this.getShiftPattern(shiftHours);
    return Math.round(hourly * pattern.hoursPerYear);
  }

  /**
   * Convert hourly rate to monthly salary considering shift pattern
   */
  static hourlyToMonthly(hourly: number, shiftHours: number = 12): number {
    const pattern = this.getShiftPattern(shiftHours);
    return Number((hourly * pattern.hoursPerMonth).toFixed(2));
  }

  /**
   * Convert monthly salary to hourly rate considering shift pattern
   */
  static monthlyToHourly(monthly: number, shiftHours: number = 12): number {
    const pattern = this.getShiftPattern(shiftHours);
    return Number((monthly / pattern.hoursPerMonth).toFixed(2));
  }

  /**
   * Convert any pay unit to hourly rate considering shift pattern
   */
  static toHourlyRate(amount: number, unit: string, shiftHours: number = 12): number {
    const pattern = this.getShiftPattern(shiftHours);

    switch (unit.toLowerCase()) {
      case 'hourly':
        return amount;
      case 'annual':
      case 'yearly':
        return Number((amount / pattern.hoursPerYear).toFixed(2));
      case 'monthly':
        return Number((amount / pattern.hoursPerMonth).toFixed(2));
      default:
        // Auto-detect based on amount size
        if (amount < 200) {
          return amount; // Likely hourly
        } else if (amount < 10000) {
          return Number((amount / pattern.hoursPerMonth).toFixed(2)); // Likely monthly
        } else {
          return Number((amount / pattern.hoursPerYear).toFixed(2)); // Likely annual
        }
    }
  }

  /**
   * Validate if compensation amount is reasonable
   */
  static validateCompensation(amount: number, unit: string, shiftHours: number = 12): boolean {
    const hourlyRate = this.toHourlyRate(amount, unit, shiftHours);
    return hourlyRate >= COMPENSATION_CONSTANTS.MIN_HOURLY_RATE &&
           hourlyRate <= COMPENSATION_CONSTANTS.MAX_HOURLY_RATE;
  }

  /**
   * Check if compensation is an outlier
   */
  static isOutlier(amount: number, median: number): boolean {
    return amount > median * (1 + COMPENSATION_CONSTANTS.OUTLIER_THRESHOLD_PERCENTAGE);
  }

  /**
   * Calculate confidence level for compensation data
   */
  static getConfidenceLevel(differentialCount: number): 'HIGH' | 'MEDIUM' | 'LOW' {
    if (differentialCount >= COMPENSATION_CONSTANTS.CONFIDENCE_HIGH_THRESHOLD) {
      return 'HIGH';
    } else if (differentialCount >= COMPENSATION_CONSTANTS.CONFIDENCE_MEDIUM_THRESHOLD) {
      return 'MEDIUM';
    } else {
      return 'LOW';
    }
  }

  /**
   * Format currency for display
   */
  static formatCurrency(amount: number, decimals: number = 0): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  }

  /**
   * Calculate effective hourly rate including all differentials
   */
  static calculateEffectiveHourlyRate(
    baseHourly: number,
    totalMonthlyDifferentials: number,
    shiftHours: number = 12
  ): number {
    const monthlyBase = this.hourlyToMonthly(baseHourly, shiftHours);
    const totalMonthly = monthlyBase + totalMonthlyDifferentials;
    return this.monthlyToHourly(totalMonthly, shiftHours);
  }

  /**
   * Calculate total compensation breakdown considering shift patterns
   */
  static calculateCompensationBreakdown(
    basePay: number,
    basePayUnit: string,
    monthlyDifferentials: number = 0,
    shiftHours: number = 12
  ) {
    const pattern = this.getShiftPattern(shiftHours);
    const baseHourly = this.toHourlyRate(basePay, basePayUnit, shiftHours);
    const baseMonthly = this.hourlyToMonthly(baseHourly, shiftHours);
    const baseAnnual = this.hourlyToAnnual(baseHourly, shiftHours);

    const differentialAnnual = monthlyDifferentials * 12;
    const totalMonthly = baseMonthly + monthlyDifferentials;
    const totalAnnual = baseAnnual + differentialAnnual;
    const totalHourly = this.monthlyToHourly(totalMonthly, shiftHours);

    return {
      // Base compensation
      baseHourly: Number(baseHourly.toFixed(2)),
      baseMonthly: Number(baseMonthly.toFixed(2)),
      baseAnnual: Math.round(baseAnnual),

      // Differential compensation
      differentialMonthly: Number(monthlyDifferentials.toFixed(2)),
      differentialAnnual: Math.round(differentialAnnual),

      // Total compensation
      totalHourly: Number(totalHourly.toFixed(2)),
      totalMonthly: Number(totalMonthly.toFixed(2)),
      totalAnnual: Math.round(totalAnnual),
      effectiveHourlyRate: Number(totalHourly.toFixed(2)),

      // Meta information
      shiftHours,
      monthlyWorkHours: pattern.hoursPerMonth,
      annualWorkHours: pattern.hoursPerYear,
      daysPerWeek: pattern.daysPerWeek
    };
  }

  /**
   * Legacy calculation methods for backward compatibility
   * @deprecated Use the new methods above
   */
  static legacyCalculateTotalDifferentials(differentials: Array<{amount: number, unit?: string}>) {
    return differentials.reduce(
      (totals, diff) => {
        if (diff.unit === 'annual') {
          totals.annual += diff.amount;
        } else {
          totals.hourly += diff.amount;
          totals.annual = totals.hourly * COMPENSATION_CONSTANTS.HOURS_PER_YEAR;
        }
        return totals;
      },
      { hourly: 0, annual: 0 }
    );
  }
}

/**
 * Type definitions for compensation calculations
 */
export interface CompensationBreakdown {
  // Base compensation
  baseHourly: number;
  baseMonthly: number;
  baseAnnual: number;

  // Differential compensation
  differentialMonthly: number;
  differentialAnnual: number;

  // Total compensation
  totalHourly: number;
  totalMonthly: number;
  totalAnnual: number;
  effectiveHourlyRate: number;

  // Meta information
  shiftHours: number;
  monthlyWorkHours: number;
  annualWorkHours: number;
  daysPerWeek: number;
}

/**
 * Validation utilities
 */
export function validateHourlyRate(rate: number): boolean {
  return rate >= COMPENSATION_CONSTANTS.MIN_HOURLY_RATE &&
         rate <= COMPENSATION_CONSTANTS.MAX_HOURLY_RATE;
}

export function validateAnnualSalary(salary: number, shiftHours: number = 12): boolean {
  const pattern = CompensationCalculator.getShiftPattern(shiftHours);
  const minAnnual = COMPENSATION_CONSTANTS.MIN_HOURLY_RATE * pattern.hoursPerYear;
  const maxAnnual = COMPENSATION_CONSTANTS.MAX_HOURLY_RATE * pattern.hoursPerYear;
  return salary >= minAnnual && salary <= maxAnnual;
}

export function validateMonthlySalary(salary: number, shiftHours: number = 12): boolean {
  const pattern = CompensationCalculator.getShiftPattern(shiftHours);
  const minMonthly = COMPENSATION_CONSTANTS.MIN_HOURLY_RATE * pattern.hoursPerMonth;
  const maxMonthly = COMPENSATION_CONSTANTS.MAX_HOURLY_RATE * pattern.hoursPerMonth;
  return salary >= minMonthly && salary <= maxMonthly;
}