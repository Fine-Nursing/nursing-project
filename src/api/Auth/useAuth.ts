// src/hooks/useAuth.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

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

const useAuth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const signUp = async (data: SignUpData) => {
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

  const signIn = async (data: SignInData) => {
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

  const completeOnboarding = async (tempUserId: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BE_URL}/api/onboarding/complete`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ tempUserId }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to complete onboarding');
    }

    // 성공 시 처리
    localStorage.removeItem('onboarding_session');
    toast.success('Welcome! Your account has been set up successfully.');
    router.push('/dashboard');

    return response.json();
  };

  return {
    signUp,
    signIn,
    completeOnboarding,
    isLoading,
  };
};

export default useAuth;
