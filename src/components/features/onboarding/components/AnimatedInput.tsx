import { m, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';

interface AnimatedInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  type?: 'text' | 'number' | 'email' | 'password';
  error?: string;
  success?: boolean;
  required?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: string;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  autoFocus?: boolean;
}

export default function AnimatedInput({
  value,
  onChange,
  placeholder,
  label,
  type = 'text',
  error,
  success,
  required = false,
  disabled = false,
  icon,
  maxLength,
  min,
  max,
  step,
  onKeyPress,
  className = '',
  autoFocus = false
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <m.label
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </m.label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {icon}
          </div>
        )}

        <m.input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyPress={onKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          min={min}
          max={max}
          step={step}
          autoFocus={autoFocus}
          className={`
            w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
            ${icon ? 'pl-12' : ''}
            ${error 
              ? 'border-red-500 focus:border-red-500' 
              : success 
                ? 'border-green-500 focus:border-green-500'
                : isFocused
                  ? 'border-slate-600 dark:border-slate-400'
                  : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
            }
            ${disabled ? 'bg-gray-50 dark:bg-slate-900 cursor-not-allowed' : 'bg-white dark:bg-slate-800'}
            text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-4 
            ${error 
              ? 'focus:ring-red-500/10' 
              : success
                ? 'focus:ring-green-500/10'
                : 'focus:ring-slate-600/10'
            }
          `}
          whileFocus={{ scale: 1.01 }}
        />

        {/* Status icon */}
        <AnimatePresence>
          {(error || success) && (
            <m.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {error ? (
                <AlertCircle className="w-5 h-5 text-red-500" />
              ) : (
                <Check className="w-5 h-5 text-green-500" />
              )}
            </m.div>
          )}
        </AnimatePresence>

        {/* Character count */}
        {maxLength && (
          <div className="absolute right-3 bottom-[-20px] text-xs text-gray-400 dark:text-gray-500">
            {value.length}/{maxLength}
          </div>
        )}
      </div>

      {/* Error/Success message */}
      <AnimatePresence>
        {error && (
          <m.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 text-sm text-red-500"
          >
            {error}
          </m.p>
        )}
      </AnimatePresence>

    </div>
  );
}