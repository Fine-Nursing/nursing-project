import { useCallback } from 'react';
import useOnboardingStore from 'src/store/onboardingStores';
import useCultureMutation from 'src/api/onboarding/useCultureMutation';
import toast from 'react-hot-toast';
import { RATING_CATEGORIES } from '../constants';
import type { CultureFormData } from '../types';

export function useCultureForm() {
  const { formData, updateFormData, setStep } = useOnboardingStore();
  const cultureMutation = useCultureMutation();

  const handleRatingChange = useCallback((
    category: keyof CultureFormData,
    value: number
  ) => {
    updateFormData({ [category]: value });
  }, [updateFormData]);

  const calculateAverageScore = useCallback(() => {
    const scores = [
      formData.unitCulture || 0,
      formData.benefits || 0,
      formData.growthOpportunities || 0,
      formData.hospitalQuality || 0,
    ].filter((score) => score > 0);

    if (scores.length === 0) return '0.0';
    return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  }, [formData]);

  const getCompletedCategories = useCallback(() => RATING_CATEGORIES.filter((cat) => formData[cat.key]).length, [formData]);

  const getProgress = useCallback(() => (getCompletedCategories() / RATING_CATEGORIES.length) * 100, [getCompletedCategories]);

  const validateForm = useCallback(() => !!(
      formData.unitCulture &&
      formData.benefits &&
      formData.growthOpportunities &&
      formData.hospitalQuality
    ), [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!validateForm()) {
        toast.error('Please rate all categories');
        return;
      }

      const payload = {
        unitCulture: formData.unitCulture!,
        benefits: formData.benefits!,
        growthOpportunities: formData.growthOpportunities!,
        hospitalQuality: formData.hospitalQuality!,
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
  }, [formData, validateForm, cultureMutation]);

  const handleBack = useCallback(() => {
    setStep('employment');
  }, [setStep]);

  return {
    // State
    formData,
    
    // Mutation
    cultureMutation,
    
    // Handlers
    handleRatingChange,
    handleSubmit,
    handleBack,
    updateFormData,
    
    // Computed
    calculateAverageScore,
    getCompletedCategories,
    getProgress,
    validateForm,
    
    // Loading state
    isLoading: cultureMutation.isPending,
  };
}