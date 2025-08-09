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
  session?: any;
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
          credentials: 'include', // 쿠키 포함
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create account');
      }

      const result = await response.json();
      
      // 회원가입 성공 시 사용자 정보 정규화
      if (result.user) {
        const { user } = result;
        const normalizedUser = {
          id: user.id,
          email: user.email,
          firstName: user.firstName || user.first_name || '',
          lastName: user.lastName || user.last_name || '',
          hasCompletedOnboarding: user.hasCompletedOnboarding || false,
        };
        
        return {
          success: true,
          user: normalizedUser,
          session: result.session
        };
      }

      return { success: false };
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
          credentials: 'include', // 쿠키 포함 (세션/JWT 토큰)
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to sign in');
      }

      const result = await response.json();
      
      // 로그인 성공 시 사용자 정보 정규화
      if (result.user) {
        const { user } = result;
        // API 응답 형태에 관계없이 일관된 형태로 변환
        const normalizedUser = {
          id: user.id,
          email: user.email,
          firstName: user.firstName || user.first_name || '',
          lastName: user.lastName || user.last_name || '',
          hasCompletedOnboarding: user.hasCompletedOnboarding || false,
        };
        
        return {
          success: true,
          user: normalizedUser,
          session: result.session
        };
      }

      return { success: false };
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
    } catch {
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
