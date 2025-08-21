import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useSpecialtyList } from 'src/api/useSpecialties';
import { STATE_MAPPING } from '../constants';
import type { FilterPanelProps } from '../types';
import CustomDropdown from './CustomDropdown';

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
    <div className="absolute right-0 top-12 z-[200] w-72 sm:w-80 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-emerald-200 dark:border-zinc-700 p-4 max-h-[80vh] overflow-visible transition-colors">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-emerald-800 dark:text-zinc-100">Filters</h3>
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
            className="block text-sm font-medium text-emerald-700 dark:text-zinc-200 mb-1"
          >
            Specialty
          </label>
          <CustomDropdown
            id="filter-specialty"
            value={localFilters.specialty || ''}
            onChange={(value) =>
              setLocalFilters({ ...localFilters, specialty: value })
            }
            options={[
              { value: '', label: 'All Specialties' },
              ...specialties.map(specialty => ({ value: specialty, label: specialty }))
            ]}
            placeholder="All Specialties"
            disabled={isLoadingSpecialties}
          />
        </div>

        <div>
          <label
            htmlFor="filter-state"
            className="block text-sm font-medium text-emerald-700 dark:text-zinc-200 mb-1"
          >
            State
          </label>
          <CustomDropdown
            id="filter-state"
            value={localFilters.state || ''}
            onChange={(value) =>
              setLocalFilters({ ...localFilters, state: value })
            }
            options={[
              { value: '', label: 'All States' },
              ...Object.entries(STATE_MAPPING).map(([code, name]) => ({ 
                value: name, 
                label: `${code} - ${name}` 
              }))
            ]}
            placeholder="All States"
          />
        </div>

        <div>
          <label
            htmlFor="filter-city"
            className="block text-sm font-medium text-emerald-700 dark:text-zinc-200 mb-1"
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
            className="w-full px-3.5 py-2.5 border-2 border-emerald-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:ring-emerald-400 bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/30 dark:from-zinc-800/70 dark:to-zinc-800/50 text-gray-900 dark:text-zinc-100 hover:border-emerald-400 hover:shadow-md hover:from-emerald-50/40 hover:to-teal-50/40 dark:hover:from-zinc-800/80 dark:hover:to-zinc-700/60 backdrop-blur-sm transition-all duration-200 cursor-pointer shadow-sm font-medium"
            placeholder="e.g., Los Angeles"
          />
        </div>
      </div>

      <div className="flex gap-2 mt-6">
        <button
          type="button"
          onClick={handleReset}
          className="flex-1 px-4 py-2 border border-emerald-200 dark:border-zinc-700 rounded-xl text-emerald-700 dark:text-zinc-300 hover:bg-emerald-50 dark:hover:bg-zinc-800/50 bg-white/80 backdrop-blur-sm transition-all duration-200 font-medium"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={handleApply}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 shadow-sm transition-all duration-200 font-medium"
        >
          Apply
        </button>
      </div>
    </div>
  );
}