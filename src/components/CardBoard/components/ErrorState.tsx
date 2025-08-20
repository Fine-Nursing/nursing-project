import React from 'react';

export default function ErrorState() {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <p className="text-red-600 dark:text-red-400">Failed to load compensation data</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-2 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          Try again
        </button>
      </div>
    </div>
  );
}