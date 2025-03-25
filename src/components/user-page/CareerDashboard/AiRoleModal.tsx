// components/CareerDashboard/AiRoleModal.tsx
import React from 'react';
import { X as CloseIcon } from 'lucide-react';

interface AiRoleModalProps {
  reason: string | null; // "setAiReason"으로 관리
  onClose: () => void;
}

export default function AiRoleModal({ reason, onClose }: AiRoleModalProps) {
  if (!reason) return null; // 모달 표시 안 함

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white p-4 rounded-lg shadow-md w-80 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
        <h3 className="text-teal-600 font-bold text-lg mb-2">AI Suggestion</h3>
        <p className="text-sm text-gray-700">{reason}</p>
        <div className="mt-3 text-right">
          <button
            type="button"
            onClick={onClose}
            className="bg-teal-500 text-white px-3 py-1.5 rounded hover:bg-teal-600"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
