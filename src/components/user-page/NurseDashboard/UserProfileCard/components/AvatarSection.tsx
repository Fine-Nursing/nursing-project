import React from 'react';
import { motion } from 'framer-motion';
import { UserCircle } from 'lucide-react';
import SimpleBeanHead from '../../SimpleBeanHead';
import type { AvatarConfig } from '../types';

interface AvatarSectionProps {
  avatarConfig: AvatarConfig;
  onEditClick: () => void;
  theme: 'light' | 'dark';
}

export function AvatarSection({ avatarConfig, onEditClick, theme }: AvatarSectionProps) {
  return (
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
          onClick={onEditClick}
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
  );
}