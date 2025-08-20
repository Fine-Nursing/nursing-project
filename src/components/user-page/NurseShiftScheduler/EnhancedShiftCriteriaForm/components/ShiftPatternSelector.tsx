import React from 'react';
import { SHIFT_PATTERNS } from '../../../../../utils/constants';

interface ShiftPatternSelectorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  theme: 'light' | 'dark';
}

export function ShiftPatternSelector({ value, onChange, theme }: ShiftPatternSelectorProps) {
  return (
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
        value={value}
        onChange={onChange}
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
        {SHIFT_PATTERNS.find((p) => p.name === value)?.pattern}
      </div>
    </div>
  );
}