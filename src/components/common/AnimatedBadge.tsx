'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, AlertTriangle, Info, Star, Crown, Shield } from 'lucide-react';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';
type BadgeAnimation = 'none' | 'pulse' | 'bounce' | 'shake' | 'glow' | 'float';

interface AnimatedBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  animation?: BadgeAnimation;
  icon?: React.ReactNode;
  closable?: boolean;
  onClose?: () => void;
  count?: number;
  dot?: boolean;
  className?: string;
  onClick?: () => void;
}

export function AnimatedBadge({
  children,
  variant = 'primary',
  size = 'md',
  animation = 'none',
  icon,
  closable = false,
  onClose,
  count,
  dot = false,
  className = '',
  onClick,
}: AnimatedBadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-500 text-white border-primary-600';
      case 'secondary':
        return 'bg-secondary-500 text-white border-secondary-600';
      case 'success':
        return 'bg-green-500 text-white border-green-600';
      case 'warning':
        return 'bg-yellow-500 text-white border-yellow-600';
      case 'error':
        return 'bg-red-500 text-white border-red-600';
      case 'info':
        return 'bg-blue-500 text-white border-blue-600';
      default:
        return 'bg-gray-500 text-white border-gray-600';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-base';
      default:
        return 'px-3 py-1.5 text-sm';
    }
  };

  const getAnimationProps = () => {
    switch (animation) {
      case 'pulse':
        return {
          animate: { scale: [1, 1.05, 1] },
          transition: { duration: 2, repeat: Infinity },
        };
      case 'bounce':
        return {
          animate: { y: [0, -4, 0] },
          transition: { duration: 1, repeat: Infinity },
        };
      case 'shake':
        return {
          animate: { x: [0, -2, 2, -2, 0] },
          transition: { duration: 0.5, repeat: Infinity, repeatDelay: 2 },
        };
      case 'glow':
        return {
          animate: { 
            boxShadow: [
              '0 0 0 0 rgba(59, 130, 246, 0.5)',
              '0 0 0 8px rgba(59, 130, 246, 0)',
            ]
          },
          transition: { duration: 2, repeat: Infinity },
        };
      case 'float':
        return {
          animate: { y: [0, -8, 0] },
          transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
        };
      default:
        return {};
    }
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium border
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...getAnimationProps()}
    >
      {/* Icon */}
      {icon && (
        <motion.span
          initial={{ rotate: -180 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          {icon}
        </motion.span>
      )}

      {/* Dot indicator */}
      {dot && (
        <motion.div
          animate={{ scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 bg-current rounded-full"
        />
      )}

      {/* Content */}
      <span>{children}</span>

      {/* Count */}
      {count !== undefined && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xs font-bold"
        >
          {count > 99 ? '99+' : count}
        </motion.span>
      )}

      {/* Close button */}
      {closable && onClose && (
        <motion.button
          whileHover={{ scale: 1.2, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="ml-1 hover:bg-white/20 rounded-full p-0.5"
        >
          <X className="w-3 h-3" />
        </motion.button>
      )}
    </motion.span>
  );
}

// Status Badge with predefined icons
export function StatusBadge({
  status,
  animated = true,
  ...props
}: {
  status: 'online' | 'offline' | 'busy' | 'away';
  animated?: boolean;
} & Omit<AnimatedBadgeProps, 'variant' | 'children' | 'icon'>) {
  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return { variant: 'success' as const, text: 'Online', icon: <Check className="w-3 h-3" /> };
      case 'offline':
        return { variant: 'error' as const, text: 'Offline', icon: <X className="w-3 h-3" /> };
      case 'busy':
        return { variant: 'warning' as const, text: 'Busy', icon: <AlertTriangle className="w-3 h-3" /> };
      case 'away':
        return { variant: 'info' as const, text: 'Away', icon: <Info className="w-3 h-3" /> };
      default:
        return { variant: 'info' as const, text: 'Unknown', icon: <Info className="w-3 h-3" /> };
    }
  };

  const config = getStatusConfig();

  return (
    <AnimatedBadge
      variant={config.variant}
      icon={config.icon}
      animation={animated ? 'pulse' : 'none'}
      dot
      {...props}
    >
      {config.text}
    </AnimatedBadge>
  );
}

// Achievement Badge with special animations
export function AchievementBadge({
  type,
  level,
  ...props
}: {
  type: 'star' | 'crown' | 'shield';
  level?: number;
} & Omit<AnimatedBadgeProps, 'children' | 'icon' | 'variant'>) {
  const getAchievementConfig = () => {
    switch (type) {
      case 'star':
        return { 
          variant: 'warning' as const,
          icon: <Star className="w-4 h-4 fill-current" />,
          text: level ? `${level} Star${level > 1 ? 's' : ''}` : 'Star'
        };
      case 'crown':
        return { 
          variant: 'primary' as const,
          icon: <Crown className="w-4 h-4 fill-current" />,
          text: level ? `Level ${level}` : 'Crown'
        };
      case 'shield':
        return { 
          variant: 'success' as const,
          icon: <Shield className="w-4 h-4 fill-current" />,
          text: level ? `Shield ${level}` : 'Shield'
        };
      default:
        return { 
          variant: 'info' as const,
          icon: <Star className="w-4 h-4 fill-current" />,
          text: 'Achievement'
        };
    }
  };

  const config = getAchievementConfig();

  return (
    <AnimatedBadge
      variant={config.variant}
      icon={config.icon}
      animation="glow"
      {...props}
    >
      {config.text}
    </AnimatedBadge>
  );
}

// Notification Badge (usually positioned absolutely)
export function NotificationBadge({
  count,
  max = 99,
  showZero = false,
  ...props
}: {
  count: number;
  max?: number;
  showZero?: boolean;
} & Omit<AnimatedBadgeProps, 'children' | 'count'>) {
  if (count === 0 && !showZero) return null;

  return (
    <AnimatedBadge
      variant="error"
      size="sm"
      animation="bounce"
      {...props}
    >
      {count > max ? `${max}+` : count}
    </AnimatedBadge>
  );
}

// Badge Group with stagger animation
export function AnimatedBadgeGroup({
  badges,
  className = '',
}: {
  badges: (AnimatedBadgeProps & { id: string })[];
  className?: string;
}) {
  return (
    <motion.div
      className={`flex flex-wrap gap-2 ${className}`}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      <AnimatePresence>
        {badges.map((badge) => (
          <motion.div
            key={badge.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <AnimatedBadge {...badge} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}