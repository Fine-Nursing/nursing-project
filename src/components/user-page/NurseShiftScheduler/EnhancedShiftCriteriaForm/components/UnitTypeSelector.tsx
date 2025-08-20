import React from 'react';
import { UNIT_BASE_PAY, ACUITY_STAFFING } from '../../../../../utils/constants';
import type { UnitKey } from '../types';

interface UnitTypeSelectorProps {
  value: UnitKey;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  theme: 'light' | 'dark';
}

export function UnitTypeSelector({ value, onChange, theme }: UnitTypeSelectorProps) {
  return (
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
        value={value}
        onChange={onChange}
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
        {ACUITY_STAFFING[value]?.nurseToPatient}
      </div>
    </div>
  );
}