// utils/generateNurseSchedule.ts

import { DIFFERENTIALS, UNIT_BASE_PAY, HOLIDAYS } from './constants';

type UnitKey = keyof typeof UNIT_BASE_PAY;
// Type example
interface GenerateNurseScheduleOptions {
  startDate: Date;
  totalWeeks: number;
  shiftPattern: string;
  unitType: UnitKey; // Use UnitKey here instead of string!
  maxWeeklyHours: number;
  preferNight: boolean;
  maxConsecutiveShifts: number;
  rotationPattern: string;
  certifications: string[];
  experienceYears: number;
  selfScheduled: boolean;
  requestedDaysOff: string[];
  chargeNurse: boolean;
  preceptorDuty: boolean;
}

// 1) Declare scheduleShift function first
function scheduleShift(
  date: Date,
  isNightShift: boolean,
  hours: number,
  basePay: number,
  chargeNurse: boolean,
  preceptorDuty: boolean
) {
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const dateStr = date.toISOString().slice(0, 10);
  const isHoliday = HOLIDAYS.some((h) => h.date === dateStr);

  let shiftLabel = '';
  let shiftCode = '';
  let startHour = 7; // Default Day shift

  // Avoid no-lonely-if rule: use if/else if/else format
  if (hours === 12 && isNightShift) {
    startHour = 19;
    shiftLabel = isWeekend ? 'Weekend Night (7PM-7AM)' : 'Night (7PM-7AM)';
    shiftCode = isWeekend ? 'WN' : 'N';
  } else if (hours === 12 && !isNightShift) {
    startHour = 7;
    shiftLabel = isWeekend ? 'Weekend Day (7AM-7PM)' : 'Day (7AM-7PM)';
    shiftCode = isWeekend ? 'WD' : 'D';
  } else if (hours !== 12 && isNightShift) {
    // 8 hours + Night
    startHour = 23;
    shiftLabel = isWeekend ? 'Weekend NOC (11PM-7AM)' : 'NOC (11PM-7AM)';
    shiftCode = isWeekend ? 'WNOC' : 'NOC';
  } else {
    // 8 hours + Day
    startHour = 7;
    shiftLabel = isWeekend ? 'Weekend AM (7AM-3PM)' : 'AM (7AM-3PM)';
    shiftCode = isWeekend ? 'WA' : 'A';
  }

  const shiftStart = new Date(date);
  shiftStart.setHours(startHour, 0, 0, 0);
  const shiftEnd = new Date(shiftStart);
  shiftEnd.setHours(shiftStart.getHours() + hours);

  // Calculate differentials
  let diffAmt = 0;
  const diffList: string[] = [];

  if (isNightShift) {
    diffAmt += DIFFERENTIALS.NIGHT;
    diffList.push(`Night: +$${DIFFERENTIALS.NIGHT.toFixed(2)}`);
  }
  if (isWeekend) {
    diffAmt += DIFFERENTIALS.WEEKEND;
    diffList.push(`Weekend: +$${DIFFERENTIALS.WEEKEND.toFixed(2)}`);
  }
  if (isHoliday) {
    diffAmt += DIFFERENTIALS.HOLIDAY;
    diffList.push(`Holiday: +$${DIFFERENTIALS.HOLIDAY.toFixed(2)}`);
  }
  if (chargeNurse) {
    diffAmt += DIFFERENTIALS.CHARGE;
    diffList.push(`Charge: +$${DIFFERENTIALS.CHARGE.toFixed(2)}`);
  }
  if (preceptorDuty) {
    diffAmt += DIFFERENTIALS.PRECEPTOR;
    diffList.push(`Preceptor: +$${DIFFERENTIALS.PRECEPTOR.toFixed(2)}`);
  }

  const hourlyRate = basePay + diffAmt;
  const earnings = hourlyRate * hours;

  const event = {
    title: `${shiftCode}: ${shiftLabel}`,
    start: shiftStart,
    end: shiftEnd,
    resource: {
      earning: earnings,
      hourlyRate,
      basePay,
      differentials: diffList,
      hours,
      isHoliday,
    },
  };

  return { event, earnings };
}

