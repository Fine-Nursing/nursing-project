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

  // Hide on mobile screens (< 640px)
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) return null;

  // Minimal professional design
  return (
    <g>
      {/* Simple text without background */}
      <text
        x={x}
        y={y - 10}
        fill="#3b82f6"
        fontSize={12}
        fontWeight={700}
        textAnchor="middle"
        dominantBaseline="bottom"
      >
        You
      </text>
      {/* Small indicator line */}
      <line
        x1={x}
        y1={y - 8}
        x2={x}
        y2={y - 2}
        stroke="#3b82f6"
        strokeWidth={2}
      />
    </g>
  );
}
