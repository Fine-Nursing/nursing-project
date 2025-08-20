import React from 'react';
import { motion } from 'framer-motion';
import type { CareerTimelineProps } from './types';
import {
  EmptyState,
  TimelineHeader,
  TimelineItem,
  CareerProgressionChart
} from './components';

export default function CareerTimeline({
  theme,
  careerData,
  filteredAndSortedCareerData,
  highestHourlyRate,
  setFormVisible,
  filterRole,
  onEdit,
  onDelete
}: CareerTimelineProps) {
  const bgClass = theme === 'light' ? 'bg-white' : 'bg-slate-700';
  const borderClass = theme === 'light' ? 'border-slate-200' : 'border-slate-600';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`mb-6 ${bgClass} border ${borderClass} rounded-xl shadow-lg overflow-hidden`}
    >
      <TimelineHeader 
        theme={theme} 
        itemCount={filteredAndSortedCareerData.length} 
      />

      {filteredAndSortedCareerData.length === 0 ? (
        <EmptyState
          theme={theme}
          careerData={careerData}
          filterRole={filterRole}
          setFormVisible={setFormVisible}
        />
      ) : (
        <div className="flex flex-col lg:grid lg:grid-cols-2">
          {/* Timeline */}
          <div className={`p-4 sm:p-6 lg:border-r ${
            theme === 'light' ? 'lg:border-slate-200' : 'lg:border-slate-600'
          }`}>
            <div
              className={`relative pl-6 sm:pl-8 space-y-4 sm:space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-0 before:h-full before:w-0.5 ${
                theme === 'light' ? 'before:bg-slate-300' : 'before:bg-slate-600'
              }`}
            >
              {filteredAndSortedCareerData.map((item, index) => (
                <TimelineItem
                  key={item.id}
                  item={item}
                  theme={theme}
                  index={index}
                  totalItems={filteredAndSortedCareerData.length}
                  filteredAndSortedCareerData={filteredAndSortedCareerData}
                  highestHourlyRate={highestHourlyRate}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>

          {/* Career Progression Chart - Hidden on mobile */}
          <CareerProgressionChart
            theme={theme}
            filteredAndSortedCareerData={filteredAndSortedCareerData}
          />
        </div>
      )}
    </motion.div>
  );
}