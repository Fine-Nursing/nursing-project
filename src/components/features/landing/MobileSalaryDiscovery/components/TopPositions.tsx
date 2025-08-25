import React from 'react';
import { m } from 'framer-motion';
import { PiMedalBold } from 'react-icons/pi';

interface TopPositionsProps {
  topPositions: any;
  onOnboardingClick: () => void;
}

export function TopPositions({ topPositions, onOnboardingClick }: TopPositionsProps) {
  return (
    <section className="px-6 py-10">
      <div className="flex items-center gap-2 mb-6">
        <PiMedalBold className="w-6 h-6 text-yellow-500" />
        <h2 className="text-xl font-semibold text-gray-900">Top Paying Positions</h2>
      </div>
      
      <div className="space-y-3">
        {topPositions?.data?.map((position: any, idx: number) => (
          <m.div 
            key={position.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl active:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-semibold">
                {idx + 1}
              </div>
              <div>
                <div className="font-medium text-gray-900">{position.specialty}</div>
                <div className="text-sm text-gray-500">{position.location}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900">${position.compensation.hourly}/hr</div>
              {position.compensation.totalDifferential > 0 && (
                <div className="text-xs text-emerald-600">+${position.compensation.totalDifferential}</div>
              )}
            </div>
          </m.div>
        ))}
      </div>

      <button
        onClick={onOnboardingClick}
        className="w-full mt-6 py-3 text-emerald-600 font-medium"
      >
        View all positions →
      </button>
    </section>
  );
}