import React from 'react';
// framer-motion import 제거 (사용하지 않음)
import { TrendingUp } from 'lucide-react';

interface CareerHeaderProps {
  theme: 'light' | 'dark';
  totalPositions: number;
  totalYears: number;
  highestHourlyRate: number;
}

export default function CareerHeader({ 
  theme, 
  totalPositions, 
  totalYears, 
  highestHourlyRate 
}: CareerHeaderProps) {
  return (
    <div className={`px-6 py-4 border-b ${
      theme === 'light' ? 'border-gray-200 bg-slate-50' : 'border-slate-600 bg-slate-800'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold flex items-center gap-3 ${
            theme === 'light' ? 'text-slate-800' : 'text-slate-100'
          }`}>
            <div className={`p-2 rounded-lg ${
              theme === 'light' ? 'bg-slate-600' : 'bg-slate-700'
            }`}>
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            Career Overview
          </h2>
          <p className={`text-sm mt-1 font-medium ${
            theme === 'light' ? 'text-slate-600' : 'text-slate-300'
          }`}>
            {totalPositions} positions • {totalYears}+ years of experience
          </p>
        </div>
        
        <div className={`px-4 py-3 rounded-xl text-sm border ${
          theme === 'light' 
            ? 'bg-white text-slate-700 border-slate-200 shadow-sm' 
            : 'bg-slate-700 text-slate-200 border-slate-600'
        }`}>
          <div className="text-center">
            <div className={`text-xs font-medium mb-1 ${
              theme === 'light' ? 'text-slate-500' : 'text-slate-400'
            }`}>
              Peak Hourly Rate
            </div>
            <div className={`font-bold text-lg ${
              theme === 'light' ? 'text-slate-800' : 'text-slate-100'
            }`}>
              ${highestHourlyRate.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}