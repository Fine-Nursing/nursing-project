import React from 'react';
import { X as CloseIcon, Clock, DollarSign, Calendar, MapPin } from 'lucide-react';
import { useTheme } from 'src/hooks/useTheme';
import type { EventModalProps } from '../types';

export function EventModal({ event, onClose, theme }: EventModalProps) {
  const tc = useTheme(theme);
  
  if (!event) return null;

  const formatDate = (date: Date) => new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const formatTime = (date: Date) => new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`${tc.bg.primary} rounded-xl shadow-2xl max-w-md w-full transform transition-all`}>
        {/* Header */}
        <div className={`p-4 border-b ${tc.border.default} flex items-center justify-between`}>
          <h3 className={`text-lg font-semibold ${tc.text.primary}`}>
            Shift Details
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Shift Type */}
          <div>
            <h4 className={`text-xl font-bold ${tc.text.primary} mb-2`}>
              {event.title}
            </h4>
            {event.resource?.isHoliday && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Holiday Shift
              </span>
            )}
          </div>

          {/* Date & Time */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className={`w-4 h-4 ${tc.text.secondary}`} />
              <span className={`text-sm ${tc.text.primary}`}>
                {formatDate(event.start)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className={`w-4 h-4 ${tc.text.secondary}`} />
              <span className={`text-sm ${tc.text.primary}`}>
                {formatTime(event.start)} - {formatTime(event.end)}
              </span>
            </div>
          </div>

          {/* Earnings Breakdown */}
          {event.resource && (
            <div className={`p-4 rounded-lg ${tc.getClass(
              'bg-gray-50',
              'bg-gray-800'
            )}`}>
              <h5 className={`font-medium ${tc.text.primary} mb-3`}>
                Earnings Breakdown
              </h5>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className={`text-sm ${tc.text.secondary}`}>Base Pay</span>
                  <span className={`text-sm font-medium ${tc.text.primary}`}>
                    ${event.resource.basePay.toFixed(2)}/hr
                  </span>
                </div>
                
                {event.resource.differentials.length > 0 && (
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                    <p className={`text-xs font-medium ${tc.text.secondary} mb-1`}>
                      Differentials:
                    </p>
                    {event.resource.differentials.map((diff, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className={tc.text.secondary}>{diff}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className={`pt-2 mt-2 border-t ${tc.border.default}`}>
                  <div className="flex justify-between">
                    <span className={`text-sm font-medium ${tc.text.primary}`}>
                      Hourly Rate
                    </span>
                    <span className={`text-sm font-bold ${tc.text.primary}`}>
                      ${event.resource.hourlyRate.toFixed(2)}/hr
                    </span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className={`text-sm font-medium ${tc.text.primary}`}>
                      Total Earnings
                    </span>
                    <span className={`text-lg font-bold ${tc.getClass(
                      'text-green-600',
                      'text-green-400'
                    )}`}>
                      ${event.resource.earning.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}