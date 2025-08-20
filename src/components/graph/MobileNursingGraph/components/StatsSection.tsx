import type { StatsData } from '../types';

interface StatsSectionProps {
  stats: StatsData | null;
}

export function StatsSection({ stats }: StatsSectionProps) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-3 gap-2 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-3 text-center">
        <p className="text-xs text-gray-500 dark:text-zinc-500 mb-1">Highest</p>
        <p className="text-lg font-bold text-gray-900 dark:text-white">${stats.max}</p>
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-3 text-center">
        <p className="text-xs text-gray-500 dark:text-zinc-500 mb-1">Average</p>
        <p className="text-lg font-bold text-gray-900 dark:text-white">${stats.avg}</p>
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-3 text-center">
        <p className="text-xs text-gray-500 dark:text-zinc-500 mb-1">Entry</p>
        <p className="text-lg font-bold text-gray-900 dark:text-white">${stats.min}</p>
      </div>
    </div>
  );
}