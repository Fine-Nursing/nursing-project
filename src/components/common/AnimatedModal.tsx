'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface AnimatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  animation?: 'fade' | 'scale' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'rotate';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

export function AnimatedModal({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  animation = 'scale',
  closeOnOverlayClick = true,
  showCloseButton = true,
  className = '',
}: AnimatedModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return 'max-w-md';
      case 'lg': return 'max-w-4xl';
      case 'xl': return 'max-w-6xl';
      case 'full': return 'w-full h-full m-0 rounded-none';
      default: return 'max-w-2xl';
    }
  };

  const getAnimationVariants = () => {
    switch (animation) {
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        };
      case 'slide-up':
        return {
          initial: { opacity: 0, y: 100 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 100 },
        };
      case 'slide-down':
        return {
          initial: { opacity: 0, y: -100 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -100 },
        };
      case 'slide-left':
        return {
          initial: { opacity: 0, x: 100 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 100 },
        };
      case 'slide-right':
        return {
          initial: { opacity: 0, x: -100 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -100 },
        };
      case 'rotate':
        return {
          initial: { opacity: 0, rotate: -180, scale: 0.5 },
          animate: { opacity: 1, rotate: 0, scale: 1 },
          exit: { opacity: 0, rotate: 180, scale: 0.5 },
        };
      default: // scale
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.8 },
        };
    }
  };

  const modalVariants = getAnimationVariants();

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={closeOnOverlayClick ? onClose : undefined}
        >
          <motion.div
            {...modalVariants}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
            }}
            onClick={(e) => e.stopPropagation()}
            className={`
              relative w-full bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden
              ${getSizeStyles()}
              ${className}
            `}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-between p-6 border-b border-gray-200"
              >
                {title && (
                  <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                )}
                {showCloseButton && (
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </motion.button>
                )}
              </motion.div>
            )}

            {/* Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="overflow-y-auto"
              style={{ maxHeight: size === 'full' ? 'calc(100vh - 80px)' : 'calc(90vh - 80px)' }}
            >
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

// Confirmation Modal
export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'primary' | 'danger';
}) {
  const getButtonStyles = () => {
    switch (variant) {
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white';
      default:
        return 'bg-primary-500 hover:bg-primary-600 text-white';
    }
  };

  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      animation="scale"
    >
      <div className="p-6">
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
          >
            {cancelText}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-lg font-medium ${getButtonStyles()}`}
          >
            {confirmText}
          </motion.button>
        </div>
      </div>
    </AnimatedModal>
  );
}

// Image Modal
export function ImageModal({
  isOpen,
  onClose,
  src,
  alt,
  title,
}: {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  title?: string;
}) {
  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="xl"
      animation="scale"
      className="bg-black"
    >
      <div className="p-4">
        <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          src={src}
          alt={alt}
          className="w-full h-auto max-h-[80vh] object-contain mx-auto"
        />
      </div>
    </AnimatedModal>
  );
}

// Form Modal
export function FormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  submitText = 'Submit',
  cancelText = 'Cancel',
  isLoading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  children: React.ReactNode;
  submitText?: string;
  cancelText?: string;
  isLoading?: boolean;
}) {
  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
      animation="slide-up"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="p-6">
          {children}
        </div>
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
          >
            {cancelText}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white rounded-lg font-medium"
          >
            {isLoading ? 'Loading...' : submitText}
          </motion.button>
        </div>
      </form>
    </AnimatedModal>
  );
}