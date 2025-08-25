'use client';

import React, { useState, useMemo } from 'react';
import { m } from 'framer-motion';
import { useCompensationCards, useCompensationCardsByLevel } from 'src/api/dashboard/useCompensationCards';
import { MetricCard } from './components/MetricCard';
import { CompensationCardItem } from './components/CompensationCardItem';
import type { MobileCardBoardProps, ExperienceLevel } from './types';

const experienceLevels: ExperienceLevel[] = ['beginner', 'junior', 'experienced', 'senior'];

export default function MobileCardBoard({ filters }: MobileCardBoardProps) {
  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel>('experienced');
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  // Fetch overview data
  const { data: overviewData } = useCompensationCards(filters);

  // Fetch level-specific data with pagination
  const { data: levelData, isLoading, isFetching } = useCompensationCardsByLevel({
    experienceLevel: selectedLevel,
    ...filters,
    page,
    limit: 10,
  });

  // Calculate metrics from overview data
  const metrics = useMemo(() => {
    if (!overviewData || overviewData.length === 0) {
      return {
        avgHourly: 0,
        avgAnnual: 0,
        medianHourly: 0,
        topPercentile: 0,
      };
    }

    const hourlyRates = overviewData.map(card => card.totalPay).sort((a, b) => a - b);
    const avgHourly = hourlyRates.reduce((a, b) => a + b, 0) / hourlyRates.length;
    const avgAnnual = avgHourly * 2080;
    const medianHourly = hourlyRates[Math.floor(hourlyRates.length / 2)];
    const topPercentile = hourlyRates[Math.floor(hourlyRates.length * 0.9)];

    return {
      avgHourly: Math.round(avgHourly),
      avgAnnual: Math.round(avgAnnual / 1000),
      medianHourly: Math.round(medianHourly),
      topPercentile: Math.round(topPercentile),
    };
  }, [overviewData]);

  const handleCardToggle = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  const handleLevelChange = (level: ExperienceLevel) => {
    setSelectedLevel(level);
    setPage(1);
    setExpandedCard(null);
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">
      {/* Header Metrics */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200 dark:border-zinc-800">
        <div className="p-4">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Compensation Overview
          </h1>
          
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Average"
              value={`$${metrics.avgHourly}`}
              sublabel="per hour"
              change={3.2}
            />
            <MetricCard
              label="Annual"
              value={`$${metrics.avgAnnual}k`}
              sublabel="average"
              change={-1.5}
            />
            <MetricCard
              label="Median"
              value={`$${metrics.medianHourly}`}
              sublabel="per hour"
            />
            <MetricCard
              label="Top 10%"
              value={`$${metrics.topPercentile}`}
              sublabel="per hour"
              change={5.8}
            />
          </div>
        </div>
      </div>

      {/* Experience Level Tabs */}
      <div className="sticky top-[220px] z-10 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
        <div className="p-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {experienceLevels.map(level => (
              <button
                key={level}
                type="button"
                onClick={() => handleLevelChange(level)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedLevel === level
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Compensation Cards */}
      <div className="p-4 space-y-3">
        {levelData?.data?.map((card, index) => (
          <CompensationCardItem
            key={card.id}
            card={card}
            index={index}
            isExpanded={expandedCard === index}
            onToggle={() => handleCardToggle(index)}
          />
        ))}
        
        {/* Loading State */}
        {(isLoading || isFetching) && (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        {/* Load More Button */}
        {levelData && levelData.total > levelData.data.length && !isFetching && (
          <m.button
            whileTap={{ scale: 0.98 }}
            onClick={handleLoadMore}
            className="w-full py-3 bg-white dark:bg-zinc-900 rounded-2xl text-sm font-medium text-blue-600 dark:text-blue-400"
          >
            Load More
          </m.button>
        )}
        
        {/* Empty State */}
        {!isLoading && (!levelData?.data || levelData.data.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-zinc-500">
              No compensation data available for this level
            </p>
          </div>
        )}
      </div>
    </div>
  );
}