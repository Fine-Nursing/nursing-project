import { motion } from 'framer-motion';

interface AnimatedProgressBarProps {
  progress: number;
  showPercentage?: boolean;
  height?: string;
  className?: string;
}

export default function AnimatedProgressBar({
  progress,
  showPercentage = true,
  height = 'h-2',
  className = ''
}: AnimatedProgressBarProps) {
  return (
    <div className={`w-full ${className}`}>
      {showPercentage && (
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-600">Progress</span>
          <motion.span 
            className="text-sm font-semibold text-slate-600"
            key={progress}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {Math.round(progress)}%
          </motion.span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${height}`}>
        <motion.div
          className="h-full bg-gradient-to-r from-slate-500 to-slate-600 rounded-full relative overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: [-200, 200] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear"
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}