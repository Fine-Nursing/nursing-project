import type { ButtonHTMLAttributes } from 'react';
import cn from 'src/lib/utils';

type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonVariant = 'invert' | 'solid' | 'outline';
type ButtonColor = 'emerald' | 'blue' | 'red' | 'green';

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
  color?: ButtonColor;
  className?: string;
  children: React.ReactNode;
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-8 py-2 text-base',
  lg: 'px-10 py-3 text-lg',
};

const colorVariantClasses: Record<
  ButtonColor,
  Record<ButtonVariant, string>
> = {
  emerald: {
    invert:
      'bg-emerald-500 text-white hover:bg-white hover:text-black border-2 border-transparent hover:border-emerald-500',
    solid:
      'bg-emerald-500 text-white hover:bg-emerald-600 border-2 border-emerald-500',
    outline:
      'bg-white text-emerald-500 border-2 border-emerald-500 hover:bg-emerald-500 hover:text-white',
  },
  blue: {
    invert:
      'bg-blue-500 text-white hover:bg-white hover:text-black border-2 border-transparent hover:border-blue-500',
    solid: 'bg-blue-500 text-white hover:bg-blue-600 border-2 border-blue-500',
    outline:
      'bg-white text-blue-500 border-2 border-blue-500 hover:bg-blue-500 hover:text-white',
  },
  red: {
    invert:
      'bg-red-500 text-white hover:bg-white hover:text-black border-2 border-transparent hover:border-red-500',
    solid: 'bg-red-500 text-white hover:bg-red-600 border-2 border-red-500',
    outline:
      'bg-white text-red-500 border-2 border-red-500 hover:bg-red-500 hover:text-white',
  },
  green: {
    invert:
      'bg-green-500 text-white hover:bg-white hover:text-black border-2 border-transparent hover:border-green-500',
    solid:
      'bg-green-500 text-white hover:bg-green-600 border-2 border-green-500',
    outline:
      'bg-white text-green-500 border-2 border-green-500 hover:bg-green-500 hover:text-white',
  },
};

export default function ActionButton({
  size = 'md',
  variant = 'invert',
  color = 'emerald',
  className,
  children,
  ...props
}: ActionButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'rounded-md font-bold transition duration-200',
        sizeStyles[size],
        colorVariantClasses[color][variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
