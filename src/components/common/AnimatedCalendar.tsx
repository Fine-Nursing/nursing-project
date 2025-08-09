'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react';

interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  time?: string;
  color?: string;
  type?: string;
}

interface AnimatedCalendarProps {
  events?: CalendarEvent[];
  onDateSelect?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onAddEvent?: (date: Date) => void;
  className?: string;
}

export default function AnimatedCalendar({
  events = [],
  onDateSelect,
  onEventClick,
  onAddEvent,
  className = '',
}: AnimatedCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get calendar days
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    while (current <= lastDay || current.getDay() !== 0) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const days = getCalendarDays();

  // Get events for a specific date
  const getEventsForDate = (date: Date) => events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.toDateString() === date.toDateString();
  });

  // Navigation
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <motion.h2
            key={`${monthNames[currentDate.getMonth()]}-${currentDate.getFullYear()}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-gray-900"
          >
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </motion.h2>
          
          <div className="flex gap-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex gap-2">
          {['month', 'week'].map((mode) => (
            <motion.button
              key={mode}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode(mode as 'month' | 'week')}
              className={`px-4 py-2 rounded-lg capitalize ${
                viewMode === mode
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {mode}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentDate.toISOString()}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="grid grid-cols-7 gap-2"
        >
          {days.map((day, index) => {
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday = day.toDateString() === new Date().toDateString();
            const isSelected = selectedDate?.toDateString() === day.toDateString();
            const dayEvents = getEventsForDate(day);

            return (
              <motion.div
                key={`day-${day.toISOString()}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  setSelectedDate(day);
                  onDateSelect?.(day);
                }}
                className={`
                  relative min-h-[80px] p-2 rounded-lg cursor-pointer transition-colors
                  ${!isCurrentMonth ? 'opacity-40' : ''}
                  ${isToday ? 'bg-primary-100 border-2 border-primary-500' : 'border border-gray-200'}
                  ${isSelected ? 'bg-accent-100 border-accent-500' : ''}
                  hover:bg-gray-50
                `}
              >
                {/* Date number */}
                <div className={`text-sm font-medium ${isToday ? 'text-primary-700' : 'text-gray-900'}`}>
                  {day.getDate()}
                </div>

                {/* Events */}
                <div className="mt-1 space-y-1">
                  <AnimatePresence>
                    {dayEvents.slice(0, 2).map((event, i) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick?.(event);
                        }}
                        whileHover={{ scale: 1.05 }}
                        className={`
                          text-xs px-1 py-0.5 rounded truncate cursor-pointer
                          ${event.color || 'bg-blue-100 text-blue-700'}
                        `}
                      >
                        {event.time && (
                          <span className="font-medium">{event.time} </span>
                        )}
                        {event.title}
                      </motion.div>
                    ))}
                    {dayEvents.length > 2 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-gray-500"
                      >
                        +{dayEvents.length - 2} more
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Add event button */}
                {isSelected && onAddEvent && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddEvent(day);
                    }}
                    className="absolute bottom-1 right-1 p-1 bg-primary-500 text-white rounded-full"
                  >
                    <Plus className="w-3 h-3" />
                  </motion.button>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Selected date events */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gray-50 rounded-lg"
        >
          <h3 className="font-semibold mb-3">
            Events for {selectedDate.toLocaleDateString()}
          </h3>
          <div className="space-y-2">
            {getEventsForDate(selectedDate).length > 0 ? (
              getEventsForDate(selectedDate).map((event) => (
                <motion.div
                  key={event.id}
                  whileHover={{ x: 4 }}
                  onClick={() => onEventClick?.(event)}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:shadow-md"
                >
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div className="flex-1">
                    <div className="font-medium">{event.title}</div>
                    {event.time && (
                      <div className="text-sm text-gray-500">{event.time}</div>
                    )}
                  </div>
                  {event.type && (
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                      {event.type}
                    </span>
                  )}
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No events for this date</p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
export { AnimatedCalendar };
