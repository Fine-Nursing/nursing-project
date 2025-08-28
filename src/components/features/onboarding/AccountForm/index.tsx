'use client';

import React, { useEffect } from 'react';
import { m } from 'framer-motion';
import ActionButton from 'src/components/ui/button/ActionButton';
import useOnboardingStore from 'src/store/onboardingStores';

// Components
import { AuthenticatedView } from './components/AuthenticatedView';
import { FormHeader } from './components/FormHeader';
import { EmailInput } from './components/EmailInput';
import { PasswordInput } from './components/PasswordInput';
import { TermsCheckbox } from './components/TermsCheckbox';
import { GoogleSignInButton } from './components/GoogleSignInButton';
import { SocialLoginDivider } from './components/SocialLoginDivider';

// Hook
import { useAccountForm } from './hooks/useAccountForm';

export default function AccountForm() {
  const { setStep, tempUserId } = useOnboardingStore();
  const {
    // State
    formData,
    errors,
    isSignIn,
    showPassword,
    showConfirmPassword,
    agreedToTerms,
    isLoading,
    isAuthenticated,
    user,
    // Actions
    updateField,
    setShowPassword,
    setShowConfirmPassword,
    setAgreedToTerms,
    toggleMode,
    handleSignUp,
    handleSignIn,
    handleAlreadyAuthenticated,
  } = useAccountForm();

  // Handle already authenticated users
  useEffect(() => {
    if (isAuthenticated && user && tempUserId && !isLoading) {
      handleAlreadyAuthenticated();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, tempUserId]);

  // Show authenticated view if already logged in
  if (isAuthenticated && user) {
    return <AuthenticatedView user={user} isLoading={isLoading} />;
  }

  // Sign In Form
  if (isSignIn) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 sm:py-12">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl"
        >
          <FormHeader isSignIn />

          <form onSubmit={handleSignIn} className="space-y-6">
            <EmailInput
              id="signin-email"
              label="Email"
              value={formData.email}
              onChange={(value) => updateField('email', value)}
              error={errors.email}
            />

            <PasswordInput
              id="signin-password"
              label="Password"
              value={formData.password}
              onChange={(value) => updateField('password', value)}
              placeholder="Enter your password"
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              error={errors.password}
            />

            <ActionButton
              type="submit"
              disabled={isLoading}
              className="w-full py-3"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Signing in...
                </span>
              ) : (
                'Sign In & Complete Onboarding'
              )}
            </ActionButton>
          </form>

          <SocialLoginDivider />
          
          <GoogleSignInButton
            onComplete={handleAlreadyAuthenticated}
            isLoading={isLoading}
          />

          <div className="text-center mt-6">
            <p className="text-gray-600 dark:text-gray-300">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={toggleMode}
                className="text-slate-600 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-200 font-medium"
              >
                Sign Up
              </button>
            </p>
          </div>
        </m.div>

        <div className="flex justify-center mt-6">
          <ActionButton
            onClick={() => setStep('culture')}
            variant="outline"
            className="px-6 py-3"
          >
            ← Back
          </ActionButton>
        </div>
      </div>
    );
  }

  // Sign Up Form
  return (
    <div className="max-w-lg mx-auto px-4 py-8 sm:py-12">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl"
      >
        <FormHeader isSignIn={false} />

        <form onSubmit={handleSignUp} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl
                         focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         ${errors.firstName 
                           ? 'border-red-300 focus:border-red-500 dark:border-red-400' 
                           : 'border-gray-200 dark:border-gray-600'}`}
                placeholder="John"
              />
              {errors.firstName && (
                <p className="text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl
                         focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         ${errors.lastName 
                           ? 'border-red-300 focus:border-red-500 dark:border-red-400' 
                           : 'border-gray-200 dark:border-gray-600'}`}
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          <EmailInput
            id="signup-email"
            label="Email"
            value={formData.email}
            onChange={(value) => updateField('email', value)}
            error={errors.email}
          />

          <PasswordInput
            id="signup-password"
            label="Password"
            value={formData.password}
            onChange={(value) => updateField('password', value)}
            placeholder="Create a password"
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            error={errors.password}
          />

          <PasswordInput
            id="confirmPassword"
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={(value) => updateField('confirmPassword', value)}
            placeholder="Confirm your password"
            showPassword={showConfirmPassword}
            onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
            error={errors.confirmPassword}
          />

          <TermsCheckbox
            checked={agreedToTerms}
            onChange={setAgreedToTerms}
            error={!agreedToTerms && errors.confirmPassword !== undefined}
          />

          <ActionButton
            type="submit"
            disabled={isLoading || !agreedToTerms}
            className="w-full py-3"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Creating account...
              </span>
            ) : (
              'Create Account & Complete Onboarding'
            )}
          </ActionButton>
        </form>

        <SocialLoginDivider />
        
        <GoogleSignInButton
          onComplete={handleAlreadyAuthenticated}
          isLoading={isLoading}
          text="Sign up with Google"
        />

        <div className="text-center mt-6">
          <p className="text-gray-600 dark:text-gray-300">
            Already have an account?{' '}
            <button
              type="button"
              onClick={toggleMode}
              className="text-slate-600 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-200 font-medium"
            >
              Sign In
            </button>
          </p>
        </div>
      </m.div>

      <div className="flex justify-center mt-6">
        <ActionButton
          onClick={() => setStep('culture')}
          variant="outline"
          className="px-6 py-3"
        >
          ← Back
        </ActionButton>
      </div>
    </div>
  );
}