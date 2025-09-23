import React from 'react';
import { m } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  user?: {
    id: string;
    firstName?: string;
    email?: string;
    hasCompletedOnboarding?: boolean;
  } | null;
  onGetStarted: () => void;
}

export default function HeroSection({ user, onGetStarted }: HeroSectionProps) {
  const userName = user?.firstName || user?.email?.split('@')[0];

  return (
    <section className="min-h-[calc(100vh-48px)] bg-white px-4 py-12 flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center">
        {/* Badge */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center px-3 py-1.5 bg-emerald-50 rounded-full mb-6">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
              Nurse Salary Intelligence
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Are You Being
            <span className="block text-emerald-600">Paid Fairly?</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base text-gray-600 mb-8 max-w-xs mx-auto">
            Compare your salary with real data from nurses in your specialty and location
          </p>

          {/* Value propositions */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Real salary data from verified nurses</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Location & specialty specific insights</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>100% anonymous comparison</span>
            </div>
          </div>

          {/* Salary preview */}
          <div className="bg-gray-50 rounded-xl p-4 mb-8 max-w-sm mx-auto">
            <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Average RN Salary Range</div>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-3xl font-bold text-gray-900">$65-85</span>
              <span className="text-sm text-gray-600">/hour</span>
            </div>
            <div className="text-xs text-gray-500 mt-2">Based on your location</div>
          </div>

          {/* CTA section */}
          <m.button
            whileTap={{ scale: 0.98 }}
            onClick={onGetStarted}
            className="w-full max-w-sm mx-auto bg-emerald-600 text-white py-4 px-6 rounded-xl font-semibold text-base shadow-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 group"
          >
            {user ? 'View Analysis' : 'Compare Your Salary'}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </m.button>

          {/* Trust text */}
          <p className="text-xs text-gray-500 mt-4">
            Free access • 2-minute setup
          </p>

          {/* User specific actions */}
          {user && user.hasCompletedOnboarding && (
            <button
              onClick={() => window.location.href = `/users/${user.id}`}
              className="mt-4 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
            >
              View Dashboard →
            </button>
          )}
        </m.div>
      </div>

      {/* Bottom trust indicators */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
          <span>HIPAA Compliant</span>
          <span>•</span>
          <span>Verified Data</span>
          <span>•</span>
          <span>Secure</span>
        </div>
      </div>
    </section>
  );
}