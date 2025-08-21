import React from 'react';
import { X } from 'lucide-react';
import { findStateByCode } from 'src/api/useLocations';
import type { ActiveFiltersProps } from '../types';

export function ActiveFilters({
  selectedLocations,
  selectedExperience,
  states,
  onClearAll,
  onRemoveLocation,
  onRemoveExperience,
}: ActiveFiltersProps) {
  if (selectedLocations.length === 0 && selectedExperience.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/30 dark:bg-zinc-900 backdrop-blur-sm rounded-lg p-3 border border-white/40 dark:border-zinc-700">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">
          Active Filters:
        </span>
        <button
          onClick={onClearAll}
          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
        >
          Clear all
        </button>
      </div>

      {selectedLocations.length > 0 && states && (
        <div className="mb-2">
          <span className="text-xs text-gray-500 dark:text-zinc-400 mr-2">
            Locations:
          </span>
          <div className="inline-flex flex-wrap gap-1.5">
            {selectedLocations.map((locationCode) => {
              const state = findStateByCode(states, locationCode);
              return (
                <FilterChip
                  key={locationCode}
                  label={state?.name || locationCode}
                  onRemove={() => onRemoveLocation(locationCode)}
                  color="violet"
                />
              );
            })}
          </div>
        </div>
      )}

      {selectedExperience.length > 0 && (
        <div>
          <span className="text-xs text-gray-500 dark:text-zinc-400 mr-2">
            Experience:
          </span>
          <div className="inline-flex flex-wrap gap-1.5">
            {selectedExperience.map((exp) => (
              <FilterChip
                key={exp}
                label={exp}
                onRemove={() => onRemoveExperience(exp)}
                color="blue"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface FilterChipProps {
  label: string;
  onRemove: () => void;
  color: 'violet' | 'blue';
}

function FilterChip({ label, onRemove, color }: FilterChipProps) {
  const colorClasses = {
    violet: 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 hover:text-violet-900 dark:hover:text-violet-200',
    blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-200',
  };

  return (
    <div
      className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm ${
        colorClasses[color]
      }`}
    >
      <span className="truncate max-w-[100px] sm:max-w-none">{label}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="cursor-pointer p-0.5 flex items-center justify-center flex-shrink-0"
      >
        <X size={12} className="sm:w-3.5 sm:h-3.5" />
      </button>
    </div>
  );
}