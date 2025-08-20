'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import ActionButton from 'src/components/button/ActionButton';
import useOnboardingStore from 'src/store/onboardingStores';
import useCultureMutation from 'src/api/onboarding/useCultureMutation';
import toast from 'react-hot-toast';
import AnimatedProgressBar from '../../components/AnimatedProgressBar';
import { RATING_CATEGORIES, EXISTING_REVIEWS } from './constants';
import { RatingCard } from './components/RatingCard';
import { ExistingReviews } from './components/ExistingReviews';
import { FreeTextSection } from './components/FreeTextSection';
import type { CultureFormData } from './types';

export default function CultureForm() {
  const { formData, updateFormData, setStep } = useOnboardingStore();
  const cultureMutation = useCultureMutation();
  const [showExistingReviews, setShowExistingReviews] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data with proper typing
  const cultureData: CultureFormData = {
    unitCulture: formData.unitCulture || null,
    benefits: formData.benefits || null,
    growthOpportunities: formData.growthOpportunities || null,
    hospitalQuality: formData.hospitalQuality || null,
    freeTextFeedback: formData.freeTextFeedback || '',
  };

  const handleRatingChange = useCallback((
    category: string,
    value: number
  ) => {
    updateFormData({ [category]: value });
  }, [updateFormData]);

  const handleFreeTextChange = useCallback((value: string) => {
    updateFormData({ freeTextFeedback: value });
  }, [updateFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      
      if (
        !cultureData.unitCulture ||
        !cultureData.benefits ||
        !cultureData.growthOpportunities ||
        !cultureData.hospitalQuality
      ) {
        toast.error('Please rate all categories');
        return;
      }

      const payload = {
        unitCulture: cultureData.unitCulture,
        benefits: cultureData.benefits,
        growthOpportunities: cultureData.growthOpportunities,
        hospitalQuality: cultureData.hospitalQuality,
        freeTextFeedback: cultureData.freeTextFeedback || undefined,
      };

      await cultureMutation.mutateAsync(payload);
      toast.success('Culture assessment saved successfully!');
      setStep('account');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save culture assessment'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = cultureData.unitCulture && 
                     cultureData.benefits && 
                     cultureData.growthOpportunities && 
                     cultureData.hospitalQuality;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <AnimatedProgressBar progress={80} />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Workplace Culture Assessment
          </h1>
          <p className="text-lg text-gray-600 dark:text-slate-300 max-w-2xl mx-auto">
            Help us understand your current workplace experience. Your feedback helps other 
            nurses make informed decisions about their career moves.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Cards */}
          <div className="space-y-6">
            {RATING_CATEGORIES.map((category, index) => (
              <motion.div
                key={category.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <RatingCard
                  category={category}
                  value={cultureData[category.key]}
                  onRatingChange={handleRatingChange}
                />
              </motion.div>
            ))}
          </div>

          {/* Free Text Section */}
          <FreeTextSection
            value={cultureData.freeTextFeedback}
            onChange={handleFreeTextChange}
          />

          {/* Existing Reviews */}
          <ExistingReviews
            reviews={EXISTING_REVIEWS}
            isExpanded={showExistingReviews}
            onToggle={() => setShowExistingReviews(!showExistingReviews)}
          />

          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 pt-8"
          >
            <ActionButton
              variant="outline"
              onClick={() => setStep('employment')}
              className="flex-1"
              disabled={isSubmitting}
            >
              Back
            </ActionButton>
            
            <ActionButton
              type="submit"
              variant="solid"
              className="flex-1"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Continue'}
            </ActionButton>
          </motion.div>
        </form>
      </div>
    </div>
  );
}