import React from 'react';
import type { NavigationButtonProps } from '../types';

export default function NavigationButton({
  direction,
  onClick,
  disabled,
}: NavigationButtonProps) {
  const isPrev = direction === 'prev';
  const position = isPrev ? 'left-4' : 'right-4';
  const pathD = isPrev ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7';
  const label = isPrev ? 'Previous group' : 'Next group';

  const buttonClass = `absolute ${position} top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-zinc-900 shadow-lg dark:border dark:border-zinc-700 flex items-center justify-center transition-all ${
    disabled
      ? 'opacity-50 cursor-not-allowed'
      : 'hover:shadow-xl hover:scale-110'
  }`;

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={buttonClass}
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={pathD}
        />
      </svg>
    </button>
  );
}