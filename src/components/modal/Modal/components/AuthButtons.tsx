'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from 'src/hooks/useAuthStore';
import { LoginModal } from './LoginModal';
import { SignUpModal } from './SignUpModal';

export function AuthButtons() {
  const router = useRouter();
  const { user, isLoading, checkAuth, signOut } = useAuthStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  const handleSwitchToLogin = () => {
    setShowSignUpModal(false);
    setShowLoginModal(true);
  };

  const handleSwitchToSignUp = () => {
    setShowLoginModal(false);
    setShowSignUpModal(true);
  };

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
                  onClick={() => setShowLoginModal(true)}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Sign In
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setShowSignUpModal(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors font-medium"
                >
                  Sign Up
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignUp={handleSwitchToSignUp}
        onAuthSuccess={checkAuth}
      />

      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onSwitchToLogin={handleSwitchToLogin}
        onAuthSuccess={checkAuth}
      />
    </>
  );
}