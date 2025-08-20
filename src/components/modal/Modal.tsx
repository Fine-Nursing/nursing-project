// This file is kept for backward compatibility
// The actual implementation is split into multiple files in ./Modal/

// Re-export the main Modal component as default
export { default } from './Modal/index';

// Re-export individual components
export { SignUpModal } from './Modal/components/SignUpModal';
export { LoginModal } from './Modal/components/LoginModal';
export { AuthButtons } from './Modal/components/AuthButtons';