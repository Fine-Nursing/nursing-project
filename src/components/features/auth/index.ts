'use client';

// Main Auth Modal component
export { default as AuthModal } from './AuthModal';
export type { AuthMode } from './AuthModal';

// Form components
export { default as LoginForm } from './forms/LoginForm';
export { default as SignUpForm } from './forms/SignUpForm';

// UI components
export { default as SocialAuthButtons } from './components/SocialAuthButtons';
export { default as AuthDivider } from './components/AuthDivider';
export { default as PasswordStrength } from './components/PasswordStrength';

// Hooks
export { useAuthValidation } from './hooks/useAuthValidation';
export { useAuth } from './hooks/useAuth';

// Default export
export { default } from './AuthModal';