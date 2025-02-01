import React, { useCallback, useEffect, useRef, useState } from 'react';

interface RangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  id?: string;
}

function RangeSlider({
  min,
  max,
  value,
  onChange,
  id = 'range-slider',
}: RangeSliderProps) {
  const rangeRef = useRef<HTMLDivElement>(null);
  const leftThumbRef = useRef<HTMLButtonElement>(null);
  const rightThumbRef = useRef<HTMLButtonElement>(null);
  const [activeThumb, setActiveThumb] = useState<'left' | 'right' | null>(null);

  const step = 5000;

  const getPercentage = useCallback(
    (V: number) => ((V - min) / (max - min)) * 100,
    [min, max]
  );
  const getValueFromPosition = useCallback(
    (position: number): number => {
      const percentage = Math.max(0, Math.min(100, position));
      const newValue = ((max - min) * percentage) / 100 + min;
      return Math.round(newValue / step) * step; // step 변수 사용
    },
    [min, max]
  );

  const handleDrag = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!rangeRef.current || !activeThumb) return;

      const range = rangeRef.current.getBoundingClientRect();
      const pageX =
        'touches' in event ? event.touches[0].clientX : event.clientX;
      const position = ((pageX - range.left) / range.width) * 100;
      const newValue = getValueFromPosition(position);

      const updatedValue: [number, number] = [...value];
      if (activeThumb === 'left') {
        if (newValue < value[1] - 5000) {
          updatedValue[0] = Math.max(min, newValue);
        }
      } else if (newValue > value[0] + 5000) {
        updatedValue[1] = Math.min(max, newValue);
      }

      onChange(updatedValue);
    },
    [activeThumb, max, min, onChange, value, getValueFromPosition]
  );

  const handleKeyDown = useCallback(
    (thumb: 'left' | 'right') => (e: React.KeyboardEvent) => {
      const updatedValue: [number, number] = [...value];

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowDown':
          if (thumb === 'left') {
            updatedValue[0] = Math.max(min, value[0] - step);
          } else {
            updatedValue[1] = Math.max(value[0] + step, value[1] - step);
          }
          break;
        case 'ArrowRight':
        case 'ArrowUp':
          if (thumb === 'left') {
            updatedValue[0] = Math.min(value[1] - step, value[0] + step);
          } else {
            updatedValue[1] = Math.min(max, value[1] + step);
          }
          break;
        case 'Home':
          updatedValue[thumb === 'left' ? 0 : 1] = thumb === 'left' ? min : max;
          break;
        case 'End':
          updatedValue[thumb === 'left' ? 0 : 1] = thumb === 'left' ? min : max;
          break;

        default:
          return;
      }

      e.preventDefault();
      onChange(updatedValue);
    },
    [min, max, value, onChange]
  );

  const handleStartDrag = useCallback((thumb: 'left' | 'right') => {
    setActiveThumb(thumb);
  }, []);

  const handleStopDrag = useCallback(() => {
    setActiveThumb(null);
  }, []);

  useEffect(() => {
    if (!activeThumb) return undefined; // 또는 return; 대신 return undefined;

    const handleDragWrapper = (e: MouseEvent | TouchEvent) => handleDrag(e);

    document.addEventListener('mousemove', handleDragWrapper);
    document.addEventListener('mouseup', handleStopDrag);
    document.addEventListener('touchmove', handleDragWrapper);
    document.addEventListener('touchend', handleStopDrag);

    return () => {
      document.removeEventListener('mousemove', handleDragWrapper);
      document.removeEventListener('mouseup', handleStopDrag);
      document.removeEventListener('touchmove', handleDragWrapper);
      document.removeEventListener('touchend', handleStopDrag);
    };
  }, [activeThumb, handleDrag, handleStopDrag]);

  const renderThumb = (thumb: 'left' | 'right') => {
    const isLeft = thumb === 'left';
    const currentValue = isLeft ? value[0] : value[1];
    const label = isLeft ? 'Minimum salary' : 'Maximum salary';
    const valueMin = isLeft ? min : value[0];
    const valueMax = isLeft ? value[1] : max;

    return (
      <button
        type="button"
        ref={isLeft ? leftThumbRef : rightThumbRef}
        role="slider"
        aria-label={label}
        aria-valuemin={valueMin}
        aria-valuemax={valueMax}
        aria-valuenow={currentValue}
        aria-valuetext={`$${(currentValue / 1000).toFixed(0)}k`}
        onMouseDown={() => handleStartDrag(thumb)}
        onTouchStart={() => handleStartDrag(thumb)}
        onKeyDown={handleKeyDown(thumb)}
        className="group absolute top-6 -ml-3 cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2"
        style={{ left: `${getPercentage(currentValue)}%` }}
        tabIndex={0}
      >
        <div className="relative">
          <div
            className={`w-6 h-6 rounded-full transition-all duration-150
              ${
                activeThumb === thumb
                  ? 'scale-125 bg-violet-600 shadow-lg ring-4 ring-violet-100'
                  : 'bg-white border-2 border-violet-500 shadow-md hover:scale-110'
              }
            `}
          />
          <div
            className={`absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 
              bg-violet-900 text-white text-xs rounded shadow-lg opacity-0 transition-opacity
              ${activeThumb === thumb ? 'opacity-100' : 'group-hover:opacity-100'}`}
          >
            ${(currentValue / 1000).toFixed(0)}k
          </div>
        </div>
      </button>
    );
  };

  return (
    <div
      className="relative w-full h-16 select-none touch-none"
      role="group"
      aria-labelledby={`${id}-label`}
    >
      <div id={`${id}-label`} className="sr-only">
        Salary range selector
      </div>

      {/* Track */}
      <div
        ref={rangeRef}
        className="absolute top-8 w-full h-1 bg-gray-200 rounded-full"
        role="presentation"
      >
        {/* Active Track */}
        <div
          className="absolute h-full bg-gradient-to-r from-violet-500 to-violet-600 rounded-full"
          style={{
            left: `${getPercentage(value[0])}%`,
            right: `${100 - getPercentage(value[1])}%`,
          }}
          role="presentation"
        />
      </div>

      {/* Thumbs */}
      {renderThumb('left')}
      {renderThumb('right')}

      {/* Value Labels */}
      <div
        className="absolute w-full flex justify-between mt-12"
        aria-hidden="true"
      >
        <span className="text-sm text-gray-500">${min / 1000}k</span>
        <span className="text-sm text-gray-500">${max / 1000}k</span>
      </div>
    </div>
  );
}

export default RangeSlider;
