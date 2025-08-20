import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MapPin, Building, Calendar } from 'lucide-react';
import type { ExistingReviewsProps } from '../types';
import { RATING_CATEGORIES } from '../constants';

export function ExistingReviews({ reviews, isExpanded, onToggle }: ExistingReviewsProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600 dark:text-green-400';
    if (rating >= 3) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between mb-4 group"
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Community Reviews
          </h3>
          <p className="text-sm text-gray-600 dark:text-slate-300">
            See what other nurses are saying about their workplaces
          </p>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-slate-200" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-600"
              >
                {/* Hospital Info */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {review.hospitalName}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {review.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(review.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Unit Info */}
                <div className="text-sm text-gray-600 dark:text-slate-300 mb-3">
                  Unit: <span className="font-medium">{review.workUnit}</span>
                </div>

                {/* Ratings */}
                <div className="grid grid-cols-2 gap-4 mb-3">
                  {RATING_CATEGORIES.map(category => {
                    const rating = review[category.key];
                    return (
                      <div key={category.key} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-slate-300">
                          {category.label}
                        </span>
                        <span className={`font-semibold ${getRatingColor(rating)}`}>
                          {rating}/5
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Free Text Feedback */}
                {review.freeTextFeedback && (
                  <div className="pt-3 border-t border-gray-200 dark:border-slate-600">
                    <p className="text-sm text-gray-700 dark:text-slate-300 italic">
                      "{review.freeTextFeedback}"
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}