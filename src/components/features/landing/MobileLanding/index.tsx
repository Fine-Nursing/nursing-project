'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { m, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  ChevronDown,
  TrendingUp,
  Users,
  Brain,
  Star,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  User
} from 'lucide-react';

// Components
import HeroSection from './components/HeroSection';
import PainPoints from './components/PainPoints';
import Solutions from './components/Solutions';
import KeyFeatures from './components/KeyFeatures';
import InteractiveDemo from './components/InteractiveDemo';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import FloatingCTA from './components/FloatingCTA';

// Types
interface MobileLandingProps {
  user?: {
    id: string;
    email?: string;
    firstName?: string;
    hasCompletedOnboarding?: boolean;
  } | null;
  onLoginClick: () => void;
  onSignUpClick: () => void;
  onSignOut?: () => void;
}

export default function MobileLanding({
  user,
  onLoginClick,
  onSignUpClick,
  onSignOut
}: MobileLandingProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation handlers
  const handleGetStarted = () => {
    // If user is logged in and completed onboarding, go to dashboard
    if (user && user.hasCompletedOnboarding) {
      router.push(`/users/${user.id}`);
    } else {
      // Otherwise go to onboarding
      router.push('/onboarding');
    }
  };

  const handleSignUpAndOnboard = () => {
    onSignUpClick();
    // After signup, they can start onboarding
  };

  const handleViewDashboard = () => {
    if (user) {
      router.push(`/users/${user.id}`);
    }
  };

  return (
    <div className="relative min-h-screen bg-white overflow-x-hidden">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-0.5 bg-gray-100 z-50">
        <div
          className="h-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900 text-sm">Nurse Journey</span>
          </div>

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            {showMenu ? (
              <X className="w-5 h-5 text-gray-700" />
            ) : (
              <Menu className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMenu && (
            <m.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg"
            >
              <nav className="px-4 py-4 space-y-1">
                {user ? (
                  <>
                    <div className="px-3 py-2 text-sm text-gray-600 border-b border-gray-100 mb-2">
                      {user.firstName || user.email?.split('@')[0]}
                    </div>
                    <button
                      onClick={() => {
                        handleViewDashboard();
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        onSignOut?.();
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-red-600"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        onLoginClick();
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700"
                    >
                      Log In
                    </button>
                    <button
                      onClick={() => {
                        onSignUpClick();
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg bg-emerald-500 text-white"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </nav>
            </m.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main ref={scrollRef} className="pt-[48px]">
        <HeroSection
          user={user}
          onGetStarted={handleGetStarted}
        />

        <PainPoints />

        <Solutions />

        <KeyFeatures />

        <InteractiveDemo
          onComplete={handleGetStarted}
        />

        <Testimonials />

        <FAQ />

        {/* Final CTA Section */}
        <section className="px-4 py-8 bg-gradient-to-br from-emerald-50 to-teal-50">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              {user ? 'Access Your Dashboard' : 'Ready to Compare Salaries?'}
            </h2>
            <p className="text-sm text-gray-600 mb-5 max-w-[280px] mx-auto">
              {user
                ? 'View your personalized salary analysis'
                : 'Join nurses making data-driven career decisions'
              }
            </p>
            <button
              onClick={handleGetStarted}
              className="px-6 py-3 bg-emerald-500 text-white rounded-full font-semibold text-base shadow-lg active:scale-95 transition-transform"
            >
              {user ? 'Open Dashboard' : 'Get Started'}
            </button>
            {!user && (
              <p className="mt-3 text-xs text-gray-500">
                Free access • Anonymous
              </p>
            )}
          </m.div>
        </section>
      </main>

      {/* Floating CTA - Show for all users */}
      <FloatingCTA onGetStarted={handleGetStarted} />
    </div>
  );
}