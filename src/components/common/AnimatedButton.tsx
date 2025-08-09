'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { type ReactNode } from 'react';

interface AnimatedButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  isLoading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export function AnimatedButton({
  variant = 'primary',
  size = 'md',
  children,
  isLoading = false,
  icon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: AnimatedButtonProps) {
  const baseClasses = 'relative font-medium rounded-xl transition-all focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 focus:ring-primary-300 shadow-lg hover:shadow-xl',
    secondary: 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white hover:from-secondary-600 hover:to-secondary-700 focus:ring-secondary-300 shadow-lg hover:shadow-xl',
    accent: 'bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 focus:ring-accent-300 shadow-lg hover:shadow-xl',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-300 shadow-lg hover:shadow-xl',
    ghost: 'bg-transparent text-primary-600 hover:bg-primary-50 focus:ring-primary-200 border-2 border-primary-200 hover:border-primary-300',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Background animation on hover */}
      <motion.div
        className="absolute inset-0 bg-white opacity-0"
        whileHover={{ opacity: 0.1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        whileTap={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Content */}
      <span className="relative flex items-center justify-center gap-2">
        {isLoading ? (
          <motion.div
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ) : (
          <>
            {icon && (
              <motion.span
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {icon}
              </motion.span>
            )}
            {children}
          </>
        )}
      </span>
    </motion.button>
  );
}

// Icon Button with hover animation
export function AnimatedIconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  className = '',
  ...props
}: Omit<AnimatedButtonProps, 'children'> & { icon: ReactNode }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <motion.button
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center ${
        variant === 'ghost' 
          ? 'hover:bg-gray-100 text-gray-600 hover:text-gray-900' 
          : `bg-gradient-to-br from-${variant}-400 to-${variant}-600 text-white shadow-lg hover:shadow-xl`
      } transition-all ${className}`}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      {...props}
    >
      <motion.span
        whileHover={{ rotate: -5 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {icon}
      </motion.span>
    </motion.button>
  );
}

// Floating Action Button
export function FloatingActionButton({
  icon,
  onClick,
  className = '',
}: {
  icon: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <motion.button
      className={`fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full shadow-2xl flex items-center justify-center ${className}`}
      whileHover={{ scale: 1.1, rotate: 90 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      onClick={onClick}
    >
      <motion.div
        animate={{
          boxShadow: [
            '0 0 0 0 rgba(33, 150, 243, 0.4)',
            '0 0 0 20px rgba(33, 150, 243, 0)',
          ],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
        className="absolute inset-0 rounded-full"
      />
      <span className="relative z-10">{icon}</span>
    </motion.button>
  );
}