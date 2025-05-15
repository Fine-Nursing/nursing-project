'use client';

import React, { useEffect, useState } from 'react';
import { Stethoscope, RefreshCw, Moon, Sun } from 'lucide-react';

import UserProfileCard from './UserProfileCard';
import CompensationAnalysis from './CompensationAnalysis';
import RadarAnalytics from './RadarAnalytics';
import PredictiveCompChart from './PredictiveCompChart';
import AiCareerInsights from './AiCareerInsights';
import NextSteps from './NextSteps';

import { payDistributionData as originalPayData } from './mockData';
import CareerDashboard from '../CareerDashboard/CareerDashboard';

// Example userProfile + region data
const userProfile = {
  name: 'Sarah Johnson',
  education: "Bachelor's Degree",
  role: 'Registered Nurse (RN)',
  specialty: 'ER',
  organization: 'NYU Langone',
  location: 'New York City, NY',
  experience: '4 years',
  hourlyRate: 36, // For chart demonstration
  annualSalary: 73840,
  differentials: { night: 2, weekend: 3, other: 1 },
  metrics: {
    basePay: 8.2,
    workStability: 7.5,
    benefits: 6.9,
    professionalGrowth: 7.8,
    workCulture: 6.5,
  },
};

const regionalAverages = {
  hourlyRate: 33.2,
  annualSalary: 69056,
  metrics: {
    basePay: 7.0,
    workStability: 6.5,
    benefits: 7.2,
    professionalGrowth: 6.8,
    workCulture: 7.0,
  },
};

const metricAnalysis: Record<string, string> = {
  basePay:
    'Your base pay is higher than regional average, indicating strong fundamentals.',
  workStability:
    'Scheduling stability is a bit above average. Good for consistent hours.',
  benefits:
    'Your benefits are slightly below the average. Consider negotiating more coverage or perks.',
  professionalGrowth:
    'Your facility strongly supports advanced certifications. Great for your career path!',
  workCulture:
    'Work-life balance metrics slightly below average. Keep an eye on potential burnout.',
};

export default function NurseDashboard() {
  const [loading, setLoading] = useState(true);
  const [dataRefreshDate] = useState(new Date().toLocaleDateString());
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // payDistributionData에 id 필드 추가
  const enhancedPayData = React.useMemo(
    () =>
      originalPayData.map((item, index) => ({
        ...item,
        id: `wage-${item.wageValue}-${index}`,
      })),
    []
  );

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Theme toggle
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Simple difference
  const calculateDifference = (user: number, avg: number) =>
    Math.round(((user - avg) / avg) * 100);

  // AI compensation insight
  const getCompensationInsight = () => {
    const diff = calculateDifference(
      userProfile.annualSalary,
      regionalAverages.annualSalary
    );
    return diff > 0
      ? `You're about ${diff}% above similar local RNs in total comp. Nice!`
      : `You're about ${Math.abs(diff)}% below average comp. Room to negotiate?`;
  };

  // Example monthly differentials
  const calculatePotentialDifferentials = () => {
    const nightHours = 32; // example
    const weekendHours = 24;
    const otherHours = 20;
    return (
      nightHours * userProfile.differentials.night +
      weekendHours * userProfile.differentials.weekend +
      otherHours * userProfile.differentials.other
    );
  };

  return (
    <div
      className={`min-h-screen ${
        theme === 'light' ? 'bg-emerald-50' : 'bg-slate-800 text-white'
      } p-6`}
    >
      {loading ? (
        // Loading Overlay
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-16 h-16 border-t-4 border-emerald-400 border-solid rounded-full animate-spin" />
          <p className="mt-4 text-lg font-medium text-emerald-600">
            Analyzing your data...
          </p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div
                className={`${
                  theme === 'light' ? 'bg-emerald-100' : 'bg-slate-700'
                } p-2 rounded-full mr-3`}
              >
                <Stethoscope className="w-6 h-6 text-emerald-500" />
              </div>
              <h1
                className={`text-3xl font-bold ${
                  theme === 'light' ? 'text-emerald-700' : 'text-emerald-300'
                }`}
              >
                Nurse Pay Buddy
              </h1>
            </div>
            {/* Theme Toggle + Data Refresh Info */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={toggleTheme}
                className={`p-2 rounded-full ${
                  theme === 'light'
                    ? 'bg-emerald-100 text-emerald-500'
                    : 'bg-slate-700 text-emerald-300'
                }`}
              >
                {theme === 'light' ? <Moon /> : <Sun />}
              </button>
              <div className="flex items-center text-sm">
                <RefreshCw className="w-4 h-4 mr-1" />
                <span>Data updated: {dataRefreshDate}</span>
              </div>
            </div>
          </div>

          {/* User Profile Card */}
          <UserProfileCard userProfile={userProfile} theme={theme} />

          {/* Two-column: Compensation & Radar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <CompensationAnalysis
              userProfile={userProfile}
              theme={theme}
              getCompensationInsight={getCompensationInsight}
              calculatePotentialDifferentials={calculatePotentialDifferentials}
            />
            <RadarAnalytics
              userMetrics={userProfile.metrics}
              avgMetrics={regionalAverages.metrics}
              theme={theme}
              metricAnalysis={metricAnalysis}
            />
          </div>

          {/* PredictiveCompChart + CareerPathTimeline */}
          <div
            className={`${
              theme === 'light' ? 'bg-white' : 'bg-slate-700'
            } rounded-2xl shadow-lg p-6 mb-6 border ${
              theme === 'light' ? 'border-emerald-100' : 'border-slate-600'
            }`}
          >
            <PredictiveCompChart
              payDistributionData={enhancedPayData}
              userHourlyRate={userProfile.hourlyRate}
              regionalAvgWage={regionalAverages.hourlyRate}
              theme={theme}
            />

            <CareerDashboard theme={theme} />
          </div>

          {/* Bottom row: AI Career + Next Steps */}
          <div className="flex flex-col md:flex-row items-start gap-4 mb-6">
            <AiCareerInsights theme={theme} />
            <NextSteps theme={theme} />
          </div>

          {/* NurseShiftScheduler */}
          {/* <NurseShiftScheduler /> */}

          {/* Footer */}
          <div
            className={`mt-6 text-center text-sm ${
              theme === 'light' ? 'text-gray-500' : 'text-gray-300'
            }`}
          >
            <p>
              Analytics processed by NursePayBuddy™ AI | Last updated{' '}
              {dataRefreshDate}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
