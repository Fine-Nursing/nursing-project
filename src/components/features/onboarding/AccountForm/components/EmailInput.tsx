import React from 'react';
import { Mail } from 'lucide-react';

interface EmailInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  label?: string;
  required?: boolean;
}

export function EmailInput({
  id,
  value,
  onChange,
  placeholder = 'your@email.com',
  error,
  label,
  required = true,
}: EmailInputProps) {
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
          type="email"
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl
                     focus:ring-2 focus:ring-slate-200 outline-none transition-all
                     ${error 
                       ? 'border-red-300 focus:border-red-500' 
                       : 'border-gray-200 focus:border-slate-500'}`}
          placeholder={placeholder}
        />
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}