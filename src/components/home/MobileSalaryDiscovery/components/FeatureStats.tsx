import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  HiOutlineTrendingUp,
  HiOutlineUserGroup,
  HiOutlineStar,
} from 'react-icons/hi';
import { PiHeartbeatBold } from 'react-icons/pi';

export function FeatureStats() {
  const statsRef = useRef<HTMLDivElement>(null);
  const isStatsInView = useInView(statsRef, { once: true });

  const features = [
    {
      icon: HiOutlineTrendingUp,
      color: 'emerald',
      value: '32%',
      label: 'Salary increase',
      delay: 0
    },
    {
      icon: HiOutlineUserGroup,
      color: 'blue',
      value: '50K+',
      label: 'Active nurses',
      delay: 0.1
    },
    {
      icon: HiOutlineStar,
      color: 'yellow',
      value: '4.9',
      label: 'User rating',
      delay: 0.2
    },
    {
      icon: PiHeartbeatBold,
      color: 'teal',
      value: '24/7',
      label: 'Live data',
      delay: 0.3
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string }> = {
      emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
      teal: { bg: 'bg-teal-100', text: 'text-teal-600' }
    };
    return colorMap[color] || { bg: 'bg-gray-100', text: 'text-gray-600' };
  };

  return (
    <section ref={statsRef} className="px-6 py-10 bg-gray-50">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Why Nurse Journey</h2>
      
      <div className="grid grid-cols-2 gap-3">
        {features.map((feature, idx) => {
          const colors = getColorClasses(feature.color);
          const Icon = feature.icon;
          
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: feature.delay, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-2xl p-5 text-center"
            >
              <div className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <Icon className={`w-6 h-6 ${colors.text}`} />
              </div>
              <div className="text-2xl font-semibold text-gray-900">{feature.value}</div>
              <div className="text-xs text-gray-600 mt-1">{feature.label}</div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}