import { useState } from 'react';
import type { AvatarConfig } from '../types';
import { DEFAULT_AVATAR_CONFIG } from '../constants';

export function useAvatarManagement() {
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [currentTab, setCurrentTab] = useState('preset');
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(DEFAULT_AVATAR_CONFIG);

  const toggleAvatarPicker = () => {
    setShowAvatarPicker(!showAvatarPicker);
  };

  const closeAvatarPicker = () => {
    setShowAvatarPicker(false);
  };

  const applyAvatar = () => {
    // Here you could save to backend or localStorage
    setShowAvatarPicker(false);
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
  };
}