'use client';

import { m, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'src/contexts/ThemeContext';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <m.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={`p-3 rounded-xl bg-gradient-to-br ${
        theme === 'dark' 
          ? 'from-purple-600 to-blue-600' 
          : 'from-yellow-400 to-orange-400'
      } text-white shadow-lg hover:shadow-xl transition-all ${className}`}
    >
      <m.div
        key={theme}
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 180, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </m.div>
    </m.button>
  );
}

// 간단한 토글 스위치 버전
export function ThemeSwitch({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <m.button
      className={`relative w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-full p-1 ${className}`}
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <m.div
        className="absolute inset-1"
        animate={{
          background: isDark
            ? 'linear-gradient(to right, #9333ea, #3b82f6)'
            : 'linear-gradient(to right, #fbbf24, #fb923c)',
        }}
        transition={{ duration: 0.3 }}
        style={{ borderRadius: '9999px' }}
      />
      
      <m.div
        className="relative w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
        animate={{ x: isDark ? 32 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <AnimatePresence mode="wait">
          <m.div
            key={isDark ? 'moon' : 'sun'}
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 180, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isDark ? (
              <Moon className="w-3 h-3 text-purple-600" />
            ) : (
              <Sun className="w-3 h-3 text-yellow-600" />
            )}
          </m.div>
        </AnimatePresence>
      </m.div>
    </m.button>
  );
}