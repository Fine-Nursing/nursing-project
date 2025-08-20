import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import type { DetailModalProps } from '../types';

export function DetailModal({ 
  selectedSpecialty, 
  selectedSpecialtyData, 
  onClose 
}: DetailModalProps) {
  return (
    <AnimatePresence>
      {selectedSpecialty && selectedSpecialtyData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-end"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="bg-white dark:bg-zinc-900 rounded-t-3xl w-full max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-gray-300 dark:bg-zinc-700 rounded-full mx-auto mt-3 mb-4" />
            
            <div className="px-6 pb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {selectedSpecialty}
              </h2>
              
              {/* Compensation Breakdown */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600 dark:text-zinc-400">Average Hourly Rate</span>
                  <DollarSign size={18} className="text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  ${selectedSpecialtyData.avgCompensation}
                </p>
                <p className="text-xs text-gray-600 dark:text-zinc-400">
                  Based on {selectedSpecialtyData.data.count || 0} data points
                </p>
              </div>
              
              {/* Experience Breakdown */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">By Experience Level</h3>
                {selectedSpecialtyData.data.byExperience && Object.entries(selectedSpecialtyData.data.byExperience).map(([level, value]: [string, any]) => (
                  <div key={level} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-zinc-800">
                    <span className="text-sm text-gray-600 dark:text-zinc-400 capitalize">{level}</span>
                    <span className="font-medium text-gray-900 dark:text-white">${value.average || 0}/hr</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}