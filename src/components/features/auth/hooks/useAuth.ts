'use client';

import { useState, useCallback } from 'react';
import useAuthStore from 'src/hooks/useAuthStore';
import type { AuthMode } from '../AuthModal';

const useAuth = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  
  const { user, isAuthenticated, isLoading, signOut } = useAuthStore();

  const openAuth = useCallback((mode: AuthMode = 'login') => {
    setAuthMode(mode);
    setIsModalOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const switchAuthMode = useCallback((mode: AuthMode) => {
    setAuthMode(mode);
  }, []);

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    isModalOpen,
    authMode,
    
    // Actions
    openAuth,
    closeAuth,
    switchAuthMode,
    signOut,
  };
};

export default useAuth;