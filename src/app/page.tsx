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
import { AuthModal, useAuth as useAuthModal } from 'src/components/features/auth';

// Import separated components
import Header from 'src/components/features/landing/Header';
import HeroSection from 'src/components/features/landing/HeroSection';
import CompensationSection from 'src/components/features/landing/CompensationSection';
import DataSection from 'src/components/features/landing/DataSection';
import FeaturesSection from 'src/components/features/landing/FeaturesSection';
import TestimonialsSection from 'src/components/features/landing/TestimonialsSection';
import Footer from 'src/components/features/landing/Footer';
import MobileSalaryDiscovery from 'src/components/features/landing/MobileSalaryDiscovery';


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
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

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

  // Remove unnecessary state and useEffect that cause infinite loops
  const displayedGreeting = greetingData.greeting;
  const displayedMessage = greetingData.message;

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
          setShowAuthModal(false);
          toast.success('Successfully logged in!');
        } else {
          // 로그인 실패 시 에러를 throw하여 LoginForm에서 onSuccess가 호출되지 않도록 함
          throw new Error('Login failed');
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to login';
        toast.error(message);
        // 에러를 다시 throw하여 LoginForm에서 catch할 수 있도록 함
        throw error;
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
          setShowAuthModal(false);
          toast.success('Account created successfully!');
        } else {
          // 회원가입 실패 시 에러를 throw하여 SignUpForm에서 onSuccess가 호출되지 않도록 함
          throw new Error('Sign up failed');
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create account';
        toast.error(message);
        // 에러를 다시 throw하여 SignUpForm에서 catch할 수 있도록 함
        throw error;
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
      <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-blue-50/40 dark:bg-gradient-to-br dark:from-zinc-950 dark:via-zinc-900 dark:to-black transition-colors">
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4" />
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
          onOnboardingClick={() => {
            setAuthMode('signup');
            setShowAuthModal(true);
          }}
          onLoginClick={() => {
            setAuthMode('login');
            setShowAuthModal(true);
          }}
        />

        {/* Auth Modal */}
        {console.log('page.tsx rendering AuthModal, handleSignUp:', handleSignUp, 'authMode:', authMode)}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode={authMode}
          onAuthSuccess={() => {
            setShowAuthModal(false);
            checkAuth();
          }}
          onModeSwitch={setAuthMode}
          onLogin={handleLogin}
          onSignUp={handleSignUp}
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

        {/* Auth Modal */}
        {console.log('page.tsx rendering AuthModal, handleSignUp:', handleSignUp, 'authMode:', authMode)}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode={authMode}
          onAuthSuccess={() => {
            setShowAuthModal(false);
            checkAuth();
          }}
          onModeSwitch={setAuthMode}
          onLogin={handleLogin}
          onSignUp={handleSignUp}
          isLoading={isAuthLoading}
        />
      </>
    );
  }

  // Desktop layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-blue-50/40 dark:bg-gradient-to-br dark:from-zinc-950 dark:via-zinc-900 dark:to-black transition-colors">
      <Header
        user={user}
        onSignOut={handleSignOut}
        onShowLogin={() => {
          setAuthMode('login');
          setShowAuthModal(true);
        }}
        onShowSignUp={() => {
          setAuthMode('signup');
          setShowAuthModal(true);
        }}
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

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onAuthSuccess={() => {
          setShowAuthModal(false);
          checkAuth();
        }}
        onModeSwitch={setAuthMode}
        onLogin={handleLogin}
        onSignUp={handleSignUp}
        isLoading={isAuthLoading}
      />
    </div>
  );
}