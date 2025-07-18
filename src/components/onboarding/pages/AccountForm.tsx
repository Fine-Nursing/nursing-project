'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ActionButton from 'src/components/button/ActionButton';
import useOnboardingStore from 'src/store/onboardingStores';

import toast from 'react-hot-toast';
import useAuth from 'src/api/Auth/useAuth';
import useCompleteOnboarding from 'src/api/onboarding/useCompleteOnboarding';
import useAuthStore from 'src/components/AuthInitializer';

export default function AccountForm() {
  const { tempUserId, setStep } = useOnboardingStore();
  const { user, isAuthenticated } = useAuthStore(); // 현재 로그인 상태 확인
  const { signUp, signIn, isLoading: authLoading } = useAuth();
  const { completeOnboarding, isLoading: completeLoading } =
    useCompleteOnboarding();

  // 로그인/회원가입용 별도 state
  const [isSignIn, setIsSignIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const isLoading = authLoading || completeLoading;

  const handleAlreadyAuthenticated = async () => {
    try {
      toast.loading('Saving your onboarding data...', { id: 'complete' });
      await completeOnboarding();
      toast.success('Onboarding completed!', { id: 'complete' });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to complete onboarding',
        { id: 'complete' }
      );
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    if (!tempUserId) {
      toast.error('Session error. Please restart the onboarding process.');
      return;
    }

    try {
      // 1. 회원가입
      const signUpResult = await signUp({
        email,
        password,
        firstName,
        lastName,
      });

      if (signUpResult && signUpResult.user) {
        // 2. 회원가입 성공 후 온보딩 데이터 병합
        await completeOnboarding();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create account'
      );
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tempUserId) {
      toast.error('Session error. Please restart the onboarding process.');
      return;
    }

    try {
      // 1. 로그인
      const signInResult = await signIn({ email, password });

      if (signInResult && signInResult.user) {
        // 2. 로그인 성공 후 온보딩 데이터 병합
        await completeOnboarding();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to sign in');
    }
  };

  // 이미 로그인되어 있으면 바로 complete 처리
  useEffect(() => {
    if (isAuthenticated && user && tempUserId) {
      handleAlreadyAuthenticated();
    }
  }, [isAuthenticated, user, tempUserId]);

  // 이미 로그인된 상태라면 완료 화면 표시
  if (isAuthenticated && user) {
    return (
      <div className="max-w-md mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Welcome back, {user.firstName || user.first_name || 'there'}!
            </h2>
            <p className="text-gray-600 mb-6">
              {isLoading
                ? 'Saving your onboarding information...'
                : "Your account is already set up. We're finishing up your onboarding."}
            </p>
            {isLoading && (
              <div className="flex justify-center">
                <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600" />
              </div>
            )}
          </div>
        </motion.div>

        <div className="flex justify-center mt-6">
          <ActionButton
            onClick={() => setStep('culture')}
            variant="outline"
            className="px-6 py-3"
            disabled={isLoading}
          >
            ← Back
          </ActionButton>
        </div>
      </div>
    );
  }

  // 로그인되지 않은 경우 기존 폼 표시
  if (isSignIn) {
    // Sign In Form (기존 코드 그대로)
    return (
      <div className="max-w-md mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Welcome back! 👋
            </h2>
            <p className="text-gray-600">
              Sign in to save your onboarding progress
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="signin-email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="signin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl
                         focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="signin-password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="signin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl
                           focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

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

            <div className="text-center">
              <p className="text-gray-600">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignIn(false)}
                  className="text-slate-600 hover:text-slate-700 font-medium"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </form>
        </motion.div>

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

  // Sign Up Form (기존 코드 그대로)
  return (
    <div className="max-w-md mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Final Step! 🎉
          </h2>
          <p className="text-gray-600">
            Create your account to save all your information
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl
                         focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl
                         focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="signup-email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl
                       focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
              placeholder="your@email.com"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="signup-password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl
                         focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl
                         focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input
              id="terms"
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 text-slate-600 focus:ring-slate-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the{' '}
              <button
                type="button"
                onClick={() => alert('Terms of Service - Coming Soon')}
                className="text-slate-600 hover:text-slate-700 underline"
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={() => alert('Privacy Policy - Coming Soon')}
                className="text-slate-600 hover:text-slate-700 underline"
              >
                Privacy Policy
              </button>
            </label>
          </div>

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

          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignIn(true)}
                className="text-slate-600 hover:text-slate-700 font-medium"
              >
                Sign In
              </button>
            </p>
          </div>
        </form>
      </motion.div>

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
