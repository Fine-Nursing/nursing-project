import React from 'react';
import type { ExperienceGroup } from 'src/types/common';
import type { RegionStates } from 'src/types/location';
import LocationSelector from '../../LocationSelector';
import FilterSection from '../../FilterSections';
import { SearchSection } from './SearchSection';
import type { ProcessedDataItem } from '../types';

interface SearchAndFiltersProps {
  // Search props
  searchTerm: string;
  debouncedSearchTerm: string;
  showSuggestions: boolean;
  suggestions: string[] | undefined;
  isLoadingSuggestions: boolean;
  selectedSuggestionIndex: number;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onSelectSuggestion: (suggestion: string) => void;
  onSetSelectedSuggestionIndex: (index: number) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  suggestionsRef: React.RefObject<HTMLDivElement>;
  
  // Filter props
  selectedLocations: string[];
  onLocationChange: (locations: string[]) => void;
  selectedExperience: ExperienceGroup[];
  onExperienceChange: (experience: ExperienceGroup[]) => void;
  salaryRange: [number, number];
  onSalaryRangeChange: (range: [number, number]) => void;
  minSalary: number;
  maxSalary: number;
  processedData: ProcessedDataItem[];
  statesData: RegionStates | undefined;
}

export function SearchAndFilters(props: SearchAndFiltersProps) {
  return (
    <div className="bg-white/40 dark:bg-zinc-950 backdrop-blur-sm rounded-xl p-6 border border-white/50 dark:border-zinc-700 shadow-sm relative z-40">
      <div className="flex flex-col lg:flex-row gap-4">
        <SearchSection
          searchTerm={props.searchTerm}
          debouncedSearchTerm={props.debouncedSearchTerm}
          showSuggestions={props.showSuggestions}
          suggestions={props.suggestions}
          isLoadingSuggestions={props.isLoadingSuggestions}
          selectedSuggestionIndex={props.selectedSuggestionIndex}
          onSearchChange={props.onSearchChange}
          onKeyDown={props.onKeyDown}
          onFocus={props.onFocus}
          onSelectSuggestion={props.onSelectSuggestion}
          onSetSelectedSuggestionIndex={props.onSetSelectedSuggestionIndex}
          searchInputRef={props.searchInputRef}
          suggestionsRef={props.suggestionsRef}
        />

        <div className="flex flex-col sm:flex-row gap-2 lg:w-auto w-full">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
              Location & Filters
            </label>
            <div className="flex gap-2">
              <LocationSelector
                selectedLocations={props.selectedLocations}
                onLocationChange={props.onLocationChange}
                statesData={props.statesData}
              />
              <FilterSection
                salaryRange={props.salaryRange}
                onSalaryRangeChange={props.onSalaryRangeChange}
                processedData={props.processedData}
                selectedExperience={props.selectedExperience}
                onExperienceChange={props.onExperienceChange}
                minSalary={props.minSalary}
                maxSalary={props.maxSalary}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}