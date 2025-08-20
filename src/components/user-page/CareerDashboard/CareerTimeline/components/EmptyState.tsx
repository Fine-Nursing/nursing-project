import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus } from 'lucide-react';
import type { EmptyStateProps } from '../types';

export function EmptyState({ theme, careerData, filterRole, setFormVisible }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-16 text-center"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${
          theme === 'light' 
            ? 'bg-gradient-to-br from-blue-100 to-purple-100' 
            : 'bg-gradient-to-br from-blue-900/30 to-purple-900/30'
        }`}
      >
        <MapPin className={`w-12 h-12 ${
          theme === 'light' ? 'text-blue-500' : 'text-blue-400'
        }`} />
      </motion.div>
      
      <h3 className={`text-lg sm:text-xl font-bold mb-2 ${
        theme === 'light' ? 'text-gray-800' : 'text-gray-200'
      }`}>
        {careerData.length === 0 ? 'Start Your Journey!' : 'No matching positions'}
      </h3>
      
      <p className={`text-sm mb-6 ${
        theme === 'light' ? 'text-gray-600' : 'text-gray-400'
      }`}>
        {careerData.length === 0 
          ? 'Add your work experience to see your amazing career progression'
          : `No positions found matching "${filterRole}". Try a different search.`}
      </p>
      
      {careerData.length === 0 && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => setFormVisible(true)}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg shadow-lg transition-all"
        >
          <Plus className="w-5 h-5 inline mr-2" />
          Add Your First Job
        </motion.button>
      )}
    </motion.div>
  );
}