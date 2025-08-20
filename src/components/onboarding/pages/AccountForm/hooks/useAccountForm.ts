import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import useAuth from 'src/api/Auth/useAuth';
import useCompleteOnboarding from 'src/api/onboarding/useCompleteOnboarding';
import useAuthStore from 'src/hooks/useAuthStore';
import useOnboardingStore from 'src/store/onboardingStores';
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateName,
} from '../utils/validation';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
}

export function useAccountForm() {
  const { tempUserId, setStep } = useOnboardingStore();
  const { user, isAuthenticated } = useAuthStore();
  const { signUp, signIn, isLoading: authLoading } = useAuth();
  const { completeOnboarding, isLoading: completeLoading } = useCompleteOnboarding();

  // Form state
  const [isSignIn, setIsSignIn] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const isLoading = authLoading || completeLoading;

  // Update form field
  const updateField = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  // Validate form
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    // Password validation
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    // Sign up specific validations
    if (!isSignIn) {
      // Confirm password
      const confirmError = validatePasswordMatch(formData.password, formData.confirmPassword);
      if (confirmError) newErrors.confirmPassword = confirmError;

      // Name validations
      const firstNameError = validateName(formData.firstName, 'First name');
      if (firstNameError) newErrors.firstName = firstNameError;

      const lastNameError = validateName(formData.lastName, 'Last name');
      if (lastNameError) newErrors.lastName = lastNameError;

      // Terms agreement
      if (!agreedToTerms) {
        toast.error('Please agree to the terms and conditions');
        return false;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, isSignIn, agreedToTerms]);

  // Handle sign up
  const handleSignUp = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      toast.loading('Creating your account...', { id: 'signup' });
      
      await signUp({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      await completeOnboarding();
      
      toast.success('Account created successfully!', { id: 'signup' });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create account',
        { id: 'signup' }
      );
    }
  }, [formData, tempUserId, validateForm, signUp, completeOnboarding]);

  // Handle sign in
  const handleSignIn = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      toast.loading('Signing in...', { id: 'signin' });
      
      await signIn({
        email: formData.email,
        password: formData.password,
      });

      await completeOnboarding();
      
      toast.success('Signed in successfully!', { id: 'signin' });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to sign in',
        { id: 'signin' }
      );
    }
  }, [formData, validateForm, signIn, completeOnboarding]);

  // Handle already authenticated
  const handleAlreadyAuthenticated = useCallback(async () => {
    try {
      toast.loading('Saving your onboarding data...', { id: 'complete' });
      await completeOnboarding();
      toast.success('Onboarding completed!', { id: 'complete' });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to complete onboarding',
        { id: 'complete' }
      );
    }
  }, [completeOnboarding]);

  // Toggle between sign in and sign up
  const toggleMode = useCallback(() => {
    setIsSignIn(prev => !prev);
    setErrors({});
  }, []);

  return {
    // State
    formData,
    errors,
    isSignIn,
    showPassword,
    showConfirmPassword,
    agreedToTerms,
    isLoading,
    isAuthenticated,
    user,

    // Actions
    updateField,
    setShowPassword,
    setShowConfirmPassword,
    setAgreedToTerms,
    toggleMode,
    handleSignUp,
    handleSignIn,
    handleAlreadyAuthenticated,
  };
}