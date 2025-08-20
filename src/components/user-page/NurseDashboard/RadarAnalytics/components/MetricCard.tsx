import React from 'react';
import { motion } from 'framer-motion';
import { metricDisplayNames, metricIcons } from '../types';
import type { MetricCardProps } from '../types';

export function MetricCard({
  category,
  userValue,
  avgValue,
  theme,
  isSelected,
  onSelect,
}: MetricCardProps) {
  const Icon = metricIcons[category];
  const displayName = metricDisplayNames[category] || category;
  const diff = ((userValue - avgValue) / avgValue * 100).toFixed(0);
  const isPositive = Number(diff) > 0;

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all min-h-[100px] sm:min-h-[120px] flex flex-col justify-between ${
        isSelected
          ? theme === 'light'
            ? 'bg-emerald-50 border-emerald-300'
            : 'bg-emerald-900/30 border-emerald-700'
          : theme === 'light'
            ? 'bg-white border-gray-200'
            : 'bg-slate-900/50 border-slate-700'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
        <span className={`text-xs font-medium whitespace-nowrap ${
          isPositive
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400'
        }`}>
          {isPositive ? '+' : ''}{diff}%
        </span>
      </div>
      <div className="flex-1 overflow-hidden">
        <p className={`text-[10px] sm:text-xs mb-1 sm:mb-2 leading-tight truncate ${
          theme === 'light' ? 'text-gray-500' : 'text-gray-400'
        }`} title={displayName}>
          {displayName}
        </p>
        <p className={`text-lg sm:text-xl font-bold ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          {userValue.toFixed(1)}
        </p>
      </div>
    </motion.div>
  );
}