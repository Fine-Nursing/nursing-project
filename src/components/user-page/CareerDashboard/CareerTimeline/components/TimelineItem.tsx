import React from 'react';
import dayjs from 'dayjs';
import { 
  Check, 
  Clock, 
  Award, 
  Briefcase, 
  MapPin, 
  TrendingUp, 
  Star, 
  ArrowRight, 
  Edit, 
  Trash2 
} from 'lucide-react';
import type { TimelineItemProps } from '../types';
import { calculateDuration, renderDuration, calculateGap } from '../utils';

export function TimelineItem({
  item,
  theme,
  index,
  totalItems,
  filteredAndSortedCareerData,
  highestHourlyRate,
  onEdit,
  onDelete
}: TimelineItemProps) {
  const { years, months, ongoing } = calculateDuration(item.startDate, item.endDate);
  const startDate = dayjs(item.startDate);
  const endDate = item.endDate ? dayjs(item.endDate) : dayjs();

  // Determine marker color and icon
  let markerColor;
  let markerIcon;
  
  if (ongoing) {
    markerColor = 'bg-emerald-600';
    markerIcon = <Clock className="w-4 h-4 text-white" />;
  } else {
    markerColor = 'bg-slate-500';
    markerIcon = <Check className="w-4 h-4 text-white" />;
  }

  return (
    <div className="relative">
      {/* Timeline marker */}
      <div
        className={`absolute -left-6 sm:-left-8 top-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full ${markerColor} flex items-center justify-center shadow-md ring-2 ${
          ongoing 
            ? theme === 'light' ? 'ring-blue-100' : 'ring-blue-800'
            : theme === 'light' 
              ? 'ring-white' 
              : 'ring-slate-800'
        }`}
      >
        {React.cloneElement(markerIcon, { className: "w-3 h-3 sm:w-4 sm:h-4 text-white" })}
      </div>

      {/* Content */}
      <div
        className={`p-3 sm:p-4 rounded-lg border ${
          ongoing
            ? theme === 'light'
              ? 'border-emerald-200 bg-emerald-50 shadow-sm'
              : 'border-emerald-600 bg-emerald-900/10 shadow-sm'
            : theme === 'light'
              ? 'border-gray-200 bg-white shadow-sm'
              : 'border-slate-600 bg-slate-800/50 shadow-sm'
        }`}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="space-y-2">
              <h4 className={`text-base sm:text-lg font-bold flex items-center gap-2 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                <Award className={`w-4 h-4 ${
                  ongoing ? 'text-blue-500' : theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                }`} />
                {item.role}
                {ongoing && (
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                    theme === 'light' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-emerald-900/50 text-emerald-300'
                  }`}>
                    Current
                  </span>
                )}
              </h4>
              {item.specialty && (
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                  theme === 'light' 
                    ? 'bg-slate-100 text-slate-700' 
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  <Briefcase className="w-3 h-3" />
                  {item.specialty}
                </div>
              )}
              <div className={`flex items-center gap-2 text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-300'
              }`}>
                <MapPin className="w-4 h-4" />
                {item.facility}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-1">
            <button
              type="button"
              onClick={() => onEdit(item.id)}
              className={`p-1 ${theme === 'light' ? 'text-gray-400 hover:text-slate-600' : 'text-gray-500 hover:text-slate-300'} rounded`}
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(item.id)}
              className={`p-1 ${theme === 'light' ? 'text-gray-400 hover:text-red-600' : 'text-gray-500 hover:text-red-400'} rounded`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className={`flex items-center gap-2 text-sm ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            <Clock className="w-4 h-4" />
            <span>
              {startDate.format('MMM YYYY')} - {ongoing ? 'Present' : endDate.format('MMM YYYY')}
            </span>
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              theme === 'light' ? 'bg-slate-100 text-slate-600' : 'bg-slate-700 text-slate-400'
            }`}>
              {renderDuration(years, months)}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg ${
              theme === 'light' 
                ? 'bg-slate-100 text-slate-700' 
                : 'bg-slate-700 text-slate-200'
            }`}>
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-bold">
                ${item.hourlyRate.toFixed(2)}/hr
              </span>
            </div>
            <div className="flex items-center gap-1">
              {item.hourlyRate === highestHourlyRate && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                  theme === 'light' 
                    ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' 
                    : 'bg-yellow-900/30 text-yellow-400 border border-yellow-700'
                }`}>
                  <Star className="w-3 h-3 fill-current" />
                  Peak Rate
                </div>
              )}
            </div>
          </div>
        </div>

        {index < totalItems - 1 && (
          <GapIndicator
            theme={theme}
            currentEndDate={item.endDate}
            nextStartDate={filteredAndSortedCareerData[index + 1].startDate}
          />
        )}
      </div>
    </div>
  );
}

interface GapIndicatorProps {
  theme: 'light' | 'dark';
  currentEndDate?: Date | string | null;
  nextStartDate: Date | string | null;
}

function GapIndicator({ theme, currentEndDate, nextStartDate }: GapIndicatorProps) {
  const gap = calculateGap(currentEndDate, nextStartDate);
  
  return (
    <div className={`mt-3 pt-3 border-t flex items-center text-xs ${
      theme === 'light' ? 'border-slate-100 text-slate-500' : 'border-slate-600 text-slate-400'
    }`}>
      <ArrowRight className="w-3 h-3 mr-2" />
      {gap > 1 ? (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          theme === 'light' ? 'bg-orange-100 text-orange-700' : 'bg-orange-900/30 text-orange-400'
        }`}>
          {gap} month{gap > 1 ? 's' : ''} gap
        </span>
      ) : (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          theme === 'light' ? 'bg-green-100 text-green-700' : 'bg-green-900/30 text-green-400'
        }`}>
          Continuous
        </span>
      )}
    </div>
  );
}