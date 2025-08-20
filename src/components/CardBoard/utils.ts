export function getGridColumns(columns: number): string {
  if (columns === 2) return 'sm:grid-cols-2';
  if (columns === 4) return 'sm:grid-cols-2 lg:grid-cols-4';
  return '';
}

export function getResponsiveColumns(): number {
  if (typeof window === 'undefined') return 4;
  if (window.innerWidth < 640) return 1; // mobile
  if (window.innerWidth < 1024) return 2; // tablet
  return 4; // desktop
}