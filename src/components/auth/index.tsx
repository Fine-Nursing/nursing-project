'use client';

import React from 'react';
import LoginModal from './modals/LoginModal';
import SignUpModal from './modals/SignUpModal';

// Re-export components for easy import
export { LoginModal, SignUpModal };
export { default as PasswordStrength } from './components/PasswordStrength';

// Export the main OptimizedAuthModals for backward compatibility
export { LoginModal as OptimizedLoginModal, SignUpModal as OptimizedSignUpModal };

// Main export combining both modals (if needed for backward compatibility)
interface OptimizedAuthModalsProps {
  isLoginOpen?: boolean;
  isSignUpOpen?: boolean;
  onLoginClose?: () => void;
  onSignUpClose?: () => void;
  onLoginSubmit?: (data: { email: string; password: string }) => Promise<void>;
  onSignUpSubmit?: (data: { 
    email: string; 
    password: string; 
    firstName: string; 
    lastName: string 
  }) => Promise<void>;
  onSwitchToSignUp?: () => void;
  onSwitchToLogin?: () => void;
  isLoading?: boolean;
}

export default function OptimizedAuthModals({
  isLoginOpen = false,
  isSignUpOpen = false,
  onLoginClose = () => {},
  onSignUpClose = () => {},
  onLoginSubmit = async () => {},
  onSignUpSubmit = async () => {},
  onSwitchToSignUp = () => {},
  onSwitchToLogin = () => {},
  isLoading = false,
}: OptimizedAuthModalsProps) {
  return (
    <>
      <LoginModal
        isOpen={isLoginOpen}
        onClose={onLoginClose}
        onSubmit={onLoginSubmit}
        onSwitchToSignUp={onSwitchToSignUp}
        isLoading={isLoading}
      />
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={onSignUpClose}
        onSubmit={onSignUpSubmit}
        onSwitchToLogin={onSwitchToLogin}
        isLoading={isLoading}
      />
    </>
  );
}