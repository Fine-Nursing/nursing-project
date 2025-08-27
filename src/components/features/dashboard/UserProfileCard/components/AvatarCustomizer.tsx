import React from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import SimpleBeanHead, { PRESET_STYLES } from '../../SimpleBeanHead';
import CustomizeSectionUpdated from '../../CustomizeSectionUpdated';
import type { AvatarConfig } from '../types';
import { AVATAR_TABS } from '../constants';

interface AvatarCustomizerProps {
  showAvatarPicker: boolean;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  avatarConfig: AvatarConfig;
  setAvatarConfig: (config: AvatarConfig) => void;
  theme: 'light' | 'dark';
  onClose: () => void;
  onApply: () => void;
}

export function AvatarCustomizer({
  showAvatarPicker,
  currentTab,
  setCurrentTab,
  avatarConfig,
  setAvatarConfig,
  theme,
  onClose,
  onApply,
}: AvatarCustomizerProps) {
  return (
    <AnimatePresence>
      {showAvatarPicker && (
        <>
          {/* Backdrop */}
          <m.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <m.div 
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
                onClick={onClose}
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
              {AVATAR_TABS.map((tab) => (
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
                    <m.button
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
                    </m.button>
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
                onClick={onClose}
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
                onClick={onApply}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  theme === 'light'
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                Apply
              </button>
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
}