import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';

interface FloatingCTAProps {
  onGetStarted: () => void;
}

export default function FloatingCTA({ onGetStarted }: FloatingCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 30% of the page
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setIsVisible(scrollPercentage > 30 && scrollPercentage < 85);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <m.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-30 p-3 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg"
        >
          <button
            onClick={onGetStarted}
            className="w-full px-5 py-2.5 bg-emerald-500 text-white rounded-full font-semibold text-sm shadow-lg active:scale-[0.98] transition-transform"
          >
            Compare Salaries
          </button>
          <p className="text-center text-[10px] text-gray-500 mt-1">
            Free • Anonymous • Quick
          </p>
        </m.div>
      )}
    </AnimatePresence>
  );
}