'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Building2, 
  Briefcase,
  Clock,
  Sparkles,
  Edit2,
  TrendingUp,
  UserCircle,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAiInsight } from 'src/api/useAiInsights';
import SimpleBeanHead, { 
  type SimpleBeanHeadConfig as BeanHeadConfig, 
  PRESET_STYLES
} from './SimpleBeanHead';
import CustomizeSectionUpdated from './CustomizeSectionUpdated';

interface UserProfile {
  name: string;
  role: string;
  specialty: string;
  education: string;
  organization: string;
  location: string;
  experience: string;
}

interface UserProfileCardProps {
  userProfile: UserProfile;
  theme: 'light' | 'dark';
}

// Avatar component using DiceBear API

export default function UserProfileCard({
  userProfile,
  theme,
}: UserProfileCardProps) {
  const { data: careerInsight, isLoading } = useAiInsight('career');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [currentTab, setCurrentTab] = useState('preset');
  const [avatarConfig, setAvatarConfig] = useState<BeanHeadConfig>({
    // Essential props to prevent random values
    hat: 'none',
    graphic: 'none',
    
    // Basic features
    hair: 'bun',
    hairColor: 'brown',
    eyes: 'normal',
    eyebrows: 'raised',
    mouth: 'serious',
    clothing: 'dressShirt',
    clothingColor: 'white',
    accessory: 'roundGlasses',
    facialHair: 'none',
    skinTone: 'light',
    body: 'breasts',
    lashes: true,
    lipColor: 'red'
  });

  return (
    <motion.div 
      className="mb-4 sm:mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
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
            {/* Professional Avatar with Radix UI */}
            <div className="flex-shrink-0 relative mx-auto sm:mx-0">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="w-24 h-24 rounded-2xl shadow-lg border-2 border-indigo-100 overflow-hidden bg-white flex items-center justify-center">
                  <SimpleBeanHead 
                    config={avatarConfig} 
                    size={96} 
                  />
                </div>

                {/* Edit Overlay */}
                <motion.button
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  className={`absolute inset-0 rounded-xl flex items-center justify-center ${
                    theme === 'light' ? 'bg-black/0 hover:bg-black/10' : 'bg-white/0 hover:bg-white/10'
                  } transition-colors cursor-pointer`}
                  whileHover={{ backgroundColor: theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }}
                >
                  <motion.div 
                    className="opacity-0 hover:opacity-100 transition-opacity"
                    whileHover={{ opacity: 1 }}
                  >
                    <UserCircle className="w-6 h-6 text-white drop-shadow-lg" />
                  </motion.div>
                </motion.button>
              </motion.div>

            </div>

            {/* Main Content with Animations */}
            <div className="flex-1 w-full">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 text-center sm:text-left">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className={`text-2xl font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    {userProfile.name}
                  </h2>
                  <p className={`text-base ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
                    {userProfile.role}
                  </p>
                </motion.div>
                <motion.button 
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all mx-auto sm:mx-0 mt-2 sm:mt-0 ${
                    theme === 'light' 
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                      : 'bg-emerald-900/30 text-emerald-300 hover:bg-emerald-900/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </motion.button>
              </div>

              {/* Info Grid with Stagger Animation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                {[
                  { icon: Building2, label: 'Organization', value: userProfile.organization },
                  { icon: MapPin, label: 'Location', value: userProfile.location },
                  { icon: Briefcase, label: 'Specialty', value: userProfile.specialty },
                  { icon: Clock, label: 'Experience', value: userProfile.experience }
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (index + 3) }}
                    whileHover={{ scale: 1.05 }}
                    className={`p-3 rounded-lg ${
                      theme === 'light' ? 'bg-gray-50 hover:bg-gray-100' : 'bg-slate-700/50 hover:bg-slate-700'
                    } transition-colors`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <item.icon className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-500">{item.label}</p>
                    </div>
                    <p className={`text-base font-medium ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>
                      {item.value}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* AI Insights with Animation */}
              <motion.div 
                className={`rounded-lg p-4 ${
                  theme === 'light' 
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100' 
                    : 'bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-800/30'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-start gap-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className={`w-5 h-5 ${
                      theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'
                    }`} />
                  </motion.div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-sm font-semibold ${
                        theme === 'light' ? 'text-indigo-700' : 'text-indigo-300'
                      }`}>AI Career Insights</span>
                      {!isLoading && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.8, type: "spring" }}
                        >
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        </motion.div>
                      )}
                    </div>
                    <motion.p 
                      className={`text-base leading-relaxed ${
                        theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      {(() => {
                        if (isLoading) {
                          return <span className="animate-pulse">Analyzing your career trajectory...</span>;
                        }
                        if (careerInsight?.insight) {
                          return careerInsight.insight;
                        }
                        return "You're on track for a 3-5% salary increase. Consider trauma specialization for additional 8-12% market value.";
                      })()}
                    </motion.p>
                  </div>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Avatar Customization Modal - Simplified */}
      <AnimatePresence>
        {showAvatarPicker && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAvatarPicker(false)}
            />
            
            {/* Modal */}
            <motion.div 
              className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 p-6 rounded-2xl shadow-2xl ${
                theme === 'light' ? 'bg-white' : 'bg-slate-800'
              } max-w-md w-full mx-4`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  Customize Your Avatar
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAvatarPicker(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  <ChevronRight className="w-5 h-5 rotate-90" />
                </button>
              </div>

              {/* Current Avatar Preview */}
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 rounded-2xl shadow-lg overflow-hidden bg-white flex items-center justify-center">
                  <SimpleBeanHead 
                    config={avatarConfig} 
                    size={128} 
                  />
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex mb-4 border-b border-gray-200 dark:border-slate-600">
                {[{id: 'preset', label: 'Presets'}, {id: 'custom', label: 'Customize'}].map((tab) => (
                  <button
                    type="button"
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      currentTab === tab.id
                        ? 'border-b-2 border-indigo-500 text-indigo-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content based on tab */}
              {currentTab === 'preset' && (
                <div className="mb-4">
                  <p className={`text-sm font-medium mb-3 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    Choose a Preset Style
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {PRESET_STYLES.map((preset) => (
                      <motion.button
                        key={preset.name}
                        onClick={() => setAvatarConfig(preset.config)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          theme === 'light' ? 'border-gray-200 hover:border-indigo-300 bg-white' : 'border-slate-600 hover:border-indigo-500 bg-slate-700'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="w-16 h-16 mx-auto mb-2 rounded-xl overflow-hidden bg-white flex items-center justify-center">
                          <SimpleBeanHead 
                            config={preset.config} 
                            size={64} 
                          />
                        </div>
                        <p className="text-xs font-medium text-center">{preset.name}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom configuration */}
              {currentTab === 'custom' && (
                <CustomizeSectionUpdated 
                  avatarConfig={avatarConfig}
                  setAvatarConfig={setAvatarConfig}
                  theme={theme}
                />
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAvatarPicker(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    theme === 'light'
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setShowAvatarPicker(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    theme === 'light'
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
