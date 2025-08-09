import type { ButtonHTMLAttributes } from 'react';
import cn from 'src/lib/utils';

type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonVariant = 'invert' | 'solid' | 'outline';
type ButtonColor = 'slate' | 'blue' | 'red' | 'green' | 'emerald';

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
  slate: {
    invert:
      'bg-slate-500 text-white hover:bg-white hover:text-black active:bg-slate-600 border-2 border-transparent hover:border-slate-500',
    solid:
      'bg-slate-500 text-white hover:bg-slate-600 active:bg-slate-700 border-2 border-slate-500',
    outline:
      'bg-white text-slate-500 border-2 border-slate-500 hover:bg-slate-500 hover:text-white active:bg-slate-600',
  },
  blue: {
    invert:
      'bg-blue-500 text-white hover:bg-white hover:text-black active:bg-blue-600 border-2 border-transparent hover:border-blue-500',
    solid: 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 border-2 border-blue-500',
    outline:
      'bg-white text-blue-500 border-2 border-blue-500 hover:bg-blue-500 hover:text-white active:bg-blue-600',
  },
  red: {
    invert:
      'bg-red-500 text-white hover:bg-white hover:text-black active:bg-red-600 border-2 border-transparent hover:border-red-500',
    solid: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 border-2 border-red-500',
    outline:
      'bg-white text-red-500 border-2 border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600',
  },
  green: {
    invert:
      'bg-green-500 text-white hover:bg-white hover:text-black active:bg-green-600 border-2 border-transparent hover:border-green-500',
    solid:
      'bg-green-500 text-white hover:bg-green-600 active:bg-green-700 border-2 border-green-500',
    outline:
      'bg-white text-green-500 border-2 border-green-500 hover:bg-green-500 hover:text-white active:bg-green-600',
  },
  emerald: {
    invert:
      'bg-emerald-500 text-white hover:bg-white hover:text-emerald-600 active:bg-emerald-600 border-2 border-transparent hover:border-emerald-500',
    solid:
      'bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700 border-2 border-emerald-500',
    outline:
      'bg-white text-emerald-600 border-2 border-emerald-500 hover:bg-emerald-500 hover:text-white active:bg-emerald-600',
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
