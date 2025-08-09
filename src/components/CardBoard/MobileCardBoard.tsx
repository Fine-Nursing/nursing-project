'use client';

import React, { useState, useMemo } from 'react';
import { Filter, MapPin } from 'lucide-react';
import type { CompensationCard } from 'src/types/dashboard';
import { useCompensationCards, useCompensationCardsByLevel } from 'src/api/dashboard/useCompensationCards';

// Experience level colors and labels - removed as unused

interface MobileCardBoardProps {
  filters: {
    specialty?: string;
    state?: string;
    city?: string;
  };
  onFiltersChange: (filters: any) => void;
}

// Simplified Mobile Compensation Card
function MobileCompensationCard({ card }: { card: CompensationCard }) {
  const getLevelColor = (level: string) => {
    switch(level) {
      case 'senior': return 'text-purple-600 bg-purple-50';
      case 'experienced': return 'text-blue-600 bg-blue-50';
      case 'junior': return 'text-green-600 bg-green-50';
      default: return 'text-amber-600 bg-amber-50';
    }
  };

  const getLevelLabel = (level: string) => {
    switch(level) {
      case 'senior': return 'Sr';
      case 'experienced': return 'Exp';
      case 'junior': return 'Jr';
      default: return 'Entry';
    }
  };
  
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4 hover:shadow-md transition-shadow">
      {/* Top Row - Title and Pay */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {card.specialty}
          </h3>
          <p className="text-sm text-gray-500 dark:text-zinc-500 mt-0.5">
            {card.hospital}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            ${card.totalPay}
          </div>
          <div className="text-xs text-gray-500 dark:text-zinc-500">per hour</div>
        </div>
      </div>

      {/* Middle Row - Key Info */}
      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-zinc-400 mb-2">
        <span className="flex items-center gap-1">
          <MapPin size={12} />
          {card.city}, {card.state}
        </span>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getLevelColor(card.experienceLevel)}`}>
          {getLevelLabel(card.experienceLevel)}
        </span>
        <span className="text-xs">
          {card.yearsOfExperience} yrs
        </span>
      </div>

      {/* Bottom Row - Breakdown */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-zinc-800">
        <span className="text-xs text-gray-500 dark:text-zinc-500">
          Base ${card.basePay} + Diff ${card.differentialPay}
        </span>
        {card.shiftType && (
          <span className="text-xs text-gray-600 dark:text-zinc-400 font-medium">
            {card.shiftType}
          </span>
        )}
      </div>
    </div>
  );
}

// Simplified Filter Tabs
function FilterTabs({ 
  selectedLevel, 
  onLevelChange, 
  experienceSummary 
}: {
  selectedLevel: string | null;
  onLevelChange: (level: string | null) => void;
  experienceSummary: Record<string, number>;
}) {
  const levels = [
    { key: null, label: 'All', count: Object.values(experienceSummary).reduce((a, b) => a + b, 0) },
    { key: 'beginner', label: 'Entry', count: experienceSummary.beginner || 0 },
    { key: 'junior', label: 'Junior', count: experienceSummary.junior || 0 },
    { key: 'experienced', label: 'Exp', count: experienceSummary.experienced || 0 },
    { key: 'senior', label: 'Senior', count: experienceSummary.senior || 0 },
  ].filter(level => level.key === null || level.count > 0);

  return (
    <div className="flex gap-1 overflow-x-auto no-scrollbar mb-4">
      {levels.map((level) => (
        <button
          key={level.key || 'all'}
          type="button"
          onClick={() => onLevelChange(level.key)}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
            selectedLevel === level.key
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' 
              : 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400'
          }`}
        >
          {level.label}
          <span className="ml-1 opacity-70">({level.count})</span>
        </button>
      ))}
    </div>
  );
}

function MobileCardBoard({ filters, onFiltersChange }: MobileCardBoardProps) {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [showAllCards, setShowAllCards] = useState(false);
  
  // Fetch all cards for initial display
  const { data: allCards, isLoading, error } = useCompensationCards(filters);
  
  // Fetch filtered cards when level is selected
  const { data: levelCardsResponse } = useCompensationCardsByLevel(
    {
      experienceLevel: selectedLevel as 'beginner' | 'junior' | 'experienced' | 'senior',
      ...filters,
      page: 1,
      limit: 20,
    },
    { enabled: !!selectedLevel }
  );

  // Process cards based on selection
  const cards = useMemo(() => {
    if (selectedLevel && levelCardsResponse?.data) {
      return levelCardsResponse.data;
    }
    return allCards || [];
  }, [selectedLevel, levelCardsResponse, allCards]);

  // Calculate experience summary
  const experienceSummary = useMemo(() => {
    if (!allCards) return {};
    return allCards.reduce((acc, card) => {
      acc[card.experienceLevel] = (acc[card.experienceLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [allCards]);

  // Show limited cards initially, expand on demand
  const displayCards = showAllCards ? cards : cards.slice(0, 6);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded w-1/3" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-zinc-800 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !cards.length) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 text-center">
        <p className="text-gray-600 dark:text-zinc-400">No compensation data available</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen">
      <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Nurse Salaries
            </h2>
            <p className="text-sm text-gray-500 dark:text-zinc-500 mt-0.5">
              Real compensation data
            </p>
          </div>
          <button
            type="button"
            onClick={() => onFiltersChange(filters)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-800"
          >
            <Filter size={18} className="text-gray-600 dark:text-zinc-400" />
          </button>
        </div>

        {/* Filter Tabs */}
        <FilterTabs
          selectedLevel={selectedLevel}
          onLevelChange={setSelectedLevel}
          experienceSummary={experienceSummary}
        />
      </div>

      {/* Cards List */}
      <div className="p-4 space-y-2">
        {displayCards.map((card) => (
          <MobileCompensationCard 
            key={card.id} 
            card={card} 
          />
        ))}

        {/* Load More */}
        {cards.length > 6 && !showAllCards && (
          <button
            type="button"
            onClick={() => setShowAllCards(true)}
            className="w-full py-3 mt-4 bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 rounded-lg border border-gray-200 dark:border-zinc-800 font-medium"
          >
            View All ({cards.length})
          </button>
        )}
      </div>

      {/* Bottom Stats - Removed fixed positioning to avoid overlap */}
      <div className="bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 px-4 py-3 mt-4">
        <div className="flex items-center justify-center gap-1 text-xs text-gray-600 dark:text-zinc-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span>10,000+ nurses shared data</span>
        </div>
      </div>
    </div>
  );
}

export default MobileCardBoard;