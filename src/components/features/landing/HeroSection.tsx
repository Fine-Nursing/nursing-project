'use client';

import React, { memo, Suspense, lazy } from 'react';
import { m } from 'framer-motion';
import { useTheme } from 'src/hooks/useTheme';
import { useTheme as useThemeContext } from 'src/contexts/ThemeContext';

const FloatingOnboardButton = lazy(
  () => import('src/components/ui/button/FloatingOnboardButton')
);

interface User {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  hasCompletedOnboarding?: boolean;
}

interface HeroSectionProps {
  displayedGreeting: string;
  displayedMessage: string;
  user: User | null;
  onOnboardingClick: () => void;
}

const HeroSection = memo(({ 
  displayedGreeting, 
  displayedMessage, 
  user, 
  onOnboardingClick 
}: HeroSectionProps) => {
  const { theme } = useThemeContext();
  const { bg } = useTheme(theme);
  
  return (
    <section
        id="hero"
        className={`relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors ${bg.gradient}`}
      >
        {/* Background decoration - Simplified for mobile */}
        <div className={`absolute inset-0 ${bg.decorative}`} />
        
        <div className="relative max-w-7xl mx-auto text-center">
          <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-6"
      >
        <m.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-3"
        >
          {displayedGreeting}
        </m.h2>
        <m.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-2xl text-emerald-500 dark:text-emerald-400 font-medium"
        >
          {displayedMessage}
            </m.p>
          </m.div>

          <m.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-sm sm:text-lg text-gray-600 dark:text-zinc-400 mb-8 max-w-3xl mx-auto px-4"
      >
        {user ? (
          <>Track your progression • Explore opportunities • Achieve your goals</>
        ) : (
          <>Real salary data • Real-time updates • Career transformation</>
        )}
          </m.p>
      
          <div className="flex justify-center">
        <Suspense
          fallback={
            <div className="h-12 w-48 bg-emerald-200 rounded-lg animate-pulse" />
          }
        >
          <FloatingOnboardButton
            onClick={onOnboardingClick}
            isCompleted={user?.hasCompletedOnboarding}
          />
        </Suspense>
          </div>
        </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;