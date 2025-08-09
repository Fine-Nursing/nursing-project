'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ChevronRight, Sparkles } from 'lucide-react';
import type { CompensationCard } from 'src/types/dashboard';
import { useCompensationCards, useCompensationCardsByLevel } from 'src/api/dashboard/useCompensationCards';

interface MobileCardBoardProps {
  filters: {
    specialty?: string;
    state?: string;
    city?: string;
  };
  onFiltersChange: (filters: any) => void;
}

// Minimal Metric Card Component - Inspired by Revolut/Robinhood
function MetricCard({ 
  label, 
  value, 
  change, 
  sublabel 
}: { 
  label: string; 
  value: string; 
  change?: number; 
  sublabel?: string;
}) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4">
      <p className="text-xs text-gray-500 dark:text-zinc-500 font-medium uppercase tracking-wider mb-1">
        {label}
      </p>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {value}
          </p>
          {sublabel && (
            <p className="text-xs text-gray-500 dark:text-zinc-500 mt-0.5">
              {sublabel}
            </p>
          )}
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-0.5 ${
            (() => {
              if (change > 0) return 'text-green-600';
              if (change < 0) return 'text-red-600';
              return 'text-gray-500';
            })()
          }`}>
            {(() => {
              if (change > 0) return <TrendingUp size={14} />;
              if (change < 0) return <TrendingDown size={14} />;
              return <Minus size={14} />;
            })()}
            <span className="text-xs font-medium">{Math.abs(change)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Compact List Item - Inspired by LinkedIn/Indeed
function CompensationListItem({ 
  card,
  onClick 
}: { 
  card: CompensationCard;
  onClick?: () => void;
}) {
  const getExpBadgeColor = (level: string) => {
    switch(level) {
      case 'senior': return 'bg-purple-100 text-purple-700';
      case 'experienced': return 'bg-blue-100 text-blue-700';
      case 'junior': return 'bg-green-100 text-green-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full bg-white dark:bg-zinc-900 p-4 border-b border-gray-100 dark:border-zinc-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 text-left">
          {/* Title and Location */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-gray-900 dark:text-white text-sm">
              {card.specialty}
            </h3>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getExpBadgeColor(card.experienceLevel)}`}>
              {card.experienceLevel.toUpperCase()}
            </span>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-zinc-500">
            {card.hospital} • {card.city}, {card.state}
          </p>
          
          {/* Stats Row */}
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-gray-600 dark:text-zinc-400">
              {card.yearsOfExperience} yrs
            </span>
            {card.shiftType && (
              <>
                <span className="text-gray-300 dark:text-zinc-600">•</span>
                <span className="text-xs text-gray-600 dark:text-zinc-400">
                  {card.shiftType}
                </span>
              </>
            )}
            {card.nursingRole && (
              <>
                <span className="text-gray-300 dark:text-zinc-600">•</span>
                <span className="text-xs text-gray-600 dark:text-zinc-400">
                  {card.nursingRole}
                </span>
              </>
            )}
          </div>
        </div>
        
        {/* Salary Display */}
        <div className="text-right flex items-center gap-2">
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              ${card.totalPay}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-zinc-500">
              /hour
            </p>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </div>
      </div>
    </motion.button>
  );
}

