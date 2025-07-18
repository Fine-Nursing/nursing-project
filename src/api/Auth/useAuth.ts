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

interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
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

  return {
    signUp,
    signIn,
    isLoading,
  };
};

export default useAuth;
