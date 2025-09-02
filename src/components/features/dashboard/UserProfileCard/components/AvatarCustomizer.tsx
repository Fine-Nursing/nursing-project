import React, { useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { ChevronRight, X } from 'lucide-react';
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
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle ESC key to close modal and focus trap
  useEffect(() => {
    if (!showAvatarPicker) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!modalRef.current) return;

      // Get all focusable elements within the modal
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusable = focusableElements[0] as HTMLElement;
      const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

      // Tab key focus trap
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable?.focus();
          }
        }
      }
    };

    // Focus the modal when it opens
    const timer = setTimeout(() => {
      const firstButton = modalRef.current?.querySelector('button') as HTMLElement;
      firstButton?.focus();
    }, 100);

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showAvatarPicker, onClose]);

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
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <m.div 
              ref={modalRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="avatar-customizer-title"
              className={`rounded-2xl shadow-2xl ${
                theme === 'light' ? 'bg-white' : 'bg-slate-800'
              } w-full max-w-md h-[85vh] flex flex-col p-4 sm:p-6`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <h3 
                id="avatar-customizer-title"
                className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}
              >
                Customize Your Avatar
              </h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close avatar customizer"
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'light' 
                    ? 'hover:bg-gray-100 text-gray-600 hover:text-gray-800' 
                    : 'hover:bg-slate-700 text-gray-400 hover:text-gray-200'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Avatar Preview */}
            <div className="flex justify-center mb-6 flex-shrink-0">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl shadow-lg overflow-hidden bg-white flex items-center justify-center">
                <SimpleBeanHead 
                  config={avatarConfig} 
                  size={96} 
                />
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex mb-4 border-b border-gray-200 dark:border-slate-600 flex-shrink-0" role="tablist">
              {AVATAR_TABS.map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  role="tab"
                  aria-selected={currentTab === tab.id}
                  aria-controls={`tabpanel-${tab.id}`}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`px-3 sm:px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset ${
                    currentTab === tab.id
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto">
              {/* Content based on tab */}
              {currentTab === 'preset' && (
                <div 
                  className="pr-2" 
                  role="tabpanel" 
                  id="tabpanel-preset"
                  aria-labelledby="tab-preset"
                >
                  <p className={`text-sm font-medium mb-3 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    Choose a Preset Style
                  </p>
                  <div className="grid grid-cols-2 gap-3 pb-4">
                    {PRESET_STYLES.map((preset) => (
                      <m.button
                        key={preset.name}
                        onClick={() => setAvatarConfig(preset.config)}
                        aria-label={`Select ${preset.name} preset style`}
                        className={`p-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                          theme === 'light' ? 'border-gray-200 hover:border-indigo-300 bg-white' : 'border-slate-600 hover:border-indigo-500 bg-slate-700'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 rounded-xl overflow-hidden bg-white flex items-center justify-center">
                          <SimpleBeanHead 
                            config={preset.config} 
                            size={48} 
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
                <div 
                  className="pr-2" 
                  role="tabpanel" 
                  id="tabpanel-custom"
                  aria-labelledby="tab-custom"
                >
                  <CustomizeSectionUpdated 
                    avatarConfig={avatarConfig}
                    setAvatarConfig={setAvatarConfig}
                    theme={theme}
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 flex-shrink-0 border-t border-gray-200 dark:border-slate-600">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
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
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
                  theme === 'light'
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                Apply
              </button>
            </div>
          </m.div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
}