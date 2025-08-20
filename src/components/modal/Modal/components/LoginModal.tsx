'use client';

import React, { useState } from 'react';
import Modal from '../index';
import { GoogleLoginButton } from './GoogleLoginButton';
import { SocialLoginDivider } from './SocialLoginDivider';
import { useAuthModal } from '../hooks/useAuthModal';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
  onAuthSuccess?: () => void;
}

export function LoginModal({
  isOpen,
  onClose,
  onSwitchToSignUp,
  onAuthSuccess,
}: LoginModalProps) {
  const { isLoading, errors, clearError, handleSignIn } = useAuthModal();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSignIn(formData, onAuthSuccess, onClose);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      clearError(field);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">
          Welcome back to <span className="text-slate-900">Nurse</span>
          <span className="text-purple-600"> Journey</span>
        </h2>
        <p className="text-gray-600">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            required
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            required
            disabled={isLoading}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) =>
                handleInputChange('rememberMe', e.target.checked)
              }
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              disabled={isLoading}
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>

          <button
            type="button"
            className="text-sm text-purple-600 hover:text-purple-700"
            disabled={isLoading}
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <SocialLoginDivider />
      <GoogleLoginButton isLoading={isLoading} />

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="text-purple-600 hover:text-purple-700 font-medium"
            disabled={isLoading}
          >
            Sign Up
          </button>
        </p>
      </div>
    </Modal>
  );
}