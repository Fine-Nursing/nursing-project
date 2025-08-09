'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, Calendar, Clock, Award, ArrowRight } from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';

interface CompensationData {
  currentSalary: number;
  previousSalary?: number;
  hourlyRate: number;
  annualBonus?: number;
  overtime: number;
  differentials: {
    night?: number;
    weekend?: number;
    holiday?: number;
    charge?: number;
  };
  benefits?: {
    health: number;
    dental: number;
    retirement: number;
    pto: number;
  };
  marketComparison?: {
    average: number;
    percentile: number;
  };
}

interface AnimatedCompensationCardProps {
  data: CompensationData;
  showComparison?: boolean;
  showBreakdown?: boolean;
  variant?: 'default' | 'detailed' | 'compact';
  className?: string;
  onViewDetails?: () => void;
}

export default function AnimatedCompensationCard({
  data,
  variant = 'default',
  className = '',
  onViewDetails,
}: AnimatedCompensationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'breakdown' | 'comparison'>('overview');

  const salaryChange = data.previousSalary 
    ? ((data.currentSalary - data.previousSalary) / data.previousSalary) * 100
    : 0;

  const totalDifferentials = Object.values(data.differentials).reduce((sum, val) => sum + (val || 0), 0);
  const totalBenefitsValue = data.benefits 
    ? Object.values(data.benefits).reduce((sum, val) => sum + val, 0)
    : 0;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  if (variant === 'compact') {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className={`bg-white dark:bg-neutral-900 rounded-xl shadow-lg dark:shadow-xl border border-gray-100 dark:border-neutral-700 p-4 ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-400 to-teal-500 dark:from-emerald-500 dark:to-teal-600 rounded-lg shadow-lg shadow-emerald-500/25">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-neutral-400">Annual Salary</p>
              <AnimatedNumber
                value={data.currentSalary}
                prefix="$"
                className="text-lg font-bold text-gray-900 dark:text-white"
                format
              />
            </div>
          </div>
          {salaryChange !== 0 && (
            <div className={`flex items-center gap-1 ${salaryChange > 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
              {salaryChange > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="text-sm font-medium">
                {Math.abs(salaryChange).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={`bg-white dark:bg-neutral-900 rounded-2xl shadow-xl dark:shadow-2xl border border-gray-100 dark:border-neutral-700 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 dark:from-emerald-700 dark:to-green-800 p-6 text-white">
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Compensation Overview</h3>
            <p className="text-green-100 dark:text-green-100 mt-1">Your total compensation package</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.3 }}
            className="p-3 bg-white/20 rounded-full"
          >
            <DollarSign className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </div>

      {/* Navigation Tabs */}
      {variant === 'detailed' && (
        <div className="border-b border-gray-200 dark:border-neutral-700 dark:bg-neutral-800">
          <nav className="flex">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'breakdown', label: 'Breakdown' },
              { id: 'comparison', label: 'Market' },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-all
                  ${activeTab === tab.id 
                    ? 'border-violet-500 text-violet-600 dark:border-violet-400 dark:text-violet-400 dark:bg-violet-900/20' 
                    : 'border-transparent text-gray-600 dark:text-neutral-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-50 dark:hover:bg-neutral-700'
                  }
                `}
              >
                {tab.label}
              </motion.button>
            ))}
          </nav>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Main Salary */}
              <motion.div variants={itemVariants} className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-2">Current Annual Salary</p>
                <AnimatedNumber
                  value={data.currentSalary}
                  prefix="$"
                  className="text-4xl font-bold text-gray-900 dark:text-white"
                  format
                  duration={2}
                />
                {salaryChange !== 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 }}
                    className={`flex items-center justify-center gap-2 mt-2 ${
                      salaryChange > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {salaryChange > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="font-medium">
                      {salaryChange > 0 ? '+' : ''}{salaryChange.toFixed(1)}% from last year
                    </span>
                  </motion.div>
                )}
              </motion.div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-blue-50 dark:bg-slate-700/50 p-4 rounded-xl text-center border border-blue-100 dark:border-slate-600"
                >
                  <Clock className="w-5 h-5 text-blue-600 dark:text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-slate-400">Hourly Rate</p>
                  <AnimatedNumber
                    value={data.hourlyRate}
                    prefix="$"
                    className="font-bold text-blue-600 dark:text-slate-300"
                    duration={1.5}
                  />
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-purple-50 dark:bg-slate-700/50 p-4 rounded-xl text-center border border-purple-100 dark:border-slate-600"
                >
                  <Calendar className="w-5 h-5 text-purple-600 dark:text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-slate-400">Overtime</p>
                  <AnimatedNumber
                    value={data.overtime}
                    prefix="$"
                    className="font-bold text-purple-600 dark:text-slate-300"
                    duration={1.5}
                    format
                  />
                </motion.div>

                {data.annualBonus && (
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="bg-yellow-50 dark:bg-slate-700/50 p-4 rounded-xl text-center border border-yellow-100 dark:border-slate-600"
                  >
                    <Award className="w-5 h-5 text-amber-600 dark:text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-slate-400">Annual Bonus</p>
                    <AnimatedNumber
                      value={data.annualBonus}
                      prefix="$"
                      className="font-bold text-amber-600 dark:text-slate-300"
                      duration={1.5}
                      format
                    />
                  </motion.div>
                )}

                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-green-50 dark:bg-slate-700/50 p-4 rounded-xl text-center border border-green-100 dark:border-slate-600"
                >
                  <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-slate-400">Differentials</p>
                  <AnimatedNumber
                    value={totalDifferentials}
                    prefix="$"
                    className="font-bold text-emerald-600 dark:text-slate-300"
                    duration={1.5}
                    format
                  />
                </motion.div>
              </div>

              {/* Action Buttons */}
              <motion.div variants={itemVariants} className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex-1 bg-gray-100 dark:bg-slate-800/50 hover:bg-gray-200 dark:hover:bg-slate-700/50 text-gray-700 dark:text-slate-300 py-3 px-4 rounded-lg font-medium transition-all border border-gray-200 dark:border-slate-700/50"
                >
                  {isExpanded ? 'Hide Details' : 'View Details'}
                </motion.button>
                {onViewDetails && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onViewDetails}
                    className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 dark:from-violet-600 dark:to-purple-700 hover:from-violet-600 hover:to-purple-700 dark:hover:from-violet-700 dark:hover:to-purple-800 text-white py-3 px-4 rounded-lg font-medium shadow-lg shadow-purple-500/25 transition-all"
                  >
                    Full Report
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'breakdown' && (
            <motion.div
              key="breakdown"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h4 className="font-semibold text-lg">Compensation Breakdown</h4>
              
              {/* Differentials */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800/50 dark:to-slate-900/50 p-4 rounded-xl border border-gray-200 dark:border-slate-700/50">
                <h5 className="font-medium mb-3 text-gray-900 dark:text-white">Shift Differentials</h5>
                <div className="space-y-2">
                  {Object.entries(data.differentials).map(([type, amount]) => (
                    amount ? (
                      <div key={type} className="flex justify-between items-center">
                        <span className="capitalize text-gray-600 dark:text-gray-400">{type} Differential</span>
                        <AnimatedNumber
                          value={amount}
                          prefix="$"
                          className="font-medium"
                          duration={1}
                        />
                      </div>
                    ) : null
                  ))}
                </div>
              </div>

              {/* Benefits */}
              {data.benefits && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 p-4 rounded-xl border border-blue-100 dark:border-blue-500/20">
                  <h5 className="font-medium mb-3 text-gray-900 dark:text-white">Benefits Value</h5>
                  <div className="space-y-2">
                    {Object.entries(data.benefits).map(([type, amount]) => (
                      <div key={type} className="flex justify-between items-center">
                        <span className="capitalize text-gray-600 dark:text-gray-400">{type}</span>
                        <AnimatedNumber
                          value={amount}
                          prefix="$"
                          className="font-medium"
                          duration={1}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="border-t dark:border-slate-700 pt-2 mt-2">
                    <div className="flex justify-between items-center font-semibold">
                      <span className="dark:text-white">Total Benefits Value</span>
                      <AnimatedNumber
                        value={totalBenefitsValue}
                        prefix="$"
                        className="text-blue-600 dark:text-blue-400"
                        duration={1.5}
                        format
                      />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'comparison' && data.marketComparison && (
            <motion.div
              key="comparison"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h4 className="font-semibold text-lg">Market Comparison</h4>
              
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-500/10 dark:via-indigo-500/10 dark:to-purple-500/10 p-6 rounded-xl border border-indigo-100 dark:border-indigo-500/20 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Your Salary</p>
                    <AnimatedNumber
                      value={data.currentSalary}
                      prefix="$"
                      className="text-2xl font-bold text-gray-900 dark:text-white"
                      format
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Market Average</p>
                    <AnimatedNumber
                      value={data.marketComparison.average}
                      prefix="$"
                      className="text-2xl font-bold text-blue-600 dark:text-blue-400"
                      format
                    />
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">You&apos;re in the</p>
                  <AnimatedNumber
                    value={data.marketComparison.percentile}
                    suffix="th percentile"
                    className="text-lg font-bold text-green-600 dark:text-green-400"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700/50"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h5 className="font-medium dark:text-white">Additional Compensation</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Base Salary</span>
                      <span className="font-medium dark:text-white">${data.currentSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Overtime (YTD)</span>
                      <span className="font-medium dark:text-white">${data.overtime.toLocaleString()}</span>
                    </div>
                    {data.annualBonus && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Annual Bonus</span>
                        <span className="font-medium dark:text-white">${data.annualBonus.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h5 className="font-medium dark:text-white">Performance Metrics</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Compensation</span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        ${(data.currentSalary + data.overtime + (data.annualBonus || 0)).toLocaleString()}
                      </span>
                    </div>
                    {data.benefits && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Benefits Value</span>
                        <span className="font-medium dark:text-white">${totalBenefitsValue.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
export { AnimatedCompensationCard };
