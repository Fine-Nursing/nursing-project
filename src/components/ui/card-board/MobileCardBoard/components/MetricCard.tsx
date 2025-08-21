import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { MetricCardProps } from '../types';

export function MetricCard({ 
  label, 
  value, 
  change, 
  sublabel 
}: MetricCardProps) {
  const getTrendIcon = () => {
    if (change === undefined) return null;
    if (change > 0) return <TrendingUp size={14} />;
    if (change < 0) return <TrendingDown size={14} />;
    return <Minus size={14} />;
  };

  const getTrendColor = () => {
    if (change === undefined) return '';
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4">
      <p className="text-xs text-gray-500 dark:text-zinc-500 font-medium uppercase tracking-wider mb-1">
        {label}
      </p>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {value}
          </p>
          {sublabel && (
            <p className="text-xs text-gray-500 dark:text-zinc-500 mt-0.5">
              {sublabel}
            </p>
          )}
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-0.5 ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="text-xs font-medium">{Math.abs(change)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}