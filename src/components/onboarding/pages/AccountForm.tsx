'use client';

import React, { useState } from 'react';
import useOnboardingStore from 'src/store/onboardingStores';

export default function AccountForm() {
  const { formData, updateFormData, setStep } = useOnboardingStore();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-sm">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          You&apos;re all set! 🎉
        </h2>
        <p className="mt-2 text-gray-600">
          Just create a password to complete your account and access your
          personalized dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 이메일 필드 */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="email-input"
            className="text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email-input"
            type="email"
            name="email"
            required
            autoComplete="email"
            className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
            value={formData.email || ''}
            onChange={(e) => updateFormData({ email: e.target.value })}
          />
        </div>

        {/* 비밀번호 필드 */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="password-input"
            className="text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="relative rounded-md shadow-sm">
            <input
              id="password-input"
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              autoComplete="new-password"
              className="block w-full rounded-md border border-gray-300 pr-10 focus:border-slate-500 focus:ring-slate-500"
              value={formData.password || ''}
              onChange={(e) => updateFormData({ password: e.target.value })}
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
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

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-400">or login with</span>
          </div>
        </div>

        {/* 구글 로그인 버튼 */}
        <button
          type="button"
          aria-label="Continue with Google"
          className="w-full flex items-center justify-center space-x-2 rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
        >
          <img src="/api/placeholder/20/20" alt="" className="w-5 h-5" />
          <span>Continue with Google</span>
        </button>

        {/* 네비게이션 버튼들 */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={() => setStep('culture')}
            className="text-slate-600 px-6 py-2 rounded-lg border border-slate-600 hover:bg-slate-50 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-slate-600 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Complete Setup
          </button>
        </div>
      </form>
    </div>
  );
}
