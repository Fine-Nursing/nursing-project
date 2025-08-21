import React from 'react';

interface LoadingStateProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'emerald' | 'slate' | 'white' | 'blue' | 'purple';
  text?: string;
  className?: string;
  fullHeight?: boolean;
}

export function LoadingState({ 
  size = 'md', 
  color = 'emerald',
  text,
  className = '',
  fullHeight = false
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const colorClasses = {
    emerald: 'border-emerald-600 dark:border-emerald-400',
    slate: 'border-slate-600 dark:border-slate-400',
    white: 'border-white',
    blue: 'border-blue-600 dark:border-blue-400',
    purple: 'border-purple-600 dark:border-purple-400'
  };

  const containerClass = fullHeight ? 'h-96' : '';

  return (
    <div className={`flex flex-col items-center justify-center ${containerClass} ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${colorClasses[color]}`} />
      {text && (
        <p className="mt-4 text-zinc-600 dark:text-zinc-300">{text}</p>
      )}
    </div>
  );
}

// 하위 호환성을 위한 default export
export default LoadingState;