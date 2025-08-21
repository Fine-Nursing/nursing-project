'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNursingTable } from 'src/api/useNursingTable';

// Hooks
import { useSalaryCalculator } from './hooks/useSalaryCalculator';
import { useAutoRotate } from './hooks/useAutoRotate';

// Components
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { SalaryCalculator } from './components/SalaryCalculator';
import { LiveUpdates } from './components/LiveUpdates';
import { TopPositions } from './components/TopPositions';
import { FeatureStats } from './components/FeatureStats';
import { Testimonials } from './components/Testimonials';
import { CTASection } from './components/CTASection';

// Constants
import { TICKER_INTERVAL, TESTIMONIAL_INTERVAL, TESTIMONIALS } from './constants';

// Types
import type { MobileSalaryDiscoveryProps } from './types';

export default function MobileSalaryDiscovery({ onOnboardingClick, onLoginClick }: MobileSalaryDiscoveryProps) {
  const router = useRouter();
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedExperience, setSelectedExperience] = useState<string>('');
  const [showCalculatorResult, setShowCalculatorResult] = useState(false);

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

  // Custom hooks
  const calculatorResult = useSalaryCalculator({
    selectedSpecialty,
    selectedLocation,
    selectedExperience,
    showCalculatorResult
  });

  const tickerIndex = useAutoRotate(
    latestSalaries?.data?.length || 0,
    TICKER_INTERVAL
  );

  const activeTestimonial = useAutoRotate(
    TESTIMONIALS.length,
    TESTIMONIAL_INTERVAL
  );

  // Show calculator results when all fields are selected
  useEffect(() => {
    if (selectedSpecialty && selectedLocation && selectedExperience) {
      setShowCalculatorResult(true);
    }
  }, [selectedSpecialty, selectedLocation, selectedExperience]);

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onLoginClick={onLoginClick}
        onOnboardingClick={onOnboardingClick}
      />
      
      <HeroSection onOnboardingClick={onOnboardingClick} />
      
      <SalaryCalculator
        selectedSpecialty={selectedSpecialty}
        setSelectedSpecialty={setSelectedSpecialty}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        selectedExperience={selectedExperience}
        setSelectedExperience={setSelectedExperience}
        calculatorResult={calculatorResult}
        onOnboardingClick={onOnboardingClick}
      />
      
      <LiveUpdates 
        latestSalaries={latestSalaries}
        tickerIndex={tickerIndex}
      />
      
      <TopPositions 
        topPositions={topPositions}
        onOnboardingClick={onOnboardingClick}
      />
      
      <FeatureStats />
      
      <Testimonials activeTestimonial={activeTestimonial} />
      
      <CTASection onOnboardingClick={onOnboardingClick} />

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