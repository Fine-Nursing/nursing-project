import React from 'react';
import { X } from 'lucide-react';

interface ModalHeaderProps {
  onClose: () => void;
}

export default function ModalHeader({ onClose }: ModalHeaderProps) {
  return (
    <div className="relative bg-gradient-to-r from-teal-400 to-emerald-500 p-6 text-white">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Close modal"
      >
        <X className="w-5 h-5" />
      </button>
      <h2 className="text-2xl font-bold">Join Our Community</h2>
      <p className="text-emerald-50 mt-1">Start your nursing career journey today</p>
    </div>
  );
}