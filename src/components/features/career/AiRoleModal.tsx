import React from 'react';
import { X as CloseIcon } from 'lucide-react';

interface AiRoleModalProps {
  reason: string | null;
  onClose: () => void;
  theme: 'light' | 'dark'; // theme prop 추가
}

export default function AiRoleModal({
  reason,
  onClose,
  theme,
}: AiRoleModalProps) {
  if (!reason) return null;

  // theme에 따른 동적 클래스 적용
  const bgColor = theme === 'light' ? 'bg-white' : 'bg-slate-800';
  const textColor = theme === 'light' ? 'text-gray-700' : 'text-gray-200';
  const closeButtonColor =
    theme === 'light'
      ? 'text-gray-400 hover:text-gray-600'
      : 'text-gray-500 hover:text-gray-300';

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className={`${bgColor} p-4 rounded-lg shadow-md w-80 relative`}>
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-2 right-2 ${closeButtonColor}`}
        >
          <CloseIcon className="w-5 h-5" />
        </button>
        <h3 className="text-slate-600 font-bold text-lg mb-2">AI Suggestion</h3>
        <p className={`text-sm ${textColor}`}>{reason}</p>
        <div className="mt-3 text-right">
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-500 text-white px-3 py-1.5 rounded hover:bg-slate-600"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
