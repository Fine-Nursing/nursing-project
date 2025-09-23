// utils/constants.ts

export const SHIFT_PATTERNS = [
  {
    name: '3x12s',
    description: '3 Days per Week, 12-Hour Shifts',
    pattern: 'Work 3 x 12-hour shifts, then have 4 days off per week',
  },
  {
    name: '5x8s',
    description: '5 Days per Week, 8-Hour Shifts',
    pattern: 'Work 5 x 8-hour shifts, then have 2 days off per week',
  },
  {
    name: 'Baylor',
    description: 'Weekend-Focused Baylor Plan',
    pattern: '2 weekend shifts (12 hrs each), paid for 36 hours total',
  },
  {
    name: '7on-7off',
    description: '7 Days On, 7 Days Off',
    pattern: 'Work 7 consecutive 12-hr shifts, then 7 days completely off',
  },
  {
    name: 'Self-Scheduled',
    description: 'Flexible scheduling based on department needs',
    pattern: 'Organize your schedule within certain constraints',
  },
  {
    name: 'Block Scheduling',
    description: 'Fixed Weekly Days',
    pattern: 'e.g., always Monday-Wednesday-Friday',
  },
];

export const ROTATION_PATTERNS = [
  {
    name: 'Fixed',
    description: 'Always the same shift type',
  },
  {
    name: 'Rotating Day/Night',
    description: 'Alternate day and night shifts weekly',
  },
  {
    name: 'Forward Rotation',
    description: 'Day → Evening → Night (circadian-friendly)',
  },
  {
    name: 'Backward Rotation',
    description: 'Night → Evening → Day (less circadian-friendly)',
  },
];

// @deprecated - Use new DifferentialAPI instead
// These are legacy constants, kept for backward compatibility
// New system uses dynamic values from Backend API
export const DIFFERENTIALS = {
  NIGHT: 4.5,          // Legacy: static value
  WEEKEND: 3.75,       // Legacy: static value
  CHARGE: 2.5,         // Legacy: static value
  PRECEPTOR: 2.0,      // Legacy: static value
  CERTIFICATION: 1.5,  // Legacy: static value
  FLOAT_POOL: 5.0,     // Legacy: static value
  HOLIDAY: 7.5,        // Legacy: static value
};

// @deprecated - Use CompensationCalculator.toHourlyRate() instead
// These base pay ranges should come from Backend API

// Base pay
export const UNIT_BASE_PAY = {
  MedSurg: { min: 32, max: 45 },
  ICU: { min: 36, max: 52 },
  ER: { min: 35, max: 50 },
  'L&D': { min: 34, max: 49 },
  NICU: { min: 38, max: 54 },
  OR: { min: 37, max: 53 },
  Oncology: { min: 33, max: 48 },
  Pediatrics: { min: 32, max: 47 },
  Psych: { min: 33, max: 46 },
  'Float Pool': { min: 38, max: 55 },
};

export const HOLIDAYS = [
  { date: '2025-01-01', name: "New Year's Day" },
  { date: '2025-05-26', name: 'Memorial Day' },
  { date: '2025-07-04', name: 'Independence Day' },
  { date: '2025-09-01', name: 'Labor Day' },
  { date: '2025-11-27', name: 'Thanksgiving' },
  { date: '2025-12-25', name: 'Christmas' },
];

export const ACUITY_STAFFING = {
  MedSurg: { nurseToPatient: '1:5' },
  Telemetry: { nurseToPatient: '1:4' },
  ICU: { nurseToPatient: '1:2' },
  ER: { nurseToPatient: '1:3-4' },
  'L&D': { nurseToPatient: '1:2' },
  NICU: { nurseToPatient: '1:2-3' },
  Pediatrics: { nurseToPatient: '1:3-4' },
  Psychiatric: { nurseToPatient: '1:6' },
  OR: { nurseToPatient: '1:1' },

  // Add missing keys:
  Oncology: { nurseToPatient: '1:4' },
  Psych: { nurseToPatient: '1:6' }, // Or handle the same way
  'Float Pool': { nurseToPatient: 'N/A' }, // Arbitrary
};

export const CONTRACT_REQUIREMENTS = {
  maxConsecutiveDays: 6,
  minRestBetweenShifts: 10,
  maxHoursPerWeek: 60,
  maxHoursPerDay: 16,
  maxNightsPerWeek: 4,
  minBreakAfterNights: 48,
  overtimeThreshold: 40,
  doubleTimeThreshold: 12,
};
