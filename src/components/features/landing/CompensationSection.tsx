'use client';

import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

const CardBoard = lazy(() => import('src/components/ui/card-board'));

// Animated Counter Component
function AnimatedCounter({ baseValue }: { baseValue: number }) {
  const [count, setCount] = React.useState<number>(baseValue);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = React.useRef(true);

  React.useEffect(() => {
    const randomIncrease = (): number => Math.floor(Math.random() * 3) + 1;
    const getRandomInterval = (): number =>
      Math.floor(Math.random() * 3000) + 2000;

    const updateCount = () => {
      if (!isMountedRef.current) return;
      
      setCount((prev) => prev + randomIncrease());
      timeoutRef.current = setTimeout(updateCount, getRandomInterval());
    };
    
    timeoutRef.current = setTimeout(updateCount, getRandomInterval());
    
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return <span>{count.toLocaleString()}+</span>;
}

export default function CompensationSection() {
  return (
    <section className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-white/50 to-transparent dark:from-transparent dark:via-zinc-900/50 dark:to-transparent transition-all">
      {/* Section divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-200/50 dark:via-zinc-700 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center justify-center px-4 py-1 mb-4 text-xs font-semibold tracking-wide text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-50 dark:bg-emerald-900/20 rounded-full border border-emerald-200 dark:border-emerald-800">
            Career Opportunities
          </div>
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Explore Nursing Positions
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto px-4">
            Browse curated opportunities by experience level, location, and specialty
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full bg-gradient-to-br from-white/90 via-emerald-50/30 to-blue-50/40 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-950/90 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200/50 dark:border-zinc-800 backdrop-blur-sm overflow-hidden"
        >
          {/* Live Stats Badge - Simplified for mobile */}
          <div className="mb-4 sm:hidden">
            <div className="flex items-center justify-center space-x-2 text-emerald-600 dark:text-emerald-400">
              <Users size={16} className="animate-pulse" />
              <span className="text-sm font-semibold">
                <AnimatedCounter baseValue={10000} /> nurses shared data
              </span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 dark:bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600 dark:bg-emerald-400" />
              </span>
            </div>
          </div>

          <div className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm rounded-xl border border-white/50 dark:border-zinc-800 shadow-sm relative z-10">
            <Suspense
              fallback={
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-48 bg-gray-200 dark:bg-zinc-900 rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              }
            >
              <CardBoard />
            </Suspense>
          </div>
        </motion.div>
      </div>
    </section>
  );
}