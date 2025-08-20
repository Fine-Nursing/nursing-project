import React from 'react';
import type { CellProps, Row } from 'react-table';
import type { NursingPosition } from 'src/types/nursing';

export function UserCell({ value }: CellProps<NursingPosition, string>) {
  if (!value) return <span className="text-gray-400">-</span>;
  return <span className="font-medium text-sm">#{value.slice(-4)}</span>;
}

export function ShiftCell({
  value,
}: CellProps<NursingPosition, NursingPosition['shift']>) {
  const shiftColors = {
    Day: 'bg-yellow-100 text-yellow-800',
    Night: 'bg-blue-100 text-blue-800',
    Evening: 'bg-zinc-100 text-zinc-800',
    Rotating: 'bg-gray-100 text-gray-800',
  };

  const bgColor = shiftColors[value] || 'bg-gray-100 text-gray-800';

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bgColor}`}
    >
      {value}
    </span>
  );
}

export function CombinedPayCell({ row }: { row: Row<NursingPosition> }) {
  const { compensation } = row.original;
  const [isNearBottom, setIsNearBottom] = React.useState(false);

  if (!compensation) {
    return <div className="text-gray-500">N/A</div>;
  }

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    setIsNearBottom(rect.bottom > viewportHeight - 300);
  };

  return (
    <div className="relative group" onMouseEnter={handleMouseEnter}>
      <div className="font-bold text-green-600 cursor-pointer">
        ${compensation.hourly?.toLocaleString() || 0}/hr
      </div>

      <div
        className={`absolute z-[100] invisible group-hover:visible opacity-0 group-hover:opacity-100 
                    transition-all duration-200 
                    ${
                      isNearBottom
                        ? 'bottom-full right-0 mb-2'
                        : 'top-0 right-full mr-2'
                    }
                    bg-gray-900 text-white text-xs rounded-lg px-2 py-1 shadow-xl min-w-[180px]`}
      >
        <div
          className={`absolute border-4 border-transparent
                      ${
                        isNearBottom
                          ? 'top-full right-4 border-t-gray-900'
                          : 'top-3 -right-1 border-l-gray-900'
                      }`}
        />
        <div className="space-y-2">
          <div className="font-semibold text-sm border-b border-gray-700 pb-1">
            Total: ${compensation.hourly || 0}/hr
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span>Base Pay:</span>
              <span className="font-medium">
                ${compensation.basePay || 0}/hr
              </span>
            </div>

            {(compensation.totalDifferential || 0) > 0 && (
              <>
                <div className="flex justify-between items-center text-blue-300">
                  <span>Differentials:</span>
                  <span className="font-medium">
                    ${compensation.totalDifferential || 0}/hr
                  </span>
                </div>

                {compensation.differentialBreakdown &&
                  compensation.differentialBreakdown.length > 0 && (
                    <div className="ml-2 space-y-0.5 text-gray-300">
                      {compensation.differentialBreakdown.map((diff) => (
                        <div
                          key={`${diff.type}-${diff.amount}`}
                          className="flex justify-between items-center text-xs"
                        >
                          <span>• {diff.type}:</span>
                          <span>+${diff.amount || 0}/hr</span>
                        </div>
                      ))}
                    </div>
                  )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ExperienceCell({ value }: CellProps<NursingPosition, string>) {
  return <span className="text-sm text-gray-900">{value}</span>;
}