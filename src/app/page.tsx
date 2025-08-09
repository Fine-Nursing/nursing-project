'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
import type { NursingTableParams } from 'src/api/useNursingTable';
import { useNursingTable } from 'src/api/useNursingTable';
import useAuthStore from 'src/hooks/useAuthStore';
import useAuth from 'src/api/Auth/useAuth';
import useIsMobile from 'src/hooks/useIsMobile';
import { motion } from 'framer-motion';
import {
  LoginModal,
  SignUpModal,
} from 'src/components/auth/OptimizedAuthModals';

// Import separated components
import Header from 'src/components/home/Header';
import HeroSection from 'src/components/home/HeroSection';
import CompensationSection from 'src/components/home/CompensationSection';
import DataSection from 'src/components/home/DataSection';
import FeaturesSection from 'src/components/home/FeaturesSection';
import TestimonialsSection from 'src/components/home/TestimonialsSection';
import Footer from 'src/components/home/Footer';
import MobileSalaryDiscovery from 'src/components/home/MobileSalaryDiscovery';


export default function HomePage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const {
    user,
    isLoading: isCheckingAuth,
    signOut,
    checkAuth,
  } = useAuthStore();
  const { signIn, signUp, isLoading: isAuthLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  // Greeting data calculation
  const greetingData = useMemo(() => {
    const hour = new Date().getHours();
    const userName = user?.firstName || user?.email?.split('@')[0] || 'Nurse';

    const greetings = {
      morning: {
        greeting: `Good morning, ${userName}!`,
        message: 'Ready to make today amazing?',
      },
      afternoon: {
        greeting: `Good afternoon, ${userName}!`,
        message: 'Hope your shift is going well.',
      },
      evening: {
        greeting: `Good evening, ${userName}!`,
        message: 'Time to unwind and explore opportunities.',
      },
      night: {
        greeting: `Still up, ${userName}?`,
        message: 'Night shift or planning ahead?',
      },
      default: {
        greeting: 'Welcome to Nurse Journey',
        message: 'Real salary data from real nurses.',
      },
    };

    if (!user) return greetings.default;
    if (hour >= 5 && hour < 12) return greetings.morning;
    if (hour >= 12 && hour < 17) return greetings.afternoon;
    if (hour >= 17 && hour < 21) return greetings.evening;
    return greetings.night;
  }, [user]);

  const [displayedGreeting, setDisplayedGreeting] = useState('');
  const [displayedMessage, setDisplayedMessage] = useState('');

  useEffect(() => {
    setDisplayedGreeting(greetingData.greeting);
    setDisplayedMessage(greetingData.message);
  }, [greetingData]);

  // API filter state
  const [tableFilters, setTableFilters] = useState<NursingTableParams>(() => ({
    page: 1,
    limit: 10,
    sortBy: 'compensation',
    sortOrder: 'desc',
  }));

  // API data fetching
  const { data: nursingData } = useNursingTable(tableFilters, {
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const handleSignOut = useCallback(async () => {
    const authStore = useAuthStore.getState();
    authStore.setUser(null);
    await signOut();
  }, [signOut]);

  const handleOnboardingClick = useCallback(async () => {
    try {
      if (user && user.hasCompletedOnboarding) {
        router.push(`/users/${user.id}`);
        toast('You have already completed onboarding! Check out your profile.', {
          icon: '👤',
          duration: 3000,
        });
        return;
      }

      const API_URL = process.env.NEXT_PUBLIC_BE_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/api/onboarding/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Failed to initialize onboarding');
      }

      const data = await response.json();
      localStorage.setItem(
        'onboarding_session',
        JSON.stringify({
          tempUserId: data.tempUserId,
          sessionId: data.sessionId,
          startedAt: new Date().toISOString(),
          isLoggedIn: !data.tempUserId.startsWith('temp_'),
        })
      );

      router.push('/onboarding');
      toast.success("Let's get started with your nursing career journey!", {
        icon: '🚀',
        duration: 3000,
      });
    } catch {
      toast.error('Failed to start onboarding. Please try again.');
    }
  }, [user, router]);

  const handleLogin = useCallback(
    async (data: { email: string; password: string }) => {
      try {
        const response = await signIn(data);
        if (response.success && response.user) {
          useAuthStore.getState().setUser(response.user);
          setShowLoginModal(false);
          toast.success('Successfully logged in!');
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to login');
      }
    },
    [signIn]
  );

  const handleSignUp = useCallback(
    async (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => {
      try {
        const response = await signUp(data);
        if (response.success && response.user) {
          useAuthStore.getState().setUser(response.user);
          await checkAuth();
          setShowSignUpModal(false);
          toast.success('Account created successfully!');
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to create account');
      }
    },
    [signUp, checkAuth]
  );

  const handlePageChange = useCallback((page: number) => {
    setTableFilters((prev) => ({ ...prev, page }));
  }, []);

  // Loading state
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-50 dark:bg-gradient-to-br dark:from-black dark:via-zinc-900 dark:to-black transition-colors">
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-zinc-400">Loading...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Mobile-specific layout - Optimized for mobile UX
  if (isMobile && !user) {
    // Mobile screen for non-logged in users
    return (
      <>
        <MobileSalaryDiscovery
          onOnboardingClick={() => setShowSignUpModal(true)}
          onLoginClick={() => setShowLoginModal(true)}
        />

        {/* Modals */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSubmit={handleLogin}
          onSwitchToSignUp={() => {
            setShowLoginModal(false);
            setShowSignUpModal(true);
          }}
          isLoading={isAuthLoading}
        />

        <SignUpModal
          isOpen={showSignUpModal}
          onClose={() => setShowSignUpModal(false)}
          onSubmit={handleSignUp}
          onSwitchToLogin={() => {
            setShowSignUpModal(false);
            setShowLoginModal(true);
          }}
          isLoading={isAuthLoading}
        />
      </>
    );
  }

  // Mobile screen for logged-in users (to be implemented)
  if (isMobile && user) {
    return (
      <>
        {/* Mobile dashboard for logged-in users - to be implemented */}
        <div className="min-h-screen bg-gray-50 dark:bg-black p-4">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold mb-4">Welcome, {user.firstName || 'Nurse'}!</h1>
            <button
              type="button"
              onClick={() => router.push(`/users/${user.id}`)}
              className="px-6 py-3 bg-emerald-500 text-white rounded-lg"
            >
              View My Profile
            </button>
          </div>
        </div>

        {/* Modals */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSubmit={handleLogin}
          onSwitchToSignUp={() => {
            setShowLoginModal(false);
            setShowSignUpModal(true);
          }}
          isLoading={isAuthLoading}
        />

        <SignUpModal
          isOpen={showSignUpModal}
          onClose={() => setShowSignUpModal(false)}
          onSubmit={handleSignUp}
          onSwitchToLogin={() => {
            setShowSignUpModal(false);
            setShowLoginModal(true);
          }}
          isLoading={isAuthLoading}
        />
      </>
    );
  }

  // Desktop layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-50 dark:bg-neutral-950 transition-colors">
      <Header
        user={user}
        onSignOut={handleSignOut}
        onShowLogin={() => setShowLoginModal(true)}
        onShowSignUp={() => setShowSignUpModal(true)}
      />

      <main className="pt-16">
        <HeroSection
          displayedGreeting={displayedGreeting}
          displayedMessage={displayedMessage}
          user={user}
          onOnboardingClick={handleOnboardingClick}
        />

        <CompensationSection />

        <DataSection
          nursingData={nursingData}
          onPageChange={handlePageChange}
        />

        <FeaturesSection />

        <TestimonialsSection />
      </main>

      <Footer />

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSubmit={handleLogin}
        onSwitchToSignUp={() => {
          setShowLoginModal(false);
          setShowSignUpModal(true);
        }}
        isLoading={isAuthLoading}
      />

      {/* Sign Up Modal */}
      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onSubmit={handleSignUp}
        onSwitchToLogin={() => {
          setShowSignUpModal(false);
          setShowLoginModal(true);
        }}
        isLoading={isAuthLoading}
      />
    </div>
  );
}