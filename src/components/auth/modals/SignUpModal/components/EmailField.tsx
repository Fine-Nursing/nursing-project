import React from 'react';
import { Mail } from 'lucide-react';
import type { SignUpFormData } from '../types';

interface EmailFieldProps {
  formData: SignUpFormData;
  errors: {
    email?: string;
  };
  isLoading: boolean;
  onInputChange: (field: keyof SignUpFormData, value: string) => void;
}

export default function EmailField({ formData, errors, isLoading, onInputChange }: EmailFieldProps) {
  return (
    <div>
      <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
        Email Address
      </label>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          id="signup-email"
          type="email"
          value={formData.email}
          onChange={(e) => onInputChange('email', e.target.value)}
          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="nurse@example.com"
          disabled={isLoading}
        />
      </div>
      {errors.email && (
        <p className="mt-1 text-xs text-red-500">{errors.email}</p>
      )}
    </div>
  );
}