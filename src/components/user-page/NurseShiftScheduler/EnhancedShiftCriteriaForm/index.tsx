import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar as CalendarIcon } from 'lucide-react';
import { ROTATION_PATTERNS, CONTRACT_REQUIREMENTS } from '../../../../utils/constants';

// Hooks
import { useCriteriaForm } from './hooks/useCriteriaForm';
import { usePayCalculation } from './hooks/usePayCalculation';

// Components
import { ShiftPatternSelector } from './components/ShiftPatternSelector';
import { UnitTypeSelector } from './components/UnitTypeSelector';
import { PreferencesSection } from './components/PreferencesSection';
import { DaysOffSelector } from './components/DaysOffSelector';
import { PayEstimateDisplay } from './components/PayEstimateDisplay';

// Types
import type { Criteria } from './types';

interface EnhancedShiftCriteriaFormProps {
  onGenerateSchedule: (criteria: Criteria) => void;
  theme: 'light' | 'dark';
}

export default function EnhancedShiftCriteriaForm({
  onGenerateSchedule,
  theme,
}: EnhancedShiftCriteriaFormProps) {
  const {
    criteria,
    selectedDaysOff,
    handleChange,
    handleNumberChange,
    handleDateChange,
    handleDayOffSelect,
  } = useCriteriaForm();

  const payEstimates = usePayCalculation(criteria);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateSchedule(criteria);
  };

  return (
    <div
      className={`${
        theme === 'light'
          ? 'bg-slate-50 border-slate-100'
          : 'bg-slate-700 border-slate-600 text-white'
      } border rounded-lg p-4 mb-6`}
    >
      <h3
        className={`font-bold mb-3 flex items-center ${
          theme === 'light' ? 'text-slate-700' : 'text-slate-300'
        }`}
      >
        <CalendarIcon
          className={`w-5 h-5 mr-1 ${
            theme === 'light' ? 'text-slate-500' : 'text-slate-300'
          }`}
        />
        Nurse Scheduling Criteria
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 1) SHIFT PATTERN & UNIT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ShiftPatternSelector
            value={criteria.shiftPattern}
            onChange={handleChange}
            theme={theme}
          />
          <UnitTypeSelector
            value={criteria.unitType}
            onChange={handleChange}
            theme={theme}
          />
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
        <PreferencesSection
          criteria={criteria}
          onChange={handleChange}
          theme={theme}
        />

        {/* 4) CONTRACT CONSTRAINTS / SCHEDULE TIMING */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <DaysOffSelector
            selectedDaysOff={selectedDaysOff}
            onDayOffSelect={handleDayOffSelect}
            theme={theme}
          />

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
        <PayEstimateDisplay
          payEstimates={payEstimates}
          totalWeeks={criteria.totalWeeks}
          theme={theme}
        />

        {/* 6) SUBMIT */}
        <div className="mt-3 text-right">
          <button
            type="submit"
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
              theme === 'light'
                ? 'bg-slate-500 text-white hover:bg-slate-600'
                : 'bg-slate-600 text-white hover:bg-slate-700'
            }`}
          >
            Generate Schedule
          </button>
        </div>
      </form>
    </div>
  );
}