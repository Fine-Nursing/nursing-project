'use client';

import React from 'react';
import { m, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <m.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Background Overlay */}
            <m.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              type="button"
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity cursor-default"
              onClick={onClose}
              aria-label="Close modal"
            />

            {/* Modal Content */}
            <m.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative bg-gradient-to-br from-white to-primary-50 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-primary-100"
            >
              {/* Close Button */}
              <m.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-primary-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary-100 transition-all"
                aria-label="Close"
              >
                ×
              </m.button>

              {children}
            </m.div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}