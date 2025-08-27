import React from 'react';

interface RadarAnalyticsSkeletonProps {
  theme: 'light' | 'dark';
}

export default function RadarAnalyticsSkeleton({ theme }: RadarAnalyticsSkeletonProps) {
  const skeletonBg = theme === 'light' ? 'bg-gray-200' : 'bg-gray-700';
  
  return (
    <div className={`${
      theme === 'light' ? 'bg-white' : 'bg-slate-800'
    } rounded-xl shadow-lg border ${
      theme === 'light' ? 'border-gray-200' : 'border-slate-700'
    } p-6 animate-pulse`}>
      {/* Header Skeleton */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 ${skeletonBg} rounded-lg`} />
            <div>
              <div className={`h-5 ${skeletonBg} rounded w-40 mb-1`} />
              <div className={`h-4 ${skeletonBg} rounded w-48`} />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1.5 ${skeletonBg} rounded-lg w-20 h-8`} />
          </div>
        </div>
      </div>

      {/* Chart Area Skeleton */}
      <div className="mb-6">
        <div className={`w-full h-64 ${skeletonBg} rounded-lg`} />
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className={`p-3 ${skeletonBg} rounded-lg`}>
            <div className={`h-4 ${theme === 'light' ? 'bg-gray-300' : 'bg-gray-600'} rounded w-16 mb-2 mx-auto`} />
            <div className={`h-6 ${theme === 'light' ? 'bg-gray-300' : 'bg-gray-600'} rounded w-12 mx-auto`} />
          </div>
        ))}
      </div>

      {/* AI Performance Insights Skeleton */}
      <div className="mt-6">
        <div className={`p-5 rounded-xl border ${
          theme === 'light'
            ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
            : 'bg-gradient-to-br from-amber-900/10 to-orange-900/10 border-amber-800/30'
        }`}>
          <div className="flex items-start gap-4">
            <div className={`p-2 ${skeletonBg} rounded-lg w-9 h-9`} />
            
            <div className="flex-1">
              <div className={`h-5 ${skeletonBg} rounded w-48 mb-3`} />
              
              <div className="space-y-4">
                {/* Performance Summary Skeleton */}
                <div className={`p-3 rounded-lg ${
                  theme === 'light' ? 'bg-white/60' : 'bg-slate-800/30'
                }`}>
                  <div className={`h-4 ${skeletonBg} rounded w-full mb-1`} />
                  <div className={`h-4 ${skeletonBg} rounded w-3/4`} />
                </div>
                
                {/* AI Recommendations Skeleton */}
                <div className={`p-3 rounded-lg ${
                  theme === 'light' ? 'bg-amber-50' : 'bg-amber-900/20'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-4 h-4 ${skeletonBg} rounded mt-1`} />
                    <div className="flex-1">
                      <div className={`h-3 ${skeletonBg} rounded w-32 mb-1`} />
                      <div className={`h-4 ${skeletonBg} rounded w-full mb-1`} />
                      <div className={`h-4 ${skeletonBg} rounded w-2/3`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}