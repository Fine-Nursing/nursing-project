// components/NurseShiftScheduler/NurseShiftScheduler.tsx
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Moon, Sun } from 'lucide-react';

import generateNurseSchedule from 'src/utils/generateNurseSchedule';
import EnhancedShiftCriteriaForm from './EnhancedShiftCriteriaForm';
import NurseShiftCalendar from './NurseShiftCalendar';

export default function NurseShiftScheduler() {
  const [generatedSchedule, setGeneratedSchedule] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleGenerateSchedule = (criteria: any) => {
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
      {/* 로딩 스피너 */}
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
          type="button"
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

      {/* Main Card */}
      <div
        className={`rounded-xl shadow-lg border p-5 ${
          theme === 'light'
            ? 'bg-white border-teal-100'
            : 'bg-slate-700 border-slate-600'
        } relative`}
      >
        {/* 스케줄 없으면 -> 폼 표시 / 스케줄 생성되면 -> 달력 표시 */}
        {!generatedSchedule ? (
          <EnhancedShiftCriteriaForm
            onGenerateSchedule={handleGenerateSchedule}
            theme={theme}
          />
        ) : (
          <div>
            <button
              type="button"
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
