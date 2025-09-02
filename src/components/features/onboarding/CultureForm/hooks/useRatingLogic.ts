import { useState, useCallback } from 'react';
import type { HoveredRating } from '../types';

export function useRatingLogic() {
  const [hoveredRating, setHoveredRating] = useState<HoveredRating | null>(null);

  const handleRatingHover = useCallback((category: string, value: number) => {
    setHoveredRating({ category, value });
  }, []);

  const handleRatingLeave = useCallback(() => {
    setHoveredRating(null);
  }, []);

  const isRatingHovered = useCallback((category: string, value: number) => hoveredRating?.category === category && hoveredRating?.value === value, [hoveredRating]);

  return {
    hoveredRating,
    handleRatingHover,
    handleRatingLeave,
    isRatingHovered,
  };
}