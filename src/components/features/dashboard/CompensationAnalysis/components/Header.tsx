import React from 'react';
import { Edit2, X } from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

export function Header({ theme, isEditing, setIsEditing }: HeaderProps) {
  return (
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
  );
}