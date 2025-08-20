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

const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isLoading: false, // 초기값을 false로 변경
  isAuthenticated: false,

  setUser: (user) => {
    const currentState = get();
    if (currentState.user?.id === user?.id && currentState.isAuthenticated === !!user) {
      return; // 동일한 상태면 업데이트하지 않음
    }
    
    set({
      user,
      isAuthenticated: !!user, // user가 있으면 true
    });
  },

      checkAuth: async () => {
        // 로딩 상태 설정
        set({ isLoading: true });
        
        try {
          const baseUrl =
            process.env.NEXT_PUBLIC_BE_URL || 'http://localhost:3000';

          const response = await fetch(`${baseUrl}/api/auth/me`, {
            method: 'GET',
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json();
            const rawUser = data.user || data;
            
            // 사용자 정보 정규화
            const userData = rawUser ? {
              id: rawUser.id,
              email: rawUser.email,
              firstName: rawUser.firstName || rawUser.first_name || '',
              lastName: rawUser.lastName || rawUser.last_name || '',
              hasCompletedOnboarding: rawUser.hasCompletedOnboarding || false,
            } : null;
            
            const currentState = get();
            // 동일한 상태인지 확인
            if (currentState.user?.id === userData?.id && 
                currentState.isAuthenticated === !!userData && 
                currentState.isLoading === false) {
              return; // 동일한 상태면 업데이트하지 않음
            }
            
            set({
              user: userData,
              isLoading: false,
              isAuthenticated: !!userData,
            });
          } else {
            const currentState = get();
            if (!currentState.user && !currentState.isAuthenticated && !currentState.isLoading) {
              return; // 이미 로그아웃 상태면 업데이트하지 않음
            }
            set({
              user: null,
              isLoading: false,
              isAuthenticated: false,
            });
          }
        } catch (error) {
          const currentState = get();
          if (!currentState.user && !currentState.isAuthenticated && !currentState.isLoading) {
            return; // 이미 로그아웃 상태면 업데이트하지 않음
          }
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
          toast.error('Failed to sign out');
        }
      },
}));

export default useAuthStore;
