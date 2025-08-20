import { useState } from 'react';
import type { UserProfile } from '../types';

export function useCompensationState(initialProfile: UserProfile) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(initialProfile);

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(initialProfile);
    setIsEditing(false);
  };

  return {
    isEditing,
    setIsEditing,
    editedProfile,
    setEditedProfile,
    handleSave,
    handleCancel
  };
}