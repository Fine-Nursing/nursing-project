import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuthValidation } from '../../../hooks/useAuthValidation';
import { INITIAL_FORM_DATA } from '../constants';
import type { SignUpFormData, SignUpSubmitData } from '../types';

export default function useSignUpForm() {
  const [formData, setFormData] = useState<SignUpFormData>(INITIAL_FORM_DATA);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const { errors, clearError, validateSignUp } = useAuthValidation();

  const handleInputChange = useCallback((field: keyof SignUpFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'confirmPassword') {
      setConfirmPasswordError('');
    } else if (errors[field as keyof typeof errors]) {
      clearError(field as keyof typeof errors);
    }
  }, [errors, clearError]);

  const togglePassword = useCallback(() => setShowPassword(prev => !prev), []);
  const toggleConfirmPassword = useCallback(() => setShowConfirmPassword(prev => !prev), []);

  const validateForm = useCallback((): SignUpSubmitData | null => {
    // Check password confirmation
    if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return null;
    }
    
    // Check terms acceptance
    if (!acceptTerms) {
      toast.error('Please accept the terms and conditions');
      return null;
    }
    
    if (!validateSignUp(
      formData.email, 
      formData.password, 
      formData.firstName, 
      formData.lastName
    )) {
      return null;
    }

    return {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
    };
  }, [formData, acceptTerms, validateSignUp]);

  return {
    formData,
    showPassword,
    showConfirmPassword,
    acceptTerms,
    setAcceptTerms,
    confirmPasswordError,
    errors,
    handleInputChange,
    togglePassword,
    toggleConfirmPassword,
    validateForm,
  };
}