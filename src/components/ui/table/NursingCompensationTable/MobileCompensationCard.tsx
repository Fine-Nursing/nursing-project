'use client';

import React from 'react';
import { MapPin, Clock, DollarSign, User } from 'lucide-react';
import type { NursingPosition } from 'src/types/nursing';

interface MobileCompensationCardProps {
  position: NursingPosition;
}

export default function MobileCompensationCard({ position }: MobileCompensationCardProps) {
  const shiftColors = {
    Day: 'bg-yellow-100 text-yellow-800',
    Night: 'bg-blue-100 text-blue-800',
    Evening: 'bg-purple-100 text-purple-800',
    Rotating: 'bg-gray-100 text-gray-800',
  };

  const bgColor = shiftColors[position.shift] || 'bg-gray-100 text-gray-800';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start mb-3 gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{position.specialty}</h3>
          <div className="flex items-center mt-1 text-sm text-gray-600">
            <MapPin size={14} className="mr-1 flex-shrink-0" />
            <span className="truncate">{position.location}</span>
          </div>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${bgColor}`}
        >
          {position.shift}
        </span>
      </div>

      {/* Compensation */}
      {position.compensation && (
        <div className="bg-green-50 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Compensation</p>
              <p className="text-xl font-bold text-green-600">
                ${position.compensation.hourly?.toLocaleString() || 0}/hr
              </p>
            </div>
            <DollarSign size={20} className="text-green-600" />
          </div>
          
          {position.compensation.totalDifferential > 0 && (
            <div className="mt-2 text-xs text-gray-600">
              Base: ${position.compensation.basePay}/hr
              <span className="text-blue-600 ml-2">
                +${position.compensation.totalDifferential} differentials
              </span>
            </div>
          )}
        </div>
      )}

      {/* Additional Info */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center text-gray-600">
          <Clock size={14} className="mr-1" />
          <span>{position.experience}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <User size={14} className="mr-1" />
          <span>User {position.id.slice(-4)}</span>
        </div>
      </div>
    </div>
  );
}