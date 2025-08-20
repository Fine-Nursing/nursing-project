import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineChartBar } from 'react-icons/hi';
import { SPECIALTIES, LOCATIONS, EXPERIENCE_LEVELS } from '../constants';
import type { CalculatorResult } from '../types';

interface SalaryCalculatorProps {
  selectedSpecialty: string;
  setSelectedSpecialty: (value: string) => void;
  selectedLocation: string;
  setSelectedLocation: (value: string) => void;
  selectedExperience: string;
  setSelectedExperience: (value: string) => void;
  calculatorResult: CalculatorResult | null;
  onOnboardingClick: () => void;
}

export function SalaryCalculator({
  selectedSpecialty,
  setSelectedSpecialty,
  selectedLocation,
  setSelectedLocation,
  selectedExperience,
  setSelectedExperience,
  calculatorResult,
  onOnboardingClick
}: SalaryCalculatorProps) {
  return (
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
          {SPECIALTIES.map(spec => (
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
          {LOCATIONS.map(state => (
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
        className="mb-7"
      >
        <label className="text-sm font-medium text-gray-700 mb-3 block">
          Experience Level
        </label>
        <div className="grid grid-cols-2 gap-2">
          {EXPERIENCE_LEVELS.map(exp => (
            <button
              key={exp}
              onClick={() => setSelectedExperience(exp)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all duration-200 ${
                selectedExperience === exp
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-700 active:bg-gray-200'
              }`}
            >
              {exp === 'beginner' ? '0-1 years' : 
               exp === 'junior' ? '1-3 years' :
               exp === 'experienced' ? '3-7 years' : '7+ years'}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {calculatorResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <HiOutlineChartBar className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold text-gray-900">Your Estimated Salary</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-emerald-600 mb-1">
                    ${calculatorResult.avg}/hr
                  </div>
                  <div className="text-sm text-gray-600">
                    Range: ${calculatorResult.min} - ${calculatorResult.max}/hr
                  </div>
                </div>
                
                <div className="pt-3 border-t border-emerald-200">
                  <div className="text-xl font-semibold text-gray-900">
                    ${calculatorResult.annual.toLocaleString()}/year
                  </div>
                  <div className="text-sm text-gray-600">
                    Based on 2,080 hours annually
                  </div>
                </div>

                {calculatorResult.dataPoints > 0 && (
                  <div className="text-xs text-gray-500">
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
  );
}