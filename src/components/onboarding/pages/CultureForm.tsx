'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useOnboardingStore from 'src/store/onboardingStores';

// 기존 리뷰 데이터 (실제로는 API에서 가져올 수 있음)
const existingReviews = [
  {
    id: 1,
    rating: 8,
    name: 'Sarah J.',
    role: 'RN, Critical Care',
    strengths:
      'The teamwork in our unit is fantastic. Everyone is willing to help each other out, especially during high-stress situations.',
    improvements:
      'Work-life balance could be improved with more flexible scheduling options.',
  },
  {
    id: 2,
    rating: 7,
    name: 'Michael T.',
    role: 'Nurse Practitioner',
    strengths:
      'Strong clinical education and mentorship opportunities for new staff members.',
    improvements:
      'Communication between different departments could be more streamlined.',
  },
  {
    id: 3,
    rating: 9,
    name: 'Jessica L.',
    role: 'RN, Emergency Department',
    strengths:
      'Leadership really listens to our concerns and makes changes when necessary.',
    improvements:
      'We could use more staff during peak hours to reduce burnout.',
  },
];

export default function CultureForm() {
  const { formData, updateFormData, setStep } = useOnboardingStore();
  const [selectedReview, setSelectedReview] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('account');
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side: Form */}
        <div>
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-sm space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Help us understand your workplace culture
              </h2>
              <p className="text-gray-500 mt-2">
                Your feedback helps us find the best workplace fit for you.
              </p>
            </div>

            {/* Culture Rating */}
            <div className="space-y-3">
              <label
                htmlFor="cultureRating"
                className="block text-sm font-medium text-gray-700"
              >
                On a scale of 1 to 10, how would you rate the culture and
                support in your unit?
              </label>
              <div className="pt-2">
                <input
                  id="cultureRating"
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  required
                  className="
                    w-full h-2 rounded-full cursor-pointer appearance-none
                    bg-gray-200 
                    focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-500
                    accent-slate-500
                  "
                  value={formData.cultureRating || 5}
                  onChange={(e) =>
                    updateFormData({
                      cultureRating: parseInt(e.target.value, 10),
                    })
                  }
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <span
                      key={num}
                      className={
                        formData.cultureRating === num
                          ? 'font-bold text-slate-600'
                          : ''
                      }
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-500 px-1">
                <span>Needs improvement</span>
                <span>Excellent</span>
              </div>
            </div>

            {/* Unit Strengths - Optional */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="unitStrengths"
                  className="block text-sm font-medium text-gray-700"
                >
                  What&apos;s one thing your unit does well?{' '}
                  <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <span className="text-xs text-gray-400">
                  {formData.unitStrengths?.length || 0}/500
                </span>
              </div>
              <textarea
                id="unitStrengths"
                rows={3}
                maxLength={500}
                className="
                  mt-1 block w-full rounded-lg border border-gray-300
                  shadow-sm focus:border-slate-500 focus:ring-slate-500
                  text-gray-900 text-sm p-3
                "
                value={formData.unitStrengths || ''}
                onChange={(e) =>
                  updateFormData({ unitStrengths: e.target.value })
                }
                placeholder="Ex: Strong teamwork, Effective communication, Great mentorship..."
              />
            </div>

            {/* Improvement Areas - Optional */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="improvementAreas"
                  className="block text-sm font-medium text-gray-700"
                >
                  What&apos;s one thing that could be improved?{' '}
                  <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <span className="text-xs text-gray-400">
                  {formData.improvementAreas?.length || 0}/500
                </span>
              </div>
              <textarea
                id="improvementAreas"
                rows={3}
                maxLength={500}
                className="
                  mt-1 block w-full rounded-lg border border-gray-300
                  shadow-sm focus:border-slate-500 focus:ring-slate-500
                  text-gray-900 text-sm p-3
                "
                value={formData.improvementAreas || ''}
                onChange={(e) =>
                  updateFormData({ improvementAreas: e.target.value })
                }
                placeholder="Ex: Staffing ratios, Work-life balance, Professional development opportunities..."
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep('employment')}
                className="
                  text-slate-600 px-6 py-2 
                  rounded-lg border border-slate-600 
                  transition-colors hover:bg-slate-50
                "
              >
                Back
              </button>
              <button
                type="submit"
                className="
                  bg-slate-600 text-white px-6 py-2 
                  rounded-lg shadow-sm 
                  transition-colors hover:bg-slate-700
                "
              >
                Next
              </button>
            </div>
          </form>
        </div>

        {/* Right side: Existing Reviews */}
        <div className="lg:pl-4">
          <div className="bg-white p-8 rounded-2xl shadow-sm h-full">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                What others are saying
              </h3>
              <p className="text-gray-500 text-sm">
                Here are some recent thoughts from other healthcare
                professionals. Your feedback is valuable and helps build a
                supportive community.
              </p>
            </div>

            <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2">
              {existingReviews.map((review) => (
                <motion.div
                  key={review.id}
                  whileHover={{ scale: 1.01 }}
                  className={`
                    p-4 rounded-xl border transition-all cursor-pointer
                    ${
                      selectedReview === review.id
                        ? 'border-slate-500 bg-slate-50'
                        : 'border-gray-200 hover:border-slate-200'
                    }
                  `}
                  onClick={() =>
                    setSelectedReview(
                      selectedReview === review.id ? null : review.id
                    )
                  }
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-medium">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {review.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {review.role}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center bg-slate-50 px-2 py-1 rounded-lg">
                      <svg
                        className="w-4 h-4 text-yellow-500 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">
                        {review.rating}/10
                      </span>
                    </div>
                  </div>

                  {(selectedReview === review.id ||
                    review.id === existingReviews[0].id) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 space-y-3 text-sm"
                    >
                      {review.strengths && (
                        <div>
                          <div className="text-gray-700 font-medium">
                            Unit strengths:
                          </div>
                          <p className="text-gray-600 italic">
                            {review.strengths}
                          </p>
                        </div>
                      )}

                      {review.improvements && (
                        <div>
                          <div className="text-gray-700 font-medium">
                            Areas for improvement:
                          </div>
                          <p className="text-gray-600 italic">
                            {review.improvements}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {selectedReview !== review.id &&
                    review.id !== existingReviews[0].id && (
                      <div className="mt-2 text-slate-600 text-sm font-medium cursor-pointer">
                        Click to read more
                      </div>
                    )}
                </motion.div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Your feedback joins hundreds of healthcare professionals helping
                to improve workplace culture.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
