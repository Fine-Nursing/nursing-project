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
export { default as useAuthValidation } from './hooks/useAuthValidation';
export { default as useAuth } from './hooks/useAuth';

// Main component export
export { default as Auth } from './AuthModal';