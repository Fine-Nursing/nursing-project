import { m } from 'framer-motion';
import { Edit2, Check, X } from 'lucide-react';
import { useState } from 'react';
import CustomDropdown from './CustomDropdown';

interface SummaryItem {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  options?: string[];
  inputType?: 'text' | 'number' | 'select';
}

interface SummaryCardProps {
  title: string;
  items: SummaryItem[];
  onEdit?: (itemLabel: string, newValue: string) => void;
  className?: string;
}

export default function SummaryCard({
  title,
  items,
  onEdit,
  className = ''
}: SummaryCardProps) {
  const [editingLabel, setEditingLabel] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const handleEditClick = (item: SummaryItem) => {
    setEditingLabel(item.label);
    setEditValue(String(item.value));
  };

  const handleSave = (item: SummaryItem) => {
    if (onEdit) {
      onEdit(item.label, editValue);
    }
    setEditingLabel(null);
  };

  const handleCancel = () => {
    setEditingLabel(null);
    setEditValue('');
  };

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg dark:shadow-slate-900/50 p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <m.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Check className="w-5 h-5 text-green-500" />
        </m.div>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <m.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-700 last:border-0"
          >
            <div className="flex items-center gap-3 flex-1">
              {item.icon && (
                <div className="text-slate-600 dark:text-slate-400">
                  {item.icon}
                </div>
              )}
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                {editingLabel === item.label ? (
                  <div className="flex items-center gap-1 sm:gap-2 mt-1">
                    {item.options ? (
                      <div className="flex-1">
                        <CustomDropdown
                          options={item.options}
                          value={editValue}
                          onChange={setEditValue}
                          searchable={item.options.length > 5}
                          className="text-xs sm:text-sm"
                        />
                      </div>
                    ) : (
                      <input
                        type={item.inputType || 'text'}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSave(item);
                          }
                        }}
                        className="flex-1 px-2 py-1 text-sm sm:text-base border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                        autoFocus
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => handleSave(item)}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                    >
                      <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                ) : (
                  <p className="text-sm sm:text-base font-medium text-gray-900 break-words">{item.value}</p>
                )}
              </div>
            </div>
            
            {onEdit && editingLabel !== item.label && (
              <m.button
                type="button"
                onClick={() => handleEditClick(item)}
                className="p-2 text-gray-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Edit2 className="w-4 h-4" />
              </m.button>
            )}
          </m.div>
        ))}
      </div>
    </m.div>
  );
}