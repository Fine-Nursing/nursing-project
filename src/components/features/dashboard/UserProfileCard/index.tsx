'use client';

import React, { memo, useState } from 'react';
import { m } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAllAiInsights } from 'src/api/ai/useAiInsights';
import useAuthStore from 'src/hooks/useAuthStore';
import { AvatarSection } from './components/AvatarSection';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileInfoGrid } from './components/ProfileInfoGrid';
import { CareerInsights } from './components/CareerInsights';
import { AvatarCustomizer } from './components/AvatarCustomizer';
import EditProfileModal from '../../profile/EditProfileModal';
import { useUpdateProfile } from 'src/api/useUpdateProfile';
import { useAvatarManagement } from './hooks/useAvatarManagement';
import { getProfileInfoItems, getCareerInsightContent } from './utils/profileUtils';
import type { UserProfileCardProps } from './types';

function UserProfileCard({
  userProfile,
  theme,
}: UserProfileCardProps) {
  const { user } = useAuthStore();
  // AiCareerInsights와 동일한 방식으로 AI 데이터 가져오기
  const { data: aiInsights, isLoading } = useAllAiInsights(user?.id);

  // nurse_summary 데이터 추출
  const careerInsight = aiInsights?.nurseSummary;

  // Edit Profile Modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const updateProfileMutation = useUpdateProfile();

  const {
    showAvatarPicker,
    currentTab,
    setCurrentTab,
    avatarConfig,
    setAvatarConfig,
    toggleAvatarPicker,
    closeAvatarPicker,
    applyAvatar,
    resetAvatar,
    isLoading: avatarLoading,
    error: avatarError,
  } = useAvatarManagement();

  const profileInfoItems = getProfileInfoItems(userProfile);
  const careerInsightContent = getCareerInsightContent(careerInsight, isLoading);

  // Handle Edit Profile button click
  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  // Handle profile save from modal
  const handleProfileSave = async (data: {
    name: string;
    role: string;
    specialty: string;
    education: string;
    organization: string;
    location: string;
    experience?: number;
  }) => {
    try {
      await updateProfileMutation.mutateAsync(data);
      toast.success('Profile updated successfully!', {
        icon: '✅',
        duration: 3000,
      });
      // Modal will close itself after successful save
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile. Please try again.', {
        icon: '❌',
        duration: 4000,
      });
      throw error; // Re-throw to prevent modal from closing
    }
  };


  return (
    <m.div 
      className="mb-4 sm:mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <m.div
        className={`${
          theme === 'light' ? 'bg-white' : 'bg-slate-800'
        } rounded-xl shadow-lg border ${
          theme === 'light' ? 'border-gray-100' : 'border-slate-700'
        } overflow-hidden`}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {/* Professional Avatar */}
            <AvatarSection
              avatarConfig={avatarConfig}
              onEditClick={toggleAvatarPicker}
              theme={theme}
            />

            {/* Main Content */}
            <div className="flex-1 w-full">
              {/* Header */}
              <ProfileHeader
                name={userProfile.name}
                role={userProfile.role}
                theme={theme}
                onEditClick={handleEditProfile}
              />

              {/* Info Grid */}
              <ProfileInfoGrid
                items={profileInfoItems}
                theme={theme}
              />

              {/* AI Insights */}
              <CareerInsights
                content={careerInsightContent}
                isLoading={isLoading}
                theme={theme}
              />
            </div>
          </div>
        </div>
      </m.div>

      {/* Avatar Customization Modal */}
      <AvatarCustomizer
        showAvatarPicker={showAvatarPicker}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        avatarConfig={avatarConfig}
        setAvatarConfig={setAvatarConfig}
        theme={theme}
        onClose={closeAvatarPicker}
        onApply={applyAvatar}
        onReset={resetAvatar}
        isLoading={avatarLoading}
        error={avatarError}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        currentProfile={{
          name: userProfile.name || '',
          role: userProfile.role || '',
          specialty: userProfile.specialty || '',
          education: userProfile.education || '',
          organization: userProfile.organization || '',
          location: userProfile.location || '',
          experience: userProfile.experience || '',
        }}
        onSave={handleProfileSave}
        theme={theme}
      />
    </m.div>
  );
}

export default memo(UserProfileCard);