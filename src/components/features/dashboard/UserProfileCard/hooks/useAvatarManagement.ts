import { useState, useEffect } from 'react';
import type { AvatarConfig } from '../types';
import { DEFAULT_AVATAR_CONFIG } from '../constants';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export function useAvatarManagement() {
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [currentTab, setCurrentTab] = useState('preset');
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(DEFAULT_AVATAR_CONFIG);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user's saved avatar on component mount
  useEffect(() => {
    loadUserAvatar();
  }, []);

  const loadUserAvatar = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/profile/avatar`, {
        method: 'GET',
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();

        if (data.success && data.emojiJson) {
          try {
            const savedConfig = JSON.parse(data.emojiJson);
            setAvatarConfig(savedConfig);
          } catch (parseError) {
            // Keep default config if parsing fails
          }
        }
      } else if (response.status !== 404) {
        // 404 is expected for new users, other errors should be logged
      }
    } catch (error) {
      // Don't show error to user for avatar loading failures
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAvatarPicker = () => {
    setShowAvatarPicker(!showAvatarPicker);
  };

  const closeAvatarPicker = () => {
    setShowAvatarPicker(false);
    setError(null);
  };

  const applyAvatar = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/profile/avatar`, {
        method: 'PUT',
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emojiJson: JSON.stringify(avatarConfig),
        }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.success) {
          setShowAvatarPicker(false);
        } else {
          throw new Error('Failed to save avatar');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to save avatar`);
      }
    } catch (error) {
      console.error('Failed to save avatar:', error);
      setError(error instanceof Error ? error.message : 'Failed to save avatar');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAvatar = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/profile/avatar`, {
        method: 'DELETE',
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();

        if (data.success) {
          setAvatarConfig(DEFAULT_AVATAR_CONFIG);
        } else {
          throw new Error('Failed to reset avatar');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to reset avatar`);
      }
    } catch (error) {
      console.error('Failed to reset avatar:', error);
      setError(error instanceof Error ? error.message : 'Failed to reset avatar');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    showAvatarPicker,
    currentTab,
    setCurrentTab,
    avatarConfig,
    setAvatarConfig,
    toggleAvatarPicker,
    closeAvatarPicker,
    applyAvatar,
    resetAvatar,
    isLoading,
    error,
    loadUserAvatar,
  };
}