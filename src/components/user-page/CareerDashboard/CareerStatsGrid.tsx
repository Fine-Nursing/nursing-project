import React from 'react';
import { Clock, Briefcase, TrendingUp, Award } from 'lucide-react';

interface CareerStatsGridProps {
  theme: 'light' | 'dark';
  totalYears: number;
  remainingMonths: number;
  currentRole: any;
  highestHourlyRate: number;
  annualSalary: number;
}

export default function CareerStatsGrid({
  theme,
  totalYears,
  remainingMonths,
  currentRole,
  highestHourlyRate,
  annualSalary
}: CareerStatsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      {/* Experience */}
      <div className={`p-3 rounded-lg border text-center ${
        theme === 'light' ? 'bg-white border-gray-200' : 'bg-slate-800 border-slate-600'
      }`}>
        <Clock className={`w-4 h-4 mx-auto mb-1 ${
          theme === 'light' ? 'text-blue-500' : 'text-blue-400'
        }`} />
        <div className={`text-xs font-medium ${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          Experience
        </div>
        <div className={`text-lg font-bold ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          {totalYears}y {remainingMonths}m
        </div>
      </div>

      {/* Current Role */}
      <div className={`p-3 rounded-lg border text-center ${
        theme === 'light' ? 'bg-white border-gray-200' : 'bg-slate-800 border-slate-600'
      }`}>
        <Briefcase className={`w-4 h-4 mx-auto mb-1 ${
          theme === 'light' ? 'text-purple-500' : 'text-purple-400'
        }`} />
        <div className={`text-xs font-medium ${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          Current Role
        </div>
        <div className={`text-sm font-bold truncate ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          {currentRole ? currentRole.role : 'Add role'}
        </div>
      </div>

      {/* Highest Rate */}
      <div className={`p-3 rounded-lg border text-center ${
        theme === 'light' ? 'bg-white border-gray-200' : 'bg-slate-800 border-slate-600'
      }`}>
        <TrendingUp className={`w-4 h-4 mx-auto mb-1 ${
          theme === 'light' ? 'text-green-500' : 'text-green-400'
        }`} />
        <div className={`text-xs font-medium ${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          Peak Rate
        </div>
        <div className={`text-lg font-bold ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          ${highestHourlyRate.toFixed(2)}
        </div>
      </div>

      {/* Annual Salary */}
      <div className={`p-3 rounded-lg border text-center ${
        theme === 'light' ? 'bg-white border-gray-200' : 'bg-slate-800 border-slate-600'
      }`}>
        <Award className={`w-4 h-4 mx-auto mb-1 ${
          theme === 'light' ? 'text-orange-500' : 'text-orange-400'
        }`} />
        <div className={`text-xs font-medium ${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          Est. Annual
        </div>
        <div className={`text-sm font-bold ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          ${Math.round(annualSalary / 1000)}k
        </div>
      </div>
    </div>
  );
}