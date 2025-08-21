import React from 'react';
import { motion } from 'framer-motion';
import type { QuickStatsProps } from '../types';

interface HeaderSectionProps extends QuickStatsProps {
  selectedLocations: string[];
  processedDataLength: number;
}

export function HeaderSection({
  selectedLocations,
  processedDataLength,
  selectedLocationsLength,
}: HeaderSectionProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6"
      >
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-emerald-800 dark:text-emerald-100">
            Nursing Specialties Explorer
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-300 mt-1">
            {selectedLocations.length > 0
              ? `Showing specialties in ${selectedLocations.length} selected ${
                  selectedLocations.length === 1 ? 'location' : 'locations'
                }`
              : 'All nursing specialties across locations'}
          </p>
          {processedDataLength > 0 && (
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-zinc-300">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                {processedDataLength} specialties found
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                Live data
              </span>
            </div>
          )}
        </div>
        
        <QuickStats
          processedDataLength={processedDataLength}
          selectedLocationsLength={selectedLocationsLength}
        />
      </motion.div>
    </div>
  );
}

function QuickStats({ processedDataLength, selectedLocationsLength }: QuickStatsProps) {
  return (
    <div className="flex gap-4">
      <div className="text-center px-3 py-2 bg-white/60 dark:bg-zinc-900 rounded-lg backdrop-blur-sm border border-blue-100 dark:border-zinc-700">
        <div className="text-lg font-bold text-teal-600 dark:text-teal-400">
          {processedDataLength}
        </div>
        <div className="text-xs text-gray-600 dark:text-zinc-400">Specialties</div>
      </div>
      <div className="text-center px-3 py-2 bg-white/60 dark:bg-zinc-900 rounded-lg backdrop-blur-sm border border-blue-100 dark:border-zinc-700">
        <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
          {selectedLocationsLength || 'All'}
        </div>
        <div className="text-xs text-gray-600 dark:text-zinc-400">Locations</div>
      </div>
    </div>
  );
}