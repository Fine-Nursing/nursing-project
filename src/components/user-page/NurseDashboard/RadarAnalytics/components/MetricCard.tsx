import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useTheme } from 'src/hooks/useTheme';
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
  const tc = useTheme(theme);
  const Icon = metricIcons[category] || ChevronRight;
  const displayName = metricDisplayNames[category] || category;
  const diff = ((userValue - avgValue) / avgValue * 100).toFixed(1);
  const isPositive = userValue >= avgValue;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`p-3 rounded-lg cursor-pointer transition-all ${
        isSelected
          ? tc.getClass('bg-blue-50 border-blue-200', 'bg-blue-900/30 border-blue-600')
          : tc.getClass('bg-gray-50 border-gray-200', 'bg-slate-700 border-slate-600')
      } border`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${tc.getClass('text-gray-600', 'text-gray-400')}`} />
          <span className={`text-sm font-medium ${tc.text.primary}`}>
            {displayName}
          </span>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          isPositive
            ? tc.getClass('bg-emerald-100 text-emerald-700', 'bg-emerald-900/30 text-emerald-400')
            : tc.getClass('bg-amber-100 text-amber-700', 'bg-amber-900/30 text-amber-400')
        }`}>
          {isPositive ? '+' : ''}{diff}%
        </span>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className={tc.text.secondary}>You</span>
          <span className={`font-semibold ${tc.text.primary}`}>
            {userValue.toFixed(1)}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className={tc.text.secondary}>Avg</span>
          <span className={tc.text.muted}>
            {avgValue.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className={`mt-2 h-1 rounded-full ${tc.getClass('bg-gray-200', 'bg-slate-600')}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(userValue / 10) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full rounded-full ${
            isPositive
              ? tc.getClass('bg-emerald-500', 'bg-emerald-400')
              : tc.getClass('bg-amber-500', 'bg-amber-400')
          }`}
        />
      </div>
    </motion.div>
  );
}