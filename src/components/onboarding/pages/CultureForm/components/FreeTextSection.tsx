import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import type { FreeTextSectionProps } from '../types';

export function FreeTextSection({ value, onChange }: FreeTextSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Additional Feedback
          </h3>
          <p className="text-sm text-gray-600 dark:text-slate-300">
            Share any additional thoughts about your workplace (optional)
          </p>
        </div>
      </div>

      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Share your thoughts about workplace culture, management, benefits, or anything else that might help other nurses..."
          className="w-full p-4 border border-gray-200 dark:border-slate-600 rounded-lg resize-none h-32 text-gray-900 dark:text-white bg-white dark:bg-slate-700 placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
        />
        <div className="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-slate-500">
          {value.length}/1000
        </div>
      </div>
    </motion.div>
  );
}