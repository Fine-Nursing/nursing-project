import React from 'react';
import type { FormNavigationProps } from '../types';

export function FormNavigation({
  currentSection,
  isLastSection,
  hasErrors,
  onNext,
  onPrevious,
  onCancel
}: FormNavigationProps) {
  return (
    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
      <div>
        {currentSection > 0 && (
          <button
            onClick={onPrevious}
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
        )}
      </div>
      
      <div className="flex space-x-3">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
        
        <button
          onClick={onNext}
          disabled={hasErrors}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            hasErrors
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isLastSection ? 'Review' : 'Next'}
        </button>
      </div>
    </div>
  );
}