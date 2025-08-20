import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { X as CloseIcon } from 'lucide-react';

interface DaysOffSelectorProps {
  selectedDaysOff: Date[];
  onDayOffSelect: (date: Date | null) => void;
  theme: 'light' | 'dark';
}

export function DaysOffSelector({ selectedDaysOff, onDayOffSelect, theme }: DaysOffSelectorProps) {
  return (
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
          onChange={onDayOffSelect}
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
                  onClick={() => onDayOffSelect(date)}
                >
                  <CloseIcon className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}