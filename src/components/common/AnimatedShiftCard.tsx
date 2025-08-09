'use client';

import { useState } from 'react';
import type { PanInfo } from 'framer-motion';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Sun, Moon, Clock, DollarSign, MapPin, Users, AlertCircle, Calendar } from 'lucide-react';

interface ShiftData {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'day' | 'night' | 'evening';
  department: string;
  location: string;
  rate: number;
  staffCount?: number;
  isUrgent?: boolean;
  notes?: string;
}

interface AnimatedShiftCardProps {
  shift: ShiftData;
  onAccept?: (shift: ShiftData) => void;
  onDecline?: (shift: ShiftData) => void;
  onFlip?: (shift: ShiftData) => void;
  variant?: 'default' | 'swipeable' | 'flippable';
  className?: string;
}

export function AnimatedShiftCard({
  shift,
  onAccept,
  onDecline,
  onFlip,
  variant = 'default',
  className = '',
}: AnimatedShiftCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);
  
  const getShiftIcon = () => {
    switch (shift.type) {
      case 'day': return <Sun className="w-5 h-5" />;
      case 'night': return <Moon className="w-5 h-5" />;
      case 'evening': return <Clock className="w-5 h-5" />;
    }
  };

  const getShiftColor = () => {
    switch (shift.type) {
      case 'day': return 'from-yellow-400 to-orange-400';
      case 'night': return 'from-purple-600 to-blue-600';
      case 'evening': return 'from-pink-500 to-rose-500';
    }
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold && onAccept) {
      onAccept(shift);
    } else if (info.offset.x < -threshold && onDecline) {
      onDecline(shift);
    }
    setIsDragging(false);
  };

  const cardContent = (
    <>
      {/* Card Header */}
      <div className={`bg-gradient-to-r ${getShiftColor()} text-white p-4 rounded-t-xl`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getShiftIcon()}
            <span className="font-bold capitalize">{shift.type} Shift</span>
          </div>
          {shift.isUrgent && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-1 bg-red-500 px-2 py-1 rounded-full text-xs"
            >
              <AlertCircle className="w-3 h-3" />
              Urgent
            </motion.div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3">
        {/* Date and Time */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 text-gray-700"
        >
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="font-medium">{shift.date}</span>
          <span className="text-sm text-gray-500">
            {shift.startTime} - {shift.endTime}
          </span>
        </motion.div>

        {/* Department */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 text-gray-700"
        >
          <MapPin className="w-4 h-4 text-gray-500" />
          <span>{shift.department}</span>
          {shift.location && (
            <span className="text-sm text-gray-500">• {shift.location}</span>
          )}
        </motion.div>

        {/* Rate */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2"
        >
          <DollarSign className="w-4 h-4 text-green-500" />
          <span className="text-2xl font-bold text-green-600">${shift.rate}</span>
          <span className="text-sm text-gray-500">/hour</span>
        </motion.div>

        {/* Staff Count */}
        {shift.staffCount !== undefined && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 text-gray-700"
          >
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{shift.staffCount} nurses needed</span>
          </motion.div>
        )}

        {/* Action Buttons */}
        {variant === 'default' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-2 pt-2"
          >
            {onAccept && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onAccept(shift)}
                className="flex-1 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600"
              >
                Accept
              </motion.button>
            )}
            {onDecline && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDecline(shift)}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
              >
                Decline
              </motion.button>
            )}
          </motion.div>
        )}
      </div>
    </>
  );

  // Swipeable variant
  if (variant === 'swipeable') {
    return (
      <motion.div
        className={`relative ${className}`}
        style={{ x, rotate, opacity }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        whileHover={!isDragging ? { scale: 1.02 } : {}}
        whileTap={{ scale: 0.98 }}
      >
        {/* Swipe indicators */}
        <motion.div
          className="absolute inset-0 bg-green-500 rounded-xl flex items-center justify-start pl-8"
          style={{
            opacity: useTransform(x, [0, 100], [0, 1]),
          }}
        >
          <span className="text-white font-bold text-2xl">ACCEPT</span>
        </motion.div>
        <motion.div
          className="absolute inset-0 bg-red-500 rounded-xl flex items-center justify-end pr-8"
          style={{
            opacity: useTransform(x, [-100, 0], [1, 0]),
          }}
        >
          <span className="text-white font-bold text-2xl">DECLINE</span>
        </motion.div>

        <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
          {cardContent}
        </div>
      </motion.div>
    );
  }

  // Flippable variant
  if (variant === 'flippable') {
    return (
      <motion.div
        className={`relative ${className}`}
        style={{ perspective: 1000 }}
        whileHover={{ scale: 1.02 }}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative"
        >
          {/* Front side */}
          <div
            style={{ backfaceVisibility: 'hidden' }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {cardContent}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsFlipped(!isFlipped);
                onFlip?.(shift);
              }}
              className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-full shadow-md"
            >
              <AlertCircle className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Back side */}
          <div
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
            }}
            className="bg-white rounded-xl shadow-lg overflow-hidden p-6"
          >
            <h3 className="font-bold text-lg mb-4">Additional Details</h3>
            {shift.notes && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Notes:</h4>
                <p className="text-gray-600 text-sm">{shift.notes}</p>
              </div>
            )}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Hours:</span>
                <span className="font-medium">8 hours</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Pay:</span>
                <span className="font-medium text-green-600">${shift.rate * 8}</span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full mt-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium"
            >
              Back
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
    >
      {cardContent}
    </motion.div>
  );
}