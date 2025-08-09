// components/NurseDashboard/CompensationAnalysis.tsx

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  Clock,
  Calendar,
  Moon,
  Activity,
  Edit2,
  Save,
  X,
  Sparkles,
  ChevronRight,
  Banknote,
  CircleDollarSign,
  Plus
} from 'lucide-react';

interface CompensationAnalysisProps {
  userProfile: {
    hourlyRate: number;
    annualSalary: number;
    differentials: { night: number; weekend: number; other: number };
  };
  theme: 'light' | 'dark';
  getCompensationInsight: () => string;
  calculatePotentialDifferentials: () => string[] | number | string;
}

// Format large numbers with k suffix
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 10000) {
    return `${Math.round(num / 1000)}k`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toLocaleString();
};

export default function CompensationAnalysis({
  userProfile,
  theme,
  getCompensationInsight,
  calculatePotentialDifferentials,
}: CompensationAnalysisProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(userProfile);
    setIsEditing(false);
  };

  // Calculate monthly compensation
  const monthlyBase = Math.round(editedProfile.annualSalary / 12);
  const nightDifferential = editedProfile.differentials.night * 60;
  const weekendDifferential = editedProfile.differentials.weekend * 32;
  const specialtyDifferential = editedProfile.differentials.other * 20;
  const totalMonthlyDifferentials = nightDifferential + weekendDifferential + specialtyDifferential;
  const totalMonthly = monthlyBase + totalMonthlyDifferentials;

  const potentialDifferentials = calculatePotentialDifferentials();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${
        theme === 'light' ? 'bg-white' : 'bg-slate-800'
      } rounded-xl shadow-lg border ${
        theme === 'light' ? 'border-gray-200' : 'border-slate-700'
      }`}
    >
      {/* Clean Header */}
      <div className={`px-6 py-4 border-b ${
        theme === 'light' ? 'border-gray-100' : 'border-slate-700'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-lg font-semibold ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Compensation Analysis
            </h2>
            <p className={`text-sm mt-0.5 ${
              theme === 'light' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Your earnings breakdown and insights
            </p>
          </div>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isEditing
                ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600'
            }`}
          >
            {isEditing ? (
              <>
                <X className="w-3.5 h-3.5" />
                Cancel
              </>
            ) : (
              <>
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Primary Compensation Display */}
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

        {/* Three Column Stats */}
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
        </div>

        {/* Shift Differentials - Horizontal Layout */}
        <div>
          <h3 className={`text-sm font-semibold mb-3 ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            Active Differentials
          </h3>
          
          <div className={`rounded-lg border divide-y ${
            theme === 'light' 
              ? 'bg-gray-50 border-gray-200 divide-gray-200' 
              : 'bg-slate-900/30 border-slate-700 divide-slate-700'
          }`}>
            {/* Night Shift */}
            <div className="p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  theme === 'light' ? 'bg-emerald-100' : 'bg-emerald-900/50'
                }`}>
                  <Moon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className={`text-sm font-medium ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    Night Shift
                  </p>
                  <p className={`text-xs ${
                    theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    11 PM - 7 AM • ~60 hrs/month
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {isEditing ? (
                  <div className="flex items-center gap-1">
                    <Plus className="w-3 h-3 text-gray-400" />
                    <span className="text-sm">$</span>
                    <input
                      type="number"
                      step="0.5"
                      value={editedProfile.differentials.night}
                      onChange={(e) => setEditedProfile({
                        ...editedProfile,
                        differentials: {
                          ...editedProfile.differentials,
                          night: parseFloat(e.target.value) || 0
                        }
                      })}
                      className={`w-12 text-center font-semibold bg-transparent border-b ${
                        theme === 'light' 
                          ? 'border-gray-300 text-gray-900' 
                          : 'border-slate-600 text-white'
                      } focus:outline-none focus:border-indigo-500`}
                    />
                    <span className="text-sm">/hr</span>
                  </div>
                ) : (
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      +${editedProfile.differentials.night}/hr
                    </p>
                    <p className={`text-xs ${
                      theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      ${nightDifferential}/month
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Weekend */}
            <div className="p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  theme === 'light' ? 'bg-emerald-100' : 'bg-emerald-900/50'
                }`}>
                  <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className={`text-sm font-medium ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    Weekend
                  </p>
                  <p className={`text-xs ${
                    theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    Sat & Sun • ~32 hrs/month
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {isEditing ? (
                  <div className="flex items-center gap-1">
                    <Plus className="w-3 h-3 text-gray-400" />
                    <span className="text-sm">$</span>
                    <input
                      type="number"
                      step="0.5"
                      value={editedProfile.differentials.weekend}
                      onChange={(e) => setEditedProfile({
                        ...editedProfile,
                        differentials: {
                          ...editedProfile.differentials,
                          weekend: parseFloat(e.target.value) || 0
                        }
                      })}
                      className={`w-12 text-center font-semibold bg-transparent border-b ${
                        theme === 'light' 
                          ? 'border-gray-300 text-gray-900' 
                          : 'border-slate-600 text-white'
                      } focus:outline-none focus:border-purple-500`}
                    />
                    <span className="text-sm">/hr</span>
                  </div>
                ) : (
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      +${editedProfile.differentials.weekend}/hr
                    </p>
                    <p className={`text-xs ${
                      theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      ${weekendDifferential}/month
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Critical Care */}
            <div className="p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  theme === 'light' ? 'bg-orange-100' : 'bg-orange-900/50'
                }`}>
                  <Activity className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className={`text-sm font-medium ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    Critical Care
                  </p>
                  <p className={`text-xs ${
                    theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    ICU/ER/OR • ~20 hrs/month
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {isEditing ? (
                  <div className="flex items-center gap-1">
                    <Plus className="w-3 h-3 text-gray-400" />
                    <span className="text-sm">$</span>
                    <input
                      type="number"
                      step="0.5"
                      value={editedProfile.differentials.other}
                      onChange={(e) => setEditedProfile({
                        ...editedProfile,
                        differentials: {
                          ...editedProfile.differentials,
                          other: parseFloat(e.target.value) || 0
                        }
                      })}
                      className={`w-12 text-center font-semibold bg-transparent border-b ${
                        theme === 'light' 
                          ? 'border-gray-300 text-gray-900' 
                          : 'border-slate-600 text-white'
                      } focus:outline-none focus:border-orange-500`}
                    />
                    <span className="text-sm">/hr</span>
                  </div>
                ) : (
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      +${editedProfile.differentials.other}/hr
                    </p>
                    <p className={`text-xs ${
                      theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      ${specialtyDifferential}/month
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights - Simple */}
        <div className={`rounded-lg p-4 ${
          theme === 'light' 
            ? 'bg-amber-50 border border-amber-200' 
            : 'bg-amber-900/20 border border-amber-800/50'
        }`}>
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            
            <div className="flex-1">
              <h4 className={`text-sm font-semibold mb-2 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                AI Insights
              </h4>
              
              <p className={`text-sm mb-3 ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-300'
              }`}>
                {getCompensationInsight()}
              </p>
              
              {Array.isArray(potentialDifferentials) && potentialDifferentials.length > 0 && (
                <div className="space-y-1.5">
                  {potentialDifferentials.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <ChevronRight className="w-3 h-3 text-amber-500" />
                      <span className={`text-sm ${
                        theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                      }`}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex gap-3 pt-2"
            >
              <button
                onClick={handleSave}
                className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
              
              <button
                onClick={handleCancel}
                className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                  theme === 'light'
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    : 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                }`}
              >
                Cancel
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}