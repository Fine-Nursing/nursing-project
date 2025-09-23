import React from 'react';
import { m } from 'framer-motion';
import { CircleDollarSign, TrendingUp } from 'lucide-react';
import { formatNumber } from '../utils';
import { CompensationCalculator } from 'src/utils/compensation';

interface PrimaryCompensationDisplayProps {
  theme: 'light' | 'dark';
  totalMonthly: number;
  monthlyBase: number;
  totalMonthlyDifferentials: number;
  hourlyRate?: number;
  shiftHours?: number;
}

export function PrimaryCompensationDisplay({
  theme,
  totalMonthly,
  monthlyBase,
  totalMonthlyDifferentials,
  hourlyRate,
  shiftHours = 12
}: PrimaryCompensationDisplayProps) {
  // Calculate hourly rate using actual shift hours
  const calculatedHourlyRate = hourlyRate || CompensationCalculator.monthlyToHourly(totalMonthly, shiftHours);
  return (
    <div className={`rounded-lg p-3 sm:p-4 md:p-6 ${
      theme === 'light'
        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100'
        : 'bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-800/50'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${
            theme === 'light' ? 'bg-emerald-100' : 'bg-emerald-900/50'
          }`}>
            <CircleDollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className={`text-xs sm:text-sm font-medium ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              Hourly Rate
            </p>
            <div className="flex items-baseline gap-1 sm:gap-2">
              <span className={`text-2xl sm:text-3xl font-bold ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                ${formatNumber(calculatedHourlyRate)}
              </span>
              <span className={`text-xs sm:text-sm ${
                theme === 'light' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                /hour
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-right self-end sm:self-auto">
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-medium">12% above avg</span>
          </div>
          <p className={`text-[10px] sm:text-xs mt-1 ${
            theme === 'light' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            Regional comparison
          </p>
        </div>
      </div>

      {/* Breakdown Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
            Base: ${formatNumber(CompensationCalculator.monthlyToHourly(monthlyBase, shiftHours))}/hr
          </span>
          <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
            Differentials: +${formatNumber(CompensationCalculator.monthlyToHourly(totalMonthlyDifferentials, shiftHours))}/hr
          </span>
        </div>
        <div className="text-center mt-2">
          <span className={`text-xs ${
            theme === 'light' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            Monthly Total: ${formatNumber(totalMonthly)} ({CompensationCalculator.getShiftPattern(shiftHours).hoursPerMonth} hrs/mo)
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <m.div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: `${(monthlyBase / totalMonthly) * 100}%` }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </div>
      </div>
    </div>
  );
}export default PrimaryCompensationDisplay
