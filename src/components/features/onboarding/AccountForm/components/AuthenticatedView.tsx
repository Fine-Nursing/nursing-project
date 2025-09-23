import React from 'react';
import { m } from 'framer-motion';
import ActionButton from 'src/components/ui/button/ActionButton';
import useOnboardingStore from 'src/store/onboardingStores';

interface AuthenticatedViewProps {
  user: any;
  isLoading: boolean;
}

export function AuthenticatedView({ user, isLoading }: AuthenticatedViewProps) {
  const { setStep } = useOnboardingStore();

  return (
    <div className="max-w-md mx-auto px-4 py-6 sm:py-8">
      <m.div
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
      </m.div>

      <div className="flex justify-center mt-6">
        <ActionButton
          onClick={() => setStep('culture')}
          variant="outline"
          className="px-4 py-2 sm:px-6 sm:py-3"
          disabled={isLoading}
        >
          ← Back
        </ActionButton>
      </div>
    </div>
  );
}