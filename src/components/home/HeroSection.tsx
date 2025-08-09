'use client';

import React, { memo, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';

const FloatingOnboardButton = lazy(
  () => import('src/components/button/FloatingOnboardButton')
);

interface HeroSectionProps {
  displayedGreeting: string;
  displayedMessage: string;
  user: any;
  onOnboardingClick: () => void;
}

const HeroSection = memo(({ 
  displayedGreeting, 
  displayedMessage, 
  user, 
  onOnboardingClick 
}: HeroSectionProps) => (
  <section
    id="hero"
    className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-emerald-50/20 to-white dark:bg-gradient-to-b dark:from-black dark:via-zinc-950 dark:to-black overflow-hidden transition-colors"
  >
    {/* Background decoration - Simplified for mobile */}
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/20 via-transparent to-blue-50/20 dark:from-emerald-900/10 dark:via-transparent dark:to-blue-900/10" />
    
    <div className="relative max-w-7xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-6"
      >
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-3"
        >
          {displayedGreeting}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-2xl text-emerald-500 dark:text-emerald-400 font-medium"
        >
          {displayedMessage}
        </motion.p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-sm sm:text-lg text-gray-600 dark:text-zinc-400 mb-8 max-w-3xl mx-auto px-4"
      >
        {user ? (
          <>Track your progression • Explore opportunities • Achieve your goals</>
        ) : (
          <>Join 50,000+ nurses • Real-time data • Career transformation</>
        )}
      </motion.p>
      
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
));

HeroSection.displayName = 'HeroSection';

export default HeroSection;