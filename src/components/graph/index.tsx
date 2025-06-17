'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { debounce } from 'lodash';
import { AnimatePresence, motion } from 'framer-motion';
import type { ExperienceGroup } from 'src/types/common';

import {
  useSpecialtyAverageCompensation,
  useSpecialtyList,
} from 'src/api/useSpecialties';
import { findStateByCode, useStates } from 'src/api/useLocations';
import LocationSelector from './LocationSelector';
import FilterSection from './FilterSections';
import Chart from './Chart';

export default function NursingGraph() {
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
  const debouncedAutocomplete = useCallback(
    debounce((value: string) => {
      setAutocompleteSearchTerm(value);
    }, 300),
    []
  );

  // 검색을 위한 디바운스 (500ms)
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
        <div className="p-4 text-center text-gray-500">
          <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      );
    }

    if (!suggestions || suggestions.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
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
            className += ' bg-violet-50 text-violet-700';
          } else {
            className += ' hover:bg-gray-50 text-gray-700';
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
  if (isLoadingStates || (!compensations && isLoadingCompensations)) {
    return (
      <div className="min-h-[800px] w-full bg-white p-8 rounded-xl shadow-md flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[800px] w-full bg-white p-8 rounded-xl shadow-md">
      <div className="space-y-6 mb-8">
        {/* Title */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Nursing Specialties Explorer
          </h2>
          <p className="text-gray-500 mt-2">
            {selectedLocations.length > 0
              ? `Showing specialties in ${selectedLocations.length} selected ${
                  selectedLocations.length === 1 ? 'location' : 'locations'
                }`
              : 'All nursing specialties across locations'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          {/* Search with Autocomplete */}
          <div className="relative w-80">
            <div className="relative">
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
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-violet-500 pl-10"
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
              {/* 검색 로딩 인디케이터 */}
              {searchTerm !== debouncedSearchTerm && (
                <div className="absolute right-3 top-3">
                  <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
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
                  className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-y-auto"
                  role="listbox"
                >
                  {renderSuggestionContent()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
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

        {/* Selected Location Tags */}
        {selectedLocations.length > 0 && states && (
          <div className="flex flex-wrap gap-2">
            {selectedLocations.map((locationCode) => {
              const state = findStateByCode(states, locationCode);
              return (
                <div
                  key={locationCode}
                  className="flex items-center gap-2 px-3 py-1 bg-violet-50 text-violet-700 rounded-full text-sm"
                >
                  <span>{state?.name || locationCode}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLocations((prev) =>
                        prev.filter((code) => code !== locationCode)
                      );
                    }}
                    aria-label={`Remove ${state?.name} filter`}
                    className="cursor-pointer hover:text-violet-900 p-0.5 flex items-center justify-center"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Experience Filter Tags */}
        {selectedExperience.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedExperience.map((exp) => (
              <div
                key={exp}
                className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
              >
                <span>{exp}</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedExperience((prev) =>
                      prev.filter((e) => e !== exp)
                    );
                  }}
                  className="cursor-pointer hover:text-blue-900 p-0.5"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chart Section with Loading Overlay */}
      <div className="relative">
        <Chart data={processedData} states={states} />

        {/* 로딩 오버레이 - 데이터를 가져오는 중이고 이전 데이터가 있을 때만 표시 */}
        {isFetchingCompensations && isPlaceholderData && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-3 border-violet-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-600">Updating chart...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
