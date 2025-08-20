import type { ShiftEvent } from './types';

export const getEventStyle = (event: ShiftEvent) => {
  let backgroundColor = '#10b981'; // 기본: day shift -> green
  let borderColor = '#059669';
  const textColor = '#ffffff';

  // Night shift
  if (event.title.includes('Night') || event.title.includes('NOC')) {
    backgroundColor = '#4f46e5'; // night shift
    borderColor = '#4338ca';
  }
  // Weekend
  if (event.title.includes('Weekend')) {
    backgroundColor = '#f59e0b'; // weekend
    borderColor = '#d97706';
  }
  // Holiday
  if (event.resource?.isHoliday) {
    backgroundColor = '#ef4444';
    borderColor = '#dc2626';
  }
  // Charge Nurse
  if (
    event.resource?.differentials?.some((diff: string) =>
      diff.includes('Charge')
    )
  ) {
    borderColor = '#000000'; // charge nurse => black border
  }

  return {
    style: {
      backgroundColor,
      color: textColor,
      borderColor,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderRadius: '4px',
      opacity: 0.9,
      display: 'block',
      fontWeight: 'bold',
      fontSize: '0.8em',
      padding: '2px 4px',
    },
  };
};

export const calculateShiftStats = (events: ShiftEvent[]) => {
  const totalHours = events.reduce(
    (sum, event) => sum + (event.resource?.hours || 0),
    0
  );
  
  const shiftTypes = events.reduce((acc, event) => {
    const type = event.title.split(':')[0];
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const avgHourlyRate = events.length > 0
    ? events.reduce((sum, event) => sum + (event.resource?.hourlyRate || 0), 0) / events.length
    : 0;

  return {
    totalHours,
    shiftTypes,
    avgHourlyRate,
    shiftsCount: events.length,
  };
};