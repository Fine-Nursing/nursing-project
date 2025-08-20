'use client';

import React, { useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeSwitch } from 'src/components/common/ThemeToggle';
import ActionButton from 'src/components/button/ActionButton';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface HeaderProps {
  user: User | null;
  onSignOut: () => void;
  onShowLogin: () => void;
  onShowSignUp: () => void;
}

const Header = memo(({ user, onSignOut, onShowLogin, onShowSignUp }: HeaderProps) => {
  const router = useRouter();

  const handleProfileClick = useCallback(() => {
    if (user) {
      router.push(`/users/${user.id}`);
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
});

Header.displayName = 'Header';

export default Header;