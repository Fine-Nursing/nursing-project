import { Search } from 'lucide-react';
import { ExperienceTabs } from './ExperienceTabs';
import type { HeaderSectionProps } from '../types';

export function HeaderSection({
  searchTerm,
  onSearchChange,
  selectedExperience,
  onExperienceChange,
  viewMode,
  onViewModeChange,
}: HeaderSectionProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
      <div className="p-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          Specialty Analysis
        </h1>
        <p className="text-sm text-gray-500 dark:text-zinc-500">
          Average compensation by specialty
        </p>
      </div>
      
      {/* Search Bar */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search specialties..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-zinc-800 rounded-xl text-sm placeholder-gray-500 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>
      
      {/* Experience Filter */}
      <div className="px-4 pb-3">
        <ExperienceTabs 
          selected={selectedExperience}
          onChange={onExperienceChange}
        />
      </div>
      
      {/* View Toggle */}
      <div className="px-4 pb-3 flex gap-2">
        <button
          onClick={() => onViewModeChange('list')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === 'list' 
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' 
              : 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400'
          }`}
        >
          List View
        </button>
        <button
          onClick={() => onViewModeChange('chart')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === 'chart' 
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' 
              : 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400'
          }`}
        >
          Chart View
        </button>
      </div>
    </div>
  );
}