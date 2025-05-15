// components/NurseShiftScheduler/NurseShiftCalendar.tsx

import React, { useState } from 'react';
import moment from 'moment';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { X as CloseIcon } from 'lucide-react';

import { DIFFERENTIALS } from '../../../utils/constants';

const localizer = momentLocalizer(moment);

// 요일 배열(고정)
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface NurseShiftCalendarProps {
  events: any[]; // 나중에 타입 정의
  totalEarnings: number;
  theme: 'light' | 'dark';
}

export default function NurseShiftCalendar({
  events,
  totalEarnings,
  theme,
}: NurseShiftCalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // ---------------------------------------
  // 1) 캘린더 이벤트 스타일 (색상/디자인)
  // ---------------------------------------
  const eventStyleGetter = (event: any) => {
    let backgroundColor = '#10b981'; // 기본: day shift -> green
    let borderColor = '#059669';
    const textColor = '#ffffff';

    // Night shift
    if (event.title.includes('Night') || event.title.includes('NOC')) {
      backgroundColor = '#4f46e5'; // night shift
      borderColor = '#4338ca';
    }
    // Weekend
    if (event.title.includes('Weekend')) {
      backgroundColor = '#f59e0b'; // weekend
      borderColor = '#d97706';
    }
    // Holiday
    if (event.resource?.isHoliday) {
      backgroundColor = '#ef4444';
      borderColor = '#dc2626';
    }
    // Charge Nurse
    if (
      event.resource?.differentials?.some((diff: string) =>
        diff.includes('Charge')
      )
    ) {
      borderColor = '#000000'; // charge nurse => black border
    }

    return {
      style: {
        backgroundColor,
        color: textColor,
        borderColor,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: '4px',
        opacity: 0.9,
        display: 'block',
        fontWeight: 'bold',
        fontSize: '0.8em',
        padding: '2px 4px',
      },
    };
  };

  // ---------------------------------------
  // 2) 이벤트 선택(모달 열기/닫기)
  // ---------------------------------------
  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event);
  };
  const handleCloseDetail = () => {
    setSelectedEvent(null);
  };

  // ---------------------------------------
  // 3) 총 근무시간 계산
  // ---------------------------------------
  const totalHours = events.reduce(
    (acc, e) => acc + (e.resource?.hours || 0),
    0
  );

  // ---------------------------------------
  // 4) 실제 렌더링
  // ---------------------------------------
  return (
    <div>
      {/* -----------------------------
         선택된 이벤트 모달 (디테일)
      ----------------------------- */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div
            className={`p-5 rounded-lg shadow-lg border w-80 relative ${
              theme === 'light'
                ? 'bg-white border-slate-200'
                : 'bg-slate-700 border-slate-600 text-white'
            }`}
          >
            <button
              type="button"
              onClick={handleCloseDetail}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
            <h3
              className={`font-bold mb-2 ${
                theme === 'light' ? 'text-slate-700' : 'text-slate-300'
              }`}
            >
              {selectedEvent.title}
            </h3>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Date:</span>{' '}
                {new Date(selectedEvent.start).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Time:</span>{' '}
                {new Date(selectedEvent.start).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                -{' '}
                {new Date(selectedEvent.end).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <p>
                <span className="font-medium">Duration:</span>{' '}
                {selectedEvent.resource.hours} hrs
              </p>
              <p>
                <span className="font-medium">Base Pay:</span> $
                {selectedEvent.resource.basePay.toFixed(2)}/hr
              </p>

              {/* Diff 리스트 */}
              {selectedEvent.resource.differentials?.length > 0 && (
                <div>
                  <p className="font-medium mt-2">Differentials:</p>
                  <ul className="list-disc list-inside ml-3">
                    {selectedEvent.resource.differentials.map((d: string) => (
                      // (1) d 자체가 유일하다고 가정 (중복 없다고 가정)
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div
                className={`mt-3 p-2 rounded ${
                  theme === 'light'
                    ? 'bg-slate-50'
                    : 'bg-slate-600 text-white border border-slate-500'
                }`}
              >
                <p
                  className={`font-medium ${
                    theme === 'light' ? 'text-slate-700' : 'text-slate-300'
                  }`}
                >
                  Hourly Rate: ${selectedEvent.resource.hourlyRate.toFixed(2)}
                  /hr
                </p>
                <p
                  className={`font-medium ${
                    theme === 'light' ? 'text-slate-700' : 'text-slate-300'
                  }`}
                >
                  Shift Earnings: ${selectedEvent.resource.earning.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="mt-4 text-right">
              <button
                type="button"
                onClick={handleCloseDetail}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                  theme === 'light'
                    ? 'bg-slate-500 text-white hover:bg-slate-600'
                    : 'bg-slate-600 text-white hover:bg-slate-700'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -----------------------------
         스케줄 개요 (위쪽)
      ----------------------------- */}
      <div
        className={`text-sm p-3 rounded-md mb-3 ${
          theme === 'light'
            ? 'bg-slate-50 border border-slate-100'
            : 'bg-slate-700 border border-slate-600 text-white'
        }`}
      >
        <h4
          className={`font-bold mb-2 ${
            theme === 'light' ? 'text-slate-700' : 'text-slate-300'
          }`}
        >
          Schedule Overview
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <span className="font-medium">Total Shifts:</span> {events.length}
            <br />
            <span className="font-medium">Total Hours:</span> {totalHours}
          </div>
          <div>
            <span className="font-medium">Day Shifts:</span>{' '}
            {
              events.filter(
                (e) => !e.title.includes('Night') && !e.title.includes('NOC')
              ).length
            }
            <br />
            <span className="font-medium">Night Shifts:</span>{' '}
            {
              events.filter(
                (e) => e.title.includes('Night') || e.title.includes('NOC')
              ).length
            }
          </div>
          <div>
            <span className="font-medium">Total Earnings:</span> $
            {totalEarnings.toFixed(2)}
          </div>
        </div>
      </div>

      {/* -----------------------------
         Legend (색상 표시)
      ----------------------------- */}
      <div className="flex flex-wrap gap-2 mb-3 text-xs">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded mr-1" />
          <span>Day Shift</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-indigo-600 rounded mr-1" />
          <span>Night Shift</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-amber-500 rounded mr-1" />
          <span>Weekend</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded mr-1" />
          <span>Holiday</span>
        </div>
        <div
          className={`ml-auto text-xs ${
            theme === 'light' ? 'text-gray-500' : 'text-gray-300'
          }`}
        >
          <em>Click any shift for details</em>
        </div>
      </div>

      {/* -----------------------------
         React Big Calendar (메인 달력)
      ----------------------------- */}
      <div style={{ height: '500px' }}>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          views={['month', 'week', 'day', 'agenda']}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          toolbar
          popup
          style={{ height: '100%', width: '100%' }}
        />
      </div>

      {/* -----------------------------
         Day-of-Week Distribution + Pay Breakdown
      ----------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* (A) Day-of-Week Distribution */}
        <div
          className={`p-3 rounded-lg border shadow-sm ${
            theme === 'light'
              ? 'bg-white border-gray-200'
              : 'bg-slate-800 border-slate-600 text-white'
          }`}
        >
          <h4
            className={`text-sm font-medium mb-2 border-b pb-1 ${
              theme === 'light'
                ? 'text-slate-700 border-slate-100'
                : 'text-slate-300 border-slate-500'
            }`}
          >
            Day-of-Week Distribution
          </h4>
          <div className="text-xs grid grid-cols-7 gap-1 text-center mt-2">
            {/* 요일 헤더 */}
            {DAYS_OF_WEEK.map((day) => (
              <div key={day}>{day}</div>
            ))}

            {/* 요일별 막대 그래프 */}
            {DAYS_OF_WEEK.map((day) => {
              // dayIndex는 "Sun"=0, "Mon"=1, ...
              const dayIndex = DAYS_OF_WEEK.indexOf(day);
              const count = events.filter(
                (e) => new Date(e.start).getDay() === dayIndex
              ).length;
              const height = `${count * 10}px`; // 예: 1개=10px, 2개=20px ...
              return (
                <div key={`${day}-bar`} className="flex flex-col items-center">
                  <div
                    className="w-full bg-slate-400 rounded-t"
                    style={{ height }}
                  />
                  <div>{count}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* (B) Pay Breakdown */}
        <div
          className={`p-3 rounded-lg border shadow-sm ${
            theme === 'light'
              ? 'bg-white border-gray-200'
              : 'bg-slate-800 border-slate-600 text-white'
          }`}
        >
          <h4
            className={`text-sm font-medium mb-2 border-b pb-1 ${
              theme === 'light'
                ? 'text-slate-700 border-slate-100'
                : 'text-slate-300 border-slate-500'
            }`}
          >
            Pay Breakdown
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm mt-2">
            <div
              className={`border-r pr-2 ${
                theme === 'light'
                  ? 'border-gray-100 text-gray-700'
                  : 'border-slate-500'
              }`}
            >
              <h5 className="font-medium">Base Pay</h5>
              <p
                className={`text-lg font-bold ${
                  theme === 'light' ? 'text-gray-800' : 'text-white'
                }`}
              >
                $
                {events
                  .reduce(
                    (sum, e) => sum + e.resource.basePay * e.resource.hours,
                    0
                  )
                  .toFixed(2)}
              </p>
              <p className="text-xs opacity-80">
                Over {totalHours} hours total
              </p>
            </div>

            <div
              className={`border-r pr-2 ${
                theme === 'light'
                  ? 'border-gray-100'
                  : 'border-slate-500 text-white'
              }`}
            >
              <h5 className="font-medium">Differentials</h5>
              <p
                className={`text-lg font-bold ${
                  theme === 'light' ? 'text-slate-600' : 'text-slate-300'
                }`}
              >
                $
                {(
                  totalEarnings -
                  events.reduce(
                    (sum, e) => sum + e.resource.basePay * e.resource.hours,
                    0
                  )
                ).toFixed(2)}
              </p>
              <p className="text-xs mt-1 opacity-80">
                {events.some(
                  (e) => e.title.includes('Night') || e.title.includes('NOC')
                ) && `Night +$${DIFFERENTIALS.NIGHT.toFixed(2)}/hr `}
                {events.some((e) => e.title.includes('Weekend')) &&
                  `| Weekend +$${DIFFERENTIALS.WEEKEND.toFixed(2)}/hr`}
              </p>
            </div>

            <div>
              <h5 className="font-medium">Total Pay</h5>
              <p
                className={`text-lg font-bold ${
                  theme === 'light' ? 'text-slate-700' : 'text-slate-300'
                }`}
              >
                ${totalEarnings.toFixed(2)}
              </p>
              <p className="text-xs mt-1 opacity-80">
                Avg Hourly:{' '}
                {totalHours > 0
                  ? `$${(totalEarnings / totalHours).toFixed(2)}/hr`
                  : '$0.00/hr'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* -----------------------------
         Export / Save 버튼 (Optional)
      ----------------------------- */}
      <div className="text-right mt-4">
        <button
          type="button"
          className={`border px-3 py-1.5 rounded-md text-sm font-medium mr-2 ${
            theme === 'light'
              ? 'bg-white border-slate-500 text-slate-600 hover:bg-slate-50'
              : 'bg-slate-700 border-slate-500 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Export Schedule
        </button>
        <button
          type="button"
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
            theme === 'light'
              ? 'bg-slate-500 text-white hover:bg-slate-600'
              : 'bg-slate-600 text-white hover:bg-slate-700'
          }`}
        >
          Save Schedule
        </button>
      </div>
    </div>
  );
}
