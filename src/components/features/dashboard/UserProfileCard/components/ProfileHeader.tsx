import React from 'react';
import { m } from 'framer-motion';
import { Edit2 } from 'lucide-react';

interface ProfileHeaderProps {
  name: string;
  role: string;
  theme: 'light' | 'dark';
  onEditClick?: () => void;
}

export function ProfileHeader({ name, role, theme, onEditClick }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 text-center sm:text-left">
      <m.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className={`text-2xl font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
          {name}
        </h2>
        <p className={`text-base ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
          {role}
        </p>
      </m.div>
      <m.button
        onClick={onEditClick}
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
      </m.button>
    </div>
  );
}