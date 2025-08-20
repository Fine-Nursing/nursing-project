import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  useCompensationCards,
  useCompensationCardsByLevel,
} from 'src/api/dashboard/useCompensationCards';
import type { CompensationCard } from 'src/types/dashboard';
import { getResponsiveColumns } from '../utils';
import type { FilterState } from '../types';

export function useCardBoard() {
  // States
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [page, setPage] = useState(1);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [columns, setColumns] = useState(getResponsiveColumns());

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

  // Data processing
  const levelCards = useMemo(() => 
    levelCardsResponse?.data || [], 
    [levelCardsResponse?.data]
  );
  const totalCount = levelCardsResponse?.total || 0;
  
  const displayCards = useMemo(() => 
    selectedLevel ? levelCards : allCards || [], 
    [selectedLevel, levelCards, allCards]
  );

  // Group cards by responsive columns
  const groupedCards = useMemo(() => {
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

  const handleGoToGroup = useCallback((index: number) => {
    setCurrentGroupIndex(index);
  }, []);

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

  // Helper functions
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

  const getHeaderSubtitle = () => {
    if (selectedLevel) {
      return `Showing ${selectedLevel} level positions`;
    }
    return 'Recently posted compensations';
  };

  const shouldShowLoadMore =
    selectedLevel &&
    levelCards.length >= 20 &&
    totalCount > displayCards.length;

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return {
    // States
    selectedLevel,
    filters,
    showFilterPanel,
    setShowFilterPanel,
    currentGroupIndex,
    columns,
    
    // Data
    allCards,
    levelCards,
    displayCards,
    groupedCards,
    currentGroup,
    totalCount,
    
    // Loading states
    isLoading,
    error,
    isFetching,
    
    // Handlers
    handleCardClick,
    handleBack,
    handleFiltersChange,
    handleLoadMore,
    handlePrevGroup,
    handleNextGroup,
    handleGoToGroup,
    
    // Helpers
    getStatusText,
    getHeaderSubtitle,
    shouldShowLoadMore,
    activeFilterCount,
  };
}