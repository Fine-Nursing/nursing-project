'use client';

import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import type { Variants } from 'framer-motion';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Filter, X } from 'lucide-react';
import useIsMobile from 'src/hooks/useIsMobile';

import {
  useCompensationCards,
  useCompensationCardsByLevel,
} from 'src/api/dashboard/useCompensationCards';
import type { CompensationCard } from 'src/types/dashboard';
import { useSpecialtyList } from 'src/api/useSpecialties';
import NurseCard from './card/NurseCard';

// Lazy load MobileCardBoard to avoid SSR issues
const MobileCardBoard = lazy(() => import('./CardBoard/MobileCardBoard'));

function getGridColumns(columns: number): string {
  if (columns === 2) return 'sm:grid-cols-2';
  if (columns === 4) return 'sm:grid-cols-2 lg:grid-cols-4';
  return '';
}

// State mapping constant
const STATE_MAPPING = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
  DC: 'Washington D.C.',
};

// AnimatedCounter Component
function AnimatedCounter({ baseValue }: { baseValue: number }) {
  const [count, setCount] = useState<number>(baseValue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    const randomIncrease = (): number => Math.floor(Math.random() * 3) + 1;
    const getRandomInterval = (): number =>
      Math.floor(Math.random() * 3000) + 2000;

    const updateCount = () => {
      if (!isMountedRef.current) return;
      
      setCount((prev) => prev + randomIncrease());
      timeoutRef.current = setTimeout(updateCount, getRandomInterval());
    };
    
    timeoutRef.current = setTimeout(updateCount, getRandomInterval());
    
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return <span>{count.toLocaleString()}+</span>;
}

// Filter Types
interface FilterState {
  specialty?: string;
  state?: string;
  city?: string;
}

// Filter Panel Component
function FilterPanel({
  filters,
  onFiltersChange,
  onClose,
}: {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClose: () => void;
}) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  // API에서 specialty 목록 가져오기
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
    <div className="absolute right-0 top-12 z-10 w-72 sm:w-80 bg-white rounded-lg shadow-lg border border-slate-200 p-3 sm:p-4 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-slate-800">Filters</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="filter-specialty"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Specialty
          </label>
          <select
            id="filter-specialty"
            value={localFilters.specialty || ''}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, specialty: e.target.value })
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
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
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            State
          </label>
          <select
            id="filter-state"
            value={localFilters.state || ''}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, state: e.target.value })
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
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
            className="block text-sm font-medium text-slate-700 mb-1"
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
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., Los Angeles"
          />
        </div>
      </div>

      <div className="flex gap-2 mt-6">
        <button
          type="button"
          onClick={handleReset}
          className="flex-1 px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={handleApply}
          className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
}

// Loading Component
function LoadingState() {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
        <p className="mt-4 text-slate-600">Loading compensation data...</p>
      </div>
    </div>
  );
}

// Error Component
function ErrorState() {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <p className="text-red-600">Failed to load compensation data</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-2 text-purple-600 hover:text-purple-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

// Navigation Button Component
function NavigationButton({
  direction,
  onClick,
  disabled,
}: {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled: boolean;
}) {
  const isPrev = direction === 'prev';
  const position = isPrev ? 'left-4' : 'right-4';
  const pathD = isPrev ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7';
  const label = isPrev ? 'Previous group' : 'Next group';

  const buttonClass = `absolute ${position} top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all ${
    disabled
      ? 'opacity-50 cursor-not-allowed'
      : 'hover:shadow-xl hover:scale-110'
  }`;

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={buttonClass}
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={pathD}
        />
      </svg>
    </button>
  );
}

