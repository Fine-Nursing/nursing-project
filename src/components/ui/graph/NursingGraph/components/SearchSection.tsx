import React from 'react';
import { Search } from 'lucide-react';
import { AnimatePresence, m } from 'framer-motion';
import type { SearchSectionProps } from '../types';
import { highlightMatch } from '../utils';

export function SearchSection({
  searchTerm,
  debouncedSearchTerm,
  showSuggestions,
  suggestions,
  isLoadingSuggestions,
  selectedSuggestionIndex,
  onSearchChange,
  onKeyDown,
  onFocus,
  onSelectSuggestion,
  onSetSelectedSuggestionIndex,
  searchInputRef,
  suggestionsRef,
}: SearchSectionProps) {
  return (
    <div className="flex-1 min-w-0 relative z-50">
      <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
        Search Specialties
      </label>
      <div className="relative z-50">
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search specialties..."
          value={searchTerm}
          onChange={onSearchChange}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          className="w-full px-3 sm:px-4 py-2 rounded-xl border border-blue-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400 pl-9 sm:pl-10 text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-400 shadow-sm transition-all duration-200 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-md"
        />
        <Search
          className="absolute left-2.5 sm:left-3 top-2.5 text-blue-400"
          size={16}
        />
        
        {/* Loading indicator */}
        {searchTerm !== debouncedSearchTerm && (
          <div className="absolute right-3 top-3">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      <AnimatePresence>
        {showSuggestions && (searchTerm.length >= 1 || !searchTerm) && (
          <m.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-[9999] w-full mt-1 bg-white/95 dark:bg-zinc-950 backdrop-blur-md rounded-xl shadow-2xl border border-blue-200 dark:border-zinc-700 max-h-64 overflow-y-auto"
            role="listbox"
          >
            <SuggestionContent
              isLoadingSuggestions={isLoadingSuggestions}
              suggestions={suggestions}
              searchTerm={searchTerm}
              selectedSuggestionIndex={selectedSuggestionIndex}
              onSelectSuggestion={onSelectSuggestion}
              onSetSelectedSuggestionIndex={onSetSelectedSuggestionIndex}
            />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface SuggestionContentProps {
  isLoadingSuggestions: boolean;
  suggestions: string[] | undefined;
  searchTerm: string;
  selectedSuggestionIndex: number;
  onSelectSuggestion: (suggestion: string) => void;
  onSetSelectedSuggestionIndex: (index: number) => void;
}

function SuggestionContent({
  isLoadingSuggestions,
  suggestions,
  searchTerm,
  selectedSuggestionIndex,
  onSelectSuggestion,
  onSetSelectedSuggestionIndex,
}: SuggestionContentProps) {
  if (isLoadingSuggestions) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-zinc-300">
        <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-zinc-300">
        No specialties found
      </div>
    );
  }

  return (
    <ul className="py-1" role="listbox">
      {suggestions.slice(0, 8).map((suggestion, index) => {
        const isSelected = index === selectedSuggestionIndex;
        const { beforeMatch, match, afterMatch } = highlightMatch(suggestion, searchTerm);

        let className = 'px-4 py-2 cursor-pointer transition-colors';
        if (isSelected) {
          className += ' bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300';
        } else {
          className += ' hover:bg-gray-50 dark:hover:bg-zinc-900 text-gray-700 dark:text-zinc-300';
        }

        return (
          <li
            key={suggestion}
            role="option"
            aria-selected={isSelected}
            tabIndex={0}
            className={className}
            onClick={() => onSelectSuggestion(suggestion)}
            onMouseEnter={() => onSetSelectedSuggestionIndex(index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectSuggestion(suggestion);
              }
            }}
          >
            <span>
              {beforeMatch}
              <strong className="font-semibold">{match}</strong>
              {afterMatch}
            </span>
          </li>
        );
      })}
    </ul>
  );
}