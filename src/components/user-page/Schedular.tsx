import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import {
  Calendar as CalendarIcon,
  X as CloseIcon,
  Moon,
  Sun,
} from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-datepicker/dist/react-datepicker.css';

// -------------------------------------
// 1) SHIFT / PATTERN / PAY SETTINGS
// -------------------------------------

const SHIFT_PATTERNS = [
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

const ROTATION_PATTERNS = [
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

// Pay Differentials
const DIFFERENTIALS = {
  NIGHT: 4.5,
  WEEKEND: 3.75,
  CHARGE: 2.5,
  PRECEPTOR: 2.0,
  CERTIFICATION: 1.5,
  FLOAT_POOL: 5.0,
  HOLIDAY: 7.5,
};

// Base Pay Ranges
const UNIT_BASE_PAY = {
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

// Example holiday dates
const HOLIDAYS = [
  { date: '2025-01-01', name: "New Year's Day" },
  { date: '2025-05-26', name: 'Memorial Day' },
  { date: '2025-07-04', name: 'Independence Day' },
  { date: '2025-09-01', name: 'Labor Day' },
  { date: '2025-11-27', name: 'Thanksgiving' },
  { date: '2025-12-25', name: 'Christmas' },
];

// Acuity-based staffing ratios (for display only)
const ACUITY_STAFFING = {
  MedSurg: { nurseToPatient: '1:5' },
  Telemetry: { nurseToPatient: '1:4' },
  ICU: { nurseToPatient: '1:2' },
  ER: { nurseToPatient: '1:3-4' },
  'L&D': { nurseToPatient: '1:2' },
  NICU: { nurseToPatient: '1:2-3' },
  Pediatrics: { nurseToPatient: '1:3-4' },
  Psychiatric: { nurseToPatient: '1:6' },
  OR: { nurseToPatient: '1:1' },
};

// Example contract constraints (not fully enforced)
const CONTRACT_REQUIREMENTS = {
  maxConsecutiveDays: 6,
  minRestBetweenShifts: 10,
  maxHoursPerWeek: 60,
  maxHoursPerDay: 16,
  maxNightsPerWeek: 4,
  minBreakAfterNights: 48,
  overtimeThreshold: 40,
  doubleTimeThreshold: 12,
};

const localizer = momentLocalizer(moment);

// -------------------------------------
// 2) SCHEDULE GENERATION FUNCTION
// -------------------------------------
function generateNurseSchedule(opts) {
  const {
    startDate,
    totalWeeks,
    shiftPattern,
    unitType,
    maxWeeklyHours,
    preferNight,
    preferWeekend,
    maxConsecutiveShifts,
    rotationPattern,
    certifications,
    experienceYears,
    selfScheduled,
    requestedDaysOff,
    chargeNurse,
    preceptorDuty,
  } = opts;

  const events = [];
  let totalEarnings = 0;
  const dayMs = 24 * 60 * 60 * 1000;

  // Base pay from experience + unit
  const unitPay = UNIT_BASE_PAY[unitType] || UNIT_BASE_PAY.MedSurg;
  let basePay =
    unitPay.min +
    (Math.min(experienceYears, 20) * (unitPay.max - unitPay.min)) / 20;

  // Add certification differential if any
  if (certifications && certifications.length > 0) {
    basePay += DIFFERENTIALS.CERTIFICATION;
  }

  // Shifts/week + shift length by pattern
  let shiftsPerWeek = 5;
  let shiftDuration = 8;
  if (shiftPattern === '3x12s') {
    shiftsPerWeek = 3;
    shiftDuration = 12;
  } else if (shiftPattern === '7on-7off') {
    shiftsPerWeek = 7;
    shiftDuration = 12;
  } else if (shiftPattern === 'Baylor') {
    shiftsPerWeek = 2;
    shiftDuration = 12;
  }

  // Convert requested off days
  const offTimestamps = (requestedDaysOff || []).map((d) =>
    new Date(d).getTime()
  );

  let currentDate = new Date(startDate);
  let currentShiftType = preferNight ? 'night' : 'day';
  let consecutiveShifts = 0;
  let weeklyHours = 0;

  for (let w = 0; w < totalWeeks; w++) {
    weeklyHours = 0;

    // 7on-7off logic
    if (shiftPattern === '7on-7off') {
      const isOnWeek = w % 2 === 0;
      if (isOnWeek) {
        for (let d = 0; d < 7; d++) {
          const shiftData = scheduleShift(currentDate, preferNight, shiftDuration);
          events.push(shiftData.event);
          totalEarnings += shiftData.earnings;
          currentDate = new Date(currentDate.getTime() + dayMs);
        }
      } else {
        // off week
        currentDate = new Date(currentDate.getTime() + 7 * dayMs);
      }
      continue;
    }

    // Other patterns
    for (let d = 0; d < 7; d++) {
      if (weeklyHours + shiftDuration > maxWeeklyHours) {
        currentDate = new Date(currentDate.getTime() + dayMs);
        continue;
      }

      const dayStamp = currentDate.getTime();
      if (offTimestamps.includes(dayStamp)) {
        // skip requested off
        currentDate = new Date(currentDate.getTime() + dayMs);
        continue;
      }

      let isWorkDay = false;

      if (shiftPattern === '5x8s' && d < 5) {
        isWorkDay = true; // Mon-Fri
      } else if (shiftPattern === '3x12s') {
        isWorkDay = d % 2 === 0 && d < 6;
      } else if (shiftPattern === 'Baylor') {
        isWorkDay = d === 5 || d === 6; // weekend
      } else if (shiftPattern === 'Block Scheduling') {
        // Example: M-W-F
        isWorkDay = d === 0 || d === 2 || d === 4;
      } else if (shiftPattern === 'Self-Scheduled' && selfScheduled) {
        // naive example
        isWorkDay = d % 3 !== 0;
      }

      // Consecutive shift check
      if (isWorkDay) {
        if (consecutiveShifts >= maxConsecutiveShifts) {
          isWorkDay = false;
          consecutiveShifts = 0;
        } else {
          consecutiveShifts++;
        }
      } else {
        consecutiveShifts = 0;
      }

      if (isWorkDay) {
        const shiftData = scheduleShift(
          currentDate,
          currentShiftType === 'night',
          shiftDuration
        );
        events.push(shiftData.event);
        totalEarnings += shiftData.earnings;
        weeklyHours += shiftDuration;

        // rotation after 3 consecutive shifts
        if (rotationPattern !== 'Fixed' && consecutiveShifts >= 3) {
          currentShiftType = currentShiftType === 'night' ? 'day' : 'night';
          consecutiveShifts = 0;
        }
      }
      currentDate = new Date(currentDate.getTime() + dayMs);
    }
  }

  return { events, totalEarnings };

  // Helper
  function scheduleShift(date, isNightShift, hours) {
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const dateStr = date.toISOString().slice(0, 10);
    const isHoliday = HOLIDAYS.some((h) => h.date === dateStr);

    let shiftLabel; let shiftCode; let startHour;
    if (hours === 12) {
      if (isNightShift) {
        startHour = 19; // 7 pm
        shiftLabel = isWeekend ? 'Weekend Night (7PM-7AM)' : 'Night (7PM-7AM)';
        shiftCode = isWeekend ? 'WN' : 'N';
      } else {
        startHour = 7; // 7 am
        shiftLabel = isWeekend ? 'Weekend Day (7AM-7PM)' : 'Day (7AM-7PM)';
        shiftCode = isWeekend ? 'WD' : 'D';
      }
    } else {
      // 8-hr
      if (isNightShift) {
        startHour = 23; // 11 pm
        shiftLabel = isWeekend ? 'Weekend NOC (11PM-7AM)' : 'NOC (11PM-7AM)';
        shiftCode = isWeekend ? 'WNOC' : 'NOC';
      } else {
        // random AM/PM
        const isAfternoon = Math.random() > 0.5;
        if (isAfternoon) {
          startHour = 15; // 3 pm
          shiftLabel = isWeekend ? 'Weekend PM (3PM-11PM)' : 'PM (3PM-11PM)';
          shiftCode = isWeekend ? 'WP' : 'P';
        } else {
          startHour = 7; // 7 am
          shiftLabel = isWeekend ? 'Weekend AM (7AM-3PM)' : 'AM (7AM-3PM)';
          shiftCode = isWeekend ? 'WA' : 'A';
        }
      }
    }

    const shiftStart = new Date(date);
    shiftStart.setHours(startHour, 0, 0, 0);
    const shiftEnd = new Date(shiftStart);
    shiftEnd.setHours(shiftStart.getHours() + hours);

    let diffAmt = 0;
    const diffList = [];
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
}

// -------------------------------------
// 3) FORM COMPONENT
// -------------------------------------
function EnhancedShiftCriteriaForm({ onGenerateSchedule, theme }) {
  const [criteria, setCriteria] = useState({
    shiftPattern: '3x12s',
    rotationPattern: 'Fixed',
    unitType: 'ICU',
    experienceYears: 3,
    totalWeeks: 4,
    maxConsecutiveShifts: 3,
    minRestBetweenShifts: 10,
    preferNight: false,
    preferWeekend: false,
    chargeNurse: false,
    preceptorDuty: false,
    maxWeeklyHours: 40,
    startDate: new Date(),
    certifications: [],
    requestedDaysOff: [],
    selfScheduled: false,
  });

  const [selectedDaysOff, setSelectedDaysOff] = useState([]);

  // Quick pay estimate
  const calculateEstimatedPay = () => {
    const unitPay = UNIT_BASE_PAY[criteria.unitType] || UNIT_BASE_PAY.MedSurg;
    let basePay =
      unitPay.min +
      (Math.min(criteria.experienceYears, 20) * (unitPay.max - unitPay.min)) /
        20;

    let diffs = 0;
    if (criteria.certifications && criteria.certifications.length > 0) {
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
      weeklyHours = 42; // average
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
  };

  const payEstimates = calculateEstimatedPay();

  // Form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setCriteria((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'select-multiple') {
      const arr = [];
      for (const opt of e.target.options) {
        if (opt.selected) arr.push(opt.value);
      }
      setCriteria((prev) => ({ ...prev, [name]: arr }));
    } else {
      setCriteria((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Numeric
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setCriteria((prev) => ({ ...prev, [name]: parseInt(value, 10) }));
  };

  // Start date
  const handleDateChange = (date) => {
    setCriteria((prev) => ({ ...prev, startDate: date }));
  };

  // Days off
  const handleDayOffSelect = (date) => {
    if (!date) return;
    const dateStr = date.toISOString().slice(0, 10);
    const idx = selectedDaysOff.findIndex(
      (d) => d.toISOString().slice(0, 10) === dateStr
    );
    if (idx >= 0) {
      const updated = [...selectedDaysOff];
      updated.splice(idx, 1);
      setSelectedDaysOff(updated);
      setCriteria((prev) => ({
        ...prev,
        requestedDaysOff: updated.map((d) => d.toISOString().slice(0, 10)),
      }));
    } else {
      const updated = [...selectedDaysOff, date];
      setSelectedDaysOff(updated);
      setCriteria((prev) => ({
        ...prev,
        requestedDaysOff: updated.map((d) => d.toISOString().slice(0, 10)),
      }));
    }
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onGenerateSchedule) {
      onGenerateSchedule(criteria);
    }
  };

  return (
    <div
      className={`${
        theme === 'light'
          ? 'bg-teal-50 border-teal-100'
          : 'bg-slate-700 border-slate-600 text-white'
      } border rounded-lg p-4 mb-6`}
    >
      <h3
        className={`font-bold mb-3 flex items-center ${
          theme === 'light' ? 'text-teal-700' : 'text-teal-300'
        }`}
      >
        <CalendarIcon
          className={`w-5 h-5 mr-1 ${
            theme === 'light' ? 'text-teal-500' : 'text-teal-300'
          }`}
        />
        Nurse Scheduling Criteria
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* SHIFT PATTERN & UNIT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* SHIFT PATTERN */}
          <div
            className={`p-3 rounded-lg border shadow-sm ${
              theme === 'light'
                ? 'bg-white border-gray-100'
                : 'bg-slate-800 border-slate-600'
            }`}
          >
            <label className="block mb-1 text-sm font-medium">
              Shift Pattern
            </label>
            <select
              name="shiftPattern"
              value={criteria.shiftPattern}
              onChange={handleChange}
              className={`w-full p-2 border rounded text-sm ${
                theme === 'light'
                  ? 'border-gray-200'
                  : 'border-slate-500 bg-slate-700 text-white'
              }`}
            >
              {SHIFT_PATTERNS.map((pat) => (
                <option key={pat.name} value={pat.name}>
                  {pat.name} – {pat.description}
                </option>
              ))}
            </select>
            <div className="text-xs mt-1 opacity-80">
              {
                SHIFT_PATTERNS.find((p) => p.name === criteria.shiftPattern)
                  ?.pattern
              }
            </div>
          </div>

          {/* UNIT TYPE */}
          <div
            className={`p-3 rounded-lg border shadow-sm ${
              theme === 'light'
                ? 'bg-white border-gray-100'
                : 'bg-slate-800 border-slate-600'
            }`}
          >
            <label className="block mb-1 text-sm font-medium">Unit Type</label>
            <select
              name="unitType"
              value={criteria.unitType}
              onChange={handleChange}
              className={`w-full p-2 border rounded text-sm ${
                theme === 'light'
                  ? 'border-gray-200'
                  : 'border-slate-500 bg-slate-700 text-white'
              }`}
            >
              {Object.keys(UNIT_BASE_PAY).map((unit) => (
                <option key={unit} value={unit}>
                  {unit} (${UNIT_BASE_PAY[unit].min} - $
                  {UNIT_BASE_PAY[unit].max}/hr)
                </option>
              ))}
            </select>
            <div className="text-xs mt-1 opacity-80">
              Nurse-to-Patient Ratio:{' '}
              {ACUITY_STAFFING[criteria.unitType]?.nurseToPatient}
            </div>
          </div>
        </div>

        {/* ROTATION & EXPERIENCE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* ROTATION */}
          <div
            className={`p-3 rounded-lg border shadow-sm ${
              theme === 'light'
                ? 'bg-white border-gray-100'
                : 'bg-slate-800 border-slate-600'
            }`}
          >
            <label className="block mb-1 text-sm font-medium">
              Rotation Pattern
            </label>
            <select
              name="rotationPattern"
              value={criteria.rotationPattern}
              onChange={handleChange}
              className={`w-full p-2 border rounded text-sm ${
                theme === 'light'
                  ? 'border-gray-200'
                  : 'border-slate-500 bg-slate-700 text-white'
              }`}
            >
              {ROTATION_PATTERNS.map((rot) => (
                <option key={rot.name} value={rot.name}>
                  {rot.name} – {rot.description}
                </option>
              ))}
            </select>
          </div>

          {/* EXPERIENCE */}
          <div
            className={`p-3 rounded-lg border shadow-sm ${
              theme === 'light'
                ? 'bg-white border-gray-100'
                : 'bg-slate-800 border-slate-600'
            }`}
          >
            <label className="block mb-1 text-sm font-medium">
              Years of RN Experience
            </label>
            <input
              type="number"
              name="experienceYears"
              min={0}
              max={30}
              value={criteria.experienceYears}
              onChange={handleNumberChange}
              className={`w-full p-2 border rounded text-sm ${
                theme === 'light'
                  ? 'border-gray-200'
                  : 'border-slate-500 bg-slate-700 text-white'
              }`}
            />
          </div>
        </div>

        {/* PERSONAL PREFERENCES */}
        <div
          className={`p-3 rounded-lg border shadow-sm ${
            theme === 'light'
              ? 'bg-white border-gray-100'
              : 'bg-slate-800 border-slate-600'
          }`}
        >
          <label className="block mb-1 text-sm font-medium">
            Additional Preferences
          </label>
          <div className="flex flex-wrap gap-4 mt-2 text-sm">
            <div>
              <input
                type="checkbox"
                name="preferNight"
                id="preferNight"
                checked={criteria.preferNight}
                onChange={handleChange}
                className="mr-1"
              />
              <label htmlFor="preferNight">
                Prefer Night (+${DIFFERENTIALS.NIGHT.toFixed(2)}/hr)
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                name="preferWeekend"
                id="preferWeekend"
                checked={criteria.preferWeekend}
                onChange={handleChange}
                className="mr-1"
              />
              <label htmlFor="preferWeekend">
                Prefer Weekend (+${DIFFERENTIALS.WEEKEND.toFixed(2)}/hr)
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                name="chargeNurse"
                id="chargeNurse"
                checked={criteria.chargeNurse}
                onChange={handleChange}
                className="mr-1"
              />
              <label htmlFor="chargeNurse">
                Charge Nurse (+${DIFFERENTIALS.CHARGE.toFixed(2)}/hr)
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                name="preceptorDuty"
                id="preceptorDuty"
                checked={criteria.preceptorDuty}
                onChange={handleChange}
                className="mr-1"
              />
              <label htmlFor="preceptorDuty">
                Preceptor (+${DIFFERENTIALS.PRECEPTOR.toFixed(2)}/hr)
              </label>
            </div>
          </div>

          {/* Certifications */}
          <div className="mt-3">
            <label className="block mb-1 text-sm font-medium">
              Certifications
            </label>
            <select
              name="certifications"
              multiple
              value={criteria.certifications}
              onChange={handleChange}
              className={`w-full p-2 border rounded text-sm h-20 ${
                theme === 'light'
                  ? 'border-gray-200'
                  : 'border-slate-500 bg-slate-700 text-white'
              }`}
            >
              <option value="ACLS">ACLS</option>
              <option value="PALS">PALS</option>
              <option value="CCRN">CCRN</option>
              <option value="CEN">CEN</option>
              <option value="CNOR">CNOR</option>
              <option value="OCN">OCN</option>
              <option value="RNC-OB">RNC-OB</option>
            </select>
            <p className="text-xs mt-1 opacity-80">
              Each cert adds +${DIFFERENTIALS.CERTIFICATION}/hr
            </p>
          </div>
        </div>

        {/* CONTRACT CONSTRAINTS / SCHEDULE TIMING */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Days Off */}
          <div
            className={`p-3 rounded-lg border shadow-sm ${
              theme === 'light'
                ? 'bg-white border-gray-100'
                : 'bg-slate-800 border-slate-600'
            }`}
          >
            <label className="block mb-1 text-sm font-medium">
              Requested Days Off
            </label>
            <div
              className={`border rounded p-2 text-sm ${
                theme === 'light' ? 'border-gray-200' : 'border-slate-500'
              }`}
            >
              <DatePicker
                inline
                selected={null}
                onChange={handleDayOffSelect}
                highlightDates={selectedDaysOff}
                className="mb-2"
              />
              <div className="flex flex-wrap gap-1">
                {selectedDaysOff.map((date, idx) => (
                  <div
                    key={idx}
                    className="text-xs px-2 py-1 rounded-full flex items-center bg-pink-100 text-pink-700"
                  >
                    {date.toLocaleDateString()}
                    <button
                      type="button"
                      className="ml-1 hover:text-pink-900"
                      onClick={() => handleDayOffSelect(date)}
                    >
                      <CloseIcon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {selectedDaysOff.length === 0 && (
                  <p className="text-xs opacity-60">Click any date to request off</p>
                )}
              </div>
            </div>
          </div>

          {/* Duration & Constraints */}
          <div
            className={`p-3 rounded-lg border shadow-sm space-y-3 ${
              theme === 'light'
                ? 'bg-white border-gray-100'
                : 'bg-slate-800 border-slate-600'
            }`}
          >
            <div>
              <label className="block mb-1 text-sm font-medium">
                Schedule Duration (Weeks)
              </label>
              <input
                type="number"
                name="totalWeeks"
                min={1}
                max={12}
                value={criteria.totalWeeks}
                onChange={handleNumberChange}
                className={`w-full p-2 border rounded text-sm ${
                  theme === 'light'
                    ? 'border-gray-200'
                    : 'border-slate-500 bg-slate-700 text-white'
                }`}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Max Consecutive Shifts
              </label>
              <input
                type="number"
                name="maxConsecutiveShifts"
                min={1}
                max={7}
                value={criteria.maxConsecutiveShifts}
                onChange={handleNumberChange}
                className={`w-full p-2 border rounded text-sm ${
                  theme === 'light'
                    ? 'border-gray-200'
                    : 'border-slate-500 bg-slate-700 text-white'
                }`}
              />
              <p className="text-xs mt-1 opacity-80">
                Up to {CONTRACT_REQUIREMENTS.maxConsecutiveDays} consecutive days
              </p>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Min Rest Between Shifts (Hours)
              </label>
              <input
                type="number"
                name="minRestBetweenShifts"
                min={8}
                max={24}
                value={criteria.minRestBetweenShifts}
                onChange={handleNumberChange}
                className={`w-full p-2 border rounded text-sm ${
                  theme === 'light'
                    ? 'border-gray-200'
                    : 'border-slate-500 bg-slate-700 text-white'
                }`}
              />
              <p className="text-xs mt-1 opacity-80">
                At least {CONTRACT_REQUIREMENTS.minRestBetweenShifts} hours
                required
              </p>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Schedule Start Date
              </label>
              <DatePicker
                selected={criteria.startDate}
                onChange={handleDateChange}
                className={`w-full p-2 border rounded text-sm ${
                  theme === 'light'
                    ? 'border-gray-200'
                    : 'border-slate-500 bg-slate-700 text-white'
                }`}
                dateFormat="MMM dd, yyyy"
              />
            </div>
          </div>
        </div>

        {/* ESTIMATED PAY PREVIEW */}
        <div
          className={`border-t pt-3 mt-3 ${
            theme === 'light' ? 'border-teal-200' : 'border-slate-500'
          }`}
        >
          <h4
            className={`text-sm font-medium mb-2 ${
              theme === 'light' ? 'text-teal-700' : 'text-teal-300'
            }`}
          >
            Quick Pay Estimate
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="font-medium">Base Pay:</span> $
              {payEstimates.basePay}/hr
              <br />
              <span className="font-medium">Differential:</span> +$
              {payEstimates.diffRate}/hr
              <br />
              <span className="font-medium">Total Hourly Rate:</span> $
              {payEstimates.totalRate}/hr
            </div>
            <div>
              <span className="font-medium">Expected Hrs/Week:</span>{' '}
              {payEstimates.weeklyHours}
              <br />
              <span className="font-medium">Weekly Earnings:</span> $
              {payEstimates.weeklyEarnings}
              <br />
              <span className="font-medium">
                Total ({criteria.totalWeeks} wks):
              </span>{' '}
              ${payEstimates.totalEarnings}
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <div className="mt-3 text-right">
          <button
            type="submit"
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
              theme === 'light'
                ? 'bg-teal-500 text-white hover:bg-teal-600'
                : 'bg-teal-600 text-white hover:bg-teal-700'
            }`}
          >
            Generate Schedule
          </button>
        </div>
      </form>
    </div>
  );
}

// -------------------------------------
// 4) CALENDAR & RESULTS COMPONENT
// -------------------------------------
function NurseShiftCalendar({ events, totalEarnings, theme }) {
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Color-coding for events
  const eventStyleGetter = (event) => {
    // Default day shift => green
    let backgroundColor = '#10b981';
    let borderColor = '#059669';
    const textColor = '#ffffff';

    // night shift => indigo
    if (event.title.includes('Night') || event.title.includes('NOC')) {
      backgroundColor = '#4f46e5';
      borderColor = '#4338ca';
    }
    // weekend => amber
    if (event.title.includes('Weekend')) {
      backgroundColor = '#f59e0b';
      borderColor = '#d97706';
    }
    // holiday => red
    if (event.resource.isHoliday) {
      backgroundColor = '#ef4444';
      borderColor = '#dc2626';
    }
    // charge nurse => black border
    if (
      event.resource.differentials?.some((diff) => diff.includes('Charge'))
    ) {
      borderColor = '#000000';
    }

    return {
      style: {
        backgroundColor,
        color: textColor,
        borderColor,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: '4px',
        opacity: 0.9,
        display: 'block',
        fontWeight: 'bold',
        fontSize: '0.8em',
        padding: '2px 4px',
      },
    };
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };
  const handleCloseDetail = () => {
    setSelectedEvent(null);
  };

  const totalHours = events.reduce((acc, e) => acc + e.resource.hours, 0);

  return (
    <div>
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
        >
          <div
            className={`p-5 rounded-lg shadow-lg border w-80 relative ${
              theme === 'light'
                ? 'bg-white border-teal-200'
                : 'bg-slate-700 border-slate-600 text-white'
            }`}
          >
            <button
              onClick={handleCloseDetail}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
            <h3
              className={`font-bold mb-2 ${
                theme === 'light' ? 'text-teal-700' : 'text-teal-300'
              }`}
            >
              {selectedEvent.title}
            </h3>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Date:</span>{' '}
                {new Date(selectedEvent.start).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Time:</span>{' '}
                {new Date(selectedEvent.start).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                -{' '}
                {new Date(selectedEvent.end).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <p>
                <span className="font-medium">Duration:</span>{' '}
                {selectedEvent.resource.hours} hrs
              </p>
              <p>
                <span className="font-medium">Base Pay:</span> $
                {selectedEvent.resource.basePay.toFixed(2)}/hr
              </p>

              {selectedEvent.resource.differentials?.length > 0 && (
                <div>
                  <p className="font-medium mt-2">Differentials:</p>
                  <ul className="list-disc list-inside ml-2">
                    {selectedEvent.resource.differentials.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div
                className={`mt-3 p-2 rounded ${
                  theme === 'light'
                    ? 'bg-teal-50'
                    : 'bg-slate-600 text-white border border-slate-500'
                }`}
              >
                <p
                  className={`font-medium ${
                    theme === 'light' ? 'text-teal-700' : 'text-teal-300'
                  }`}
                >
                  Hourly Rate: $
                  {selectedEvent.resource.hourlyRate.toFixed(2)}/hr
                </p>
                <p
                  className={`font-medium ${
                    theme === 'light' ? 'text-teal-700' : 'text-teal-300'
                  }`}
                >
                  Shift Earnings: $
                  {selectedEvent.resource.earning.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={handleCloseDetail}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                  theme === 'light'
                    ? 'bg-teal-500 text-white hover:bg-teal-600'
                    : 'bg-teal-600 text-white hover:bg-teal-700'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overview */}
      <div
        className={`text-sm p-3 rounded-md mb-3 ${
          theme === 'light'
            ? 'bg-teal-50 border border-teal-100'
            : 'bg-slate-700 border border-slate-600 text-white'
        }`}
      >
        <h4
          className={`font-bold mb-2 ${
            theme === 'light' ? 'text-teal-700' : 'text-teal-300'
          }`}
        >
          Schedule Overview
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <span className="font-medium">Total Shifts:</span> {events.length}
            <br />
            <span className="font-medium">Total Hours:</span> {totalHours}
          </div>
          <div>
            <span className="font-medium">Day Shifts:</span>{' '}
            {
              events.filter(
                (e) => !e.title.includes('Night') && !e.title.includes('NOC')
              ).length
            }
            <br />
            <span className="font-medium">Night Shifts:</span>{' '}
            {
              events.filter(
                (e) => e.title.includes('Night') || e.title.includes('NOC')
              ).length
            }
          </div>
          <div>
            <span className="font-medium">Total Earnings:</span> $
            {totalEarnings.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mb-3 text-xs">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded mr-1" />
          <span>Day Shift</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-indigo-600 rounded mr-1" />
          <span>Night Shift</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-amber-500 rounded mr-1" />
          <span>Weekend</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded mr-1" />
          <span>Holiday</span>
        </div>
        <div
          className={`ml-auto text-xs ${
            theme === 'light' ? 'text-gray-500' : 'text-gray-300'
          }`}
        >
          <em>Click any shift for details</em>
        </div>
      </div>

      {/* Calendar */}
      <div style={{ height: '500px' }}>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          views={['month', 'week', 'day', 'agenda']}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          toolbar
          popup
          selectable={false}
          formats={{
            timeGutterFormat: (date, culture, loc) =>
              loc.format(date, 'h:mm a', culture),
            eventTimeRangeFormat: ({ start, end }, culture, loc) =>
              `${loc.format(start, 'h:mm a', culture)} - ${loc.format(
                end,
                'h:mm a',
                culture
              )}`,
          }}
          style={{ height: '100%', width: '100%' }}
        />
      </div>

      {/* Distribution & Pay Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div
          className={`p-3 rounded-lg border shadow-sm ${
            theme === 'light'
              ? 'bg-white border-gray-200'
              : 'bg-slate-800 border-slate-600 text-white'
          }`}
        >
          <h4
            className={`text-sm font-medium mb-2 border-b pb-1 ${
              theme === 'light'
                ? 'text-teal-700 border-teal-100'
                : 'text-teal-300 border-slate-500'
            }`}
          >
            Day-of-Week Distribution
          </h4>
          <div className="text-xs grid grid-cols-7 gap-1 text-center mt-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day}>{day}</div>
            ))}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => {
              const count = events.filter(
                (e) => new Date(e.start).getDay() === i
              ).length;
              const height = `${count * 10}px`;
              return (
                <div key={day} className="flex flex-col items-center">
                  <div className="w-full bg-teal-400 rounded-t" style={{ height }} />
                  <div>{count}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className={`p-3 rounded-lg border shadow-sm ${
            theme === 'light'
              ? 'bg-white border-gray-200'
              : 'bg-slate-800 border-slate-600 text-white'
          }`}
        >
          <h4
            className={`text-sm font-medium mb-2 border-b pb-1 ${
              theme === 'light'
                ? 'text-teal-700 border-teal-100'
                : 'text-teal-300 border-slate-500'
            }`}
          >
            Pay Breakdown
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm mt-2">
            <div
              className={`border-r pr-2 ${
                theme === 'light'
                  ? 'border-gray-100 text-gray-700'
                  : 'border-slate-500'
              }`}
            >
              <h5 className="font-medium">Base Pay</h5>
              <p
                className={`text-lg font-bold ${
                  theme === 'light' ? 'text-gray-800' : 'text-white'
                }`}
              >
                $
                {events
                  .reduce(
                    (sum, e) => sum + e.resource.basePay * e.resource.hours,
                    0
                  )
                  .toFixed(2)}
              </p>
              <p className="text-xs opacity-80">
                Over {totalHours} hours total
              </p>
            </div>
            <div
              className={`border-r pr-2 ${
                theme === 'light'
                  ? 'border-gray-100'
                  : 'border-slate-500 text-white'
              }`}
            >
              <h5 className="font-medium">Differentials</h5>
              <p
                className={`text-lg font-bold ${
                  theme === 'light' ? 'text-teal-600' : 'text-teal-300'
                }`}
              >
                $
                {(
                  totalEarnings -
                  events.reduce(
                    (sum, e) => sum + e.resource.basePay * e.resource.hours,
                    0
                  )
                ).toFixed(2)}
              </p>
              <p className="text-xs mt-1 opacity-80">
                {events.some((e) => e.title.includes('Night') || e.title.includes('NOC')) &&
                  `Night +$${DIFFERENTIALS.NIGHT.toFixed(2)}/hr `}
                {events.some((e) => e.title.includes('Weekend')) &&
                  `| Weekend +$${DIFFERENTIALS.WEEKEND.toFixed(2)}/hr`}
              </p>
            </div>
            <div>
              <h5 className="font-medium">Total Pay</h5>
              <p
                className={`text-lg font-bold ${
                  theme === 'light' ? 'text-teal-700' : 'text-teal-300'
                }`}
              >
                ${totalEarnings.toFixed(2)}
              </p>
              <p className="text-xs mt-1 opacity-80">
                Avg Hourly:{' '}
                {totalHours > 0
                  ? `$${(totalEarnings / totalHours).toFixed(2)}/hr`
                  : '$0.00/hr'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Export / Save */}
      <div className="text-right mt-4">
        <button
          className={`border px-3 py-1.5 rounded-md text-sm font-medium mr-2 ${
            theme === 'light'
              ? 'bg-white border-teal-500 text-teal-600 hover:bg-teal-50'
              : 'bg-slate-700 border-slate-500 text-teal-300 hover:bg-slate-600'
          }`}
        >
          Export Schedule
        </button>
        <button
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
            theme === 'light'
              ? 'bg-teal-500 text-white hover:bg-teal-600'
              : 'bg-teal-600 text-white hover:bg-teal-700'
          }`}
        >
          Save Schedule
        </button>
      </div>
    </div>
  );
}

// -------------------------------------
// 5) MAIN WRAPPER
// -------------------------------------
export default function NurseShiftScheduler() {
  const [generatedSchedule, setGeneratedSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('light'); // NEW: theme state

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleGenerateSchedule = (criteria) => {
    setLoading(true);
    setTimeout(() => {
      const result = generateNurseSchedule(criteria);
      setGeneratedSchedule(result);
      setLoading(false);
    }, 1500);
  };

  const handleClearSchedule = () => {
    setGeneratedSchedule(null);
  };

  return (
    <div
      className={`min-h-screen p-5 relative transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-teal-50 text-teal-900'
          : 'bg-slate-800 text-white'
      }`}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-10">
          <div>
            <div
              className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-2 ${
                theme === 'light' ? 'border-teal-600' : 'border-teal-300'
              }`}
            />
            <p
              className={`text-sm font-medium ${
                theme === 'light' ? 'text-teal-600' : 'text-teal-300'
              }`}
            >
              Generating Schedule...
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center">
          <CalendarIcon
            className={`w-6 h-6 mr-2 ${
              theme === 'light' ? 'text-teal-500' : 'text-teal-300'
            }`}
          />
          <h2
            className={`text-2xl font-bold ${
              theme === 'light' ? 'text-teal-700' : 'text-teal-300'
            }`}
          >
            Nurse Shift Scheduler
          </h2>
        </div>

        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full border transition ${
            theme === 'light'
              ? 'bg-white border-teal-200 text-teal-500 hover:bg-teal-100'
              : 'bg-slate-700 border-slate-600 text-teal-300 hover:bg-slate-600'
          }`}
        >
          {theme === 'light' ? <Moon /> : <Sun />}
        </button>
      </div>

      {/* Content */}
      <div
        className={`rounded-xl shadow-lg border p-5 ${
          theme === 'light' ? 'bg-white border-teal-100' : 'bg-slate-700 border-slate-600'
        } relative`}
      >
        {!generatedSchedule ? (
          <EnhancedShiftCriteriaForm
            onGenerateSchedule={handleGenerateSchedule}
            theme={theme}
          />
        ) : (
          <div>
            <button
              onClick={handleClearSchedule}
              className={`mb-4 px-3 py-1.5 rounded-md text-sm font-medium inline-flex items-center transition ${
                theme === 'light'
                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  : 'bg-slate-600 text-gray-200 hover:bg-slate-500'
              }`}
            >
              ← Back to Criteria
            </button>
            <NurseShiftCalendar
              events={generatedSchedule.events}
              totalEarnings={generatedSchedule.totalEarnings}
              theme={theme}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// -------------------------------------
// 6) (OPTIONAL) CONSTRAINT HELPERS
// -------------------------------------
export function doesShiftMeetConstraints(newShift, existingShifts, constraints) {
  const { minRestBetweenShifts, maxConsecutiveShifts, maxConsecutiveNights } =
    constraints;

  const newShiftStart = new Date(newShift.start);
  const newShiftEnd = new Date(newShift.end);
  const isNight =
    newShift.title.includes('Night') || newShift.title.includes('NOC');

  // 1) Check min rest
  for (const shift of existingShifts) {
    const shiftStart = new Date(shift.start);
    const shiftEnd = new Date(shift.end);

    if (
      newShiftStart <
        new Date(shiftEnd.getTime() + minRestBetweenShifts * 3600000) &&
      newShiftStart > shiftStart
    ) {
      return false;
    }
    if (
      shiftStart <
        new Date(newShiftEnd.getTime() + minRestBetweenShifts * 3600000) &&
      shiftStart > newShiftStart
    ) {
      return false;
    }
  }

  // 2) consecutive shifts
  const consecutiveCount = getConsecutiveShifts(newShift, existingShifts);
  if (consecutiveCount > maxConsecutiveShifts) return false;

  // 3) consecutive nights
  if (isNight) {
    const nightCount = getConsecutiveNightShifts(newShift, existingShifts);
    if (nightCount > maxConsecutiveNights) return false;
  }
  return true;
}

function getConsecutiveShifts(newShift, existingShifts) {
  const newDay = new Date(newShift.start).setHours(0, 0, 0, 0);
  const dayMs = 86400000;
  let count = 1;
  let current = newDay;

  // backward
  while (true) {
    const prevDay = current - dayMs;
    const hasShift = existingShifts.some(
      (s) => new Date(s.start).setHours(0, 0, 0, 0) === prevDay
    );
    if (hasShift) {
      count++;
      current = prevDay;
    } else break;
  }

  // forward
  current = newDay;
  while (true) {
    const nextDay = current + dayMs;
    const hasShift = existingShifts.some(
      (s) => new Date(s.start).setHours(0, 0, 0, 0) === nextDay
    );
    if (hasShift) {
      count++;
      current = nextDay;
    } else break;
  }
  return count;
}

function getConsecutiveNightShifts(newShift, existingShifts) {
  if (!newShift.title.includes('Night') && !newShift.title.includes('NOC')) {
    return 0;
  }
  const newDay = new Date(newShift.start).setHours(0, 0, 0, 0);
  const dayMs = 86400000;
  let count = 1;
  let current = newDay;

  // backward
  while (true) {
    const prevDay = current - dayMs;
    const hasNight = existingShifts.some(
      (s) =>
        (s.title.includes('Night') || s.title.includes('NOC')) &&
        new Date(s.start).setHours(0, 0, 0, 0) === prevDay
    );
    if (hasNight) {
      count++;
      current = prevDay;
    } else break;
  }

  // forward
  current = newDay;
  while (true) {
    const nextDay = current + dayMs;
    const hasNight = existingShifts.some(
      (s) =>
        (s.title.includes('Night') || s.title.includes('NOC')) &&
        new Date(s.start).setHours(0, 0, 0, 0) === nextDay
    );
    if (hasNight) {
      count++;
      current = nextDay;
    } else break;
  }
  return count;
}
