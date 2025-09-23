import { useMemo } from 'react';
import { DIFFERENTIALS, UNIT_BASE_PAY } from '../../../../../utils/constants';
import { CompensationCalculator, SHIFT_PATTERNS } from 'src/utils/compensation';
import type { Criteria, PayEstimates } from '../types';

export function usePayCalculation(criteria: Criteria): PayEstimates {
  return useMemo(() => {
    const unitPay = UNIT_BASE_PAY[criteria.unitType];
    let basePay =
      unitPay.min +
      (Math.min(criteria.experienceYears, 20) * (unitPay.max - unitPay.min)) / 20;

    let diffs = 0;
    if (criteria.certifications.length > 0) {
      basePay += DIFFERENTIALS.CERTIFICATION;
    }
    if (criteria.preferNight) diffs += DIFFERENTIALS.NIGHT;
    if (criteria.preferWeekend) diffs += DIFFERENTIALS.WEEKEND;
    if (criteria.chargeNurse) diffs += DIFFERENTIALS.CHARGE;
    if (criteria.preceptorDuty) diffs += DIFFERENTIALS.PRECEPTOR;

    const totalHourly = basePay + diffs;

    // Use enhanced shift pattern detection
    let shiftHours = 12; // Default
    let weeklyHours = 36;

    if (criteria.shiftPattern === '3x12s') {
      shiftHours = 12;
      weeklyHours = SHIFT_PATTERNS[12].hoursPerWeek;
    } else if (criteria.shiftPattern === 'Baylor') {
      shiftHours = 12;
      weeklyHours = 24; // Special case - weekend only
    } else if (criteria.shiftPattern === '7on-7off') {
      shiftHours = 12;
      weeklyHours = 42; // Special case
    } else {
      // Default to 8-hour if not specified
      shiftHours = 8;
      weeklyHours = SHIFT_PATTERNS[8].hoursPerWeek;
    }

    const weeklyEarnings = totalHourly * weeklyHours;
    const totalEarnings = weeklyEarnings * criteria.totalWeeks;

    // Use standardized formatting
    return {
      basePay: basePay.toFixed(2),
      diffRate: diffs.toFixed(2),
      totalRate: totalHourly.toFixed(2),
      weeklyHours,
      weeklyEarnings: CompensationCalculator.formatCurrency(weeklyEarnings, 0).replace('$', ''),
      totalEarnings: CompensationCalculator.formatCurrency(totalEarnings, 0).replace('$', ''),
    };
  }, [criteria]);
}