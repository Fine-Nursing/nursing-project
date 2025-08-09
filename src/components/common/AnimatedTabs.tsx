'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

interface AnimatedTabsProps {
  tabs: TabItem[];
  defaultActive?: string;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'underline' | 'cards';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  animated?: boolean;
  className?: string;
  onTabChange?: (tabId: string) => void;
}

export function AnimatedTabs({
  tabs,
  defaultActive,
  orientation = 'horizontal',
  variant = 'default',
  size = 'md',
  fullWidth = false,
  animated = true,
  className = '',
  onTabChange,
}: AnimatedTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultActive || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    if (tabs.find(tab => tab.id === tabId)?.disabled) return;
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return 'text-sm px-3 py-2';
      case 'lg': return 'text-lg px-6 py-3';
      default: return 'text-base px-4 py-2.5';
    }
  };

  const getVariantStyles = (isActive: boolean, isDisabled: boolean) => {
    const baseStyles = `${getSizeStyles()} font-medium transition-colors cursor-pointer`;
    
    if (isDisabled) {
      return `${baseStyles} opacity-50 cursor-not-allowed text-gray-400`;
    }

    switch (variant) {
      case 'pills':
        return `${baseStyles} rounded-full ${
          isActive 
            ? 'bg-primary-500 text-white' 
            : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
        }`;
      case 'underline':
        return `${baseStyles} border-b-2 ${
          isActive 
            ? 'border-primary-500 text-primary-600' 
            : 'border-transparent text-gray-600 hover:text-primary-600'
        }`;
      case 'cards':
        return `${baseStyles} rounded-lg border ${
          isActive 
            ? 'bg-white border-primary-200 text-primary-600 shadow-sm' 
            : 'border-gray-200 text-gray-600 hover:text-primary-600 hover:border-primary-200'
        }`;
      default:
        return `${baseStyles} rounded-lg ${
          isActive 
            ? 'bg-primary-100 text-primary-700' 
            : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
        }`;
    }
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  // Horizontal layout
  if (orientation === 'horizontal') {
    return (
      <div className={`w-full ${className}`}>
        {/* Tab headers */}
        <div className={`
          flex gap-1 p-1 
          ${variant === 'cards' ? 'bg-gray-50 rounded-lg' : ''}
          ${variant === 'underline' ? 'border-b border-gray-200' : ''}
          ${fullWidth ? 'w-full' : ''}
        `}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const isDisabled = tab.disabled || false;

            return (
              <motion.button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  relative flex items-center gap-2
                  ${getVariantStyles(isActive, isDisabled)}
                  ${fullWidth ? 'flex-1 justify-center' : ''}
                `}
                whileHover={!isDisabled ? { scale: 1.02 } : {}}
                whileTap={!isDisabled ? { scale: 0.98 } : {}}
              >
                {/* Active indicator */}
                {isActive && variant !== 'underline' && variant !== 'cards' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary-500 rounded-lg"
                    style={{ zIndex: -1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}

                {/* Icon */}
                {tab.icon && (
                  <motion.span
                    animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {tab.icon}
                  </motion.span>
                )}

                {/* Label */}
                <span className={isActive && variant !== 'underline' && variant !== 'cards' ? 'text-white' : ''}>
                  {tab.label}
                </span>

                {/* Badge */}
                {tab.badge && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full min-w-[1.25rem] h-5 flex items-center justify-center"
                  >
                    {tab.badge}
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="mt-4">
          <AnimatePresence mode="wait">
            {animated ? (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTabContent}
              </motion.div>
            ) : (
              <div>{activeTabContent}</div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Vertical layout
  return (
    <div className={`flex gap-6 ${className}`}>
      {/* Tab headers */}
      <div className="flex flex-col gap-1 min-w-[200px]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isDisabled = tab.disabled || false;

          return (
            <motion.button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                relative flex items-center gap-3 text-left
                ${getVariantStyles(isActive, isDisabled)}
              `}
              whileHover={!isDisabled ? { x: 4 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTabVertical"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 rounded-r"
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}

              {/* Icon */}
              {tab.icon && (
                <motion.span
                  animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {tab.icon}
                </motion.span>
              )}

              {/* Label */}
              <span className="flex-1">{tab.label}</span>

              {/* Badge */}
              {tab.badge && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full min-w-[1.25rem] h-5 flex items-center justify-center"
                >
                  {tab.badge}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {animated ? (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTabContent}
            </motion.div>
          ) : (
            <div>{activeTabContent}</div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Controlled tabs component
export function ControlledAnimatedTabs({
  activeTab,
  onTabChange,
  ...props
}: Omit<AnimatedTabsProps, 'defaultActive' | 'onTabChange'> & {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}) {
  return (
    <AnimatedTabs
      {...props}
      defaultActive={activeTab}
      onTabChange={onTabChange}
    />
  );
}

// Hook for managing tab state
export function useTabs(initialTab?: string) {
  const [activeTab, setActiveTab] = useState(initialTab || '');

  return {
    activeTab,
    setActiveTab,
    isActive: (tabId: string) => activeTab === tabId,
  };
}