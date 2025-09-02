import React from 'react';
import { MapPin, Users, TrendingUp, Target } from 'lucide-react';

interface CompensationComparisonProps {
  theme: 'light' | 'dark';
  userHourlyRate: number;
  userSpecialty?: string;
  userState?: string;
  regionalAvgWage?: number;
  specialtyAvgWage?: number;
}

export function CompensationComparison({
  theme,
  userHourlyRate,
  userSpecialty = '',
  userState = '',
  regionalAvgWage = 35,
  specialtyAvgWage = 37,
}: CompensationComparisonProps) {
  // Calculate percentile position (simplified logic)
  const calculatePercentile = (userRate: number, avgRate: number) => {
    const difference = ((userRate - avgRate) / avgRate) * 100;
    if (difference >= 25) return 'Top 25%';
    if (difference >= 10) return 'Above Average';
    if (difference >= -10) return 'Average Range';
    return 'Below Average';
  };

  const regionalComparison = {
    difference: userHourlyRate - regionalAvgWage,
    percentage: Math.round(((userHourlyRate - regionalAvgWage) / regionalAvgWage) * 100),
    position: calculatePercentile(userHourlyRate, regionalAvgWage),
  };

  const specialtyComparison = {
    difference: userHourlyRate - specialtyAvgWage,
    percentage: Math.round(((userHourlyRate - specialtyAvgWage) / specialtyAvgWage) * 100),
    position: calculatePercentile(userHourlyRate, specialtyAvgWage),
  };

  // Generate 3 bullet points based on user's position
  const generateInsights = () => {
    const insights = [];
    
    // Regional comparison insight
    if (regionalComparison.percentage > 0) {
      insights.push(`You earn ${Math.abs(regionalComparison.percentage)}% above the regional average in ${userState || 'your area'}`);
    } else if (regionalComparison.percentage < 0) {
      insights.push(`You earn ${Math.abs(regionalComparison.percentage)}% below the regional average - potential for negotiation`);
    } else {
      insights.push(`You earn exactly at the regional average for ${userState || 'your area'}`);
    }

    // Specialty comparison insight
    if (userSpecialty) {
      if (specialtyComparison.percentage > 0) {
        insights.push(`Your compensation is ${Math.abs(specialtyComparison.percentage)}% higher than typical ${userSpecialty} nurses`);
      } else if (specialtyComparison.percentage < 0) {
        insights.push(`${userSpecialty} nurses typically earn ${Math.abs(specialtyComparison.percentage)}% more - consider specialty differentials`);
      } else {
        insights.push(`Your pay aligns with standard ${userSpecialty} compensation rates`);
      }
    }

    // Position/market insight
    if (regionalComparison.position === 'Top 25%') {
      insights.push(`You're in the top 25% of earners - excellent market position`);
    } else if (regionalComparison.position === 'Above Average') {
      insights.push(`Your compensation is competitive and above market average`);
    } else if (regionalComparison.position === 'Average Range') {
      insights.push(`You're in the average range - opportunities exist for growth`);
    } else {
      insights.push(`Consider exploring higher-paying opportunities or negotiating current compensation`);
    }

    return insights.slice(0, 3);
  };

  const insights = generateInsights();

  return (
    <div className={`rounded-lg p-4 ${
      theme === 'light' 
        ? 'bg-blue-50 border border-blue-200' 
        : 'bg-blue-900/20 border border-blue-800/50'
    }`}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <Target className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
        <div className="flex-1">
          <h4 className={`text-sm font-semibold mb-1 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Market Position Analysis
          </h4>
          <p className={`text-xs ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-300'
          }`}>
            Your compensation compared to regional and specialty benchmarks
          </p>
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {/* Regional Comparison */}
        <div className={`p-3 rounded-lg ${
          theme === 'light' ? 'bg-white/80' : 'bg-slate-800/50'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className={`text-xs font-medium ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Regional Average {userState && `(${userState})`}
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className={`text-lg font-bold ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                ${regionalAvgWage}/hr
              </div>
              <div className={`text-xs ${
                regionalComparison.difference >= 0 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {regionalComparison.difference >= 0 ? '+' : ''}
                ${regionalComparison.difference.toFixed(2)} ({regionalComparison.percentage >= 0 ? '+' : ''}{regionalComparison.percentage}%)
              </div>
            </div>
          </div>
        </div>

        {/* Specialty Comparison */}
        <div className={`p-3 rounded-lg ${
          theme === 'light' ? 'bg-white/80' : 'bg-slate-800/50'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className={`text-xs font-medium ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              {userSpecialty || 'Specialty'} Average
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className={`text-lg font-bold ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                ${specialtyAvgWage}/hr
              </div>
              <div className={`text-xs ${
                specialtyComparison.difference >= 0 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {specialtyComparison.difference >= 0 ? '+' : ''}
                ${specialtyComparison.difference.toFixed(2)} ({specialtyComparison.percentage >= 0 ? '+' : ''}{specialtyComparison.percentage}%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="space-y-2">
        <h5 className={`text-xs font-semibold ${
          theme === 'light' ? 'text-gray-800' : 'text-gray-200'
        }`}>
          Key Insights
        </h5>
        {insights.map((insight, index) => (
          <div key={`insight-${index}-${insight.slice(0, 15)}`} className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
            <span className={`text-sm leading-relaxed ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              {insight}
            </span>
          </div>
        ))}
      </div>

      {/* Market Position Badge */}
      <div className={`mt-3 pt-3 border-t ${
        theme === 'light' ? 'border-blue-200' : 'border-blue-800/50'
      }`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Market Position
          </span>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            regionalComparison.position === 'Top 25%' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : regionalComparison.position === 'Above Average'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
              : regionalComparison.position === 'Average Range'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            <TrendingUp className="w-3 h-3 inline mr-1" />
            {regionalComparison.position}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompensationComparison;