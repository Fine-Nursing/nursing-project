import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useAuth from 'src/api/Auth/useAuth';
import useAuthStore from 'src/hooks/useAuthStore';

interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  rememberMe?: boolean;
}

export function useAuthModal() {
  const router = useRouter();
  const { signUp, signIn, isLoading } = useAuth();
  const setUser = useAuthStore((state) => state.setUser);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string): string | null => {
    if (!email) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Email is invalid';
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    return null;
  };

  const validateSignUpForm = useCallback((data: AuthFormData): boolean => {
    const newErrors: Record<string, string> = {};

    const emailError = validateEmail(data.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(data.password);
    if (passwordError) newErrors.password = passwordError;

    if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!data.firstName) {
      newErrors.firstName = 'First name is required';
    }

    if (!data.lastName) {
      newErrors.lastName = 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const validateSignInForm = useCallback((data: AuthFormData): boolean => {
    const newErrors: Record<string, string> = {};

    const emailError = validateEmail(data.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(data.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const handleSignUp = useCallback(async (
    formData: AuthFormData,
    onSuccess?: () => void,
    onClose?: () => void
  ) => {
    if (!validateSignUpForm(formData)) {
      return;
    }

    try {
      const signUpData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
      };
      const result = await signUp(signUpData);

      if (result && result.user) {
        toast.success('Account created successfully!');
        setUser(result.user);

        if (onSuccess) {
          onSuccess();
        }

        if (onClose) {
          onClose();
        }

        // Check if onboarding is needed
        if (result.requiresOnboarding) {
          router.push('/onboarding');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create account'
      );
    }
  }, [validateSignUpForm, signUp, setUser, router]);

  const handleSignIn = useCallback(async (
    formData: AuthFormData,
    onSuccess?: () => void,
    onClose?: () => void
  ) => {
    if (!validateSignInForm(formData)) {
      return;
    }

    try {
      const signInData = {
        email: formData.email,
        password: formData.password,
      };
      const result = await signIn(signInData);

      if (result && result.user) {
        toast.success('Welcome back!');
        setUser(result.user);

        if (onSuccess) {
          onSuccess();
        }

        if (onClose) {
          onClose();
        }

        router.push('/dashboard');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to sign in');
    }
  }, [validateSignInForm, signIn, setUser, router]);

  const clearError = useCallback((field: string) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
  }, []);

  return {
    isLoading,
    errors,
    setErrors,
    clearError,
    handleSignUp,
    handleSignIn,
  };
}