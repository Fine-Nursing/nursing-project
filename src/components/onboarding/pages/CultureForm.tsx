'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ActionButton from 'src/components/button/ActionButton';
import useOnboardingStore from 'src/store/onboardingStores';
import useCultureMutation from 'src/api/onboarding/useCultureMutation';
import toast from 'react-hot-toast';

// 평가 항목 정의
const RATING_CATEGORIES = [
  {
    key: 'unitCulture' as const,
    label: 'Unit Culture & Teamwork',
    description: 'How well does your unit work together?',
    icon: '👥',
  },
  {
    key: 'benefits' as const,
    label: 'Benefits & Compensation',
    description: 'Quality of benefits package and compensation',
    icon: '💰',
  },
  {
    key: 'growthOpportunities' as const,
    label: 'Growth & Development',
    description: 'Opportunities for professional growth',
    icon: '📈',
  },
  {
    key: 'hospitalQuality' as const,
    label: 'Hospital/Facility Quality',
    description: 'Overall quality of care and facilities',
    icon: '🏥',
  },
];

// 평가 점수 옵션
const RATING_OPTIONS = [
  { value: 1, label: 'Poor', emoji: '😟' },
  { value: 2, label: 'Fair', emoji: '😐' },
  { value: 3, label: 'Good', emoji: '🙂' },
  { value: 4, label: 'Very Good', emoji: '😊' },
  { value: 5, label: 'Excellent', emoji: '🤩' },
];

// 기존 리뷰 데이터
const existingReviews = [
  {
    id: 1,
    rating: 4.2,
    name: 'Sarah J.',
    role: 'RN, Critical Care',
    timeAgo: '2 days ago',
    unitCulture: 4,
    benefits: 4,
    growthOpportunities: 5,
    hospitalQuality: 4,
    feedback:
      'The teamwork in our unit is fantastic. Everyone is willing to help each other out, especially during high-stress situations. Leadership really values our input.',
  },
  {
    id: 2,
    rating: 3.5,
    name: 'Michael T.',
    role: 'Nurse Practitioner',
    timeAgo: '1 week ago',
    unitCulture: 4,
    benefits: 3,
    growthOpportunities: 4,
    hospitalQuality: 3,
    feedback:
      'Great learning opportunities and mentorship programs. The benefits package could be more competitive compared to other hospitals in the area.',
  },
  {
    id: 3,
    rating: 4.5,
    name: 'Jessica L.',
    role: 'RN, Emergency Department',
    timeAgo: '2 weeks ago',
    unitCulture: 5,
    benefits: 4,
    growthOpportunities: 4,
    hospitalQuality: 5,
    feedback:
      'Management is very supportive and responsive to our needs. The facility is well-maintained with modern equipment. Staffing ratios have improved significantly.',
  },
];

