import { useMemo } from 'react';
import { DIFFERENTIALS, UNIT_BASE_PAY } from '../../../../../utils/constants';
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

    let weeklyHours = 40;
    if (criteria.shiftPattern === '3x12s') {
      weeklyHours = 36;
    } else if (criteria.shiftPattern === 'Baylor') {
      weeklyHours = 24;
    } else if (criteria.shiftPattern === '7on-7off') {
      weeklyHours = 42;
    }

    const weeklyEarnings = totalHourly * weeklyHours;
    const totalEarnings = weeklyEarnings * criteria.totalWeeks;

    return {
      basePay: basePay.toFixed(2),
      diffRate: diffs.toFixed(2),
      totalRate: totalHourly.toFixed(2),
      weeklyHours,
      weeklyEarnings: weeklyEarnings.toFixed(2),
      totalEarnings: totalEarnings.toFixed(2),
    };
  }, [criteria]);
}