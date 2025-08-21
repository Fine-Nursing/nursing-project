'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from 'src/hooks/useAuthStore';
import { AuthModal, useAuth } from 'src/components/features/auth';

export function AuthButtons() {
  const router = useRouter();
  const { user, isLoading, checkAuth, signOut } = useAuthStore();
  const { isModalOpen, authMode, openAuth, closeAuth, switchAuthMode } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (isLoading) {
    return (
      <nav>
        <ul className="flex space-x-4 text-sm font-medium">
          <li>
            <div className="animate-pulse bg-gray-200 h-8 w-20 rounded" />
          </li>
        </ul>
      </nav>
    );
  }

  return (
    <>
      <nav>
        <ul className="flex space-x-4 text-sm font-medium">
          {user ? (
            <>
              <li>
                <button
                  type="button"
                  onClick={() => router.push('/profile')}
                  className="text-slate-700 hover:text-purple-600"
                >
                  Profile
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-slate-700 hover:text-purple-600"
                >
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <button
                  type="button"
                  onClick={() => openAuth('login')}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Sign In
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openAuth('signup')}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors font-medium"
                >
                  Sign Up
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Unified Auth Modal */}
      <AuthModal
        isOpen={isModalOpen}
        onClose={closeAuth}
        mode={authMode}
        onAuthSuccess={checkAuth}
        onModeSwitch={switchAuthMode}
      />
    </>
  );
}