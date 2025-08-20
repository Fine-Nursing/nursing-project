import React from 'react';
import { motion } from 'framer-motion';
import { CircleDollarSign, TrendingUp } from 'lucide-react';
import { formatNumber } from '../utils';

interface PrimaryCompensationDisplayProps {
  theme: 'light' | 'dark';
  totalMonthly: number;
  monthlyBase: number;
  totalMonthlyDifferentials: number;
}

export function PrimaryCompensationDisplay({
  theme,
  totalMonthly,
  monthlyBase,
  totalMonthlyDifferentials
}: PrimaryCompensationDisplayProps) {
  return (
    <div className={`rounded-lg p-4 sm:p-6 ${
      theme === 'light' 
        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100' 
        : 'bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-800/50'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            theme === 'light' ? 'bg-emerald-100' : 'bg-emerald-900/50'
          }`}>
            <CircleDollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className={`text-sm font-medium ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              Total Monthly Earnings
            </p>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                ${formatNumber(totalMonthly)}
              </span>
              <span className={`text-sm ${
                theme === 'light' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                /month
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">12% above avg</span>
          </div>
          <p className={`text-xs mt-1 ${
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
            Base: ${formatNumber(monthlyBase)}
          </span>
          <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
            Differentials: +${formatNumber(totalMonthlyDifferentials)}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: `${(monthlyBase / totalMonthly) * 100}%` }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </div>
      </div>
    </div>
  );
}