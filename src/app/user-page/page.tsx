'use client';

import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  RefreshCw,
  Moon,
  Sun,
  Clipboard,
  Award,
  Star,
  User,
  Smile,
  Gift,
  ArrowUp,
  ArrowDown,
  Calendar,
  TrendingUp,
  Coffee,
} from 'lucide-react';
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import CareerPathTimeline from 'src/components/user-page/CareerPathTimeLine';
import NurseShiftScheduler from 'src/components/user-page/Schedular';

/** Cute label for "Your Wage" on the reference line */
function CuteWageLabel({ viewBox, wage }) {
  if (!viewBox) return null;
  const { x, y } = viewBox;
  // Position the bubble slightly above the line
  const bubbleX = x - 60;
  const bubbleY = y - 46;
  return (
    <foreignObject x={bubbleX} y={bubbleY} width={120} height={40}>
      <div className="flex items-center justify-center bg-pink-100 text-pink-700 px-2 py-1 rounded-full shadow-md text-xs">
        <Star className="w-3 h-3 mr-1" />
        <span>Your Wage (${wage.toFixed(2)})</span>
      </div>
    </foreignObject>
  );
}

/**
 * The main NurseDashboard component with:
 *  - The top header / theme toggle
 *  - Profile Card (Sarah Johnson)
 *  - Advanced analytics with Radar chart
 *  - Predictive Compensation (BarChart)
 *  - Career Path Timeline
 *  - Nurse Shift Scheduler
 */
