'use client';

import React, { useState, useMemo } from 'react';
import moment from 'moment';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useTheme } from 'src/hooks/useTheme';
import { CalendarHeader } from './components/CalendarHeader';
import { EventModal } from './components/EventModal';
import { getEventStyle, calculateShiftStats } from './utils';
import type { NurseShiftCalendarProps, ShiftEvent } from './types';

const localizer = momentLocalizer(moment);

export default function NurseShiftCalendar({
  events,
  totalEarnings,
  theme,
}: NurseShiftCalendarProps) {
  const tc = useTheme(theme);
  const [selectedEvent, setSelectedEvent] = useState<ShiftEvent | null>(null);

  // Calculate statistics
  const { totalHours, shiftsCount } = useMemo(() => 
    calculateShiftStats(events), [events]
  );

  // Event handlers
  const handleSelectEvent = (event: ShiftEvent) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  // Custom components for calendar
  const components = useMemo(() => ({
    toolbar: (props: any) => (
      <div className={`p-4 border-b ${tc.border.default} ${tc.bg.primary}`}>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => props.onNavigate('PREV')}
              className={`px-3 py-1.5 rounded-lg ${tc.components.button.secondary} text-sm font-medium`}
            >
              Previous
            </button>
            <button
              onClick={() => props.onNavigate('TODAY')}
              className={`px-3 py-1.5 rounded-lg ${tc.components.button.primary} text-sm font-medium`}
            >
              Today
            </button>
            <button
              onClick={() => props.onNavigate('NEXT')}
              className={`px-3 py-1.5 rounded-lg ${tc.components.button.secondary} text-sm font-medium`}
            >
              Next
            </button>
          </div>
          
          <h3 className={`text-lg font-semibold ${tc.text.primary}`}>
            {props.label}
          </h3>
          
          <div className="flex gap-2">
            <button
              onClick={() => props.onView('month')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                props.view === 'month' 
                  ? tc.components.button.primary
                  : tc.components.button.secondary
              }`}
            >
              Month
            </button>
            <button
              onClick={() => props.onView('week')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                props.view === 'week'
                  ? tc.components.button.primary
                  : tc.components.button.secondary
              }`}
            >
              Week
            </button>
          </div>
        </div>
      </div>
    ),
  }), [tc, theme]);

  return (
    <div className={`${tc.cardClass}`}>
      {/* Header with stats */}
      <CalendarHeader
        totalEarnings={totalEarnings}
        hoursWorked={totalHours}
        shiftsCount={shiftsCount}
        theme={theme}
      />

      {/* Calendar */}
      <div className={`p-6 ${tc.bg.primary}`}>
        <div className={`calendar-container ${theme === 'dark' ? 'dark-calendar' : ''}`}>
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            eventPropGetter={getEventStyle}
            onSelectEvent={handleSelectEvent}
            components={components}
            views={['month', 'week']}
            defaultView="month"
          />
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        event={selectedEvent}
        onClose={handleCloseModal}
        theme={theme}
      />

      {/* Custom styles for dark mode */}
      <style jsx global>{`
        .dark-calendar .rbc-calendar {
          background: #1f2937;
          color: #f3f4f6;
        }
        .dark-calendar .rbc-toolbar button {
          color: #f3f4f6;
        }
        .dark-calendar .rbc-toolbar button:hover {
          background: #374151;
        }
        .dark-calendar .rbc-toolbar button.rbc-active {
          background: #4f46e5;
        }
        .dark-calendar .rbc-month-view,
        .dark-calendar .rbc-time-view {
          background: #1f2937;
          border-color: #374151;
        }
        .dark-calendar .rbc-day-bg {
          background: #1f2937;
        }
        .dark-calendar .rbc-day-bg + .rbc-day-bg {
          border-left-color: #374151;
        }
        .dark-calendar .rbc-month-row + .rbc-month-row {
          border-top-color: #374151;
        }
        .dark-calendar .rbc-header {
          background: #111827;
          color: #f3f4f6;
          border-bottom-color: #374151;
        }
        .dark-calendar .rbc-header + .rbc-header {
          border-left-color: #374151;
        }
        .dark-calendar .rbc-today {
          background: #1e293b;
        }
        .dark-calendar .rbc-off-range-bg {
          background: #111827;
        }
        .dark-calendar .rbc-event {
          background: #4f46e5;
        }
        .dark-calendar .rbc-event.rbc-selected {
          background: #6366f1;
        }
        .calendar-container {
          border-radius: 0.5rem;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}