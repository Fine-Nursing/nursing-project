import type { ExperienceGroup } from 'src/types/common';
import type { RegionStates } from 'src/types/location';
import type { SpecialtyCompensation } from 'src/types/specialty';

export interface NursingGraphState {
  searchTerm: string;
  debouncedSearchTerm: string;
  autocompleteSearchTerm: string;
  selectedLocations: string[];
  selectedExperience: ExperienceGroup[];
  salaryRange: [number, number];
  showSuggestions: boolean;
  selectedSuggestionIndex: number;
}

export interface ProcessedDataItem {
  specialty: string;
  'Base Pay': number;
  'Differential Pay': number;
  total: number;
  state: string;
  shiftHours?: number;
}

export interface SalaryRangeValues {
  min: number;
  max: number;
}

export interface QuickStatsProps {
  processedDataLength: number;
  selectedLocationsLength: number;
}

export interface ActiveFiltersProps {
  selectedLocations: string[];
  selectedExperience: ExperienceGroup[];
  states: RegionStates | undefined;
  onClearAll: () => void;
  onRemoveLocation: (locationCode: string) => void;
  onRemoveExperience: (exp: ExperienceGroup) => void;
}

export interface SearchSectionProps {
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
}