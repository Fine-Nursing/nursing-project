export const getSizeStyles = (size: 'sm' | 'md' | 'lg', height?: number) => {
  if (height) return { height: `${height}px` };
  
  switch (size) {
    case 'sm': return { height: '6px' };
    case 'lg': return { height: '16px' };
    default: return { height: '10px' };
  }
};

export const getVariantStyles = (variant: 'default' | 'gradient' | 'striped' | 'glow') => {
  switch (variant) {
    case 'gradient':
      return 'bg-gradient-to-r from-blue-500 to-purple-600';
    case 'striped':
      return 'bg-blue-500 bg-striped';
    case 'glow':
      return 'bg-blue-500 shadow-blue-500/50 shadow-lg';
    default:
      return '';
  }
};

export const getStepSizeStyles = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'sm': return { stepSize: 'w-6 h-6', text: 'text-xs' };
    case 'lg': return { stepSize: 'w-12 h-12', text: 'text-base' };
    default: return { stepSize: 'w-8 h-8', text: 'text-sm' };
  }
};

export const calculatePercentage = (progress: number, max: number) => Math.min((progress / max) * 100, 100);