function NurseDashboard() {
  const [loading, setLoading] = useState(true);
  const [dataRefreshed, setDataRefreshed] = useState(
    new Date().toLocaleDateString()
  );
  const [showTooltip, setShowTooltip] = useState(null);
  const [theme, setTheme] = useState('light');

  // Example user profile
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

  // Example regional data
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
    confidence: { low: 67500, high: 71200 },
  };

  /**
   * Example pay distribution data for the BarChart:
   *  - wageValue = numeric wage for X-axis
   *  - count = # of nurses at that wage
   *  - highlight / isUser flags
   */
  const payDistributionData = [
    { label: '$25', wageValue: 25, count: 10 },
    { label: '$26', wageValue: 26, count: 15 },
    { label: '$27', wageValue: 27, count: 25 },
    { label: '$28', wageValue: 28, count: 30 },
    { label: '$29', wageValue: 29, count: 35 },
    { label: '$30', wageValue: 30, count: 40 },
    { label: '$31', wageValue: 31, count: 50 },
    { label: '$32', wageValue: 32, count: 60 },
    { label: '$33', wageValue: 33, count: 72 },
    { label: '$34', wageValue: 34, count: 85 },
    { label: '$35', wageValue: 35, count: 100, highlight: true },
    { label: '$36', wageValue: 36, count: 115, highlight: true, isUser: true },
    { label: '$37', wageValue: 37, count: 95 },
    { label: '$38', wageValue: 38, count: 80 },
    { label: '$39', wageValue: 39, count: 65 },
    { label: '$40', wageValue: 40, count: 50 },
    { label: '$41', wageValue: 41, count: 40 },
    { label: '$42', wageValue: 42, count: 30 },
    { label: '$43', wageValue: 43, count: 25 },
    { label: '$44', wageValue: 44, count: 20 },
    { label: '$45+', wageValue: 45, count: 30 },
  ];

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

  // Simple difference calc
  const calculateDifference = (user, avg) =>
    Math.round(((user - avg) / avg) * 100);

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

  // Radar chart computations
  const calculateRadarPoints = (metrics, radius) => {
    const categories = Object.keys(metrics); // 5 total
    const angleSlice = (Math.PI * 2) / categories.length;
    const points = [];

    categories.forEach((cat, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const value = metrics[cat] / 10; // convert 0-10 to 0-1
      const cx = 160;
      const cy = 160;
      const x = cx + radius * value * Math.cos(angle);
      const y = cy + radius * value * Math.sin(angle);
      points.push({ x, y, label: cat, value: metrics[cat] });
    });
    return points;
  };

  // Generate user & average points for the radar
  const userPoints = calculateRadarPoints(userProfile.metrics, 120);
  const avgPoints = calculateRadarPoints(regionalAverages.metrics, 120);

  const createPolygonPoints = (points) =>
    points.map((p) => `${p.x},${p.y}`).join(' ');

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

  // Radar metric text
  const metricAnalysis = {
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

  return (
    <div
      className={`min-h-screen ${
        theme === 'light' ? 'bg-teal-50' : 'bg-slate-800 text-white'
      } p-6`}
    >
      {loading ? (
        // Loading Overlay
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-16 h-16 border-t-4 border-teal-400 border-solid rounded-full animate-spin" />
          <p className="mt-4 text-lg font-medium text-teal-600">
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
                  theme === 'light' ? 'bg-teal-100' : 'bg-slate-700'
                } p-2 rounded-full mr-3`}
              >
                <Stethoscope className="w-6 h-6 text-teal-500" />
              </div>
              <h1
                className={`text-3xl font-bold ${
                  theme === 'light' ? 'text-teal-700' : 'text-teal-300'
                }`}
              >
                Nurse Pay Buddy
              </h1>
            </div>
            {/* Theme Toggle + Data Refresh Info */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full ${
                  theme === 'light'
                    ? 'bg-teal-100 text-teal-500'
                    : 'bg-slate-700 text-teal-300'
                }`}
              >
                {theme === 'light' ? <Moon /> : <Sun />}
              </button>
              <div className="flex items-center text-sm">
                <RefreshCw className="w-4 h-4 mr-1" />
                <span>Data updated: {dataRefreshed}</span>
              </div>
            </div>
          </div>

          {/* Profile Card */}
          <div
            className={`${
              theme === 'light' ? 'bg-white' : 'bg-slate-700'
            } rounded-2xl shadow-lg p-6 mb-6 relative border ${
              theme === 'light' ? 'border-teal-100' : 'border-slate-600'
            }`}
          >
            {/* "AI Personalized" Ribbon */}
            <div className="absolute top-0 right-0 bg-gradient-to-bl from-teal-400 to-cyan-500 text-white px-3 py-1 rounded-bl-lg flex items-center">
              <Star className="w-4 h-4 mr-1" />
              <span className="text-xs font-medium">AI Personalized</span>
            </div>

            <div className="flex flex-wrap">
              {/* Profile Image */}
              <div className="w-full md:w-1/4 flex justify-center mb-4 md:mb-0">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-teal-100 to-cyan-100 flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full border-4 border-teal-200 border-t-teal-500 animate-spin-slow" />
                  <User className="w-16 h-16 text-teal-500" />
                </div>
              </div>

              {/* Info */}
              <div className="w-full md:w-3/4 md:pl-6 space-y-2">
                <h2
                  className={`text-2xl font-bold flex items-center ${
                    theme === 'light' ? 'text-teal-700' : ''
                  }`}
                >
                  {userProfile.name}
                  <div
                    className={`ml-2 ${
                      theme === 'light' ? 'bg-teal-100' : 'bg-slate-600'
                    } p-1 rounded-full`}
                  >
                    <Award className="w-4 h-4 text-teal-500" />
                  </div>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <span className="font-semibold w-24">Role:</span>
                      <span className="flex items-center">
                        {userProfile.role}
                        <Stethoscope className="w-4 h-4 ml-1 text-teal-500" />
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-semibold w-24">Specialty:</span>
                      <span>{userProfile.specialty}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-semibold w-24">Education:</span>
                      <span>{userProfile.education}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <span className="font-semibold w-24">Org:</span>
                      <span>{userProfile.organization}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-semibold w-24">Location:</span>
                      <span>{userProfile.location}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-semibold w-24">Experience:</span>
                      <span className="flex items-center">
                        {userProfile.experience}
                        <Award className="w-4 h-4 ml-1 text-yellow-500" />
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={`${
                    theme === 'light'
                      ? 'bg-teal-50 border-teal-100'
                      : 'bg-slate-600 border-slate-500'
                  } border rounded-2xl p-4 text-sm flex items-start mt-2`}
                >
                  <div
                    className={`bg-white p-2 rounded-full mr-3 flex-shrink-0 ${
                      theme === 'light' ? '' : 'border border-slate-400'
                    }`}
                  >
                    <Smile className="w-5 h-5 text-teal-500" />
                  </div>
                  <div>
                    <span className="font-medium">AI Advisor:</span> You’re on
                    track for a 3-5% raise soon. Consider trauma specialization
                    for +8-12% market value.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compensation & Radar Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Compensation Analysis */}
            <div
              className={`${
                theme === 'light' ? 'bg-white' : 'bg-slate-700'
              } rounded-2xl shadow-lg p-6 border ${
                theme === 'light' ? 'border-teal-100' : 'border-slate-600'
              } space-y-4`}
            >
              <h2 className="text-xl font-bold flex items-center">
                <Coffee className="w-5 h-5 mr-2 text-teal-500" />
                Compensation Analysis
                <div className="ml-2 bg-teal-100 text-teal-600 text-xs px-2 py-0.5 rounded-full">
                  AI Powered
                </div>
              </h2>

              <div
                className={`border-b ${
                  theme === 'light' ? 'border-gray-200' : 'border-slate-600'
                } pb-4 space-y-3`}
              >
                <div className="flex justify-between items-center">
                  <div>My hourly rate:</div>
                  <div className="font-bold text-lg flex items-center">
                    <span
                      className={`${
                        theme === 'light' ? 'bg-teal-50' : 'bg-slate-600'
                      } p-1 rounded-lg flex items-center mr-2`}
                    >
                      <Gift className="w-4 h-4 mr-1 text-teal-500" />
                    </span>
                    ${userProfile.hourlyRate.toFixed(2)}
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div>Annual equivalent:</div>
                  <div className="font-medium">
                    ${userProfile.annualSalary.toLocaleString()}
                  </div>
                </div>
                <div
                  className={`mt-2 text-sm ${
                    theme === 'light'
                      ? 'bg-teal-50 border-teal-100'
                      : 'bg-slate-600 border-slate-500'
                  } border rounded-2xl p-3`}
                >
                  {getCompensationInsight()}
                </div>
              </div>

              <h3 className="font-medium text-teal-600">
                Additional Differentials
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div
                  className={`p-3 rounded-2xl text-center border ${
                    theme === 'light'
                      ? 'bg-teal-50 border-teal-100'
                      : 'bg-slate-600 border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-center mb-1 text-sm">
                    <Moon className="w-4 h-4 mr-1 text-teal-400" />
                    <span>Night</span>
                  </div>
                  <div className="font-bold text-teal-700">
                    +${userProfile.differentials.night}/hr
                  </div>
                </div>
                <div
                  className={`p-3 rounded-2xl text-center border ${
                    theme === 'light'
                      ? 'bg-teal-50 border-teal-100'
                      : 'bg-slate-600 border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-center mb-1 text-sm">
                    <Calendar className="w-4 h-4 mr-1 text-teal-400" />
                    <span>Weekend</span>
                  </div>
                  <div className="font-bold text-teal-700">
                    +${userProfile.differentials.weekend}/hr
                  </div>
                </div>
                <div
                  className={`p-3 rounded-2xl text-center border ${
                    theme === 'light'
                      ? 'bg-teal-50 border-teal-100'
                      : 'bg-slate-600 border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-center mb-1 text-sm">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    <span>Other</span>
                  </div>
                  <div className="font-bold text-teal-700">
                    +${userProfile.differentials.other}/hr
                  </div>
                </div>
              </div>

              <div
                className={`text-sm border rounded-2xl p-4 flex items-center ${
                  theme === 'light'
                    ? 'bg-cyan-50 border-cyan-100'
                    : 'bg-slate-600 border-slate-500'
                }`}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-teal-300 to-cyan-300 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-white font-bold">AI</span>
                </div>
                <div>
                  <span className="font-medium">
                    Potential monthly additional earnings:
                  </span>
                  <span className="font-bold text-teal-600 ml-1">
                    ${calculatePotentialDifferentials()}
                  </span>
                </div>
              </div>

              <h3 className="font-medium text-teal-600">Suggested Actions</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <div className="bg-green-100 rounded-full p-1 mr-2 mt-0.5">
                    <ArrowUp className="w-3 h-3 text-green-600" />
                  </div>
                  <div>Q3 performance review for 3-5% raise</div>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 rounded-full p-1 mr-2 mt-0.5">
                    <ArrowUp className="w-3 h-3 text-green-600" />
                  </div>
                  <div>TNCC cert for trauma → higher differentials</div>
                </li>
                <li className="flex items-start">
                  <div className="bg-red-100 rounded-full p-1 mr-2 mt-0.5">
                    <ArrowDown className="w-3 h-3 text-red-600" />
                  </div>
                  <div>401k contributions below recommended stage</div>
                </li>
              </ul>
            </div>

            {/* Radar / Advanced Analytics */}
            <div
              className={`${
                theme === 'light' ? 'bg-white' : 'bg-slate-700'
              } rounded-2xl shadow-lg p-6 border ${
                theme === 'light' ? 'border-teal-100' : 'border-slate-600'
              } space-y-3`}
            >
              <h2 className="text-xl font-bold flex items-center">
                <Award className="w-5 h-5 mr-2 text-teal-500" />
                <span>Advanced Analytics</span>
                <div className="ml-2 bg-teal-100 text-teal-600 text-xs px-2 py-0.5 rounded-full">
                  AI Powered
                </div>
              </h2>

              <div className="relative">
                <svg
                  width="320"
                  height="320"
                  viewBox="0 0 320 320"
                  className="mx-auto"
                >
                  {/* Background circles */}
                  <circle
                    cx="160"
                    cy="160"
                    r="120"
                    fill="none"
                    stroke={theme === 'light' ? '#e5e7eb' : '#4b5563'}
                    strokeWidth="1"
                  />
                  <circle
                    cx="160"
                    cy="160"
                    r="90"
                    fill="none"
                    stroke={theme === 'light' ? '#e5e7eb' : '#4b5563'}
                    strokeWidth="1"
                  />
                  <circle
                    cx="160"
                    cy="160"
                    r="60"
                    fill="none"
                    stroke={theme === 'light' ? '#e5e7eb' : '#4b5563'}
                    strokeWidth="1"
                  />
                  <circle
                    cx="160"
                    cy="160"
                    r="30"
                    fill="none"
                    stroke={theme === 'light' ? '#e5e7eb' : '#4b5563'}
                    strokeWidth="1"
                  />

                  {/* Axes */}
                  <line
                    x1="160"
                    y1="40"
                    x2="160"
                    y2="280"
                    stroke={theme === 'light' ? '#e5e7eb' : '#4b5563'}
                    strokeWidth="1"
                  />
                  <line
                    x1="40"
                    y1="160"
                    x2="280"
                    y2="160"
                    stroke={theme === 'light' ? '#e5e7eb' : '#4b5563'}
                    strokeWidth="1"
                  />

                  {/* Diagonals */}
                  <line
                    x1="76"
                    y1="76"
                    x2="244"
                    y2="244"
                    stroke={theme === 'light' ? '#e5e7eb' : '#4b5563'}
                    strokeWidth="1"
                  />
                  <line
                    x1="244"
                    y1="76"
                    x2="76"
                    y2="244"
                    stroke={theme === 'light' ? '#e5e7eb' : '#4b5563'}
                    strokeWidth="1"
                  />

                  {/* Average polygon */}
                  <polygon
                    points={createPolygonPoints(avgPoints)}
                    fill="rgba(20, 184, 166, 0.1)"
                    stroke="#14b8a6"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                  />

                  {/* User polygon with glow */}
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feFlood
                      floodColor="#14b8a6"
                      floodOpacity="0.5"
                      result="color"
                    />
                    <feComposite
                      in="color"
                      in2="blur"
                      operator="in"
                      result="shadow"
                    />
                    <feComposite
                      in="SourceGraphic"
                      in2="shadow"
                      operator="over"
                    />
                  </filter>
                  <polygon
                    points={createPolygonPoints(userPoints)}
                    fill="rgba(20,184,166,0.3)"
                    stroke="#14b8a6"
                    strokeWidth="2"
                    filter="url(#glow)"
                  />

                  {/* Points */}
                  {userPoints.map((pt, i) => (
                    <g key={i}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="4"
                        fill="#14b8a6"
                        className="cursor-pointer hover:r-6 transition-all duration-300"
                        onMouseEnter={() => setShowTooltip(pt.label)}
                        onMouseLeave={() => setShowTooltip(null)}
                      />
                      {showTooltip === pt.label && (
                        <foreignObject
                          x={pt.x - 80}
                          y={pt.y - 50}
                          width="160"
                          height="60"
                        >
                          <div
                            className={`shadow-lg rounded-2xl p-3 text-xs border ${
                              theme === 'light'
                                ? 'bg-white border-teal-200 text-gray-800'
                                : 'bg-slate-700 border-slate-600 text-white'
                            }`}
                          >
                            <div className="font-bold text-teal-600 mb-1">
                              {pt.label}: {pt.value.toFixed(1)}
                            </div>
                            <div>{metricAnalysis[pt.label]}</div>
                          </div>
                        </foreignObject>
                      )}
                    </g>
                  ))}

                  {/* Category labels around the circle */}
                  {Object.keys(userProfile.metrics).map((cat, i) => {
                    const angleSlice = (Math.PI * 2) / 5;
                    const angle = angleSlice * i - Math.PI / 2;
                    const labelRadius = 140;
                    const labelX = 160 + labelRadius * Math.cos(angle);
                    const labelY = 160 + labelRadius * Math.sin(angle);
                    return (
                      <text
                        key={i}
                        x={labelX}
                        y={labelY}
                        textAnchor="middle"
                        fontSize="12"
                        fill={theme === 'light' ? '#374151' : '#e5e7eb'}
                        dy="4"
                      >
                        {cat}
                      </text>
                    );
                  })}
                </svg>
              </div>

              <div
                className={`p-3 rounded-2xl border text-sm ${
                  theme === 'light'
                    ? 'bg-teal-50 border-teal-200'
                    : 'bg-slate-600 border-slate-500 text-white'
                }`}
              >
                <p
                  className={`font-medium mb-2 ${
                    theme === 'light' ? 'text-teal-700' : 'text-teal-300'
                  }`}
                >
                  AI Observations for Each Metric
                </p>
                <ul
                  className={`list-disc list-inside space-y-1 ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                  }`}
                >
                  <li>{metricAnalysis.basePay}</li>
                  <li>{metricAnalysis.workStability}</li>
                  <li>{metricAnalysis.benefits}</li>
                  <li>{metricAnalysis.professionalGrowth}</li>
                  <li>{metricAnalysis.workCulture}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Predictive Compensation Comparison (BarChart) */}
          <div
            className={`${
              theme === 'light' ? 'bg-white' : 'bg-slate-700'
            } rounded-2xl shadow-lg p-6 mb-6 border ${
              theme === 'light' ? 'border-teal-100' : 'border-slate-600'
            }`}
          >
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-teal-500" />
              <span>Predictive Compensation Comparison</span>
              <div className="ml-2 bg-teal-100 text-teal-600 text-xs px-2 py-0.5 rounded-full">
                AI Powered
              </div>
            </h2>

            <div
              className={`mb-6 ${
                theme === 'light'
                  ? 'bg-gradient-to-r from-teal-50 to-cyan-50'
                  : 'bg-slate-600'
              } rounded-2xl shadow-md p-5 border ${
                theme === 'light' ? 'border-teal-100' : 'border-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={`font-bold text-xl ${
                    theme === 'light' ? 'text-gray-800' : 'text-white'
                  } flex items-center`}
                >
                  <Stethoscope className="w-5 h-5 mr-2 text-teal-500" />
                  ER Average Pay in New York City, NY
                </h3>
                <div className="px-3 py-1 rounded-full bg-teal-100 text-teal-600 text-xs font-medium flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  Live Data
                </div>
              </div>

              {/* The updated BarChart with domain & margin fix */}
              <div className="w-full" style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={payDistributionData}
                    margin={{ top: 40, right: 50, bottom: 40, left: 50 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={theme === 'light' ? '#f3f4f6' : '#374151'}
                    />
                    <XAxis
                      type="number"
                      dataKey="wageValue"
                      domain={[24, 46]}
                      tick={{
                        fill: theme === 'light' ? '#6b7280' : '#e5e7eb',
                        fontSize: 12,
                      }}
                      label={{
                        value: 'Hourly Wage ($)',
                        position: 'insideBottomRight',
                        offset: -5,
                        style: {
                          fill: theme === 'light' ? '#6b7280' : '#e5e7eb',
                          fontSize: 12,
                        },
                      }}
                    />
                    <YAxis
                      dataKey="count"
                      tick={{
                        fill: theme === 'light' ? '#6b7280' : '#e5e7eb',
                        fontSize: 12,
                      }}
                      label={{
                        value: 'Number of Nurses',
                        angle: -90,
                        position: 'insideLeft',
                        style: {
                          fill: theme === 'light' ? '#6b7280' : '#e5e7eb',
                          fontSize: 12,
                        },
                      }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const {
                            count,
                            label: displayLabel,
                            isUser,
                          } = payload[0].payload;
                          return (
                            <div
                              className={`p-3 ${
                                theme === 'light' ? 'bg-white' : 'bg-slate-700'
                              } shadow-lg rounded-2xl border ${
                                theme === 'light'
                                  ? 'border-teal-100'
                                  : 'border-slate-600'
                              }`}
                            >
                              <p className="font-semibold">
                                Wage: {displayLabel}
                              </p>
                              <p className="text-teal-600 font-medium flex items-center">
                                <User className="w-3 h-3 mr-1" />
                                Nurses: {count} {isUser && '← Your wage'}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    {/* ReferenceLine for user wage */}
                    <ReferenceLine
                      x={userProfile.hourlyRate}
                      stroke="#0d9488"
                      strokeWidth={2}
                      isFront
                      label={<CuteWageLabel wage={userProfile.hourlyRate} />}
                    />
                    {/* ReferenceLine for regional average */}
                    <ReferenceLine
                      x={regionalAverages.hourlyRate}
                      stroke="#14b8a6"
                      strokeWidth={2}
                      strokeDasharray="3 3"
                      label={{
                        value: 'Regional Avg',
                        position: 'top',
                        fill: '#14b8a6',
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                      {payDistributionData.map((entry, index) => {
                        let fillColor = '#5eead4'; // Teal-200
                        if (entry.isUser)
                          fillColor = '#0d9488'; // Teal-600
                        else if (entry.highlight) fillColor = '#14b8a6'; // Teal-500
                        return <Cell key={`cell-${index}`} fill={fillColor} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div
                className={`mt-4 pt-4 border-t ${
                  theme === 'light' ? 'border-teal-100' : 'border-slate-500'
                } flex flex-col items-start sm:flex-row sm:justify-between sm:items-center`}
              >
                <div className="flex items-center text-sm mb-2 sm:mb-0">
                  <TrendingUp className="h-4 w-4 text-teal-600 mr-2" />
                  <span>
                    Your wage:{' '}
                    <span className="font-semibold">
                      ${userProfile.hourlyRate}
                    </span>{' '}
                    (Top ~15%)
                  </span>
                </div>
                <div className="flex flex-wrap items-center">
                  <div className="flex mr-4 mb-2 sm:mb-0">
                    <div className="w-4 h-4 bg-teal-600 rounded-sm mr-1 mt-1" />
                    <span className="text-xs font-medium">Your wage</span>
                  </div>
                  <div className="flex mb-2 sm:mb-0">
                    <div className="w-8 border-t-2 border-dashed border-teal-500 mr-1 mt-2" />
                    <span className="text-xs font-medium">
                      Regional avg wage
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Career Path Timeline */}
            <CareerPathTimeline />
          </div>

          {/* AI Insights, Next Steps */}
          <div className="flex flex-col md:flex-row items-start gap-4 mb-6">
            {/* AI Career Insights */}
            <div
              className={`flex-1 ${
                theme === 'light' ? 'bg-white' : 'bg-slate-600'
              } rounded-2xl shadow-md p-5 border ${
                theme === 'light' ? 'border-teal-100' : 'border-slate-600'
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <h3
                  className={`font-bold text-lg ${
                    theme === 'light' ? 'text-gray-800' : 'text-white'
                  } flex items-center`}
                >
                  <Star className="w-4 h-4 mr-2 text-teal-500" />
                  AI Career Insights
                </h3>
                <div className="px-2 py-1 rounded-full bg-teal-100 text-teal-600 text-xs font-medium">
                  Personalized
                </div>
              </div>
              <p className="text-sm mb-3">
                Your compensation is well-positioned for your experience level.
                You can expect ~15-18% growth in 3 years by staying in your
                current role.
              </p>
              <div
                className={`p-3 rounded-2xl border mb-3 ${
                  theme === 'light'
                    ? 'bg-teal-50 border-teal-200'
                    : 'bg-slate-700 border-slate-600 text-white'
                }`}
              >
                <div className="flex items-center mb-2">
                  <div className="h-2 w-2 rounded-full bg-teal-500 mr-2" />
                  <span className="text-sm font-medium">
                    Growth Opportunities
                  </span>
                </div>
                <ul className="pl-4 text-xs space-y-1">
                  <li>Critical Care certification: +8-12% potential</li>
                  <li>Leadership training: +5-7% potential</li>
                  <li>Trauma specialization: +7-10% potential</li>
                </ul>
              </div>
              <div className="text-xs flex justify-between opacity-60">
                <span>Data sources: BLS, ANA, Hospital surveys</span>
                <span>Updated: March 2025</span>
              </div>
            </div>

            {/* Next Steps */}
            <div
              className={`flex-1 ${
                theme === 'light' ? 'bg-white' : 'bg-slate-600'
              } rounded-2xl shadow-md p-5 border ${
                theme === 'light' ? 'border-teal-100' : 'border-slate-600'
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <h3
                  className={`font-bold text-lg ${
                    theme === 'light' ? 'text-gray-800' : 'text-white'
                  } flex items-center`}
                >
                  <Clipboard className="w-4 h-4 mr-2 text-teal-500" />
                  Next Steps
                </h3>
                <div className="px-2 py-1 rounded-full bg-teal-100 text-teal-600 text-xs font-medium">
                  AI Recommended
                </div>
              </div>
              <ol className="list-decimal pl-5 text-sm space-y-2 mb-4">
                <li>Critical Care leadership program (apply in 45 days)</li>
                <li>
                  Request more trauma shifts (qualify for extra night diff)
                </li>
                <li>Update your certification portfolio for mid-year review</li>
              </ol>
              <div
                className={`p-3 rounded-2xl border text-sm ${
                  theme === 'light'
                    ? 'bg-teal-50 border-teal-200'
                    : 'bg-slate-700 border-slate-600 text-white'
                }`}
              >
                <p className="font-medium mb-1 flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-500" />
                  Upcoming Opportunity
                </p>
                <p>
                  NYU Langone is launching an ER Advanced Practice initiative
                  soon. Early applicants see a 68% higher acceptance rate!
                </p>
              </div>
            </div>
          </div>

          {/* Nurse Shift Scheduler */}
          <NurseShiftScheduler />

          {/* Footer */}
          <div
            className={`mt-6 text-center text-sm ${
              theme === 'light' ? 'text-gray-500' : 'text-gray-300'
            }`}
          >
            <p>
              Analytics processed by NursePayBuddy™ AI | Last updated{' '}
              {dataRefreshed}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default NurseDashboard;
