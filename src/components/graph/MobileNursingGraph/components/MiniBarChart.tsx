import { motion } from 'framer-motion';
import type { MiniBarChartProps } from '../types';

// Minimalist Chart Bar - Inspired by Apple Health/Google Fit
export function MiniBarChart({ 
  value, 
  maxValue, 
  label,
  highlighted = false 
}: MiniBarChartProps) {
  const percentage = (value / maxValue) * 100;
  
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 dark:text-zinc-500 w-8 text-right">
        {label}
      </span>
      <div className="flex-1 h-6 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full rounded-full ${
            highlighted 
              ? 'bg-gradient-to-r from-purple-500 to-purple-600' 
              : 'bg-gray-300 dark:bg-zinc-600'
          }`}
        />
      </div>
      <span className={`text-sm font-medium w-12 ${
        highlighted ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-zinc-400'
      }`}>
        ${value}
      </span>
    </div>
  );
}