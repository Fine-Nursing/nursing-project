import React from 'react';
import { m } from 'framer-motion';
import { Plus, Filter, SortDesc } from 'lucide-react';

interface CareerControlPanelProps {
  theme: 'light' | 'dark';
  formVisible: boolean;
  setFormVisible: (visible: boolean) => void;
  // filterRole: string;
  // setFilterRole: (filter: string) => void;
  // sortOrder: 'asc' | 'desc';
  // setSortOrder: (order: 'asc' | 'desc') => void;
}

export default function CareerControlPanel({
  theme,
  formVisible,
  setFormVisible,
}: CareerControlPanelProps) {
  return (
    <div className="mb-4">
      {!formVisible && (
        <m.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => setFormVisible(true)}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          Add Work Experience
        </m.button>
      )}
    </div>
  );
}
