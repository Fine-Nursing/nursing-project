import React from 'react';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import PasswordStrength from '../../../components/PasswordStrength';
import type { SignUpFormData } from '../types';

interface PasswordFieldsProps {
  formData: SignUpFormData;
  errors: {
    password?: string;
  };
  confirmPasswordError: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  isLoading: boolean;
  onInputChange: (field: keyof SignUpFormData, value: string) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
}

export default function PasswordFields({ 
  formData, 
  errors, 
  confirmPasswordError,
  showPassword, 
  showConfirmPassword, 
  isLoading,
  onInputChange, 
  onTogglePassword, 
  onToggleConfirmPassword 
}: PasswordFieldsProps) {
  return (
    <>
      {/* Password Input */}
      <div>
        <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => onInputChange('password', e.target.value)}
            className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Create a strong password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-xs text-red-500">{errors.password}</p>
        )}
        <PasswordStrength password={formData.password} />
      </div>

      {/* Confirm Password Input */}
      <div>
        <label htmlFor="signup-confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="signup-confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => onInputChange('confirmPassword', e.target.value)}
            className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              confirmPasswordError ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Confirm your password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={onToggleConfirmPassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {confirmPasswordError && (
          <p className="mt-1 text-xs text-red-500">{confirmPasswordError}</p>
        )}
        {formData.confirmPassword && formData.password === formData.confirmPassword && (
          <div className="flex items-center gap-1 mt-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-xs text-green-500">Passwords match</span>
          </div>
        )}
      </div>
    </>
  );
}