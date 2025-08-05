// src/hooks/useAuth.ts
import { useState } from 'react';

interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface SignInData {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  first_name?: string; // API might return this format
  last_name?: string; // API might return this format
  hasCompletedOnboarding: boolean; // ✅ 추가!
}

interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  requiresOnboarding?: boolean;
}

const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signUp = async (data: SignUpData): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BE_URL}/api/auth/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create account');
      }

      return await response.json();
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (data: SignInData): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BE_URL}/api/auth/signin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to sign in');
      }

      return await response.json();
    } finally {
      setIsLoading(false);
    }
  };

  // 현재 사용자 정보 조회 (me endpoint)
  const checkAuth = async (): Promise<User | null> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BE_URL}/api/auth/me`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.user || null;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error checking auth:', error);
      return null;
    }
  };

  return {
    signUp,
    signIn,
    checkAuth, // ✅ 추가!
    isLoading,
  };
};

export default useAuth;
