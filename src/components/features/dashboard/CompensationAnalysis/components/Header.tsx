import React from 'react';
import { Edit2, X, Clock } from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  onEditCompensation?: () => void;
  shiftHours?: number;
}

export function Header({ theme, isEditing, setIsEditing, onEditCompensation, shiftHours = 12 }: HeaderProps) {
  return (
    <div className={`px-3 sm:px-6 py-3 sm:py-4 border-b ${
      theme === 'light' ? 'border-gray-100' : 'border-slate-700'
    }`}>
      <div className="flex items-start sm:items-center justify-between">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <h2 className={`text-base sm:text-lg font-semibold ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Base and Differential Pay
            </h2>
            <div className={`inline-flex self-start sm:self-auto items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${
              theme === 'light' ? 'bg-blue-100 text-blue-700' : 'bg-blue-900/30 text-blue-300'
            }`}>
              <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>{shiftHours} hr shifts</span>
            </div>
          </div>
          <p className={`text-xs sm:text-sm mt-0.5 ${
            theme === 'light' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            Your base pay and differential breakdown
          </p>
        </div>
        
        <button
          onClick={() => {
            if (onEditCompensation) {
              onEditCompensation();
            } else {
              setIsEditing(!isEditing);
            }
          }}
          className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 sm:gap-1.5 ${
            isEditing
              ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50'
          }`}
        >
          {isEditing ? (
            <>
              <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Cancel</span>
            </>
          ) : (
            <>
              <Edit2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Edit</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}export default Header
