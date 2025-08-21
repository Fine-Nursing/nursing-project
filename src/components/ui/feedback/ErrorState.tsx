import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
  fullHeight?: boolean;
  showIcon?: boolean;
}

export function ErrorState({ 
  message = 'Something went wrong',
  onRetry,
  className = '',
  fullHeight = false,
  showIcon = false
}: ErrorStateProps) {
  const containerClass = fullHeight ? 'h-96' : '';

  return (
    <div className={`flex items-center justify-center ${containerClass} ${className}`}>
      <div className="text-center">
        {showIcon && (
          <AlertCircle className="w-12 h-12 text-red-500 dark:text-red-400 mx-auto mb-4" />
        )}
        <p className="text-red-600 dark:text-red-400">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}

// 하위 호환성을 위한 default export
export default ErrorState;