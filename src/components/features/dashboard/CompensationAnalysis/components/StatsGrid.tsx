import React from 'react';
import { Clock, Banknote, Calendar } from 'lucide-react';
import { formatNumber } from '../utils';
import type { UserProfile } from '../types';

interface StatsGridProps {
  theme: 'light' | 'dark';
  isEditing: boolean;
  editedProfile: UserProfile;
  setEditedProfile: (profile: UserProfile) => void;
  monthlyBase: number;
}

export function StatsGrid({
  theme,
  isEditing,
  editedProfile,
  setEditedProfile,
  monthlyBase
}: StatsGridProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4">
      {/* Hourly Rate */}
      <div className={`p-2 sm:p-4 rounded-lg border ${
        theme === 'light' 
          ? 'bg-white border-gray-200' 
          : 'bg-slate-900/50 border-slate-700'
      }`}>
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <span className="text-[10px] sm:text-xs text-green-600 dark:text-green-400 font-medium">
            +$3.50
          </span>
        </div>
        
        <p className={`text-[10px] sm:text-xs font-medium mb-1 ${
          theme === 'light' ? 'text-gray-500' : 'text-gray-400'
        }`}>
          Hourly Rate
        </p>
        
        {isEditing ? (
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-semibold">$</span>
            <input
              type="number"
              step="0.01"
              value={editedProfile.hourlyRate}
              onChange={(e) => setEditedProfile({
                ...editedProfile,
                hourlyRate: parseFloat(e.target.value) || 0,
                annualSalary: Math.round((parseFloat(e.target.value) || 0) * 2080)
              })}
              className={`text-xl font-bold w-20 bg-transparent border-b ${
                theme === 'light' 
                  ? 'border-gray-300 text-gray-900' 
                  : 'border-slate-600 text-white'
              } focus:outline-none focus:border-blue-500`}
            />
            <span className="text-sm text-gray-500">/hr</span>
          </div>
        ) : (
          <div className="flex items-baseline gap-1">
            <span className={`text-base sm:text-2xl font-bold ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              ${editedProfile.hourlyRate.toFixed(2)}
            </span>
            <span className={`text-[10px] sm:text-sm ${
              theme === 'light' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              /hr
            </span>
          </div>
        )}
      </div>

      {/* Monthly Base */}
      <div className={`p-2 sm:p-4 rounded-lg border ${
        theme === 'light' 
          ? 'bg-white border-gray-200' 
          : 'bg-slate-900/50 border-slate-700'
      }`}>
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <span className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            Base
          </span>
        </div>
        
        <p className={`text-[10px] sm:text-xs font-medium mb-1 ${
          theme === 'light' ? 'text-gray-500' : 'text-gray-400'
        }`}>
          Monthly Base
        </p>
        
        <div className="flex flex-col">
          <span className={`text-base sm:text-2xl font-bold ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            ${formatNumber(monthlyBase)}
          </span>
          <span className={`text-[10px] sm:text-sm ${
            theme === 'light' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            /mo
          </span>
        </div>
      </div>

      {/* Annual Salary */}
      <div className={`p-2 sm:p-4 rounded-lg border ${
        theme === 'light' 
          ? 'bg-white border-gray-200' 
          : 'bg-slate-900/50 border-slate-700'
      }`}>
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <Banknote className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <span className="text-[10px] sm:text-xs text-green-600 dark:text-green-400 font-medium">
            Top 25%
          </span>
        </div>
        
        <p className={`text-[10px] sm:text-xs font-medium mb-1 ${
          theme === 'light' ? 'text-gray-500' : 'text-gray-400'
        }`}>
          Annual Salary
        </p>
        
        <div className="flex flex-col">
          <span className={`text-base sm:text-2xl font-bold ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            ${formatNumber(editedProfile.annualSalary)}
          </span>
          <span className={`text-[10px] sm:text-sm ${
            theme === 'light' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            /year
          </span>
        </div>
      </div>
    </div>
  );
}