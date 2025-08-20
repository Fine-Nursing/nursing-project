import React from 'react';
import { HiCheck } from 'react-icons/hi';
import { PiRocketLaunchBold } from 'react-icons/pi';

interface CTASectionProps {
  onOnboardingClick: () => void;
}

export function CTASection({ onOnboardingClick }: CTASectionProps) {
  return (
    <section className="px-6 py-12 bg-gradient-to-b from-emerald-500 to-teal-500">
      <div className="text-center">
        <h2 className="text-3xl font-semibold text-white mb-3">
          Start your journey today
        </h2>
        <p className="text-white/90 mb-8 text-lg">
          Join thousands of nurses taking control
        </p>
        
        <button
          onClick={onOnboardingClick}
          className="w-full py-4 bg-white text-emerald-600 rounded-[14px] font-semibold active:bg-gray-50 transition-colors"
        >
          Get Started Free
        </button>
        
        <div className="flex items-center justify-center gap-6 mt-6 text-sm text-white/80">
          <div className="flex items-center gap-1.5">
            <HiCheck className="w-4 h-4" />
            <span>No credit card</span>
          </div>
          <div className="flex items-center gap-1.5">
            <PiRocketLaunchBold className="w-4 h-4" />
            <span>100% free</span>
          </div>
        </div>
      </div>
    </section>
  );
}