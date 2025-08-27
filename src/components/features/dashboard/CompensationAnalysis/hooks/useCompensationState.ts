import { useState, useEffect } from 'react';
import type { UserProfile } from '../types';

export function useCompensationState(initialProfile: UserProfile | null | undefined) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(initialProfile || {
    annualSalary: 0,
    hourlyRate: 0,
    differentials: { night: 0, weekend: 0, other: 0 }
  });

  // initialProfile이 변경되면 editedProfile도 업데이트
  useEffect(() => {
    if (initialProfile && !isEditing) {
      setEditedProfile(initialProfile);
    }
  }, [initialProfile, isEditing]);

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(initialProfile || {
      annualSalary: 0,
      hourlyRate: 0,
      differentials: { night: 0, weekend: 0, other: 0 }
    });
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