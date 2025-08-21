import type { RadarPoint } from './types';

export function calculateRadarPoints(
  metrics: Record<string, number>,
  radius: number,
  centerX: number = 175,
  centerY: number = 175
): RadarPoint[] {
  const categories = Object.keys(metrics);
  const angleSlice = (Math.PI * 2) / categories.length;
  const points: RadarPoint[] = [];

  categories.forEach((cat, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    // Normalize the value properly - assuming metrics are 0-10 scale
    const normalizedValue = Math.min(metrics[cat] / 10, 1); // Ensure max is 1
    const x = centerX + radius * normalizedValue * Math.cos(angle);
    const y = centerY + radius * normalizedValue * Math.sin(angle);
    points.push({ x, y, label: cat, value: metrics[cat] });
  });
  return points;
}

export function createPolygonPoints(points: RadarPoint[]): string {
  return points.map((p) => `${p.x},${p.y}`).join(' ');
}

export function getScoreColor(
  scoreDiff: number,
  theme: 'light' | 'dark'
): string {
  const diff = parseFloat(scoreDiff.toString());
  
  if (diff >= 0) {
    return theme === 'light' ? 'text-emerald-600' : 'text-emerald-400';
  } 
    return theme === 'light' ? 'text-amber-600' : 'text-amber-400';
  
}

export function getProgressBarColor(
  value: number,
  avgValue: number,
  theme: 'light' | 'dark'
): string {
  if (value > avgValue) {
    return theme === 'light' ? 'bg-emerald-500' : 'bg-emerald-400';
  } if (value < avgValue) {
    return theme === 'light' ? 'bg-amber-500' : 'bg-amber-400';
  } 
    return theme === 'light' ? 'bg-blue-500' : 'bg-blue-400';
  
}