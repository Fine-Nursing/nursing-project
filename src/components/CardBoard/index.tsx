'use client';

import React, { lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter } from 'lucide-react';
import useIsMobile from 'src/hooks/useIsMobile';
import { useTheme } from 'src/contexts/ThemeContext';
import NurseCard from '../card/NurseCard';

// Components
import FilterPanel from './components/FilterPanel';
import NavigationButton from './components/NavigationButton';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';

// Hooks and utils
import { useCardBoard } from './hooks/useCardBoard';
import { getGridColumns } from './utils';
import { containerVariants, cardVariants } from './types';

// Lazy load MobileCardBoard
const MobileCardBoard = lazy(() => import('./MobileCardBoard'));

export default function CardBoard() {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  
  const {
    selectedLevel,
    filters,
    showFilterPanel,
    setShowFilterPanel,
    currentGroupIndex,
    columns,
    currentGroup,
    groupedCards,
    isLoading,
    error,
    isFetching,
    handleCardClick,
    handleBack,
    handleFiltersChange,
    handleLoadMore,
    handlePrevGroup,
    handleNextGroup,
    handleGoToGroup,
    getStatusText,
    getHeaderSubtitle,
    shouldShowLoadMore,
    activeFilterCount,
  } = useCardBoard();

  // Loading and error states
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;

  // Mobile view
  if (isMobile) {
    return (
      <Suspense fallback={<LoadingState />}>
        <MobileCardBoard 
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      </Suspense>
    );
  }

  // Desktop view
  return (
    <div className="w-full">
      {/* Header */}
      <div className="border-b-2 border-zinc-100/30 dark:border-zinc-800/30 p-3 sm:p-6 rounded-t-xl bg-gradient-to-r from-zinc-50/50 to-blue-50/50 dark:from-zinc-950/50 dark:to-black/50 shadow-sm transition-colors">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-zinc-100">
                Compensation Board
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300/70 mt-1">
                {getHeaderSubtitle()}
              </p>
            </div>
            <div className="flex gap-2 relative">
              {selectedLevel && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-3 py-1.5 text-sm font-medium rounded bg-rose-500 dark:bg-rose-600 text-white hover:bg-rose-600 dark:hover:bg-rose-700 transition-colors"
                >
                  ← Back
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-1">
                <Filter size={16} />
                Filter
                {activeFilterCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full dark:border dark:border-emerald-700">
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
        </div>
      </div>

      {/* Main Board */}
      <div className="p-3 sm:p-6 bg-gradient-to-br from-white via-zinc-50/30 to-blue-50/30 dark:from-zinc-950/30 dark:via-zinc-900/40 dark:to-black/30 transition-colors">
        <div
          className="relative rounded-xl bg-gradient-to-br from-white via-zinc-50/30 to-blue-50/40 dark:from-zinc-950/60 dark:via-zinc-900/70 dark:to-black/60 p-4 sm:p-8 overflow-hidden border border-zinc-100/30 dark:border-zinc-800/40 shadow-lg transition-all"
          style={{
            minHeight: '400px',
            backgroundImage: `
              linear-gradient(rgba(52, 211, 153, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(52, 211, 153, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: 'center center',
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none rounded-lg"
            style={{
              background:
                theme === 'dark' ? 'none' : 'linear-gradient(to right, rgba(255,255,255,0.5), transparent)',
              opacity: 0.5,
            }}
          />

          {/* Cards Grid with Navigation */}
          <div className="relative">
            {groupedCards.length > 1 && !selectedLevel && (
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
                    {selectedLevel ? (
                      <NurseCard card={card} />
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleCardClick(card)}
                        className="w-full cursor-pointer focus:outline-none"
                        disabled={!!selectedLevel}
                      >
                        <NurseCard card={card} />
                      </button>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Page Indicators */}
          {groupedCards.length > 1 && !selectedLevel && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {groupedCards.map((_, index) => {
                const isActive = index === currentGroupIndex;
                const buttonClass = `w-2 h-2 rounded-full transition-all ${
                  isActive ? 'w-8 bg-emerald-600 dark:bg-emerald-400' : 'bg-gray-300 dark:bg-zinc-700 hover:bg-gray-400 dark:hover:bg-zinc-600'
                }`;

                return (
                  <button
                    key={`group-indicator-${index}`}
                    type="button"
                    aria-label={`Go to group ${index + 1}`}
                    onClick={() => handleGoToGroup(index)}
                    className={buttonClass}
                  />
                );
              })}
            </div>
          )}

          {isFetching && (
            <div className="absolute top-4 right-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600 dark:border-emerald-400" />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-zinc-100/30 dark:border-zinc-800/30 p-3 sm:p-4 rounded-b-xl bg-gradient-to-r from-zinc-50/30 to-blue-50/30 dark:from-zinc-950/50 dark:to-black/50 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300/80">
          <span>{getStatusText()}</span>
          {shouldShowLoadMore && (
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isFetching}
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors disabled:opacity-50"
            >
              {isFetching ? 'Loading...' : 'Load More'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}