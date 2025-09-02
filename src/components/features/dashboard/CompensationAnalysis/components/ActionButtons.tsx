import React from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Save } from 'lucide-react';

interface ActionButtonsProps {
  theme: 'light' | 'dark';
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export function ActionButtons({
  theme,
  isEditing,
  onSave,
  onCancel
}: ActionButtonsProps) {
  return (
    <AnimatePresence>
      {isEditing && (
        <m.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex gap-3 pt-2"
        >
          <button
            onClick={onSave}
            className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
          
          <button
            onClick={onCancel}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
              theme === 'light'
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                : 'bg-slate-700 hover:bg-slate-600 text-gray-300'
            }`}
          >
            Cancel
          </button>
        </m.div>
      )}
    </AnimatePresence>
  );
}export default ActionButtons
