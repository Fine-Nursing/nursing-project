import React from 'react';
import { Calendar, DollarSign, Clock, Activity } from 'lucide-react';
import { useTheme } from 'src/hooks/useTheme';
import type { CalendarHeaderProps } from '../types';

export function CalendarHeader({ 
  totalEarnings, 
  hoursWorked, 
  shiftsCount, 
  theme 
}: CalendarHeaderProps) {
  const tc = useTheme(theme);
  
  return (
    <div className={`p-6 rounded-t-xl ${tc.bg.primary} border-b ${tc.border.default}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${tc.getClass(
            'bg-blue-50',
            'bg-blue-900/30'
          )}`}>
            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${tc.text.primary}`}>
              Your Shift Schedule
            </h2>
            <p className={`text-sm ${tc.text.secondary} mt-0.5`}>
              Optimized schedule based on your preferences
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className={`p-4 rounded-lg ${tc.getClass(
          'bg-green-50',
          'bg-green-900/20'
        )}`}>
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className={`text-sm ${tc.text.secondary}`}>Total Earnings</span>
          </div>
          <p className={`text-2xl font-bold ${tc.getClass(
            'text-green-700',
            'text-green-300'
          )}`}>
            ${totalEarnings.toLocaleString()}
          </p>
        </div>

        <div className={`p-4 rounded-lg ${tc.getClass(
          'bg-blue-50',
          'bg-blue-900/20'
        )}`}>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className={`text-sm ${tc.text.secondary}`}>Hours Worked</span>
          </div>
          <p className={`text-2xl font-bold ${tc.getClass(
            'text-blue-700',
            'text-blue-300'
          )}`}>
            {hoursWorked}
          </p>
        </div>

        <div className={`p-4 rounded-lg ${tc.getClass(
          'bg-purple-50',
          'bg-purple-900/20'
        )}`}>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className={`text-sm ${tc.text.secondary}`}>Total Shifts</span>
          </div>
          <p className={`text-2xl font-bold ${tc.getClass(
            'text-purple-700',
            'text-purple-300'
          )}`}>
            {shiftsCount}
          </p>
        </div>
      </div>
    </div>
  );
}