import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';
import type { SpecialtyListItemProps } from '../types';

// Specialty List Item - Clean and Scannable
export function SpecialtyListItem({ 
  specialty, 
  data, 
  rank,
  onClick,
  isSelected 
}: SpecialtyListItemProps) {
  const avgCompensation = data?.averageCompensation || 0;
  const trend = rank <= 3 ? 'up' : rank >= 8 ? 'down' : 'stable';
  
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full p-4 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 last:border-b-0 transition-colors ${
        isSelected ? 'bg-purple-50 dark:bg-purple-900/20' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Rank Badge */}
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
            rank <= 3 ? 'bg-green-100 text-green-700' :
            rank <= 6 ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {rank}
          </div>
          
          {/* Specialty Name */}
          <div className="text-left">
            <p className="font-medium text-sm text-gray-900 dark:text-white">
              {specialty}
            </p>
            <p className="text-xs text-gray-500 dark:text-zinc-500">
              {data?.count || 0} positions
            </p>
          </div>
        </div>
        
        {/* Compensation & Trend */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-semibold text-gray-900 dark:text-white">
              ${avgCompensation}
            </p>
            <p className="text-xs text-gray-500 dark:text-zinc-500">avg/hr</p>
          </div>
          
          {/* Trend Indicator */}
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            trend === 'up' ? 'bg-green-100' :
            trend === 'down' ? 'bg-red-100' :
            'bg-gray-100'
          }`}>
            {trend === 'up' ? <TrendingUp size={14} className="text-green-600" /> :
             trend === 'down' ? <TrendingDown size={14} className="text-red-600" /> :
             <Minus size={14} className="text-gray-400" />}
          </div>
          
          <ChevronRight size={16} className="text-gray-400" />
        </div>
      </div>
    </motion.button>
  );
}