// Premium Filter Pills - Inspired by Airbnb
function FilterPills({ 
  selectedLevel, 
  onLevelChange,
  totalCount 
}: {
  selectedLevel: string | null;
  onLevelChange: (level: string | null) => void;
  totalCount: Record<string, number>;
}) {
  const filters = [
    { id: null, label: 'All', icon: '✨' },
    { id: 'beginner', label: 'Entry', icon: '🌱' },
    { id: 'junior', label: 'Junior', icon: '📈' },
    { id: 'experienced', label: 'Mid', icon: '💼' },
    { id: 'senior', label: 'Senior', icon: '👑' },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3">
      {filters.map((filter) => {
        const count = filter.id ? totalCount[filter.id] || 0 : Object.values(totalCount).reduce((a, b) => a + b, 0);
        const isActive = selectedLevel === filter.id;
        
        return (
          <motion.button
            key={filter.id || 'all'}
            whileTap={{ scale: 0.95 }}
            onClick={() => onLevelChange(filter.id)}
            className={`
              relative px-4 py-2 rounded-full text-sm font-medium transition-all
              ${isActive 
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-lg' 
                : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700'
              }
            `}
          >
            <span className="flex items-center gap-1.5">
              <span className="text-xs">{filter.icon}</span>
              {filter.label}
              {count > 0 && (
                <span className={`text-xs ${isActive ? 'opacity-70' : 'opacity-50'}`}>
                  {count}
                </span>
              )}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

export default function MobileCardBoardV2({ filters }: MobileCardBoardProps) {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<CompensationCard | null>(null);
  
  // Fetch data
  const { data: allCards, isLoading, error } = useCompensationCards(filters);
  
  const { data: levelCardsResponse } = useCompensationCardsByLevel(
    {
      experienceLevel: selectedLevel as 'beginner' | 'junior' | 'experienced' | 'senior',
      ...filters,
      page: 1,
      limit: 50,
    },
    { enabled: !!selectedLevel }
  );

  // Process cards
  const cards = useMemo(() => {
    if (selectedLevel && levelCardsResponse?.data) {
      return levelCardsResponse.data;
    }
    return allCards || [];
  }, [selectedLevel, levelCardsResponse, allCards]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!cards.length) return null;
    
    const avgPay = Math.round(cards.reduce((sum, card) => sum + card.totalPay, 0) / cards.length);
    const maxPay = Math.max(...cards.map(c => c.totalPay));
    const minPay = Math.min(...cards.map(c => c.totalPay));
    
    return { avgPay, maxPay, minPay };
  }, [cards]);

  // Experience summary
  const experienceSummary = useMemo(() => {
    if (!allCards) return {};
    return allCards.reduce((acc, card) => {
      acc[card.experienceLevel] = (acc[card.experienceLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [allCards]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black p-4">
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-white dark:bg-zinc-900 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !cards.length) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-gray-300 dark:text-zinc-700 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-zinc-400">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header Section */}
      <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            Compensation Data
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-500">
            Real salaries from {cards.length} nurses
          </p>
        </div>
        
        {/* Key Metrics */}
        {stats && (
          <div className="grid grid-cols-3 gap-2 px-4 pb-4">
            <MetricCard 
              label="Average" 
              value={`$${stats.avgPay}`}
              sublabel="per hour"
            />
            <MetricCard 
              label="Highest" 
              value={`$${stats.maxPay}`}
              change={12}
              sublabel="per hour"
            />
            <MetricCard 
              label="Entry" 
              value={`$${stats.minPay}`}
              change={-5}
              sublabel="per hour"
            />
          </div>
        )}
        
        {/* Filter Pills */}
        <div className="px-4 pb-2">
          <FilterPills
            selectedLevel={selectedLevel}
            onLevelChange={setSelectedLevel}
            totalCount={experienceSummary}
          />
        </div>
      </div>

      {/* List Section */}
      <div className="bg-white dark:bg-zinc-900 mt-2 rounded-t-2xl min-h-screen">
        <AnimatePresence mode="popLayout">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.02 }}
            >
              <CompensationListItem 
                card={card}
                onClick={() => setSelectedCard(card)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white dark:bg-zinc-900 rounded-t-3xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-gray-300 dark:bg-zinc-700 rounded-full mx-auto mt-3 mb-4" />
              
              <div className="px-6 pb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedCard.specialty}
                </h2>
                <p className="text-sm text-gray-600 dark:text-zinc-400 mb-6">
                  {selectedCard.hospital} • {selectedCard.city}, {selectedCard.state}
                </p>
                
                {/* Salary Breakdown */}
                <div className="bg-gray-50 dark:bg-zinc-800 rounded-2xl p-4 mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-600 dark:text-zinc-400">Total Compensation</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${selectedCard.totalPay}/hr
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-zinc-400">Base Pay</span>
                      <span className="font-medium text-gray-900 dark:text-white">${selectedCard.basePay}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-zinc-400">Differential</span>
                      <span className="font-medium text-gray-900 dark:text-white">${selectedCard.differentialPay}</span>
                    </div>
                  </div>
                </div>
                
                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-zinc-500 mb-1">Experience Level</p>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                      {selectedCard.experienceLevel}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-zinc-500 mb-1">Years of Experience</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedCard.yearsOfExperience} years
                    </p>
                  </div>
                  {selectedCard.shiftType && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-zinc-500 mb-1">Shift Type</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedCard.shiftType}
                      </p>
                    </div>
                  )}
                  {selectedCard.nursingRole && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-zinc-500 mb-1">Role</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedCard.nursingRole}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Culture Score */}
                {selectedCard.unitCulture && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-zinc-800">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-zinc-400">Unit Culture Score</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 dark:bg-zinc-700 rounded-full">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                            style={{ width: `${(selectedCard.unitCulture / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {selectedCard.unitCulture}/10
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}