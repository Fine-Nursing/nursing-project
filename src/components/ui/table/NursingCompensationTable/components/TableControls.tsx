import { m } from 'framer-motion';
import { Settings2, Layout, List } from 'lucide-react';
import type { TableControlsProps } from '../types';

export function TableControls({
  viewMode,
  onViewModeChange,
  showCustomize,
  onShowCustomizeChange,
}: TableControlsProps) {
  return (
    <m.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="hidden md:flex justify-between items-center"
    >
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => onShowCustomizeChange(!showCustomize)}
          className="inline-flex items-center px-3 py-2 border border-emerald-200 rounded-xl shadow-sm text-sm font-medium text-emerald-700 bg-white/80 backdrop-blur-sm hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200"
        >
          <Settings2 className="w-4 h-4 mr-2" />
          Customize Columns
        </button>
        <div className="flex rounded-md shadow-sm">
          <button
            type="button"
            onClick={() => onViewModeChange('table')}
            className={`px-3 py-2 rounded-l-xl border text-sm font-medium transition-all duration-200 ${
              viewMode === 'table'
                ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-300 shadow-sm'
                : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 bg-white/80 backdrop-blur-sm'
            }`}
          >
            <Layout className="w-4 h-4 inline mr-2" />
            Table
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('compact')}
            className={`px-3 py-2 rounded-r-xl border text-sm font-medium transition-all duration-200 ${
              viewMode === 'compact'
                ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-300 shadow-sm'
                : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 bg-white/80 backdrop-blur-sm'
            }`}
          >
            <List className="w-4 h-4 inline mr-2" />
            Compact
          </button>
        </div>
      </div>
    </m.div>
  );
}