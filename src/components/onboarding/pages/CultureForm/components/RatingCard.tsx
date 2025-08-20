import React from 'react';
import { motion } from 'framer-motion';
import type { RatingCardProps } from '../types';
import { RATING_OPTIONS } from '../constants';

export function RatingCard({ category, value, onRatingChange }: RatingCardProps) {
  const IconComponent = category.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
          <IconComponent className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {category.label}
          </h3>
          <p className="text-sm text-gray-600 dark:text-slate-300">
            {category.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {RATING_OPTIONS.map((option, index) => (
          <motion.button
            key={option.value}
            type="button"
            onClick={() => onRatingChange(category.key, option.value)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-3 rounded-lg text-center transition-all ${
              value === option.value
                ? 'bg-emerald-500 text-white shadow-md'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            <div className="font-semibold text-lg mb-1">{option.value}</div>
            <div className="text-xs">{option.label}</div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}