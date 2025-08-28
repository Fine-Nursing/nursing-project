import { m } from 'framer-motion';
import AnimatedProgressBar from '../../components/AnimatedProgressBar';

interface ProgressHeaderProps {
  progress: number;
  completedCategories: number;
  totalCategories: number;
}

export default function ProgressHeader({
  progress,
  completedCategories,
  totalCategories,
}: ProgressHeaderProps) {
  return (
    <>
      {/* Progress Bar */}
      <div className="mb-6">
        <AnimatedProgressBar 
          progress={progress} 
          showPercentage={false}
          height="h-1"
          className="max-w-2xl mx-auto"
        />
        <m.div 
          className="text-center mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-gray-500">
            {completedCategories} of {totalCategories} categories rated
          </p>
        </m.div>
      </div>

      {/* Header - Full Width */}
      <m.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10 sm:mb-14"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
          How&apos;s Your Workplace Culture?
        </h2>
        <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
          Your honest feedback helps create better work environments for
          healthcare professionals everywhere
        </p>
      </m.div>
    </>
  );
}