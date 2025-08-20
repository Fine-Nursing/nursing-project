import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface HeroSectionProps {
  onOnboardingClick: () => void;
}

export function HeroSection({ onOnboardingClick }: HeroSectionProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });

  return (
    <section ref={heroRef} className="pt-20 pb-8 px-6 bg-gradient-to-b from-white via-emerald-50/30 to-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isHeroInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-[40px] leading-[1.1] font-semibold text-gray-900 mb-4 tracking-tight">
              Your nursing career
              <br />
              <span className="text-emerald-500">starts here</span>
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={isHeroInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-[17px] text-gray-600 leading-relaxed max-w-sm mx-auto"
          >
            Data-driven insights from 50,000+ nurses to guide your career decisions
          </motion.p>
        </div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-5 mb-6"
        >
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">$78</div>
              <div className="text-xs text-gray-500 mt-1">Avg hourly</div>
            </div>
            <div className="text-center border-x border-gray-200">
              <div className="text-2xl font-semibold text-gray-900">$162K</div>
              <div className="text-xs text-gray-500 mt-1">Avg yearly</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">24/7</div>
              <div className="text-xs text-gray-500 mt-1">Live data</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isHeroInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="space-y-3"
        >
          <button
            onClick={onOnboardingClick}
            className="w-full py-3.5 bg-emerald-500 text-white rounded-[14px] font-medium active:bg-emerald-600 transition-colors"
          >
            Get Started
          </button>
          <button 
            className="w-full py-3.5 text-emerald-600 font-medium"
          >
            Learn more →
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}