'use client';

import React, { useState, useCallback, memo } from 'react';
import { X } from 'lucide-react';
import LoginForm from './forms/LoginForm';
import SignUpForm from './forms/SignUpForm';
import SocialAuthButtons from './components/SocialAuthButtons';
import AuthDivider from './components/AuthDivider';

export type AuthMode = 'login' | 'signup';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: AuthMode;
  onAuthSuccess?: () => void;
  onModeSwitch?: (mode: AuthMode) => void;
  onLogin?: (data: { email: string; password: string }) => Promise<void>;
  onSignUp?: (data: { 
    email: string; 
    password: string; 
    firstName: string; 
    lastName: string 
  }) => Promise<void>;
  isLoading?: boolean;
}

export const AuthModal = memo(({
  isOpen,
  onClose,
  mode = 'login',
  onAuthSuccess,
  onModeSwitch,
  onLogin,
  onSignUp,
  isLoading = false,
}: AuthModalProps) => {
  const [currentMode, setCurrentMode] = useState<AuthMode>(mode);

  const handleModeSwitch = useCallback(() => {
    const newMode = currentMode === 'login' ? 'signup' : 'login';
    setCurrentMode(newMode);
    onModeSwitch?.(newMode);
  }, [currentMode, onModeSwitch]);

  const handleSuccess = useCallback(() => {
    onAuthSuccess?.();
    onClose();
  }, [onAuthSuccess, onClose]);

  if (!isOpen) return null;

  const isLogin = currentMode === 'login';
  const title = isLogin ? 'Welcome Back!' : 'Join Nurse Journey';
  const subtitle = isLogin ? 'Sign in to continue your journey' : 'Start your career development journey';

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fadeIn"
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-hidden animate-slideUp"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-emerald-400 to-teal-500 p-6 text-white">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 p-1 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 id="auth-modal-title" className="text-2xl font-bold">{title}</h2>
          <p className="text-emerald-50 mt-1">{subtitle}</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Social Auth */}
          <SocialAuthButtons onSuccess={handleSuccess} />
          
          {/* Divider */}
          <AuthDivider />
          
          {/* Form */}
          {isLogin ? (
            <LoginForm 
              onSuccess={handleSuccess} 
              onSubmit={onLogin}
              isLoading={isLoading}
            />
          ) : (
            <SignUpForm 
              onSuccess={handleSuccess} 
              onSubmit={onSignUp}
              isLoading={isLoading}
            />
          )}
          
          {/* Mode Switch */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                type="button"
                onClick={handleModeSwitch}
                className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
});

AuthModal.displayName = 'AuthModal';