import { useState, useRef, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Search } from 'lucide-react';

interface CustomDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  disabled?: boolean;
  className?: string;
  maxHeight?: string;
  icon?: React.ReactNode;
}

export default function CustomDropdown({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  searchable = false,
  disabled = false,
  className = '',
  maxHeight = 'max-h-64',
  icon
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search
  const filteredOptions = searchable
    ? options.filter(option => 
        option.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-3 py-2 text-left bg-white border-2 rounded-lg
          flex items-center justify-between gap-2
          transition-all duration-200 text-sm
          ${disabled 
            ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60' 
            : isOpen
              ? 'border-slate-600 ring-4 ring-slate-600/10'
              : 'border-gray-200 hover:border-slate-300'
          }
        `}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {icon && (
            <div className="text-slate-600 flex-shrink-0">
              {icon}
            </div>
          )}
          <span className={`truncate ${value ? 'text-gray-900' : 'text-gray-400'}`}>
            {value || placeholder}
          </span>
        </div>
        <m.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </m.div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl overflow-hidden"
            onKeyDown={handleKeyDown}
          >
            {/* Search Input */}
            {searchable && (
              <div className="p-3 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20"
                  />
                </div>
              </div>
            )}

            {/* Options List */}
            <div className={`overflow-y-auto ${maxHeight}`}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <m.button
                    key={option}
                    type="button"
                    onClick={() => handleSelect(option)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.01 }}
                    className={`
                      w-full px-4 py-2.5 text-left flex items-center justify-between text-sm
                      transition-colors duration-150
                      ${value === option 
                        ? 'bg-slate-50 text-slate-900 font-medium' 
                        : 'hover:bg-gray-50 text-gray-700'
                      }
                    `}
                  >
                    <span className="truncate pr-2">{option}</span>
                    {value === option && (
                      <m.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      >
                        <Check className="w-4 h-4 text-slate-600 flex-shrink-0" />
                      </m.div>
                    )}
                  </m.button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  No options found
                </div>
              )}
            </div>

            {/* Options count */}
            {filteredOptions.length > 5 && (
              <div className="px-3 py-2 text-xs text-gray-500 text-center border-t border-gray-100">
                {filteredOptions.length} options available
              </div>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}