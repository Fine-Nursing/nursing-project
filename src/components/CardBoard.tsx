'use client';

import React, { useState, useEffect } from 'react';
import type { Variants } from 'framer-motion';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Filter, X } from 'lucide-react';

import {
  useCompensationCards,
  useCompensationCardsByLevel,
} from 'src/api/dashboard/useCompensationCards';
import type { CompensationCard } from 'src/types/dashboard';
import NurseCard from './card/NurseCard';

// AnimatedCounter Component
function AnimatedCounter({ baseValue }: { baseValue: number }) {
  const [count, setCount] = useState<number>(baseValue);

  useEffect(() => {
    const randomIncrease = (): number => Math.floor(Math.random() * 3) + 1;
    const getRandomInterval = (): number =>
      Math.floor(Math.random() * 3000) + 2000;

    let timeout: NodeJS.Timeout;
    const updateCount = () => {
      setCount((prev) => prev + randomIncrease());
      timeout = setTimeout(updateCount, getRandomInterval());
    };
    timeout = setTimeout(updateCount, getRandomInterval());
    return () => clearTimeout(timeout);
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

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleReset = () => {
    setLocalFilters({});
    onFiltersChange({});
  };

  return (
    <div className="absolute right-0 top-12 z-10 w-80 bg-white rounded-lg shadow-lg border border-slate-200 p-4">
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
          <input
            id="filter-specialty"
            type="text"
            value={localFilters.specialty || ''}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, specialty: e.target.value })
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., Critical Care"
          />
        </div>

        <div>
          <label
            htmlFor="filter-state"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            State
          </label>
          <input
            id="filter-state"
            type="text"
            value={localFilters.state || ''}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, state: e.target.value })
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., NY"
          />
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
            placeholder="e.g., Manhattan"
          />
        </div>
      </div>

      <div className="flex gap-2 mt-6">
        <button
          type="button"
          onClick={handleReset}
          className="flex-1 px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={handleApply}
          className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          Apply
        </button>
      </div>
    </div>
  );
}

// Main CardBoard Component
export default function CardBoard() {
  // States
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [page, setPage] = useState(1);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);

  // API Calls - 타입 수정
  const {
    data: allCards,
    isLoading,
    error,
  } = useCompensationCards({
    ...filters,
    page: 1,
    limit: 4,
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

  // Data processing - 타입에 맞게 수정
  const levelCards = levelCardsResponse?.data || [];
  const totalCount = levelCardsResponse?.total || 0;
  const displayCards = selectedLevel ? levelCards : allCards || [];

  // Group cards by 4
  const groupedCards = [];
  for (let i = 0; i < displayCards.length; i += 4) {
    groupedCards.push(displayCards.slice(i, i + 4));
  }

  const currentGroup = groupedCards[currentGroupIndex] || [];

  // Handlers
  const handleCardClick = (card: CompensationCard) => {
    if (!selectedLevel) {
      setSelectedLevel(card.experienceLevel);
      setPage(1);
    }
  };

  const handleBack = () => {
    setSelectedLevel(null);
    setPage(1);
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handlePrevGroup = () => {
    setCurrentGroupIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextGroup = () => {
    setCurrentGroupIndex((prev) => Math.min(groupedCards.length - 1, prev + 1));
  };

  // Effects
  useEffect(() => {
    setCurrentGroupIndex(0);
  }, [selectedLevel]);

  // Layout calculations
  const colWidth = 280;
  const rowHeight = 460;
  const boardHeight = rowHeight;

  function getGridPosition(index: number) {
    const col = index % 4;
    return {
      x: col * colWidth,
      y: 0,
    };
  }

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
      rotateZ: -10,
      x: 0,
      y: 0,
    }),
    animate: (index: number) => {
      const { x, y } = getGridPosition(index);
      return {
        opacity: 1,
        scale: 1,
        rotateZ: 0,
        x,
        y,
        transition: { type: 'spring', stiffness: 300, damping: 25 },
      };
    },
    exit: () => ({
      opacity: 0,
      scale: 0.8,
      rotateZ: 10,
      x: 0,
      y: 0,
      transition: { duration: 0.3 },
    }),
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                Compensation Board
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                {selectedLevel
                  ? `Showing ${selectedLevel} level positions`
                  : 'Recently posted compensations'}
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
          <div className="flex items-center justify-start space-x-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div className="flex items-center space-x-2 text-purple-600">
              <Users size={20} className="animate-pulse" />
              <span className="text-lg font-semibold">
                <AnimatedCounter baseValue={10000} />
              </span>
            </div>
            <span className="text-sm text-slate-600">
              verified nurses have shared their data
            </span>
            <div className="flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600" />
              </span>
              <span className="text-xs text-purple-600 font-medium ml-1 bg-purple-50 px-2 py-0.5 rounded-full">
                Live
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Board */}
      <div className="p-6">
        <div
          className="relative rounded-lg bg-slate-50 p-8 overflow-hidden"
          style={{
            minHeight: boardHeight,
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

          {/* eslint-disable-next-line no-nested-ternary */}
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
                <p className="mt-4 text-slate-600">
                  Loading compensation data...
                </p>
              </div>
            </div>
          ) : error ? (
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
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedLevel || 'all'}-${currentGroupIndex}`}
                  variants={containerVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="relative w-full h-full"
                >
                  {currentGroup.map((card, index) => (
                    <motion.div
                      key={card.id}
                      variants={cardVariants}
                      custom={index}
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '260px',
                        height: '420px',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleCardClick(card)}
                        className="w-full h-full cursor-pointer focus:outline-none"
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
                  <button
                    type="button"
                    aria-label="Previous group"
                    onClick={handlePrevGroup}
                    disabled={currentGroupIndex === 0}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all ${
                      currentGroupIndex === 0
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:shadow-xl hover:scale-110'
                    }`}
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
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    aria-label="Next group"
                    onClick={handleNextGroup}
                    disabled={currentGroupIndex === groupedCards.length - 1}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all ${
                      currentGroupIndex === groupedCards.length - 1
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:shadow-xl hover:scale-110'
                    }`}
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}

              {/* Page Indicators */}
              {groupedCards.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {/* eslint-disable-next-line react/no-array-index-key */}
                  {groupedCards.map((_, index) => (
                    <button
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      type="button"
                      aria-label={`Go to group ${index + 1}`}
                      onClick={() => setCurrentGroupIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentGroupIndex
                          ? 'w-8 bg-purple-600'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {isFetching && (
            <div className="absolute top-4 right-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600" />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 p-4">
        <div className="flex justify-between items-center text-sm text-slate-600">
          <span>
            {selectedLevel ? (
              <>
                Showing {Math.min(4, currentGroup.length)} of{' '}
                {displayCards.length} positions
                {groupedCards.length > 1 &&
                  ` (Page ${currentGroupIndex + 1}/${groupedCards.length})`}
              </>
            ) : (
              'Showing 4 experience levels'
            )}
          </span>
          {selectedLevel &&
            levelCards.length >= 20 &&
            totalCount > displayCards.length && (
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isFetching}
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors disabled:opacity-50"
              >
                {isFetching ? 'Loading...' : 'Load More'}
              </button>
            )}
        </div>
      </div>
    </div>
  );
}
