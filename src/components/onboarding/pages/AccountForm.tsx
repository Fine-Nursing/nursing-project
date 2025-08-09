'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ActionButton from 'src/components/button/ActionButton';
import useOnboardingStore from 'src/store/onboardingStores';
import toast from 'react-hot-toast';
import useAuth from 'src/api/Auth/useAuth';
import useCompleteOnboarding from 'src/api/onboarding/useCompleteOnboarding';
import useAuthStore from 'src/hooks/useAuthStore';
import { Eye, EyeOff, Mail, Lock, User, Check, Chrome } from 'lucide-react';
import AnimatedProgressBar from '../components/AnimatedProgressBar';

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

  const handleGoogleSignIn = async () => {
    try {
      // Import signInWithGoogle from supabase lib
      const { signInWithGoogle } = await import('../../../lib/supabase');
      const result = await signInWithGoogle();
      if (result && result.success) {
        await completeOnboarding();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to sign in with Google'
      );
    }
  };

  // 이미 로그인되어 있으면 바로 complete 처리
  useEffect(() => {
    if (isAuthenticated && user && tempUserId && !completeLoading) {
      handleAlreadyAuthenticated();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, tempUserId]);

  // 이미 로그인된 상태라면 완료 화면 표시
  if (isAuthenticated && user) {
    return (
      <div className="max-w-md mx-auto px-4 py-6 sm:py-8">
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
      <div className="max-w-md mx-auto px-4 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <User className="w-8 h-8 text-slate-600" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Welcome back!
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
              <div className="relative">
                <input
                  id="signin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl
                           focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                  placeholder="your@email.com"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
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
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl
                           focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                  placeholder="Enter your password"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
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
          </form>

          {/* Social Login Divider */}
          <div className="my-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl
                     bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all
                     font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </button>

          <div className="text-center mt-6">
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
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-gradient-to-br from-slate-500 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Check className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Final Step!
          </h2>
          <p className="text-gray-600">
            Create your account to save all your information
          </p>
          <div className="mt-4">
            <AnimatedProgressBar progress={95} showPercentage={false} height="h-1" className="max-w-xs mx-auto" />
          </div>
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
                onClick={() => toast('Terms of Service - Coming Soon', { icon: '📄' })}
                className="text-slate-600 hover:text-slate-700 underline"
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={() => toast('Privacy Policy - Coming Soon', { icon: '🔒' })}
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
        </form>

        {/* Social Login Divider */}
        <div className="my-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl
                   bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all
                   font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {isLoading ? 'Creating account...' : 'Sign up with Google'}
        </button>

        <div className="text-center mt-6">
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