export default function CultureForm() {
  const { formData, updateFormData, setStep } = useOnboardingStore();
  const cultureMutation = useCultureMutation();
  const [selectedReview, setSelectedReview] = useState<number | null>(1);

  const handleRatingChange = (
    category: keyof typeof formData,
    value: number
  ) => {
    updateFormData({ [category]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (
        !formData.unitCulture ||
        !formData.benefits ||
        !formData.growthOpportunities ||
        !formData.hospitalQuality
      ) {
        toast.error('Please rate all categories');
        return;
      }

      const payload = {
        unitCulture: formData.unitCulture,
        benefits: formData.benefits,
        growthOpportunities: formData.growthOpportunities,
        hospitalQuality: formData.hospitalQuality,
        freeTextFeedback: formData.freeTextFeedback || undefined,
      };

      await cultureMutation.mutateAsync(payload);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to save culture information'
      );
    }
  };

  const calculateAverageScore = () => {
    const scores = [
      formData.unitCulture || 0,
      formData.benefits || 0,
      formData.growthOpportunities || 0,
      formData.hospitalQuality || 0,
    ].filter((score) => score > 0);

    if (scores.length === 0) return '0.0';
    return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Header - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 sm:mb-12"
      >
        <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
          How&apos;s Your Workplace Culture?
        </h2>
        <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
          Your honest feedback helps create better work environments for
          healthcare professionals everywhere
        </p>
      </motion.div>

      {/* Main Content - 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-8">
        {/* Left Column - Form (3/5 width) */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating Categories */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-8">
                  Rate Your Experience
                </h3>
                <div className="space-y-4 sm:space-y-6">
                  {RATING_CATEGORIES.map((category, index) => (
                    <motion.div
                      key={category.key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="space-y-2 sm:space-y-3"
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <span className="text-xl sm:text-2xl mt-0.5 sm:mt-1">{category.icon}</span>
                        <div className="flex-1">
                          <h4 className="text-sm sm:text-base font-semibold text-gray-900">
                            {category.label}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">
                            {category.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-1.5 sm:gap-2 pl-0 sm:pl-10">
                        {RATING_OPTIONS.map((option) => {
                          const isSelected =
                            formData[category.key] === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() =>
                                handleRatingChange(category.key, option.value)
                              }
                              className={`
                flex-1 min-h-[80px] sm:min-h-0 py-3 sm:py-3 px-1 sm:px-1 rounded-lg border-2 transition-all duration-200
                ${
                  isSelected
                    ? 'border-slate-500 bg-slate-50 shadow-md scale-105'
                    : 'border-gray-200 hover:border-slate-300 hover:shadow'
                }
              `}
                            >
                              <div className="text-center flex flex-col justify-center h-full">
                                <div className="text-xl sm:text-xl mb-1">
                                  {option.emoji}
                                </div>
                                <div
                                  className={`text-xs sm:text-xs font-bold ${
                                    isSelected
                                      ? 'text-slate-700'
                                      : 'text-gray-600'
                                  }`}
                                >
                                  {option.value}
                                </div>
                                <div
                                  className={`text-[10px] sm:text-[10px] mt-0.5 hidden sm:block ${
                                    isSelected
                                      ? 'text-slate-600'
                                      : 'text-gray-400'
                                  }`}
                                >
                                  {option.label}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Additional Feedback */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Anything else to share?
                  </h3>
                  <span className="text-xs sm:text-sm text-gray-400">
                    Optional • {formData.freeTextFeedback?.length || 0}/500
                  </span>
                </div>

                <textarea
                  value={formData.freeTextFeedback || ''}
                  onChange={(e) =>
                    updateFormData({ freeTextFeedback: e.target.value })
                  }
                  maxLength={500}
                  rows={4}
                  placeholder="Share your thoughts about work environment, team dynamics, or suggestions for improvement..."
                  className="w-full p-3 sm:p-4 text-sm sm:text-base text-gray-700 bg-gray-50 border border-gray-200 rounded-xl
                           focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100 
                           outline-none transition-all resize-none"
                />
              </motion.div>

              {/* Navigation */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <ActionButton
                  onClick={() => setStep('employment')}
                  variant="outline"
                  className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base w-full sm:w-auto"
                >
                  ← Back
                </ActionButton>

                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="text-center">
                    <div className="text-xs sm:text-sm text-gray-500">Overall Score</div>
                    <div className="text-xl sm:text-2xl font-bold text-slate-600">
                      {calculateAverageScore()}/5.0
                    </div>
                  </div>

                  <ActionButton
                    type="submit"
                    className="px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base"
                    disabled={
                      cultureMutation.isPending ||
                      calculateAverageScore() === '0.0'
                    }
                  >
                    {cultureMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Saving...
                      </span>
                    ) : (
                      'Continue →'
                    )}
                  </ActionButton>
                </div>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Right Column - Reviews (2/5 width) */}
        <div className="lg:col-span-2 hidden lg:block">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="sticky top-8"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              {' '}
              {/* bg-gray-50을 bg-white로 변경, shadow-sm과 border 추가 */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                What your peers are saying
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Real feedback from healthcare professionals
              </p>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {existingReviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={`
                      bg-white p-5 rounded-xl border-2 transition-all cursor-pointer
                      ${
                        selectedReview === review.id
                          ? 'border-slate-400 shadow-lg'
                          : 'border-transparent hover:border-gray-200 hover:shadow-md'
                      }
                    `}
                    onClick={() => setSelectedReview(review.id)}
                  >
                    {/* Review Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 
                                      flex items-center justify-center text-white font-semibold"
                        >
                          {review.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {review.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {review.role} • {review.timeAgo}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                        <svg
                          className="w-4 h-4 text-amber-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-semibold text-gray-700">
                          {review.rating}
                        </span>
                      </div>
                    </div>

                    {/* Ratings Summary */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">👥</span>
                        <span className="text-xs text-gray-600">Culture:</span>
                        <span className="text-xs font-semibold text-gray-900">
                          {review.unitCulture}/5
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">💰</span>
                        <span className="text-xs text-gray-600">Benefits:</span>
                        <span className="text-xs font-semibold text-gray-900">
                          {review.benefits}/5
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">📈</span>
                        <span className="text-xs text-gray-600">Growth:</span>
                        <span className="text-xs font-semibold text-gray-900">
                          {review.growthOpportunities}/5
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🏥</span>
                        <span className="text-xs text-gray-600">Quality:</span>
                        <span className="text-xs font-semibold text-gray-900">
                          {review.hospitalQuality}/5
                        </span>
                      </div>
                    </div>

                    {/* Feedback Text */}
                    <div
                      className={`
                      overflow-hidden transition-all duration-300
                      ${selectedReview === review.id ? 'max-h-40' : 'max-h-0'}
                    `}
                    >
                      <p className="text-sm text-gray-600 italic pt-3 border-t border-gray-100">
                        {review.feedback}
                      </p>
                    </div>

                    {selectedReview !== review.id && (
                      <div className="text-xs text-slate-600 font-medium mt-2">
                        Click to read more →
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600">
                  Join <span className="font-semibold">2,847</span> nurses
                  sharing their experiences
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
