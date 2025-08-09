'use client';

import { motion } from 'framer-motion';
import { Check, Circle } from 'lucide-react';

interface TimelineItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  date: string;
  status: 'completed' | 'current' | 'upcoming';
  icon?: React.ReactNode;
  color?: string;
}

interface AnimatedTimelineProps {
  items: TimelineItem[];
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

export function AnimatedTimeline({
  items,
  orientation = 'vertical',
  className = '',
}: AnimatedTimelineProps) {
  const isVertical = orientation === 'vertical';

  const lineVariants = {
    hidden: isVertical 
      ? { height: 0 }
      : { width: 0 },
    visible: isVertical
      ? { height: '100%', transition: { duration: 1, ease: 'easeInOut' as const } }
      : { width: '100%', transition: { duration: 1, ease: 'easeInOut' as const } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        type: 'spring' as const,
        stiffness: 100,
      },
    }),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'current':
        return 'bg-blue-500';
      case 'upcoming':
        return 'bg-gray-300';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4 text-white" />;
      case 'current':
        return (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-white rounded-full"
          />
        );
      case 'upcoming':
        return <Circle className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  if (isVertical) {
    return (
      <div className={`relative ${className}`}>
        {/* Animated Line */}
        <motion.div
          className="absolute left-6 top-0 w-0.5 bg-gradient-to-b from-primary-500 to-accent-500"
          initial="hidden"
          animate="visible"
          variants={lineVariants}
        />

        {/* Timeline Items */}
        <div className="space-y-8">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              className="relative flex gap-4"
            >
              {/* Node */}
              <motion.div
                whileHover={{ scale: 1.2 }}
                className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${getStatusColor(
                  item.status
                )} shadow-lg`}
              >
                {item.icon || getStatusIcon(item.status)}
                
                {item.status === 'current' && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-blue-400"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                )}
              </motion.div>

              {/* Content */}
              <motion.div
                whileHover={{ x: 4 }}
                className="flex-1 bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    {item.subtitle && (
                      <p className="text-sm text-gray-600">{item.subtitle}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{item.date}</span>
                </div>
                {item.description && (
                  <p className="text-sm text-gray-700">{item.description}</p>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Horizontal Timeline
  return (
    <div className={`relative ${className}`}>
      {/* Animated Line */}
      <motion.div
        className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500"
        initial="hidden"
        animate="visible"
        variants={lineVariants}
      />

      {/* Timeline Items */}
      <div className="flex justify-between">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            className="relative flex flex-col items-center"
          >
            {/* Node */}
            <motion.div
              whileHover={{ scale: 1.2 }}
              className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${getStatusColor(
                item.status
              )} shadow-lg mb-4`}
            >
              {item.icon || getStatusIcon(item.status)}
              
              {item.status === 'current' && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-blue-400"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              )}
            </motion.div>

            {/* Content */}
            <motion.div
              whileHover={{ y: -4 }}
              className="text-center max-w-[150px]"
            >
              <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{item.date}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}