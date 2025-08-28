import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { ChevronDown, Users, DollarSign, TrendingUp, Building2 } from 'lucide-react';
import { EXISTING_REVIEWS } from '../constants';

export default function ReviewsSection() {
  const [expandedReview, setExpandedReview] = useState<number | null>(null);

  return (
    <div className="lg:col-span-2 hidden lg:block">
      <m.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="sticky top-8"
      >
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            What your peers are saying
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Real feedback from healthcare professionals
          </p>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {EXISTING_REVIEWS.map((review, index) => (
              <m.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`
                  bg-white p-5 rounded-xl border-2 transition-all cursor-pointer
                  ${
                    expandedReview === review.id
                      ? 'border-emerald-400 shadow-lg'
                      : 'border-transparent hover:border-gray-200 hover:shadow-md'
                  }
                `}
                onClick={() => setExpandedReview(expandedReview === review.id ? null : review.id)}
              >
                {/* Review Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 
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
                    <Users className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-600">Culture:</span>
                    <span className="text-xs font-semibold text-gray-900">
                      {review.unitCulture}/5
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-600">Benefits:</span>
                    <span className="text-xs font-semibold text-gray-900">
                      {review.benefits}/5
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-600">Growth:</span>
                    <span className="text-xs font-semibold text-gray-900">
                      {review.growthOpportunities}/5
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-600">Quality:</span>
                    <span className="text-xs font-semibold text-gray-900">
                      {review.hospitalQuality}/5
                    </span>
                  </div>
                </div>

                {/* Feedback Text */}
                <AnimatePresence>
                  {expandedReview === review.id && (
                    <m.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm text-gray-600 italic pt-3 border-t border-gray-100">
                        "{review.feedback}"
                      </p>
                    </m.div>
                  )}
                </AnimatePresence>

                {/* Expand/Collapse indicator */}
                <m.div 
                  className="flex items-center justify-center mt-2"
                  animate={{ rotate: expandedReview === review.id ? 180 : 0 }}
                >
                  <ChevronDown className="w-4 h-4 text-emerald-400" />
                </m.div>
              </m.div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Join <span className="font-semibold">2,847</span> nurses
              sharing their experiences
            </p>
          </div>
        </div>
      </m.div>
    </div>
  );
}