import React from 'react';

interface UserProfileCardSkeletonProps {
  theme: 'light' | 'dark';
}

export default function UserProfileCardSkeleton({ theme }: UserProfileCardSkeletonProps) {
  const skeletonBg = theme === 'light' ? 'bg-gray-200' : 'bg-gray-700';
  
  return (
    <div className="mb-4 sm:mb-6">
      <div className={`${
        theme === 'light' ? 'bg-white' : 'bg-slate-800'
      } rounded-xl shadow-lg border ${
        theme === 'light' ? 'border-gray-100' : 'border-slate-700'
      } overflow-hidden animate-pulse`}>
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {/* Avatar Skeleton */}
            <div className="flex-shrink-0">
              <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full ${skeletonBg}`} />
            </div>

            {/* Main Content Skeleton */}
            <div className="flex-1 w-full">
              {/* Header Skeleton */}
              <div className="mb-4">
                <div className={`h-6 ${skeletonBg} rounded w-48 mb-2`} />
                <div className={`h-4 ${skeletonBg} rounded w-32`} />
              </div>

              {/* Info Grid Skeleton */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="text-center">
                    <div className={`h-4 ${skeletonBg} rounded w-16 mx-auto mb-1`} />
                    <div className={`h-5 ${skeletonBg} rounded w-12 mx-auto`} />
                  </div>
                ))}
              </div>

              {/* Career Insights Skeleton */}
              <div className={`p-3 rounded-lg border ${
                theme === 'light' 
                  ? 'bg-indigo-50 border-indigo-200' 
                  : 'bg-indigo-900/20 border-indigo-700'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-4 h-4 ${skeletonBg} rounded`} />
                  <div className={`h-4 ${skeletonBg} rounded w-32`} />
                </div>
                <div className={`h-4 ${skeletonBg} rounded w-full mb-1`} />
                <div className={`h-4 ${skeletonBg} rounded w-3/4`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}