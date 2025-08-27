import React from 'react';
import { m } from 'framer-motion';
import type { ProfileInfoItem } from '../types';

interface ProfileInfoGridProps {
  items: ProfileInfoItem[];
  theme: 'light' | 'dark';
}

export function ProfileInfoGrid({ items, theme }: ProfileInfoGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
      {items.map((item, index) => (
        <m.div
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
        </m.div>
      ))}
    </div>
  );
}