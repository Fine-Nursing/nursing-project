import { m } from 'framer-motion';
import ActionButton from 'src/components/ui/button/ActionButton';
import { useCultureForm } from './hooks/useCultureForm';
import { RATING_CATEGORIES } from './constants';
import ProgressHeader from './components/ProgressHeader';
import RatingSection from './components/RatingSection';
import FeedbackSection from './components/FeedbackSection';
import ReviewsSection from './components/ReviewsSection';

export default function CultureForm(): JSX.Element {
  const {
    // State
    formData,
    
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
    isLoading,
  } = useCultureForm();

  const handleFeedbackChange = (feedback: string) => {
    updateFormData({ freeTextFeedback: feedback });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <ProgressHeader
        progress={getProgress()}
        completedCategories={getCompletedCategories()}
        totalCategories={RATING_CATEGORIES.length}
      />

      {/* Main Content - Mobile first layout */}
      <div className="flex flex-col lg:grid lg:grid-cols-5 gap-4 sm:gap-8">
        {/* Form Section - Full width on mobile */}
        <div className="w-full lg:col-span-3">
          <m.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <RatingSection
                formData={formData}
                onRatingChange={handleRatingChange}
              />

              <FeedbackSection
                formData={formData}
                onFeedbackChange={handleFeedbackChange}
              />

              {/* Navigation - Mobile optimized */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <ActionButton
                  onClick={handleBack}
                  variant="outline"
                  className="px-3 py-1.5 sm:px-6 sm:py-3 text-sm sm:text-base w-full sm:w-auto order-2 sm:order-1"
                >
                  ← Back
                </ActionButton>

                <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 order-1 sm:order-2">
                  <div className="text-center sm:text-left">
                    <div className="text-xs text-gray-500">Overall Score</div>
                    <div className="text-base sm:text-xl font-bold text-emerald-600">
                      {calculateAverageScore()}/5.0
                    </div>
                  </div>

                  <ActionButton
                    type="submit"
                    className="px-3 py-1.5 sm:px-6 sm:py-3 text-sm sm:text-base"
                    disabled={isLoading || calculateAverageScore() === '0.0'}
                  >
                    {isLoading ? (
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
          </m.div>
        </div>

        {/* Reviews Section - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block lg:col-span-2">
          <ReviewsSection />
        </div>
      </div>
    </div>
  );
}