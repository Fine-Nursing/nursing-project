import React from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { HiMiniSignal } from 'react-icons/hi2';
import { RiPulseLine } from 'react-icons/ri';

interface LiveUpdatesProps {
  latestSalaries: any;
  tickerIndex: number;
}

export function LiveUpdates({ latestSalaries, tickerIndex }: LiveUpdatesProps) {
  return (
    <section className="px-6 py-10 border-t border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <HiMiniSignal className="w-6 h-6 text-emerald-500" />
          <h2 className="text-xl font-semibold text-gray-900">Live Updates</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-gray-500">Live</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {latestSalaries?.data && latestSalaries.data[tickerIndex] && (
          <m.div
            key={tickerIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-gray-50 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-2xl font-semibold text-gray-900">
                  ${latestSalaries.data[tickerIndex].compensation.hourly}/hr
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {latestSalaries.data[tickerIndex].specialty} • {latestSalaries.data[tickerIndex].location}
                </div>
              </div>
              <RiPulseLine className="w-5 h-5 text-emerald-500" />
            </div>
            
            {latestSalaries.data[tickerIndex].compensation.differentialBreakdown?.length > 0 && (
              <div className="flex gap-2">
                {latestSalaries.data[tickerIndex].compensation.differentialBreakdown.slice(0, 2).map((diff: any, idx: number) => (
                  <span key={idx} className="text-xs text-gray-500">
                    +${diff.amount} {diff.type}
                  </span>
                ))}
              </div>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </section>
  );
}