'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Filter, MapPin, DollarSign, Users } from 'lucide-react';
import type { CompensationCard } from 'src/types/dashboard';
import { useCompensationCards } from 'src/api/dashboard/useCompensationCards';

interface MobileCardBoardProps {
  filters: {
    specialty?: string;
    state?: string;
    city?: string;
  };
  onFiltersChange: (filters: any) => void;
}

function MobileCompensationCard({ card }: { card: CompensationCard }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{card.specialty}</h3>
          <p className="text-sm text-gray-600">{card.hospital}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          card.experienceLevel === 'senior' ? 'bg-purple-100 text-purple-700' :
          card.experienceLevel === 'experienced' ? 'bg-blue-100 text-blue-700' :
          card.experienceLevel === 'junior' ? 'bg-green-100 text-green-700' :
          'bg-yellow-100 text-yellow-700'
        }`}>
          {card.experienceLevel}
        </span>
      </div>

      {/* Main Info */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-gray-700">
          <MapPin size={16} className="mr-2 text-gray-400" />
          <span className="text-sm">{card.city}, {card.state}</span>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Compensation</span>
            <DollarSign size={16} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">${card.totalPay}/hr</p>
          <div className="mt-2 text-xs text-gray-600">
            Base: ${card.basePay} + Diff: ${card.differentialPay}
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Role:</span>
          <span className="font-medium">{card.nursingRole}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Experience:</span>
          <span className="font-medium">{card.yearsOfExperience} years</span>
        </div>
        {card.shiftType && (
          <div className="flex justify-between">
            <span className="text-gray-600">Shift:</span>
            <span className="font-medium">{card.shiftType}</span>
          </div>
        )}
      </div>

      {/* Culture Rating */}
      {card.unitCulture && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Unit Culture</span>
            <div className="flex items-center">
              <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                <div 
                  className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"
                  style={{ width: `${(card.unitCulture / 10) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium">{card.unitCulture}/10</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileCardBoard({ filters, onFiltersChange }: MobileCardBoardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const { data: allCards, isLoading, error } = useCompensationCards(filters);

  const cards = allCards || [];
  const currentCard = cards[currentIndex];

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Experience level summary
  const experienceSummary = cards.reduce((acc, card) => {
    acc[card.experienceLevel] = (acc[card.experienceLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  if (error || !cards.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No compensation data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Compensation Board</h2>
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm text-gray-600">
            {currentIndex + 1} of {cards.length} positions
          </p>
          <button
            type="button"
            onClick={() => onFiltersChange(filters)}
            className="flex items-center gap-1 text-sm text-purple-600"
          >
            <Filter size={14} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Experience Level Pills */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedLevel(null)}
          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
            !selectedLevel ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          All ({cards.length})
        </button>
        {Object.entries(experienceSummary).map(([level, count]) => (
          <button
            key={level}
            onClick={() => setSelectedLevel(level)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
              selectedLevel === level ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {level} ({count})
          </button>
        ))}
      </div>

      {/* Card Stack */}
      <div className="relative h-[400px] mb-4">
        <AnimatePresence mode="wait">
          {currentCard && (
            <motion.div
              key={currentIndex}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute inset-0"
            >
              <MobileCompensationCard card={currentCard} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`p-2 rounded-lg ${
            currentIndex === 0 
              ? 'bg-gray-100 text-gray-400' 
              : 'bg-purple-100 text-purple-600 active:bg-purple-200'
          }`}
        >
          <ChevronLeft size={20} />
        </button>

        {/* Progress Dots */}
        <div className="flex gap-1">
          {Array.from({ length: Math.min(5, cards.length) }).map((_, i) => {
            const dotIndex = Math.max(0, Math.min(currentIndex - 2, cards.length - 5)) + i;
            return (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  dotIndex === currentIndex ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              />
            );
          })}
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          className={`p-2 rounded-lg ${
            currentIndex === cards.length - 1 
              ? 'bg-gray-100 text-gray-400' 
              : 'bg-purple-100 text-purple-600 active:bg-purple-200'
          }`}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Live Badge */}
      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-600">
        <Users size={14} />
        <span>10,000+ nurses have shared their data</span>
        <span className="flex items-center gap-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600" />
          </span>
          <span className="text-purple-600 font-medium">Live</span>
        </span>
      </div>
    </div>
  );
}

export default MobileCardBoard;