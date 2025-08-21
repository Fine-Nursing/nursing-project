import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface SelectionCardProps {
  value: string;
  label: string;
  description?: string;
  isSelected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export default function SelectionCard({
  value,
  label,
  description,
  isSelected,
  onClick,
  icon,
  disabled = false,
  className = ''
}: SelectionCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-full text-left p-3 rounded-xl border-2 transition-all
        ${isSelected 
          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-md dark:border-emerald-400' 
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-sm'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      layout
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            {icon && (
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: isSelected ? 360 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0"
              >
                {icon}
              </motion.div>
            )}
            <h3 className={`text-sm font-medium ${isSelected ? 'text-emerald-900 dark:text-emerald-100' : 'text-gray-900 dark:text-gray-100'}`}>
              {label}
            </h3>
          </div>
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 ml-9">
              {description}
            </p>
          )}
        </div>
        
        {/* Checkmark animation */}
        <motion.div
          initial={false}
          animate={{ 
            scale: isSelected ? 1 : 0,
            rotate: isSelected ? 0 : -180
          }}
          transition={{ 
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
          className="flex-shrink-0 ml-3"
        >
          <div className="w-6 h-6 bg-emerald-600 dark:bg-emerald-500 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        </motion.div>
      </div>

    </motion.button>
  );
}