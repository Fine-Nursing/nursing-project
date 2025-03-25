// components/NurseDashboard/CuteWageLabel.tsx
import React from 'react';
import { Star } from 'lucide-react';

interface CuteWageLabelProps {
  viewBox?: {
    x?: number;
    y?: number;
  };
  wage: number;
}

export default function CuteWageLabel({ viewBox, wage }: CuteWageLabelProps) {
  if (!viewBox) return null;
  const { x = 0, y = 0 } = viewBox;
  const bubbleX = x - 60;
  const bubbleY = y - 46;

  return (
    <foreignObject x={bubbleX} y={bubbleY} width={120} height={40}>
      <div className="flex items-center justify-center bg-pink-100 text-pink-700 px-2 py-1 rounded-full shadow-md text-xs">
        <Star className="w-3 h-3 mr-1" />
        <span>Your Wage (${wage.toFixed(2)})</span>
      </div>
    </foreignObject>
  );
}
