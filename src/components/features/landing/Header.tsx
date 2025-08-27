'use client';

// React/Next.js
import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Internal absolute paths
import { ThemeSwitch } from 'src/components/ui/common/ThemeToggle';
import ActionButton from 'src/components/ui/button/ActionButton';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  hasCompletedOnboarding?: boolean;
}

interface HeaderProps {
  user: User | null;
  onSignOut: () => void;
  onShowLogin: () => void;
  onShowSignUp: () => void;
}

// Named export without memo - Header는 자주 리렌더링되지 않음
export const Header = ({ user, onSignOut, onShowLogin, onShowSignUp }: HeaderProps) => {
  const router = useRouter();

  const handleProfileClick = useCallback(() => {
    if (user) {
      // 온보딩 완료 여부 체크
      if (user.hasCompletedOnboarding) {
        router.push(`/users/${user.id}`);
      } else {
        // 온보딩 미완료시 온보딩 페이지로 이동
        toast('Please complete your profile setup first', {
          icon: '📝',
        });
        router.push('/onboarding');
      }
    }
  }, [router, user]);

  return (
    <header className="bg-white dark:bg-black/95 backdrop-blur-sm border-b border-gray-200 dark:border-zinc-800 shadow-sm fixed top-0 w-full z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-emerald-500 dark:text-emerald-400">
              Nurse Journey
            </h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <ThemeSwitch />
            {user ? (
              <>
                <span className="hidden sm:inline text-sm text-gray-600 dark:text-zinc-400">
                  Welcome, {user.firstName || user.email}!
                </span>
                <button
                  type="button"
                  onClick={handleProfileClick}
                  className="px-3 sm:px-4 py-2 text-sm sm:text-base text-emerald-500 hover:text-emerald-600 font-medium"
                >
                  Profile
                </button>
                <ActionButton
                  onClick={onSignOut}
                  variant="outline"
                  className="px-3 sm:px-4 py-2 text-sm sm:text-base"
                >
                  Sign Out
                </ActionButton>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onShowLogin}
                  className="px-3 sm:px-4 py-2 text-sm sm:text-base text-emerald-500 hover:text-emerald-600 font-medium"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={onShowSignUp}
                  className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-emerald-400 text-white rounded-md hover:bg-emerald-500 transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;