// Main CardBoard Component
function CardBoard() {
  // States
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [page, setPage] = useState(1);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  
  // Check if mobile
  const isMobile = useIsMobile();

  // API Calls
  const {
    data: allCards,
    isLoading,
    error,
  } = useCompensationCards({
    ...filters,
  });

  const { data: levelCardsResponse, isFetching } = useCompensationCardsByLevel(
    {
      experienceLevel: selectedLevel as
        | 'beginner'
        | 'junior'
        | 'experienced'
        | 'senior',
      ...filters,
      page,
      limit: 20,
    },
    { enabled: !!selectedLevel }
  );

  // Responsive columns calculation
  const getResponsiveColumns = () => {
    if (typeof window === 'undefined') return 4;
    if (window.innerWidth < 640) return 1; // mobile
    if (window.innerWidth < 1024) return 2; // tablet
    return 4; // desktop
  };

  const [columns, setColumns] = useState(getResponsiveColumns());

  // Data processing - Memoized to prevent dependency warnings
  const levelCards = React.useMemo(() => 
    levelCardsResponse?.data || [], 
    [levelCardsResponse?.data]
  );
  const totalCount = levelCardsResponse?.total || 0;
  
  // Memoize displayCards to prevent dependency warnings
  const displayCards = React.useMemo(() => 
    selectedLevel ? levelCards : allCards || [], 
    [selectedLevel, levelCards, allCards]
  );

  // Group cards by responsive columns - Memoized
  const groupedCards = React.useMemo(() => {
    const groups: CompensationCard[][] = [];
    for (let i = 0; i < displayCards.length; i += columns) {
      groups.push(displayCards.slice(i, i + columns));
    }
    return groups;
  }, [displayCards, columns]);

  const currentGroup = groupedCards[currentGroupIndex] || [];

  // Handlers
  const handleCardClick = useCallback((card: CompensationCard) => {
    if (!selectedLevel) {
      setSelectedLevel(card.experienceLevel);
      setPage(1);
      setCurrentGroupIndex(0);
    }
  }, [selectedLevel]);

  const handleBack = useCallback(() => {
    setSelectedLevel(null);
    setPage(1);
    setCurrentGroupIndex(0);
  }, []);

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
    setCurrentGroupIndex(0);
  }, []);

  const handleLoadMore = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const handlePrevGroup = useCallback(() => {
    setCurrentGroupIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNextGroup = useCallback(() => {
    setCurrentGroupIndex((prev) => Math.min(groupedCards.length - 1, prev + 1));
  }, [groupedCards.length]);

  // Effects
  useEffect(() => {
    setCurrentGroupIndex(0);
  }, [selectedLevel, filters]);
  
  useEffect(() => {
    const handleResize = () => {
      setColumns(getResponsiveColumns());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation variants
  const containerVariants: Variants = {
    initial: { opacity: 0, x: 20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        when: 'beforeChildren',
      },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2,
        staggerChildren: 0.1,
        staggerDirection: -1,
      },
    },
  };

  const cardVariants: Variants = {
    initial: () => ({
      opacity: 0,
      scale: 0.8,
    }),
    animate: () => ({
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 25 },
    }),
    exit: () => ({
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3 },
    }),
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  // Helper function for status text
  const getStatusText = () => {
    if (!selectedLevel) {
      return 'Showing 4 experience levels';
    }

    const showingCount = Math.min(columns, currentGroup.length);
    const totalItems = displayCards.length;
    let text = `Showing ${showingCount} of ${totalItems} positions`;

    if (groupedCards.length > 1) {
      text += ` (Page ${currentGroupIndex + 1}/${groupedCards.length})`;
    }

    return text;
  };

  // Helper function for header subtitle
  const getHeaderSubtitle = () => {
    if (selectedLevel) {
      return `Showing ${selectedLevel} level positions`;
    }
    return 'Recently posted compensations';
  };

  // Helper function for load more button text
  const getLoadMoreButtonText = () => {
    if (isFetching) {
      return 'Loading...';
    }
    return 'Load More';
  };

  // Check if should show load more button
  const shouldShowLoadMore =
    selectedLevel &&
    levelCards.length >= 20 &&
    totalCount > displayCards.length;

  // Render board content
  const renderBoardContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (error) {
      return <ErrorState />;
    }

    return (
      <>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedLevel || 'all'}-${currentGroupIndex}`}
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`grid grid-cols-1 ${getGridColumns(columns)} gap-4 w-full`}
          >
            {currentGroup.map((card, index) => (
              <motion.div
                key={`${card.id}-${currentGroupIndex}`}
                variants={cardVariants}
                custom={index}
                className="w-full"
              >
                <button
                  type="button"
                  onClick={() => handleCardClick(card)}
                  className="w-full cursor-pointer focus:outline-none"
                  disabled={!!selectedLevel}
                >
                  <NurseCard card={card} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {groupedCards.length > 1 && (
          <>
            <NavigationButton
              direction="prev"
              onClick={handlePrevGroup}
              disabled={currentGroupIndex === 0}
            />
            <NavigationButton
              direction="next"
              onClick={handleNextGroup}
              disabled={currentGroupIndex === groupedCards.length - 1}
            />
          </>
        )}

        {/* Page Indicators */}
        {groupedCards.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {groupedCards.map((group, index) => {
              const groupId = `group-${selectedLevel || 'all'}-${index}`;
              const isActive = index === currentGroupIndex;
              const buttonClass = `w-2 h-2 rounded-full transition-all ${
                isActive ? 'w-8 bg-purple-600' : 'bg-gray-300 hover:bg-gray-400'
              }`;

              return (
                <button
                  key={groupId}
                  type="button"
                  aria-label={`Go to group ${index + 1}`}
                  onClick={() => setCurrentGroupIndex(index)}
                  className={buttonClass}
                />
              );
            })}
          </div>
        )}
      </>
    );
  };

  // Return mobile version if on mobile device
  if (isMobile) {
    return (
      <Suspense fallback={
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
          </div>
        </div>
      }>
        <MobileCardBoard 
          filters={filters}
          onFiltersChange={setFilters}
        />
      </Suspense>
    );
  }

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 p-3 sm:p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
                Compensation Board
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {getHeaderSubtitle()}
              </p>
            </div>
            <div className="flex gap-2 relative">
              {selectedLevel && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-3 py-1.5 text-sm font-medium rounded bg-rose-500 text-white hover:bg-rose-600 transition-colors"
                >
                  ← Back
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1"
              >
                <Filter size={16} />
                Filter
                {activeFilterCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {showFilterPanel && (
                <FilterPanel
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClose={() => setShowFilterPanel(false)}
                />
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2 sm:space-x-2 bg-slate-50 p-2 sm:p-3 rounded-lg border border-slate-100">
            <div className="flex items-center space-x-2 text-purple-600">
              <Users size={16} className="sm:w-5 sm:h-5 animate-pulse" />
              <span className="text-base sm:text-lg font-semibold">
                <AnimatedCounter baseValue={10000} />
              </span>
            </div>
            <span className="text-xs sm:text-sm text-slate-600">
              verified nurses have shared their data
            </span>
            <div className="flex items-center gap-1">
              <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-purple-600" />
              </span>
              <span className="text-xs text-purple-600 font-medium ml-1 bg-purple-50 px-2 py-0.5 rounded-full">
                Live
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Board */}
      <div className="p-3 sm:p-6">
        <div
          className="relative rounded-lg bg-slate-50 p-4 sm:p-8 overflow-hidden"
          style={{
            minHeight: '400px',
            backgroundImage: `
              linear-gradient(rgba(0, 0, 0, 0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 0, 0, 0.025) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: 'center center',
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none rounded-lg"
            style={{
              background:
                'linear-gradient(to right, rgba(255,255,255,0.5), transparent)',
              opacity: 0.5,
            }}
          />

          {renderBoardContent()}

          {isFetching && (
            <div className="absolute top-4 right-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600" />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs sm:text-sm text-slate-600">
          <span>{getStatusText()}</span>
          {shouldShowLoadMore && (
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isFetching}
              className="text-purple-600 hover:text-purple-700 font-medium transition-colors disabled:opacity-50"
            >
              {getLoadMoreButtonText()}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(CardBoard);
