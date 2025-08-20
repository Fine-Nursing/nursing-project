import React from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showPassword: boolean;
  onTogglePassword: () => void;
  error?: string;
  label?: string;
  required?: boolean;
}

export function PasswordInput({
  id,
  value,
  onChange,
  placeholder = 'Enter password',
  showPassword,
  onTogglePassword,
  error,
  label,
  required = true,
}: PasswordInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl
                     focus:ring-2 focus:ring-slate-200 outline-none transition-all
                     ${error 
                       ? 'border-red-300 focus:border-red-500' 
                       : 'border-gray-200 focus:border-slate-500'}`}
          placeholder={placeholder}
        />
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}