// 2) generateNurseSchedule function
function generateNurseSchedule(opts: GenerateNurseScheduleOptions) {
  const {
    startDate,
    totalWeeks,
    shiftPattern,
    unitType,
    maxWeeklyHours,
    preferNight,
    maxConsecutiveShifts,
    rotationPattern,
    certifications,
    experienceYears,
    selfScheduled,
    requestedDaysOff,
    chargeNurse,
    preceptorDuty,
  } = opts;

  const events: any[] = [];
  let totalEarnings = 0;

  const dayMs = 24 * 60 * 60 * 1000;

  // Calculate base pay
  const unitPay = UNIT_BASE_PAY[unitType] || UNIT_BASE_PAY.MedSurg;
  let basePay =
    unitPay.min +
    (Math.min(experienceYears, 20) * (unitPay.max - unitPay.min)) / 20;

  if (certifications && certifications.length > 0) {
    basePay += DIFFERENTIALS.CERTIFICATION;
  }

  // Default shiftDuration = 8
  let shiftDuration = 8;
  if (
    shiftPattern === '3x12s' ||
    shiftPattern === '7on-7off' ||
    shiftPattern === 'Baylor'
  ) {
    shiftDuration = 12;
  }

  // Off dates
  const offTimestamps = (requestedDaysOff || []).map((d) =>
    new Date(d).getTime()
  );

  let currentDate = new Date(startDate);
  let currentShiftType = preferNight ? 'night' : 'day';
  let consecutiveShifts = 0;

  // no-plusplus -> += 1
  for (let w = 0; w < totalWeeks; w += 1) {
    let weeklyHours = 0;

    // Handle 7on-7off pattern
    if (shiftPattern === '7on-7off') {
      const isOnWeek = w % 2 === 0;
      if (isOnWeek) {
        for (let d = 0; d < 7; d += 1) {
          const { event, earnings } = scheduleShift(
            currentDate,
            currentShiftType === 'night',
            shiftDuration,
            basePay,
            chargeNurse,
            preceptorDuty
          );
          events.push(event);
          totalEarnings += earnings;
          currentDate = new Date(currentDate.getTime() + dayMs);
        }
      } else {
        // off week (skip 7 days)
        currentDate = new Date(currentDate.getTime() + 7 * dayMs);
      }
    } else {
      // Other patterns
      for (let d = 0; d < 7; d += 1) {
        if (weeklyHours + shiftDuration <= maxWeeklyHours) {
          const dayStamp = currentDate.getTime();
          if (!offTimestamps.includes(dayStamp)) {
            // Non-holiday date
            let isWorkDay = false;

            if (shiftPattern === '5x8s' && d < 5) {
              isWorkDay = true;
            } else if (shiftPattern === '3x12s') {
              isWorkDay = d % 2 === 0 && d < 6;
            } else if (shiftPattern === 'Baylor') {
              isWorkDay = d === 5 || d === 6;
            } else if (shiftPattern === 'Block Scheduling') {
              // Mon-Wed-Fri
              isWorkDay = d === 1 || d === 3 || d === 5;
            } else if (shiftPattern === 'Self-Scheduled' && selfScheduled) {
              isWorkDay = d % 3 !== 0;
            }

            if (isWorkDay) {
              // Check consecutive shifts
              if (consecutiveShifts >= maxConsecutiveShifts) {
                isWorkDay = false;
                consecutiveShifts = 0;
              } else {
                consecutiveShifts += 1;
              }
            } else {
              consecutiveShifts = 0;
            }

            if (isWorkDay) {
              const { event, earnings } = scheduleShift(
                currentDate,
                currentShiftType === 'night',
                shiftDuration,
                basePay,
                chargeNurse,
                preceptorDuty
              );
              events.push(event);
              totalEarnings += earnings;
              weeklyHours += shiftDuration;

              // rotationPattern
              if (rotationPattern !== 'Fixed' && consecutiveShifts >= 3) {
                currentShiftType =
                  currentShiftType === 'night' ? 'day' : 'night';
                consecutiveShifts = 0;
              }
            }
          } else {
            // Off date
            consecutiveShifts = 0;
          }
        }
        // Skip shift if maxWeeklyHours exceeded
        currentDate = new Date(currentDate.getTime() + dayMs);
      }
    }
  }

  return { events, totalEarnings };
}

export default generateNurseSchedule;
