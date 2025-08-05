'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  hasCompletedOnboarding?: boolean; // 온보딩 완료 여부 추가
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean; // 추가
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;
  signOut: () => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false, // 추가

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user, // user가 있으면 true
        }),

      checkAuth: async () => {
        try {
          const baseUrl =
            process.env.NEXT_PUBLIC_BE_URL || 'http://localhost:3000';

          const response = await fetch(`${baseUrl}/api/auth/me`, {
            method: 'GET',
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json();
            // eslint-disable-next-line no-console
            console.log('Auth check response:', data);
            const userData = data.user || data;
            set({
              user: userData,
              isLoading: false,
              isAuthenticated: true,
            });
          } else {
            set({
              user: null,
              isLoading: false,
              isAuthenticated: false,
            });
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Auth check failed:', error);
          set({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      },

      signOut: async () => {
        try {
          const baseUrl =
            process.env.NEXT_PUBLIC_BE_URL || 'http://localhost:3000';

          const response = await fetch(`${baseUrl}/api/auth/signout`, {
            method: 'POST',
            credentials: 'include',
          });

          if (response.ok || response.status === 400) {
            set({
              user: null,
              isAuthenticated: false,
            });
            toast.success('Signed out successfully');
            // router.push는 컴포넌트에서 처리
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Sign out error:', error);
          toast.error('Failed to sign out');
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
