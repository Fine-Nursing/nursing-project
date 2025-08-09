'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useNursingTable } from 'src/api/useNursingTable';
import type { NursingTableParams } from 'src/api/useNursingTable';

// Modern icon libraries - react-icons
import { 
  HiOutlineSparkles,
  HiOutlineChartBar,
  HiOutlineTrendingUp,
  HiOutlineUserGroup,
  HiOutlineStar,
  HiCheck
} from 'react-icons/hi';
import {
  HiMiniSignal
} from 'react-icons/hi2';
import {
  PiMedalBold,
  PiHeartbeatBold,
  PiRocketLaunchBold
} from 'react-icons/pi';
import {
  RiPulseLine
} from 'react-icons/ri';

interface MobileSalaryDiscoveryProps {
  onOnboardingClick: () => void;
  onLoginClick?: () => void;
}

export default function MobileSalaryDiscovery({ onOnboardingClick, onLoginClick }: MobileSalaryDiscoveryProps) {
  const router = useRouter();
  const [tickerIndex, setTickerIndex] = useState(0);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedExperience, setSelectedExperience] = useState<string>('');
  const [showCalculatorResult, setShowCalculatorResult] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const statsRef = useRef<HTMLDivElement>(null);
  const isStatsInView = useInView(statsRef, { once: true });

  // API calls
  const { data: latestSalaries } = useNursingTable({
    limit: 10,
    sortBy: 'compensation',
    sortOrder: 'desc'
  }, {
    refetchOnWindowFocus: false,
    staleTime: 30000
  });

  const { data: topPositions } = useNursingTable({
    limit: 3,
    sortBy: 'compensation',
    sortOrder: 'desc'
  }, {
    refetchOnWindowFocus: false,
    staleTime: 60000
  });

  const calculatorParams: NursingTableParams = {};
  if (selectedSpecialty) calculatorParams.specialties = [selectedSpecialty];
  if (selectedLocation) calculatorParams.states = [selectedLocation];
  if (selectedExperience) calculatorParams.experienceGroups = [selectedExperience as any];
  
  const { data: filteredData, isError: isFilterError } = useNursingTable(
    Object.keys(calculatorParams).length > 0 ? calculatorParams : { limit: 100 },
    {
      enabled: showCalculatorResult,
      refetchOnWindowFocus: false,
      refetchOnMount: false
    }
  );

  // Auto-rotate ticker
  useEffect(() => {
    if (!latestSalaries?.data?.length) return;
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % latestSalaries.data.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [latestSalaries]);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Calculate results
  const calculatorResult = useMemo(() => {
    if (!showCalculatorResult) return null;
    
    if (filteredData?.data?.length) {
      const salaries = filteredData.data.map(d => d.compensation.hourly);
      const avg = Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length);
      const min = Math.min(...salaries);
      const max = Math.max(...salaries);
      const annual = Math.round(avg * 2080);
      return { min, avg, max, annual, dataPoints: filteredData.meta.total };
    }
    
    if (isFilterError && (selectedSpecialty || selectedLocation || selectedExperience)) {
      let baseRate = 75;
      if (selectedLocation === 'CA' || selectedLocation === 'NY') baseRate += 10;
      if (selectedLocation === 'TX' || selectedLocation === 'FL') baseRate -= 5;
      if (selectedSpecialty === 'ICU' || selectedSpecialty === 'Emergency') baseRate += 5;
      if (selectedSpecialty === 'NICU') baseRate += 8;
      if (selectedExperience === 'beginner') baseRate -= 10;
      if (selectedExperience === 'senior') baseRate += 15;
      if (selectedExperience === 'experienced') baseRate += 8;
      
      return {
        min: Math.round(baseRate - 15),
        avg: Math.round(baseRate),
        max: Math.round(baseRate + 20),
        annual: Math.round(baseRate * 2080),
        dataPoints: 0
      };
    }
    
    return null;
  }, [filteredData, showCalculatorResult, isFilterError, selectedSpecialty, selectedLocation, selectedExperience]);

  useEffect(() => {
    if (selectedSpecialty && selectedLocation && selectedExperience) {
      setShowCalculatorResult(true);
    }
  }, [selectedSpecialty, selectedLocation, selectedExperience]);

  return (
    <div className="min-h-screen bg-white">
      
      {/* Apple-style Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50">
        <div className="flex items-center justify-between px-5 py-4">
          <span className="font-semibold text-gray-900 text-[18px]">Nurse Journey</span>
          <div className="flex items-center gap-3">
            {onLoginClick && (
              <button
                onClick={onLoginClick}
                className="text-sm font-medium text-gray-700 active:text-gray-900 transition-colors"
              >
                Log In
              </button>
            )}
            <button
              onClick={onOnboardingClick}
              className="px-4 py-1.5 bg-emerald-500 text-white text-sm font-medium rounded-full transition-all duration-200 active:bg-emerald-600"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section - Apple Style */}
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

          {/* Stats Cards - Minimal */}
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

      {/* Salary Calculator - Apple Style */}
      <section className="px-6 py-10">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Calculate Your Worth</h2>
          <p className="text-gray-600">Get instant salary estimates based on your profile</p>
        </motion.div>

        {/* Specialty */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-7"
        >
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Specialty
          </label>
          <div className="flex flex-wrap gap-2">
            {['ICU', 'Emergency', 'Medical Surgical', 'NICU', 'Pediatric'].map(spec => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedSpecialty === spec
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-700 active:bg-gray-200'
                }`}
              >
                {spec === 'Medical Surgical' ? 'Med-Surg' : spec}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Location */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-7"
        >
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Location
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['CA', 'TX', 'FL', 'NY', 'IL'].map(state => (
              <button
                key={state}
                onClick={() => setSelectedLocation(state)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedLocation === state
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-700 active:bg-gray-200'
                }`}
              >
                {state}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Experience */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Experience
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'beginner', label: '0-2 years' },
              { value: 'junior', label: '2-5 years' },
              { value: 'experienced', label: '5-10 years' },
              { value: 'senior', label: '10+ years' }
            ].map(exp => (
              <button
                key={exp.value}
                onClick={() => setSelectedExperience(exp.value)}
                className={`py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedExperience === exp.value
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-700 active:bg-gray-200'
                }`}
              >
                {exp.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results - Clean Apple Style */}
        <AnimatePresence>
          {calculatorResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="bg-gradient-to-b from-emerald-50 to-teal-50 rounded-2xl p-6 mb-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Expected Salary Range</div>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="text-4xl font-semibold text-gray-900 mb-1"
                  >
                    ${calculatorResult.avg}/hr
                  </motion.div>
                  <div className="text-gray-600 mb-4">
                    ${calculatorResult.min} – ${calculatorResult.max} per hour
                  </div>
                  
                  <div className="pt-4 border-t border-emerald-100">
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="text-2xl font-semibold text-gray-900">
                          ${Math.round(calculatorResult.annual/1000)}K
                        </div>
                        <div className="text-xs text-gray-600">Annual salary</div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="text-2xl font-semibold text-emerald-600">
                          +{Math.round((calculatorResult.avg - 65) / 65 * 100)}%
                        </div>
                        <div className="text-xs text-gray-600">Above market</div>
                      </motion.div>
                    </div>
                  </div>

                  {calculatorResult.dataPoints > 0 && (
                    <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 mt-4">
                      <HiOutlineChartBar className="w-3.5 h-3.5" />
                      Based on {calculatorResult.dataPoints} data points
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={onOnboardingClick}
                className="w-full py-3.5 bg-emerald-500 text-white rounded-[14px] font-medium active:bg-emerald-600 transition-colors"
              >
                Get Personalized Analysis
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Live Updates - Minimal */}
      <section className="px-6 py-10 border-t border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <HiMiniSignal className="w-6 h-6 text-emerald-500" />
            <h2 className="text-xl font-semibold text-gray-900">Live Updates</h2>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-500">Live</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {latestSalaries?.data && latestSalaries.data[tickerIndex] && (
            <motion.div
              key={tickerIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="bg-gray-50 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-2xl font-semibold text-gray-900">
                    ${latestSalaries.data[tickerIndex].compensation.hourly}/hr
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {latestSalaries.data[tickerIndex].specialty} • {latestSalaries.data[tickerIndex].location}
                  </div>
                </div>
                <RiPulseLine className="w-5 h-5 text-emerald-500" />
              </div>
              
              {latestSalaries.data[tickerIndex].compensation.differentialBreakdown?.length > 0 && (
                <div className="flex gap-2">
                  {latestSalaries.data[tickerIndex].compensation.differentialBreakdown.slice(0, 2).map((diff, idx) => (
                    <span key={idx} className="text-xs text-gray-500">
                      +${diff.amount} {diff.type}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Top Positions */}
      <section className="px-6 py-10">
        <div className="flex items-center gap-2 mb-6">
          <PiMedalBold className="w-6 h-6 text-yellow-500" />
          <h2 className="text-xl font-semibold text-gray-900">Top Paying Positions</h2>
        </div>
        
        <div className="space-y-3">
          {topPositions?.data?.map((position, idx) => (
            <motion.div 
              key={position.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl active:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  {idx + 1}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{position.specialty}</div>
                  <div className="text-sm text-gray-500">{position.location}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">${position.compensation.hourly}/hr</div>
                {position.compensation.totalDifferential > 0 && (
                  <div className="text-xs text-emerald-600">+${position.compensation.totalDifferential}</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <button
          onClick={onOnboardingClick}
          className="w-full mt-6 py-3 text-emerald-600 font-medium"
        >
          View all positions →
        </button>
      </section>

      {/* Features - Apple Grid */}
      <section ref={statsRef} className="px-6 py-10 bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Why Nurse Journey</h2>
        
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-2xl p-5 text-center"
          >
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <HiOutlineTrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="text-2xl font-semibold text-gray-900">32%</div>
            <div className="text-xs text-gray-600 mt-1">Salary increase</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-2xl p-5 text-center"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <HiOutlineUserGroup className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-semibold text-gray-900">50K+</div>
            <div className="text-xs text-gray-600 mt-1">Active nurses</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-2xl p-5 text-center"
          >
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <HiOutlineStar className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-2xl font-semibold text-gray-900">4.9</div>
            <div className="text-xs text-gray-600 mt-1">User rating</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-2xl p-5 text-center"
          >
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <PiHeartbeatBold className="w-6 h-6 text-teal-600" />
            </div>
            <div className="text-2xl font-semibold text-gray-900">24/7</div>
            <div className="text-xs text-gray-600 mt-1">Live data</div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials - Simplified */}
      <section className="px-6 py-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">What nurses say</h2>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTestimonial}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-emerald-50 rounded-2xl p-6"
          >
            <HiOutlineSparkles className="w-5 h-5 text-emerald-500 mb-3" />
            <p className="text-gray-700 leading-relaxed mb-4">
              "{[
                'Nurse Journey helped me negotiate a 25% salary increase. The data gave me confidence.',
                'I discovered I was underpaid by $15/hr. Found a new position in 3 months.',
                'Real-time updates keep me informed. Essential tool for my career.'
              ][activeTestimonial]}"
            </p>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">
                  {['Sarah M.', 'James K.', 'Emily R.'][activeTestimonial]}
                </div>
                <div className="text-sm text-gray-600">
                  {['ICU Nurse', 'ER Nurse', 'NICU Nurse'][activeTestimonial]}
                </div>
              </div>
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === activeTestimonial ? 'w-6 bg-emerald-500' : 'w-1.5 bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* CTA Section - Clean */}
      <section className="px-6 py-12 bg-gradient-to-b from-emerald-500 to-teal-500">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-white mb-3">
            Start your journey today
          </h2>
          <p className="text-white/90 mb-8 text-lg">
            Join thousands of nurses taking control
          </p>
          
          <button
            onClick={onOnboardingClick}
            className="w-full py-4 bg-white text-emerald-600 rounded-[14px] font-semibold active:bg-gray-50 transition-colors"
          >
            Get Started Free
          </button>
          
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-white/80">
            <div className="flex items-center gap-1.5">
              <HiCheck className="w-4 h-4" />
              <span>No credit card</span>
            </div>
            <div className="flex items-center gap-1.5">
              <PiRocketLaunchBold className="w-4 h-4" />
              <span>100% free</span>
            </div>
          </div>
        </div>
      </section>

      {/* Add scrollbar hide styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}