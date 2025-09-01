'use client';

import React, { lazy, Suspense } from 'react';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import { Filter } from 'lucide-react';
import useIsMobile from 'src/hooks/useIsMobile';
import { useTheme } from 'src/contexts/ThemeContext';
import NurseCard from '../card/NurseCard';

// Components
import FilterPanel from './components/FilterPanel';
import NavigationButton from './components/NavigationButton';
import { LoadingState, ErrorState } from '../feedback';

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
    displayCards,
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
  if (isLoading) return <LoadingState size="lg" text="Loading compensation data..." fullHeight />;
  if (error) return <ErrorState message="Failed to load compensation data" onRetry={() => window.location.reload()} fullHeight />;

  // Mobile view
  if (isMobile) {
    return (
      <Suspense fallback={<LoadingState size="lg" text="Loading..." fullHeight />}>
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
      <div className="border-b-2 border-zinc-100/30 dark:border-zinc-800/30 p-3 sm:p-6 rounded-t-xl bg-gradient-to-r from-blue-50/50 to-sky-50/50 dark:from-zinc-950/50 dark:to-black/50 shadow-sm transition-colors">
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
                className="inline-flex items-center px-3 py-2 border border-emerald-200 rounded-xl shadow-sm text-sm font-medium text-emerald-700 bg-white/80 backdrop-blur-sm hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200">
                <Filter className="w-4 h-4 mr-2" />
                Filter
                {activeFilterCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-full">
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
      <div 
        className="relative p-4 sm:p-8 bg-gradient-to-br from-white/80 via-emerald-50/20 to-blue-50/30 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-950/90 border-x border-gray-100 dark:border-zinc-800 transition-colors overflow-hidden"
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

          {/* Cards Grid with Horizontal Scroll for selected level */}
          <div className="relative">
            {selectedLevel ? (
              // Horizontal scroll container when a level is selected
              <div 
                className="overflow-x-auto overflow-y-visible py-4 -mx-4 px-4 cursor-grab active:cursor-grabbing select-none"
                style={{ 
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#10b981 transparent'
                }}
                onMouseDown={(e) => {
                  const slider = e.currentTarget;
                  let isDown = true;
                  const startX = e.pageX - slider.offsetLeft;
                  const {scrollLeft} = slider;
                  
                  const handleMouseMove = (e: MouseEvent) => {
                    if (!isDown) return;
                    e.preventDefault();
                    const x = e.pageX - slider.offsetLeft;
                    const walk = (x - startX) * 2; // Scroll speed
                    slider.scrollLeft = scrollLeft - walk;
                  };
                  
                  const handleMouseUp = () => {
                    isDown = false;
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };
                  
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              >
                <div className="flex gap-4 pb-2">
                  {displayCards.map((card, index) => (
                    <m.div
                      key={card.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex-shrink-0"
                      style={{ width: '260px' }}
                    >
                      <div className="h-full">
                        <NurseCard card={card} />
                      </div>
                    </m.div>
                  ))}
                </div>
              </div>
            ) : (
              // Original grid layout for level selection
              <>
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

                <AnimatePresence mode="wait">
                  <m.div
                    key={`all-${currentGroupIndex}`}
                    variants={containerVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className={`grid grid-cols-1 ${getGridColumns(columns)} gap-4 w-full`}
                  >
                    {currentGroup.map((card, index) => (
                      <m.div
                        key={`${card.id}-${currentGroupIndex}`}
                        variants={cardVariants}
                        custom={index}
                        className="w-full"
                      >
                        <button
                          type="button"
                          onClick={() => handleCardClick(card)}
                          className="w-full cursor-pointer focus:outline-none"
                        >
                          <NurseCard card={card} />
                        </button>
                      </m.div>
                    ))}
                  </m.div>
                </AnimatePresence>
              </>
            )}
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

      {/* Footer */}
      <div className="border-t-2 border-zinc-100/30 dark:border-zinc-800/30 p-3 sm:p-4 rounded-b-xl bg-gradient-to-r from-blue-50/30 to-sky-50/30 dark:from-zinc-950/50 dark:to-black/50 shadow-sm transition-colors">
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