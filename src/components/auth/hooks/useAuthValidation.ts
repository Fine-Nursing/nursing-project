import { useState, useCallback } from 'react';
import type { 
  ValidationErrors} from '../utils/validation';
import { 
  validateLoginForm, 
  validateSignUpForm 
} from '../utils/validation';

export function useAuthValidation() {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const clearError = useCallback((field: keyof ValidationErrors) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const validateLogin = useCallback((email: string, password: string): boolean => {
    const validationErrors = validateLoginForm(email, password);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, []);

  const validateSignUp = useCallback((
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): boolean => {
    const validationErrors = validateSignUpForm(email, password, firstName, lastName);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, []);

  return {
    errors,
    clearError,
    clearAllErrors,
    validateLogin,
    validateSignUp,
  };
}