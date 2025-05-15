// components/NurseDashboard/CompensationAnalysis.tsx
import React from 'react';
import {
  ArrowUp,
  ArrowDown,
  Gift,
  Calendar,
  Moon,
  Star,
  Coffee,
} from 'lucide-react';

interface CompensationAnalysisProps {
  userProfile: {
    hourlyRate: number;
    annualSalary: number;
    differentials: { night: number; weekend: number; other: number };
  };
  theme: 'light' | 'dark';
  getCompensationInsight: () => string;
  calculatePotentialDifferentials: () => number;
}

export default function CompensationAnalysis({
  userProfile,
  theme,
  getCompensationInsight,
  calculatePotentialDifferentials,
}: CompensationAnalysisProps) {
  return (
    <div
      className={`${
        theme === 'light' ? 'bg-white' : 'bg-slate-700'
      } rounded-2xl shadow-lg p-6 border ${
        theme === 'light' ? 'border-slate-100' : 'border-slate-600'
      } space-y-4`}
    >
      <h2 className="text-xl font-bold flex items-center">
        <Coffee className="w-5 h-5 mr-2 text-slate-500" />
        Compensation Analysis
        <div className="ml-2 bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">
          AI Powered
        </div>
      </h2>

      <div
        className={`border-b ${
          theme === 'light' ? 'border-gray-200' : 'border-slate-600'
        } pb-4 space-y-3`}
      >
        <div className="flex justify-between items-center">
          <div>My hourly rate:</div>
          <div className="font-bold text-lg flex items-center">
            <span
              className={`${
                theme === 'light' ? 'bg-slate-50' : 'bg-slate-600'
              } p-1 rounded-lg flex items-center mr-2`}
            >
              <Gift className="w-4 h-4 mr-1 text-slate-500" />
            </span>
            ${userProfile.hourlyRate.toFixed(2)}
          </div>
        </div>
        <div className="flex justify-between items-center text-sm">
          <div>Annual equivalent:</div>
          <div className="font-medium">
            ${userProfile.annualSalary.toLocaleString()}
          </div>
        </div>
        <div
          className={`mt-2 text-sm ${
            theme === 'light'
              ? 'bg-slate-50 border-slate-100'
              : 'bg-slate-600 border-slate-500'
          } border rounded-2xl p-3`}
        >
          {getCompensationInsight()}
        </div>
      </div>

      <h3 className="font-medium text-slate-600">Additional Differentials</h3>
      <div className="grid grid-cols-3 gap-3">
        <div
          className={`p-3 rounded-2xl text-center border ${
            theme === 'light'
              ? 'bg-slate-50 border-slate-100'
              : 'bg-slate-600 border-slate-500'
          }`}
        >
          <div className="flex items-center justify-center mb-1 text-sm">
            <Moon className="w-4 h-4 mr-1 text-slate-400" />
            <span>Night</span>
          </div>
          <div className="font-bold text-slate-700">
            +${userProfile.differentials.night}/hr
          </div>
        </div>
        <div
          className={`p-3 rounded-2xl text-center border ${
            theme === 'light'
              ? 'bg-slate-50 border-slate-100'
              : 'bg-slate-600 border-slate-500'
          }`}
        >
          <div className="flex items-center justify-center mb-1 text-sm">
            <Calendar className="w-4 h-4 mr-1 text-slate-400" />
            <span>Weekend</span>
          </div>
          <div className="font-bold text-slate-700">
            +${userProfile.differentials.weekend}/hr
          </div>
        </div>
        <div
          className={`p-3 rounded-2xl text-center border ${
            theme === 'light'
              ? 'bg-slate-50 border-slate-100'
              : 'bg-slate-600 border-slate-500'
          }`}
        >
          <div className="flex items-center justify-center mb-1 text-sm">
            <Star className="w-4 h-4 mr-1 text-yellow-500" />
            <span>Other</span>
          </div>
          <div className="font-bold text-slate-700">
            +${userProfile.differentials.other}/hr
          </div>
        </div>
      </div>

      <div
        className={`text-sm border rounded-2xl p-4 flex items-center ${
          theme === 'light'
            ? 'bg-cyan-50 border-cyan-100'
            : 'bg-slate-600 border-slate-500'
        }`}
      >
        <div className="w-10 h-10 bg-gradient-to-r from-slate-300 to-cyan-300 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
          <span className="text-white font-bold">AI</span>
        </div>
        <div>
          <span className="font-medium">
            Potential monthly additional earnings:
          </span>
          <span className="font-bold text-slate-600 ml-1">
            ${calculatePotentialDifferentials()}
          </span>
        </div>
      </div>

      <h3 className="font-medium text-slate-600">Suggested Actions</h3>
      <ul className="space-y-2 text-sm text-gray-700">
        <li className="flex items-start">
          <div className="bg-green-100 rounded-full p-1 mr-2 mt-0.5">
            <ArrowUp className="w-3 h-3 text-green-600" />
          </div>
          <div>Q3 performance review for 3-5% raise</div>
        </li>
        <li className="flex items-start">
          <div className="bg-green-100 rounded-full p-1 mr-2 mt-0.5">
            <ArrowUp className="w-3 h-3 text-green-600" />
          </div>
          <div>TNCC cert for trauma → higher differentials</div>
        </li>
        <li className="flex items-start">
          <div className="bg-red-100 rounded-full p-1 mr-2 mt-0.5">
            <ArrowDown className="w-3 h-3 text-red-600" />
          </div>
          <div>401k contributions below recommended stage</div>
        </li>
      </ul>
    </div>
  );
}
