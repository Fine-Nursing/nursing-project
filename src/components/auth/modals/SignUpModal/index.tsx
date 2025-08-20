'use client';

import React, { useCallback, memo } from 'react';
import ModalHeader from './components/ModalHeader';
import NameFields from './components/NameFields';
import EmailField from './components/EmailField';
import PasswordFields from './components/PasswordFields';
import TermsCheckbox from './components/TermsCheckbox';
import GoogleSignInButton from './components/GoogleSignInButton';
import useSignUpForm from './hooks/useSignUpForm';
import { MODAL_CLASSES } from './constants';
import type { SignUpModalProps } from './types';

const SignUpModal = memo(({
  isOpen,
  onClose,
  onSubmit,
  onSwitchToLogin,
  isLoading = false,
}: SignUpModalProps) => {
  const {
    formData,
    showPassword,
    showConfirmPassword,
    acceptTerms,
    setAcceptTerms,
    confirmPasswordError,
    errors,
    handleInputChange,
    togglePassword,
    toggleConfirmPassword,
    validateForm,
  } = useSignUpForm();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validatedData = validateForm();
    if (validatedData) {
      await onSubmit(validatedData);
    }
  }, [onSubmit, validateForm]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        role="presentation"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        className={MODAL_CLASSES.backdrop}
      />
      
      {/* Modal */}
      <div className={MODAL_CLASSES.modal}>
        <ModalHeader onClose={onClose} />

        {/* Content */}
        <form onSubmit={handleSubmit} className={MODAL_CLASSES.form}>
          <NameFields
            formData={formData}
            errors={errors}
            isLoading={isLoading}
            onInputChange={handleInputChange}
          />

          <EmailField
            formData={formData}
            errors={errors}
            isLoading={isLoading}
            onInputChange={handleInputChange}
          />

          <PasswordFields
            formData={formData}
            errors={errors}
            confirmPasswordError={confirmPasswordError}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            isLoading={isLoading}
            onInputChange={handleInputChange}
            onTogglePassword={togglePassword}
            onToggleConfirmPassword={toggleConfirmPassword}
          />

          <TermsCheckbox
            acceptTerms={acceptTerms}
            onAcceptTermsChange={setAcceptTerms}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !acceptTerms}
            className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>

          <GoogleSignInButton isLoading={isLoading} />

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Sign in
            </button>
          </p>
        </form>
      </div>
    </>
  );
});

SignUpModal.displayName = 'SignUpModal';

export default SignUpModal;