export const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePassword = (password: string): string | null => {
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name.trim()) {
    return 'Name is required';
  }
  if (name.length < 2) {
    return 'Name must be at least 2 characters';
  }
  return null;
};

export interface ValidationErrors {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

export const validateLoginForm = (
  email: string,
  password: string
): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email';
  }
  
  const passwordError = validatePassword(password);
  if (passwordError) {
    errors.password = passwordError;
  }
  
  return errors;
};

export const validateSignUpForm = (
  email: string,
  password: string,
  firstName: string,
  lastName: string
): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email';
  }
  
  const passwordError = validatePassword(password);
  if (passwordError) {
    errors.password = passwordError;
  }
  
  const firstNameError = validateName(firstName);
  if (firstNameError) {
    errors.firstName = firstNameError;
  }
  
  const lastNameError = validateName(lastName);
  if (lastNameError) {
    errors.lastName = lastNameError;
  }
  
  return errors;
};