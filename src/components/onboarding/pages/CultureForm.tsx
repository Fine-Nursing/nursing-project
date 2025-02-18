// src/components/onboarding/pages/CultureForm.tsx

'use client';

import React from 'react';
import useOnboardingStore from 'src/store/onboardingStores';

export default function CultureForm() {
  const { formData, updateFormData, setStep } = useOnboardingStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('account');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto space-y-8 bg-white p-6 rounded-2xl shadow-sm"
    >
      <h2 className="text-2xl font-bold text-gray-900">
        Help us understand your workplace culture
      </h2>
      <p className="text-gray-500">
        Your feedback helps us find the best workplace fit for you.
      </p>

      {/* Culture Rating */}
      <div>
        <label
          htmlFor="cultureRating"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          On a scale of 1 to 10, how would you rate the culture and support in
          your unit?
        </label>
        <div className="mt-2">
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
              focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-500
              accent-teal-500  /* Tailwind 3+ 에서 지원. 브라우저별 차이 가능 */
            "
            value={formData.cultureRating || 5}
            onChange={(e) =>
              updateFormData({ cultureRating: parseInt(e.target.value, 10) })
            }
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <span
                key={num}
                className={
                  formData.cultureRating === num
                    ? 'font-bold text-teal-600'
                    : ''
                }
              >
                {num}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Unit Strengths */}
      <div>
        <label
          htmlFor="unitStrengths"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          What's one thing your unit does well?
        </label>
        <textarea
          id="unitStrengths"
          required
          rows={3}
          className="
            mt-1 block w-full rounded-lg border border-gray-300
            shadow-sm focus:border-teal-500 focus:ring-teal-500
            text-gray-900
          "
          value={formData.unitStrengths || ''}
          onChange={(e) => updateFormData({ unitStrengths: e.target.value })}
          placeholder="Ex: Strong teamwork, Effective communication, Great mentorship..."
        />
      </div>

      {/* Improvement Areas */}
      <div>
        <label
          htmlFor="improvementAreas"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          What's one thing that could be improved?
        </label>
        <textarea
          id="improvementAreas"
          required
          rows={3}
          className="
            mt-1 block w-full rounded-lg border border-gray-300
            shadow-sm focus:border-teal-500 focus:ring-teal-500
            text-gray-900
          "
          value={formData.improvementAreas || ''}
          onChange={(e) => updateFormData({ improvementAreas: e.target.value })}
          placeholder="Ex: Staffing ratios, Work-life balance, Professional development opportunities..."
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={() => setStep('employment')}
          className="
            text-teal-600 px-6 py-2 
            rounded-lg border border-teal-600 
            transition-colors hover:bg-teal-50
          "
        >
          Back
        </button>
        <button
          type="submit"
          className="
            bg-teal-600 text-white px-6 py-2 
            rounded-lg shadow-sm 
            transition-colors hover:bg-teal-700
          "
        >
          Next
        </button>
      </div>
    </form>
  );
}
