// Lightweight wrapper for PredictiveCompChart
import dynamic from 'next/dynamic';
import React from 'react';

const PredictiveCompChart = dynamic(
  () => import('./PredictiveCompChart'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[400px] bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse flex items-center justify-center">
        <p className="text-gray-500">Loading chart...</p>
      </div>
    )
  }
);

export default PredictiveCompChart;