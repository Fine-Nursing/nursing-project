import { m } from 'framer-motion';
import { RATING_CATEGORIES, RATING_OPTIONS } from '../constants';
import { useRatingLogic } from '../hooks/useRatingLogic';
import type { CultureFormData } from '../types';

interface RatingSectionProps {
  formData: CultureFormData;
  onRatingChange: (category: keyof CultureFormData, value: number) => void;
}

export default function RatingSection({
  formData,
  onRatingChange,
}: RatingSectionProps) {
  const { handleRatingHover, handleRatingLeave, isRatingHovered } = useRatingLogic();

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-8">
      <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-8">
        Rate Your Experience
      </h3>
      <div className="space-y-4 sm:space-y-6">
        {RATING_CATEGORIES.map((category, index) => {
          const Icon = category.icon;
          const isRated = !!formData[category.key];
          
          return (
            <m.div
              key={category.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className={`space-y-3 p-3 rounded-lg transition-all ${
                isRated ? 'bg-emerald-50' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  isRated ? 'bg-emerald-200' : 'bg-emerald-100'
                }`}>
                  <Icon className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-gray-900">
                    {category.label}
                    {isRated && (
                      <span className="ml-2 text-sm font-normal text-emerald-500">
                        ✓
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {category.description}
                  </p>
                </div>
              </div>

              <div className="flex gap-1.5 sm:gap-2 pl-0 sm:pl-11">
                {RATING_OPTIONS.map((option) => {
                  const isSelected = formData[category.key] === option.value;
                  const isHovered = isRatingHovered(category.key, option.value);
                  
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => onRatingChange(category.key, option.value)}
                      onMouseEnter={() => handleRatingHover(category.key, option.value)}
                      onMouseLeave={handleRatingLeave}
                      className={`
                        flex-1 min-h-[75px] py-3 px-1 rounded-lg border-2 transition-all duration-200
                        ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50 shadow-md scale-105'
                            : isHovered
                            ? 'border-emerald-300 shadow-sm scale-102'
                            : 'border-gray-200 hover:border-emerald-300'
                        }
                      `}
                    >
                      <div className="text-center">
                        <div className={`text-2xl font-bold mb-1 ${
                          isSelected
                            ? 'text-emerald-700'
                            : 'text-gray-500'
                        }`}>
                          {option.value}
                        </div>
                        <div
                          className={`text-[11px] font-medium ${
                            isSelected
                              ? 'text-emerald-600'
                              : 'text-gray-400'
                          }`}
                        >
                          {option.label}
                        </div>
                        <div className="flex justify-center gap-0.5 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full ${
                                i < option.value
                                  ? isSelected 
                                    ? 'bg-emerald-600' 
                                    : 'bg-gray-300'
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </m.div>
          );
        })}
      </div>
    </div>
  );
}