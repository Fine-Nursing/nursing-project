'use client';

import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  variant?: 'text' | 'card' | 'avatar' | 'chart' | 'table';
  count?: number;
  className?: string;
}

const shimmerAnimation = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 1.5,
      ease: 'linear' as const,
      repeat: Infinity,
    },
  },
};

export function SkeletonLoader({ 
  variant = 'text', 
  count = 1, 
  className = '' 
}: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'text':
        return (
          <motion.div
            className={`h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-md ${className}`}
            style={{
              backgroundSize: '200% 100%',
            }}
            animate={shimmerAnimation.animate}
          />
        );

      case 'card':
        return (
          <motion.div
            className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6">
              <motion.div
                className="h-8 w-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg mb-4"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmerAnimation.animate}
              />
              <motion.div
                className="h-12 w-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-md mb-2"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmerAnimation.animate}
              />
              <motion.div
                className="h-4 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-md"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmerAnimation.animate}
              />
            </div>
          </motion.div>
        );

      case 'avatar':
        return (
          <motion.div
            className={`flex items-center space-x-4 ${className}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="h-12 w-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full"
              style={{ backgroundSize: '200% 100%' }}
              animate={shimmerAnimation.animate}
            />
            <div className="flex-1 space-y-2">
              <motion.div
                className="h-4 w-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-md"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmerAnimation.animate}
              />
              <motion.div
                className="h-3 w-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-md"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmerAnimation.animate}
              />
            </div>
          </motion.div>
        );

      case 'chart':
        return (
          <motion.div
            className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="h-6 w-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-md mb-4"
              style={{ backgroundSize: '200% 100%' }}
              animate={shimmerAnimation.animate}
            />
            <div className="space-y-3">
              {[100, 80, 120, 60, 90].map((width, index) => (
                <div key={index} className="flex items-end space-x-2">
                  <motion.div
                    className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-md"
                    style={{ backgroundSize: '200% 100%' }}
                    animate={shimmerAnimation.animate}
                  />
                  <motion.div
                    className="bg-gradient-to-r from-primary-100 via-primary-50 to-primary-100 rounded-md"
                    style={{
                      height: '24px',
                      width: `${width}px`,
                      backgroundSize: '200% 100%',
                    }}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${width}px`,
                      backgroundPosition: ['200% 0', '-200% 0'],
                    }}
                    transition={{
                      width: { duration: 0.5, delay: index * 0.1 },
                      backgroundPosition: {
                        duration: 1.5,
                        ease: 'linear',
                        repeat: Infinity,
                      },
                    }}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'table':
        return (
          <motion.div
            className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6">
              <motion.div
                className="h-6 w-40 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-md mb-4"
                style={{ backgroundSize: '200% 100%' }}
                animate={shimmerAnimation.animate}
              />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <motion.div
                    key={index}
                    className="flex space-x-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div
                      className="h-4 w-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-md"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmerAnimation.animate}
                    />
                    <motion.div
                      className="h-4 w-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-md"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmerAnimation.animate}
                    />
                    <motion.div
                      className="h-4 w-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-md"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmerAnimation.animate}
                    />
                    <motion.div
                      className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-md"
                      style={{ backgroundSize: '200% 100%' }}
                      animate={shimmerAnimation.animate}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  );
}

// Dashboard Skeleton
export function DashboardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-8 space-y-8"
    >
      {/* Header Skeleton */}
      <div className="space-y-2">
        <motion.div
          className="h-10 w-64 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg"
          style={{ backgroundSize: '200% 100%' }}
          animate={shimmerAnimation.animate}
        />
        <motion.div
          className="h-4 w-96 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-md"
          style={{ backgroundSize: '200% 100%' }}
          animate={shimmerAnimation.animate}
        />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <SkeletonLoader variant="card" />
          </motion.div>
        ))}
      </div>

      {/* Chart and Table Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SkeletonLoader variant="chart" />
        <SkeletonLoader variant="table" />
      </div>
    </motion.div>
  );
}

// Loading Spinner
export function LoadingSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} border-4 border-primary-200 border-t-primary-600 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}

// Progress Bar
export function ProgressBar({ progress, className = '' }: { progress: number; className?: string }) {
  return (
    <div className={`w-full h-2 bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <motion.div
        className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{
          duration: 0.8,
          ease: [0.4, 0, 0.2, 1],
        }}
      />
    </div>
  );
}