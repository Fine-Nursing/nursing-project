'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  format?: boolean;
}

export function AnimatedNumber({
  value,
  duration = 2,
  delay = 0,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
  format = true,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => {
    const formatted = decimals > 0 
      ? latest.toFixed(decimals)
      : Math.round(latest).toString();
    
    if (format) {
      const num = parseFloat(formatted);
      return num.toLocaleString('en-US', { 
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals 
      });
    }
    return formatted;
  });
  
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const animation = animate(motionValue, value, {
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1],
      });

      return animation.stop;
    }
  }, [motionValue, value, duration, delay, isInView]);

  return (
    <motion.span 
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.3, delay }}
    >
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </motion.span>
  );
}

// 퍼센트 애니메이션
export function AnimatedPercentage({
  value,
  duration = 1.5,
  delay = 0,
  className = '',
  showSign = true,
}: {
  value: number;
  duration?: number;
  delay?: number;
  className?: string;
  showSign?: boolean;
}) {
  const isPositive = value >= 0;
  const textColor = isPositive ? 'text-green-600' : 'text-red-600';
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {showSign && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + 0.2 }}
          className={textColor}
        >
          {isPositive ? '↑' : '↓'}
        </motion.span>
      )}
      <AnimatedNumber
        value={Math.abs(value)}
        duration={duration}
        delay={delay}
        suffix="%"
        decimals={1}
        className={`font-bold ${textColor}`}
      />
    </div>
  );
}

// 급여 카운터
export function AnimatedSalary({
  value,
  duration = 2,
  delay = 0,
  period = 'year',
  className = '',
}: {
  value: number;
  duration?: number;
  delay?: number;
  period?: 'hour' | 'month' | 'year';
  className?: string;
}) {
  const periodLabel = {
    hour: '/hr',
    month: '/mo',
    year: '/yr',
  };

  return (
    <div className={`flex items-baseline gap-1 ${className}`}>
      <motion.span
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        className="text-lg font-medium"
      >
        $
      </motion.span>
      <AnimatedNumber
        value={value}
        duration={duration}
        delay={delay}
        className="text-3xl font-bold"
        format
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + duration - 0.5 }}
        className="text-sm text-gray-500"
      >
        {periodLabel[period]}
      </motion.span>
    </div>
  );
}

// 통계 카드 with 애니메이션
export function AnimatedStatCard({
  title,
  value,
  change,
  icon,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}: {
  title: string;
  value: number;
  change?: number;
  icon?: React.ReactNode;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <AnimatedNumber
            value={value}
            prefix={prefix}
            suffix={suffix}
            decimals={decimals}
            className="text-3xl font-bold text-gray-900"
            duration={1.5}
          />
        </div>
        {icon && (
          <motion.div
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.5 }}
            className="p-3 bg-primary-100 rounded-xl"
          >
            {icon}
          </motion.div>
        )}
      </div>
      
      {change !== undefined && (
        <AnimatedPercentage
          value={change}
          delay={0.5}
          className="text-sm"
        />
      )}
    </motion.div>
  );
}