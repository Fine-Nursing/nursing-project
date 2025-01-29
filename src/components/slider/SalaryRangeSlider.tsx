import React, { useCallback, useEffect, useRef } from 'react';

interface Props {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

function RangeSlider({ min, max, value, onChange }: Props) {
  const rangeRef = useRef<HTMLDivElement>(null);
  const leftThumbRef = useRef<HTMLDivElement>(null);
  const rightThumbRef = useRef<HTMLDivElement>(null);
  const [activeThumb, setActiveThumb] = React.useState<'left' | 'right' | null>(
    null
  );

  const getPercentage = useCallback(
    (value: number) => ((value - min) / (max - min)) * 100,
    [min, max]
  );

  const handleDrag = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!rangeRef.current || !activeThumb) return;

      const range = rangeRef.current.getBoundingClientRect();
      const pageX =
        'touches' in event ? event.touches[0].clientX : event.clientX;
      const position = ((pageX - range.left) / range.width) * (max - min) + min;
      const roundedPosition = Math.round(position / 5000) * 5000;
      const clampedPosition = Math.max(min, Math.min(max, roundedPosition));

      const newValue: [number, number] = [...value];
      if (activeThumb === 'left') {
        if (clampedPosition < value[1] - 5000) {
          newValue[0] = clampedPosition;
        }
      } else if (clampedPosition > value[0] + 5000) {
        newValue[1] = clampedPosition;
      }

      onChange(newValue);
    },
    [activeThumb, max, min, onChange, value]
  );

  const handleStartDrag = useCallback((thumb: 'left' | 'right') => {
    setActiveThumb(thumb);
  }, []);

  const handleStopDrag = useCallback(() => {
    setActiveThumb(null);
  }, []);

  useEffect(() => {
    if (activeThumb) {
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleStopDrag);
      document.addEventListener('touchmove', handleDrag);
      document.addEventListener('touchend', handleStopDrag);

      return () => {
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', handleStopDrag);
        document.removeEventListener('touchmove', handleDrag);
        document.removeEventListener('touchend', handleStopDrag);
      };
    }
  }, [activeThumb, handleDrag, handleStopDrag]);

  return (
    <div className="relative w-full h-16 select-none touch-none">
      {/* Track */}
      <div
        ref={rangeRef}
        className="absolute top-8 w-full h-1 bg-gray-200 rounded-full"
      >
        {/* Active Track */}
        <div
          className="absolute h-full bg-gradient-to-r from-violet-500 to-violet-600 rounded-full"
          style={{
            left: `${getPercentage(value[0])}%`,
            right: `${100 - getPercentage(value[1])}%`,
          }}
        />
      </div>

      {/* Left Thumb */}
      <div
        ref={leftThumbRef}
        onMouseDown={() => handleStartDrag('left')}
        onTouchStart={() => handleStartDrag('left')}
        className="group absolute top-6 -ml-3 cursor-grab active:cursor-grabbing"
        style={{ left: `${getPercentage(value[0])}%` }}
      >
        <div className="relative">
          <div
            className={`w-6 h-6 rounded-full transition-all duration-150
            ${
              activeThumb === 'left'
                ? 'scale-125 bg-violet-600 shadow-lg ring-4 ring-violet-100'
                : 'bg-white border-2 border-violet-500 shadow-md hover:scale-110'
            }
          `}
          />
          <div
            className={`absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 
            bg-violet-900 text-white text-xs rounded shadow-lg opacity-0 transition-opacity
            ${activeThumb === 'left' || 'group-hover:opacity-100'}`}
          >
            ${(value[0] / 1000).toFixed(0)}k
          </div>
        </div>
      </div>

      {/* Right Thumb */}
      <div
        ref={rightThumbRef}
        onMouseDown={() => handleStartDrag('right')}
        onTouchStart={() => handleStartDrag('right')}
        className="group absolute top-6 -ml-3 cursor-grab active:cursor-grabbing"
        style={{ left: `${getPercentage(value[1])}%` }}
      >
        <div className="relative">
          <div
            className={`w-6 h-6 rounded-full transition-all duration-150
            ${
              activeThumb === 'right'
                ? 'scale-125 bg-violet-600 shadow-lg ring-4 ring-violet-100'
                : 'bg-white border-2 border-violet-500 shadow-md hover:scale-110'
            }
          `}
          />
          <div
            className={`absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 
            bg-violet-900 text-white text-xs rounded shadow-lg opacity-0 transition-opacity
            ${activeThumb === 'right' || 'group-hover:opacity-100'}`}
          >
            ${(value[1] / 1000).toFixed(0)}k
          </div>
        </div>
      </div>

      {/* Value Labels */}
      <div className="absolute w-full flex justify-between mt-12">
        <span className="text-sm text-gray-500">${min / 1000}k</span>
        <span className="text-sm text-gray-500">${max / 1000}k</span>
      </div>
    </div>
  );
}

export default RangeSlider;
