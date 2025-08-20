import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Loader } from 'lucide-react';
import type { AnalysisStepProps } from '../types';

export function AnalysisStep({ step, isActive, isCompleted, index }: AnalysisStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ 
        opacity: isActive || isCompleted ? 1 : 0.5,
        x: 0,
        scale: isActive ? 1.02 : 1
      }}
      transition={{ delay: index * 0.1 }}
      className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
        isActive 
          ? 'bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-700' 
          : 'bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700'
      }`}
    >
      {/* Icon Container */}
      <div className={`flex-shrink-0 p-3 rounded-lg ${
        isActive 
          ? 'bg-emerald-500 text-white' 
          : isCompleted 
            ? 'bg-green-500 text-white'
            : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400'
      }`}>
        {isCompleted ? (
          <CheckCircle className="w-6 h-6" />
        ) : isActive ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader className="w-6 h-6" />
          </motion.div>
        ) : (
          step.icon
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className={`font-semibold text-lg ${
          isActive 
            ? 'text-emerald-900 dark:text-emerald-100' 
            : 'text-gray-900 dark:text-white'
        }`}>
          {step.title}
        </h3>
        <p className={`text-sm mt-1 ${
          isActive 
            ? 'text-emerald-700 dark:text-emerald-200' 
            : 'text-gray-600 dark:text-slate-400'
        }`}>
          {step.subtitle}
        </p>
        
        {/* Metrics */}
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2"
          >
            <span className="inline-block px-2 py-1 text-xs font-medium bg-emerald-100 dark:bg-emerald-800/50 text-emerald-700 dark:text-emerald-300 rounded-full">
              {step.metrics}
            </span>
          </motion.div>
        )}
      </div>

      {/* Status Indicator */}
      <div className="flex-shrink-0">
        {isActive && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-3 h-3 bg-emerald-500 rounded-full"
          />
        )}
        {isCompleted && (
          <div className="w-3 h-3 bg-green-500 rounded-full" />
        )}
      </div>
    </motion.div>
  );
}