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
  // Safer positioning - ensure it doesn't go outside chart bounds
  const bubbleX = Math.max(15, x - 50); // Don't go less than 15px from left edge
  const bubbleY = Math.max(15, y - 35); // Don't go less than 15px from top edge

  return (
    <foreignObject x={bubbleX} y={bubbleY} width={100} height={35}>
      <div className="flex items-center justify-center bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg shadow-lg text-xs font-medium border border-emerald-200">
        <Star className="w-3 h-3 mr-1 fill-current" />
        <span>You: ${wage}</span>
      </div>
    </foreignObject>
  );
}
