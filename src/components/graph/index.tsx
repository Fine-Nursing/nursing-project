'use client';

import { useState, useMemo, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import { Search, X } from 'lucide-react';
import { debounce } from 'lodash';
import { AnimatePresence, motion } from 'framer-motion';
import type { ExperienceGroup } from 'src/types/common';

import {
  useSpecialtyAverageCompensation,
  useSpecialtyList,
} from 'src/api/useSpecialties';
import { findStateByCode, useStates } from 'src/api/useLocations';
import useIsMobile from 'src/hooks/useIsMobile';
import LocationSelector from './LocationSelector';
import FilterSection from './FilterSections';
import Chart from './Chart';

// Lazy load MobileNursingGraph to avoid SSR issues
const MobileNursingGraph = lazy(() => import('./MobileNursingGraphV2'));

export default function NursingGraph() {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [autocompleteSearchTerm, setAutocompleteSearchTerm] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<
    ExperienceGroup[]
  >([]);
  const [salaryRange, setSalaryRange] = useState<[number, number]>([
    70000, 120000,
  ]);

  // 자동완성 관련 상태
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // 자동완성을 위한 디바운스 (300ms)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedAutocomplete = useCallback(
    debounce((value: string) => {
      setAutocompleteSearchTerm(value);
    }, 300),
    []
  );

  // 검색을 위한 디바운스 (500ms)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
    }, 500),
    []
  );

  // 자동완성 API 호출
  const { data: suggestions, isLoading: isLoadingSuggestions } =
    useSpecialtyList(autocompleteSearchTerm);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchTerm(value);
    setSelectedSuggestionIndex(-1);

    if (value.length >= 1) {
      debouncedAutocomplete(value);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setAutocompleteSearchTerm('');
    }

    debouncedSearch(value);
  };

  // 자동완성 항목 선택
  const handleSelectSuggestion = (suggestion: string) => {
    setSearchTerm(suggestion);
    setDebouncedSearchTerm(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    searchInputRef.current?.focus();
  };

  // 키보드 네비게이션
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || !suggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSelectSuggestion(suggestions[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
      default:
        // 다른 키는 기본 동작 유지
        break;
    }
  };

  // 외부 클릭 시 자동완성 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 자동완성 드롭다운 내용 렌더링
  const renderSuggestionContent = () => {
    if (isLoadingSuggestions) {
      return (
        <div className="p-4 text-center text-gray-500 dark:text-zinc-300">
          <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      );
    }

    if (!suggestions || suggestions.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500 dark:text-zinc-300">
          No specialties found
        </div>
      );
    }

    return (
      <ul className="py-1" role="listbox">
        {suggestions.slice(0, 8).map((suggestion, index) => {
          const isSelected = index === selectedSuggestionIndex;
          const matchIndex = suggestion
            .toLowerCase()
            .indexOf(searchTerm.toLowerCase());
          const beforeMatch = suggestion.slice(0, matchIndex);
          const match = suggestion.slice(
            matchIndex,
            matchIndex + searchTerm.length
          );
          const afterMatch = suggestion.slice(matchIndex + searchTerm.length);

          let className = 'px-4 py-2 cursor-pointer transition-colors';
          if (isSelected) {
            className += ' bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300';
          } else {
            className += ' hover:bg-gray-50 dark:hover:bg-zinc-900 text-gray-700 dark:text-zinc-300';
          }

          return (
            <li
              key={suggestion}
              role="option"
              aria-selected={isSelected}
              tabIndex={0}
              className={className}
              onClick={() => handleSelectSuggestion(suggestion)}
              onMouseEnter={() => setSelectedSuggestionIndex(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelectSuggestion(suggestion);
                }
              }}
            >
              <span>
                {beforeMatch}
                <strong className="font-semibold">{match}</strong>
                {afterMatch}
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  // API 호출 - debouncedSearchTerm 사용
  const {
    data: compensations,
    isLoading: isLoadingCompensations,
    isFetching: isFetchingCompensations,
    isPlaceholderData,
  } = useSpecialtyAverageCompensation({
    states: selectedLocations.length > 0 ? selectedLocations : undefined,
    experienceGroups:
      selectedExperience.length > 0 ? selectedExperience : undefined,
    search: debouncedSearchTerm || undefined,
    sortBy: 'total',
    sortOrder: 'desc',
  });

  const { data: states, isLoading: isLoadingStates } = useStates();

  // 급여 범위 계산
  const salaryRangeValues = useMemo(() => {
    if (!compensations || compensations.length === 0) {
      return { min: 70000, max: 120000 };
    }

    const values = compensations.map((item) => item.totalCompensation);
    const min = Math.min(...values);
    const max = Math.max(...values);

    const padding = (max - min) * 0.1;
    return {
      min: Math.floor(min - padding),
      max: Math.ceil(max + padding),
    };
  }, [compensations]);

  useEffect(() => {
    setSalaryRange([salaryRangeValues.min, salaryRangeValues.max]);
  }, [salaryRangeValues]);

  // 데이터 처리
  const processedData = useMemo(() => {
    if (!compensations) return [];

    const processed = compensations
      .filter((item) => {
        const matchesSalary =
          item.totalCompensation >= salaryRange[0] &&
          item.totalCompensation <= salaryRange[1];
        return matchesSalary;
      })
      .map((item) => ({
        specialty: item.specialty,
        'Base Pay': item.basePay,
        'Differential Pay': item.differentialPay,
        total: item.totalCompensation,
        state: selectedLocations[0] || 'ALL',
      }));

    return processed;
  }, [compensations, salaryRange, selectedLocations]);

  // 초기 로딩 시에만 전체 로딩 표시
  // Return mobile version if on mobile device
  if (isMobile) {
    return (
      <Suspense fallback={
        <div className="min-h-[400px] sm:min-h-[600px] lg:min-h-[800px] w-full bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-md flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
        </div>
      }>
        <MobileNursingGraph />
      </Suspense>
    );
  }

  if (isLoadingStates || (!compensations && isLoadingCompensations)) {
    return (
      <div className="min-h-[800px] w-full bg-white p-8 rounded-xl shadow-md flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-gradient-to-br from-white via-blue-50/30 to-teal-50/50 dark:from-zinc-900/50 dark:via-zinc-900/70 dark:to-zinc-900/50 p-6 sm:p-8 lg:p-10 rounded-2xl shadow-xl border border-blue-100/50 dark:border-zinc-600 backdrop-blur-sm overflow-hidden"
    >
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6"
        >
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-zinc-100">
              Nursing Specialties Explorer
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-300 mt-1">
              {selectedLocations.length > 0
                ? `Showing specialties in ${selectedLocations.length} selected ${
                    selectedLocations.length === 1 ? 'location' : 'locations'
                  }`
                : 'All nursing specialties across locations'}
            </p>
            {processedData.length > 0 && (
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-zinc-300">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  {processedData.length} specialties found
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  Live data
                </span>
              </div>
            )}
          </div>
          
          {/* Quick Stats */}
          <div className="flex gap-4">
            <div className="text-center px-3 py-2 bg-white/60 dark:bg-zinc-900 rounded-lg backdrop-blur-sm border border-blue-100 dark:border-zinc-700">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{processedData.length}</div>
              <div className="text-xs text-gray-600 dark:text-zinc-400">Specialties</div>
            </div>
            <div className="text-center px-3 py-2 bg-white/60 dark:bg-zinc-900 rounded-lg backdrop-blur-sm border border-blue-100 dark:border-zinc-700">
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {selectedLocations.length || 'All'}
              </div>
              <div className="text-xs text-gray-600 dark:text-zinc-400">Locations</div>
            </div>
          </div>
        </motion.div>

        {/* Search & Filter Controls */}
        <div className="bg-white/40 dark:bg-zinc-950 backdrop-blur-sm rounded-xl p-6 border border-white/50 dark:border-zinc-700 shadow-sm relative z-40">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Section */}
            <div className="flex-1 min-w-0 relative z-50">
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                Search Specialties
              </label>
              <div className="relative z-50">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search specialties..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (searchTerm.length >= 1) {
                    // 2 → 1로 변경
                    if (suggestions && suggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  } else if (!searchTerm) {
                    // 검색어가 없으면 전체 목록 요청
                    setAutocompleteSearchTerm(' '); // 공백으로 전체 목록 트리거
                    setShowSuggestions(true);
                  }
                }}
                className="w-full px-3 sm:px-4 py-2 rounded-xl border border-blue-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400 pl-9 sm:pl-10 text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-400 shadow-sm transition-all duration-200 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-md"
              />
              <Search
                className="absolute left-2.5 sm:left-3 top-2.5 text-blue-400"
                size={16}
              />
              {/* 검색 로딩 인디케이터 */}
              {searchTerm !== debouncedSearchTerm && (
                <div className="absolute right-3 top-3">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            <AnimatePresence>
              {showSuggestions && (searchTerm.length >= 1 || !searchTerm) && (
                <motion.div
                  ref={suggestionsRef}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-[9999] w-full mt-1 bg-white/95 dark:bg-zinc-950 backdrop-blur-md rounded-xl shadow-2xl border border-blue-200 dark:border-zinc-700 max-h-64 overflow-y-auto"
                  role="listbox"
                >
                  {renderSuggestionContent()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

            {/* Filter Actions */}
            <div className="flex flex-col sm:flex-row gap-2 lg:w-auto w-full">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                  Location & Filters
                </label>
                <div className="flex gap-2">
            <LocationSelector
              selectedLocations={selectedLocations}
              onLocationChange={setSelectedLocations}
              statesData={states}
            />
                <FilterSection
                  salaryRange={salaryRange}
                  onSalaryRangeChange={setSalaryRange}
                  processedData={processedData}
                  selectedExperience={selectedExperience}
                  onExperienceChange={setSelectedExperience}
                  minSalary={salaryRangeValues.min}
                  maxSalary={salaryRangeValues.max}
                />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(selectedLocations.length > 0 || selectedExperience.length > 0) && (
          <div className="bg-white/30 dark:bg-zinc-900 backdrop-blur-sm rounded-lg p-3 border border-white/40 dark:border-zinc-700">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">Active Filters:</span>
              <button 
                onClick={() => {
                  setSelectedLocations([]);
                  setSelectedExperience([]);
                }}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
              >
                Clear all
              </button>
            </div>
            
            {selectedLocations.length > 0 && states && (
              <div className="mb-2">
                <span className="text-xs text-gray-500 dark:text-zinc-400 mr-2">Locations:</span>
                <div className="inline-flex flex-wrap gap-1.5">
            {selectedLocations.map((locationCode) => {
              const state = findStateByCode(states, locationCode);
              return (
                <div
                  key={locationCode}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-0.5 sm:py-1 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-xs sm:text-sm"
                >
                  <span className="truncate max-w-[100px] sm:max-w-none">{state?.name || locationCode}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLocations((prev) =>
                        prev.filter((code) => code !== locationCode)
                      );
                    }}
                    aria-label={`Remove ${state?.name} filter`}
                    className="cursor-pointer hover:text-violet-900 dark:hover:text-violet-200 p-0.5 flex items-center justify-center flex-shrink-0"
                  >
                    <X size={12} className="sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>
              );
                })}
                </div>
              </div>
            )}

            {selectedExperience.length > 0 && (
              <div>
                <span className="text-xs text-gray-500 dark:text-zinc-400 mr-2">Experience:</span>
                <div className="inline-flex flex-wrap gap-1.5">
            {selectedExperience.map((exp) => (
              <div
                key={exp}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs sm:text-sm"
              >
                <span>{exp}</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedExperience((prev) =>
                      prev.filter((e) => e !== exp)
                    );
                  }}
                  className="cursor-pointer hover:text-blue-900 dark:hover:text-blue-200 p-0.5 flex-shrink-0"
                >
                  <X size={12} className="sm:w-3.5 sm:h-3.5" />
                </button>
                </div>
            ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chart Section */}
      <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-white/50 dark:border-zinc-700 shadow-sm relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-zinc-100">Compensation Analysis</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-zinc-300">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Real-time data
          </div>
        </div>
        <div className="relative w-full overflow-hidden">
          <Chart data={processedData} states={states} />

        {/* 로딩 오버레이 - 데이터를 가져오는 중이고 이전 데이터가 있을 때만 표시 */}
        {isFetchingCompensations && isPlaceholderData && (
          <div className="absolute inset-0 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-3 border-violet-500 dark:border-violet-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-600 dark:text-zinc-300">Updating chart...</span>
            </div>
          </div>
        )}
        </div>
      </div>
    </motion.div>
  );
}
