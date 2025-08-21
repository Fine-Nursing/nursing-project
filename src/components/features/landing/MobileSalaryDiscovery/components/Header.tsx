import React from 'react';

interface HeaderProps {
  onLoginClick?: () => void;
  onOnboardingClick: () => void;
}

export function Header({ onLoginClick, onOnboardingClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50">
      <div className="flex items-center justify-between px-5 py-4">
        <span className="font-semibold text-gray-900 text-[18px]">Nurse Journey</span>
        <div className="flex items-center gap-3">
          {onLoginClick && (
            <button
              onClick={onLoginClick}
              className="text-sm font-medium text-gray-700 active:text-gray-900 transition-colors"
            >
              Log In
            </button>
          )}
          <button
            onClick={onOnboardingClick}
            className="px-4 py-1.5 bg-emerald-500 text-white text-sm font-medium rounded-full transition-all duration-200 active:bg-emerald-600"
          >
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
}