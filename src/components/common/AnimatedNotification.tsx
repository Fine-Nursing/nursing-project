'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { createPortal } from 'react-dom';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';
export type NotificationPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface AnimatedNotificationProps {
  notifications: NotificationItem[];
  position?: NotificationPosition;
  onClose: (id: string) => void;
  maxVisible?: number;
}

// Notification Provider Hook
let notificationId = 0;
const notifications: NotificationItem[] = [];
const listeners: Set<(notifications: NotificationItem[]) => void> = new Set();

export const notify = {
  success: (title: string, message?: string, duration = 5000) => {
    const id = `notification-${++notificationId}`;
    const notification: NotificationItem = { id, type: 'success', title, message, duration };
    notifications.push(notification);
    listeners.forEach(listener => listener([...notifications]));
    return id;
  },
  error: (title: string, message?: string, duration = 5000) => {
    const id = `notification-${++notificationId}`;
    const notification: NotificationItem = { id, type: 'error', title, message, duration };
    notifications.push(notification);
    listeners.forEach(listener => listener([...notifications]));
    return id;
  },
  warning: (title: string, message?: string, duration = 5000) => {
    const id = `notification-${++notificationId}`;
    const notification: NotificationItem = { id, type: 'warning', title, message, duration };
    notifications.push(notification);
    listeners.forEach(listener => listener([...notifications]));
    return id;
  },
  info: (title: string, message?: string, duration = 5000) => {
    const id = `notification-${++notificationId}`;
    const notification: NotificationItem = { id, type: 'info', title, message, duration };
    notifications.push(notification);
    listeners.forEach(listener => listener([...notifications]));
    return id;
  },
  remove: (id: string) => {
    const index = notifications.findIndex(n => n.id === id);
    if (index > -1) {
      notifications.splice(index, 1);
      listeners.forEach(listener => listener([...notifications]));
    }
  },
};

export function useNotifications() {
  const [items, setItems] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const listener = (notifications: NotificationItem[]) => {
      setItems(notifications);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return {
    notifications: items,
    notify,
  };
}

// Single Notification Component
function NotificationCard({
  notification,
  onClose,
}: {
  notification: NotificationItem;
  onClose: () => void;
}) {
  useEffect(() => {
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(onClose, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification.duration, onClose]);

  const getIcon = () => {
    switch (notification.type) {
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'error': return <AlertCircle className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'info': return <Info className="w-5 h-5" />;
    }
  };

  const getColors = () => {
    switch (notification.type) {
      case 'success': return 'from-green-500 to-emerald-600 text-white';
      case 'error': return 'from-red-500 to-rose-600 text-white';
      case 'warning': return 'from-yellow-500 to-orange-600 text-white';
      case 'info': return 'from-blue-500 to-indigo-600 text-white';
    }
  };

  const slideVariants = {
    initial: { x: 400, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 400, opacity: 0 },
  };

  return (
    <motion.div
      layout
      variants={slideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
      className="relative"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`bg-gradient-to-r ${getColors()} rounded-xl shadow-2xl overflow-hidden min-w-[320px] max-w-md`}
      >
        {/* Progress bar */}
        {notification.duration && notification.duration > 0 && (
          <motion.div
            className="absolute top-0 left-0 h-1 bg-white/30"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: notification.duration / 1000, ease: 'linear' }}
          />
        )}

        <div className="p-4">
          <div className="flex items-start gap-3">
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              {getIcon()}
            </motion.div>
            
            <div className="flex-1">
              <motion.h4
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-semibold"
              >
                {notification.title}
              </motion.h4>
              {notification.message && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm mt-1 opacity-90"
                >
                  {notification.message}
                </motion.p>
              )}
              {notification.action && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={notification.action.onClick}
                  className="mt-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium"
                >
                  {notification.action.label}
                </motion.button>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Main Notification Container
export function AnimatedNotification({
  notifications,
  position = 'top-right',
  onClose,
  maxVisible = 5,
}: AnimatedNotificationProps) {
  const getPositionStyles = () => {
    switch (position) {
      case 'top-right': return 'top-4 right-4';
      case 'top-left': return 'top-4 left-4';
      case 'bottom-right': return 'bottom-4 right-4';
      case 'bottom-left': return 'bottom-4 left-4';
      case 'top-center': return 'top-4 left-1/2 -translate-x-1/2';
      case 'bottom-center': return 'bottom-4 left-1/2 -translate-x-1/2';
    }
  };

  const visibleNotifications = notifications.slice(-maxVisible);

  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className={`fixed ${getPositionStyles()} z-50 pointer-events-none`}>
      <AnimatePresence mode="sync">
        <div className="space-y-3 pointer-events-auto">
          {visibleNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onClose={() => onClose(notification.id)}
            />
          ))}
        </div>
      </AnimatePresence>
    </div>,
    document.body
  );
}

// Toast variant (simpler API)
export function AnimatedToast() {
  const { notifications, notify } = useNotifications();

  return (
    <AnimatedNotification
      notifications={notifications}
      onClose={(id) => notify.remove(id)}
      position="top-right"
    />
  );
}