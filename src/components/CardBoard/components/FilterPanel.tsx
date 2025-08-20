import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useSpecialtyList } from 'src/api/useSpecialties';
import { STATE_MAPPING } from '../constants';
import type { FilterPanelProps } from '../types';

export default function FilterPanel({
  filters,
  onFiltersChange,
  onClose,
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  const { data: specialtyList, isLoading: isLoadingSpecialties } =
    useSpecialtyList();
  const specialties: string[] = specialtyList || [];

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleReset = () => {
    setLocalFilters({});
    onFiltersChange({});
  };

  return (
    <div className="absolute right-0 top-12 z-10 w-72 sm:w-80 bg-white dark:bg-zinc-900/95 rounded-xl shadow-2xl border border-primary-100 dark:border-zinc-700/50 p-3 sm:p-4 max-h-[80vh] overflow-y-auto transition-colors">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-primary-800 dark:text-zinc-100">Filters</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="filter-specialty"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1"
          >
            Specialty
          </label>
          <select
            id="filter-specialty"
            value={localFilters.specialty || ''}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, specialty: e.target.value })
            }
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 bg-white dark:bg-zinc-800/70 text-gray-900 dark:text-zinc-100 transition-colors"
            disabled={isLoadingSpecialties}
          >
            <option value="">All Specialties</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="filter-state"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1"
          >
            State
          </label>
          <select
            id="filter-state"
            value={localFilters.state || ''}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, state: e.target.value })
            }
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 bg-white dark:bg-zinc-800/70 text-gray-900 dark:text-zinc-100 transition-colors"
          >
            <option value="">All States</option>
            {Object.entries(STATE_MAPPING).map(([code, name]) => (
              <option key={code} value={name}>
                {code} - {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="filter-city"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1"
          >
            City
          </label>
          <input
            id="filter-city"
            type="text"
            value={localFilters.city || ''}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, city: e.target.value })
            }
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 bg-white dark:bg-zinc-800/70 text-gray-900 dark:text-zinc-100 transition-colors"
            placeholder="e.g., Los Angeles"
          />
        </div>
      </div>

      <div className="flex gap-2 mt-6">
        <button
          type="button"
          onClick={handleReset}
          className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={handleApply}
          className="flex-1 px-4 py-2 bg-emerald-600 dark:bg-emerald-600 text-white rounded-md hover:bg-emerald-700 dark:hover:bg-emerald-700 transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
}