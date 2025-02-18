'use client';

import React, { useState } from 'react';
import useOnboardingStore from 'src/store/onboardingStores';

export default function AccountForm() {
  const { formData, updateFormData, setStep } = useOnboardingStore();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // 여기서 실제로 백엔드로 회원가입(또는 로그인) 요청을 보내는 로직을 구현할 수 있습니다.
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-sm">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">You're all set! 🎉</h2>
        <p className="mt-2 text-gray-600">
          Just create a password to complete your account and access your
          personalized dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 이메일 필드 */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            className="
              mt-1 block w-full rounded-md border border-gray-300 shadow-sm
              focus:border-teal-500 focus:ring-teal-500
            "
            value={formData.email || ''}
            onChange={(e) => updateFormData({ email: e.target.value })}
          />
        </div>

        {/* 비밀번호 필드 */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              className="
                block w-full rounded-md border border-gray-300 pr-10
                focus:border-teal-500 focus:ring-teal-500
              "
              value={formData.password || ''}
              onChange={(e) => updateFormData({ password: e.target.value })}
            />
            <button
              type="button"
              className="
                absolute inset-y-0 right-0 px-3 flex items-center
                text-gray-500 hover:text-gray-700
              "
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                // 눈 감김 아이콘
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19
                      c-4.478 0-8.268-2.943-9.543-7
                      a9.97 9.97 0 011.563-3.029
                      m5.858.908
                      a3 3 0 114.243 4.243
                      M9.878 9.878l4.242 4.242
                      M9.88 9.88l-3.29-3.29
                      m7.532 7.532l3.29 3.29
                      M3 3l3.59 3.59
                      m0 0A9.953 9.953 0 0112 5
                      c4.478 0 8.268 2.943 9.543 7
                      a10.025 10.025 0 01-4.132 5.411
                      m0 0L21 21
                    "
                  />
                </svg>
              ) : (
                // 눈 뜸 아이콘
                <svg
                  className="h-5 w-5"
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
                    d="M2.458 12C3.732 7.943 7.523 5
                      12 5c4.478 0 8.268 2.943 9.542 7
                      -1.274 4.057 -5.064 7 -9.542 7
                      -4.477 0 -8.268 -2.943 -9.542 -7z
                    "
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

        {/* 구글 로그인 버튼 (원하면 teal로 바꿔도 됨) */}
        <button
          type="button"
          className="
            w-full flex items-center justify-center space-x-2
            rounded-md border border-gray-300
            bg-white py-2 px-4 text-sm font-medium text-gray-700
            shadow-sm hover:bg-gray-50
            focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
          "
        >
          {/* 임시 로고 */}
          <img src="/api/placeholder/20/20" alt="Google" className="w-5 h-5" />
          <span>Continue with Google</span>
        </button>

        {/* 네비게이션 버튼들 */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={() => setStep('culture')}
            className="
              text-teal-600 px-6 py-2 
              rounded-lg border border-teal-600 
              hover:bg-teal-50 transition-colors
            "
          >
            Back
          </button>
          <button
            type="submit"
            className="
              bg-teal-600 text-white px-6 py-2 
              rounded-lg hover:bg-teal-700 transition-colors
            "
          >
            Complete Setup
          </button>
        </div>
      </form>
    </div>
  );
}
