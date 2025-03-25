// components/NurseShiftScheduler/EnhancedShiftCriteriaForm.tsx
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar as CalendarIcon, X as CloseIcon } from 'lucide-react';

import {
  SHIFT_PATTERNS,
  ROTATION_PATTERNS,
  DIFFERENTIALS,
  UNIT_BASE_PAY,
  ACUITY_STAFFING,
  CONTRACT_REQUIREMENTS,
} from '../../../utils/constants';

type UnitKey = keyof typeof UNIT_BASE_PAY;

interface Criteria {
  shiftPattern: string;
  rotationPattern: string;
  unitType: UnitKey;
  experienceYears: number;
  totalWeeks: number;
  maxConsecutiveShifts: number;
  minRestBetweenShifts: number;
  preferNight: boolean;
  preferWeekend: boolean;
  chargeNurse: boolean;
  preceptorDuty: boolean;
  maxWeeklyHours: number;
  startDate: Date;
  certifications: string[];
  requestedDaysOff: string[];
  selfScheduled: boolean;
}

interface EnhancedShiftCriteriaFormProps {
  onGenerateSchedule: (criteria: Criteria) => void;
  theme: 'light' | 'dark';
}

export default function EnhancedShiftCriteriaForm({
  onGenerateSchedule,
  theme,
}: EnhancedShiftCriteriaFormProps) {
  const [criteria, setCriteria] = useState<Criteria>({
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

  const [selectedDaysOff, setSelectedDaysOff] = useState<Date[]>([]);

  // ========== Pay Calculation ==========
  const calculateEstimatedPay = () => {
    const unitPay = UNIT_BASE_PAY[criteria.unitType];
    let basePay =
      unitPay.min +
      (Math.min(criteria.experienceYears, 20) * (unitPay.max - unitPay.min)) /
        20;

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
  };

  const payEstimates = calculateEstimatedPay();

  // ========== Handlers ==========
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setCriteria((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'select-multiple') {
      // 멀티선택
      const target = e.target as HTMLSelectElement;
      const arr = Array.from(target.options)
        .filter((opt) => opt.selected)
        .map((opt) => opt.value);
      setCriteria((prev) => ({ ...prev, [name]: arr }));
    } else {
      setCriteria((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCriteria((prev) => ({ ...prev, [name]: parseInt(value, 10) }));
  };

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    setCriteria((prev) => ({ ...prev, startDate: date }));
  };

  const handleDayOffSelect = (date: Date | null) => {
    if (!date) return;
    const dateStr = date.toISOString().slice(0, 10);
    const existingIndex = selectedDaysOff.findIndex(
      (d) => d.toISOString().slice(0, 10) === dateStr
    );

    let updated: Date[];
    if (existingIndex >= 0) {
      // 이미 있으면 제거
      updated = [...selectedDaysOff];
      updated.splice(existingIndex, 1);
    } else {
      updated = [...selectedDaysOff, date];
    }
    setSelectedDaysOff(updated);

    // requestedDaysOff 업데이트
    const offStrings = updated.map((d) => d.toISOString().slice(0, 10));
    setCriteria((prev) => ({ ...prev, requestedDaysOff: offStrings }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateSchedule(criteria);
  };

  // ========== RENDER ==========
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
        {/* 1) SHIFT PATTERN & UNIT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* SHIFT PATTERN */}
          <div
            className={`p-3 rounded-lg border shadow-sm ${
              theme === 'light'
                ? 'bg-white border-gray-100'
                : 'bg-slate-800 border-slate-600'
            }`}
          >
            <label
              htmlFor="shiftPattern"
              className="block mb-1 text-sm font-medium"
            >
              Shift Pattern
            </label>
            <select
              id="shiftPattern"
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
            <label
              htmlFor="unitType"
              className="block mb-1 text-sm font-medium"
            >
              Unit Type
            </label>
            <select
              id="unitType"
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
                  {unit} (${UNIT_BASE_PAY[unit as UnitKey].min} - $
                  {UNIT_BASE_PAY[unit as UnitKey].max}/hr)
                </option>
              ))}
            </select>
            <div className="text-xs mt-1 opacity-80">
              Nurse-to-Patient Ratio:{' '}
              {
                /** (1) 옵셔널체이닝 + fallback 
                ACUITY_STAFFING[criteria.unitType as keyof typeof ACUITY_STAFFING]?.nurseToPatient ?? 'N/A' 
                * */
                ACUITY_STAFFING[criteria.unitType]?.nurseToPatient
              }
            </div>
          </div>
        </div>

        {/* 2) ROTATION & EXPERIENCE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* ROTATION */}
          <div
            className={`p-3 rounded-lg border shadow-sm ${
              theme === 'light'
                ? 'bg-white border-gray-100'
                : 'bg-slate-800 border-slate-600'
            }`}
          >
            <label
              htmlFor="rotationPattern"
              className="block mb-1 text-sm font-medium"
            >
              Rotation Pattern
            </label>
            <select
              id="rotationPattern"
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
            <label
              htmlFor="experienceYears"
              className="block mb-1 text-sm font-medium"
            >
              Years of RN Experience
            </label>
            <input
              id="experienceYears"
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

        {/* 3) PERSONAL PREFERENCES */}
        <div
          className={`p-3 rounded-lg border shadow-sm ${
            theme === 'light'
              ? 'bg-white border-gray-100'
              : 'bg-slate-800 border-slate-600'
          }`}
        >
          {/* fieldset + legend 로 label 충돌 제거 */}
          <fieldset>
            <legend className="block mb-1 text-sm font-medium">
              Additional Preferences
            </legend>

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
          </fieldset>

          {/* Certifications */}
          <div className="mt-3">
            <label
              htmlFor="certifications"
              className="block mb-1 text-sm font-medium"
            >
              Certifications
            </label>
            <select
              id="certifications"
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

        {/* 4) CONTRACT CONSTRAINTS / SCHEDULE TIMING */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Days Off */}
          <div
            className={`p-3 rounded-lg border shadow-sm ${
              theme === 'light'
                ? 'bg-white border-gray-100'
                : 'bg-slate-800 border-slate-600'
            }`}
          >
            <label
              htmlFor="requestedDaysOff"
              className="block mb-1 text-sm font-medium"
            >
              Requested Days Off
            </label>
            <div
              id="requestedDaysOff"
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
                {selectedDaysOff.length === 0 && (
                  <p className="text-xs opacity-60">
                    Click any date to request off
                  </p>
                )}
                {selectedDaysOff.map((date) => {
                  const dateKey = date.toISOString();
                  return (
                    <div
                      key={dateKey}
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
                  );
                })}
              </div>
            </div>
          </div>

          {/* Duration & Other Constraints */}
          <div
            className={`p-3 rounded-lg border shadow-sm space-y-3 ${
              theme === 'light'
                ? 'bg-white border-gray-100'
                : 'bg-slate-800 border-slate-600'
            }`}
          >
            <div>
              <label
                htmlFor="totalWeeks"
                className="block mb-1 text-sm font-medium"
              >
                Schedule Duration (Weeks)
              </label>
              <input
                id="totalWeeks"
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
              <label
                htmlFor="maxConsecutiveShifts"
                className="block mb-1 text-sm font-medium"
              >
                Max Consecutive Shifts
              </label>
              <input
                id="maxConsecutiveShifts"
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
                Up to {CONTRACT_REQUIREMENTS.maxConsecutiveDays} consecutive
                days
              </p>
            </div>

            <div>
              <label
                htmlFor="minRestBetweenShifts"
                className="block mb-1 text-sm font-medium"
              >
                Min Rest Between Shifts (Hours)
              </label>
              <input
                id="minRestBetweenShifts"
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
              <label
                htmlFor="startDate"
                className="block mb-1 text-sm font-medium"
              >
                Schedule Start Date
              </label>
              <DatePicker
                id="startDate"
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

        {/* 5) ESTIMATED PAY PREVIEW */}
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

        {/* 6) SUBMIT */}
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
