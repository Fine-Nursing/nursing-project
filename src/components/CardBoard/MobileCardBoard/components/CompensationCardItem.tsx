import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';
import type { CompensationCardProps } from '../types';

export function CompensationCardItem({ 
  card, 
  index, 
  isExpanded, 
  onToggle 
}: CompensationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden"
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 rounded-2xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                {card.specialty}
              </span>
              <span className="text-xs text-gray-500 dark:text-zinc-500">
                {card.city}, {card.state}
              </span>
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                ${card.totalPay}
              </span>
              <span className="text-sm text-gray-500 dark:text-zinc-500">/hr</span>
            </div>
            
            <div className="flex items-center gap-4 mt-2">
              <div className="text-xs">
                <span className="text-gray-500 dark:text-zinc-500">Annual: </span>
                <span className="font-semibold text-gray-700 dark:text-zinc-300">
                  ${(card.totalPay * 2080 / 1000).toFixed(0)}k
                </span>
              </div>
            </div>
          </div>
          
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="ml-2"
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </motion.div>
        </div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-100 dark:border-zinc-800"
          >
            <div className="p-4 space-y-3">
              {/* Differentials */}
              {card.differentialPay > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                    Differentials
                  </p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 dark:text-zinc-500">
                        Differential Pay
                      </span>
                      <span className="font-medium text-gray-700 dark:text-zinc-300">
                        +${card.differentialPay}/hr
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Unit Feedback */}
              {card.unitFeedback && (
                <div className="pt-3 border-t border-gray-100 dark:border-zinc-800">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                        Unit Feedback
                      </p>
                      <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
                        {card.unitFeedback}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Additional Stats */}
              <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-zinc-500">Experience</p>
                  <p className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
                    {card.experienceLevel}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-zinc-500">Facility Type</p>
                  <p className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
                    {card.hospital}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}