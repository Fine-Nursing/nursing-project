'use client';

import { useMemo, useEffect, lazy, Suspense } from 'react';
import { m } from 'framer-motion';
import {
  useSpecialtyAverageCompensation,
} from 'src/api/useSpecialties';
import { useStates } from 'src/api/useLocations';
import useIsMobile from 'src/hooks/useIsMobile';
import { LoadingState } from '../../feedback';
import { useSearch, useFilterState, useOutsideClick } from './hooks';
import { calculateSalaryRange, processCompensationData } from './utils';
import {
  HeaderSection,
  SearchAndFilters,
  ActiveFilters,
  ChartSection,
} from './components';

// Lazy load MobileNursingGraph to avoid SSR issues
const MobileNursingGraph = lazy(() => import('../MobileNursingGraph'));

export default function NursingGraph() {
  const isMobile = useIsMobile();
  
  // Custom hooks
  const search = useSearch();
  const filters = useFilterState();
  
  // Handle outside clicks
  useOutsideClick(
    search.searchInputRef,
    search.suggestionsRef,
    () => search.setShowSuggestions(false)
  );

  // API calls
  const {
    data: compensations,
    isLoading: isLoadingCompensations,
    isFetching: isFetchingCompensations,
    isPlaceholderData,
  } = useSpecialtyAverageCompensation({
    states: filters.selectedLocations.length > 0 ? filters.selectedLocations : undefined,
    experienceGroups:
      filters.selectedExperience.length > 0 ? filters.selectedExperience : undefined,
    search: search.debouncedSearchTerm || undefined,
    sortBy: 'total',
    sortOrder: 'desc',
  });

  const { data: states, isLoading: isLoadingStates } = useStates();

  // Calculate salary range
  const salaryRangeValues = useMemo(
    () => calculateSalaryRange(compensations),
    [compensations]
  );

  useEffect(() => {
    // 초기 값이나 실제로 변경된 경우에만 업데이트
    if (salaryRangeValues.min !== filters.salaryRange[0] || 
        salaryRangeValues.max !== filters.salaryRange[1]) {
      filters.setSalaryRange([salaryRangeValues.min, salaryRangeValues.max]);
    }
  }, [salaryRangeValues.min, salaryRangeValues.max, filters.setSalaryRange, filters.salaryRange]);

  // Process data
  const processedData = useMemo(
    () => processCompensationData(
      compensations,
      filters.salaryRange,
      filters.selectedLocations
    ),
    [compensations, filters.salaryRange, filters.selectedLocations]
  );

  // Return mobile version if on mobile device
  if (isMobile) {
    return (
      <Suspense
        fallback={
          <div className="min-h-[400px] sm:min-h-[600px] lg:min-h-[800px] w-full bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-md">
            <LoadingState size="lg" color="emerald" text="Loading graph..." fullHeight />
          </div>
        }
      >
        <MobileNursingGraph />
      </Suspense>
    );
  }

  // Initial loading
  if (isLoadingStates || (!compensations && isLoadingCompensations)) {
    return (
      <div className="min-h-[800px] w-full bg-white p-8 rounded-xl shadow-md flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-gradient-to-br from-white via-blue-50/30 to-teal-50/50 dark:from-zinc-900/50 dark:via-zinc-900/70 dark:to-zinc-900/50 p-6 sm:p-8 lg:p-10 rounded-2xl shadow-xl border border-blue-100/50 dark:border-zinc-600 backdrop-blur-sm overflow-hidden"
    >
      <HeaderSection
        selectedLocations={filters.selectedLocations}
        processedDataLength={processedData.length}
        selectedLocationsLength={filters.selectedLocations.length}
      />

      <SearchAndFilters
        // Search props
        searchTerm={search.searchTerm}
        debouncedSearchTerm={search.debouncedSearchTerm}
        showSuggestions={search.showSuggestions}
        suggestions={search.suggestions}
        isLoadingSuggestions={search.isLoadingSuggestions}
        selectedSuggestionIndex={search.selectedSuggestionIndex}
        onSearchChange={search.handleSearchChange}
        onKeyDown={search.handleKeyDown}
        onFocus={search.handleFocus}
        onSelectSuggestion={search.handleSelectSuggestion}
        onSetSelectedSuggestionIndex={search.setSelectedSuggestionIndex}
        searchInputRef={search.searchInputRef}
        suggestionsRef={search.suggestionsRef}
        // Filter props
        selectedLocations={filters.selectedLocations}
        onLocationChange={filters.setSelectedLocations}
        selectedExperience={filters.selectedExperience}
        onExperienceChange={filters.setSelectedExperience}
        salaryRange={filters.salaryRange}
        onSalaryRangeChange={filters.setSalaryRange}
        minSalary={salaryRangeValues.min}
        maxSalary={salaryRangeValues.max}
        processedData={processedData}
        statesData={states}
      />

      <ActiveFilters
        selectedLocations={filters.selectedLocations}
        selectedExperience={filters.selectedExperience}
        states={states}
        onClearAll={filters.clearAllFilters}
        onRemoveLocation={filters.removeLocation}
        onRemoveExperience={filters.removeExperience}
      />

      <ChartSection
        processedData={processedData}
        states={states}
        isFetchingCompensations={isFetchingCompensations}
        isPlaceholderData={isPlaceholderData}
      />
    </m.div>
  );
}