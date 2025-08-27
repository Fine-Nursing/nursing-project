'use client';

import React, { memo } from 'react';
import { m } from 'framer-motion';
import { useAiInsight } from 'src/api/ai/useAiInsights';
import { AvatarSection } from './components/AvatarSection';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileInfoGrid } from './components/ProfileInfoGrid';
import { CareerInsights } from './components/CareerInsights';
import { AvatarCustomizer } from './components/AvatarCustomizer';
import { useAvatarManagement } from './hooks/useAvatarManagement';
import { getProfileInfoItems, getCareerInsightContent } from './utils/profileUtils';
import type { UserProfileCardProps } from './types';

function UserProfileCard({
  userProfile,
  theme,
}: UserProfileCardProps) {
  const { data: careerInsight, isLoading } = useAiInsight('nurse_summary', userProfile?.id);
  
  const {
    showAvatarPicker,
    currentTab,
    setCurrentTab,
    avatarConfig,
    setAvatarConfig,
    toggleAvatarPicker,
    closeAvatarPicker,
    applyAvatar,
  } = useAvatarManagement();

  const profileInfoItems = getProfileInfoItems(userProfile);
  const careerInsightContent = getCareerInsightContent(careerInsight, isLoading);

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
      />
    </m.div>
  );
}

export default memo(UserProfileCard);