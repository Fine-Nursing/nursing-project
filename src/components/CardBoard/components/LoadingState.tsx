import React from 'react';

export default function LoadingState() {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 dark:border-emerald-400" />
        <p className="mt-4 text-zinc-600 dark:text-zinc-300">Loading compensation data...</p>
      </div>
    </div>
  );
}