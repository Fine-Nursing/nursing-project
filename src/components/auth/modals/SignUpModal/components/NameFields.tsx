import React from 'react';
import { User } from 'lucide-react';
import type { SignUpFormData } from '../types';

interface NameFieldsProps {
  formData: SignUpFormData;
  errors: {
    firstName?: string;
    lastName?: string;
  };
  isLoading: boolean;
  onInputChange: (field: keyof SignUpFormData, value: string) => void;
}

export default function NameFields({ formData, errors, isLoading, onInputChange }: NameFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label htmlFor="signup-firstName" className="block text-sm font-medium text-gray-700 mb-1">
          First Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="signup-firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) => onInputChange('firstName', e.target.value)}
            className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Jane"
            disabled={isLoading}
          />
        </div>
        {errors.firstName && (
          <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="signup-lastName" className="block text-sm font-medium text-gray-700 mb-1">
          Last Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="signup-lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => onInputChange('lastName', e.target.value)}
            className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Doe"
            disabled={isLoading}
          />
        </div>
        {errors.lastName && (
          <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
        )}
      </div>
    </div>
  );
}